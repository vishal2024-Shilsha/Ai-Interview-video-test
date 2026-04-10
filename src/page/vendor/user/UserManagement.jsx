import { useEffect, useState } from "react";
import UserForm from "./UserForm";
import ImportUsers from "./ImportUsers";
import { useActiveInactiveCandidateMutation, useAddCampusVendorMutation, useAddVendorMutation, useDeleteCandidateByCandidateIdMutation, useGetAllUserByVendorQuery, useImportCampusVendorMutation, useImportVendorMutation, useSendTestLinkToUserMutation } from "../../../redux/services/vendorApi";
import { Trash2 } from "lucide-react";
import profileImg from '../../../assets/userImg.jpg'
import useDebounce from "../../../libs/useDebounce";
import Loader from "../../../libs/Loader";
import toast from "react-hot-toast";
import { useGetCountryDataQuery } from "../../../redux/services/externalApi";
import { useAddCandidateBySubVendorMutation, useGetAllCandidatesBySubVendorQuery, useImportCandidateBySubVendorMutation, useSendTestLinkToCandidatesMutation } from "../../../redux/services/subvendorApi";
import { Tooltip } from 'react-tooltip'
import CustomModal from "../../../libs/CustomModal";

export default function UserManagement() {
  const role = localStorage.getItem('role')
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [filterNationality, setFilterNationality] = useState("");
  const [filterResidence, setFilterResidence] = useState("");
  const debouncedQuery = useDebounce(search, 500);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeDeactiveModal, setActiveDeactiveModal] = useState(false);

  // NEW STATES
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showSendLinkModal, setShowSendLinkModal] = useState(false);
  const [isCheckboxEnabled, setIsCheckboxEnabled] = useState(false);
  const [showactiveInactiveModal, setShowActiveInactiveModal] = useState(false);
  // Your existing API hooks
  const [addVendor, { isLoading: isVendorAdding }] = role == "sub_vendor" ? useAddCandidateBySubVendorMutation() : useAddVendorMutation();
  const [importVendor, { isLoading: isVendorImporting }] = role == "sub_vendor" ? useImportCandidateBySubVendorMutation() : useImportVendorMutation();
  const [addCampusVendor, { isLoading: isCampusLoading }] = useAddCampusVendorMutation()
  const [addImportVendor, { isLoading: isCampusImporting }] = useImportCampusVendorMutation()

  const { data, isLoading, error } = role == "sub_vendor" ? useGetAllCandidatesBySubVendorQuery({ page, pageSize, search: debouncedQuery, filterNationality, filterResidence },
    { refetchOnMountOrArgChange: false }) : useGetAllUserByVendorQuery(
      { page, pageSize, search: debouncedQuery, filterNationality, filterResidence },
      { refetchOnMountOrArgChange: false }
    );
  const { data: countryData, isLoading: countryLoading } = useGetCountryDataQuery();

  // console.log("isError",error);
  if (error?.status === 401) {
    window.location.href = '/login';
    localStorage.clear()
    return;
  }

  const users = data?.candidates ?? [];
  const total = data?.total ?? 0;

  // console.log("dil",data)

  // RESET PAGE WHEN FILTERS CHANGE
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, filterNationality, filterResidence, pageSize]);


  /** -----------------------------
   * MULTI SELECT LOGIC
   * ----------------------------- */
  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const validUsers = users.filter((u) => !u?.cooldown_active);
    const currentIds = validUsers.map((u) => u.id);
    const allSelected = currentIds.every((id) => selectedUsers.includes(id));

    if (allSelected) {
      setSelectedUsers((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedUsers((prev) => [...new Set([...prev, ...currentIds])]);
    }

  };

  /** -----------------------------
   * SEND LINK HANDLER
   * ----------------------------- */
  const [sendTestLinkToUser, { isLoading: isTestWorking }] = localStorage.getItem('role') == "sub_vendor" ? useSendTestLinkToCandidatesMutation() : useSendTestLinkToUserMutation();
  const [activateInactivateUser, { isLoading: userLoading }] = useActiveInactiveCandidateMutation()
  const handleSendLink = async () => {
    try {
      const result = await sendTestLinkToUser({ candidate_ids: selectedUsers }).unwrap();
      // console.log("send-link", result)
      if (result?.status) {
        setTimeout(() => {
          toast.success("Test link sent successfully !");
          setSelectedUsers([]);
          setIsCheckboxEnabled(prev => !prev);
          setShowSendLinkModal(false);
        }, 1000)

      }

    } catch (err) {
      console.log("ererer", err)
      toast.error(err?.data?.message ?? "Failed to send link");
    }
  };

  function openAddModal() {
    setShowAddModal(true);
  }

  /** -----------------------------
   * ADD / IMPORT USER
   * ----------------------------- */
  const moduleType = localStorage.getItem('module')

  async function handleFormSubmit(data, status = false) {
    const formdata = new FormData();
    if (status) {
      formdata.append('file', data);
    } else {
      const { first_name, last_name, email, mobile, nationality, country_of_residence, birth_country,
        university_name,
        college_name,
        degree,
        specialization,
        enrollment_year,
        graduation_year,
        cgpa,
        roll_number,
        department,
        is_persuing
      } = data;
      formdata.append('first_name', first_name);
      formdata.append('last_name', last_name);
      formdata.append('email', email);
      formdata.append('mobile', mobile);
      formdata.append('birth_country', birth_country);
      formdata.append('country_of_residence', country_of_residence);
      formdata.append('nationality', nationality);
      // 🎓 Campus-only fields
      if (moduleType === "campus") {
        formdata.append("university_name", university_name);
        formdata.append("college_name", college_name);
        formdata.append("degree", degree);
        formdata.append("specialization", specialization);
        formdata.append("enrollment_year", enrollment_year);
        formdata.append("graduation_year", graduation_year);
        formdata.append("cgpa", cgpa);
        formdata.append("roll_number", roll_number);
        formdata.append("department", department);
        formdata.append("is_pursuing",is_persuing)
      }
    }

    try {
      const result = !status ? moduleType == "campus" ? await addCampusVendor(formdata) : await addVendor(formdata).unwrap() : moduleType == "campus" ? await addImportVendor(formdata) : await importVendor(formdata).unwrap();
      if (result?.error) {
        // console.log("eww", result)
        return toast.error(result?.error?.data?.detail ?? "Pls Fill Correct Info")
      }
      if (result?.data?.status) toast.success(result?.data?.message ?? "CAndidate Added Successfully");

      if (!status) setShowAddModal(false);
      else setShowImportModal(false);



    } catch (err) {
      console.log("first-err", err)
      toast.error(err?.data?.detail ?? "Internal Server Error")
    }
  }
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteCandidateByCandidateIdMutation();
  const [deleteUserDetails, setDeleteUserDetails] = useState(null);

  async function handleDelete() {
    try {
      const result = await deleteUser(deleteUserDetails?.id).unwrap?.();
      // console.log("res", result);
      if (result) {
        setTimeout(() => {
          toast.success(result?.message)
        }, 100)
        setShowDeleteModal(false)
      }
    } catch (err) {
      toast.error(err?.message ?? "Something went wrong")
      // console.error(err);
    }
  }

  async function handleActiveInactive() {
    // console.log("partner",deleteUserDetails) 
    const data = {
      candidate_ids: [deleteUserDetails?.id],
      is_active: !deleteUserDetails?.is_active
    }
    try {
      const result = await activateInactivateUser(data).unwrap?.();
      // console.log("res", result);
      if (result) {
        setTimeout(() => {
          toast.success(result?.message)
        }, 100)
        setShowActiveInactiveModal(false)
        setDeleteUserDetails(null)
      }
    } catch (err) {
      toast.error(err?.message ?? "Something went wrong")
      // console.error(err);
    }
  }

  return (
    <div className="p-6 pt-3 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-baseline mb-5">
          <div className="">
            <h1 className="text-xl font-semibold text-[#286a94]">Candidate Management</h1>
            <p className="text-sm pt-0.5 text-gray-500">Search, filter, import and manage candidates</p>
          </div>
        </div>


        {/* Filters + Buttons */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          {
            <div className="flex flex-wrap items-center gap-3">

              {/* Search */}
              <label className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow shadow-[#dcdedf]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1111.196 3.094l3.85 3.85a1 1 0 01-1.414 1.414l-3.85-3.85A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email or phone"
                  className="outline-none w-64 placeholder:text-[#286a94]"
                />
              </label>

              {/* Filters */}
              <select value={filterNationality} onChange={(e) => setFilterNationality(e.target.value)}
                className="px-3 py-2 outline-none w-48  rounded-md shadow shadow-[#dcdedf] text-[#286a94] bg-white">
                <option value="">Nationality (All)</option>
                {
                  countryData?.data?.length > 0 &&
                  countryData?.data?.map((item) => (
                    <option value={item?.name}>{item?.name}</option>
                  ))
                }
              </select>

              <select value={filterResidence} onChange={(e) => setFilterResidence(e.target.value)}
                className="px-3 py-2 w-48 rounded-md shadow shadow-[#dcdedf] text-[#286a94] bg-white">
                <option value="" >Country of Residence (All)</option>
                {
                  countryData?.data?.length > 0 &&
                  countryData?.data?.map((item) => (
                    <option value={item?.name}>{item?.name}</option>
                  ))
                }
              </select>

            </div>
          }


          <div className="flex items-center gap-2">
            {/* NEW BUTTON */}



            <button onClick={openAddModal} className="px-4 py-2 cursor-pointer rounded-md bg-[#5197c2] text-white shadow">
              Add Candidate
            </button>

            <label onClick={() => setShowImportModal(true)}
              className="px-4 py-2 rounded-md shadow-md cursor-pointer bg-[#5197c2] text-white">
              Import CSV
            </label>


          </div>
        </div>


        {/* TABLE */}
        <div className="bg-white rounded-lg shadow  ">
          {
            data?.is_flag &&
            <div className="pt-2">
              <button
                data-tooltip-variant="warning"
                disabled={users?.length === 0}
                onClick={() => {
                  setIsCheckboxEnabled(prev => !prev);
                  setSelectedUsers([]);
                }}
                className="px-4 mx-2 py-2 mb-2 rounded-md disabled:bg-[#b1c9d8] bg-[#5197c2] cursor-pointer text-white shadow"
              >
                {isCheckboxEnabled ? "Cancel" : "Send Test Link"}
              </button>
              {
                isCheckboxEnabled &&
                <button
                  disabled={selectedUsers.length === 0}
                  onClick={() => setShowSendLinkModal(true)}
                  className={`px-4 py-2 mx-3 rounded-md shadow text-white ${selectedUsers.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-green-600"
                    }`}
                >
                  Send
                </button>
              }
            </div>
          }


          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">

              {/* HEADER */}
              <thead className="bg-gray-100">
                <tr>
                  {isCheckboxEnabled && (
                    <th className="px-6 py-3 w-12">
                      <input
                        type="checkbox"
                        onChange={toggleSelectAll}
                        checked={
                          users.length > 0 &&
                          users.every(u => selectedUsers.includes(u.id))
                        }
                      />
                    </th>
                  )}

                  <th className="px-6 py-3 w-52 text- text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 w-40 text- text-sm font-medium text-gray-500">Nationality</th>
                  <th className="px-6 py-3 w-80 whitespace-nowrap text-sm font-medium text-gray-500">
                    Residence Country
                  </th>
                  <th className="px-6 py-3 w-40 text- text-sm font-medium text-gray-500">Mobile</th>
                  <th className="px-6 py-3 w-56 text- text-sm font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 w-40 text- text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 w-80 whitespace-nowrap text- text-sm font-medium text-gray-500">Test Count</th>
                  <th className="px-6 py-3 w-32 whitespace-nowrap text- text-sm font-medium text-gray-500">Send Link</th>
                  <th className="px-6 py-3 w-32 text- text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="bg-white divide-y divide-gray-300">
                {isLoading ? (
                  <tr>
                    <td colSpan={isCheckboxEnabled ? 10 : 9} className="px-6 py-8 text-center text-gray-500">
                      <Loader />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={isCheckboxEnabled ? 10 : 9} className="px-6 py-8 text-center text-gray-500">
                      No candidates found — try adjusting filters or importing a CSV
                    </td>
                  </tr>
                ) : (
                  users.map((u, index) => (
                    <tr key={u.id} className={`text-sm text-center text-gray-600 ${(index % 2 === 0) ? 'bg-gray-50' : ''}`}>

                      {/* CHECKBOX */}
                      {isCheckboxEnabled && (
                        <td className="px-6 py-4">
                          <input
                            id={`not-clickable-${u.id}`}
                            type="checkbox"
                            disabled={u?.cooldown_active}
                            checked={selectedUsers.includes(u.id)}
                            onChange={() => toggleSelectUser(u.id)}
                          />

                          {u?.cooldown_active && (
                            <Tooltip
                              anchorSelect={`#not-clickable-${u.id}`}
                              style={{ zIndex: "999999" }}
                              place="bottom"
                            >
                              {`You have already sent the link. Please try after ${u?.cooldown_remaining_minutes} minutes`}
                            </Tooltip>
                          )}
                        </td>
                      )}

                      {/* NAME */}
                      <td className="px-6 py-4">
                        <div className=" text-nowrap">
                          <div className="font-medium text-xs">
                            {u.first_name} {u.last_name}
                          </div>
                          <div className="text-xs text-gray-400">
                            Joined: {u.created_at
                              ? new Date(u.created_at).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                              : "-"}
                          </div>
                        </div>
                      </td>

                      {/* NATIONALITY */}
                      <td className="px-6 py-4">{u.nationality}</td>

                      {/* COUNTRY */}
                      <td className="px-6 py-4">{u.country_of_residence}</td>

                      {/* MOBILE */}
                      <td className="px-6 py-4">{'+' + u.mobile}</td>

                      {/* EMAIL */}
                      <td className="px-6 py-4 truncate max-w-[220px]">{u.email}</td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${u?.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {u?.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {/* TEST COUNT */}
                      <td className="px-6 py-4">{u.test_sent_count ?? 0}</td>

                      {/* DISABLED */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${!u?.is_disabled
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {!u?.is_disabled ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {/* ACTION */}
                      <td className="px-6 py-4 text-right">
                        {
                          u?.test_sent_count > 0 ?
                            <button
                              onClick={() => [setDeleteUserDetails(u), setShowActiveInactiveModal(true)]}
                              className={`px-3 text-xs cursor-pointer py-2 rounded font- text-white ${u?.is_active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                } transition-colors`}
                            >
                              {u?.is_active ? "Deactivate" : "Activate"}
                            </button> : <Trash2
                              onClick={() => [setDeleteUserDetails(u), setShowDeleteModal(true)]}
                              size={17}
                              color="red"
                              className="cursor-pointer"
                            />
                        }

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>


          {/* Pagination */}
          {
            users?.length > 0 &&
            <div className="p-4 flex items-center justify-between">
              <div className="text-sm text-[#286a94]">
                Showing {Math.min((page - 1) * pageSize + 1, total)}-
                {Math.min(page * pageSize, total)} of {total} users
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#286a94]">Rows</span>
                  <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}
                    className="px-2 py-1 rounded-md border border-[#286a94] text-[#286a94] bg-white">
                    {[10, 20, 50].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <Pagination page={page} totalPages={data?.total_pages} setPage={setPage} />
              </div>
            </div>
          }

        </div>


        {/* Add Modal */}
        {showAddModal && (
          <UserForm onSubmit={handleFormSubmit} isVendorAdding={isVendorAdding} onClose={() => setShowAddModal(false)} />
        )}

        {/* Import Modal */}
        {showImportModal && (
          <ImportUsers onSubmit={handleFormSubmit} isVendorImporting={isVendorImporting} onClose={() => setShowImportModal(false)} />
        )}

        {/* SEND LINK CONFIRMATION MODAL */}
        <CustomModal
          isOpen={showSendLinkModal}
          onClose={() => setShowSendLinkModal(false)}
          onConfirm={handleSendLink}
          title="Send Test Link"
          confirmText="Yes, Send"
          loading={isTestWorking}
        >
          Are you sure you want to send the test link to{" "}
          <b>{selectedUsers.length}</b> selected users?
        </CustomModal>


        {/*  DELETE FUNCTONALITY FOR CANDIDATES */}
        <CustomModal
          isOpen={showDeleteModal}
          onClose={() => [setShowDeleteModal(false), setDeleteUserDetails(null)]}
          onConfirm={handleDelete}
          title="Delete Candidate"
          confirmText="Yes, Delete"
          loading={deleteLoading}
        >
          Are you sure you want to delete this candidate?

          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
            <p className="font-semibold text-red-700">
              {deleteUserDetails?.first_name} {deleteUserDetails?.last_name}
            </p>
            <p className="text-sm text-gray-600">
              {deleteUserDetails?.email}
            </p>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </CustomModal>

        {/* ACTIVATE INACTIVATE FUNCTIONALITY FOR CANDIDATES */}
        <CustomModal
          isOpen={showactiveInactiveModal}
          onClose={() => [setShowActiveInactiveModal(false), setDeleteUserDetails(null)]}
          onConfirm={handleActiveInactive}
          title={`${deleteUserDetails?.is_active ? `Deactivate Candidate` : 'Activate Candidate  '}`}
          confirmText={`${deleteUserDetails?.is_active ? `Yes, Deactivate` : 'Yes, Activate  '}`}
          loading={userLoading}
        >
          {`Are you sure you want to ${deleteUserDetails?.is_active ? 'Deactivate' : 'Activate'}  this candidate?`}

          <div
            className={`mt-3 p-3 border rounded ${deleteUserDetails?.is_active
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
              }`}
          >
            <p
              className={`font-semibold ${deleteUserDetails?.is_active ? "text-red-700" : "text-green-700"
                }`}
            >
              {deleteUserDetails?.first_name} {deleteUserDetails?.last_name}
            </p>
            <p className="text-sm text-gray-600">
              {deleteUserDetails?.email}
            </p>
          </div>


        </CustomModal>

      </div>
    </div>
  );
}


export function Pagination({ page = 0, totalPages = 0, setPage }) {
  return (
    <div className="flex items-center gap-2">
      {/* Prev */}
      <button
        className="px-3 py-1 rounded-md border border-[#286a94] text-[#286a94] bg-white hover:bg-gray-50 disabled:opacity-50"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>

      {/* Current page button */}
      <button
        className="px-3 py-1 rounded-md border bg-[#598aa8] text-white border-[#598aa8]"
        disabled
      >
        {page}
      </button>

      {/* Total pages */}
      <span className="px- text-[#286a94]">of {totalPages}</span>

      {/* Next */}
      <button
        className="px-3 py-1 rounded-md border border-[#286a94] text-[#286a94] bg-white hover:bg-gray-50 disabled:opacity-50"
        onClick={() => setPage(page + 1)}
        disabled={(totalPages === 0) || totalPages === page}
      >
        Next
      </button>
    </div>
  );
}



