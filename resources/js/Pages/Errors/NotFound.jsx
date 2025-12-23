import React from "react";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function NotFound() {
    return (
        <AuthenticatedLayout pageTitle={`404 Not Found`}>
            <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="mx-auto w-[90%] max-w-lg">
                    <h1 className="text-7xl font-extrabold text-accent drop-shadow-lg sm:text-8xl lg:text-9xl">
                        404
                    </h1>
                    <p className="mt-4 text-2xl font-semibold text-gray-700 md:text-3xl">
                        Oops! Page not found.
                    </p>
                    <p className="mb-6 mt-2 text-gray-500">
                        The page you&apos;re looking for doesn&apos;t exist or
                        has been moved.
                    </p>

                    <Link
                        href="/"
                        className="inline-block rounded-lg bg-accent px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:bg-accent/90 hover:shadow-xl"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
