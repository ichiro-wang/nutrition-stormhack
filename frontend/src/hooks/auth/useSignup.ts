import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "../api";
import api from "../api";

export interface SignupArgs {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activityLevel: ActivityLevel;
}

const signupApi = async (payload: SignupArgs): Promise<User> => {
  if (import.meta.env.VITE_ENV === "mock") {
    return {
      id: 1,
      ...payload,
    };
  }
  const res = await api.post("/signup", payload);
  return res.data;
};

export const useSignup = () => {
  const navigate = useNavigate();

  const {
    mutate: signup,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (payload: SignupArgs) => {
      console.log(payload);
      return signupApi(payload);
    },

    onSuccess: () => {
      navigate(`/home`);
    },

    onError: (error) => {
      console.error("Error with signup");
    },
  });

  return { signup, isLoading, error };
};
