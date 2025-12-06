import React from 'react';

export const metadata = {
    title: 'Privacy Policy | ALS Tools',
    description: 'Privacy Policy for ALS Tools - We respect your privacy.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground mb-8">Last updated: December 2025</p>

                <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
                <p>
                    Welcome to ALS Tools ("we," "our," or "us"). We are committed to protecting your privacy.
                    This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">2. Information Collection</h2>
                <p>
                    <strong>Local Storage Data:</strong> We utilize your browser's Local Storage to save your preferences and user-generated data (such as your unit collection in "My Units"). This data stays on your device and is not sent to our servers unless explicitly stated.
                </p>
                <p>
                    <strong>Log Data:</strong> Like most websites, we may collect information that your browser sends whenever you visit our Service ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, and other statistics.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">3. Use of Data</h2>
                <p>We use the collected data for various purposes:</p>
                <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li>To provide and maintain our Service</li>
                    <li>To allow you to participate in interactive features (like the DPS Calculator)</li>
                    <li>To provide customer support</li>
                    <li>To monitor the usage of our Service</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">4. Cookies</h2>
                <p>
                    We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">5. Third-Party Services</h2>
                <p>
                    We may use third-party Service Providers to monitor and analyze the use of our Service (e.g., Google Analytics, Cloudflare). These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">6. Security of Data</h2>
                <p>
                    The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">7. Changes to This Privacy Policy</h2>
                <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">8. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us via our social media channels.
                </p>
            </div>
        </div>
    );
}
