import { useSubvendorDashboardApiQuery } from "../../redux/services/subvendorApi";

const DashboardContent = () => {
  const {data,isLoading,isError} = useSubvendorDashboardApiQuery()
  console.log("dashaboard-details",data);
  
  return (
    <div className="p-6 space-y-6">

      {/* KPI cards */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Students</p>
          <h2 className="text-2xl font-bold mt-2">280</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">New Students</p>
          <h2 className="text-2xl font-bold mt-2">43</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Active Courses</p>
          <h2 className="text-2xl font-bold mt-2">18</h2>
        </div>

      </div>

      {/* Chart section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Analytics Report</h3>

        <div className="h-64 flex items-center justify-center text-gray-400">
          Chart will be integrated here (Recharts / Chart.js)
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Recent Students</h3>

        <table className="w-full text-sm">
          <thead className="text-gray-500">
            <tr>
              <th className="text-left py-2">Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="py-2">John</td>
              <td>john@mail.com</td>
              <td>Java</td>
              <td className="text-green-500">Active</td>
            </tr>

            <tr className="border-t">
              <td className="py-2">Priya</td>
              <td>priya@mail.com</td>
              <td>React</td>
              <td className="text-blue-500">Enrolled</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardContent;
