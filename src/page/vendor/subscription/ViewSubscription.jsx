import { useNavigate } from "react-router-dom";
import { useViewSubscriptionListQuery } from "../../../redux/services/vendorApi";
import PageLoader from "../../../libs/PageLoader";

const VendorCountrySubscriptions = () => {
  const navigate = useNavigate()
  // const countrySubscriptions = [
  //   {
  //     country: "United States",
  //     currency: "USD",
  //     subscription: {
  //       planName: "Premium Vendor",
  //       price: 49,
  //       billingCycle: "Monthly",
  //       status: "Active",
  //       startDate: "2025-01-01",
  //       endDate: "2026-01-01",
  //     },
  //     transactions: [
  //       {
  //         transactionId: "TXN-US-001",
  //         amount: 49,
  //         date: "2025-01-01",
  //         status: "Success",
  //       },
  //       {
  //         transactionId: "TXN-US-002",
  //         amount: 49,
  //         date: "2025-02-01",
  //         status: "Success",
  //       },
  //     ],
  //   },
  //   {
  //     country: "India",
  //     currency: "INR",
  //     subscription: {
  //       planName: "Standard Vendor",
  //       price: 2999,
  //       billingCycle: "Monthly",
  //       status: "Active",
  //       startDate: "2025-01-10",
  //       endDate: "2026-01-10",
  //     },
  //     transactions: [
  //       {
  //         transactionId: "TXN-IN-101",
  //         amount: 2999,
  //         date: "2025-01-10",
  //         status: "Success",
  //       },
  //     ],
  //   },
  // ];
  const { data, isLoading } = useViewSubscriptionListQuery();
  // console.log("first", data)

  if (isLoading) {
    return <PageLoader/>
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-3">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-gray-500 mb-1">
          Country-wise Subscription
        </h1>
        <p className="mb-5 text-sm text-gray-600"> vendor can view subscription details of Individual Country wise
          as well as global Country </p>
        {data?.country_subscriptions?.length > 0 ? (
          data.country_subscriptions.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow mb-8 p-6">
              {/* Country Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                <div className="flex items-baseline gap-4 text-blue-950">
                  <h2 className="text-lg font-semibold">{item.country}</h2>
                </div>

                <span
                  className={`mt-2 md:mt-0 px-4 py-1 rounded-full text-sm font-medium
            ${item.subscription.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {item.subscription.status}
                </span>
              </div>
              <hr className=" text-gray-300 border-grey-600 shadow-md mb-4" />

              {/* Subscription Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-[#224986]">
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-medium text-grey-500">{item.subscription.planName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">
                    {item?.currency
                      ? `${item.currency} ${item.subscription.price} / ${item.subscription.billingCycle}`
                      : "Free"
                    }
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Validity</p>
                  <p className="font-medium">{item.subscription.startDate} → {item.subscription.endDate}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Credit</p>
                  <p className="font-medium">{item?.subscription?.credits?.total_remaining_credits}</p>
                </div>
              </div>

              {/* Transactions */}
              {item.transactions.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Transactions</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm text-gray-600">Transaction ID</th>
                          <th className="px-4 py-2 text-left text-sm text-gray-600">Amount</th>
                          <th className="px-4 py-2 text-left text-sm text-gray-600">Date</th>
                          <th className="px-4 py-2 text-left text-sm text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.transactions.map((txn, i) => (
                          <tr key={i} className="border-t border-gray-300 text-gray-600">
                            <td className="px-4 py-2 text-sm">{txn.transactionId}</td>
                            <td className="px-4 py-2 text-sm">{item.currency} {txn.amount}</td>
                            <td className="px-4 py-2 text-sm">{txn.date}</td>
                            <td className="px-4 py-2 text-sm">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium
                          ${txn.status === "Paid"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                  }`}
                              >
                                {txn.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white">
            <p className="text-gray-500 mb-4">No subscription available</p>
            <button onClick={() => navigate('/vendor/subscription/plan')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Purchase
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default VendorCountrySubscriptions;
