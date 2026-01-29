
import { useEffect, useState } from 'react';
import { Sparkles, Zap, Crown, Check, X, TrendingUp, Package, Users, BarChart3, Shield, Rocket, Loader } from 'lucide-react';
import CheckoutPage from '../../../libs/CheckoutPage';
// import { useNavigate } from 'react-router-dom';
// import { base } from '../../../redux/services/api';
import { useCreateCheckoutSubscriptionMutation } from '../../../redux/services/externalApi';
import { useGetSubscriptionDetailQuery, useLazyGetSubscriptionDetailQuery, useSelectVendorSubscriptionMutation } from '../../../redux/services/vendorApi';
import {
    CheckCircle,
    Calendar,
    Coins,
    ArrowRight,
} from "lucide-react";

const VendorSubscriptionPage = () => {
    const [currentPlan, setCurrentPlan] = useState('free');
    const [countryOption, setCountryOption] = useState('global')
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [hoveredPlan, setHoveredPlan] = useState(null);
    const [checkoutPage, { isLoading:isLoadingCheckout, isErrorCheckout }] = useCreateCheckoutSubscriptionMutation()
    const [selectVendorPlan, { isLoading: selectPlanLoading }] = useSelectVendorSubscriptionMutation()

    async function createCheckout() {
        try {
            const formdata = new URLSearchParams();

            formdata.append('intent_id', intentId)

            const result = await checkoutPage(formdata)
            // console.log("res", result)
            if (result?.data?.checkout_url) {
                window.location.href = result?.data?.checkout_url;
                return;
            }
        } catch (err) {
            console.log("ere", err);
            toast.error(err?.message ?? "Internal Server Error")
        }
    }

    const [
        getSubscriptionDetail,
        { data, isLoading, isError, error }
    ] = useLazyGetSubscriptionDetailQuery();

    useEffect(() => {
        getSubscriptionDetail(countryOption)
    }, [countryOption])

    // console.log("ddlj", data)

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [intentId, setIntentId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadhandle, setLoadHandle] = useState(null);

    const handleSubscribe = async (plan) => {
        // console.log("ppp", plan);
        setLoadHandle(plan?.id)
        const formdata = new FormData();
        formdata.append('plan_id', plan?.id);
        formdata.append('country', countryOption)
        try {
            const result = await selectVendorPlan(formdata);
            if (result?.data) {
                setSelectedPlan(plan);
                setIntentId(result?.data?.intent_id || null);
                setIsModalOpen(true);
            }
            if (result?.error) {
                return toast.error(result?.error?.data?.detail ?? "Somthing went  wrong")
            }
            console.log("rs", result);
        } catch (err) {
            toast.error(err ?? "Internal Server Error");
        } finally {
            setLoadHandle(false);
        }
    };

    const handleConfirm = (plan) => {
        // console.log("Confirmed subscription for:", plan.name);
        createCheckout()
    };

    if(isLoading){
        return <PageLoader/>
    }

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
                <div className="text- mb-8 flex justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#286a94] mb-3 flex items-center justify-start gap-3">
                            <div className="bg-linear-to-r from-[#286a94] to-blue-500 p-2 rounded-2xl ">
                                <Rocket className="w-4 h-4 text-white" />
                            </div>
                            Subscription Plan
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Choose the perfect plan for your needs. Upgrade your at any time.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="country"
                            className="text-sm font-medium text-gray-600"
                        >
                            Select Country
                        </label>

                        <select
                            name="country"
                            value={countryOption}
                            onChange={(e) => setCountryOption(e.target.value)}
                            id="country"
                            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 
               shadow-sm outline-none transition
               focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >
                            {data?.dropdown_options?.length > 0 &&
                                data?.dropdown_options?.map((item) => {
                                    return <option value={item}>{item}</option>
                                })
                            }
                        </select>
                    </div>
                </div>



                {/* Current Plan Overview */}
                {/* <div className="bg-white rounded-2xl p-6  mb-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-[#286a94]/10 to-blue-500/10 rounded-full -mr-32 -mt-32"></div>

                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-500 mb-1">Current Plan: {userSubscription.plan.toUpperCase()}</h2>
                            <p className="text-gray-600">Your subscription details and usage</p>
                        </div>
                        <div className="bg-linear-to-r from-[#286a94] to-blue-500 px-4 py-2 rounded-full shadow-lg">
                            <span className="text-white font-semibold">Active</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 relative z-10">
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

                        
                        <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200 hover:scale-105 hover:shadow-lg transition-all duration-300">
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

                        
                        <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 hover:scale-105 hover:shadow-lg transition-all duration-300">
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
                </div> */}

                {/* Billing Toggle */}
                {/* <div className="flex justify-center mb-18 mt-14">
                    <div className="bg-white rounded-full p-1.5 border-2 border-gray-200 shadow-lg">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-8 py-3 rounded-full transition-all font-semibold ${billingCycle === 'monthly'
                                ? 'bg-linear-to-r from-[#286a94] to-blue-500 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-8 py-3 rounded-full transition-all font-semibold ${billingCycle === 'yearly'
                                ? 'bg-linear-to-r from-[#286a94] to-blue-500 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Yearly
                            <span className="ml-2 text-xs bg-green-500 px-2 py-1 rounded-full text-white font-bold">Save 20%</span>
                        </button>
                    </div>
                </div> */}

                {/* Subscription Plans */}
                <div className="grid md:grid-cols-3 gap-8 w-[95%] mx-auto">
                    {data?.plans.map((plan, idx) => {
                        // return (
                        //     <div
                        //         key={plan?.id}
                        //         onMouseEnter={() => setHoveredPlan(plan.id)}
                        //         onMouseLeave={() => setHoveredPlan(null)}
                        //         className={`relative bg-white rounded-2xl p-3 border-2 ${plan.borderColor} transition-all duration-300 ${hoveredPlan === plan.id ? 'scale-105 shadow-2xl -translate-y-2' : 'shadow-lg'
                        //             } ${plan.popular ? 'ring-4 ring-[#286a94]/30' : ''}`}
                        //         style={{ animationDelay: `${idx * 100}ms` }}
                        //     >
                        //         {/* {plan.popular && (
                        //             <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-50">
                        //                 <div className="bg-linear-to-r from-[#286a94] to-blue-500 text-white px-2 py-1.5 rounded-full text-xs font-medium shadow-lg">
                        //                     ⭐ MOST POPULAR
                        //                 </div>
                        //             </div>
                        //         )} */}

                        //         {/* {isCurrentPlan && (
                        //             <div className="absolute top-4 right-4">
                        //                 <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                        //                     CURRENT
                        //                 </div>
                        //             </div>
                        //         )} */}

                        //         <div className="text-center mb-6">
                        //             <div className={`inline-block p-4 bg-linear-to-r ${plan.color} rounded-2xl mb-4 shadow-lg ${hoveredPlan === plan.id ? 'animate-float' : ''}`}>
                        //                 {/* <Icon className="w-8 h-8 text-white" /> */}
                        //             </div>
                        //             <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                        //             {/* <div className="flex items-baseline justify-center gap-1">
                        //                 <span className={`text-xl font-bold ${plan.accentColor}`}>
                        //                     ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                        //                 </span>
                        //                 <span className="text-gray-500 font-medium">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                        //             </div> */}
                        //         </div>
                        //         <li className="flex items-start gap-3">
                        //                     {/* {feature.included ? (
                        //                         <div className="bg-green-100 rounded-full p-0.5">
                        //                             <Check className="w-4 h-4 text-green-600 shrink-0" />
                        //                         </div>
                        //                     ) : (
                        //                         <div className="bg-gray-100 rounded-full p-0.5">
                        //                             <X className="w-4 h-4 text-gray-400 shrink-0" />
                        //                         </div>
                        //                     )} */}
                        //                     <span className={`text-sm ${true ? 'text-gray-700' : 'text-gray-400'}`}>
                        //                         {plan.credits}
                        //                     </span>
                        //                 </li>

                        //         <ul className="space-y-3 mb-5">
                        //             {/* {plan.map((feature, i) => (

                        //             ))} */}
                        //         </ul>

                        //         <button
                        //             onClick={() => createCheckout(plan)}
                        //             disabled={isCurrentPlan}
                        //             className={`w-full py-3 text-sm rounded-xl font-bold transition-all ${isCurrentPlan
                        //                 ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        //                 : `bg-linear-to-r ${plan.color} text-white hover:shadow-xl hover:scale-105`
                        //                 }`}
                        //         >
                        //             {
                        //                 isLoading
                        //                     ? 'Loading'
                        //                     : isCurrentPlan
                        //                         ? 'Current Plan'
                        //                         : 'Upgrade Now'
                        //             }

                        //         </button>
                        //     </div>
                        // );

                        return (
                            <div
                                key={plan.id}
                                className="group relative border border-gray-300 rounded-2xl p-6 bg-white
             transition-all duration-300
             hover:shadow-xl hover:-translate-y-2
            //  hover:border-[#286a94]"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold capitalize text-[#286a94]">
                                        {plan.name}
                                    </h3>
                                    <Zap
                                        size={22}
                                        className="text-[#286a94] opacity-60 group-hover:opacity-100"
                                    />
                                </div>

                                {/* Duration */}
                                <p className="mt-3 flex items-center gap-2 text-gray-500">
                                    <Calendar size={18} className="text-indigo-500" />
                                    {plan.duration_days} Days Access
                                </p>

                                {/* Price */}
                                <div className="my-4 flex items-end gap-1">
                                    <span className="text-2xl font-bold text-[#286a94]">
                                        {plan.currency} {plan.price}
                                    </span>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 text-gray-600 mt-4">
                                    <li className="flex items-center gap-2">
                                        <Coins size={18} className="text-yellow-500" />
                                        {plan.credits} Credits
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={18} className="text-green-500" />
                                        Full Features
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={18} className="text-green-500" />
                                        Priority Support
                                    </li>
                                </ul>

                                {/* CTA */}
                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={loadhandle === plan.id}
                                    className={`mt-6 w-full flex items-center justify-center gap-2
    bg-[#286a94] text-white py-2.5 rounded-lg font-medium
    transition-all duration-300
    hover:bg-indigo-700 hover:shadow-md
    active:scale-95
    ${loadhandle === plan.id ? "opacity-70 cursor-not-allowed" : ""}
  `}
                                >
                                    {loadhandle === plan.id ? (
                                        "Loading..."
                                    ) : (
                                        <>
                                            Subscribe Now
                                            <ArrowRight
                                                size={18}
                                                className="transition-transform duration-300 group-hover:translate-x-1"
                                            />
                                        </>
                                    )}
                                </button>

                            </div>
                        )
                        // return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                        //     {data?.plans?.map((plan) => (

                        //     ))}
                        // </div>

                    })}
                </div>

            </div>

            {/* Modal */}
            {selectedPlan && (
                <Modal
                    isLoadingCheckout={isLoadingCheckout}
                    plan={selectedPlan}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    );
};

export default VendorSubscriptionPage;



import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';
import PageLoader from '../../../libs/PageLoader';

export const Modal = ({ plan,isLoadingCheckout, isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
                        initial={{ scale: 0.8, opacity: 0, y: -50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: -50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <X size={20} />
                        </button>

                        {/* Modal Header */}
                        <h2 className="text-2xl font-bold text-[#286a94] mb-2">
                            Confirm Subscription
                        </h2>
                        <hr className='text-[#d6dbdd] mb-4' />

                        <p className="text-gray-600 mb-4">
                            You're about to subscribe to the{" "}
                            <span className="font-semibold text-indigo-900">{plan.name}</span>{" "}
                            plan.
                        </p>

                        {/* Plan Details */}
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2 text-gray-700">
                                <CheckCircle size={18} className="text-green-500" />
                                Duration: {plan.duration_days} days
                            </li>
                            <li className="flex items-center gap-2 text-gray-700">
                                <CheckCircle size={18} className="text-green-500" />
                                Credits: {plan.credits}
                            </li>
                            <li className="flex items-center gap-2 text-gray-700">
                                <CheckCircle size={18} className="text-green-500" />
                                Price: {plan.currency} {plan.price}
                            </li>
                        </ul>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <motion.button
                                onClick={() => onConfirm(plan)}
                                className="px-4 py-2 rounded-lg bg-[#286a94] text-white hover:bg-[#477d9e] transition flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                               {isLoadingCheckout ? <> Loading <span><Loader /></span> </>  : <> Confirm <span> <CheckCircle size={18} /></span>  </> }
                               
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};



// export default Modal;

