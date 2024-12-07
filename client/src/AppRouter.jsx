import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import { useSelector } from "react-redux";
import Profile from "./components/Profile";

const AppRouter = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={user ? <App /> : <LoginForm />}>
          <Route index element={<Home />} />
          <Route path="/printers" element={<PrinterGrid />} />
          <Route path="/printer/:id" element={<PrinterForm />} />
          <Route path="/add-printer" element={<AddPrinterForm />} />
          <Route path="/configuration" element={<ConfigPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/pages" element={<BuyPage />} />
          <Route path="/buy-paper" element={<BuyPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
