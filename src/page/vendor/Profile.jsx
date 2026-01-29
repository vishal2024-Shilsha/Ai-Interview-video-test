import { SquarePen, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useAddBranchDetailsMutation, useAddCompanyProfileMutation, useDeleteBranchDetailsMutation, useGetVendorProfileQuery, useUpdateBranchDetailsMutation, useUpdateCompanyProfileMutation, useUpdateVendorProfileMutation } from "../../redux/services/vendorApi";
import toast from "react-hot-toast";
import { useGetCountryDataQuery } from "../../redux/services/externalApi";
import dummyImg from '../../assets/userImg.jpg'

/* ================= PRESET DATA ================= */




const EMPTY_BRANCH = {
    country: "",
    address: "",
    pocName: "",
    pocEmail: "",
    pocMobile: "",
    pocGender: "",
};

const PRESET_VENDOR = {
    logo: "https://via.placeholder.com/120",
    logoFile: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    companyName: "",
    companyRegNo: "",
    website: "",
    branches: [],
    companyLogo: null,
    companyFileLogo: null
};

const REQUIRED_BRANCH_FIELDS = [
    "country",
    "address",
    "pocName",
    "pocEmail",
    "pocMobile",
    "pocGender",
    "pocAddress"
];

/* ================= COMPONENT ================= */

export default function VendorProfileMergedForm() {
    const { data } = useGetVendorProfileQuery();
    const [vendor, setVendor] = useState(PRESET_VENDOR);
    const [tempVendor, setTempVendor] = useState(PRESET_VENDOR);
    const [editing, setEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [updateVendorProfile, { isLoading, isError }] = useUpdateVendorProfileMutation()
    const [addCompanyDetail, { isLoading: companyLoading, isError: comapnyError }] = useAddCompanyProfileMutation();
    const [updateCompanyDetail, { isLoading: companyupdatesLoading, isError: companyUpdateError }] = useUpdateCompanyProfileMutation();
    const [addBranchDetail, { isLoading: addBranchLoader, isError: addBranchError }] = useAddBranchDetailsMutation()
    const [deleteBranchDetails, { isLoading: deleteLoading }] = useDeleteBranchDetailsMutation();
    const [updateBrancDetails, { isLoading: updateBranchLoading }] = useUpdateBranchDetailsMutation();
    const [personalEdit, setPersonalEdit] = useState(false);
    const [companyEdit, setCompanyEdit] = useState(false);
    /* ================= LOAD DATA ================= */

    const { data: countryData, isLoading: countryLoading } = useGetCountryDataQuery();


    useEffect(() => {
        if (data) {
            const { vendor: vendorDetail, company, branches } = data
            // console.log(first)
            const merged = {
                ...PRESET_VENDOR,
                name: vendorDetail?.name || "",
                email: vendorDetail?.email || "",
                phone: vendorDetail?.phone || "",
                address: vendorDetail?.address || "",
                gender: vendorDetail?.gender || "",
                logo: vendorDetail?.profile_image || null,
                companyName: company?.company_name || "",
                companyRegNo: company?.registration_number || "",
                website: company?.website || "",
                branches: data?.branches?.length
                    ? data.branches.map((b) => ({
                        country: b?.country || "",
                        address: b?.branch_location || "",
                        pocName: b?.pocs[0]?.full_name || "",
                        pocEmail: b?.pocs[0]?.email || "",
                        pocMobile: b?.pocs[0]?.phone || "",
                        pocGender: b?.pocs[0]?.gender || "",
                        pocAddress: b?.pocs[0]?.address || "",
                        pocId: b?.pocs[0]?.id || null,
                        id: b?.id || null
                    }))
                    : [],
                companyLogo: company?.company_logo
            };

            setVendor(merged);
            setTempVendor(structuredClone(merged));
        }
    }, [data]);

    /* ================= HELPERS ================= */

    const isBranchValid = (branch) =>
        REQUIRED_BRANCH_FIELDS.every(
            (key) => branch[key] && branch[key].toString().trim() !== ""
        );

    const validateBranches = () => {
        const newErrors = {};

        tempVendor.branches.forEach((b, i) => {
            REQUIRED_BRANCH_FIELDS.forEach((field) => {
                if (!b[field] || b[field].toString().trim() === "") {
                    newErrors[`branch_${i}_${field}`] = "Required";
                }
            });
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ================= HANDLERS ================= */

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempVendor((p) => ({ ...p, [name]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempVendor((p) => ({
                ...p,
                companyLogo: URL.createObjectURL(file),
                companyFileLogo: file
            }));
        }
    };

    const handleProfileChange = (e) => {
        const file = e.target.files[0];
        console.log("file-come", file);
        if (file) {
            setTempVendor((p) => ({
                ...p,
                logo: URL.createObjectURL(file),
                logoFile: file
            }));

        }
    };

    const edit = () => {
        setTempVendor(structuredClone(vendor));
        setEditing(true);
    };

    // console.log("vvv", data)

    const cancel = () => {
        setTempVendor(structuredClone(vendor));
        setErrors({});
        setEditing(false);
    };


    const profileUpdateHandler = async (e) => {
        e.stopPropagation();
        try {
            const { name, phone, address, gender
            } = tempVendor
            if (!name || !phone || !address || !gender) {
                return toast.error("Please Fill all required details")
            }
            const formdata = new FormData();
            formdata.append('vendor', JSON.stringify({
                id: data?.vendor?.id || null,
                vendor_name: name,
                phone,
                address: address,
                gender: gender,
            }))


            if (tempVendor?.logoFile) {
                formdata.append('vendor_profile_image', tempVendor?.logoFile)
            }

            const result = await updateVendorProfile(formdata)
            if (result?.data) {
                toast.success("profile update sucessfully.")
                setPersonalEdit(false);
            }
            // console.log("ress", result);
        } catch (err) {
            console.log("err in update form", err)
            toast.error("Something went wrong")
        }
    }

    const companyUpdateHandler = async (e) => {
        e.stopPropagation();
        const companyId = data?.company
        console.log("first", tempVendor)
        const { companyFileLogo, companyName, companyRegNo,
            website = "", address
        } = tempVendor
        console.log("koko", (!companyName && !website && !address))
        if (!companyName?.trim() && !website?.trim() && !address?.trim()) {
            return toast.error("Please fill all required information");
        }


        try {
            const formdata = new FormData();
            formdata.append('company', JSON.stringify({
                ...(companyId?.id && { id: companyId.id }),
                company_name: companyName,
                registration_number: companyRegNo,
                website,
                location: address
            }))
            console.log("fomdata", formdata);
            if (tempVendor?.companyFileLogo) {
                formdata.append('company_logo', companyFileLogo)
            }

            const result = !companyId?.id ? await addCompanyDetail(formdata) : await updateCompanyDetail(formdata);

            if (result?.data) {
                toast.success("profile update sucessfully.")
                setCompanyEdit(false);
            }
            // console.log("ress", result);
        } catch (err) {
            console.log("err in update form", err)
            toast.error("Something went wrong")
        }
    }

    const [requiredBranchFields, setRequiredBranchFields] = useState({
        country: "",
        address: "",
        pocName: "",
        pocEmail: "",
        pocMobile: "",
        pocGender: "",
        pocAddress: "",
    });


    const handlePoChange = (e) => {
        const { name, value } = e.target;
        setRequiredBranchFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const save = async (e) => {
        e.preventDefault();
        console.log("requiredBranchFields", requiredBranchFields)
        if (!requiredBranchFields?.country && !requiredBranchFields?.pocName && !requiredBranchFields?.pocEmail
            && !requiredBranchFields?.pocGender && !requiredBranchFields?.pocMobile && !requiredBranchFields?.address
        ) {
            return toast.error("Please Fill all required information")
        }
        const formdata = new FormData();
        if (editId) {
            formdata.append(
                'branches_data',
                JSON.stringify({
                    ...(data?.company?.id && { company_id: data.company.id }),
                    country: requiredBranchFields?.country || "",
                    branch_location: requiredBranchFields?.address || "",
                    pocs: [
                        {
                            ...(pocId && { id: pocId }),
                            full_name: requiredBranchFields?.pocName || "",
                            email: requiredBranchFields?.pocEmail || "",
                            phone: `${requiredBranchFields?.pocMobile}` || "",
                            address: requiredBranchFields?.pocAddress || "",
                            gender: requiredBranchFields?.pocGender || ""
                        }
                    ]
                })
            );
        } else {
            formdata.append(
                'branches_data',
                JSON.stringify({
                    ...(data?.company?.id && { company_id: data.company.id }),
                    country: requiredBranchFields?.country || "",
                    branch_location: requiredBranchFields?.address || "",
                    pocs: [
                        {

                            full_name: requiredBranchFields?.pocName || "",
                            email: requiredBranchFields?.pocEmail || "",
                            phone: `+${requiredBranchFields?.pocMobile}` || "",
                            address: requiredBranchFields?.pocAddress || "",
                            gender: requiredBranchFields?.pocGender || ""
                        }
                    ]
                })
            );
        }

        try {
            const result = editId ? await updateBrancDetails({ id: editId, formdata }) : await addBranchDetail(formdata);
            console.log("ress", result);
            if (result?.error) {
                return toast.error(result?.error?.data?.detail ?? "Internal Server Error")
            }

            if (result?.data) {
                toast.success(pocId ? 'poc details update successfully' : "poc details added sucessfully.")
                setRequiredBranchFields({
                    country: "",
                    address: "",
                    pocName: "",
                    pocEmail: "",
                    pocMobile: "",
                    pocGender: "",
                    pocAddress: "",
                })
                setEditing(false);
            }
        } catch (err) {
            console.log("err in update form", err)
            toast.error("Something went wrong")
        }
    };

    function handleClose() {
        setRequiredBranchFields({
            country: "",
            address: "",
            pocName: "",
            pocEmail: "",
            pocMobile: "",
            pocGender: "",
            pocAddress: "",
        })
        setEditId(null);
        setEditing(false)
    }

    const [editId, setEditId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [pocId, setPOCId] = useState(null);

    const deleteBranch = async () => {
        if (!deleteId) {
            return toast.error("Branch Id not exist, Pls try again.")
        }
        try {
            const result = await deleteBranchDetails(deleteId);
            console.log("ress", result);
            if (result?.data) {
                setTimeout(() => {
                    toast.success("Branch details deleted successfully.");
                    setIsDeleteModalOpen(false)
                }, 1000)

            }
        } catch (err) {
            console.log("err", err);
            toast.error("Internal Server Error")
        }
    };

    function EditHandler(param) {
        setEditId(param?.id)
        setPOCId(param?.pocId ?? null)
        const { address, country, pocAddress, pocGender, pocMobile, pocName, pocEmail } = param
        console.log("param", param);
        setRequiredBranchFields({
            country,
            address,
            pocName,
            pocEmail,
            pocMobile,
            pocGender,
            pocAddress,
        })
        setEditing(true);
    }

    return (
        <div className="bg-gray-100 min-h-screen py-6 space-y-8">

            {/* ================= PERSONAL DETAILS ================= */}
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">

                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-blue-900">
                        Personal Details
                    </h2>

                    {!personalEdit && (
                        <button
                            onClick={() => setPersonalEdit(!personalEdit)}
                            className="p-2 rounded-md hover:bg-blue-100 transition"
                        >
                            <SquarePen size={18} className="text-blue-700 cursor-pointer" />
                        </button>
                    )}

                    {personalEdit && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setPersonalEdit(!personalEdit)}
                                className="px-4 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>

                            <button onClick={profileUpdateHandler}
                                className="px-4 py-1.5 rounded-md bg-[#3189ee] text-white hover:bg-blue-700 transition"
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>


                <div className="flex gap-6 items-center" >
                    {/* Profile Image */}
                    <div className="relative group">
                        {
                            <img
                                src={tempVendor.logo??dummyImg}
                                alt="upload img"
                                className="w-32 h-32 rounded-full object-cover border border-blue-200app"
                            />
                        }

                        {personalEdit && (
                            <>
                                <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-full">
                                    Choose
                                </div>
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleProfileChange}
                                />
                            </>
                        )}
                    </div>

                    {/* Personal Fields */}
                    <div className="grid md:grid-cols-3 gap-4 flex-1">
                        <Input label="Vendor Name" required value={tempVendor.name} readOnly />
                        <Input label="Email" required value={tempVendor.email} readOnly />

                        <div>
                            <label className="text-sm">Mobile <span className=" text-red-500">*</span>  </label>
                            <PhoneInput
                                country="in"
                                disabled={!personalEdit}
                                value={tempVendor.phone}
                                inputStyle={{ width: "100%" }}
                                onChange={(val) =>
                                    setTempVendor((p) => ({ ...p, phone: val }))
                                }
                                inputProps={{
                                    required: true,
                                    name: "phone",
                                }}
                            />
                        </div>

                        <Input
                            label="Address"
                            required
                            name="address"
                            placeholder="Address"
                            value={tempVendor.address}
                            readOnly={!personalEdit}
                            onChange={handleChange}
                            wrapperClassName="md:col-span-2"
                        />

                        <div className="flex   flex-col">
                            <label className="text-sm font-semibold mb-1">Gender <span className=" text-red-500">*</span> </label>
                            <select
                                name="gender"
                                value={tempVendor.gender}
                                disabled={!personalEdit}
                                onChange={(e) =>
                                    handleChange({
                                        target: { name: "gender", value: e.target.value },
                                    })
                                }
                                className=" rounded border border-gray-300 p-2"
                            >
                                <option disabled value="">Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= COMPANY DETAILS ================= */}
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div className=" flex justify-between" >
                    <h2 className="text-lg font-semibold text-blue-900">
                        Company Details
                    </h2>
                    {!companyEdit && (
                        <button
                            onClick={() => setCompanyEdit(!companyEdit)}
                            className="p-2 rounded-md hover:bg-blue-100 transition"
                        >
                            <SquarePen size={18} className="text-blue-700 cursor-pointer" />
                        </button>
                    )}
                    {companyEdit && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCompanyEdit(!companyEdit)}
                                className="px-4 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>

                            <button onClick={companyUpdateHandler}
                                className="px-4 py-1.5 rounded-md bg-[#3189ee] text-white hover:bg-blue-700 transition"
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>


                <div className="grid md:grid-cols-3 gap-4">
                    <Input
                        label="Company Name"
                        required
                        name="companyName"
                        placeholder="Company Name"
                        value={tempVendor.companyName}
                        readOnly={!companyEdit}
                        onChange={handleChange}
                    />

                    <Input
                        label="Registration No."
                        value={tempVendor.companyRegNo}
                        name="companyRegNo"
                        placeholder="Registration Number"
                        readOnly={!companyEdit}
                        onChange={handleChange}
                    />

                    <Input
                        label="Website"
                        required
                        name="website"
                        placeholder="Website"
                        value={tempVendor.website}
                        readOnly={!companyEdit}
                        onChange={handleChange}
                    />

                    {/* Company Logo */}
                    <div className=" relative">
                        <label className="block mb-2 text-sm font-medium">
                            Company Logo (Optional)
                        </label>

                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleLogoChange}
                        />

                        <div className="flex gap-4">
                            <div className="flex items-center justify-center w-full h-20 border-2 border-blue-900 border-dashed rounded-lg">
                                Click to upload logo
                            </div>

                            {tempVendor.companyLogo && (
                                <img
                                    src={tempVendor.companyLogo}
                                    className="w-32 h-20 object-cover shadow-lg "
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= POINT OF CONTACT DETAILS ================= */}
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div className=" flex justify-between" >
                    <h2 className="text-lg font-semibold text-blue-900">
                        Point of Contact Details
                    </h2>
                </div>


                {tempVendor?.branches?.map((b, i) => (
                    <div
                        key={i}
                        className="border border-gray-200 p-4 rounded space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">
                                Point of Contact - {i + 1}
                            </h3>
                            <div className="flex gap-3">
                                <button
                                    className=" bg-gray-400 cursor-pointer p-2 rounded-full"
                                    onClick={() => EditHandler(b)}
                                >
                                    <SquarePen size={14} color="white" />
                                </button>
                                <button
                                    className="bg-red-100 cursor-pointer p-2 rounded-full"
                                    onClick={() => [setIsDeleteModalOpen(true), setDeleteId(b?.id ?? null)]}
                                >
                                    <Trash2 size={16} className="text-red-500" />
                                </button>
                            </div>

                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Input label="Country" name="country" readOnly placeholder="Country" value={b.country} />
                            <Input label="Branch Address" name="address" readOnly placeholder="Branch Location" value={b.address} />
                            <Input label="POC Name" name="pocName" readOnly placeholder="Employee Name" value={b.pocName} />
                            <Input label="POC Email" name="pocEmail" readOnly placeholder="Employee Email" value={b.pocEmail} />
                            <div>
                                <label className="text-sm text-gray-600 font-semibold mb-1">Gender</label>
                                <select
                                    disabled={true}
                                    name="pocGender"
                                    value={b.pocGender}
                                    className="border border-gray-300 rounded p-2 w-full"
                                >
                                    <option disabled value="">Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <Input
                                label="POC Address"
                                name="pocAddress"
                                readOnly
                                value={b?.pocAddress}
                                placeholder="Employee Address"
                            />

                            <div>
                                <label className="text-sm text-gray-600 font-semibold mb-1">POC Phone</label>
                                <PhoneInput
                                    country="in"
                                    disabled
                                    value={b.pocMobile}
                                    inputStyle={{ width: "100%" }}
                                />
                            </div>

                        </div>
                    </div>
                ))}


                <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 text-blue-600"
                >
                    <Plus size={16} /> Add POC
                </button>

            </div>

            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClose}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative w-full max-w-xl overflow-y-auto max-h-80 md:max-h-full p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-2 text-lg font-semibold">Employee Detail Form</h2>
                        <hr className=" text-gray-300 mb-4" />
                        <form className="space-y-4" onSubmit={save}>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex flex-col" >
                                    <label className="text-sm text-gray-600 font-semibold mb-1" htmlFor="country">Country</label>
                                    <select name="country" id="country" onChange={handlePoChange}
                                        className={`border outline-none rounded px-3 text-gray-500 py-2 ${false ? "border-red-500" : "border-gray-300"
                                            } ${false ? "bg-gray-100" : ""}`}
                                        value={requiredBranchFields.country}  >
                                        <option value="" disabled>Select Country</option>
                                        {countryData?.data?.length > 0 &&
                                            countryData?.data?.map((item) => (
                                                <option value={item?.name}> {item?.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                {/* <Input label="Country" name="country"  placeholder="Country"/> */}
                                <Input label="Branch Address" name="address" onChange={handlePoChange} placeholder="Branch Location" value={requiredBranchFields.address} />
                                <Input label="POC Name" name="pocName" onChange={handlePoChange} placeholder="Employee Name" value={requiredBranchFields.pocName} />
                                <Input label="POC Email" name="pocEmail" onChange={handlePoChange} placeholder="Employee Email" value={requiredBranchFields.pocEmail} />
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 font-semibold mb-1">Gender</label>
                                    <select
                                        disabled={!editing}
                                        name="pocGender"
                                        onChange={handlePoChange}
                                        value={requiredBranchFields.pocGender}
                                        className="border border-gray-300 text-gray-500 rounded p-2 w-full"
                                    >
                                        <option disabled value="">Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <Input
                                    label="POC Address"
                                    name="pocAddress"
                                    value={requiredBranchFields?.pocAddress}
                                    // value={b.pocAddress}
                                    onChange={handlePoChange}
                                    placeholder="Employee Address"
                                />

                                <div>
                                    <label className="text-sm text-gray-600 font-semibold mb-1">POC Phone</label>
                                    <PhoneInput
                                        country="in"
                                        value={requiredBranchFields.pocMobile}
                                        inputStyle={{ width: "100%" }}
                                        onChange={(v) =>
                                            setRequiredBranchFields((p) => ({
                                                ...p, pocMobile: v
                                            }))
                                        }
                                    />
                                </div>



                            </div>
                            <div className="flex flex-row gap-3">
                                <button type="submit"
                                    className="px-4 py-1.5 rounded-md bg-[#1b68c0]  text-white hover:bg-blue-500 transition"
                                >
                                    Save
                                </button>
                                <button onClick={handleClose}
                                    className="px-4 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-700 transition"
                                >Cancel</button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                    <div className="relative w-full max-w-xl p-6 bg-white rounded-xl shadow-2xl animate-scaleIn">

                        {/* Icon */}
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
                            <svg
                                className="w-6 h-6 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                                />
                            </svg>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-semibold text-center text-gray-900">
                            Delete Branch Details
                        </h2>

                        {/* Message */}
                        <p className="mt-2 text-sm text-center text-gray-600">
                            Are you sure you want to delete this branch?
                            This action <span className="font-medium text-red-600">cannot be undone</span>.
                        </p>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                                onClick={deleteBranch}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

            )}

        </div>

    );
}

/* ================= REUSABLE ================= */

const Divider = () => <div className="border-t border-gray-200" />;

const Input = ({
    label,
    required,
    error,
    readOnly,
    wrapperClassName = "",
    ...props
}) => (
    <div className={`flex flex-col ${wrapperClassName}`}>
        <label className="text-sm text-gray-600 font-semibold mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            {...props}
            readOnly={readOnly}
            className={`border outline-none rounded px-3 py-2 ${error ? "border-red-500" : "border-gray-300"
                } ${readOnly ? "bg-gray-100" : ""}`}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
);

