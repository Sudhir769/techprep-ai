import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Interview() {
  const navigate = useNavigate();

  // State for the different phases
  const [phase, setPhase] = useState("setup"); // 'setup', 'answering', 'results'
  const [loading, setLoading] = useState(false);

  // Data state
  const [jobRole, setJobRole] = useState("");
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);

  const token = localStorage.getItem("techprep_token");

  // --- PHASE 1: Start the Interview ---
  const startInterview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://techprep-backend-vmjb.onrender.com/api/interview/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jobRole }),
        },
      );
      const data = await response.json();

      if (response.ok) {
        setQuestions(data.questions);
        setInterviewId(data.interviewId);
        setAnswers(new Array(data.questions.length).fill("")); // Create empty answer slots
        setPhase("answering");
      }
    } catch (error) {
      console.error("Failed to start", error);
    } finally {
      setLoading(false);
    }
  };

  // --- PHASE 2: Submit Answers to the Grader ---
  const submitAnswers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://techprep-backend-vmjb.onrender.com/api/interview/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ interviewId, answers }),
        },
      );
      const data = await response.json();

      if (response.ok) {
        setResults(data);
        setPhase("results");
      }
    } catch (error) {
      console.error("Failed to submit", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, text) => {
    const newAnswers = [...answers];
    newAnswers[index] = text;
    setAnswers(newAnswers);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        {/* --- UI: SETUP PHASE --- */}
        {phase === "setup" && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              New Interview Setup
            </h2>
            <form onSubmit={startInterview}>
              <label className="block text-gray-700 font-bold mb-2">
                What role are you applying for?
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g., Senior Node.js Developer, Junior React Engineer"
                className="w-full px-4 py-3 border border-gray-300 rounded mb-6 focus:outline-none focus:border-blue-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? "Generating Questions via AI..." : "Start Interview"}
              </button>
            </form>
          </div>
        )}

        {/* --- UI: ANSWERING PHASE --- */}
        {phase === "answering" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Technical Interview
            </h2>
            <p className="text-gray-500 mb-6">Role: {jobRole}</p>

            {questions.map((q, index) => (
              <div
                key={index}
                className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100"
              >
                <p className="font-bold text-gray-800 mb-3">
                  Q{index + 1}: {q}
                </p>
                <textarea
                  rows="4"
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Type your detailed answer here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}

            <button
              onClick={submitAnswers}
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded hover:bg-green-700 disabled:bg-green-300"
            >
              {loading
                ? "AI is Grading Your Answers..."
                : "Submit Answers to AI"}
            </button>
          </div>
        )}

        {/* --- UI: RESULTS PHASE --- */}
        {phase === "results" && results && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Interview Complete
            </h2>
            <div className="mb-8 p-4 bg-green-100 rounded-lg text-center">
              <span className="text-xl text-green-800 font-bold">
                Overall Score: {results.overallScore.toFixed(1)} / 10
              </span>
            </div>

            {results.results.map((result, index) => (
              <div key={index} className="mb-6 border-b pb-6">
                <p className="font-bold text-gray-800 mb-2">
                  Q: {result.question}
                </p>
                <p className="text-gray-600 mb-3 text-sm italic">
                  Your Answer: {result.userAnswer}
                </p>
                <div className="bg-gray-100 p-4 rounded border-l-4 border-yellow-500">
                  <p className="font-bold text-sm text-gray-700">
                    AI Feedback (Score: {result.score}/10)
                  </p>
                  <p className="text-gray-700 mt-1">{result.aiFeedback}</p>
                </div>
              </div>
            ))}

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
