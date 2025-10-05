import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { mockFoods } from "./mockData";

export interface UploadArgs {
  image: File;
  food_name: string;
  quantity: number;
  date_logged: Date;
}

const uploadApi = async (payload: UploadArgs): Promise<Food> => {
  if (import.meta.env.VITE_ENV === "mock") {
    return mockFoods[0];
  }

  const formData = new FormData();
  formData.append("image", payload.image); // image should be file
  formData.append("food_name", payload.food_name);
  formData.append("quantity", String(payload.quantity));
  formData.append("date", payload.date_logged.toISOString());

  const res = await api.post("/add-food", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const useUpload = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: upload,
    data: food,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (payload: UploadArgs) => {
      console.log(payload);
      return uploadApi(payload);
    },

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["food", "list"] });
      queryClient.setQueryData(["food", res.id], res);
      navigate("/home");
    },

    onError: (error) => {
      console.log(error);
      console.log(error.message);
    },
  });

  return { upload, food, isLoading, error };
};
