import ButtonGroup from "@/components/ButtonGroup";
import FullPage from "@/components/FullPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetAllFood } from "@/hooks/food/useGetAllFood";
import { dateToString } from "@/lib/utils";
import { Link } from "react-router-dom";
import "recharts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Home = () => {
  const { foodList, isLoading, error } = useGetAllFood();

  if (isLoading) {
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  }

  return (
    <FullPage className="flex flex-col py-10 gap-3 justify-start">
      <ButtonGroup className="w-full grid grid-cols-2 gap-1">
        <Button className="col-span-1 p-0" variant="default" type="button">
          <Link to="/upload" className="w-full">
            Upload
          </Link>
        </Button>
        <Button className="col-span-1 p-0" variant="default" type="button">
          <Link to="/compare" className="w-full">
            Compare
          </Link>
        </Button>
        <Button className="col-span-2 p-0" variant="default" type="button">
          <Link to="/rec" className="w-full">
            Recommended
          </Link>
        </Button>
      </ButtonGroup>

      {foodList?.map((food) => {
        return (
          <Card key={food.id} className="w-full gap-1">
            <CardHeader>
              <CardTitle className="text-lg">{food.food_name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <p>
                <strong className="font-semibold">Quantity: </strong>
                {food.quantity}
              </p>
              <p>
                <strong className="font-semibold">Date: </strong>
                {dateToString(food.date_logged)}
              </p>

              <h1 className="text-center font-semibold py-1">Nutrition Data</h1>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={350}
                  height={250}
                  data={food.nutrition_data}
                  margin={{ bottom: 30 }}
                  className=""
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
                  <YAxis>
                    <Label
                      value="Amount (grams)"
                      angle={-90}
                      position="insideLeft"
                      style={{ textAnchor: "middle" }}
                    />
                  </YAxis>
                  <Tooltip />
                  {/* <Legend /> */}
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      })}
    </FullPage>
  );
};

export default Home;
