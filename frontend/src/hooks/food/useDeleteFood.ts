import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

const deleteFoodApi = async (id: number) => {
  const res = await api.delete(`/foodlog/${id}`);
  return res.data;
};

export const useDeleteFood = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteFood,
    data,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (id: number) => {
      return deleteFoodApi(id);
    },

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["food", "all"] });
    },

    onError: (error) => {
      console.log(error);
      console.log(error.message);
    },
  });

  return { deleteFood, data, isLoading, error };
};
