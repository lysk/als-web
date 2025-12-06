import React from 'react';

export const metadata = {
    title: 'Terms of Service | ALS Tools',
    description: 'Terms of Service for using ALS Tools.',
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground mb-8">Last updated: December 2025</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
                <p>
                    By accessing and using this website ("ALS Tools"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. Disclaimer</h2>
                <p className="bg-yellow-50 dark:bg-yellow-900/40 border-l-4 border-yellow-500 p-4 my-4 text-yellow-800 dark:text-yellow-200">
                    <strong>Unofficial Fan Site:</strong> ALS Tools is a fan-made website and is <strong>not affiliated with, endorsed, sponsored, or specifically approved by "Anime Last Stand" developers or Roblox Corporation</strong>. All game content and materials are trademarks and copyrights of their respective owners.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">3. Use of Service</h2>
                <p>
                    You agree to use this website only for lawful purposes. You are prohibited from violating or attempting to violate the security of the Website, including, without limitation:
                </p>
                <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li>Accessing data not intended for such user.</li>
                    <li>Attempting to probe, scan or test the vulnerability of a system or network.</li>
                    <li>Attempting to interfere with service to any user, host or network.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">4. Intellectual Property</h2>
                <p>
                    The original content, features, and functionality of this tool (calculator logic, UI design) are and will remain the exclusive property of ALS Tools and its licensors.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">5. Limitation of Liability</h2>
                <p>
                    In no event shall ALS Tools, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">6. Changes to Terms</h2>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">7. Contact Us</h2>
                <p>
                    If you have any questions about these Terms, please contact us.
                </p>
            </div>
        </div>
    );
}
