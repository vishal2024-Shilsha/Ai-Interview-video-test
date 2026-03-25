import { useSubvendorDashboardApiQuery } from "../../redux/services/subvendorApi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";

const DashboardContent = () => {
  const navigate=useNavigate()

  const {data,isLoading,isError} = useSubvendorDashboardApiQuery()
  console.log("dashaboard-details",data);

  const recentCredits = data?.credits_summary?.plans;
  const recentUsers = data?.recent_candidates;
  const lineChartData = data?.charts?.lineChartData ?? []
  const userData = data?.charts?.barChartData ?? []
  const statsCards = [
    { title: 'Credits Left', value: data?.stats?.credits_remaining ?? 0 },
    { title: 'Credit Used', value: data?.stats?.credits_used ?? 0 },
    { title: 'Total Candidates', value: data?.stats?.total_candidates??0 },
    { title: 'Total Test', value: data?.stats?.total_tests },
  ];

  if(isLoading){
    return <>Loasd</>
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 pt-5 font-inter text-gray-800">
      
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
                <div className="text-xl font-semibold text-[#286a94] mb-4">Recently Assigned Subscription</div>
                {/* <button
                  onClick={() => navigate('/subvendor/subscription/view')}
                  className=" text-sm  px-4 rounded-md bg-[#286a94] hover:bg-[#357ba7] cursor-pointer text-white border-none h-7">View All</button> */}
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
                <h3 className="text-xl font-semibold text-[#286a94] mb-4">Recently Added Candidates</h3>
                <button
                  onClick={() => navigate('/subvendor/user-management')}
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
                  userData?.length > 0 ?
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
                  </div>:<div className=" text-sm">N/A</div>
                }
      
              </motion.div>
      
              {/* ---------------------- LINE GRAPH ---------------------- */}
              <motion.div className="bg-white w-full lg:w-[49%] border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
                <h3 className=" font-semibold text-[#286a94] mb-4">New Users Growth</h3>
                {
                  lineChartData?.length > 0 ?
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
                  </div>:<div className=" text-sm">N/A</div>
                }
              </motion.div>
      
      
            </section>
      
    </div>
  );
};

export default DashboardContent;
