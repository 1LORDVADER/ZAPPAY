import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last Updated: February 26, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              ZAPPAY ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Personal Information</h3>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Name, email address, phone number</li>
              <li>Delivery address</li>
              <li>Date of birth (for age verification)</li>
              <li>Government-issued ID (for age verification)</li>
              <li>Payment information</li>
              <li>Medical cannabis card information (if applicable)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>IP address and geolocation data</li>
              <li>Device information and browser type</li>
              <li>Usage data and browsing history on our Platform</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Transaction Information</h3>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Purchase history and order details</li>
              <li>Product preferences and reviews</li>
              <li>Communication with farmers and dispensaries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Verify your age and legal eligibility to purchase cannabis</li>
              <li>Verify your location to ensure compliance with state laws</li>
              <li>Communicate with you about orders, products, and services</li>
              <li>Improve and personalize your experience on the Platform</li>
              <li>Detect and prevent fraud and abuse</li>
              <li>Comply with legal obligations and regulatory requirements</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Service Providers</h3>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Licensed farmers and dispensaries to fulfill your orders</li>
              <li>Licensed transportation services for delivery</li>
              <li>Payment processors for transaction processing</li>
              <li>Age verification services</li>
              <li>Cloud hosting and data storage providers</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Legal Requirements</h3>
            <p className="mt-4">
              We may disclose your information if required by law, regulation, legal process, or governmental request, including:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>State cannabis regulatory agencies</li>
              <li>Law enforcement agencies</li>
              <li>Tax authorities</li>
              <li>Courts and legal proceedings</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Business Transfers</h3>
            <p className="mt-4">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure payment processing</li>
              <li>Regular security audits and assessments</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Provide our services</li>
              <li>Comply with legal and regulatory requirements (typically 7 years for transaction records)</li>
              <li>Resolve disputes and enforce our agreements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Access and review your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>Opt out of marketing communications</li>
              <li>Disable cookies in your browser settings</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at Zappay.co@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze usage patterns and improve our Platform</li>
              <li>Deliver personalized content and advertisements</li>
              <li>Detect and prevent fraud</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings, but disabling cookies may limit your ability to use certain features of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Third-Party Links</h2>
            <p>
              Our Platform may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
            <p>
              Our Platform is not intended for individuals under 21 years of age. We do not knowingly collect information from anyone under 21. If we become aware that we have collected information from someone under 21, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. State-Specific Rights</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">California Residents (CCPA)</h3>
            <p>California residents have additional rights, including:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to non-discrimination for exercising privacy rights</li>
            </ul>
            <p className="mt-4">
              <strong>Note:</strong> ZAPPAY does not sell your personal information.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Other States</h3>
            <p className="mt-4">
              Residents of other states may have similar rights under applicable state privacy laws. Please contact us to exercise your rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new Privacy Policy on the Platform and updating the "Last Updated" date. Your continued use of the Platform after changes constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
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
