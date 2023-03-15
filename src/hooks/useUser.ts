import { IUser } from "@/models/user";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const getUser = async (): Promise<{ status: "OK" | "ERROR"; user: IUser }> => {
  return axios.get("/api/auth/info");
};

export const useUser = () => {
  return useQuery(["current-user"], getUser);
};
