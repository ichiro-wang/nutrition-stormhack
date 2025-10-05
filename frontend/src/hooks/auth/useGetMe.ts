import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { mockUser } from "../food/mockData";

const getMe = async (): Promise<User> => {
  if (import.meta.env.VITE_ENV === "mock") {
    return mockUser;
  }

  console.log("get me");
  const res = await api.get("/get-user");
  return res.data;
};

export const useGetMe = () => {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      console.log("get me");
      return getMe();
    },
    retry: false,
  });

  return { user, isLoading, error, refetch };
};
