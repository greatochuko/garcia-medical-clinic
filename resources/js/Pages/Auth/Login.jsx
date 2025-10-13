import React, { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import FlashMessage from "@/Components/FlashMessage";
import toast from "react-hot-toast";

export default function Login() {
    const { data, setData, post, processing, reset } = useForm({
        email: "",
        login_id: "",
        password: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, [reset]);

    const submit = (e) => {
        e.preventDefault();
        post("/login", {
            onError: (err) => {
                toast.error(Object.values(err)[0]);
            },
        });
    };

    return (
        <>
            <Head title="Log in" />

            <FlashMessage />
            <div
                className="flex min-h-screen items-center justify-center"
                style={{
                    background:
                        "linear-gradient(180deg, #92B1B9 0%, #7A9BA5 40%, #2281A9 100%)",
                    height: "100vh",
                }}
            >
                <div className="relative -mt-[150px] w-[580px]">
                    <div className="relative flex w-full justify-center">
                        <img
                            src="./images/garcia-logo.png"
                            alt="Garcia Medical Clinic Logo"
                            className="h-[200px]"
                        />
                    </div>

                    <div className="relative mt-2 rounded-3xl bg-[#4B7C98]/20 p-16 pb-24 shadow-2xl backdrop-blur-lg">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="relative flex justify-center">
                                <div className="relative w-[320px]">
                                    <input
                                        id="login_id"
                                        type="text"
                                        name="login_id"
                                        value={data.login_id}
                                        className="h-12 w-full rounded-full border-2 border-[#FFFFFF] bg-transparent px-6 pl-10 text-center text-white placeholder-white/80 backdrop-blur-sm focus:border-white focus:outline-none"
                                        placeholder="Login ID"
                                        onChange={(e) =>
                                            setData("login_id", e.target.value)
                                        }
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M8 0C9.06087 0 10.0783 0.421427 10.8284 1.17157C11.5786 1.92172 12 2.93913 12 4C12 5.06087 11.5786 6.07828 10.8284 6.82843C10.0783 7.57857 9.06087 8 8 8C6.93913 8 5.92172 7.57857 5.17157 6.82843C4.42143 6.07828 4 5.06087 4 4C4 2.93913 4.42143 1.92172 5.17157 1.17157C5.92172 0.421427 6.93913 0 8 0ZM8 10C12.42 10 16 11.79 16 14V16H0V14C0 11.79 3.58 10 8 10Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex justify-center">
                                <div className="relative w-[320px]">
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="h-12 w-full rounded-full border-2 border-[#FFFFFF] bg-transparent px-6 pl-10 text-center text-white placeholder-white/80 backdrop-blur-sm focus:border-white focus:outline-none"
                                        placeholder="****"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                                        <svg
                                            width="16"
                                            height="21"
                                            viewBox="0 0 16 21"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M2 21C1.45 21 0.979333 20.8043 0.588 20.413C0.196666 20.0217 0.000666667 19.5507 0 19V9C0 8.45 0.196 7.97933 0.588 7.588C0.98 7.19667 1.45067 7.00067 2 7H3V5C3 3.61667 3.48767 2.43767 4.463 1.463C5.43833 0.488334 6.61733 0.000667349 8 6.82594e-07C9.38267 -0.000665984 10.562 0.487001 11.538 1.463C12.514 2.439 13.0013 3.618 13 5V7H14C14.55 7 15.021 7.196 15.413 7.588C15.805 7.98 16.0007 8.45067 16 9V19C16 19.55 15.8043 20.021 15.413 20.413C15.0217 20.805 14.5507 21.0007 14 21H2ZM8 16C8.55 16 9.021 15.8043 9.413 15.413C9.805 15.0217 10.0007 14.5507 10 14C9.99933 13.4493 9.80367 12.9787 9.413 12.588C9.02233 12.1973 8.55133 12.0013 8 12C7.44867 11.9987 6.978 12.1947 6.588 12.588C6.198 12.9813 6.002 13.452 6 14C5.998 14.548 6.194 15.019 6.588 15.413C6.982 15.807 7.45267 16.0027 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="h-12 w-[320px] rounded-full border-2 border-[#FFFFFF] bg-transparent text-center font-medium text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/10 focus:border-white focus:outline-none"
                                >
                                    LOGIN
                                </button>
                            </div>
                        </form>

                        <div className="absolute bottom-1 right-8">
                            <div className="flex items-center text-white/80">
                                <img
                                    src="/images/klinicare.png"
                                    alt="Klinicare Logo"
                                    className="h-12 opacity-40"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
