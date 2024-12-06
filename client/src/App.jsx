import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function App({ role }) {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userRole = user.role; // This should be dynamically set based on the logged-in user
  const bgColor =
    userRole === "admin" ? "from-white to-red-300" : "from-white to-blue-300";

  return (
    <>
      <div className="w-full h-screen">
        <Header role={userRole} />
        <main className={`h-[750px] bg-gradient-to-b ${bgColor}`}>
          <Outlet />
        </main>
        <Footer role={userRole} />
      </div>
    </>
  );
}

export default App;
