import { useLocation, useNavigate } from "react-router-dom";

export default function Review() {
  const location = useLocation();
  const navigate = useNavigate();

  // Grab the interview data passed from the dashboard
  const interview = location.state?.interview;

  // Safety check: if someone types /review in the URL without clicking a card
  if (!interview) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          No interview selected.
        </h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Interview Review
            </h2>
            <p className="text-gray-500 mt-1">
              Role:{" "}
              <span className="font-bold text-blue-600">
                {interview.jobRole}
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Date: {new Date(interview.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-lg text-center border border-green-200">
            <p className="text-sm text-green-800 font-bold uppercase tracking-wide">
              Final Score
            </p>
            <span className="text-2xl text-green-700 font-extrabold">
              {interview.overallScore
                ? interview.overallScore.toFixed(1)
                : "0.0"}
              /10
            </span>
          </div>
        </div>

        {/* Loop through the saved questions and answers */}
        {interview.qaLogs.map((log, index) => (
          <div
            key={index}
            className="mb-8 border border-gray-100 rounded-lg p-5 shadow-sm"
          >
            <p className="font-bold text-gray-800 mb-3 text-lg">
              Q{index + 1}: {log.question}
            </p>

            <div className="mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Your Answer
              </span>
              <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded border border-gray-200">
                {log.userAnswer || "No answer provided."}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">
                  AI Feedback
                </span>
                <span className="text-sm font-bold text-blue-800 bg-blue-200 px-2 py-1 rounded">
                  Score: {log.score}/10
                </span>
              </div>
              <p className="text-blue-900 mt-2">{log.aiFeedback}</p>
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded hover:bg-gray-900 mt-4 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
