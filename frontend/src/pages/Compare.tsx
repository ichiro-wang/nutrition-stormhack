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
import { Spinner } from "@/components/ui/spinner";
import { useGetAllFood } from "@/hooks/food/useGetAllFood";
import { useGetFood } from "@/hooks/food/useGetFood";
import { dateToString } from "@/lib/utils";
import { useState } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const Compare = () => {
  const { foodList, isLoading: isLoadingList } = useGetAllFood();

  const [id1, setId1] = useState<number | null>(null);
  const [id2, setId2] = useState<number | null>(null);
  const { food: food1, isLoading: isLoading1 } = useGetFood(id1);
  const { food: food2, isLoading: isLoading2 } = useGetFood(id2);

  const nutritionData =
    food1 && food2
      ? food1.nutrition_data.map((nutrient) => ({
          name: nutrient.name,
          [food1.food_name]: nutrient.value,
          [food2.food_name]: food2.nutrition_data.find((n) => n.name === nutrient.name)?.value ?? 0,
        }))
      : [];

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
          <CardTitle>Calorie Comparison Chart</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading1 || isLoading2 ? (
            <div className="flex justify-center items-center h-60">
              <Spinner />
            </div>
          ) : food1 && food2 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: "Calories",
                    [food1.food_name]: food1.nutrition_data2
                      .filter((food) => food.name === "Calories")
                      .at(0)?.value,
                    [food2.food_name]: food2.nutrition_data2
                      .filter((food) => food.name === "Calories")
                      .at(0)?.value,
                  },
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={food1.food_name} fill="#b41c50" />
                <Bar dataKey={food2.food_name} fill="#3d398c" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center">Select two meals to compare.</p>
          )}
        </CardContent>
      </Card>

      <Card className="w-full gap-1">
        <CardHeader>
          <CardTitle>Nutrition Comparison Chart</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading1 || isLoading2 ? (
            <div className="flex justify-center items-center h-60">Loading...</div>
          ) : food1 && food2 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nutritionData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={food1.food_name} fill="#b41c50" />
                <Bar dataKey={food2.food_name} fill="#3d398c" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center">Select two meals to compare.</p>
          )}
        </CardContent>
      </Card>
    </FullPage>
  );
};

export default Compare;
