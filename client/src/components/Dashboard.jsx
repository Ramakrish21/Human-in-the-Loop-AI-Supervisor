import { useState } from "react";
import ResolveModal from "./ResolveModal";

function Dashboard({ pendingRequests, knowledgeBase, onResolve }) {
  const [selectedRequest, setSelectedRequest] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
      {/* --- Pending Requests Section --- */}
      <section className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center">
          Pending Help Requests
          <span className="ml-2 text-sm text-gray-400">
            ({pendingRequests.length})
          </span>
        </h2>

        {pendingRequests.length === 0 ? (
          <p className="text-gray-400 text-center italic py-10">
            🎉 No pending requests. Great job!
          </p>
        ) : (
          <div className="space-y-5 overflow-y-auto max-h-[65vh] pr-2">
            {pendingRequests.map((request) => (
              <div
                key={request.requestId}
                className="bg-gray-900 p-5 rounded-xl border border-gray-700 hover:border-yellow-400 transition-all"
              >
                <p className="text-lg font-semibold text-white">
                  {request.customerQuestion}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  📅 {new Date(request.createdAt).toLocaleString()}
                </p>
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="mt-4 bg-yellow-500 text-black font-bold py-2 px-5 rounded-lg hover:bg-yellow-400 active:scale-95 transition-transform"
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Knowledge Base Section --- */}
      <section className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-green-400 flex items-center">
          Learned Answers
          <span className="ml-2 text-sm text-gray-400">
            ({knowledgeBase.length})
          </span>
        </h2>

        {knowledgeBase.length === 0 ? (
          <p className="text-gray-400 text-center italic py-10">
            🤖 No learned answers yet.
          </p>
        ) : (
          <div className="space-y-5 overflow-y-auto max-h-[65vh] pr-2">
            {knowledgeBase.map((item) => (
              <div
                key={item.question}
                className="bg-gray-900 p-5 rounded-xl border border-gray-700 hover:border-green-400 transition-all"
              >
                <p className="text-sm text-gray-400 font-medium">
                  Q: {item.question}
                </p>
                <p className="text-lg text-green-300 mt-1 font-semibold">
                  A: {item.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Resolve Modal --- */}
      {selectedRequest && (
        <ResolveModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onResolveSuccess={() => {
            setSelectedRequest(null);
            onResolve();
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
