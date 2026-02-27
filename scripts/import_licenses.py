#!/usr/bin/env python3
"""
Import verified cannabis licenses from all 50 states into ZAPPAY database.
Based on user-provided script for aggregating licenses from state sources.
"""

import pandas as pd
import requests
from io import StringIO
import mysql.connector
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection
def get_db_connection():
    db_url = os.getenv('DATABASE_URL')
    # Parse DATABASE_URL format: mysql://user:password@host:port/database
    parts = db_url.replace('mysql://', '').split('@')
    user_pass = parts[0].split(':')
    host_db = parts[1].split('/')
    host_port = host_db[0].split(':')
    
    return mysql.connector.connect(
        host=host_port[0],
        port=int(host_port[1]) if len(host_port) > 1 else 3306,
        user=user_pass[0],
        password=user_pass[1],
        database=host_db[1]
    )

# Function to fetch/parse license data
def fetch_state_list(state, url):
    """Fetch license data from state source URLs"""
    try:
        if url.endswith('.csv'):
            response = requests.get(url, timeout=30)
            return pd.read_csv(StringIO(response.text))
        elif url.endswith('.pdf'):
            # Note: Requires tabula-py package
            try:
                import tabula
                dfs = tabula.read_pdf(url, pages='all')
                return pd.concat(dfs, ignore_index=True)
            except ImportError:
                print(f"Warning: tabula-py not installed, skipping PDF for {state}")
                return pd.DataFrame()
        return pd.DataFrame()
    except Exception as e:
        print(f"Error fetching data for {state}: {e}")
        return pd.DataFrame()

# State license source URLs (expandable to all 50 states)
state_urls = {
    'AL': 'https://amcc.alabama.gov/wp-content/uploads/2023/08/Combined-Summary-Report.pdf',
    'AK': 'https://www.commerce.alaska.gov/web/Portals/9/pub/MCB/MJRenewals/2025/2025-2026%20-%20List%20of%20Licenses%20to%20be%20Renewed.pdf',
    'AZ': 'https://www.azdhs.gov/documents/licensing/medical-marijuana/applications/licensed-marijuana-establishments.pdf',
    'AR': 'https://www.dfa.arkansas.gov/wp-content/uploads/Est.OperationsReportUpload_.pdf',
    # Add remaining 46 states here
    # 'CA': 'https://search.cannabis.ca.gov/retailers',
    # ... etc
}

def normalize_license_data(df, state):
    """Normalize license data to match database schema"""
    # Map common column names to our schema
    column_mapping = {
        'License Number': 'license_number',
        'Business Name': 'business_name',
        'License Type': 'license_type',
        'Status': 'status',
        'Issue Date': 'issue_date',
        'Expiration Date': 'expiration_date',
        'Address': 'address',
        'City': 'city',
        'Zip': 'zip_code',
        'Phone': 'phone',
        'Email': 'email',
    }
    
    # Rename columns if they exist
    df = df.rename(columns=column_mapping)
    
    # Add state column
    df['state'] = state
    
    # Map license types to our enum
    license_type_mapping = {
        'cultivator': 'cultivator',
        'grower': 'cultivator',
        'dispensary': 'dispensary',
        'retail': 'dispensary',
        'transporter': 'transporter',
        'processor': 'processor',
        'testing': 'testing_lab',
    }
    
    if 'license_type' in df.columns:
        df['license_type'] = df['license_type'].str.lower().map(
            lambda x: next((v for k, v in license_type_mapping.items() if k in str(x).lower()), 'other')
        )
    else:
        df['license_type'] = 'other'
    
    return df

def import_licenses():
    """Main function to import all licenses"""
    print("Starting license import process...")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    total_imported = 0
    total_skipped = 0
    
    for state, url in state_urls.items():
        print(f"\nProcessing {state}...")
        
        # Fetch data
        df = fetch_state_list(state, url)
        
        if df.empty:
            print(f"  No data found for {state}")
            continue
        
        # Normalize data
        df = normalize_license_data(df, state)
        
        # Insert into database
        for _, row in df.iterrows():
            try:
                cursor.execute("""
                    INSERT INTO verified_licenses 
                    (license_number, business_name, license_type, state, status, 
                     issue_date, expiration_date, address, city, zip_code, phone, email, source_url)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                    business_name = VALUES(business_name),
                    status = VALUES(status),
                    updated_at = CURRENT_TIMESTAMP
                """, (
                    row.get('license_number'),
                    row.get('business_name'),
                    row.get('license_type', 'other'),
                    row.get('state'),
                    row.get('status', 'active'),
                    row.get('issue_date'),
                    row.get('expiration_date'),
                    row.get('address'),
                    row.get('city'),
                    row.get('zip_code'),
                    row.get('phone'),
                    row.get('email'),
                    url
                ))
                total_imported += 1
            except Exception as e:
                print(f"  Error importing license: {e}")
                total_skipped += 1
        
        conn.commit()
        print(f"  Imported {len(df)} licenses from {state}")
    
    cursor.close()
    conn.close()
    
    print(f"\n✅ Import complete!")
    print(f"Total imported: {total_imported}")
    print(f"Total skipped: {total_skipped}")

if __name__ == '__main__':
    import_licenses()
