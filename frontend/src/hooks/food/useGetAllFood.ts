import { useQuery } from "@tanstack/react-query";

export const useGetAllFood = () => {
  const {
    data: foodList,
    isPending: isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["foodList"],
    queryFn: () => {
      console.log("get food list");
    },
    retry: false,
  });
};
