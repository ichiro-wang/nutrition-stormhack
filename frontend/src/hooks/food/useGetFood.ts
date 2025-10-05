import { useQuery } from "@tanstack/react-query";
import api from "../api";

const getFoodApi = async (id: number): Promise<Food> => {
  if (import.meta.env.VITE_ENV === "mock") {
    return {
      id: 1,
      nutrition_data: [
        { name: "sugar", value: 50 },
        { name: "fat", value: 12 },
      ],
      date_logged: new Date(),
      food_name: "Fruit loops",
      quantity: 1,
    };
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
