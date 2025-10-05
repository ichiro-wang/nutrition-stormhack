import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMe } from "@/hooks/auth/useGetMe";

const Navbar = () => {
  const { user, isLoading } = useGetMe();
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

      <h1 className="absolute left-4 px-3 py-1">{!isLoading && user?.name}</h1>
    </nav>
  );
};

export default Navbar;
