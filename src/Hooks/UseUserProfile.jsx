// useUserProfile.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useUserProfile = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, refetch } = useQuery(
    ["userProfile"],
    async () => {
      const res = await axiosSecure.get("/users/me");
      return res.data;
    }
  );

  const updateProfile = useMutation(
    async (formData) => {
      const res = await axiosSecure.patch("/users/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["userProfile"]);
      }
    }
  );

  return { profile, isLoading, refetch, updateProfile };
};

export default useUserProfile;
