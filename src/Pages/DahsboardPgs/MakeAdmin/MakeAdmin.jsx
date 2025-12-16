import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { MdAdminPanelSettings, MdPersonRemove } from "react-icons/md";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [email, setEmail] = useState("");

  // 🔍 SEARCH USER (PARTIAL EMAIL SEARCH)
  const {
    data: users = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["searchUser", email],
    enabled: email.trim().length > 0,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/users/search?email=${email}`);
      return res.data;
    },
  });

  // ✅ MAKE ADMIN
  const handleMakeAdmin = async (id) => {
    try {
      await axiosSecure.patch(`/api/users/make-admin/${id}`);
      Swal.fire({
        icon: "success",
        title: "User is now Admin",
        timer: 1500,
        showConfirmButton: false,
      });
      refetch();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  // ❌ REMOVE ADMIN
  const handleRemoveAdmin = async (id) => {
    try {
      await axiosSecure.patch(`/api/users/remove-admin/${id}`);
      Swal.fire({
        icon: "success",
        title: "Admin role removed",
        timer: 1500,
        showConfirmButton: false,
      });
      refetch();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4">Make Admin</h2>

      {/* 🔍 Search Box */}
      <div className="max-w-md mb-6">
        <input
          type="text"
          placeholder="Search by email (type anything)"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* SEARCH STATUS */}
      {isFetching && <p>Searching...</p>}

      {email && users.length === 0 && !isFetching && (
        <p className="text-red-500">No user found</p>
      )}

      {/* ================= DESKTOP TABLE ================= */}
      {users.length > 0 && (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.email}</td>
                    <td className="capitalize">{user.role || "user"}</td>
                    <td>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "-"}
                    </td>
                    <td className="text-center flex justify-center gap-2">
                      {user.role === "admin" ? (
                        <button
                          onClick={() => handleRemoveAdmin(user._id)}
                          className="btn btn-sm btn-error flex items-center gap-1"
                        >
                          <MdPersonRemove /> Remove Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMakeAdmin(user._id)}
                          className="btn btn-sm btn-success flex items-center gap-1"
                        >
                          <MdAdminPanelSettings /> Make Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE VIEW ================= */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {users.map((user) => (
              <div
                key={user._id}
                className="border rounded-lg p-4 shadow-sm space-y-2"
              >
                <p>
                  <b>Email:</b> {user.email}
                </p>
                <p>
                  <b>Role:</b> {user.role || "user"}
                </p>
                <p>
                  <b>Created At:</b>{" "}
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "-"}
                </p>

                <div className="flex justify-end gap-2">
                  {user.role === "admin" ? (
                    <button
                      onClick={() => handleRemoveAdmin(user._id)}
                      className="btn btn-sm btn-error"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMakeAdmin(user._id)}
                      className="btn btn-sm btn-success"
                    >
                      Make
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MakeAdmin;
