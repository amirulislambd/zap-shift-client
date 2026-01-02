import React, { useState, useEffect } from "react";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    phone: "",
    address: "",
    photoURL: "",
    coverURL: "",
  });
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [previewCover, setPreviewCover] = useState("");

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Firebase token if needed
          },
        })
        .then((res) => {
          const data = res.data;
          setFormData({
            displayName: data.displayName || "",
            phone: data.phone || "",
            address: data.address || "",
            photoURL: data.photoURL || "",
            coverURL: data.coverURL || "",
          });
          setPreviewPhoto(data.photoURL || "/default-avatar.png");
          setPreviewCover(data.coverURL || "/default-cover.jpg");
        })
        .catch((err) => console.error("Failed to fetch user:", err));
    }
  }, [user, axiosSecure]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewPhoto(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, photoFile: file }));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewCover(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, coverFile: file }));
    }
  };

  const handleCancel = () => {
    setShowEdit(false);
    setPreviewPhoto(formData.photoURL || "/default-avatar.png");
    setPreviewCover(formData.coverURL || "/default-cover.jpg");
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("displayName", formData.displayName);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      if (formData.photoFile) data.append("photo", formData.photoFile);
      if (formData.coverFile) data.append("cover", formData.coverFile);

      const res = await axiosSecure.patch("/users/update-profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Firebase token if needed
        },
      });

      if (res.data.success) {
        alert("Profile updated successfully!");
        setFormData((prev) => ({
          ...prev,
          photoURL: previewPhoto,
          coverURL: previewCover,
        }));
        setShowEdit(false);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-gray-900">
      {/* Cover */}
      <div className="relative h-64 bg-gray-300 rounded-b-xl overflow-hidden">
        <img
          src={previewCover}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {showEdit && (
          <label className="absolute top-2 right-2 bg-white p-1 rounded cursor-pointer">
            Edit Cover
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </label>
        )}
      </div>

      {/* Avatar & Info */}
      <div className="px-4 md:px-8 -mt-16 flex flex-col md:flex-row items-center md:items-end gap-4">
        <div className="relative">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full ring ring-white overflow-hidden">
            <img
              src={previewPhoto}
              alt="Avatar"
              className="object-cover w-full h-full"
            />
          </div>
          {showEdit && (
            <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer">
              ✎
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          )}
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-bold">
            {formData.displayName || "User"}
          </h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end px-4 md:px-8 mt-4 gap-2">
        {showEdit ? (
          <>
            <button
              onClick={handleCancel}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowEdit(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Edit Form */}
      {showEdit && (
        <div className="bg-white shadow rounded-xl p-6 mt-6 mx-4 md:mx-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="text-gray-700 font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-gray-700 font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
