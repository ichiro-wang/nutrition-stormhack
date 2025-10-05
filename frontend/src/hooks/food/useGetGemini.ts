// hooks/food/useGetFoodByDate.ts
import { useQuery } from "@tanstack/react-query";
import api from "../api";

const fetchGemini = async () => {
  const res = await api.post("/gemini"); 
  console.log("Gemini response:", res);
  return res.data;
};

export const useGetGemini = () => {
  const {
    data: geminiData,
    isLoading,
    isError,
    refetch,
  } = useQuery<{response:string}>({
    queryKey: ["gemini"],
    queryFn: fetchGemini,
  });

  return { geminiData, isLoading, isError, refetch };
};
