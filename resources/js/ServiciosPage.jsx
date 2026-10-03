import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoContext, CarritoProvider } from "./context/CarritoContext";
import TextWithHighlight from "./Utils/TextWithHighlight";
import ModalAppointment from "./components/Appointment/ModalAppointment";
import DynamicGalleryServiceService from "./DynamicGalleryService";
import { useTranslation } from "./hooks/useTranslation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const ServiciosPage = ({ landing, services, linkWhatsApp, randomImage, specialities, currentSlug }) => {
    const landingHero = landing?.find?.(
        (item) => item.correlative === "page_services_hero"
    );

    const landingSpecialities = landing?.find?.(
        (item) => item.correlative === "page_services_specialties"
    );

    const [selectedServiceIndex, setSelectedServiceIndex] = useState(() => {
        if (!services || services.length === 0) return 0;
        
        // Obtener slug desde prop, pathname o query param
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        const servicesIdx = pathParts.indexOf("services");
        const slugFromPath = servicesIdx !== -1 && pathParts[servicesIdx + 1] ? decodeURIComponent(pathParts[servicesIdx + 1]) : null;
        const urlParams = new URLSearchParams(window.location.search);
        const target = currentSlug || slugFromPath || urlParams.get("slug");

        if (target) {
            const found = services.findIndex((s) => s.slug === target);
            if (found !== -1) return found;
        }
        return 0;
    });

    const activeService = (services && services.length > 0)
        ? (services[selectedServiceIndex] || services[0])
        : null;

    const [activeSpecialtyIndex, setActiveSpecialtyIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showServicesMenu, setShowServicesMenu] = useState(false);
    const titleRef = useRef(null);

    const handleServicesMenu = () => {
        setShowServicesMenu(!showServicesMenu);
    };

    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };
    // Animación del botón (igual a tu versión)
    const buttonVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 10,
            },
        },
        pulse: {
            scale: [1, 1.05, 1],
            transition: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
            },
        },
        hover: {
            scale: 1.1,
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.5 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
            },
        },
    };

    // Función para dividir la descripción en párrafos
    const renderDescription = (description) => {
        if (!description) return null;
        const paragraphs = description.split(/(?<=\.)\s+/);
        return paragraphs.map((paragraph, index) => (
            <motion.p
                key={index}
                className="mb-4 last:mb-0"
                variants={itemVariants}
            >
                {paragraph}
            </motion.p>
        ));
    };

    // Sincronizar el servicio activo cuando cambia services o currentSlug
    useEffect(() => {
        if (!services || services.length === 0) return;

        const pathParts = window.location.pathname.split("/").filter(Boolean);
        const servicesIdx = pathParts.indexOf("services");
        const slugFromPath = servicesIdx !== -1 && pathParts[servicesIdx + 1] ? decodeURIComponent(pathParts[servicesIdx + 1]) : null;
        const urlParams = new URLSearchParams(window.location.search);
        const target = currentSlug || slugFromPath || urlParams.get("slug");

        if (target) {
            const foundIndex = services.findIndex((s) => s.slug === target);
            if (foundIndex !== -1) {
                setSelectedServiceIndex(foundIndex);
                const expectedPath = `/services/${services[foundIndex].slug}`;
                if (window.location.pathname !== expectedPath) {
                    window.history.replaceState({ slug: services[foundIndex].slug }, "", expectedPath);
                }
                return;
            }
        }

        // Si no hay slug en la URL o no coincide, poner el primero y reflejar en la URL
        setSelectedServiceIndex(0);
        const first = services[0];
        if (first?.slug) {
            const defaultPath = `/services/${first.slug}`;
            if (window.location.pathname !== defaultPath) {
                window.history.replaceState({ slug: first.slug }, "", defaultPath);
            }
        }
    }, [services, currentSlug]);

    // Soporte para botones Atrás / Adelante del navegador
    useEffect(() => {
        const handlePopState = () => {
            if (!services || services.length === 0) return;
            const pathParts = window.location.pathname.split("/").filter(Boolean);
            const servicesIdx = pathParts.indexOf("services");
            const slugFromPath = servicesIdx !== -1 && pathParts[servicesIdx + 1] ? decodeURIComponent(pathParts[servicesIdx + 1]) : null;
            const urlParams = new URLSearchParams(window.location.search);
            const target = slugFromPath || urlParams.get("slug");

            if (target) {
                const foundIndex = services.findIndex((s) => s.slug === target);
                if (foundIndex !== -1) {
                    setSelectedServiceIndex(foundIndex);
                    return;
                }
            }
            setSelectedServiceIndex(0);
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [services]);

    // Función al seleccionar un servicio: actualiza el índice y la URL amigable
    const handleSelectService = (index) => {
        setSelectedServiceIndex(index);
        setShowServicesMenu(false);
        const selected = services[index];
        if (selected?.slug) {
            const newUrl = `/services/${selected.slug}`;
            if (window.location.pathname !== newUrl) {
                window.history.pushState({ slug: selected.slug }, "", newUrl);
            }
        }
    };

    const { t } = useTranslation();

    return (
        <div className="font-poppins">
            <Header />
            <div className="min-h-screen bg-white font-sans">
                {/* Hero Image */}
                {landingHero && (
                    <motion.div
                        className="w-full mt-4 lg:mt-0 h-52 md:h-64 overflow-hidden rounded-b-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img
                            src={`/api/landing_home/media/${landingHero?.image}`}
                            alt="Equipamiento médico de fisioterapia"
                            className="w-full h-52 md:h-64 object-cover object-left lg:object-center"
                        />
                    </motion.div>
                )}
                <div className="max-w-6xl mx-auto px-4 lg:px-3 py-8">
                    {/* Title Section */}
                    {landingHero && (
                        <motion.div
                            className="text-center mb-8 lg:mt-10"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            <motion.h1
                                className="text-5xl leading-[42px] lg:text-6xl font-semibold mb-2 lg:max-w-2xl lg:mx-auto"
                                variants={itemVariants}
                            >
                                <TextWithHighlight text={landingHero?.title} />
                            </motion.h1>
                        </motion.div>
                    )}
                    {services && (
                        <div className="flex flex-col lg:flex-row lg:gap-12 lg:pt-2 justify-between">
                            {/* Services Menu */}
                            <motion.div
                                className="w-full lg:w-[30%] mt-10 relative"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="hidden lg:block text-xl lg:text-2xl font-semibold mb-4">
                                    Servicios
                                </h2>

                                <div className="lg:hidden mb-6">
                                    <button
                                        onClick={handleServicesMenu}
                                        className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-md"
                                    >
                                        <span className="font-medium">
                                            Servicios
                                        </span>
                                        <ChevronDown className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="hidden lg:relative lg:block lg:bg-transparent space-y-2"
                                >
                                    {services.map((service, index) => (
                                        <motion.a
                                            key={index}
                                            href={`/services/${service.slug}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSelectService(index);
                                            }}
                                            className={`flex items-center justify-between p-3 lg:py-3 lg:px-[5%] rounded-lg cursor-pointer no-underline text-inherit ${
                                                index === selectedServiceIndex
                                                    ? "bg-gray-100"
                                                    : "hover:bg-gray-50"
                                            }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span
                                                className={`lg:text-lg ${
                                                    index === selectedServiceIndex
                                                        ? "font-medium"
                                                        : ""
                                                }`}
                                            >
                                                {service.title}
                                            </span>
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                <img
                                                    src={`/api/service/media/${service.image}`}
                                                    alt={service.title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </motion.a>
                                    ))}
                                </motion.div>
                                <AnimatePresence>
                                    {showServicesMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                                opacity: 1,
                                                height: "auto",
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className=" lg:hidden lg:bg-transparent space-y-2"
                                        >
                                            {services.map((service, index) => (
                                                <motion.a
                                                    key={index}
                                                    href={`/services/${service.slug}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleSelectService(index);
                                                    }}
                                                    className={`flex items-center justify-between p-3 lg:py-3 lg:px-[5%] rounded-lg cursor-pointer no-underline text-inherit ${
                                                        index === selectedServiceIndex
                                                            ? "bg-gray-100"
                                                            : "hover:bg-gray-50"
                                                    }`}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <span
                                                        className={`lg:text-lg ${
                                                            index ===
                                                            selectedServiceIndex
                                                                ? "font-medium"
                                                                : ""
                                                        }`}
                                                    >
                                                        {service.title}
                                                    </span>
                                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                        <img
                                                            src={`/api/service/media/${service.image}`}
                                                            alt={service.title}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                </motion.a>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Service Details */}
                            <motion.div
                                className="lg:w-[62%]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                key={selectedServiceIndex}
                            >
                                <motion.h2
                                    className="text-5xl lg:mt-6 font-semibold mb-4 text-wrap"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <TextWithHighlight
                                        text={activeService?.title}
                                        split={true}
                                    />
                                </motion.h2>

                                <motion.div
                                    className="mb-8 lg:mb-4 pt-4 lg:pt-2 text-lg"
                                    initial="hidden"
                                    animate="visible"
                                    variants={containerVariants}
                                >
                                    {renderDescription(
                                        activeService?.description
                                    )}
                                </motion.div>

                                {/* Service Features */}
                                <motion.div
                                    className="space-y-3 mb-8 text-lg"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {activeService?.characteristics?.map(
                                        (characteristic, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex gap-3 items-center"
                                                variants={itemVariants}
                                            >
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src="/assets/img/icons/pin.png"
                                                        className="w-6 h-6 mt-1"
                                                        alt={characteristic}
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <p className="leading-relaxed">
                                                    {characteristic}
                                                </p>
                                            </motion.div>
                                        )
                                    )}
                                </motion.div>

                                {/* CTA Button */}
                                <motion.div
                                    className="w-full px-[5%] lg:px-0 flex items-center justify-center lg:justify-start mt-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <motion.button
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-[#EFF0F1] text-[#242424] py-1 pl-1 pr-3 gap-2 mt-2 rounded-full flex items-center"
                                        variants={buttonVariants}
                                        initial="hidden"
                                        animate={["visible", "pulse"]}
                                        whileHover="hover"
                                        style={{
                                            position: "relative",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <motion.span
                                            className="absolute inset-0 bg-[#224483] opacity-0 rounded-full"
                                            initial={{ scale: 0 }}
                                            whileTap={{
                                                scale: 2,
                                                opacity: 0.3,
                                                transition: { duration: 0.5 },
                                            }}
                                        />
                                        <div className="bg-[#224483] w-12 p-2 rounded-full">
                                            <img
                                                src="/assets/img/icons/calendar-check.png"
                                                className="h-auto"
                                                alt="Calendario"
                                            />
                                        </div>
                                        {t(
                                            "public.btn.appointment",
                                            "Reserva tu cita"
                                        )}
                                    </motion.button>
                                </motion.div>

                                {/* Service Images */}
                                <DynamicGalleryServiceService
                                    service={activeService}
                                />
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
               {/* Especialidades Section */}
               <motion.section
                        className="w-full lg:max-w-[82rem] lg:px-[5%] lg:mx-auto py-10 lg:py-0"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                        variants={containerVariants}
                    >
                        <div className="mx-auto">
                            <motion.div
                                className="flex flex-col md:flex-row gap-8 md:gap-16"
                                variants={containerVariants}
                            >
                                <motion.div
                                    className="lg:w-1/2"
                                    variants={itemVariants}
                                >
                                    <div className="mb-6 lg:mb-4">
                                        <motion.h2
                                            className="text-[40px] leading-[42px] lg:text-6xl font-semibold mb-2 lg:max-w-lg"
                                            variants={itemVariants}
                                        >
                                            <TextWithHighlight
                                                text={
                                                    landingSpecialities?.title ||
                                                    t(
                                                        "public.specialties.title",
                                                        "¿Qué *lesiones* tratamos?"
                                                    )
                                                }
                                            />
                                        </motion.h2>
                                        <motion.p
                                            className="text-lg lg:max-w-lg lg:mt-4"
                                            variants={itemVariants}
                                            transition={{ delay: 0.1 }}
                                        >
                                            {landingSpecialities?.description}
                                        </motion.p>
                                    </div>

                                    <motion.div
                                        className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-2 gap-y-1 lg:mt-8"
                                        variants={containerVariants}
                                    >
                                        {(() => {
                                            const items = specialities || [];
                                            if (items.length === 0) return null;
                                            const middleIndex = Math.ceil(
                                                items.length / 2
                                            );
                                            const firstHalf = items.slice(
                                                0,
                                                middleIndex
                                            );
                                            const secondHalf =
                                                items.slice(middleIndex);

                                            return (
                                                <>
                                                    <motion.div
                                                        className="ml-6"
                                                        variants={itemVariants}
                                                    >
                                                        <ul className="list-disc text-lg leading-[22px]">
                                                            {firstHalf &&
                                                                firstHalf.map(
                                                                    (
                                                                        especialidad,
                                                                        index
                                                                    ) => (
                                                                        <motion.li
                                                                            key={
                                                                                especialidad.id ||
                                                                                index
                                                                            }
                                                                            className="mb-1"
                                                                            variants={
                                                                                itemVariants
                                                                            }
                                                                            custom={
                                                                                index
                                                                            }
                                                                        >
                                                                            {
                                                                                especialidad.name
                                                                            }
                                                                        </motion.li>
                                                                    )
                                                                )}
                                                        </ul>
                                                    </motion.div>

                                                    <motion.div
                                                        className="ml-6"
                                                        variants={itemVariants}
                                                    >
                                                        <ul className="list-disc text-lg leading-[22px]">
                                                            {secondHalf &&
                                                                secondHalf.map(
                                                                    (
                                                                        especialidad,
                                                                        index
                                                                    ) => (
                                                                        <motion.li
                                                                            key={
                                                                                especialidad.id ||
                                                                                index
                                                                            }
                                                                            className="mb-1"
                                                                            variants={
                                                                                itemVariants
                                                                            }
                                                                            custom={
                                                                                index +
                                                                                firstHalf.length
                                                                            }
                                                                        >
                                                                            {
                                                                                especialidad.name
                                                                            }
                                                                        </motion.li>
                                                                    )
                                                                )}
                                                        </ul>
                                                    </motion.div>
                                                </>
                                            );
                                        })()}
                                    </motion.div>

                                    <motion.button
                                        className="hidden lg:flex text-white font-medium rounded-full mt-8 lg:mt-4 items-center"
                                        variants={itemVariants}
                                        transition={{ delay: 0.3 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <a
                                            href="/services"
                                            className="mt-5 bg-[#EFF0F1] text-[#242424] py-1 pl-1 pr-3 gap-2 rounded-full flex items-center lg:h-14"
                                        >
                                            <div className="bg-[#224483] w-12 p-2 rounded-full">
                                                <img
                                                    src="/assets/img/icons/treatment.png"
                                                    className="h-auto"
                                                />
                                            </div>
                                            {t(
                                                "public.btn.all_services",
                                                "Ver todos los servicios"
                                            )}
                                        </a>
                                    </motion.button>
                                </motion.div>

                                <motion.div
                                    className="lg:w-1/2 mt-4 lg:mt-0 relative"
                                    variants={itemVariants}
                                >
                                    <Swiper
                                        navigation={{
                                            prevEl: ".custom-prev",
                                            nextEl: ".custom-next",
                                        }}
                                        slidesPerView={3}
                                        spaceBetween={30}
                                        loop={true}
                                        breakpoints={{
                                            0: {
                                                slidesPerView: 1,
                                                spaceBetween: 10,
                                            },
                                            640: {
                                                slidesPerView: 1,
                                                spaceBetween: 10,
                                            },
                                            1024: {
                                                slidesPerView: 1,
                                                spaceBetween: 10,
                                            },
                                        }}
                                        modules={[Navigation, Pagination]}
                                        onSlideChange={(swiper) =>
                                            setActiveSpecialtyIndex(swiper.realIndex)
                                        }
                                    >
                                        {(specialities || []).map(
                                            (speciality, index) => (
                                                <SwiperSlide key={index}>
                                                    <motion.div className="rounded-2xl overflow-hidden shadow-lg h-[380px] lg:h-[650px] group">
                                                        <motion.img
                                                            src={`/api/speciality/media/${speciality.image}`}
                                                            alt="Tratamiento de fisioterapia"
                                                            whileHover={{
                                                                scale: 1.1,
                                                            }}
                                                            transition={{
                                                                stiffness: 400,
                                                                damping: 10,
                                                            }}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </motion.div>
                                                </SwiperSlide>
                                            )
                                        )}
                                    </Swiper>
                                    {/* Botones de navegación personalizados */}
                                    <div className="hidden lg:block absolute top-1/2 left-[-40px] transform -translate-y-1/2 custom-prev cursor-pointer">
                                        <ChevronLeft
                                            size={40}
                                            strokeWidth={3}
                                            className="text-[#224483] "
                                        />
                                    </div>

                                    <div className="hidden lg:block  absolute top-1/2 right-[-40px]  transform -translate-y-1/2 custom-next cursor-pointer">
                                        <ChevronRight
                                            size={40}
                                            strokeWidth={3}
                                            className="text-[#224483] "
                                        />
                                    </div>

                                    <motion.div
                                        className="w-[150px] mx-auto overflow-hidden flex justify-center gap-2 mt-10"
                                        variants={itemVariants}
                                    >
                                        {(specialities || [])
                                            .slice(
                                                Math.max(0, activeSpecialtyIndex - 1),
                                                Math.min(
                                                    (specialities || []).length,
                                                    activeSpecialtyIndex + 2
                                                )
                                            )
                                            .map((_, indexOffset) => {
                                                const index =
                                                    Math.max(
                                                        0,
                                                        activeSpecialtyIndex - 1
                                                    ) + indexOffset;
                                                return (
                                                    <motion.button
                                                        key={index}
                                                        className={`rounded-full transition-all duration-300 ${
                                                             index ===
                                                             activeSpecialtyIndex
                                                                ? "bg-[#224483] w-[20px] h-[12px]"
                                                                : "bg-[#22448366] w-[12px] h-[12px]"
                                                        }`}
                                                        whileHover={{
                                                            scale: 1.2,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                    />
                                                );
                                            })}
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.section>

            <ModalAppointment
                linkWhatsApp={linkWhatsApp}
                randomImage={randomImage}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <Footer />
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <ServiciosPage {...properties} />
            </Base>
        </CarritoProvider>
    );
});
