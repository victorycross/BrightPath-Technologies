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

function TermsOfUse() {
  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
            <header className="mb-10 pb-6 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
              <p className="text-sm text-gray-500">Effective Date: March 2026</p>
              <p className="text-sm text-gray-500 mt-1">
                BrightPath Technologies &mdash; Toronto, Ontario, Canada
              </p>
            </header>

            <Section number={1} title="Acceptance">
              <p>
                By accessing brightpathtechnology.io or advisors.brightpathtechnology.io (together, "the
                Sites"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these
                Terms, please do not use these Sites.
              </p>
            </Section>

            <Section number={2} title="Services">
              <p>
                BrightPath Technologies provides technology consulting services and AI-powered advisory tools
                ("Services"). Our Services are operated from Toronto, Ontario, Canada.
              </p>
            </Section>

            <Section number={3} title="AI Advisory Disclaimer">
              <p>
                The Persona-X tools and other AI-powered features on our Sites generate outputs using
                artificial intelligence models.{' '}
                <strong>
                  These outputs are informational only and do not constitute professional legal, financial,
                  accounting, medical, or other regulated professional advice.
                </strong>
              </p>
              <p>
                AI-generated outputs may contain errors, inaccuracies, or outdated information. You are
                solely responsible for any decisions you make based on these outputs. Always consult a
                qualified professional for advice specific to your situation before taking any action.
              </p>
            </Section>

            <Section number={4} title="Acceptable Use">
              <p>By using our Services, you agree not to:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Use the Services for any unlawful purpose or in violation of applicable Canadian law;</li>
                <li>Attempt to circumvent, disable, or interfere with any security measures;</li>
                <li>
                  Input personal health information, financial account credentials, government-issued
                  identification numbers, or other sensitive data into our AI tools;
                </li>
                <li>Reproduce, distribute, or resell our Services or content without prior written authorisation.</li>
              </ul>
            </Section>

            <Section number={5} title="Intellectual Property">
              <p>
                All content, tools, materials, logos, and other intellectual property displayed on these Sites
                are the property of BrightPath Technologies or its licensors and are protected by applicable
                intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, or create derivative works of any content without
                our prior written permission, except as expressly permitted by applicable law.
              </p>
            </Section>

            <Section number={6} title="Limitation of Liability">
              <p>
                To the maximum extent permitted by applicable Ontario law, BrightPath Technologies and its
                officers, directors, and contractors shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising from or related to your use of, or inability to
                use, the Services, even if advised of the possibility of such damages.
              </p>
              <p>
                Our total aggregate liability to you for any claim arising out of or in connection with these
                Terms or the Services shall not exceed the total fees paid by you to BrightPath Technologies
                in the twelve (12) months preceding the event giving rise to the claim.
              </p>
            </Section>

            <Section number={7} title="No Warranty">
              <p>
                The Services are provided on an "as is" and "as available" basis, without warranty of any
                kind, whether express, implied, or statutory, including but not limited to warranties of
                merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </Section>

            <Section number={8} title="Governing Law">
              <p>
                These Terms are governed by and construed in accordance with the laws of the Province of
                Ontario and the federal laws of Canada applicable therein, without regard to conflict of law
                principles.
              </p>
              <p>
                Any dispute arising out of or in connection with these Terms or the Services shall be subject
                to the exclusive jurisdiction of the courts of Ontario, Canada.
              </p>
            </Section>

            <Section number={9} title="Changes">
              <p>
                We may update these Terms at any time by posting a revised version on this page with an
                updated effective date. Your continued use of the Services after any such change constitutes
                your acceptance of the updated Terms. We encourage you to review this page periodically.
              </p>
            </Section>

            <Section number={10} title="Contact">
              <p>
                If you have questions or concerns about these Terms, please use our contact form at{' '}
                <Link to="/contact" className="text-blue-600 underline hover:text-blue-800">
                  brightpathtechnology.io/contact
                </Link>
                .
              </p>
            </Section>

            <div className="mt-10 pt-6 border-t border-gray-200 text-center">
              <Link
                to="/"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                &larr; Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfUse
