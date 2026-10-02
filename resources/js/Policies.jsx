import React, { useEffect, useState } from 'react';
import { createRoot } from "react-dom/client";
import Base from './components/Tailwind/Base';
import HtmlContent from './Utils/HtmlContent';
import GeneralRest from './actions/GeneralRest';
import { useTranslation } from './hooks/useTranslation';
import CreateReactScript from "./Utils/CreateReactScript";
import { CarritoProvider } from "./context/CarritoContext";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";

const Policies = ({ policy, ...props }) => {
    const { t } = useTranslation();
    const [aboutuses, setAboutuses] = useState(null);
    const generalRest = new GeneralRest();

    useEffect(() => {
        const fetchAboutuses = async () => {
            try {
                const data = await generalRest.getAboutuses();
                setAboutuses(data);
            } catch (error) {
                console.error("Error fetching about:", error);
            }
        };

        fetchAboutuses();
    }, []);

    const generalsData = aboutuses?.generals || [];
    const content = generalsData.find(x => x.correlative === policy)?.description ?? '';

    const policyNames = {
        'privacy_policy': t('public.footer.privacity', 'Políticas de privacidad'),
        'terms_conditions': t('public.form.terms', 'Términos y condiciones'),
        'exchange_policy': t('public.footer.change', 'Políticas de cambio'),
        'cookies_policy': t('public.footer.cookies', 'Políticas de cookies'),
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header showSlogan={false} />
            <div className="px-[5%] max-w-4xl mx-auto py-16 min-h-[60vh] flex-grow mt-20">
                <h1 className="text-3xl font-bold mb-8 text-[#224483]">{policyNames[policy] || policy}</h1>
                <div className="prose max-w-none text-gray-700">
                    <HtmlContent html={content} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <Policies {...properties} />
            </Base>
        </CarritoProvider>
    );
});
