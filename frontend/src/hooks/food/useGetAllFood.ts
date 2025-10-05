import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { mockFoods } from "./mockData";

const getAllFoodApi = async (): Promise<Food[]> => {
  if (import.meta.env.VITE_ENV === "mock") {
    return mockFoods;
  }

  const res = await api.get("/all");
  return res.data;
};

export const useGetAllFood = () => {
  const {
    data: foodList,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ["food", "all"],
    queryFn: () => {
      console.log("get food list");
      return getAllFoodApi();
    },
    retry: false,
  });

  return { foodList, isLoading, error };
};
