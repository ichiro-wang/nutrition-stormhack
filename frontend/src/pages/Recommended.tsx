import FullPage from "@/components/FullPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetMe } from "@/hooks/auth/useGetMe";
import { useGetDailyFood } from "@/hooks/food/useGetDailyFood";
import { useGetGemini } from "@/hooks/food/useGetGemini";
import { format } from "date-fns";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type NutrientTotals = Record<string, number>;

const Recommended = () => {
  const today = new Date();
  const { user, isLoading: isLoadingUser } = useGetMe();
  const { foodData: todayFoods, isLoading: isLoadingFoods } = useGetDailyFood();
  const { geminiData: geminiData, isLoading: isLoadingGemini } = useGetGemini();

  if (isLoadingUser || isLoadingFoods) {
    return (
      <FullPage className="flex justify-center items-center h-60">
        <Spinner />
      </FullPage>
    );
  }

  // --- Ensure todayFoods is a plain object (not array)
  const nutrientTotals: NutrientTotals =
    todayFoods && typeof todayFoods === "object" && !Array.isArray(todayFoods)
      ? todayFoods
      : {};

  // --- Extract recommended nutrient targets from user data
  const recommended: NutrientTotals = {};
  Object.entries(user || {}).forEach(([key, value]) => {
    if (key.startsWith("rec_") && !isNaN(Number(value))) {
      recommended[key.replace("rec_", "")] = Number(value);
    }
  });

  // --- Build chart comparison data ---
  const comparisonData = Object.keys(recommended).map((nutrient) => ({
    name: nutrient.charAt(0).toUpperCase() + nutrient.slice(1),
    Recommended: recommended[nutrient],
    Consumed: nutrientTotals[nutrient] || 0,
  }));

  const hasData = comparisonData.length > 0 && Object.keys(nutrientTotals).length > 0;

  return (
    <FullPage className="flex flex-col pt-10 gap-3 justify-start">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            Daily Intake vs Recommended ({format(today, "MMM d, yyyy")})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!hasData ? (
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

          {/* --- Display Gemini results --- */}
          {geminiData && (
            <p className="mt-4 text-center">
              Gemini Results: {geminiData.response}
            </p>
          )}
        </CardContent>
      </Card>
    </FullPage>
  );
};

export default Recommended;
