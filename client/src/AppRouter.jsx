// AppRouter.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import App from "./App";
import PrinterGrid from "./components/PrinterGrid";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import PrinterForm from "./components/PrinterForm";
import AddPrinterForm from "./components/AddPrinterForm";
import ConfigPage from "./components/ConfigPage";
import ReportPage from "./components/ReportPage";
import BuyPage from "./components/BuyPage";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import StudentPrintingLog from "./components/StudentPrintingLog";
import StudentPaymentLog from "./components/StudentPaymentLog";
import AccountManagement from "./components/AccountManagement";

const AppRouter = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);

  return (
    <Router>
      <Routes>
        {/* Route công cộng */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginForm />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <SignUp />}
        />

        {/* Route bảo vệ */}
        <Route
          path="/"
          element={user ? <App /> : <Navigate to="/login" />}
        >

          <Route index element={<Home />} />
          <Route path="printers" element={<PrinterGrid />} />
          <Route path="printer/:id" element={<PrinterForm />} />
          <Route path="add-printer" element={<AddPrinterForm />} />
          <Route path="configuration" element={<ConfigPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="pages" element={<BuyPage />} />
          <Route path="buy-paper" element={<BuyPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="printinglog" element={<StudentPrintingLog />} />
          <Route path="paymentlog" element={<StudentPaymentLog />} />
          <Route path="account" element={<AccountManagement />} />

          {/* Thêm các route khác nếu cần */}
        </Route>

        {/* Route cho 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
