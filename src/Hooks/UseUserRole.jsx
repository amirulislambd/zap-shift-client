import { useQuery } from "@tanstack/react-query";
import useAuth from "./UseAuth"; // your Firebase auth hook
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth(); // Firebase user object
  const axiosSecure = useAxiosSecure();

  const query = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;

      const response = await axiosSecure.get("/users/role", {
        params: { email: user.email },
      });

      return response.data.role; // 'user' | 'admin' | 'rider'
    },
    enabled: !authLoading && !!user?.email, // only fetch if auth is done and email exists
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 1,
  });

  return {
    role: query.data,
    isLoading: authLoading || query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export default useUserRole;
