import { useState } from 'react'
import { useGetSubscriptionsQuery } from '../../redux/services/adminApi'
import Loader from '../../libs/Loader';
import { Pagination } from '../../page/vendor/user/UserManagement';
import useDebounce from '../../libs/useDebounce';

// const SubscriptionList = () => {
//     const [search, setSearch] = useState('')
//     const { data, isLoading } = useGetSubscriptionsQuery();
//     const [page, setPage] = useState(1)
//     const [pageSize, setPageSize] = useState(10)
//     console.log("subbs", data)
//     const subscription = data?.vendors ?? [];
//     const total = data?.total ?? 0;


//     return (
//         <div>
//             <div className="p-6 pt-3 bg-gray-50 min-h-screen">
//                 <div className="max-w-7xl mx-auto">

//                     {/* Header */}
//                     <div className="mb-5">
//                         <h1 className="text-xl font-semibold text-[#286a94]">View All Subscription List </h1>
//                         <p className="text-sm pt-0.5 text-gray-500">Search by country wise to see particular subscription</p>
//                     </div>

//                     {/* Filters + Buttons */}
//                     <div className="flex flex-wrap items-center justify-between mb-6">
//                         <div className="flex flex-wrap items-center gap-3">

//                             {/* Search */}
//                             <label className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow shadow-[#dcdedf]">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1111.196 3.094l3.85 3.85a1 1 0 01-1.414 1.414l-3.85-3.85A6 6 0 012 8z" clipRule="evenodd" />
//                                 </svg>
//                                 <input
//                                     value={search}
//                                     onChange={(e) => setSearch(e.target.value)}
//                                     placeholder="Search by name, email or phone"
//                                     className="outline-none w-64 placeholder:text-[#286a94]"
//                                 />
//                             </label>

//                         </div>
//                     </div>


//                     {/* TABLE */}
//                     <div className="bg-white rounded-lg shadow">
//                         <div className="overflow-x-auto">
//                             <table className="min-w-full divide-y divide-gray-300">
//                                 <thead className="bg-gray-100">
//                                     <tr>
//                                         <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
//                                         {/* <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Nationality</th> */}
//                                         <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Vendor status</th>
//                                         <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Subscribe Status</th>
//                                         <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
//                                         <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
//                                     </tr>
//                                 </thead>

//                                 <tbody className="bg-white divide-y divide-gray-300">
//                                     {isLoading ? (
//                                         <tr>
//                                             <td colSpan={6} className="px-6 py-8 text-center text-gray-500"><Loader /></td>
//                                         </tr>
//                                     ) : subscription?.length === 0 ? (
//                                         <tr>
//                                             <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
//                                                 No vendor found — try adjusting filters
//                                             </td>
//                                         </tr>
//                                     ) : (
//                                         subscription?.map((u, index) => (
//                                             <tr key={u.id} className={`text-sm text-gray-600 ${(index & 1) == 0 ? ' bg-gray-50' : ''}`}>
//                                                 <td className="px-4 py-2">
//                                                     <div className="flex items-center gap-3">
//                                                         <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
//                                                             <img className="w-full h-full" src={profileImg} alt="img" />
//                                                         </div>
//                                                         <div>
//                                                             <div className="font-medium">{u.name}</div>
//                                                             <div className="text-xs text-gray-400">
//                                                                 Joined: {u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </td>

//                                                 {/* <td className="px-6 py-4">{u.nationality}</td> */}
//                                                 <td className="px-6 py-4">{u.is_disabled ? 'Inactive' : 'Active'}</td>
//                                                 <td className="px-6 py-4">{u.is_subscribed ? 'Subscribed' : 'No'}</td>
//                                                 <td className="px-6 py-4">{u.email}</td>

//                                                 <td className="px-6 py-4 text-end">
//                                                     <div className="flex justify-end gap-3 items-center">
//                                                         <Eye size={17} />
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>


//                         {/* Pagination */}
//                         <div className="p-4 flex items-center justify-between">
//                             <div className="text-sm text-[#286a94]">
//                                 Showing {Math.min((page - 1) * pageSize + 1, total)}-
//                                 {Math.min(page * pageSize, total)} of {total} subscription
//                             </div>

//                             <div className="flex items-center gap-4">
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-sm text-[#286a94]">Rows</span>
//                                     <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}
//                                         className="px-2 py-1 rounded-md border border-[#286a94] text-[#286a94] bg-white">
//                                         {[10, 20, 50].map((s) => <option key={s} value={s}>{s}</option>)}
//                                     </select>
//                                 </div>

//                                 <Pagination page={page} totalPages={subscription?.total_pages} setPage={setPage} />
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default SubscriptionList




//===========================

const SubscriptionList = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [planType, setPlanType] = useState("global"); // global | country
    const debouncedQuery = useDebounce(search, 500);

    const { data, isLoading } = useGetSubscriptionsQuery({plan:debouncedQuery,page,size:pageSize});

    // Select plans based on toggle
    const subscription =
        planType === "country"
            ? data?.country_plans?.items ?? []
            : data?.global_plans?.items ?? [];

    const total =
        planType === "country"
            ? data?.country_plans?.total ?? 0
            : data?.global_plans?.total ?? 0;

    return (
        <div className="p-6 pt-3 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-5">
                    <h1 className="text-xl font-semibold text-[#286a94]">
                        Subscription Plans
                    </h1>
                    <p className="text-sm text-gray-500">
                        Toggle between global and country specific subscription plans
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <div className="flex items-center gap-3">

                        {/* Search */}
                        <label className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search plan by country name"
                                className="outline-none w-64 placeholder:text-[#286a94]"
                            />
                        </label>

                        {/* Toggle */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPlanType("global")}
                                className={`px-4 py-2 rounded-md text-sm font-medium
                  ${planType === "global"
                                        ? "bg-[#286a94] text-white"
                                        : "bg-white border border-[#286a94] text-[#286a94]"}`}
                            >
                                Global Plans
                            </button>

                            <button
                                onClick={() => setPlanType("country")}
                                className={`px-4 py-2 rounded-md text-sm font-medium
                  ${planType === "country"
                                        ? "bg-[#286a94] text-white"
                                        : "bg-white border border-[#286a94] text-[#286a94]"}`}
                            >
                                Country Plans
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-500">
                                        Name
                                    </th>
                                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-500">
                                        Duration
                                    </th>
                                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-500">
                                        Country
                                    </th>
                                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-500">
                                        Credits
                                    </th>
                                    
                                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-500">
                                        Price
                                    </th>
                                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-500">
                                        Price / Credit
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8">
                                            <Loader />
                                        </td>
                                    </tr>
                                ) : subscription.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-500">
                                            No subscription plans found
                                        </td>
                                    </tr>
                                ) : (
                                    subscription.map((plan, index) => (
                                        <tr
                                            key={plan.id}
                                            className={'text-sm text-gray-600'}
                                        >
                                            <td className="px-3 py-3 font-medium capitalize">
                                                {plan.name}
                                            </td>
                                            <td className="px-3 py-3">
                                                {plan.duration_days} days
                                            </td>
                                            <td className="px-3 py-3">
                                                {plan.country ?? "Global"}
                                            </td>
                                            <td className="px-3 py-3">
                                                {plan.credits}
                                            </td>
                                            <td className="px-3 py-3">
                                                {plan.price} {plan.currency}
                                            </td>
                                            <td className="px-6 py-3">
                                                {plan.price_per_credit}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {
                        planType === "country" &&
                        <div className="p-4 flex items-center justify-between">
                            <div className="text-sm text-[#286a94]">
                                Showing {subscription.length} of {total} plans
                            </div>

                            <div className="flex items-center gap-4">
                                <select
                                    value={pageSize}
                                    onChange={(e) => setPageSize(Number(e.target.value))}
                                    className="px-2 py-1 rounded-md border border-[#286a94] text-[#286a94]"
                                >
                                    {[10, 20, 50].map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>

                                <Pagination
                                    page={page}
                                    totalPages={Math.ceil(total / pageSize)}
                                    setPage={setPage}
                                />
                            </div>
                        </div>
                    }

                </div>
            </div>
        </div>
    );
};

export default SubscriptionList;
