import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import {
    ChevronDown,
    Clock,
    Target,
    Grid,
    BookOpen,
    Users,
    User,
} from "lucide-react";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoContext, CarritoProvider } from "./context/CarritoContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import TextWithHighlight from "./Utils/TextWithHighlight";
import ModalAppointment from "./components/Appointment/ModalAppointment";
import MaintenancePage from "./Utils/MaintenancePage";
import { useTranslation } from "./hooks/useTranslation";
// Animaciones
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
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
            duration: 0.6,
        },
    },
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.8 },
    },
};

const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const imageHover = {
    hover: {
        scale: 1.03,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
        },
    },
};

const buttonHover = {
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 },
    },
    tap: {
        scale: 0.95,
    },
};

const SedeItem = ({ sede, index, isModalOpen, setIsModalOpen }) => {
    const isEven = index % 2 === 0;
    const isTriple = index % 3 === 0;

    const getImageClass = (totalImages, imgIndex, isEven, isTriple) => {
        if (totalImages === 1) return "col-span-12 row-span-12";
        if (totalImages === 2) return "col-span-12 row-span-6";

        if (totalImages === 3) {
            if (imgIndex === 0) {
                return isEven
                    ? "col-span-6 row-span-6"
                    : isTriple
                    ? "col-span-12 row-span-6"
                    : "col-span-5 row-span-6";
            }
            if (imgIndex === 1) {
                return isEven
                    ? "col-span-6 row-span-6"
                    : isTriple
                    ? "col-span-6 row-span-6"
                    : "col-span-7 row-span-12";
            }
            if (imgIndex === 2) {
                return isEven
                    ? "col-span-12 row-span-6"
                    : isTriple
                    ? "col-span-6 row-span-6"
                    : "col-span-5 row-span-6";
            }
        }

        if (totalImages === 4) {
            return "col-span-6 row-span-6";
        }

        if (totalImages >= 5) {
            if (imgIndex === 0) return "col-span-6 row-span-6";
            if (imgIndex === 1) return "col-span-6 row-span-4";
            if (imgIndex === 2) return "col-span-6 row-span-4";
            if (imgIndex === 3) return "col-span-6 row-span-6";
            if (imgIndex === 4) return "col-span-6 row-span-4";
        }

        return "col-span-6 row-span-6";
    };

    const { t } = useTranslation();
    return (
        <motion.div
            className="pt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
        >
            <div
                className={`flex flex-col md:flex-row ${
                    isEven ? "" : "md:flex-row-reverse"
                } md:items-start md:gap-8`}
            >
                {/* Info Section */}
                <motion.div
                    className="md:w-1/2 mb-6 lg:mb-0"
                    variants={itemVariants}
                >
                    <motion.h2
                        className="text-[40px] leading-[42px] font-semibold mb-1 lg:text-5xl"
                        variants={slideUp}
                    >
                        {sede.title.includes("*") ? (
                            <>
                                {sede.title.split("*")[0]}
                                <br />
                                <span className="text-azul">
                                    {sede.title.split("*")[1]}
                                </span>
                            </>
                        ) : (
                            <>
                                {sede.title.split(" ")[0]}
                                <br />
                                <span className="text-azul">
                                    {sede.title.split(" ").slice(1).join(" ")}
                                </span>
                            </>
                        )}
                    </motion.h2>

                    <motion.p
                        className="mb-4 lg:text-lg lg:pt-4 max-w-[28rem]"
                        variants={fadeIn}
                    >
                        {sede.description}
                    </motion.p>

                    <motion.div
                        className="gap-4 mb-6 pt-4 lg:text-lg"
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <h3 className="font-semibold">
                                {t("public.form.ubication", "Dirección")}:
                            </h3>
                            {sede.ubications.map((direction, index) => (
                                <p key={index}>{direction}</p>
                            ))}
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h3 className="font-semibold">
                                {" "}
                                {t("public.form.phone", "Teléfono")}:
                            </h3>
                            {sede.phones.map((phone, index) => (
                                <p key={index}>{phone}</p>
                            ))}
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h3 className="font-semibold">
                                {t("public.form.email", "Correo Eléctronico")}:
                            </h3>
                            {sede.emails.map((email, index) => (
                                <p key={index}>{email}</p>
                            ))}
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h3 className="font-semibold">
                                {t(
                                    "public.footer.office_hours",
                                    "Horario de atención"
                                )}
                            </h3>
                            {sede.business_hours.map((business_hour, index) => (
                                <p key={index}>{business_hour}</p>
                            ))}
                        </motion.div>
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
                            style={{ position: "relative", overflow: "hidden" }}
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
                            {t("public.btn.appointment", "Reserva tu cita")}
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Images Section */}
                <motion.div
                    className="md:w-1/2 grid grid-cols-12 grid-rows-12 gap-2 h-[552px]"
                    variants={containerVariants}
                >
                    {sede.gallery.map((img, imgIndex) => (
                        <motion.div
                            key={imgIndex}
                            className={`${getImageClass(
                                sede.gallery.length,
                                imgIndex,
                                isEven,
                                isTriple
                            )} rounded-lg overflow-hidden`}
                            variants={itemVariants}
                            whileHover="hover"
                            variants={imageHover}
                        >
                            <motion.img
                                src={`/api/facility/media/${img}`}
                                alt={`Instalaciones ${sede.title}`}
                                className="w-full h-full object-cover"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: imgIndex * 0.1 + 0.3 }}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

const InstalacionesPage = ({
    landing,
    facilities,
    linkWhatsApp,
    randomImage,
}) => {
    const landingHero = landing?.find(
        (item) => item.correlative === "page_facility_hero"
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="font-poppins">
            <Header />
            {facilities && facilities.length > 0 ? (
                <div className="min-h-screen bg-white font-sans text-negro">
                    <motion.div
                        className="max-w-[82rem] mx-auto px-4 lg:px-[5%] py-8 lg:py-12"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {/* Header Section */}
                        {landingHero && (
                            <motion.div
                                className="text-center mb-8 lg:mb-12"
                                variants={containerVariants}
                            >
                                <motion.h1
                                    className="text-[40px] leading-[42px] lg:text-6xl font-semibold mb-4 lg:pt-2 lg:max-w-3xl lg:mx-auto"
                                    variants={slideUp}
                                >
                                    <TextWithHighlight
                                        text={landingHero?.title}
                                    />
                                </motion.h1>
                                <motion.p
                                    className="max-w-[60rem] mx-auto text-base pt-2 lg:text-lg"
                                    variants={fadeIn}
                                >
                                    {landingHero?.description}
                                </motion.p>
                            </motion.div>
                        )}
                        <AnimatePresence>
                            {facilities &&
                                facilities.map((sede, index) => (
                                    <SedeItem
                                        key={sede.id}
                                        sede={sede}
                                        index={index}
                                        setIsModalOpen={setIsModalOpen}
                                        isModalOpen={isModalOpen}
                                    />
                                ))}
                        </AnimatePresence>
                    </motion.div>

                    <ModalAppointment
                        linkWhatsApp={linkWhatsApp}
                        randomImage={randomImage}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </div>
            ) : (
                <MaintenancePage />
            )}
            <Footer />
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <InstalacionesPage {...properties} />
            </Base>
        </CarritoProvider>
    );
});
