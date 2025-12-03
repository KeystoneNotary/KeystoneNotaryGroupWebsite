import React from 'react';
import Header from '@/components/Header';
import TitaniumFooter from '@/components/TitaniumFooter';

export default function PrivacyPolicy() {
  return (
    <div className="bg-black min-h-screen text-gray-300 font-sans">
      <Header />
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-12">Last Updated: December 2, 2024</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl text-white mb-4 font-serif">1. Introduction</h2>
            <p className="leading-relaxed">
              Keystone Notary Group LLC ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit our website and our practices for collecting, using, maintaining, protecting, and disclosing that information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white mb-4 font-serif">2. Information We Collect</h2>
            <p className="leading-relaxed mb-4">
              We collect several types of information from and about users of our website, including information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>By which you may be personally identified, such as name, postal address, e-mail address, telephone number ("personal information");</li>
              <li>About your internet connection, the equipment you use to access our Website, and usage details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-white mb-4 font-serif">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">
              We use information that we collect about you or that you provide to us, including any personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To present our Website and its contents to you.</li>
              <li>To provide you with information, products, or services that you request from us.</li>
              <li>To fulfill any other purpose for which you provide it (e.g., scheduling appointments).</li>
              <li>To notify you about changes to our Website or any products or services we offer or provide though it.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-white mb-4 font-serif">4. Disclosure of Your Information</h2>
            <p className="leading-relaxed">
              We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when its release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white mb-4 font-serif">5. Data Security</h2>
            <p className="leading-relaxed">
              We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on our secure servers behind firewalls.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white mb-4 font-serif">6. Contact Information</h2>
            <p className="leading-relaxed">
              To ask questions or comment about this privacy policy and our privacy practices, contact us at:<br />
              <a href="mailto:contact@keystonenotarygroup.com" className="text-silver-mid hover:text-white transition-colors">contact@keystonenotarygroup.com</a><br />
              (267) 309-9000
            </p>
          </section>
        </div>
      </main>
      <TitaniumFooter />
    </div>
  );
}
