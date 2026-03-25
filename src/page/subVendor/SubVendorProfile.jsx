import { useState } from "react";
import { useSubvendorProfileQuery } from "../../redux/services/subvendorApi";
import { useForm } from "react-hook-form";
import Loader from "../../libs/Loader";
import { UserRoundPen } from "lucide-react";

const ProfileSection = () => {
  const { data, isLoading } = useSubvendorProfileQuery()
  const [open, setOpen] = useState(false)



  const { subvendor, vendor, company } = data || {};

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: subvendor?.name || "",
      phone: subvendor?.phone || "",
      address: subvendor?.sub_vendor_address || "",
      gender: subvendor?.gender || "",
    },
  });

  const handleOpen = () => {
    reset({
      name: subvendor?.name,
      phone: subvendor?.phone,
      address: subvendor?.sub_vendor_address,
      gender: subvendor?.gender,
    });
    setOpen(true);
  };


  const onSubmit = async (formDataValues) => {
    try {

      const formData = new FormData();
      formData.append(
        "subvendor",
        JSON.stringify({
          name: formDataValues.name,
          phone: formDataValues.phone,
          address: formDataValues.address,
          gender: formDataValues.gender,
        })
      );

      const res = await fetch("http://localhost:8000/profile", {
        method: "PUT",
        headers: {
          Authorization: "Bearer YOUR_ACCESS_TOKEN",
        },
        body: formData,
      });

      const result = await res.json();
      console.log("Updated:", result);

      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-3">
        <Loader />
        <p className="text-gray-500 text-sm">Loading, please wait...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">

        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">

          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
            {subvendor?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left ">
            <div className="flex items-start justify-between bg-white p-4 rounded-xl shadow-sm">
              {/* Left Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {subvendor?.name || "N/A"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {subvendor?.email || "No email available"}
                </p>
              </div>

              {/* Right Section */}
              <button
              onClick={handleOpen}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer text-white bg-blue-900 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <UserRoundPen size={16} />
                Edit
              </button>
            </div>


            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
              <p><span className="font-medium">Phone:</span> {subvendor?.phone || "N/A"}</p>
              <p><span className="font-medium">Gender:</span> {subvendor?.gender || "N/A"}</p>
              <p><span className="font-medium">Country:</span> {subvendor?.country || "N/A"}</p>
              <p><span className="font-medium">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${subvendor?.active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                  {subvendor?.active ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Address Information
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 text-gray-600 text-sm">
            <p><span className="font-medium">Company Address:</span> {subvendor?.company_address || "N/A"}</p>
            <p><span className="font-medium">Address:</span> {subvendor?.sub_vendor_address || "N/A"}</p>
          </div>
        </div>

        {/* Vendor Info */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Vendor Information
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 text-gray-600 text-sm">
            <p><span className="font-medium">Vendor Name:</span> {vendor?.name || "N/A"}</p>
            <p><span className="font-medium">Vendor Email:</span> {vendor?.email || "N/A"}</p>
            <p><span className="font-medium">Vendor Phone:</span> {vendor?.phone || "N/A"}</p>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Company Information
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 text-gray-600 text-sm">
            <p><span className="font-medium">Company Name:</span> {company?.company_name || "N/A"}</p>
            <p><span className="font-medium">Website:</span>
              <a
                href={company?.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                {company?.website || "N/A"}
              </a>
            </p>
            <p><span className="font-medium">Registration No:</span> {company?.registration_number || "N/A"}</p>
            <p><span className="font-medium">Location:</span> {company?.location || "N/A"}</p>
          </div>
        </div>

      </div>
      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">

            <h2 className="text-xl font-semibold mb-4">
              Edit Profile
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Name */}
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  {...register("phone", { required: "Phone is required" })}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              {/* Address */}
              <div>
                <label className="text-sm text-gray-600">Address</label>
                <input
                  {...register("address")}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm text-gray-600">Gender</label>
                <select
                  {...register("gender")}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  //   disabled={loading}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {false ? "Updating..." : "Save Changes"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;