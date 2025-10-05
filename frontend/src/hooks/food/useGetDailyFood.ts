// hooks/food/useGetFoodByDate.ts
import { useQuery } from "@tanstack/react-query";
import api from "../api";

const fetchDailyFood = async (): Promise<Food> => {
  const res = await api.get("get-daily-food"); 
  return res.data;
};

export const useGetDailyFood = () => {
  const {
    data: foodData,
    isLoading,
    isError,
    refetch,
  } = useQuery<Food>({
    queryKey: ["food"],
    queryFn: fetchDailyFood,
  });

  return { foodData, isLoading, isError, refetch };
};
