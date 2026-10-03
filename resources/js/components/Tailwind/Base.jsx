import React from "react";
import { LanguageProvider } from "../../context/LanguageContext";

const Base = ({
    children,
    footerLinks,
    session,
    socials,
    terms,
    showSlogan = true,
    showFooter = true,
    gradientStart = "#c4b8d3",
    gradientEnd = "#f1d7c1",
    menuGradientEnd = "#dbc8c9",
}) => {
    return (
        <LanguageProvider>
            <section className="w-full max-w-full overflow-x-hidden relative"> {children}</section>
        </LanguageProvider>
    );
};

export default Base;
