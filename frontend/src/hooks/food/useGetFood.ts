import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { mockFoods } from "./mockData";

const getFoodApi = async (id: number): Promise<Food> => {
  if (import.meta.env.VITE_ENV === "mock") {
    const food = mockFoods.find((f) => f.id === id);
    if (!food) throw new Error(`Food with id ${id} not found`);
    return food;
  }

  const res = await api.get(`/${id}`);
  return res.data;
};

export const useGetFood = (id: number | null) => {
  const {
    data: food,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ["food", id],
    queryFn: () => {
      if (id === null) {
        return null;
      }
      console.log("get food list");
      return getFoodApi(id);
    },
    retry: false,
  });

  return { food, isLoading, error };
};
