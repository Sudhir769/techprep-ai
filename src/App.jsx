import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // <-- 1. Import the Dashboard
import Interview from "./pages/Interview";
import Register from "./pages/Register";
import Review from "./pages/Review";

function App() {
  return (
    <HashRouter>
      {/* Notice I removed the background colors from here, since our pages handle their own backgrounds now! */}
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/register" element={<Register />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
