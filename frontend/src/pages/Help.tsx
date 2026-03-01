import React from 'react';
import { HelpCircle, MessageCircle, FileText, ExternalLink } from 'lucide-react';

export default function Help() {
  return (
    <div className="max-w-3xl mx-auto pb-20">
      <h2 className="text-2xl font-normal text-on-surface mb-2">Help & Support</h2>
      <p className="text-sm text-on-surface-variant mb-8">Get assistance with Reflo</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="m3-card p-6 hover:shadow-elevation-2 transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-on-surface mb-2">Documentation</h3>
          <p className="text-sm text-on-surface-variant mb-4">Read detailed guides on how to use the dashboard and interpret analytics.</p>
          <span className="text-sm font-medium text-primary flex items-center">
            View Docs <ExternalLink className="w-4 h-4 ml-1" />
          </span>
        </div>

        <div className="m3-card p-6 hover:shadow-elevation-2 transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container mb-4">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-on-surface mb-2">Contact Support</h3>
          <p className="text-sm text-on-surface-variant mb-4">Chat with our support team for immediate assistance.</p>
          <span className="text-sm font-medium text-primary flex items-center">
            Start Chat <ExternalLink className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>

      <div className="m3-card p-6">
        <h3 className="text-lg font-medium text-on-surface mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {[
            "How is the Purity Score calculated?",
            "Can I export the monthly report?",
            "How do I add a new staff member?",
            "What do the red alert icons mean?"
          ].map((faq, i) => (
            <div key={i} className="p-4 bg-surface-variant/30 rounded-xl border border-outline-variant/20">
              <p className="text-sm font-medium text-on-surface">{faq}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
