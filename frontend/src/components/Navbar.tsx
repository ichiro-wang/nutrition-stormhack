import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav
      onClick={() => navigate("/home")}
      className="flex items-center justify-center p-2 text-lg font-bold cursor-pointer"
    >
      Nutrition Tracker
    </nav>
  );
};

export default Navbar;
