// import React, { useState } from "react";

// const plans = [
//   {
//     id: 0,
//     name: "Free",
//     priceMonthly: 0,
//     priceYearly: 0,
//     benefits: [
//       "1 Project",
//       "Basic Support",
//       "Community Access"
//     ],
//     badge: "Free"
//   },
//   {
//     id: 1,
//     name: "Starter",
//     priceMonthly: 19,
//     priceYearly: 190,
//     benefits: [
//       "5 Projects",
//       "Email Support",
//       "Basic Analytics"
//     ],
//     badge: ""
//   },
//   {
//     id: 2,
//     name: "Pro",
//     priceMonthly: 49,
//     priceYearly: 490,
//     benefits: [
//       "50 Projects",
//       "Priority Support",
//       "Advanced Analytics"
//     ],
//     badge: "Most Popular"
//   },
//   {
//     id: 3,
//     name: "Enterprise",
//     priceMonthly: 99,
//     priceYearly: 990,
//     benefits: [
//       "Unlimited Projects",
//       "Dedicated Manager",
//       "Custom Integrations"
//     ],
//     badge: "Best Value"
//   }
// ];

// export default function VendorSubscription() {
//   const [billingCycle, setBillingCycle] = useState("monthly");
//   const [selectedPlan, setSelectedPlan] = useState(plans[0]); // Default to Free plan
//   const [promoCode, setPromoCode] = useState("");
//   const [promoApplied, setPromoApplied] = useState(false);

//   const handleApplyPromo = () => {
//     if (promoCode.toUpperCase() === "SAVE20") {
//       setPromoApplied(true);
//       alert("Promo code applied! 20% discount.");
//     } else {
//       alert("Invalid promo code");
//       setPromoApplied(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl bg-gray-50 mx-auto p-8 space-y-12 font-sans text-gray-900">
//       {/* Dashboard summary */}
//   <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
//     <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
//       <div>
//         <h3 className="text-xl font-bold mb-1">Current Plan</h3>
//         <p className="text-3xl font-extrabold">{selectedPlan.name}</p>
//       </div>
//       <p className="mt-4 text-sm tracking-wide">Renewal in 15 days</p>
//     </div>
//     <div className="bg-white rounded-2xl p-6 shadow-md">
//       <h3 className="text-lg font-semibold mb-3">Usage</h3>
//       <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
//         <div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{width: "40%"}}></div>
//       </div>
//       <p className="text-sm text-gray-600">Used 40% of your project quota</p>
//     </div>
//     <div className="bg-white rounded-2xl p-6 shadow-md">
//       <h3 className="text-lg font-semibold mb-3">Last Payment</h3>
//       <p className="text-gray-700">₹{billingCycle === "monthly" ? selectedPlan.priceMonthly : selectedPlan.priceYearly} / {billingCycle}</p>
//       <p className="text-gray-700 mt-2">Paid on Oct 14, 2025</p>
//     </div>
//   </section>

//       {/* Billing cycle toggle */}
//       <section className="flex items-center justify-center space-x-5 text-lg">
//         <span className={billingCycle === "monthly" ? "font-bold text-blue-700" : "text-gray-500"}>Monthly</span>
//         <button 
//           onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")} 
//           className="relative w-14 h-8 bg-gray-300 rounded-full cursor-pointer focus:outline-none"
//           aria-label="Toggle billing cycle"
//         >
//           <span 
//             className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`}
//           />
//         </button>
//         <span className={billingCycle === "yearly" ? "font-bold text-blue-700" : "text-gray-500"}>Yearly</span>
//         {billingCycle === "yearly" && <span className="ml-4 text-green-600 font-semibold">Save 20%!</span>}
//       </section>

//       {/* Plans grid */}
//       <section className="grid md:grid-cols-3 gap-8">
//         {plans.map(plan => (
//           <div 
//             key={plan.id}
//             onClick={() => setSelectedPlan(plan)}
//             className={`relative p-6 rounded-3xl border-2 transition cursor-pointer shadow-lg hover:scale-105 transform duration-300
//               ${selectedPlan.id === plan.id ? "border-blue-600 bg-blue-50 shadow-blue-300" : "border-gray-200 bg-white"}`}
//           >
//             {plan.badge && (
//               <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold
//                 ${plan.badge === "Free" ? "bg-green-500 text-white" : "bg-indigo-600 text-white"}`}>
//                 {plan.badge}
//               </div>
//             )}
//             <h4 className="text-2xl font-extrabold mb-2 text-blue-800">{plan.name}</h4>
//             <p className="text-4xl font-extrabold text-gray-900 mb-3">
//               ₹{billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly} 
//               <span className="text-lg font-normal text-gray-600">/{billingCycle}</span>
//             </p>
//             <ul className="mb-6 space-y-2 text-gray-700">
//               {plan.benefits.map((benefit, idx) => (
//                 <li key={idx} className="flex items-center">
//                   <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M5 13l4 4L19 7" />
//                   </svg>
//                   {benefit}
//                 </li>
//               ))}
//             </ul>
//             <button 
//               className={`w-full py-3 text-white rounded-xl font-semibold transition 
//                 ${selectedPlan.id === plan.id ? "bg-gray-400 cursor-default" : "bg-blue-600 hover:bg-blue-700"}`}
//               disabled={selectedPlan.id === plan.id}
//             >
//               {selectedPlan.id === plan.id ? "Current Plan" : plan.priceMonthly === 0 ? "Select Free" : "Select Plan"}
//             </button>
//           </div>
//         ))}
//       </section>

//       {/* Promo Code */}
//       <section className="max-w-md mx-auto bg-blue-50 rounded-2xl p-6 shadow-md">
//         <h4 className="font-semibold mb-4 text-blue-800">Apply Promo Code</h4>
//         <div className="flex space-x-4">
//           <input
//             type="text"
//             value={promoCode}
//             onChange={e => setPromoCode(e.target.value)}
//             placeholder="Enter code"
//             className="flex-grow p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           />
//           <button 
//             onClick={handleApplyPromo}
//             className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700 transition"
//           >
//             Apply
//           </button>
//         </div>
//         {promoApplied && <p className="mt-2 text-green-600 font-semibold">Promo code applied successfully!</p>}
//       </section>
//     </div>
//   );
// }


//==============================
import React, { useState } from 'react';
import { Sparkles, Zap, Crown, Check, X, TrendingUp, Package, Users, BarChart3, Shield, Rocket } from 'lucide-react';

const VendorSubscriptionPage = () => {
    const [currentPlan, setCurrentPlan] = useState('free');
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [hoveredPlan, setHoveredPlan] = useState(null);

    // Current user's subscription data
    const userSubscription = {
        plan: 'free',
        credits: 15,
        totalCredits: 50,
        productsListed: 5,
        maxProducts: 10,
        daysRemaining: 'Unlimited'
    };

    const plans = [
        {
            id: 'free',
            name: 'Free',
            icon: Package,
            color: 'from-gray-400 to-gray-500',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-300',
            accentColor: 'text-gray-600',
            price: { monthly: 0, yearly: 0 },
            popular: false,
            features: [
                { name: 'Up to 10 products', included: true },
                // { name: '50 credits per month', included: true },
                // { name: 'Basic analytics', included: true },
                // { name: 'Email support', included: true },
                // { name: 'Product promotions', included: false },
                { name: 'Priority listing', included: false },
                { name: 'Advanced analytics', included: false },
                { name: 'API access', included: false }
            ]
        },
        {
            id: 'gold',
            name: 'Gold',
            icon: Zap,
            color: 'from-yellow-400 to-orange-500',
            bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
            borderColor: 'border-yellow-400',
            accentColor: 'text-orange-600',
            price: { monthly: 29, yearly: 290 },
            popular: true,
            features: [
                { name: 'Up to 100 products', included: true },
                { name: '500 credits per month', included: true },
                // { name: 'Advanced analytics', included: true },
                // { name: 'Priority email support', included: true },
                // { name: 'Product promotions (5/month)', included: true },
                // { name: 'Priority listing', included: true },
                { name: 'Custom branding', included: false },
                { name: 'API access', included: false }
            ]
        },
        {
            id: 'platinum',
            name: 'Platinum',
            icon: Crown,
            color: 'from-purple-400 via-pink-400 to-purple-500',
            bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
            borderColor: 'border-purple-400',
            accentColor: 'text-purple-600',
            price: { monthly: 99, yearly: 990 },
            popular: false,
            features: [
                { name: 'Unlimited products', included: true },
                // { name: 'Unlimited credits', included: true },
                // { name: 'Real-time analytics', included: true },
                // { name: '24/7 priority support', included: true },
                // { name: 'Unlimited promotions', included: true },
                { name: 'Top priority listing', included: true },
                { name: 'Custom branding', included: true },
                { name: 'Full API access', included: true }
            ]
        }
    ];

    const getProgress = (current, total) => {
        return total === 'Unlimited' ? 100 : (current / total) * 100;
    };

    const handleUpgrade = (planId) => {
        alert(`Upgrading to ${planId.toUpperCase()} plan! Payment integration would go here.`);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 p-6">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8 relative z-10">
                <div className="text- mb-8">
                    <h1 className="text-2xl font-bold text-[#286a94] mb-3 flex items-center justify-start gap-3">
                        <div className="bg-gradient-to-r from-[#286a94] to-blue-500 p-3 rounded-2xl ">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        Subscription Dashboard
                    </h1>
                    <p className="text-gray-600 text-sm">Manage your plan and unlock powerful features</p>
                </div>

                {/* Current Plan Overview */}
                <div className="bg-white rounded-2xl p-6  mb-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#286a94]/10 to-blue-500/10 rounded-full -mr-32 -mt-32"></div>

                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-500 mb-1">Current Plan: {userSubscription.plan.toUpperCase()}</h2>
                            <p className="text-gray-600">Your subscription details and usage</p>
                        </div>
                        <div className="bg-gradient-to-r from-[#286a94] to-blue-500 px-4 py-2 rounded-full shadow-lg">
                            <span className="text-white font-semibold">Active</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 relative z-10">
                        {/* Credits */}
                        <div className="bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border-2 border-yellow-200 hover:scale-105 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-gray-700 font-semibold">Credits</span>
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div className="text-sm font-bold text-gray-800 mb-2">
                                {userSubscription.credits}/{userSubscription.totalCredits}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="h-full bg-linear-to-r from-yellow-400 to-orange-500 transition-all duration-500 rounded-full"
                                    style={{ width: `${getProgress(userSubscription.credits, userSubscription.totalCredits)}%` }}
                                />
                            </div>
                        </div>

                        {/* Products */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200 hover:scale-105 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-gray-700 font-semibold">Products Listed</span>
                                <Package className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className=" font-bold text-gray-800 mb-2">
                                {userSubscription.productsListed}/{userSubscription.maxProducts}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="h-full bg-linear-to-r from-blue-400 to-cyan-500 transition-all duration-500 rounded-full"
                                    style={{ width: `${getProgress(userSubscription.productsListed, userSubscription.maxProducts)}%` }}
                                />
                            </div>
                        </div>

                        {/* Days Remaining */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 hover:scale-105 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-gray-700 font-semibold">Subscription</span>
                                <Shield className="w-5 h-5 text-green-500" />
                            </div>
                            <div className=" font-bold text-gray-800 mb-2">
                                {userSubscription.daysRemaining}
                            </div>
                            <div className="text-sm text-gray-600">No expiration</div>
                        </div>
                    </div>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-18 mt-14">
                    <div className="bg-white rounded-full p-1.5 border-2 border-gray-200 shadow-lg">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-8 py-3 rounded-full transition-all font-semibold ${billingCycle === 'monthly'
                                    ? 'bg-gradient-to-r from-[#286a94] to-blue-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-8 py-3 rounded-full transition-all font-semibold ${billingCycle === 'yearly'
                                    ? 'bg-gradient-to-r from-[#286a94] to-blue-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Yearly
                            <span className="ml-2 text-xs bg-green-500 px-2 py-1 rounded-full text-white font-bold">Save 20%</span>
                        </button>
                    </div>
                </div>

                {/* Subscription Plans */}
                <div className="grid md:grid-cols-3 gap-8 w-[95%] mx-auto">
                    {plans.map((plan, idx) => {
                        const Icon = plan.icon;
                        const isCurrentPlan = userSubscription.plan === plan.id;

                        return (
                            <div
                                key={plan.id}
                                onMouseEnter={() => setHoveredPlan(plan.id)}
                                onMouseLeave={() => setHoveredPlan(null)}
                                className={`relative bg-white rounded-2xl p-3 border-2 ${plan.borderColor} transition-all duration-300 ${hoveredPlan === plan.id ? 'scale-105 shadow-2xl -translate-y-2' : 'shadow-lg'
                                    } ${plan.popular ? 'ring-4 ring-[#286a94]/30' : ''}`}
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-50">
                                        <div className="bg-linear-to-r from-[#286a94] to-blue-500 text-white px-2 py-1.5 rounded-full text-xs font-medium shadow-lg">
                                            ⭐ MOST POPULAR
                                        </div>
                                    </div>
                                )}

                                {isCurrentPlan && (
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                                            CURRENT
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <div className={`inline-block p-4 bg-gradient-to-r ${plan.color} rounded-2xl mb-4 shadow-lg ${hoveredPlan === plan.id ? 'animate-float' : ''}`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className={`text-xl font-bold ${plan.accentColor}`}>
                                            ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                                        </span>
                                        <span className="text-gray-500 font-medium">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-5">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            {feature.included ? (
                                                <div className="bg-green-100 rounded-full p-0.5">
                                                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                </div>
                                            ) : (
                                                <div className="bg-gray-100 rounded-full p-0.5">
                                                    <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                </div>
                                            )}
                                            <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                                                {feature.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={isCurrentPlan}
                                    className={`w-full py-3 text-sm rounded-xl font-bold transition-all ${isCurrentPlan
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : `bg-gradient-to-r ${plan.color} text-white hover:shadow-xl hover:scale-105`
                                        }`}
                                >
                                    {isCurrentPlan ? 'Current Plan' : 'Upgrade Now'}
                                </button>
                            </div>
                        );
                    })}
                </div>
                
            </div>
        </div>
    );
};

export default VendorSubscriptionPage;