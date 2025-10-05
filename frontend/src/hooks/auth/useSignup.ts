import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "../api";
import api from "../api";
import { mockUser } from "../food/mockData";

export interface SignupArgs {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activity_level: ActivityLevel;
}

const signupApi = async (payload: SignupArgs): Promise<User> => {
  if (import.meta.env.VITE_ENV === "mock") {
    return mockUser;
  }
  const res = await api.post("/signup", payload);
  return res.data;
};

export const useSignup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: signup,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (payload: SignupArgs) => {
      console.log(payload);
      return signupApi(payload);
    },

    onSuccess: (res) => {
      queryClient.setQueryData(["user"], res);
      navigate(`/home`);
    },

    onError: (error) => {
      console.log(error)
      console.error("Error with signup");
    },
  });

  return { signup, isLoading, error };
};
