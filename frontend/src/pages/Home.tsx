import FullPage from "@/components/FullPage";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <FullPage>
      <Button variant="default" type="button">
        <Link to="/upload">Upload</Link>
      </Button>
    </FullPage>
  );
};

export default Home;
