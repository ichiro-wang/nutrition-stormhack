import { useQuery } from "@tanstack/react-query";
import api from "../api";

export interface UserData {
  id: number;
  name: string;
  email: string;
  rec_calories?: number;
  rec_protein?: number;
  rec_carbs?: number;
  rec_fats?: number;
  // Add any other user-related fields
}

const fetchUser = async (): Promise<UserData> => {
  const res = await api.get("current-user"); 
  return res.data;
};

export const useGetUser = () => {
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserData>({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  return { user, isLoading, isError, refetch };
};
