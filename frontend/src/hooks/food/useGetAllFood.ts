import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { mockFoods } from "./mockData";

const getAllFoodApi = async (): Promise<Food[]> => {
  if (import.meta.env.VITE_ENV === "mock") {
    return mockFoods;
  }

  const res = await api.get("/user/foodlogs");
  return res.data;
};

export const useGetAllFood = () => {
  const {
    data: foodList,
    isPending: isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["food", "all"],
    queryFn: () => {
      console.log("get food list");
      return getAllFoodApi();
    },
    retry: false,
  });

  const foodListByDate = foodList?.sort(
    (a, b) => new Date(b.date_logged).getTime() - new Date(a.date_logged).getTime()
  );

  return { foodList: foodListByDate, isLoading, isFetching, error };
};
