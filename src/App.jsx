

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
import LeaderboardPage from "./pages/LeaderboardPage";
import QuizPage from "./pages/QuizPage";
import BracketPage from "./pages/BracketPage";

import AdminloginPage from "./pages/admin/AdminloginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import SchoolPage from "./pages/admin/SchoolPage";
import AdminbracketPage from "./pages/admin/AdminbracketPage";
import QuestionPage from "./pages/admin/QuestionPage";
import LeaderPage from "./pages/admin/LeaderPage";
import LiveMatchesPage from "./pages/admin/LiveMatchesPage";
import NotificationPage from "./pages/admin/NotificationPage";

import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/admin-components/ProtectedRoute";  // For USER
import AdminProtectedRoute from "./components/admin-components/AdminProtectedRoute";  // For ADMIN
import SchoolQuizPage from "./pages/SchoolQuizPage";


const App = () => {
  return (
    <div>
      <ToastContainer autoClose={2000} />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forget" element={<ForgetPage />} />
        <Route path="/school" element={<SchoolinfoPage />} />
        <Route path="/reset" element={<ResetPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        {/* <Route path="/adminlogin" element={<AdminloginPage />} /> */}


        {/* USER PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/roaster" element={<RoasterPage />} />
          <Route path="/dashboard" element={<UserDashPage />} />
          <Route path="/leader" element={<LeaderboardPage />} />
          <Route path="/quiz" element={<LivequizPage />} />
          <Route path="/quiz/:id" element={<SchoolQuizPage />} />
          <Route path="/match" element={<QuizPage />} />
          <Route path="/bracket" element={<BracketPage />} />
        </Route>


        {/* ADMIN PROTECTED ROUTES */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admindashboard" element={<DashboardPage />} />
          <Route path="/schooladmin" element={<SchoolPage />} />
          <Route path="/adminbracket" element={<AdminbracketPage />} />
          <Route path="/question" element={<QuestionPage />} />
          <Route path="/board" element={<LeaderPage />} />
          <Route path="/live-matches" element={<LiveMatchesPage />} />
          <Route path="/notification" element={<NotificationPage />} />
        </Route>

      </Routes>
    </div>
  );
};

export default App;
