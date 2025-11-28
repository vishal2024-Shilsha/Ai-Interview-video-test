import React from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import profileImg from '../../assets/userImg.jpg'; // Vendor image placeholder

export default function VendorDashboard() {
  const recentUsers = [
    { name: "Rohit Sharma", email: "rohit@gmail.com", country: "India", phone: "+91 9876543210" },
    { name: "Simran Arora", email: "simran@gmail.com", country: "India", phone: "+91 8765432109" },
    { name: "Vijay Patel", email: "vijay@gmail.com", country: "India", phone: "+91 7654321098" },
  ];

  const userData = [
    { month: "Jan", users: 20, credits: 50 },
    { month: "Feb", users: 35, credits: 70 },
    { month: "Mar", users: 25, credits: 65 },
    { month: "Apr", users: 40, credits: 90 },
    { month: "May", users: 30, credits: 80 },
  ];

  const statsCards = [
    { title: 'Total Users', value: 128 },
    { title: 'Credits Left', value: 342 },
    { title: 'Credits Used', value: 54 },
    { title: 'Plan Expiry', value: '12 March 2025' },
  ];

  const lineChartData = [
    { month: 'Jan', newUsers: 5 },
    { month: 'Feb', newUsers: 10 },
    { month: 'Mar', newUsers: 15 },
    { month: 'Apr', newUsers: 20 },
    { month: 'May', newUsers: 25 },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 pt-5 font-inter text-gray-800">

      {/* ---------------------- PROFILE HEADER WITH IMAGE ---------------------- */}
      <motion.div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-10 flex items-center gap-8">
        <img src={profileImg} alt="Vendor Profile" className="w-32 h-32 rounded-2xl border border-gray-300 object-cover" />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-semibold text-[#286a94] mb-1">John Doe</h2>
              <p className="text-gray-500 text-sm mb-4">Vendor • Premium Business Partner</p>
            </div>
            <div>
              <button className=" p-2 text-sm bg-green-600 animate-pulse px-4 py-2 font-bold text-white rounded-xl">Upgrade your plan</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div><span className="font-medium text-gray-600">Email:</span> john.vendor@example.com</div>
            <div><span className="font-medium text-gray-600">Phone:</span> +91 9876543210</div>
            <div><span className="font-medium text-gray-600">Country:</span> India</div>
            <div><span className="font-medium text-gray-600">Plan:</span> Premium</div>
            <div><span className="font-medium text-gray-600">Users:</span> 128</div>
            <div><span className="font-medium text-gray-600">Credits Left:</span> 342</div>
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


      {/* ---------------------- RECENT USERS TABLE ---------------------- */}
      <motion.div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-[#286a94] mb-4">Recently Added Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Phone</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentUsers.map((user, i) => (
                <tr key={i} className={`border-b border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition`}>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.country}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>


      {/* ---------------------- BAR GRAPH ---------------------- */}
      <section className="flex justify-between mt-10">
        <motion.div className="bg-white w-full lg:w-[49%] border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
          <h3 className=" font-semibold text-[#286a94] mb-4">Monthly Users & Credits</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#1a80bb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="credits" fill="#ea801c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ---------------------- LINE GRAPH ---------------------- */}
        <motion.div className="bg-white w-full lg:w-[49%] border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
          <h3 className=" font-semibold text-[#286a94] mb-4">New Users Growth</h3>
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
        </motion.div>
      </section>

    </div>
  );
}