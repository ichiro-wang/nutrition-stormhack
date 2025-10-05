import FullPage from "@/components/FullPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { useGetAllFood } from "@/hooks/food/useGetAllFood";
import { useGetFood } from "@/hooks/food/useGetFood";
import { dateToString } from "@/lib/utils";
import { useState } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const Compare = () => {
  const { foodList, isLoadingList } = useGetAllFood();

  const [id1, setId1] = useState<number | null>(null);
  const [id2, setId2] = useState<number | null>(null);
  const { food: food1, isLoading: isLoading1 } = useGetFood(id1);
  const { food: food2, isLoading: isLoading2 } = useGetFood(id2);

  return (
    <FullPage className="flex flex-col pt-10 gap-3 justify-start">
      <Card className="w-full gap-1">
        <CardHeader>
          <CardTitle>Compare 2 meals</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <Select onValueChange={(e) => setId1(Number(e))}>
            <SelectTrigger className="w-full col-span-1">
              <SelectValue placeholder="Select meal 1" />
            </SelectTrigger>
            <SelectContent className="col-span-1">
              <SelectGroup>
                <SelectLabel>Select meal 1</SelectLabel>
                {foodList?.map((food) => {
                  return (
                    <SelectItem
                      key={`${food.id}-1`}
                      value={`${food.id}`}
                      className="max-w-full"
                      disabled={id1 === food.id || id2 === food.id}
                    >
                      {food.food_name} - {dateToString(food.date_logged)}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={(e) => setId2(Number(e))}>
            <SelectTrigger className="w-full col-span-1">
              <SelectValue placeholder="Select meal 2" />
            </SelectTrigger>
            <SelectContent className="col-span-1">
              <SelectGroup>
                <SelectLabel>Select meal 2</SelectLabel>
                {foodList?.map((food) => {
                  return (
                    <SelectItem
                      key={`${food.id}-2`}
                      value={`${food.id}`}
                      className="max-w-full"
                      disabled={id1 === food.id || id2 === food.id}
                    >
                      {food.food_name} - {dateToString(food.date_logged)}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="w-full gap-1">
        <CardHeader>
          <CardTitle>Comparison Chart</CardTitle>
        </CardHeader>
        <CardContent>
          {food1 && food2 && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: "Calories",
                    [food1.food_name]: food1.calories,
                    [food2.food_name]: food2.calories,
                  },
                  {
                    name: "Protein",
                    [food1.food_name]: food1.protein,
                    [food2.food_name]: food2.protein,
                  },
                  // etc.
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={food1.food_name} />
                <Bar dataKey={food2.food_name} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </FullPage>
  );
};

export default Compare;
