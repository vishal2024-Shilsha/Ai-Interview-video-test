import { useState, useEffect } from "react";
import {
    useAddPlanByAdminMutation,
    useDeleteSubscriptionMutation,
    useGetFilteredSubscriptionQuery,
    useUpdatePlanByAdminMutation,
    useLazyGetAllOptionPlanQuery,
    useSetAddonPriceMutation
} from "../redux/services/adminApi";
import { Edit, SquarePen, Trash2 } from "lucide-react";
import { useGetCountryCurrencyMutation, useGetCountryDataQuery } from "../redux/services/externalApi";
import Select from 'react-select'
import toast from "react-hot-toast";
import useDebounce from "../libs/useDebounce";
import PageLoader from "../libs/PageLoader";


export default function SubscriptionModule() {
    const [pageNumber, setPageNumber] = useState(1)
    const [size, setSize] = useState(10)
    const { data: countryList } = useGetCountryDataQuery();
    const [showPresetModal, setShowPresetModal] = useState(false)
    const [
        triggerGetAllOptionPlan,
        {
            data: planOption
        },
    ] = useLazyGetAllOptionPlanQuery();
    const [setAddonPrice, { isLoading: isLoadingSetOnPrice, isError: isLoadingError }] = useSetAddonPriceMutation()
    const [showModal, setShowModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState({
        id: null,
        country: ''
    });
    const [search, setSearch] = useState('')
    const [mode, setMode] = useState("add");
    const [currency, setCurrency] = useState("USD")
    const [addPlanCountryWise, { isLoading: addplanLoading }] = useAddPlanByAdminMutation()
    const [updatePlanCountryWise, { isLoading: updateplanLoading }] = useUpdatePlanByAdminMutation()
    const [deletePlan, { isLoading: deletePlanLoading, isError: deltePlanError }] = useDeleteSubscriptionMutation()
    const [getCountryCurrency, { data: getCurrencyData }] = useGetCountryCurrencyMutation();
    const debouncedQuery = useDebounce(search, 500);
    const planOptionbar = planOption?.plans ?? []

    const GLOBAL_OPTION = {
        value: null,
        searchLabel: "",
        label: "Global Country"
    };

    const options = [
        GLOBAL_OPTION,
        ...((countryList?.data || [])?.map((c) => ({
            value: c,
            searchLabel: c.name,
            label: (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img
                        src={c.flag ?? "img"}
                        alt={c.name}
                        style={{ width: 20, height: 14, objectFit: "cover" }}
                    />
                    <span>{c.name}</span>
                </div>
            )
        })))
    ];

    const [selectedOption, setSelectedOption] = useState(GLOBAL_OPTION);

    const { data: plans, isLoading, isError } = useGetFilteredSubscriptionQuery({
        country: selectedOption?.value?.name ?? null,
        plan: debouncedQuery, pageNumber, size
    });

    // console.log("opinionnnn",selectedOption);
    useEffect(() => {
        if (selectedOption?.value) {
            getCountryCurrency(selectedOption?.value?.iso2)
        }
        // console.log("pointer", selectedOption);
        if (selectedOption?.value === null) {
            setCurrency("USD")
        }
    }, [selectedOption])
    // console.log("got",getCurrencyData)

    useEffect(() => {
        if (getCurrencyData?.data?.currency) {
            setCurrency(getCurrencyData?.data?.currency ?? "USD")
        }
    }, [getCurrencyData])
    const [creditPrice, setCreditPrice] = useState(1);

    const [formData, setFormData] = useState({
        name: "",
        duration_days: "",
        credits: "",
        price: "",
        currency: ""
    });

    const handleOpenAdd = () => {
        setMode("add");
        setFormData({ name: "", duration_days: "", credits: "", price: "" });
        setShowModal(true);
        triggerGetAllOptionPlan()
    };

    const handleOpenEdit = (plan) => {
        console.log("pplan", plan);
        setMode("edit");
        setFormData({
            ...plan,
            plan_id: plan?.plan_id ? plan?.plan_id : plan?.id
        });
        setShowModal(true);
        triggerGetAllOptionPlan()
    };
    // console.log("fom",formData)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            ...formData,
            currency: currency,
        }
        if(mode !== "edit"){
            data.country=selectedOption?.searchLabel
        }
        if(selectedOption?.value==null){
            data.country=""
        }
      
        console.log("hlwo",data,selectedOption)
        try {
            const result = mode === "edit" ? await updatePlanCountryWise(data) : await addPlanCountryWise(data)
            if (result?.data) {
                setTimeout(() => {
                    toast.success(mode === "edit" ? 'Subscription Plan updates successfully' : 'Subscription Plan added successfully')
                    setShowModal(false);
                }, 1000)
            }
            if (result?.error?.data) {
                return toast.error(result?.error?.data?.detail ?? "Something went wrong")
            }
            // console.log("rms", result);
        } catch (err) {
            // console.log("ererer", err)
            toast.error("Something went wrong")
        }
    };

    const openDeletePopup = (p) => {
        console.log("pplj", p)
        setSelectedId({
            id: p?.plan_id ? p?.plan_id : p?.id,
            country: p?.country ?? null
        })
        setDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const data = {};
            if (selectedId?.country) {
                data.country = selectedId?.country
            }
            data.plan_id = selectedId?.id
            // console.log("first-del", data);

            const result = await deletePlan(data);
            if (result?.data) {
                setDeleteModal(false);
                setSelectedId(null);
                toast.success("plan deleted successfully.")
                return;
            }

            if (deltePlanError) {
                setTimeout(() => {
                    toast.error(result?.error?.data?.detail ?? "Error occurred..")
                }, 1000)
                return;
            }
        } catch (err) {
            toast.error("something went wrong")
        }
        // await deleteSubscription(selectedId);

    };

    const handleSetCredit = async () => {
        try {
            console.log("hlw-word",creditPrice)
            if(!creditPrice){
                toast.error("Please fill Addon Percentage")
                return;
            }
            const formdata = new FormData();
            formdata.append('discount_percent',creditPrice)
            const result = await setAddonPrice(formdata)
            if(result?.data){
                toast.success("add-on price set successfully..")
                setTimeout(() =>{
                    setShowPresetModal(false);
                },500)    
            }
            // console.log("ress",result)
        } catch (err) {
            // console.log("err in hadleset credit",err)
            toast.error("Error occurred..")
        }
    }
    


    if (isLoading) return <PageLoader/>

    if (isError) return <p className="p-4">Something went wrong</p> 

    return (
        <div className="p-5 pt-3 bg-gray-50 min-h-screen ">
            <div className="mb-4">
                <div className="mb-4">
                    <h1 className="text- text-[#4c82a8] font-medium">Subscription Management (add/edit your subscription plan & its addon subscription price)</h1>
                    <p className="text-sm mt-1 text-gray-600">Please Select Country to see its subscription plan & credits </p>
                </div>

                <Select
                    className="w-72"
                    showSearch
                    options={options}
                    optionFilterProp="searchLabel"
                    value={selectedOption}
                    onChange={setSelectedOption}
                    isSearchable
                    filterOption={(option, inputValue) =>
                        option.data.searchLabel
                            ?.toLowerCase()
                            .includes(inputValue.toLowerCase())
                    }
                />
            </div>

            {/* Credit Price Box */}
            <section className="bg-white shadow rounded p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">
                            Addon price – Pay {plans?.addon_discount_percent}% off the price and receive full defined credits. you can edit addon price percentage
                        </p>
                        <div className="text-2xl text-[#4c82a8] font-semibold">{plans?.addon_discount_percent ?? '—'}%</div>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-2 bg-[#4c82a8] text-white rounded" onClick={() => [setShowPresetModal(true), setCreditPrice(plans?.addon_discount_percent)]} >
                            <Edit size={16} color="white" />
                        </button>
                    </div>
                </div>
            </section>

            {/*
                <div className="mt-4">
                    <p className="text-sm font-medium text-[#4c82a8] mb-2">Presets</p>
                    <div className="grid grid-cols-3 gap-3">
                        {customPricesData?.map((p) => (
                            <div key={p.id} className="p-3 border rounded flex items-center justify-between">
                                <div>
                                    <div className="text-sm">₹{p.price}</div>
                                    <div className="text-xs text-gray-500">preset #{p.id}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-2 py-1 border rounded text-sm" >Apply</button>
                                    <button className="px-2 py-1 border rounded text-sm" >Edit</button>
                                    <button className="px-2 py-1 border rounded text-sm text-red-600">Delete</button>
                                </div>
                            </div>
                        ))}
                        {(!customPricesData || customPricesData.length === 0) && <div className="text-sm text-gray-500 col-span-3">No presets</div>}
                    </div>
                </div>
            </section> */}


            {/* Plans Table */}
            <div className="bg-white rounded-lg shadow  ">
                <div className="overflow-x-auto p-5">
                    <div className="flex justify-between items-center  mb-5">

                        <label className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow shadow-[#dcdedf]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1111.196 3.094l3.85 3.85a1 1 0 01-1.414 1.414l-3.85-3.85A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by plan name"
                                className="outline-none w-64 placeholder:text-[#286a94]"
                            />
                        </label>
                        <button
                            onClick={handleOpenAdd}
                            className="bg-[#4c82a8] text-white px-4 py-2 rounded-lg"
                        >
                            + Add Plan
                        </button>
                    </div>

                    <table className="min-w-full shadow mx-auto divide-y divide-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Plan Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Duration (days)</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Credits</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-300">

                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : plans?.plans?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No subscription plans found
                                    </td>
                                </tr>
                            ) : (
                                plans?.plans?.map((p, index) => (
                                    <tr
                                        key={p.id}
                                        className={`text-sm text-gray-600`}
                                    >
                                        <td className="px-6 py-4 font-medium">{p?.name}</td>

                                        <td className="px-6 py-4">{p?.duration_days} days</td>

                                        <td className="px-6 py-4">{p?.credits || "-"}</td>

                                        <td className="px-6 py-4">{p?.price} {p?.currency}</td>

                                        <td className="px-6 py-4 text-end">
                                            <div className="flex justify-end gap-3 items-center">
                                                <button
                                                    onClick={() => handleOpenEdit(p)}
                                                    className="text-[#4689b9] hover:underline cursor-pointer text-sm"
                                                >
                                                    <SquarePen size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openDeletePopup(p)}
                                                    className="text-red-600 hover:underline cursor-pointer text-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
                </div>
            </div>


            {/* Add/Edit Modal */}
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <div className="bg-white w-full rounded-lg p-6">
                        <h2 className="text-xl text-[#4c82a8] font-semibold mb-4">
                            {mode === "add" ? "Add Subscription" : "Edit Subscription"}
                        </h2>

                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            {/* Plan Name */}
                            <div className="flex flex-col">
                                <label className="  text-sm font-medium text-gray-500  mb-1">Plan Name</label>
                                {
                                    selectedOption?.value === null ? (
                                        <input
                                            type="text"
                                            className="border border-gray-300 p-2 rounded outline-none"
                                            placeholder="Enter plan name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            required
                                        />
                                    ) : (
                                        <select name="name" className=" text-gray-500 w-full h-full border border-gray-300 p-2 outline-none"
                                            onChange={(e) => {
                                                const selectedPlan = planOptionbar?.find(
                                                    (item) => item.name === e.target.value
                                                );

                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                    duration_days: selectedPlan?.duration_days || "",
                                                    credits:selectedPlan?.credits || ""
                                                });
                                            }
                                            }
                                            value={formData.name}
                                            required
                                        >
                                            <option selected value="" disabled>Select Plan</option>
                                            {
                                                planOptionbar?.map((item) => (
                                                    <option value={item?.name} >{item?.name}</option>
                                                ))
                                            }
                                        </select>
                                    )
                                }


                            </div>

                            {/* Duration */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-500  mb-1">Duration (days)</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 text-gray-500 p-2 rounded outline-none"
                                    placeholder="Days"
                                    value={formData.duration_days}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            duration_days: e.target.value,
                                        });
                                    }}
                                    disabled={selectedOption?.value !== null}
                                    min={1}
                                    required
                                />
                            </div>


                            {/* Select Option */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-500  mb-1">Country</label>
                                <Select
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            height: "42px",
                                        })
                                    }}
                                    className=""
                                    showSearch
                                    options={options}
                                    optionFilterProp="searchLabel"
                                    defaultValue={selectedOption}
                                    onChange={setSelectedOption}
                                    isSearchable
                                    filterOption={(option, inputValue) =>
                                        option.data.searchLabel
                                            ?.toLowerCase()
                                            .includes(inputValue.toLowerCase())
                                    }
                                />
                            </div>

                            {/* Currency */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-500  mb-1">Currency</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 text-gray-500 p-2 rounded outline-none"
                                    placeholder="Currency"
                                    value={currency}
                                    disabled
                                />
                            </div>

                            {/* Credits */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-500  mb-1">Credits</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 p-2 rounded outline-none disabled:text-gray-500"
                                    placeholder="Credits"
                                    value={formData.credits}
                                    disabled={selectedOption?.value !== null}
                                    onChange={(e) =>
                                        setFormData({ ...formData, credits: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            {/* Price */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-500  mb-1">Price</label>
                                <input
                                    type="number"
                                    className="border border-gray-300 p-2 rounded outline-none"
                                    placeholder="Price"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: e.target.value })
                                    }
                                    required
                                />
                            </div>


                            {/* Buttons — Full Width Row */}
                            <div className="col-span-2 flex justify-end text-gray-500  gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded"
                                >
                                    {mode === "add" ? (addplanLoading ? "Adding" : "Add") : (updateplanLoading ? 'Updating' : "Update")}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>

            )}

            {/* DELETE CONFIRMATION POPUP */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[500px] ">
                        <h2 className="text-xl font-bold mb-3 text-red-500">
                            Confirm Delete
                        </h2>
                        <p className="text-gray-700 mb-6">Are you sure you want to delete this plan?</p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => [setDeleteModal(false), setSelectedId(null)]}
                                className="px-4 py-2 hover:bg-gray-300 bg-gray-200 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                {deletePlanLoading ? 'Deleting..' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPresetModal && (
                <Modal onClose={() => setShowPresetModal(false)}>
                    <div className="p-6 bg-white rounded-lg shadow-lg min-w-[320px]">
                        <h3 className="text-xl text-[#4c82a8] font-semibold mb-4">
                            {'Edit Addon Percentage'}
                        </h3>

                        <div className=" w-full">
                            <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">
                                Addon Credit Percentage (%)
                            </label>

                            <input
                                type="text"
                                className="border border-gray-300 focus:border-blue-500 focus:ring-2 outline-none focus:ring-blue-200 transition-all px-3 py-2 w-full rounded-md"
                                value={creditPrice}
                                onChange={(e) => {
                                    const val = e.target.value;

                                    // Allow empty while typing
                                    if (val === "") {
                                        setCreditPrice("");
                                        return;
                                    }

                                    // Allow only digits
                                    if (!/^\d+$/.test(val)) return;

                                    let num = Number(val);

                                    // Clamp between 1 and 99
                                    if (num < 1) num = 1;
                                    if (num > 99) num = 99;

                                    setCreditPrice(num);
                                }}
                                placeholder="Enter percentage"
                            />

                        </div>


                        <div className="mt-6 flex gap-3 justify-end">
                            <button
                                className="px-4 py-2 text-white  bg-gray-400   rounded-md hover:bg-gray-500 transition"
                                onClick={() => setShowPresetModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-6 py-2 bg-[#4c82a8] text-white rounded-md hover:bg-[#4b82c0] transition"
                                onClick={handleSetCredit}
                            >
                                {isLoadingSetOnPrice ? 'Saving' : 'Save'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

        </div>
    );
}



function Modal({ children, onClose }) {
    const [show, setShow] = useState(false);

    // Trigger opening animation
    useEffect(() => {
        setTimeout(() => setShow(true), 10);
    }, []);

    // Trigger close animation
    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 200); // match animation duration
    };

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50
            bg-black/40 transition-opacity duration-200
            ${show ? "opacity-100" : "opacity-0"}`}
            onClick={handleClose}
        >
            {/* Prevent click from closing when clicking inside */}
            <div
                className={`bg-white rounded-lg shadow max-w-xl w-full transition-all duration-200
                ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>)
}


//  <div className="bg-white rounded-lg p-6 w-[400px]">
//                         <h3 className="text-lg font-medium mb-4">
//                             {initial ? "Edit Subscription" : "Add Subscription"}
//                         </h3>

//                         <div className="flex flex-col gap-3">

//                             <input
//                                 placeholder="Plan name"
//                                 className="border border-gray-300 px-2 py-1 rounded"
//                                 value={state.name}
//                                 onChange={(e) => setState({ ...state, name: e.target.value })}
//                             />

//                             <input
//                                 placeholder="Duration days"
//                                 type="number"
//                                 className="border px-2 border-gray-300  py-1 rounded"
//                                 value={state.duration_days}
//                                 onChange={(e) =>
//                                     setState({ ...state, duration_days: e.target.value })
//                                 }
//                             />

//                             {state.type === "credit" && (
//                                 <input
//                                     placeholder="Credits"
//                                     type="number"
//                                     className="border px-2 border-gray-300  py-1 rounded"
//                                     value={state.credits}
//                                     onChange={(e) =>
//                                         setState({ ...state, credits: e.target.value })
//                                     }
//                                 />
//                             )}

//                             <input
//                                 placeholder="Price (₹)"
//                                 type="number"
//                                 className="border px-2 border-gray-300  py-1 rounded"
//                                 value={state.price}
//                                 onChange={(e) => setState({ ...state, price: e.target.value })}
//                             />

//                             {/* Calculated Total (optional for credit plan) */}
//                             {state.type === "credit" && (
//                                 <div className="text-sm text-gray-600">
//                                     Calculated total: ₹
//                                     {(Number(state.credits) * Number(creditPrice || 0)).toFixed(2)}
//                                 </div>
//                             )}
//                         </div>

//                         <div className="mt-4 flex justify-end gap-2">
//                             <button className="px-4 py-2" onClick={onCancel}>
//                                 Cancel
//                             </button>
//                             <button
//                                 className="px-4 py-2 bg-blue-600 text-white rounded"
//                                 onClick={() => onSave({ ...initial, ...state })}
//                             >
//                                 Save
//                             </button>
//                         </div>
//                     </div>