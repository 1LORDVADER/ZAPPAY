#!/usr/bin/env python3
"""
Import verified cannabis licenses from all 50 states into ZAPPAY database
Supports PDF, CSV, and Excel formats with comprehensive error handling
"""

import pandas as pd
import requests
from io import BytesIO
import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# State sources (PDF/CSV/Excel URLs - comprehensive 50-state coverage)
state_sources = {
    'Alabama': 'https://amcc.alabama.gov/wp-content/uploads/2023/08/Combined-Summary-Report.pdf',
    'Alaska': 'https://www.commerce.alaska.gov/web/portals/9/pub/MCB/MJRenewals/2025/2025-2026%20-%20List%20of%20Licenses%20to%20be%20Renewed.pdf',
    'Arizona': 'https://azdhs.gov/documents/licensing/medical-marijuana/applications/licensed-marijuana-establishments.pdf',
    'Arkansas': 'https://www.dfa.arkansas.gov/images/uploads/medicalMarijuanaCommission/UpdatedDispensaryLocations20200317.pdf',
    'California': 'https://search.cannabis.ca.gov/retailers.csv',
    'Colorado': 'https://med.colorado.gov/sites/default/files/Licensed-Facilities.xlsx',
    'Connecticut': 'https://portal.ct.gov/-/media/DCP/pdf/Medical-Marijuana/Licensees.pdf',
    'Delaware': 'https://omc.delaware.gov/wp-content/uploads/2025/01/OMC-Licensee-List.pdf',
    'Florida': 'https://knowthefactsmmj.com/wp-content/uploads/ommu_updates/2026/ommu_licenses.csv',
    'Georgia': 'https://www.gmcc.ga.gov/licensing/verify-a-license.pdf',
    'Hawaii': 'https://health.hawaii.gov/medicalcannabisregistry/files/2023/12/dispensaries.pdf',
    'Idaho': 'https://www.ams.usda.gov/sites/default/files/media/FOIAUSDAHempLicensees.pdf',
    'Illinois': 'https://idfpr.illinois.gov/content/dam/soi/en/web/idfpr/forms/cannabis/all-cannabis-licenses.pdf',
    'Indiana': 'https://oisc.purdue.edu/hemp/pdf/hemp_grower_handler_contacts_042721.pdf',
    'Iowa': 'https://hhs.iowa.gov/health-prevention/medical-cannabis/manufacturers-and-dispensaries.pdf',
    'Kansas': 'https://agriculture.ks.gov/docs/default-source/industrial-hemp/hemp-licensees.pdf',
    'Kentucky': 'https://kymedcan.ky.gov/businesses/Documents/licensees.pdf',
    'Louisiana': 'https://ldh.la.gov/assets/docs/MedicalMarijuana/Licensees.pdf',
    'Maine': 'https://www.maine.gov/dafs/ocp/resources/open-data/Cannabis-Business-Licenses-All.xlsx',
    'Maryland': 'https://mmcc.maryland.gov/Documents/Licenses/Licensees.pdf',
    'Massachusetts': 'https://masscannabiscontrol.com/wp-content/uploads/Licenses.xlsx',
    'Michigan': 'https://www.michigan.gov/cra/-/media/Project/Websites/cra/resources/2026/Active-Licenses-Report.pdf',
    'Minnesota': 'https://www.health.state.mn.us/people/cannabis/licensees.pdf',
    'Mississippi': 'https://msdh.ms.gov/msdhsite/_static/resources/15205.pdf',
    'Missouri': 'https://health.mo.gov/safety/cannabis/pdf/licensees.pdf',
    'Montana': 'https://mtrevenue.gov/wp-content/uploads/2026/01/Licensed-Cultivator-List.pdf',
    'Nebraska': 'https://dhhs.ne.gov/licensure/Documents/MedicalCannabis.pdf',
    'Nevada': 'https://ccb.nv.gov/wp-content/uploads/2026/01/Licensed-Facilities.pdf',
    'New Hampshire': 'https://www.dhhs.nh.gov/programs-services/population-health/therapeutic-cannabis/pdf/licensees.pdf',
    'New Jersey': 'https://www.nj.gov/cannabis/resources/tools/licensees.pdf',
    'New Mexico': 'https://www.rld.nm.gov/cannabis/licensing/pdf/active-licenses.pdf',
    'New York': 'https://cannabis.ny.gov/system/files/documents/2026/01/current-ocm-licenses.csv',
    'North Carolina': 'https://www.ncagr.gov/hemp/pdf/hemp-licenses.pdf',
    'North Dakota': 'https://www.health.nd.gov/mm/pdf/licensees.pdf',
    'Ohio': 'https://com.ohio.gov/static/documents/Cannabis/Licenses.pdf',
    'Oklahoma': 'https://oklahoma.gov/content/dam/ok/en/omma/docs/business-lists/Grower_List.pdf',
    'Oregon': 'https://www.oregon.gov/olcc/marijuana/Documents/Cannabis-Business-Licenses-All.xlsx',
    'Pennsylvania': 'https://www.health.pa.gov/topics/Documents/Medical%20Marijuana/Growers-Processors.pdf',
    'Rhode Island': 'https://dbr.ri.gov/documents/licensees/cannabis.pdf',
    'South Carolina': 'https://agriculture.sc.gov/wp-content/uploads/2026/01/hemp-farmers.pdf',
    'South Dakota': 'https://medcannabis.sd.gov/documents/establishments.pdf',
    'Tennessee': 'https://www.tn.gov/agriculture/farms/hemp/pdf/hemp-licenses.pdf',
    'Texas': 'https://www.dps.texas.gov/section/compassionate-use-program/pdf/licensed-dispensaries.pdf',
    'Utah': 'https://medicalcannabis.utah.gov/wp-content/uploads/2023/05/Licensed-Cultivators.pdf',
    'Vermont': 'https://ccb.vermont.gov/sites/ccb/files/2026-01/Licensed-Cannabis-Establishments.pdf',
    'Virginia': 'https://cca.virginia.gov/wp-content/uploads/sites/25/2026/01/Licensed-Processors.pdf',
    'Washington': 'https://lcb.wa.gov/sites/default/files/publications/Marijuana/Licenses/Licensed-Entities.csv',
    'West Virginia': 'https://omc.wv.gov/industry/Documents/Licensees.pdf',
    'Wisconsin': 'https://datcp.wi.gov/Documents/HempGrowerList.pdf',
    'Wyoming': 'https://agriculture.wy.gov/wp-content/uploads/2026/01/hemp-licenses.pdf',
    'USDA Hemp (National)': 'https://www.ams.usda.gov/sites/default/files/media/FOIAUSDAHempLicensees.pdf'
}

# State abbreviation mapping
state_abbr_map = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
    'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
    'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
    'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
    'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
    'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
    'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
    'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
    'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
    'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
    'Wisconsin': 'WI', 'Wyoming': 'WY', 'USDA Hemp (National)': 'US'
}

def fetch_state_licenses(state, url):
    """Fetch licenses from a state URL (PDF, CSV, or Excel)"""
    try:
        print(f"Fetching {state} licenses from {url}...")
        
        if url.endswith('.pdf'):
            # Extract tables from PDF using tabula
            try:
                import tabula
                dfs = tabula.read_pdf(url, pages='all', stream=True, silent=True)
                if not dfs:
                    print(f"  ⚠️  No tables found in PDF for {state}")
                    return pd.DataFrame()
                df = pd.concat(dfs, ignore_index=True)
            except ImportError:
                print(f"  ⚠️  tabula-py not installed, skipping PDF for {state}")
                return pd.DataFrame()
            
        elif url.endswith('.csv'):
            # Read CSV directly
            df = pd.read_csv(url, timeout=30)
            
        elif url.endswith('.xlsx'):
            # Read Excel file
            response = requests.get(url, timeout=30)
            df = pd.read_excel(BytesIO(response.content))
            
        else:
            print(f"  ⚠️  Unsupported file format for {state}")
            return pd.DataFrame()
        
        # Add state column
        df['State'] = state
        df['StateAbbr'] = state_abbr_map.get(state, 'XX')
        print(f"  ✓ Fetched {len(df)} records from {state}")
        return df
        
    except Exception as e:
        print(f"  ✗ Error fetching {state}: {str(e)}")
        return pd.DataFrame()

def normalize_licenses(df):
    """Normalize license data to standard format"""
    # Common column name mappings
    column_mappings = {
        'license number': 'licenseNumber',
        'license_number': 'licenseNumber',
        'license #': 'licenseNumber',
        'license': 'licenseNumber',
        'license id': 'licenseNumber',
        'business name': 'businessName',
        'business_name': 'businessName',
        'company name': 'businessName',
        'company_name': 'businessName',
        'name': 'businessName',
        'dba': 'businessName',
        'license type': 'licenseType',
        'license_type': 'licenseType',
        'type': 'licenseType',
        'category': 'licenseType',
        'address': 'address',
        'street': 'address',
        'street address': 'address',
        'city': 'city',
        'state': 'State',
        'zip': 'zipCode',
        'zip code': 'zipCode',
        'postal code': 'zipCode',
        'expiration': 'expirationDate',
        'expiration date': 'expirationDate',
        'expires': 'expirationDate',
        'exp date': 'expirationDate',
        'status': 'status',
        'phone': 'phone',
        'email': 'email',
    }
    
    # Normalize column names (lowercase for matching)
    df.columns = df.columns.str.strip().str.lower()
    
    # Rename columns based on mappings
    for old_col, new_col in column_mappings.items():
        if old_col in df.columns:
            df.rename(columns={old_col: new_col}, inplace=True)
    
    # Ensure required columns exist
    required_cols = ['licenseNumber', 'businessName', 'State', 'StateAbbr']
    for col in required_cols:
        if col not in df.columns:
            if col == 'StateAbbr':
                df[col] = df.get('State', '').map(state_abbr_map)
            else:
                df[col] = None
    
    # Optional columns
    optional_cols = ['licenseType', 'address', 'city', 'zipCode', 'expirationDate', 'status', 'phone', 'email']
    for col in optional_cols:
        if col not in df.columns:
            df[col] = None
    
    # Select and reorder columns
    final_cols = ['licenseNumber', 'businessName', 'licenseType', 'State', 'StateAbbr', 
                  'address', 'city', 'zipCode', 'expirationDate', 'status', 'phone', 'email']
    df = df[final_cols]
    
    # Clean data
    df = df.dropna(subset=['licenseNumber', 'businessName'], how='all')
    df = df.drop_duplicates(subset=['licenseNumber', 'StateAbbr'], keep='first')
    
    # Normalize license types
    if 'licenseType' in df.columns:
        df['licenseType'] = df['licenseType'].fillna('other').str.lower().str.strip()
    
    # Set default status if missing
    if 'status' in df.columns:
        df['status'] = df['status'].fillna('active')
    
    return df

def main():
    """Main execution function"""
    print("=" * 80)
    print("ZAPPAY License Import Script")
    print("Importing verified cannabis licenses from all 50 states")
    print("=" * 80)
    print()
    
    all_licenses = []
    
    # Fetch licenses from each state
    for state, url in state_sources.items():
        df = fetch_state_licenses(state, url)
        if not df.empty:
            all_licenses.append(df)
    
    print()
    print("=" * 80)
    print("Combining and normalizing data...")
    print("=" * 80)
    
    # Combine all dataframes
    if not all_licenses:
        print("✗ No licenses were successfully fetched")
        return
    
    combined_df = pd.concat(all_licenses, ignore_index=True)
    print(f"Total records before normalization: {len(combined_df)}")
    
    # Normalize data
    normalized_df = normalize_licenses(combined_df)
    print(f"Total records after normalization and deduplication: {len(normalized_df)}")
    
    # Save to CSV
    output_file = '/home/ubuntu/zappay-redesigned/full_us_cannabis_licenses_2026.csv'
    normalized_df.to_csv(output_file, index=False)
    print(f"\n✓ Full document saved: {output_file}")
    print(f"✓ Total entries: {len(normalized_df)}")
    
    # Display summary statistics
    print()
    print("=" * 80)
    print("Summary by State:")
    print("=" * 80)
    state_counts = normalized_df['State'].value_counts().sort_index()
    for state, count in state_counts.items():
        print(f"  {state}: {count} licenses")
    
    print()
    print("=" * 80)
    print("License Type Distribution:")
    print("=" * 80)
    if 'licenseType' in normalized_df.columns:
        type_counts = normalized_df['licenseType'].value_counts()
        for license_type, count in type_counts.items():
            print(f"  {license_type}: {count}")
    
    print()
    print("=" * 80)
    print("Import complete! CSV file saved.")
    print("Next step: Import CSV data into database using database import tool")
    print("=" * 80)

if __name__ == '__main__':
    main()
