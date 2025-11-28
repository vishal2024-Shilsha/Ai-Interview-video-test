import { useEffect, useState } from "react";
import UserForm from "./UserForm";
import ImportUsers from "./ImportUsers";
import { useAddVendorMutation, useGetAllUserByVendorQuery, useImportVendorMutation, useSendTestLinkToUserMutation } from "../../../redux/services/vendorApi";
import { Eye, Trash2 } from "lucide-react";
import profileImg from '../../../assets/userImg.jpg'
import useDebounce from "../../../libs/useDebounce";
import Loader from "../../../libs/Loader";
import toast from "react-hot-toast";


export default function UserManagement() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [filterNationality, setFilterNationality] = useState("");
  const [filterResidence, setFilterResidence] = useState("");
  const debouncedQuery = useDebounce(search, 500);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // NEW STATES
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showSendLinkModal, setShowSendLinkModal] = useState(false);

  // Your existing API hooks
  const [addVendor, { isLoading: isVendorAdding }] = useAddVendorMutation();
  const [importVendor, { isLoading: isVendorImporting }] = useImportVendorMutation();
  const { data, isLoading,error } = useGetAllUserByVendorQuery(
    { page, pageSize, search: debouncedQuery, filterNationality, filterResidence },
    { refetchOnMountOrArgChange: false }
  );

  console.log("isError",error);
  if(error?.status===401){
    window.location.href = '/';
    localStorage.clear()
    return;
  }

  const users = data?.candidates ?? [];
  const total = data?.total ?? 0;

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
    const currentIds = users.map((u) => u.id);
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
  const [sendTestLinkToUser,{isLoading : isTestWorking}] = useSendTestLinkToUserMutation(); // <--- your mutation

  const handleSendLink = async () => {
    try {
      const result = await sendTestLinkToUser({ candidate_ids: selectedUsers }).unwrap();
      console.log("send-link", result)
      if (result?.status) {
        setTimeout(() => {
          toast.success("Test link sent successfully !");
          setSelectedUsers([]);
          setShowSendLinkModal(false);
        }, 1000)

      }

    } catch (err) {
      toast.error("Failed to send link");
    }
  };

  function openAddModal() {
    setShowAddModal(true);
  }


  /** -----------------------------
   * ADD / IMPORT USER
   * ----------------------------- */
  async function handleFormSubmit(data, status = false) {
    const formdata = new FormData();
    if (status) {
      formdata.append('file', data);
    } else {
      const { firstName, lastName, email, mobileNumber, nationality, countryOfResidence, birthCountry } = data;
      formdata.append('first_name', firstName);
      formdata.append('last_name', lastName);
      formdata.append('email', email);
      formdata.append('mobile', mobileNumber);
      formdata.append('birth_country', birthCountry?.label);
      formdata.append('country_of_residence', countryOfResidence?.label);
      formdata.append('nationality', nationality?.label);
    }

    try {
      const result = !status ? await addVendor(formdata).unwrap() : await importVendor(formdata).unwrap();

      if (result?.status) toast.success("User Added Successfully..");

      if (!status) setShowAddModal(false);
      else setShowImportModal(false);

    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(userId) {
    try {
      await deleteUser(userId).unwrap?.();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6 pt-3 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-[#286a94]">User Management</h1>
          <p className="text-sm pt-0.5 text-gray-500">Search, filter, import and manage users</p>
        </div>

        {/* Filters + Buttons */}
        <div className="flex flex-wrap items-center justify-between mb-6">
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
              className="px-3 py-2 rounded-md shadow shadow-[#dcdedf] text-[#286a94] bg-white">
              <option value="">Nationality (All)</option>
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
            </select>

            <select value={filterResidence} onChange={(e) => setFilterResidence(e.target.value)}
              className="px-3 py-2 rounded-md shadow shadow-[#dcdedf] text-[#286a94] bg-white">
              <option value="">Country of Residence (All)</option>
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
            </select>

          </div>

          <div className="flex items-center gap-2">
            {/* NEW BUTTON */}
            {
              selectedUsers.length > 0 &&
              <button
                disabled={selectedUsers.length === 0}
                onClick={() => setShowSendLinkModal(true)}
                className={`px-4 py-2 rounded-md shadow text-white ${selectedUsers.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-green-600"
                  }`}
              >
                Send Test Link
              </button>
            }

            {
              selectedUsers.length === 0 &&
              <button onClick={openAddModal} className="px-4 py-2 rounded-md bg-[#5197c2] text-white shadow">
                Add User
              </button>
            }

            {
              selectedUsers.length === 0 &&
              <label onClick={() => setShowImportModal(true)}
                className="px-4 py-2 rounded-md shadow-md cursor-pointer bg-[#5197c2] text-white">
                Import CSV
              </label>
            }

          </div>
        </div>


        {/* TABLE */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  {/* NEW SELECT ALL COLUMN */}
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={users.length > 0 && users.every(u => selectedUsers.includes(u.id))}
                    />
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Nationality</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Residence Country</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Mobile</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-300">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500"><Loader /></td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No users found — try adjusting filters or importing a CSV
                    </td>
                  </tr>
                ) : (
                  users.map((u,index) => (
                    <tr key={u.id} className={`text-sm text-gray-600 ${(index&1)==0 ? ' bg-gray-50' : ''}`}>

                      {/* ROW CHECKBOX */}
                      <td className="px-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(u.id)}
                          onChange={() => toggleSelectUser(u.id)}
                        />
                      </td>

                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <img className="w-full h-full" src={profileImg} alt="img" />
                          </div>
                          <div>
                            <div className="font-medium">{u.first_name} {u.last_name}</div>
                            <div className="text-xs text-gray-400">
                              Joined: {u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">{u.nationality}</td>
                      <td className="px-6 py-4">{u.country_of_residence}</td>
                      <td className="px-6 py-4">{u.mobile}</td>
                      <td className="px-6 py-4">{u.email}</td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3 items-center">
                          <Eye size={17} />
                          <Trash2
                            onClick={() => handleDelete(u.id)}
                            size={17}
                            color="red"
                            className="cursor-pointer"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>


          {/* Pagination */}
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
        {showSendLinkModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold text-[#286a94] mb-3">Send Test Link</h2>
              <p className="text-gray-600 mb-5">
                Are you sure you want to send the test link to <b>{selectedUsers.length}</b> selected users?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowSendLinkModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-600"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSendLink}
                  className="px-4 py-2 rounded bg-[#286a94] text-white"
                >
                 {isTestWorking ? 'Sending' : 'Yes, Send'}
                </button>
              </div>
            </div>
          </div>
        )}

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



