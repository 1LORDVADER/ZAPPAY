import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { NavHeader } from '@/components/NavHeader';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <NavHeader />
      <div className="container mx-auto px-4 py-12 max-w-4xl">

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last Updated: February 26, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using ZAPPAY ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Age Requirement</h2>
            <p>
              You must be at least 21 years of age to use this Platform. By using the Platform, you represent and warrant that you are at least 21 years old and have the legal capacity to enter into this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Legal Compliance</h2>
            <p>
              Cannabis laws vary by jurisdiction. You are responsible for ensuring that your use of the Platform and purchase of cannabis products complies with all applicable federal, state, and local laws. ZAPPAY operates only in jurisdictions where cannabis is legal under state law.
            </p>
            <p className="mt-4">
              <strong>Important:</strong> Cannabis remains illegal under federal law (Controlled Substances Act). ZAPPAY does not facilitate interstate commerce or sales in jurisdictions where cannabis is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Platform Services</h2>
            <p>
              ZAPPAY provides a marketplace platform connecting licensed cannabis farmers with consumers through verified dispensaries. We facilitate transactions but do not directly sell, distribute, or handle cannabis products.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>All farmers and dispensaries must maintain valid state licenses</li>
              <li>All products must comply with state testing and labeling requirements</li>
              <li>ZAPPAY charges a 5.2% commission on transactions</li>
              <li>Delivery is handled by licensed transportation services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. User Accounts</h2>
            <p>
              To use certain features of the Platform, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Providing accurate and complete information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Use the Platform for any illegal purpose</li>
              <li>Attempt to purchase cannabis in jurisdictions where it is prohibited</li>
              <li>Provide false information or impersonate another person</li>
              <li>Interfere with or disrupt the Platform's operation</li>
              <li>Attempt to circumvent age verification or location restrictions</li>
              <li>Resell products purchased through the Platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Product Information</h2>
            <p>
              While we strive to provide accurate product information, we do not guarantee the accuracy, completeness, or reliability of any product descriptions, pricing, or availability. All products are subject to availability and may be discontinued without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Payment and Fees</h2>
            <p>
              All prices are in USD and include applicable state and local taxes. ZAPPAY charges a 5.2% platform fee on all transactions. Payment is processed securely through our payment processor. You agree to pay all charges incurred under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Delivery and Returns</h2>
            <p>
              Delivery is provided by licensed transportation services. Delivery times are estimates and not guaranteed. Due to the nature of cannabis products and regulatory requirements, all sales are final. Returns and refunds are handled on a case-by-case basis for defective or damaged products only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Disclaimer of Warranties</h2>
            <p>
              THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. ZAPPAY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Limitation of Liability</h2>
            <p>
              ZAPPAY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE PLATFORM. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO ZAPPAY IN THE PAST 12 MONTHS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless ZAPPAY, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of your use of the Platform or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
            <p>
              ZAPPAY reserves the right to modify these Terms at any time. We will notify users of material changes via email or Platform notification. Continued use of the Platform after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes shall be resolved in the state or federal courts located in California.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:
              <br />
              <strong>Email:</strong> Zappay.co@gmail.com
              <br />
              <strong>Address:</strong> ZAPPAY Inc., California, USA
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
