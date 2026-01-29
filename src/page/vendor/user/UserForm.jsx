import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import {motion} from 'framer-motion'
import { useGetCountryDataQuery } from "../../../redux/services/externalApi";

// ✅ Validation Schema
const validationSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required").max(30, "Max 30 characters"),
    lastName: yup.string().required("Last Name is required").max(30, "Max 30 characters"),
    birthCountry: yup.object().nullable().required("Birth Country is required"),
    nationality: yup.object().nullable().required("Nationality is required"),
    countryOfResidence: yup.object().nullable().required("Country of Residence is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    mobileNumber: yup
    .string()
    .required('Mobile number is required')
    .test('is-valid-phone', 'Invalid phone number', function (value) {
      const { countryCode } = this.parent; // 👈 get the value from the same form

      if (!value) return false;

      try {
        const formattedValue = value.startsWith('+') ? value : `+${value}`;
        const phoneNumber = parsePhoneNumberFromString(formattedValue);

        console.log('📞 Parsed:', phoneNumber);

        // 1️⃣ Check that the number is valid
        if (!phoneNumber?.isValid()) return false;

        // 2️⃣ Optionally ensure country matches
        if (
          countryCode &&
          phoneNumber.country &&
          phoneNumber.country.toLowerCase() !== countryCode.toLowerCase()
        ) {
          return this.createError({
            message: `Phone number does not match selected country (${countryCode.toUpperCase()})`,
          });
        }

        return true; // ✅ passes validation
      } catch (err) {
        console.error('Phone parse error:', err);
        return false;
      }
    }),
});

export default function UserForm({ onSubmit,isVendorAdding, onClose }) {
    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    // console.log("for", errors) 
    const countryCode = watch("countryCode") || "in";
  const {data:countryData,isLoading:countryLoading} = useGetCountryDataQuery();
    // const 
    const countryOptions =
  countryData?.data?.map((item) => ({
    label: item?.name,
    value: item?.name,
  })) || [];


    return (
        <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <motion.div
             initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
                <h2 className="text-2xl font-semibold text-gray-500 mb-5 border-b pb-3">
                    Add New User
                </h2>

                <form
                  onSubmit={handleSubmit((data) => onSubmit(data, false))}
                className="grid grid-cols-2 gap-5">
                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                        </label>
                        <input
                            {...register("firstName")}
                            placeholder="Enter first name"
                            className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 ${errors.firstName ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.firstName && (
                            <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                        </label>
                        <input
                            {...register("lastName")}
                            placeholder="Enter last name"
                            className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 ${errors.lastName ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.lastName && (
                            <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                        )}
                    </div>

                    {/* Birth Country */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Birth Country
                        </label>
                        <Controller
                            name="birthCountry"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={countryOptions}
                                    placeholder="Select Birth Country"
                                    classNamePrefix="react-select"
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            borderColor: errors.birthCountry ? "#ef4444" : "#d1d5db",
                                            borderRadius: "0.5rem",
                                            boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
                                        }),
                                    }}
                                />
                            )}
                        />
                        {errors.birthCountry && (
                            <p className="text-sm text-red-500 mt-1">{errors.birthCountry.message}</p>
                        )}
                    </div>

                    {/* Nationality */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nationality
                        </label>
                        <Controller
                            name="nationality"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={countryOptions}
                                    placeholder="Select Nationality"
                                    classNamePrefix="react-select"
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            borderColor: errors.nationality ? "#ef4444" : "#d1d5db",
                                            borderRadius: "0.5rem",
                                            boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
                                        }),
                                    }}
                                />
                            )}
                        />
                        {errors.nationality && (
                            <p className="text-sm text-red-500 mt-1">{errors.nationality.message}</p>
                        )}
                    </div>

                    {/* Country of Residence */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country of Residence
                        </label>
                        <Controller
                            name="countryOfResidence"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={countryOptions}
                                    placeholder="Select Country of Residence"
                                    classNamePrefix="react-select"
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            borderColor: errors.countryOfResidence ? "#ef4444" : "#d1d5db",
                                            borderRadius: "0.5rem",
                                            boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
                                        }),
                                    }}
                                />
                            )}
                        />
                        {errors.countryOfResidence && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.countryOfResidence.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Enter email"
                            className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Mobile Number */}
                    <div className="">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile Number
                        </label>
                        <Controller
                            name="mobileNumber"
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    country={countryCode}
                                    onChange={(value, country) => {
                                        setValue("mobileNumber", value.replace(/[^0-9]/g, ""));
                                        setValue("countryCode", country.countryCode);
                                    }}
                                    inputStyle={{
                                        width: "100%",
                                        borderRadius: "0.5rem",
                                        borderColor: errors.mobileNumber ? "#ef4444" : "#d1d5db",
                                        // padding: "10px 12px",
                                    }}
                                    placeholder="Enter phone number"
                                />
                            )}
                        />
                        {errors.mobileNumber && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.mobileNumber.message}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="col-span-2 flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                           {isVendorAdding ? 'Saving...' : 'Save User'} 
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

// export const countryOptions =() => {
//     console.log("fff",countryData)

//     return countryData?.data?.length > 0
//     ? countryData.data.map((item) =>   item?.name)
//     : null;
// }
  

