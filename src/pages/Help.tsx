// src/pages/Help.tsx
import { HelpCircle } from 'lucide-react';

const HelpPage = () => {
  const faqs = [
    {
      question: "How do I save a video?",
      answer: "Click on the 'Save' button below the video player to add it to your saved videos."
    },
    {
      question: "Can I watch videos offline?",
      answer: "With YouTube Premium, you can download videos to watch offline."
    },
    {
      question: "How do I change my account settings?",
      answer: "Go to the Settings page from the sidebar to update your preferences."
    },
    {
      question: "How do I report a problem?",
      answer: "Use the 'Send Feedback' option in the sidebar to report any issues."
    }
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="text-primary-600" size={28} />
        <h1 className="text-2xl font-bold">Help Center</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-light-200 dark:bg-dark-100 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-light-300 dark:border-dark-300 pb-4">
                <h3 className="font-medium text-lg">{faq.question}</h3>
                <p className="text-light-400 dark:text-light-300 mt-1">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-light-200 dark:bg-dark-100 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <p className="mb-4">If you need further assistance, please contact our support team:</p>
          <ul className="space-y-2">
            <li>• Email: support@youtubeclone.com</li>
            <li>• Phone: +1 (800) 123-4567</li>
            <li>• Live Chat: Available 24/7 from the app</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;