import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full px-8 py-3 flex justify-between items-center bg-[#0A0A0A] border-b border-gray-800 z-50">
      <Link to="/" className="flex items-center gap-2">
        <img src="/soul2.png" alt="Soulcare Logo" className="h-12" />
        <span className="text-xl font-bold">Soulcare</span>
      </Link>
      <div className="flex items-center gap-8">
         
        <a
          href="mailto:kumushjj@gmail.com"
          className="text-gray-300 hover:text-white hidden sm:block"
          title="kumushjj@gmail.com"
        >
          Contact
        </a>
        <Link to="/chat" className="button-primary hidden sm:block">
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
