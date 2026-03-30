
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
    const [checkoutPage, { isLoading: isLoadingCheckout, isErrorCheckout }] = useCreateCheckoutSubscriptionMutation()
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
            // console.log("ere", err);
            toast.error(err?.message ?? "Internal Server Error")
        }
    }

    ////[4,1,2],[1,3,4,2]
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
            // console.log("rs", result);
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

    if (isLoading) {
        return <PageLoader />
    }


    return (
        <div className=" bg-linear-to-br ">
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
            <div className="w-full mx-auto mb-8 relative z-10">
                <div className=" mb-8 flex justify-between">

                    <div className="flex flex-row w-full items-center gap-6">
                        <label
                            htmlFor="country"
                            className="text-sm font-medium text-gray-600"
                        >
                            Choose country for subscription pricing
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

                {/* Subscription Plans */}
                <div className="grid md:grid-cols-3 gap-8  mx-auto">
                    {data?.plans.map((plan, idx) => {
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
    
    active:scale-95
    ${loadhandle === plan.id ? "opacity-70 cursor-not-allowed" : ""}
    ${plan?.is_active ? 'opacity-70 bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : 'hover:bg-indigo-700 hover:shadow-md'}
  `}
                                >
                                    {
                                        plan?.is_active ? (<>
                                            Current Plan
                                        </>) : (<>
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
                                        </>)
                                    }

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

export const Modal = ({ plan, isLoadingCheckout, isOpen, onClose, onConfirm }) => {
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
                                {isLoadingCheckout ? <> Loading <span><Loader /></span> </> : <> Confirm <span> <CheckCircle size={18} /></span>  </>}

                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};



// export default Modal;

