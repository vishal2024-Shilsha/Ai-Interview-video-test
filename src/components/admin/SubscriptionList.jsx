import { useState } from 'react'
import { useGetSubscriptionsQuery } from '../../redux/services/adminApi'
import Loader from '../../libs/Loader';
import { Pagination } from '../../page/vendor/user/UserManagement';
import useDebounce from '../../libs/useDebounce';

const SubscriptionList = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [planType, setPlanType] = useState("global"); // global | country
    const debouncedQuery = useDebounce(search, 500);

    const { data, isLoading } = useGetSubscriptionsQuery({ plan: debouncedQuery, page, size: pageSize });

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
