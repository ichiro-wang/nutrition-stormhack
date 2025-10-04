import { useMutation } from "@tanstack/react-query";
import api from "../api";

export interface UploadArgs {
  image: File;
  name: string;
  qty: number;
  date: Date;
}

const uploadApi = async (payload: UploadArgs) => {
  if (import.meta.env.VITE_ENV === "mock") {
    return { id: 1 };
  }

  const formData = new FormData();
  formData.append("image", payload.image); // image should be file
  formData.append("name", payload.name);
  formData.append("qty", String(payload.qty));
  formData.append("date", payload.date.toISOString());

  const res = await api.post("/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const useUpload = () => {
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

    onSuccess: (res) => {},

    onError: (error) => {
      console.log(error.message);
    },
  });

  return { upload, food, isLoading, error };
};
