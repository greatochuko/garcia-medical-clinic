import Input from "@/Components/layout/Input";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";
import { Loader2Icon, EyeIcon, EyeOffIcon, InfoIcon } from "lucide-react";
import React, { useState } from "react";
import { route } from "ziggy-js";

const inputFields = [
    { label: "User Role", required: true, disabled: true, id: "role" },
    { label: "First Name", required: true, id: "first_name" },
    { label: "Last Name", required: true, id: "last_name" },
    { label: "Middle Initial", id: "middle_initial", maxLength: 1 },
    { label: "License Number", required: true, id: "license_number" },
    { label: "PTR Number", id: "ptr_number" },
    { label: "Username", required: true, id: "login_id" },
    { label: "Password", required: true, id: "password", type: "password" },
    {
        label: "Confirm Password",
        required: true,
        id: "confirm_password",
        type: "password",
    },
];

const doctorFields = ["license_number", "ptr_number"];

export default function CreateAccount({ accountToUpdate }) {
    console.log(accountToUpdate);
    const pathname = window.location.pathname;
    const role = pathname.split("/").at(-1);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const { data, setData, post, put, processing } = useForm(
        accountToUpdate
            ? {
                  ...accountToUpdate,
                  middle_initial: accountToUpdate.middle_initial || "",
                  license_number: accountToUpdate.doctor?.license_number || "",
                  ptr_number: accountToUpdate.doctor?.ptr_number || "",
                  confirm_password: "",
                  password: "",
              }
            : {
                  ...inputFields.reduce((acc, field) => {
                      acc[field.id] = field.id === "role" ? role || "" : "";
                      return acc;
                  }, {}),
                  avatar_url: "",
              },
    );

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        for (const field of inputFields) {
            if (doctorFields.includes(field.id) && data.role !== "doctor")
                continue;
            if (accountToUpdate && field.type === "password") continue;
            if (field.required && !data[field.id]) {
                setError(`${field.label} is required`);
                return;
            }
        }

        if (!accountToUpdate) {
            if (data.password.length < 8) {
                setError("Password must be at least 8 characters long");
                return;
            }
            if (data.password !== data.confirm_password) {
                setError("Passwords do not match");
                return;
            }
        }

        if (!data.avatar_url) {
            setError("Please select an avatar");
            return;
        }

        if (accountToUpdate) {
            put(route("users.update", accountToUpdate.id), {
                onError: (err) => {
                    console.log(err);
                    setError(Object.values(err)[0]);
                },
                preserveScroll: true,
            });
        } else {
            post(route("users.store"), {
                onError: (err) => {
                    console.log(err);
                    setError(Object.values(err)[0]);
                },
                preserveScroll: true,
            });
        }
    }

    function toggleShowPassword(fieldId) {
        fieldId === "password"
            ? setShowPassword((prev) => !prev)
            : setShowConfirmPassword((prev) => !prev);
    }

    return (
        <AuthenticatedLayout
            pageTitle={accountToUpdate ? "Update Account" : "Create Account"}
        >
            <div className="flex-1">
                <div className="max-w-8xl mx-auto mt-6 flex h-full w-[95%] flex-col bg-white text-accent">
                    <h1 className="border-b-2 border-accent-200 py-2 text-center font-bold">
                        {accountToUpdate
                            ? "UPDATE USER ACCOUNT"
                            : "USER ACCOUNT REGISTRATION"}
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col items-center gap-4 p-4">
                            <p className="mb-4 text-center text-sm">
                                {accountToUpdate
                                    ? "Update the user account details below."
                                    : "This registration grants the user access to clinical tools, patient records, and system features necessary for their role."}
                            </p>

                            {inputFields.map((field) =>
                                (doctorFields.includes(field.id) &&
                                    data.role !== "doctor") ||
                                (accountToUpdate &&
                                    field.type === "password") ? null : (
                                    <div
                                        key={field.id}
                                        className="relative flex w-full max-w-sm flex-col gap-2"
                                    >
                                        <label
                                            htmlFor={field.id}
                                            className="text-[13px]"
                                        >
                                            {field.label}
                                            {field.required && (
                                                <span className="text-red-500">
                                                    {" "}
                                                    *
                                                </span>
                                            )}
                                        </label>
                                        <div className="relative">
                                            <Input
                                                value={data[field.id]}
                                                onChange={(e) =>
                                                    setData(
                                                        field.id,
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={field.disabled}
                                                type={
                                                    field.id === "password"
                                                        ? showPassword
                                                            ? "text"
                                                            : "password"
                                                        : field.id ===
                                                            "confirm_password"
                                                          ? showConfirmPassword
                                                              ? "text"
                                                              : "password"
                                                          : field.type
                                                }
                                                id={field.id}
                                                name={field.label}
                                                required={field.required}
                                                maxLength={field.maxLength}
                                                className={
                                                    field.id === "role"
                                                        ? "max-w-40 capitalize"
                                                        : "w-full"
                                                }
                                                autoComplete="new-password"
                                            />
                                            {field.type === "password" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleShowPassword(
                                                            field.id,
                                                        )
                                                    }
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-transparent p-1 duration-200 hover:border-accent-400 hover:bg-accent-300"
                                                >
                                                    {field.id === "password" ? (
                                                        showPassword ? (
                                                            <EyeOffIcon
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <EyeIcon
                                                                size={16}
                                                            />
                                                        )
                                                    ) : showConfirmPassword ? (
                                                        <EyeOffIcon size={16} />
                                                    ) : (
                                                        <EyeIcon size={16} />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ),
                            )}

                            <div className="flex w-full flex-col items-center gap-2">
                                <h4 className="w-full max-w-sm text-sm">
                                    Choose an Avatar Image{" "}
                                    <span className="text-red-500">*</span>
                                </h4>

                                <div className="flex items-center justify-start gap-4 overflow-x-auto px-4 py-2">
                                    {Array.from({ length: 6 }, (_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() =>
                                                setData(
                                                    "avatar_url",
                                                    `/images/avatar-image-${i + 1}.png`,
                                                )
                                            }
                                            className={`relative shrink-0 rounded-full border-2 border-[#419BBF]/45`}
                                        >
                                            <img
                                                src={`/images/avatar-image-${i + 1}.png`}
                                                alt={`Avatar ${i + 1}`}
                                                className="h-16 w-16 rounded-full object-cover sm:h-24 sm:w-24"
                                            />
                                            {data.avatar_url ===
                                                `/images/avatar-image-${i + 1}.png` && (
                                                <div className="absolute bottom-0 right-0 translate-x-3 rounded-full bg-white p-0.5 sm:p-1">
                                                    <img
                                                        src="/assets/icons/check-icon.svg"
                                                        alt="check icon"
                                                        className="h-6 w-6 sm:h-8 sm:w-8"
                                                    />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <p className="flex items-center gap-2 rounded-md border border-red-100 bg-red-50 p-1 px-2 text-[13px] text-red-500">
                                    <InfoIcon size={14} />
                                    {error}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 border-t-2 border-accent-200 p-4">
                            <button
                                disabled={processing}
                                className="rounded-md border border-accent bg-white p-2 text-xs text-accent duration-200 hover:bg-accent-200"
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={processing}
                                className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-xs text-white duration-200 hover:bg-accent/90"
                                type="submit"
                            >
                                {processing ? (
                                    <>
                                        <Loader2Icon
                                            size={14}
                                            className="animate-spin"
                                        />
                                        {accountToUpdate
                                            ? "Updating..."
                                            : "Creating..."}
                                    </>
                                ) : accountToUpdate ? (
                                    "Update"
                                ) : (
                                    "Create"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
