import Footer from "./Footer";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useLayout } from "../../context/LayoutContext";

const Layout = () => {
  const { showFooter } = useLayout();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className={`flex-1 ${!showFooter ? 'h-screen' : ''}`}>
        <Outlet />
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
