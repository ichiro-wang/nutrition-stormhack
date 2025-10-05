import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <nav className="relative flex items-center justify-center p-2 text-lg border-b">
      <h1 onClick={() => navigate("/home")} className="font-bold cursor-pointer">
        Nutrition Tracker
      </h1>

      <Button className="absolute right-4 px-3 py-1 rounded " variant="link" type="button">
        <Link to="/login" onClick={() => queryClient.clear()}>
          Logout
        </Link>
      </Button>
    </nav>
  );
};

export default Navbar;
