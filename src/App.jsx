// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/HomePage";
// import RegistrationPage from "./pages/RegistrationPage";
// import BracketPage from "./pages/BracketPage";
// import LivequizPage from "./pages/LivequizPage";
// import LeaderboardPage from "./pages/LeaderboardPage";
// import MatchgroupPage from "./pages/MatchgroupPage";
// import ContactPage from "./pages/ContactPage";
// import ForgetPage from "./pages/ForgetPage";
// import LoginPage from "./pages/LoginPage";
// import AdminloginPage from "./pages/admin/AdminloginPage";
// import DashboardPage from "./pages/admin/DashboardPage";
// import SchoolPage from "./pages/admin/SchoolPage";
// import AdminbracketPage from "./pages/admin/AdminbracketPage";
// import QuestionPage from "./pages/admin/QuestionPage";
// import LeaderPage from "./pages/admin/LeaderPage";
// import MatchPage from "./pages/admin/MatchPage";
// import ReportPage from "./pages/admin/ReportPage";
// import NotificationPage from "./pages/admin/NotificationPage";
// import { ToastContainer } from "react-toastify";
// import ProtectedRoute from "./components/admin-components/ProtectedRoute";

// function App() {
//   return (
//     <>
//       <ToastContainer autoClose={2000} />
//       <Routes>
//         <Route path="/home" element={<Home />} />
//         <Route path="/" element={<Home />} />
//         <Route path="/registration" element={<RegistrationPage />} />
//         <Route path="/bracket" element={<BracketPage />} />
//         <Route path="/quiz" element={<LivequizPage />} />
//         <Route path="/leader" element={<LeaderboardPage />} />
//         <Route path="/match" element={<MatchgroupPage />} />
//         <Route path="/contact" element={<ContactPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/forget" element={<ForgetPage />} />

//         {/* FIXED CASE */}
//         <Route path="/adminlogin" element={<AdminloginPage />} />

//        <Route element={<ProtectedRoute/>}>
//         <Route path="/dashboard" element={<DashboardPage />} />
//         <Route path="/school" element={<SchoolPage />} />
//         <Route path="/adminbracket" element={<AdminbracketPage />} />
//         <Route path="/question" element={<QuestionPage />} />
//         <Route path="/board" element={<LeaderPage />} />

//        </Route>

//         {/* FIXED EXTRA SPACE */}
//         <Route path="/live" element={<MatchPage />} />

//         <Route path="/report" element={<ReportPage />} />
//         <Route path="/notification" element={<NotificationPage />} />
//       </Routes>
//     </>
//   );
// }

// export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/HomePage";
import ForgetPage from "./pages/ForgetPage";
import SchoolinfoPage from "./pages/SchoolinfoPage";
import RoasterPage from "./pages/RoasterPage";
import ResetPage from "./pages/ResetPage";
import RegistrationPage from "./pages/RegistrationPage";
import UserDashPage from "./pages/UserDashPage";
import LivequizPage from "./pages/LivequizPage";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/admin-components/ProtectedRoute";

const App = () => {
  return (
    <div>
      <ToastContainer autoClose={2000} />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forget" element={<ForgetPage />} />
        <Route path="/school" element={<SchoolinfoPage />} />
        <Route path="/roaster" element={<RoasterPage />} />
        <Route path="/reset" element={<ResetPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/quiz" element={<LivequizPage />} />
        

        <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<UserDashPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
