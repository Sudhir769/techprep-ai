import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; 
import Interview from "./pages/Interview";
import Register from "./pages/Register";
import Review from "./pages/Review";

function App() {
  return (
    <HashRouter>
      
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
