// import "./bootstrap";
// import "../css/app.css";
// import "../css/nav-header.css";
// import "../css/patient-visit-form.css";
// import "../css/medication-templates.css";
// import "../css/service-charges.css";
// import "../css/medication-list.css";
// import "../css/frequency-list.css";
// import "../css/plan-list.css";
import "../css/app.css";
// import '../css/appointment-manager.css';
// import "../css/allpatients.css";

// import '../css/dashboard.css';

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

const appName = import.meta.env.VITE_APP_NAME || "GARCIA";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
