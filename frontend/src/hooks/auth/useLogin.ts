import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "../api";
import api from "../api";

export interface LoginArgs {
  name: string;
}

const loginApi = async (payload: LoginArgs): Promise<User> => {
  if (import.meta.env.VITE_ENV === "mock") {
    return {
      id: 1,
      name: "John",
      age: 25,
      weight: 75,
      height: 180,
      activityLevel: "Moderately active",
      gender: "Male",
    };
  }

  const res = await api.post("/login", payload);
  return res.data;
};

export const useLogin = () => {
  const navigate = useNavigate();

  const {
    mutate: login,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (payload: LoginArgs) => {
      console.log(payload);
      return loginApi(payload);
    },

    onSuccess: () => {
      navigate(`/home`);
    },

    onError: (error) => {
      console.error("Error with signup");
    },
  });

  return { login, isLoading, error };
};
