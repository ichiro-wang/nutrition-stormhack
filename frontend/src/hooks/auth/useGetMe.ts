import { useQuery } from "@tanstack/react-query";
import api from "../api";

const getMe = async (): Promise<User> => {
  if (import.meta.env.VITE_ENV === "mock") {
    return {
      id: 1,
      name: "John",
      weight: 75,
      height: 180,
      activity_level: "Moderately active",
      age: 25,
      gender: "M",
    };
  }

  const res = await api.get("/me");
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
