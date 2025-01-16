import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Logout from "./components/Logout";
import SideNavLayout from "./components/Side Nav/SideNavLayout";
import Profile from "./pages/Profile";
import ViewTask from "./pages/ViewTask";
import CreateTask from "./pages/CreateTask";
import Analaytics from "./pages/Analaytics";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="app-container">
          <Routes>
            {/* Route for Login */}
            <Route path="/" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/dashboard" element={<SideNavLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="view-task" element={<ViewTask />} />
              <Route path="create-task" element={<CreateTask />} />
              <Route path="analytics" element={<Analaytics />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
