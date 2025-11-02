import { useState } from "react";
import apiClient from "../utils/api";

function ResolveModal({ request, onClose, onResolveSuccess }) {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError("Please provide an answer.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient.post(`/requests/${request.requestId}/resolve`, {
        supervisorAnswer: answer,
      });
      onResolveSuccess();
    } catch (err) {
      console.error("Error resolving request:", err);
      setError("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Resolve Request</h2>

        <div className="bg-gray-700 p-4 rounded mb-4">
          <p className="text-gray-300 mb-1">Customer Question:</p>
          <p className="text-lg text-white font-medium">
            {request.customerQuestion}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Supervisor's Answer:
          </label>

          <textarea
            id="answer"
            rows="4"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isSubmitting}
            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-2 px-4 rounded bg-gray-600 hover:bg-gray-500 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 rounded bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Answer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResolveModal;
