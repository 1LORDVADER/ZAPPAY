# Legal Requirements Research for ZAPPAY

## Research Date: February 15, 2026

---

## Payment Processor Legal Requirements

### PCI DSS Compliance
- **Applies to:** All businesses accepting credit cards
- **ZAPPAY Status:** Using Stripe (handles PCI compliance)
- **Required Disclosures:**
  - Statement that payment processing is handled by Stripe
  - Link to Stripe's terms of service
  - Security statement about encrypted transactions

### Payment Facilitator Disclosures
- **Transaction Processing:** Must disclose that ZAPPAY facilitates payments between farmers and consumers
- **Commission Structure:** Must clearly state the 5.2% commission rate
- **Payment Flow:** Explain how payments are processed (consumer → ZAPPAY → farmer)
- **Refund Policy:** Clear explanation of refund terms and limitations

### Financial Data Privacy (FTC/CFPB)
- **Privacy Policy Required:** Must explain how payment data is collected, stored, and shared
- **Third-Party Processors:** Must disclose use of Stripe for payment processing
- **Data Security:** Statement about encryption and security measures
- **Breach Notification:** Policy for notifying users of data breaches

---

## Cannabis Marketplace Compliance Requirements

### Age Verification Requirements
- **Minimum Age:** 21+ for recreational, 18+ for medical (state-dependent)
- **Age Gate:** Modal requiring age confirmation before site access
- **ID Verification:** Government-issued ID required for purchases
- **Session Storage:** Remember verification status

### Health and Safety Disclaimers
- **FDA Disclaimer:** "These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease."
- **Medical Consultation:** "Consult a healthcare provider before using cannabis, especially if you have a medical condition or are taking medication."
- **No Medical Claims:** Cannot make health claims unless licensed medical dispensary

### State-Specific Compliance
- **Legal States Only:** Must restrict access to users in legal cannabis states
- **Geolocation Verification:** IP-based location checking
- **State Law Compliance:** "Products are only available in states where cannabis is legal. Your location and age are verified for compliance purposes."
- **Interstate Transport Warning:** "Transporting cannabis across state lines is illegal, even between legal states."

### Product Information Requirements
- **THC/CBD Content:** Must display lab-tested cannabinoid percentages
- **Lab Results (COAs):** Certificates of Analysis should be available
- **Product Standards:** Statement that all products meet state safety and testing requirements
- **Accurate Descriptions:** Product info must match labels and test results

### Licensing Disclosures
- **Platform License:** Display any required marketplace/platform licenses
- **Farmer Verification:** Statement that all farmers are licensed and verified
- **Compliance Statement:** "ZAPPAY operates in full compliance with state and federal cannabis laws."

---

## Required Legal Pages for ZAPPAY

### 1. Terms of Service
Must cover:
- **Platform Description:** ZAPPAY as payment processor and marketplace facilitator
- **User Eligibility:** Age 21+, legal state residency
- **Account Creation:** Registration requirements and responsibilities
- **Payment Processing:** 5.2% commission, Stripe integration, payment flow
- **Pre-Payment Model:** Explanation of farmer pre-payment/crowdfunding for strain growth
- **Prohibited Uses:** Illegal activities, underage access, interstate transport
- **Farmer Terms:** Listing requirements, license verification, payout terms
- **Consumer Terms:** Purchase process, delivery, product quality
- **Liability Limitations:** Platform not responsible for product quality (farmer responsibility)
- **Dispute Resolution:** Process for handling disputes between farmers and consumers
- **Termination:** Conditions under which accounts can be suspended/terminated
- **Governing Law:** Which state laws apply
- **Changes to Terms:** How users will be notified of updates

### 2. Privacy Policy
Must cover:
- **Information Collected:**
  - Personal: Name, email, phone, address, date of birth
  - Payment: Credit card info (processed by Stripe, not stored by ZAPPAY)
  - Location: IP address, geolocation data for compliance
  - Usage: Browsing history, product views, purchase history
- **How Information is Used:**
  - Age and location verification
  - Order processing and fulfillment
  - Customer support
  - Marketing (with opt-out option)
  - Legal compliance
- **Information Sharing:**
  - Stripe (payment processing)
  - Farmers (order fulfillment)
  - Law enforcement (if required)
  - Never sold to third parties
- **Data Security:** Encryption, secure servers, PCI compliance via Stripe
- **Cookies:** Explanation of cookie usage for age verification, preferences
- **User Rights:** Access, correction, deletion of personal data
- **Data Retention:** How long data is kept
- **Children's Privacy:** No collection from users under 21
- **Changes to Policy:** Notification process

### 3. Refund Policy
Must cover:
- **General Rule:** Most cannabis sales are final (state law requirement)
- **Exceptions:**
  - Damaged products
  - Wrong items delivered
  - Quality issues (mold, contamination)
- **Refund Process:**
  - Contact timeframe (e.g., within 24 hours of delivery)
  - Required documentation (photos, order number)
  - Inspection process
  - Refund method (original payment method)
  - Timeframe for refund processing
- **Non-Refundable:** Opened products, products used, buyer's remorse
- **Farmer Responsibility:** Disputes about product quality handled with farmer first

### 4. Age Verification Policy
Must cover:
- **Legal Requirement:** Federal and state law requires 21+ verification
- **Verification Methods:**
  - Age gate on site entry
  - Government-issued ID at delivery
  - Geolocation verification
- **Data Usage:** How age verification data is stored and used
- **Consequences:** Underage users will be denied access/delivery
- **Session Storage:** Verification remembered for session or 30 days (if opted in)

### 5. Prohibited Use Policy
Must cover:
- **Illegal Activities:** No use for illegal purposes
- **Age Restrictions:** No access for users under 21
- **Location Restrictions:** No purchases from illegal states
- **Interstate Transport:** No shipping across state lines
- **Resale:** Terms around reselling products
- **Fraudulent Activity:** Consequences for fraud
- **Account Sharing:** Prohibition on sharing accounts

---

## Additional Required Disclosures

### Footer Disclosures
- **License Numbers:** Display platform license (if required by state)
- **Contact Information:** Physical address, email, phone
- **Operating States:** List of states where ZAPPAY operates
- **Customer Support:** Hours of operation, response time

### Product Page Disclosures
- **Health Warning:** FDA disclaimer on every product page
- **THC Content:** Lab-tested percentages
- **State Limits:** "Products comply with [State] THC limits"
- **Legal Use Only:** "For legal adult use only in states where cannabis is legal"

### Checkout Page Disclosures
- **Final Price:** Total including taxes and fees
- **Commission:** "5.2% platform fee included"
- **Payment Processor:** "Payments processed securely by Stripe"
- **Delivery Restrictions:** "Delivery available only in [list of areas]"
- **ID Requirement:** "Government-issued ID required at delivery"

---

## Compliance Checklist for ZAPPAY

- [x] Age verification gate (21+) - IMPLEMENTED
- [x] Geolocation verification for legal states - IMPLEMENTED
- [ ] Terms of Service page
- [ ] Privacy Policy page
- [ ] Refund Policy page
- [ ] Age Verification Policy page
- [ ] Prohibited Use Policy page
- [ ] FDA disclaimer on product pages
- [ ] THC content disclosure on product pages
- [ ] Lab results (COAs) available for products
- [ ] Stripe payment processor disclosure
- [ ] Commission rate disclosure (5.2%)
- [ ] Contact information in footer
- [ ] License number display (if required)
- [ ] Interstate transport warning
- [ ] Medical consultation disclaimer
- [ ] Cookie policy/notice
- [ ] Data breach notification procedure

---

## Next Steps

1. Create Terms of Service covering payment processing and marketplace operations
2. Create Privacy Policy with Stripe integration and geolocation disclosures
3. Create Refund Policy with cannabis-specific limitations
4. Create Age Verification Policy documenting current implementation
5. Create Prohibited Use Policy
6. Add FDA disclaimer to all product pages
7. Add footer with legal links and contact information
8. Review and update product pages with required disclosures
