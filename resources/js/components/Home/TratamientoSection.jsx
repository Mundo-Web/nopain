import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "../../hooks/useTranslation";

export default function TratamientoSection({
    services,
    landingServices,
    setIsModalOpen,
    isModalOpen,
}) {
    // Animaciones para los botones de flecha
    const arrowAnimation = {
        initial: { scale: 1, rotate: 0 },
        hover: {
            scale: 1.2,
            rotate: 45,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 10,
            },
        },
    };

    // Animación para el botón de reserva
    const buttonHover = {
        hover: {
            scale: 1.05,
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            transition: {
                type: "spring",
                stiffness: 400,
            },
        },
        tap: {
            scale: 0.95,
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
    // Animación para las imágenes
    const imageHover = {
        hover: {
            scale: 1.1,
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
    };

    // Animación para la card completa
    const cardHover = {
        hover: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const { t } = useTranslation();
    return (
        <div className="mt-0 font-poppins">
            {/* Versión móvil */}
            <div className="max-w-md mx-auto px-4 py-4 lg:hidden">
                <Swiper
                    slidesPerView={3}
                    spaceBetween={30}
                    loop={true}
                    breakpoints={{
                        0: { slidesPerView: 1.1, spaceBetween: 10 },
                        640: { slidesPerView: 1, spaceBetween: 10 },
                        1024: { slidesPerView: 3, spaceBetween: 0 },
                    }}
                >
                    {services.map((service, index) => (
                        <SwiperSlide key={index}>
                            <motion.a
                                href={`/services/${service?.slug}`}
                                className="flex gap-4 my-6 w-[295px] h-[430px] relative"
                                whileHover="hover"
                                variants={cardHover}
                            >
                                <motion.div
                                    className="w-full h-full rounded-3xl overflow-hidden"
                                    variants={imageHover}
                                >
                                    <img
                                        src={`/api/service/media/${service?.image}`}
                                        alt={service?.title}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                                <div className="absolute rounded-3xl inset-0 bg-gradient-to-br from-[rgba(0,0,0,0.56)_23.61%] to-[rgba(0,0,0,0)_64.76%]"></div>
                                <h2 className="text-white font-medium absolute top-8 left-8 inset-0 text-2xl line-clamp-3 w-8/12">
                                    {service?.title.split(" ")[0]}
                                    <br />
                                    {service?.title
                                        .split(" ")
                                        .slice(1)
                                        .join(" ")}
                                </h2>
                                <motion.div
                                    className="absolute bottom-8 right-8"
                                    variants={arrowAnimation}
                                >
                                    <img
                                        src="/assets/img/icons/circle-right.svg"
                                        className="cursor-pointer"
                                    />
                                </motion.div>
                            </motion.a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Versión desktop */}
            <div className="hidden lg:block font-poppins lg:px-[5%] lg:max-w-[82rem] lg:mx-auto">
                <div className="lg:grid lg:grid-cols-4 lg:gap-6 lg:mt-10">
                    {/* Primer bloque: 2 imágenes grandes */}
                    {services.slice(0, 2).map((service, index) => (
                        <motion.a
                            href={`/services/${service?.slug}`}
                            key={`large-${index}`}
                            className="relative h-[410px] overflow-hidden rounded-3xl group"
                            whileHover="hover"
                            variants={cardHover}
                        >
                            <motion.div
                                className="w-full h-full"
                                variants={imageHover}
                            >
                                <img
                                    src={`/api/service/media/${service?.image}`}
                                    alt={service?.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            <div className="pointer-events-none absolute inset-0">
                                <div className="absolute rounded-3xl inset-0 bg-gradient-to-br from-[rgba(0,0,0,0.56)_23.61%] to-[rgba(0,0,0,0)_64.76%]"></div>
                                <h2 className="text-white font-medium absolute top-8 left-8 text-2xl line-clamp-2">
                                    {service?.title}
                                </h2>
                                <motion.div
                                    className="absolute bottom-8 right-8 pointer-events-auto"
                                    variants={arrowAnimation}
                                >
                                    <img
                                        src="/assets/img/icons/circle-right.svg"
                                        className="cursor-pointer"
                                    />
                                </motion.div>
                            </div>
                        </motion.a>
                    ))}

                    {/* Segundo bloque: 2 imágenes verticales */}
                    {services.length >= 3 && (
                        <div className="col-span-2 flex flex-col gap-6 h-full">
                            {services.slice(2, 4).map((service, index) => (
                                <motion.a
                                    href={`/services/${service?.slug}`}
                                    key={`vertical-${index}`}
                                    className="relative h-[195px] overflow-hidden rounded-3xl group"
                                    whileHover="hover"
                                    variants={cardHover}
                                >
                                    <motion.div
                                        className="w-full h-full"
                                        variants={imageHover}
                                    >
                                        <img
                                            src={`/api/service/media/${service?.image}`}
                                            alt={service?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>

                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute rounded-3xl inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.56)_23.61%] to-[rgba(0,0,0,0)_64.76%]"></div>
                                        <h2 className="text-white max-w-[15rem] font-medium absolute top-8 right-8 left-8 text-2xl line-clamp-2">
                                            {service?.title.split(" ")[0]}
                                            <br />
                                            {service?.title
                                                .split(" ")
                                                .slice(1)
                                                .join(" ")}
                                        </h2>
                                        <motion.div
                                            className="absolute bottom-8 right-8 pointer-events-auto"
                                            variants={arrowAnimation}
                                        >
                                            <img
                                                src="/assets/img/icons/circle-right.svg"
                                                className="cursor-pointer"
                                            />
                                        </motion.div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    )}

                    {/* Tercer bloque: imagen horizontal + CTA */}
                    {services.length >= 5 && (
                        <div className="col-span-4 flex gap-6 mt-6">
                            <motion.a
                                href={`/services/${services[4]?.slug}`}
                                className="w-8/12 relative h-[300px] overflow-hidden rounded-3xl group"
                                whileHover="hover"
                                variants={cardHover}
                            >
                                <motion.div
                                    className="w-full h-full"
                                    variants={imageHover}
                                >
                                    <img
                                        src={`/api/service/media/${services[4].image}`}
                                        alt={services[4].title}
                                        className="w-full h-full object-cover object-top"
                                    />
                                </motion.div>

                                <div className="pointer-events-none absolute inset-0">
                                    <div className="absolute rounded-3xl inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.56)_23.61%] to-[rgba(0,0,0,0)_64.76%]"></div>
                                    <h2 className="text-white max-w-[15rem] font-medium absolute top-8 right-8 left-8 text-2xl line-clamp-2">
                                        {services[4].title.split(" ")[0]}
                                        <br />
                                        {services[4].title
                                            .split(" ")
                                            .slice(1)
                                            .join(" ")}
                                    </h2>
                                    <motion.div
                                        className="absolute bottom-8 right-8 pointer-events-auto"
                                        variants={arrowAnimation}
                                    >
                                        <img
                                            src="/assets/img/icons/circle-right.svg"
                                            className="cursor-pointer"
                                        />
                                    </motion.div>
                                </div>
                            </motion.a>
                            <div className="w-4/12 h-[300px]">
                                <div className="bg-[#F8F8F8] rounded-3xl h-[300px] p-8 flex flex-col justify-between">
                                    <h2 className="text-[36px] font-medium leading-[102%] w-10/12">
                                        {landingServices.description}
                                    </h2>
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
                                                    transition: {
                                                        duration: 0.5,
                                                    },
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
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Caso para cuando hay menos de 5 servicios */}
                    {services.length < 5 && (
                        <div className="col-span-4 flex gap-6 mt-6">
                            <div className="w-full">
                                <div className="bg-[#F8F8F8] rounded-3xl h-[300px] p-8 flex flex-col justify-between">
                                    <h2 className="text-[36px] font-medium leading-[102%] w-9/12">
                                        {landingServices.description}
                                    </h2>
                                    <motion.div
                                        className="w-full px-[5%] lg:px-0 flex items-center justify-center lg:justify-start mt-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <motion.button
                                            onClick={() => setIsModalOpen(true)}
                                            className="bg-[#EFF0F1] text-[#242424] py-1 pl-1 pr-3 gap-2 rounded-full flex items-center"
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
                                                    transition: {
                                                        duration: 0.5,
                                                    },
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
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
