import { useState } from 'react'
import { Pagination } from '../user/UserManagement'
import { useResultManagementDataQuery } from '../../../redux/services/vendorApi'
import profileImg from '../../../assets/userImg.jpg'
import { Eye } from 'lucide-react'
import ErrorPage from '../../../libs/ErrorPage'
import PageLoader from '../../../libs/PageLoader'
import { useNavigate } from 'react-router-dom'
import { base } from '../../../redux/services/api'
import toast from 'react-hot-toast'

const ResultManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [country, setCountry] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);


  const SCORE_RANGES = [
    { label: 'All Scores', min: '', max: '' },
    { label: 'Below 40%', min: 0, max: 0.39 },
    { label: '40% - 50%', min: 0.40, max: 0.50 },
    { label: '50% - 60%', min: 0.50, max: 0.60 },
    { label: 'Above 60%', min: 0.61, max: 1.0 },
  ];

  // Date filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Score filters
  const [minScore, setMinScore] = useState('');
  const [maxScore, setMaxScore] = useState('');

  const {
    data,
    isLoading,
    isError,
  } = useResultManagementDataQuery({
    limit: pageSize,
    page,
    search,
    country,
    minScore,
    maxScore,
    fromDate,
    toDate,
  });
  const users = data?.results ?? []
  const total = data?.total ?? 0

  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentIds = users.map((u) => u.candidate_id);
    const allSelected = currentIds.every((id) => selectedUsers.includes(id));

    if (allSelected) {
      setSelectedUsers((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedUsers((prev) => [...new Set([...prev, ...currentIds])]);
    }
  };
  const [pdfLoader, setPdfLoader] = useState(false);

  const downloadPDF = async () => {
    if (selectedUsers.length === 0) {
      return;
    }
    const data = {
      format: "pdf",
      candidate_ids: selectedUsers
    }

    try {
      setPdfLoader(true)
      const response = await fetch(`${base}/vendor/full/results/download`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Download failed');

      // Create blob from binary response

      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `candidate_result_.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSelectedUsers([])

    } catch (error) {
      toast.error(error?.message)
      console.error('Download error:', error?.message);
    } finally {
      setPdfLoader(false)
    }
  };


  if (isLoading) {
    return <PageLoader />
  }

  if (isError) {
    return <ErrorPage />
  }

  console.log("jojoj", selectedUsers)


  return (
    <div className="p-6 pt-3 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-5 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-[#286a94]">Result Management</h1>
              <p className="text-sm text-gray-500">
                Search, filter and see candidate result details
              </p>
            </div>
            <div>
              {
                selectedUsers?.length > 0 &&
                <button
                  onClick={downloadPDF}
                  className="h-10 w-32  rounded-md bg-[#4d77b9] text-white cursor-pointer text-sm hover:bg-[#6390d8] transition"

                >{pdfLoader ? 'Downloading' : 'Download Report'} </button>
              }

            </div>

          </div>

          {/* Filters */}
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 items-end">

            {/* Search */}
            <div className="flex flex-col col-span-2 gap-1">
              <label className="text-xs font-medium text-gray-700">Search</label>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Name, email or phone"
                className="h-10 px-3 rounded-md bg-white shadow outline-none"
              />
            </div>

            {/* Start Date */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="h-10 px-3 bg-white rounded-md shadow outline-none"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={toDate}
                min={fromDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="h-10 px-3 bg-white rounded-md shadow outline-none"
              />
            </div>

            {/* Score Range */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700 ">Score</label>
              <select
                onChange={(e) => {
                  const range = JSON.parse(e.target.value);
                  setMinScore(range.min);
                  setMaxScore(range.max);
                  setPage(1);
                }}
                className="h-10 bg-white px-3 rounded-md shadow outline-none"
              >
                <option value={JSON.stringify({ min: '', max: '' })}>
                  All Scores
                </option>
                <option value={JSON.stringify({ min: 0.0, max: 0.39 })}>Below 40%</option>
                <option value={JSON.stringify({ min: 0.40, max: 0.50 })}>40% - 50%</option>
                <option value={JSON.stringify({ min: 0.50, max: 0.60 })}>50% - 60%</option>
                <option value={JSON.stringify({ min: 0.61, max: 1.0 })}>Above 60%</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex flex-col gap-1">
              <label className="text-xs opacity-0">Reset</label>
              <button
                onClick={() => {
                  setSearch('');
                  setFromDate('');
                  setToDate('');
                  setMinScore('');
                  setMaxScore('');
                  setCountry('');
                  setPage(1);
                }}
                className="h-10 w-24  rounded-md bg-[#4d77b9] text-white cursor-pointer text-sm hover:bg-[#6390d8] transition"
              >
                Reset
              </button>
            </div>

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
                      checked={users.length > 0 && users.every(u => selectedUsers.includes(u.candidate_id))}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Test ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Residence Country</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Mobile</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Result</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-300">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500"><Loader /></td>
                  </tr>
                ) : users?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No users found — try adjusting filters or importing a CSV
                    </td>
                  </tr>
                ) : (users?.length > 0 &&
                  users?.map((u, index) => (
                    <tr key={u.id} className={`text-sm text-gray-600 ${(index & 1) == 0 ? ' bg-gray-50' : ''}`}>

                      {/* ROW CHECKBOX */}
                      <td className="px-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(u.candidate_id)}
                          onChange={() => toggleSelectUser(u.candidate_id)}
                        />
                      </td>
                      <td className="px-4 text-center py-4">{u?.test_number}</td>


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

                      {/* <td className="px-6 py-4">{u.nationality}</td> */}
                      <td className="px-6 py-4">{u.country_of_residence}</td>
                      <td className="px-6 py-4">{'+' + u.mobile}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">{Number(u.final_score * 100).toPrecision(4)}</td>

                      <td className="px-6 py-4">
                        <div className="flex cursor-pointer justify-center gap-3 items-center">
                          <Eye size={18} onClick={() => navigate(`/vendor/result-management/view?resultId=${u?.result_id}&candidateId=${u?.candidate_id}`)} />
                        </div>
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

      </div>
    </div>
  )
}

export default ResultManagement