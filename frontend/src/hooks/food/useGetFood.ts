import { useQueryClient } from "@tanstack/react-query";

export const useGetFood = (id: number | null) => {
  const queryClient = useQueryClient();

  const allFoods = queryClient.getQueryData<Food[]>(["food", "all"]);

  const food = allFoods?.find((f) => f.id === id);

  return {
    food,
    isLoading: !allFoods, // still waiting for list to load
    error: undefined,
  };
};
