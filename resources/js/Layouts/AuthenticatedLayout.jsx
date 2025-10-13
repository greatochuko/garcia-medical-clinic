import React from "react";
import Footer from "@/Components/layout/Footer";
import Header from "@/Components/layout/Header";
import FlashMessage from "@/Components/FlashMessage";
import { Head, usePage } from "@inertiajs/react";

export default function AuthenticatedLayout({ children, pageTitle }) {
    const { auth } = usePage().props;
    return (
        <div className="flex min-h-screen flex-col">
            <Header user={auth.user} />
            <Head title={pageTitle} />
            <FlashMessage />
            <main className="flex flex-1 text-accent">{children}</main>
            <Footer />
        </div>
    );
}
