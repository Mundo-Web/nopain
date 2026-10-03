import { motion, AnimatePresence } from "framer-motion";
import Tippy from "@tippyjs/react";
import React, { useState, useEffect, useRef, useContext } from "react";
import { CarritoContext } from "../../context/CarritoContext";
import GeneralRest from "../../actions/GeneralRest";
import { TbBrush } from "react-icons/tb";
import { Trash2 } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { LanguageContext } from "../../context/LanguageContext";

const generalRest = new GeneralRest();

// Variantes de animación
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};

const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.2,
        },
    },
};

const cartItemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.3,
        },
    },
    exit: {
        x: -50,
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

const Header = ({
    session,
    showSlogan = true,
    gradientStart,
    menuGradientEnd,
    backgroundType = "none",
    backgroundSrc = "",
    backgroundHeight = "h-full",
    backgroundPosition = "object-top",
    children,
}) => {
    const { t, loading, error } = useTranslation();
    /*  if (loading) {
        return <div className="text-center py-4">Cargando menú...</div>;
    }

    if (error) {
        return (
            <div className="alert alert-danger m-3">
                Error cargando traducciones: {error}
            </div>
        );
    }*/
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const btnToggleRef = useRef(null);
    const { incrementarCantidad, decrementarCantidad } =
        useContext(CarritoContext);

    const toggleMenu = (event) => {
        if (event.target.closest(".menu-toggle")) {
            setIsOpen(!isOpen);
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                btnToggleRef.current == event.target ||
                btnToggleRef.current.contains(event.target)
            )
                return;
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { carrito, eliminarProducto } = useContext(CarritoContext);
    const [animar, setAnimar] = useState(false);
    const totalProductos = carrito.reduce((acc, item) => {
        if (item.variations && item.variations.length > 0) {
            return (
                acc + item.variations.reduce((sum, v) => sum + v.quantity, 0)
            );
        }
        return acc + item.quantity;
    }, 0);

    useEffect(() => {
        if (totalProductos > 0) {
            setAnimar(true);
            setTimeout(() => setAnimar(false), 500);
        }
    }, [totalProductos]);

    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const totalPrecio = carrito.reduce((acc, item) => {
        if (item.variations && item.variations.length > 0) {
            return (
                acc +
                item.variations.reduce(
                    (sum, v) => sum + item.final_price * v.quantity,
                    0
                )
            );
        }
        return acc + item.final_price * item.quantity;
    }, 0);

    const [socials, setSocials] = useState([]);
    const [languagesSystem, setLanguagesSystem] = useState([]);
    useEffect(() => {
        const fetchSocials = async () => {
            try {
                const data = await generalRest.getSocials();
                const languages = await generalRest.getLanguages();
                setSocials(data);
                setLanguagesSystem(languages);
            } catch (error) {
                console.error("Error fetching socials:", error);
            }
        };

        fetchSocials();
    }, []);

    const TikTok = socials.find((social) => social.description === "TikTok");
    const WhatsApp = socials.find(
        (social) => social.description === "WhatsApp"
    );
    const Instagram = socials.find(
        (social) => social.description === "Instagram"
    );
    const Facebook = socials.find(
        (social) => social.description === "Facebook"
    );

    const [activeLink, setActiveLink] = useState("/");

    useEffect(() => {
        const currentPath = window.location.pathname;
        setActiveLink(currentPath);
    }, []);

    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    const isActive = (path) => {
        return activeLink === path;
    };

    const { currentLanguage, changeLanguage } = useContext(LanguageContext);
    const [selectLanguage, setSelectLanguage] = useState(
        currentLanguage || languagesSystem[0]
    );

    useEffect(() => {
        if (currentLanguage) {
            setSelectLanguage(currentLanguage);
        } else if (languagesSystem.length > 0) {
            setSelectLanguage(languagesSystem[0]);
        }
    }, [currentLanguage, languagesSystem]);
    const onUseLanguage = async (langData) => {
        try {
            // Obtén el token CSRF de las cookies automáticamente
            const response = await fetch("/set-current-lang", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCsrfTokenFromCookie(), // Función para obtenerlo
                },
                body: JSON.stringify({ lang_id: langData.id }),
                credentials: "include", // Permite enviar cookies
            });

            if (response.ok) {
                await changeLanguage(langData); // ✅ Agrega await aquí
                setSelectLanguage(langData);
                // Si la URL actual contiene el slug de un servicio (/services/...), al cambiar de idioma
                // redirigir a /services para que no quede el slug del idioma anterior
                if (window.location.pathname.startsWith("/services")) {
                    if (window.location.pathname === "/services") {
                        window.location.reload();
                    } else {
                        window.location.href = "/services";
                    }
                } else {
                    window.location.reload(); // ⚠️ Opcional temporal para forzar actualización
                }
            } else {
                console.log("Error de extracion:", await response.text());
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    // Función para extraer el token de la cookie
    const getCsrfTokenFromCookie = () => {
        const cookie = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return cookie ? decodeURIComponent(cookie[1]) : null;
    };

    return (
        <>
            {showSlogan && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`text-center px-[5%] py-3 lg:py-2 font-light bg-[#224483] text-white text-[10.21px] md:text-[16.21px] leading-6 uppercase tracking-[0.2em] font-poppins w-full h-[42px] lg:h-7 ${
                        backgroundType === "none" && "mb-0"
                    }`}
                ></motion.div>
            )}

            <div
                className={`w-full max-w-full relative ${backgroundHeight} overflow-clip`}
            >
                {/* Fondo dinámico */}
                {backgroundType === "image" && (
                    <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        src={backgroundSrc}
                        className={`absolute -z-10 inset-0 w-full h-full object-cover ${backgroundPosition}`}
                        alt="Background"
                    />
                )}
                {backgroundType === "video" && (
                    <motion.video
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className={`absolute -z-10 inset-0 w-full h-full object-cover ${backgroundPosition}`}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        disablePictureInPicture
                        disableRemotePlayback
                        webkit-playsinline="true"
                    >
                        <source src={backgroundSrc} type="video/mp4" />
                    </motion.video>
                )}

                {(backgroundType === "image" || backgroundType === "video") && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(180deg, rgba(95, 72, 183, 0.75) 6.08%, rgba(96, 72, 183, 0.525) 100%)",
                        }}
                    ></motion.div>
                )}

                <motion.header
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className={`font-poppins static lg:w-full top-0 overflow-hidden z-40 transition-colors duration-300 ${
                        backgroundType === "none"
                            ? "bg-transparent mt-0"
                            : isScrolled
                            ? "bg-[#224483] pt-0 !mt-0"
                            : "bg-transparent top-4 pt-8 md:pt-14 lg:pt-10"
                    } ${
                        isScrolled &&
                        "bg-[#224483] pt-0 !mt-0 transition-all duration-150"
                    }`}
                >
                    <div
                        className={`px-[5%] w-full py-4 lg:py-0 lg:max-w-[82rem] 2xl:max-w-[92rem] mx-auto flex justify-between items-center text-[#242424] shadow-lg lg:shadow-none`}
                    >
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center"
                        >
                            <a href="/">
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    src="/assets/img/logo.png"
                                    alt="NoPain Logo"
                                    className="h-[40px] w-auto md:h-[50px] object-cover object-top"
                                />
                            </a>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            className="hidden lg:flex py-6 mx-auto justify-center items-center font-normal text-base"
                        >
                            <nav className="flex gap-2">
                                {[
                                    "/",
                                    "/services",
                                    "/about",
                                    "/offices",
                                    "/contact",
                                    "/blog",
                                ].map((path) => {
                                    const text = {
                                        "/": t("public.header.home", "Inicio"),
                                        "/services": t(
                                            "public.header.services",
                                            "Servicios"
                                        ),
                                        "/about": t(
                                            "public.header.aboutus",
                                            "Nosotros"
                                        ),
                                        "/offices": t(
                                            "public.header.facilities",
                                            "Instalaciones"
                                        ),
                                        "/contact": t(
                                            "public.header.contac",
                                            "Contacto"
                                        ),
                                        "/blog": t(
                                            "public.header.blog",
                                            "Blog"
                                        ),
                                    }[path];

                                    return (
                                        <motion.a
                                            key={path}
                                            href={path}
                                            onClick={() =>
                                                handleLinkClick(path)
                                            }
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`relative py-2 rounded-full transition-all duration-300 ${
                                                isActive(path)
                                                    ? "bg-[#EFF0F1] pl-7 pr-3"
                                                    : "bg-transparent px-5"
                                            }`}
                                        >
                                            {text}
                                            {isActive(path) && (
                                                <motion.span
                                                    layoutId="activeDot"
                                                    className="absolute  left-3 top-[40%] -translate-x-1/2 -translate-y-1/2 h-2 w-2 bg-[#224483] rounded-full"
                                                />
                                            )}
                                        </motion.a>
                                    );
                                })}
                            </nav>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex h-full items-center gap-4 justify-end"
                        >
                            {selectLanguage &&
                                languagesSystem &&
                                languagesSystem?.map((language) => (
                                    <motion.img
                                        onClick={() => onUseLanguage(language)}
                                        key={language.id}
                                        whileHover={{ y: -2 }}
                                        src={`/api/lang/media/${language.image}`}
                                        alt={language.name}
                                        className={`h-8 w-auto object-cover rounded-lg overflow-hidden${
                                            selectLanguage?.id === language.id
                                                ? " border-2 border-[#224483] shadow-2xl"
                                                : ""
                                        }`}
                                    />
                                ))}
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="lg:hidden text-base"
                        >
                            <div>
                                <motion.button
                                    ref={btnToggleRef}
                                    onClick={toggleMenu}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-white menu-toggle rounded-full h-[50px] w-[50px] flex items-center justify-center bg-[#EFF0F1]"
                                    aria-label="Toggle menu"
                                >
                                    <div className="text-[#242424]">
                                        <i
                                            className={`fas ${
                                                isOpen ? "fa-times" : "fa-bars"
                                            } text-xl md:text-2xl py-3 px-3`}
                                        />
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {WhatsApp && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex justify-end w-full mx-auto z-[100] relative"
                        >
                            <div className="fixed bottom-3 right-2 md:bottom-[1rem] lg:bottom-[2rem] lg:right-3 z-20 cursor-pointer">
                                <a
                                    target="_blank"
                                    id="whatsapp-toggle"
                                    href={WhatsApp.link}
                                >
                                    <motion.img
                                        animate={{
                                            y: [0, -10, 0],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatType: "loop",
                                        }}
                                        src="/assets/img/icons/WhatsApp.svg"
                                        alt="whatsapp"
                                        className="mr-3 w-16 h-16 md:w-[80px] md:h-[80px]"
                                    />
                                </a>
                            </div>
                        </motion.div>
                    )}
                </motion.header>

                {/* Menú móvil */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={menuRef}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={menuVariants}
                            className={`fixed md:top-20 inset-0 text-white z-[999] ${
                                isScrolled
                                    ? "top-[3.75rem] bg-[#224483]"
                                    : "top-28 bg-[#224483]"
                            } p-[5%] h-max overflow-y-auto`}
                        >
                            <motion.ul
                                variants={containerVariants}
                                className="flex flex-col gap-4 items-center justify-center"
                            >
                                {[
                                    "/",
                                    "/services",
                                    "/about",
                                    "/offices",
                                    "/contact",
                                    "/blog",
                                ].map((path) => {
                                    const text = {
                                        "/": t("public.header.home", "Inicio"),
                                        "/services": t(
                                            "public.header.services",
                                            "Servicios"
                                        ),
                                        "/about": t(
                                            "public.header.aboutus",
                                            "Nosotros"
                                        ),
                                        "/offices": t(
                                            "public.header.facilities",
                                            "Instalaciones"
                                        ),
                                        "/contact": t(
                                            "public.header.contac",
                                            "Contacto"
                                        ),
                                        "/blog": t(
                                            "public.header.blog",
                                            "Blog"
                                        ),
                                    }[path];

                                    return (
                                        <motion.li
                                            key={path}
                                            variants={itemVariants}
                                        >
                                            <a
                                                href={path}
                                                onClick={() => {
                                                    handleLinkClick(path);
                                                    setIsOpen(false);
                                                }}
                                                className={`relative py-2 rounded-full transition-all duration-300 ${
                                                    isActive(path)
                                                        ? "bg-[#EFF0F1] pl-8 pr-3 text-azul"
                                                        : "bg-transparent px-5 text-white"
                                                }`}
                                            >
                                                {text}
                                                {isActive(path) && (
                                                    <span className="absolute left-3 ml-2 top-[50%] -translate-x-1/2 -translate-y-1/2 h-2 w-2 bg-[#224483] rounded-full"></span>
                                                )}
                                            </a>
                                        </motion.li>
                                    );
                                })}
                            </motion.ul>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Contenido dinámico */}
                {children && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center text-center text-white p-6"
                    >
                        {children}
                    </motion.div>
                )}

                {/* Modal Carrito */}
                <AnimatePresence>
                    {mostrarCarrito && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-start justify-end px-[5%] lg:px-0 pt-12 pb-12 overflow-y-auto z-50 scrollbar-hide"
                        >
                            <motion.div
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 100, opacity: 0 }}
                                transition={{ type: "spring", damping: 25 }}
                                className="bg-[#EFE5FF] shadow-lg w-full sm:max-w-[380px] lg:max-w-[700px] 2xl:max-w-[800px] h-max p-8 lg:p-14 rounded-[30px] lg:rounded-[50px]"
                            >
                                {/* Encabezado */}
                                <div className="flex justify-between items-center">
                                    <h2 className="text-[24.67px] lg:text-[44.67px] font-bold">
                                        Tu Carrito
                                    </h2>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setMostrarCarrito(false)}
                                        className="text-lg font-bold text-[#5F48B7]"
                                    >
                                        ✖
                                    </motion.button>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-[#9C79D4] py-2 text-[13.95px] md:text-[16.95px] lg:text-[26.95px] mt-4 mb-8 text-center rounded-[14px] lg:rounded-[20px] text-white"
                                >
                                    ¡Tienes envío gratis en lima!{" "}
                                    <motion.img
                                        animate={{ rotate: [0, 15, 0] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2,
                                        }}
                                        src="/assets/img/emojis/motor-scooter.png"
                                        className="h-[16.88px] lg:h-[26.88px] inline-flex ml-2"
                                    />{" "}
                                </motion.div>

                                {/* Lista de productos con Scroll */}
                                <div className="flex-1 gap-4">
                                    {carrito.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="w-full flex flex-col items-center justify-center gap-5 text-3xl h-max my-5"
                                        >
                                            <img
                                                src="/assets/img/logo.png"
                                                alt="Wefem"
                                                className="h-[58px] w-[330.55px] object-cover object-top"
                                                style={{
                                                    textShadow:
                                                        "0px 4px 7.5px 0px #00000040",
                                                }}
                                            />
                                            <p className="text-center text-gray-500">
                                                Tu carrito está vacío
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <AnimatePresence>
                                            {carrito.map((item, index) => (
                                                <motion.div
                                                    key={item.id}
                                                    variants={cartItemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    layout
                                                    className="flex items-center gap-4 mb-4 w-full"
                                                >
                                                    <motion.img
                                                        layout
                                                        src={`/api/items/media/${item.image}`}
                                                        alt={item.name}
                                                        onError={(e) =>
                                                            (e.target.src =
                                                                "/api/cover/thumbnail/null")
                                                        }
                                                        className="w-20 h-20 md:w-28 md:h-28 lg:w-52 lg:h-52 object-cover rounded-lg"
                                                    />
                                                    <div className="flex flex-col w-[calc(100%-5rem)] md:w-[calc(100%-7rem)] lg:w-[calc(100%-10rem)]">
                                                        <div className="w-full flex">
                                                            <div className="w-5/6 lg:w-8/12">
                                                                <h3 className="text-[17.95px] md:text-[20.95px] lg:text-[24.95px] 2xl:text-[34.95px] font-normal leading-3 md:leading-[20.78px] lg:leading-[30.78px]">
                                                                    {item.name}
                                                                </h3>
                                                                {item.summary && (
                                                                    <p className="text-[10px] md:text-xs lg:text-[16.81px] 2xl:text-[25px] font-light inline-flex">
                                                                        (
                                                                        {
                                                                            item.summary
                                                                        }
                                                                        )
                                                                    </p>
                                                                )}

                                                                {item.discount && (
                                                                    <motion.p
                                                                        whileHover={{
                                                                            scale: 1.02,
                                                                        }}
                                                                        className="w-11/12 md:w-full h-[18.55px] md:h-[25.55px] lg:h-[35.55px] bg-[#212529] text-white rounded-[5.44px] mb-2 md:my-2 lg:my-4 flex items-center justify-center text-[8.65px] md:text-[9.65px] 2xl:text-[16.65px] font-semibold leading-[21.75px]"
                                                                    >
                                                                        <span className="font-medium md:font-bold text-[7.65px] md:text-[9.65px] 2xl:text-[16.65px] mr-2">
                                                                            ESTAS
                                                                            AHORRANDO
                                                                        </span>{" "}
                                                                        S/{" "}
                                                                        {Number(
                                                                            item.price -
                                                                                item.discount
                                                                        ).toFixed(
                                                                            0
                                                                        )}{" "}
                                                                        <img
                                                                            src="/assets/img/emojis/fire.png"
                                                                            className="h-[9.88px] 2xl:h-[16px] inline-flex ml-2"
                                                                        />
                                                                    </motion.p>
                                                                )}
                                                            </div>

                                                            {/* 🗑️ Botón para eliminar */}
                                                            <div className="w-1/6 lg:w-4/12 flex items-start justify-end">
                                                                <motion.button
                                                                    whileHover={{
                                                                        scale: 1.1,
                                                                    }}
                                                                    whileTap={{
                                                                        scale: 0.9,
                                                                    }}
                                                                    className="group text-white px-2 py-1 rounded-md hover:fill-red-500 transition-all duration-300"
                                                                    onClick={() =>
                                                                        eliminarProducto(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="h-10 lg:h-12 scale-x-[-1]">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 448 512"
                                                                            className="h-full w-4 lg:w-5 relative"
                                                                            fill="current"
                                                                        >
                                                                            <path
                                                                                className="group-hover:-rotate-12 group-hover:absolute group-hover:inset-0"
                                                                                fill="current"
                                                                                d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3z"
                                                                            />
                                                                            <path
                                                                                fill="current"
                                                                                d="M32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                        <div className="w-full flex">
                                                            <div className="w-1/2 md:w-4/6 lg:w-1/2 h-full flex">
                                                                <p className="text-[18.42px] md:text-[24.42px] h-full items-center lg:text-[35.33px] 2xl:text-[45.33px] font-bold text-[#5F48B7]">
                                                                    S/{" "}
                                                                    {Number(
                                                                        item.final_price
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div className="w-1/2 md:w-2/6 lg:w-1/2 h-full lg:h-14">
                                                                <div className="flex h-full text-[#000000] bg-transparent border border-black items-center justify-around rounded-[8px] md:rounded-[10px]">
                                                                    <motion.button
                                                                        whileTap={{
                                                                            scale: 0.8,
                                                                        }}
                                                                        className="h-full md:w-8 md:h-8 text-xs md:text-base 2xl:text-2xl"
                                                                        onClick={() =>
                                                                            decrementarCantidad(
                                                                                item.id
                                                                            )
                                                                        }
                                                                    >
                                                                        -
                                                                    </motion.button>
                                                                    <span className="h-full flex items-center text-xs md:text-base 2xl:text-2xl font-medium">
                                                                        {item.variations &&
                                                                        item
                                                                            .variations
                                                                            .length >
                                                                            0
                                                                            ? item.variations.reduce(
                                                                                  (
                                                                                      sum,
                                                                                      v
                                                                                  ) =>
                                                                                      sum +
                                                                                      v.quantity,
                                                                                  0
                                                                              )
                                                                            : item.quantity}
                                                                    </span>
                                                                    <motion.button
                                                                        whileTap={{
                                                                            scale: 0.8,
                                                                        }}
                                                                        className="h-6 md:w-8 md:h-8 text-xs md:text-base 2xl:text-2xl"
                                                                        onClick={() =>
                                                                            incrementarCantidad(
                                                                                item.id
                                                                            )
                                                                        }
                                                                    >
                                                                        +
                                                                    </motion.button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    )}
                                </div>

                                {/* Total y botón de Checkout */}
                                {totalPrecio > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="w-full mt-8"
                                    >
                                        <div className="w-full flex items-center justify-between my-6">
                                            <p className="text-[25.42px] md:text-[50.42px] lg:text-[45.33px] 2xl:text-[51.33px] font-bold text-black">
                                                Subtotal
                                            </p>
                                            <p className="text-[25.42px] md:text-[50.42px] lg:text-[45.33px] 2xl:text-[51.33px] font-bold text-black">
                                                S/ {totalPrecio.toFixed(2)}
                                            </p>
                                        </div>

                                        <motion.a
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            href="/checkout"
                                            className="block text-center text-[20.76px] md:text-[25.76px] lg:text-[34.76px] 2xl:text-[36.76px] w-full font-semibold rounded-[12.11px] lg:rounded-[15.11px] bg-[#FF9900] text-white py-3 2xl:py-4 hover:bg-opacity-90 transition-all duration-300"
                                        >
                                            IR A COMPRAR
                                        </motion.a>

                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            className="mt-6 relative w-full"
                                        >
                                            <img
                                                src="/assets/img/checkout/banner-pagos.png"
                                                className="w-full object-cover h-auto rounded-lg shadow-lg shadow-gray-500/20"
                                            />
                                        </motion.div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default Header;
