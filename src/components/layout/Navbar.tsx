 
const Navbar = () => {
  return (
     <nav className="w-full px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/soul2.png" alt="Soulcare Logo" className="h-16" />

          <span className="text-xl font-bold">Soulcare</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="text-gray-300 hover:text-white">
            Home
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            About
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Contact
          </a>
          <button className="button-primary">Get Started</button>
        </div>
      </nav>
  );
};

export default Navbar;
