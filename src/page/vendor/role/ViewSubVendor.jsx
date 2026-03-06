import { useSearchParams } from "react-router-dom";
import { useViewSubVendorDetailsQuery } from "../../../redux/services/vendorApi";


const EmployeeView = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const { data, isLoading, isError } = useViewSubVendorDetailsQuery(id);

    if (isLoading) return <Loader />;
    if (isError) return <ErrorState />;

    const emp = data?.sub_vendor;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-6">

                {/* Header / Identity Block */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-lg bg-gray-900 text-white flex items-center justify-center text-lg font-semibold">
                            {emp?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 capitalize">
                                {emp.name}
                            </h1>
                            <p className="text-sm text-gray-500">{emp.email}</p>

                            <div className="flex gap-3 mt-2">
                                <StatusBadge active={emp.active} />
                                <MetaBadge text={emp.gender} />
                                <MetaBadge text={emp.country} />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {/* <div className="flex gap-3">
            <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
              Edit
            </button>
            <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
              Suspend
            </button>
            <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
              Delete
            </button>
          </div> */}
                </div>

                {/* Layout */}
                <div className="grid grid-cols-12 gap-6 mt-6">

                    {/* LEFT — Sticky Profile */}
                    <div className="col-span-12 md:col-span-4 space-y-6">

                        <Card title="Employee Summary">
                            <Info label="Employee ID" value={emp.id} />
                            <Info label="Vendor ID" value={emp.vendor_id} />
                            <Info label="Plan" value={emp.plan_name || "Not Assigned"} />
                            <Info
                                label="Created"
                                value={new Date(emp.created_at).toLocaleString()}
                            />
                        </Card>

                        <Card title="Contact">
                            <Info label="Phone" value={emp.phone} />
                            <Info label="Address" value={emp.sub_vendor_address} />
                            <Info label="Country" value={emp.country} />
                        </Card>
                    </div>

                    {/* RIGHT — Detailed */}
                    <div className="col-span-12 md:col-span-8 space-y-6">

                        <Card title="Organization">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Info label="Company Address" value={emp.company_address} />
                                <Info label="Subscription Plan" value={emp.plan_name || "N/A"} />
                            </div>
                        </Card>

                        <Card title="Personal Information">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Info label="Full Name" value={emp.name} />
                                <Info label="Gender" value={emp.gender} />
                                <Info label="Email" value={emp.email} />
                            <Info label="Active Status" value={emp.active ? "Active" : "Inactive"} />

                            </div>
                        </Card>


                        <Card title="Assigned Subscriptions">
                            {emp?.assigned_subscriptions?.length ? (
                                <div className="overflow-hidden border border-gray-200 rounded-lg">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 text-gray-600">
                                            <tr>
                                                <th className="text-left px-4 py-3 font-medium">Country</th>
                                                <th className="text-left px-4 py-3 font-medium">Plan</th>
                                                <th className="text-left px-4 py-3 font-medium">
                                                    Subscription ID
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-blue-50">
                                            {emp.assigned_subscriptions.map((sub) => (
                                                <tr key={sub.subscription_id} className="hover:bg-gray-50">

                                                    {/* Country */}
                                                    <td className="px-4 py-3 capitalize font-medium text-gray-900">
                                                        {sub.country}
                                                    </td>

                                                    {/* Plan */}
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                                                            {sub.plan_name}
                                                        </span>
                                                    </td>

                                                    {/* Subscription ID */}
                                                    <td className="px-4 py-3 text-gray-600 break-all">
                                                        {sub.subscription_id}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyState />
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ---------- UI COMPONENTS ---------- */

const EmptyState = () => (
    <div className="text-center py-10">
        <p className="text-sm text-gray-500">
            No subscriptions assigned to this employee
        </p>
    </div>
);

const Card = ({ title, children }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-5 tracking-wide">
            {title}
        </h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const Info = ({ label, value }) => (
    <div className="flex flex-col gap-4 border-b border-gray-300 pb-3 last:border-none">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium text-[#405780]   wrap-break-word">
            {value || "N/A"}
        </p>
    </div>
);

const StatusBadge = ({ active }) => (
    <span
        className={`px-3 py-1 text-xs rounded-full font-medium ${active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
    >
        {active ? "Active" : "Inactive"}
    </span>
);

const MetaBadge = ({ text }) => (
    <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full capitalize">
        {text}
    </span>
);

const Loader = () => (
    <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading employee profile...</p>
    </div>
);

const ErrorState = () => (
    <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 font-medium">
            Unable to load employee data
        </p>
    </div>
);

export default EmployeeView;