// src/pages/Feedback.tsx
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      // In a real app, you would send this to your backend
      console.log('Feedback submitted:', feedback);
      setSubmitted(true);
      setFeedback('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="text-primary-600" size={28} />
        <h1 className="text-2xl font-bold">Send Feedback</h1>
      </div>

      {submitted ? (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg mb-6">
          Thank you for your feedback! We appreciate your input.
        </div>
      ) : (
        <div className="bg-light-200 dark:bg-dark-100 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Share Your Thoughts</h2>
          <p className="mb-4">
            We'd love to hear your feedback about our app. Please let us know what you think,
            report any issues, or suggest improvements.
          </p>
          
          <form onSubmit={handleSubmit}>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Type your feedback here..."
              className="w-full p-3 rounded-lg border border-light-300 dark:border-dark-300 bg-white dark:bg-dark-300 min-h-[150px]"
              required
            />
            
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-light-200 dark:bg-dark-100 rounded-xl p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">What kind of feedback are we looking for?</h2>
        <ul className="space-y-2">
          <li>• Suggestions for new features</li>
          <li>• Bug reports</li>
          <li>• Performance issues</li>
          <li>• User experience feedback</li>
          <li>• Content suggestions</li>
        </ul>
      </div>
    </div>
  );
};

export default FeedbackPage;