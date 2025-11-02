import { useState } from "react";
import ResolveModal from "./ResolveModal";

function Dashboard({ pendingRequests, knowledgeBase, onResolve }) {
  const [selectedRequest, setSelectedRequest] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* Pending Requests Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
          Pending Help Requests ({pendingRequests.length})
        </h2>

        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <p className="text-gray-400">No pending requests. Great job!</p>
          ) : (
            pendingRequests.map((request) => (
              <div
                key={request.requestId}
                className="bg-gray-800 p-4 rounded-lg shadow-lg"
              >
                <p className="text-lg font-medium">{request.customerQuestion}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Received: {new Date(request.createdAt).toLocaleString()}
                </p>
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="mt-4 bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-400 transition-colors"
                >
                  Resolve
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Knowledge Base Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-green-400">
          Learned Answers ({knowledgeBase.length})
        </h2>

        <div className="space-y-4">
          {knowledgeBase.length === 0 ? (
            <p className="text-gray-400">No learned answers yet.</p>
          ) : (
            knowledgeBase.map((item) => (
              <div
                key={item.question}
                className="bg-gray-800 p-4 rounded-lg shadow"
              >
                <p className="text-sm text-gray-400 font-medium">
                  Q: {item.question}
                </p>
                <p className="text-lg text-green-300">A: {item.answer}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Resolve Modal */}
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
