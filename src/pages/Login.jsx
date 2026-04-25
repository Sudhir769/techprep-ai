import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showWakeMessage, setShowWakeMessage] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    setIsLoading(true);
    setShowWakeMessage(false);

    const wakeTimer = setTimeout(() => {
      setShowWakeMessage(true);
    }, 4000);
    
    try {
      const response = await fetch('https://techprep-backend-vmjb.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Could not connect to the server.');
    } finally {
      clearTimeout(wakeTimer);
      setIsLoading(false);
      setShowWakeMessage(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-bold"
              >
                Sign Up Here
              </Link>
            </p>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* The Login Button */}
          <button
            type="submit"
            disabled={isLoading} // Disables the button so they can't spam click it
            className={`w-full font-bold py-3 px-4 rounded-lg transition text-white
            ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {/* The Smart Wake-Up Message */}
          {showWakeMessage && (
            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-md animate-pulse">
              <p className="text-sm font-semibold">
                Waking up the cloud server... ☁️
              </p>
              <p className="text-xs mt-1">
                Since this is a free host, the first login can take up to 40
                seconds. Thanks for your patience!
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
