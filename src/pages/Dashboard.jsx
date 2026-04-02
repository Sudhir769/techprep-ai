import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      // 1. Grab the VIP wristband from memory
      const token = localStorage.getItem("techprep_token");

      // If they don't have a token, kick them back to the login screen!
      if (!token) {
        navigate("/");
        return;
      }

      try {
        // 2. Fetch the history from the backend
        const response = await fetch(
          "https://techprep-backend-vmjb.onrender.com/api/interview/history",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Show the bouncer the token
            },
          },
        );

        const data = await response.json();

        if (response.ok) {
          setInterviews(data.interviews);
        } else {
          // If the token is expired or invalid, clear it and force a re-login
          localStorage.removeItem("techprep_token");
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("techprep_token");
    navigate("/interview");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Loading your data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Your Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Log Out
          </button>
        </div>

        {/* Action Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 flex justify-between items-center border-l-4 border-blue-500">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Ready for your next challenge?
            </h2>
            <p className="text-gray-600">
              Start a new AI-powered mock interview.
            </p>
          </div>
          <button
            onClick={() => navigate("/interview")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition"
          >
            Start New Interview
          </button>
        </div>

        {/* History Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Past Interviews
        </h2>

        {interviews.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
            No interviews taken yet. Time to start practicing!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {interviews.map((interview) => (
              <div
                key={interview._id}
                onClick={() => navigate("/review", { state: { interview } })}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-blue-600">
                    {interview.jobRole}
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                    Score:{" "}
                    {interview.overallScore
                      ? interview.overallScore.toFixed(1)
                      : "N/A"}
                    /10
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(interview.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mt-3">
                  {interview.qaLogs.length} Questions Answered
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
