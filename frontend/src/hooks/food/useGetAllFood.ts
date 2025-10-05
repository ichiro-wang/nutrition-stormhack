import { useQuery } from "@tanstack/react-query";
import api from "../api";

const getAllFoodApi = async (): Promise<Food[]> => {
  if (import.meta.env.VITE_ENV === "mock") {
    return [
      {
        id: 1,
        nutrition_data: [
          { name: "sugar", value: 50 },
          { name: "fat", value: 12 },
        ],
        date_logged: new Date(),
        food_name: "Fruit loops",
        quantity: 1,
      },
      {
        id: 2,
        nutrition_data: [
          { name: "sugar", value: 13 },
          { name: "fat", value: 20 },
          { name: "fibre", value: 15 },
          { name: "fibre2", value: 25 },
          { name: "fibre3", value: 30 },
          { name: "fibre4", value: 24 },
          { name: "fibre5", value: 24 },
          { name: "fibre6", value: 24 },
          { name: "fibre7", value: 24 },
        ],
        date_logged: new Date(),
        food_name: "Bacon",
        quantity: 3,
      },
    ];
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
