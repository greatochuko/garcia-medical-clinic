import React from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import Input from "@/Components/layout/Input";
import { Loader2Icon } from "lucide-react";

export default function UpdateProfileInformation({ className }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing } = useForm({
        first_name: user.first_name,
        last_name: user.last_name,
        middle_initial: user.middle_initial || "",
    });

    const cannotSubmit = !data.first_name || !data.last_name;

    function submit(e) {
        e.preventDefault();
        if (cannotSubmit) return;

        patch(route("profile.update"), {
            preserveScroll: true,
        });
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your account&apos;s profile information
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 w-full space-y-6">
                <div>
                    <InputLabel
                        htmlFor="first_name"
                        value="First Name"
                        className="w-fit"
                    />
                    <Input
                        id="first_name"
                        className="mt-1 block w-full"
                        value={data.first_name}
                        onChange={(e) => setData("first_name", e.target.value)}
                        required
                        autoComplete="first_name"
                    />
                    <InputError className="mt-2" message={errors.first_name} />
                </div>
                <div>
                    <InputLabel
                        htmlFor="last_name"
                        value="Last Name"
                        className="w-fit"
                    />
                    <Input
                        id="last_name"
                        className="mt-1 block w-full"
                        value={data.last_name}
                        onChange={(e) => setData("last_name", e.target.value)}
                        required
                        autoComplete="last_name"
                    />
                    <InputError className="mt-2" message={errors.last_name} />
                </div>

                <div>
                    <InputLabel
                        htmlFor="middle_initial"
                        value="Middle Initial"
                        className="w-fit"
                    />
                    <Input
                        id="middle_initial"
                        className="mt-1 block w-full"
                        value={data.middle_initial}
                        onChange={(e) =>
                            setData(
                                "middle_initial",
                                e.target.value.toUpperCase(),
                            )
                        }
                        maxLength={1}
                        autoComplete="middle_initial"
                    />
                    <InputError
                        className="mt-2"
                        message={errors.middle_initial}
                    />
                </div>
                <button
                    type="submit"
                    disabled={processing || cannotSubmit}
                    className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-xs font-semibold text-white duration-200 hover:opacity-90 disabled:opacity-50"
                >
                    {processing ? (
                        <>
                            <Loader2Icon size={14} className="animate-spin" />{" "}
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
