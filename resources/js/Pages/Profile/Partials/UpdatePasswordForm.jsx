import React from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import Input from "@/Components/layout/Input";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { Loader2Icon } from "lucide-react";

export default function UpdatePasswordForm({ className = "" }) {
    const { data, setData, errors, put, reset, processing, clearErrors } =
        useForm({
            current_password: "",
            password: "",
            password_confirmation: "",
        });

    const passwordsDoNotMatch =
        data.password_confirmation &&
        data.password !== data.password_confirmation;

    const passwordNotLong = data.password && data.password.length < 8;

    const cannotSubmit =
        passwordNotLong ||
        passwordsDoNotMatch ||
        !data.current_password ||
        !data.password ||
        !data.password_confirmation;

    function updatePassword(e) {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                }

                if (errors.current_password) {
                    reset("current_password");
                }
            },
        });
    }

    const handleChange = (field, value) => {
        setData(field, value);
        clearErrors(field);

        if (field === "password_confirmation" && value !== data.password) {
            errors.password_confirmation = "Passwords do not match";
        } else if (field === "password_confirmation") {
            clearErrors("password_confirmation");
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Update Password
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Ensure your account uses a strong, unique password.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Current Password"
                    />
                    <Input
                        id="current_password"
                        value={data.current_password}
                        onChange={(e) =>
                            handleChange("current_password", e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />
                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />
                    <Input
                        id="password"
                        value={data.password}
                        onChange={(e) =>
                            handleChange("password", e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                    <InputError
                        message={
                            passwordNotLong
                                ? "Password must be at least 8 characters long"
                                : errors.password
                        }
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />
                    <Input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            handleChange(
                                "password_confirmation",
                                e.target.value,
                            )
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                    <InputError
                        message={
                            passwordsDoNotMatch
                                ? "Passwords do not match"
                                : errors.password_confirmation
                        }
                        className="mt-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing || cannotSubmit}
                    className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-xs font-semibold text-white duration-200 hover:opacity-90 disabled:opacity-50"
                >
                    {processing ? (
                        <>
                            <Loader2Icon size={14} className="animate-spin" />
                            SAVING...
                        </>
                    ) : (
                        "SAVE"
                    )}
                </button>
            </form>
        </section>
    );
}
