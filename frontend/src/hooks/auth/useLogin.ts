import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "../api";
import api from "../api";
import { mockUser } from "../food/mockData";

export interface LoginArgs {
  name: string;
}

const loginApi = async (payload: LoginArgs): Promise<User> => {
  if (import.meta.env.VITE_ENV === "mock") {
    console.log("loginmock");
    return mockUser;
  }

  console.log("logindev");
  const res = await api.post("/login", payload);
  return res.data;
};

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: login,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (payload: LoginArgs) => {
      console.log(payload);
      return loginApi(payload);
    },

    onSuccess: (res) => {
      queryClient.setQueryData(["user"], res);
      navigate(`/home`);
    },

    onError: (error) => {
      console.error("Error with login");
    },
  });

  return { login, isLoading, error };
};
