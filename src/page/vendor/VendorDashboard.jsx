import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import profileImg from '../../assets/userImg.jpg';
import { useVendorDashboardApiQuery } from "../../redux/services/vendorApi";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../libs/PageLoader";
import ErrorPage from "../../libs/ErrorPage";

export default function VendorDashboard() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useVendorDashboardApiQuery();
  // console.log("ddlljj", data);
  const recentCredits = data?.credits_summary?.plans;
  const recentUsers = data?.recent_candidates;
  const lineChartData = data?.charts?.lineChartData ?? []
  const userData = data?.charts?.barChartData ?? []
  const statsCards = [
    { title: 'Credits Left', value: data?.credits_summary?.total_remaining_credits ?? 0 },
    { title: 'Total Users', value: data?.candidates_summary?.total_candidates ?? 0 },
    // { title: 'Credits Used', value: 54 },
    // { title: 'Plan Expiry', value: '12 March 2025' },
  ];

  if (isLoading) {
    return <PageLoader />
  }

  if (isError) {
    return <ErrorPage />
  }

  // 1,2,2,3,3

  function duplicate(head) {
    let prev = head;
    while (prev !== null && prev.next !== null) {
      if (prev.data === prev.next.data) {
        prev.next = prev.next.next
      } else {
        prev = prev.next;
      }
    }
    return head;
  }
  //[1,2]

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 pt-5 font-inter text-gray-800">

      {/* ---------------------- PROFILE HEADER WITH IMAGE ---------------------- */}
      <motion.div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-10 flex items-center gap-8">
        <img src={profileImg} alt="Vendor Profile" className="w-32 h-32 rounded-2xl border border-gray-300 object-cover" />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-semibold text-[#286a94] mb-1">{data?.vendor?.name || 'N/A'}</h2>
              <p className="text-gray-500 text-sm mb-4">Vendor {data?.vendor?.id}</p>
            </div>
            <div>
              <button className=" p-2 text-sm bg-green-600 animate-pulse px-4 py-2 font-bold text-white rounded-xl">Upgrade your plan</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div><span className="font-medium text-gray-600">Email:</span> {data?.vendor?.email ?? "N/A"}</div>
            <div>
              <span className="font-medium text-gray-600">Phone:</span>{" "}
              {data?.vendor?.phone ? `+${data.vendor.phone}` : "N/A"}
            </div>
            <div><span className="font-medium text-gray-600">Country:</span> {data?.vendor?.country ?? 'N/A'}</div>
            {/* <div><span className="font-medium text-gray-600">Id:</span> {data?.vendor?.id}</div> */}
            {/* <div><span className="font-medium text-gray-600">Users:</span> 128</div> */}
            {/* <div><span className="font-medium text-gray-600">Credits Left:</span> 342</div> */}
          </div>
        </div>
      </motion.div>

      {/* ---------------------- STATS CARDS ---------------------- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsCards.map((card, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <p className="text-gray-400 text-xs tracking-wide mb-1 uppercase">{card.title}</p>
              <h3 className="text-2xl font-semibold text-[#286a94]">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </section>

      <motion.div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
        <div className="flex justify-between">
          <div className="text-xl font-semibold text-[#286a94] mb-4">Recently Subscription Details</div>
          <button
            onClick={() => navigate('/vendor/subscription/view')}
            className=" text-sm  px-4 rounded-md bg-[#286a94] hover:bg-[#357ba7] cursor-pointer text-white border-none h-7">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="py-3 px-4">Plan Name</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Remains Credit</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentCredits && recentCredits.length > 0 ? (
                recentCredits.map((user, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100 transition`}
                  >
                    <td className="py-3 px-4">{user?.plan_name || ''}</td>
                    <td className="py-3 px-4">{user?.country || ''}</td>
                    <td className="py-3 px-4">{user?.remaining_credits}</td>
                    <td className="py-3 px-4">
                      {user?.started_at
                        ? new Date(user.started_at).toLocaleString()
                        : ''}
                    </td>
                    <td className="py-3 px-4">
                      {user?.expires_at
                        ? new Date(user.expires_at).toLocaleString()
                        : ''}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>


      {/* ---------------------- RECENT USERS TABLE ---------------------- */}
      <motion.div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between">
          <h3 className="text-xl font-semibold text-[#286a94] mb-4">Recently Added Users</h3>
          <button
            onClick={() => navigate('/vendor/user-management')}
            className=" text-sm  px-4 rounded-md bg-[#286a94] hover:bg-[#357ba7] cursor-pointer text-white border-none h-7">View All</button>

        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Created At</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentUsers && recentUsers.length > 0 ? (
                recentUsers.map((user, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100 transition`}
                  >
                    <td className="py-3 px-4">{`${user?.first_name} ${user?.last_name}`}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.country}</td>
                    <td className="py-3 px-4">
                      {new Date(user?.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </motion.div>


      {/* ---------------------- BAR GRAPH ---------------------- */}
      <section className="flex justify-between mt-10">
        <motion.div className="bg-white w-full lg:w-[49%] border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
          <h3 className=" font-semibold text-[#286a94] mb-4">Monthly Users & Credits</h3>
          {
            userData?.length > 0 &&
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userData} barSize={25}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#1a80bb" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="credits" fill="#ea801c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          }

        </motion.div>

        {/* ---------------------- LINE GRAPH ---------------------- */}
        <motion.div className="bg-white w-full lg:w-[49%] border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
          <h3 className=" font-semibold text-[#286a94] mb-4">New Users Growth</h3>
          {
            lineChartData?.length > 0 &&
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="newUsers" stroke="#286a94" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          }
        </motion.div>


      </section>

    </div>
  );
}