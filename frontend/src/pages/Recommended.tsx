import FullPage from "@/components/FullPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetDailyFood } from "@/hooks/food/useGetDailyFood";
import { useGetUser } from "@/hooks/food/useGetUser";
import { format } from "date-fns";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// 👇 Define nutrient shape
type NutrientTotals = Record<string, number>;

const Recommended = () => {
  const today = new Date();
  const { user, isLoading: isLoadingUser } = useGetUser();
  const { foodData: todayFoods, isLoading: isLoadingFoods } = useGetDailyFood();

  const foodsArray = Array.isArray(todayFoods) ? todayFoods : [];

  // --- Sum nutrients for today's foods ---
  const nutrientTotals: NutrientTotals = foodsArray.reduce((acc: NutrientTotals, food: any) => {
    const combined = {
      ...(food.nutrition_data || {}),
      ...(food.nutrition_data2 || {}),
    };

    Object.entries(combined).forEach(([key, value]) => {
      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        acc[key] = (acc[key] || 0) + numericValue;
      }
    });

    return acc;
  }, {});


  if (isLoadingUser || isLoadingFoods) {
    return (
      <FullPage className="flex justify-center items-center h-60">
        <Spinner />
      </FullPage>
    );
  }

  // --- Extract recommended fields ---
  const recommended: NutrientTotals = {};
  Object.entries(user || {}).forEach(([key, value]) => {
    if (key.startsWith("rec_") && !isNaN(Number(value))) {
      recommended[key.replace("rec_", "")] = Number(value);
    }
  });

  // --- Chart data ---
  const comparisonData = Object.keys(recommended).map((nutrient) => ({
    name: nutrient.charAt(0).toUpperCase() + nutrient.slice(1),
    Recommended: recommended[nutrient],
    Consumed: nutrientTotals[nutrient] || 0,
  }));

  return (
    <FullPage className="flex flex-col pt-10 gap-3 justify-start">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            Daily Intake vs Recommended ({format(today, "MMM d, yyyy")})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {comparisonData.length === 0 ? (
            <p className="text-center">No data available for today.</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={comparisonData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Recommended" fill="#3d398c" />
                <Bar dataKey="Consumed" fill="#b41c50" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </FullPage>
  );
};

export default Recommended;