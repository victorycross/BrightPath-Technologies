import React from 'react'
import { Link } from 'react-router-dom'

function Section({ number, title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        {number}. {title}
      </h2>
      <div className="text-gray-700 leading-relaxed space-y-3">{children}</div>
    </div>
  )
}

function PrivacyPolicy() {
  return (
    <div className="animate-fade-in pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">

          <div className="bg-white rounded-2xl border border-black/10 p-8 md:p-10">
            <header className="mb-10 pb-6 border-b border-black/10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
              <p className="text-xs text-gray-400">Effective Date: March 2026</p>
              <p className="text-xs text-gray-400 mt-1">
                BrightPath Technologies &mdash; Toronto, Ontario, Canada
              </p>
            </header>

            <Section number={1} title="Introduction">
              <p>
                BrightPath Technologies ("we", "our", "us") is committed to protecting personal information in
                accordance with the <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA)
                and applicable Ontario privacy legislation.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, and protect personal information obtained through
                our website at brightpathtechnology.io and any associated tools or services.
              </p>
            </Section>

            <Section number={2} title="Information We Collect">
              <p>We may collect the following categories of personal information:</p>
              <ul className="list-none space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">(a)</span>
                  <span>
                    <strong>Contact information</strong> you provide voluntarily via our enquiry form: your name,
                    email address, organisation name, and the content of your message.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">(b)</span>
                  <span>
                    <strong>Technical data</strong> collected automatically by our hosting providers (Vercel,
                    GitHub Pages) such as IP address, browser type, referring URL, and pages visited. We do not
                    use tracking pixels or third-party advertising cookies.
                  </span>
                </li>
              </ul>
            </Section>

            <Section number={3} title="How We Use Your Information">
              <p>We use personal information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>To respond to your enquiry and provide requested services;</li>
                <li>To improve and develop our services;</li>
                <li>To comply with our legal and regulatory obligations.</li>
              </ul>
              <p>
                We do not use your personal information for unsolicited marketing communications. Any commercial
                electronic messages we send are consistent with Canada's <em>Anti-Spam Legislation</em> (CASL).
              </p>
            </Section>

            <Section number={4} title="Sharing Your Information">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share personal
                information with:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  Hosting and infrastructure providers (Vercel, GitHub) under applicable data processing
                  agreements, solely to operate our website;
                </li>
                <li>Legal authorities where disclosure is required by law or court order.</li>
              </ul>
            </Section>

            <Section number={5} title="Artificial Intelligence Tools">
              <p>
                Our Persona-X advisory tools (advisors.brightpathtechnology.io) process the information you
                enter in order to generate AI-assisted responses. This information is transmitted to{' '}
                <strong>Anthropic, PBC</strong> (United States) for processing via their API under their
                applicable privacy and security terms.
              </p>
              <p>
                By using these tools, you consent to this cross-border transfer and processing. Please{' '}
                <strong>do not enter sensitive personal, financial, health, or confidential business
                information</strong> into these tools.
              </p>
            </Section>

            <Section number={6} title="Your Rights Under PIPEDA">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Access the personal information we hold about you;</li>
                <li>Request correction of inaccurate or incomplete information;</li>
                <li>
                  Withdraw consent to the collection and use of your personal information (subject to legal
                  or contractual obligations);
                </li>
                <li>
                  Lodge a complaint with the{' '}
                  <a
                    href="https://www.priv.gc.ca/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Office of the Privacy Commissioner of Canada
                  </a>
                  .
                </li>
              </ul>
              <p>
                To exercise any of these rights, please use the contact form at{' '}
                <Link to="/contact" className="text-blue-600 underline hover:text-blue-800">
                  brightpathtechnology.io/contact
                </Link>
                .
              </p>
            </Section>

            <Section number={7} title="Data Retention">
              <p>
                Enquiry form submissions are retained for up to 24 months for legitimate business purposes,
                after which they are securely deleted. Technical logs held by our hosting providers are subject
                to their own retention policies.
              </p>
            </Section>

            <Section number={8} title="Security">
              <p>
                We implement reasonable administrative and technical safeguards to protect your personal
                information from unauthorised access, disclosure, alteration, or destruction. While no
                transmission over the internet can be guaranteed to be completely secure, we take reasonable
                steps to protect personal information at all times.
              </p>
            </Section>

            <Section number={9} title="Contact Us">
              <p>
                To exercise your privacy rights, ask questions about this policy, or raise a concern, please
                use our contact form at{' '}
                <Link to="/contact" className="text-blue-600 underline hover:text-blue-800">
                  brightpathtechnology.io/contact
                </Link>
                .
              </p>
            </Section>

            <Section number={10} title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or
                applicable law. The effective date at the top of this page will be updated whenever material
                changes are made. We encourage you to review this policy periodically.
              </p>
            </Section>

            <div className="mt-10 pt-6 border-t border-black/10 text-center">
              <Link
                to="/"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline"
              >
                &larr; Back to Home
              </Link>
            </div>
          </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
