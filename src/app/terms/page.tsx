import React from "react";
import Header from "@/components/Header";
import TitaniumFooter from "@/components/TitaniumFooter";

export default function TermsOfService() {
  return (
    <div className="bg-black min-h-screen text-gray-300 font-sans">
      <Header />
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-8">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-12">
          Last Updated: December 2, 2024
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl text-white mb-4 font-serif">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing and using the website of Keystone Notary Group LLC
              (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you accept
              and agree to be bound by the terms and provision of this
              agreement. In addition, when using these particular services, you
              shall be subject to any posted guidelines or rules applicable to
              such services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white mb-4 font-serif">
              2. Service Description
            </h2>
            <p className="leading-relaxed">
              Keystone Notary Group LLC provides mobile notary public services.
              We are not attorneys and do not provide legal advice. Any
              information provided on this website is for informational purposes
              only and should not be construed as legal advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white mb-4 font-serif">
              3. Appointment & Cancellation Policy
            </h2>
            <p className="leading-relaxed">
              Appointments are subject to availability. We require at least 24
              hours notice for cancellations. Cancellations made with less than
              24 hours notice may be subject to a cancellation fee. Failure to
              appear for a scheduled appointment without notice will result in a
              full service charge.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white mb-4 font-serif">
              4. User Responsibilities
            </h2>
            <p className="leading-relaxed mb-4">
              When using our services, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Provide valid, government-issued photo identification for all
                signers.
              </li>
              <li>
                Ensure all signers are present and capable of understanding the
                documents they are signing.
              </li>
              <li>
                Provide complete, unsigned documents (documents must be signed
                in the presence of the notary).
              </li>
              <li>
                Pay all fees associated with the service at the time of the
                appointment.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-white mb-4 font-serif">
              5. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              In no event shall Keystone Notary Group LLC be liable for any
              direct, indirect, incidental, special, exemplary, or consequential
              damages (including, but not limited to, procurement of substitute
              goods or services; loss of use, data, or profits; or business
              interruption) however caused and on any theory of liability,
              whether in contract, strict liability, or tort (including
              negligence or otherwise) arising in any way out of the use of this
              website or our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white mb-4 font-serif">
              6. Governing Law
            </h2>
            <p className="leading-relaxed">
              These terms shall be governed by and construed in accordance with
              the laws of the Commonwealth of Pennsylvania, without giving
              effect to any principles of conflicts of law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white mb-4 font-serif">
              7. Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms, please contact us at:
              <br />
              <a
                href="mailto:contact@keystonenotarygroup.com"
                className="text-silver-mid hover:text-white transition-colors"
              >
                contact@keystonenotarygroup.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <TitaniumFooter />
    </div>
  );
}
