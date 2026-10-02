import React from "react";
import { motion } from "framer-motion";
import TextWithHighlight from "../../Utils/TextWithHighlight";
import { useTranslation } from "../../hooks/useTranslation";

const Filter = ({ categories, filter, setFilter, landing }) => {
    const landingFooter = landing.find(
        (item) => item.correlative === "page_blog_footer"
    );

    // Animaciones
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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    const buttonHover = {
        hover: {
            scale: 1.05,
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            transition: {
                duration: 0.3,
                ease: "easeOut",
            },
        },
        tap: {
            scale: 0.98,
        },
    };

    const inputFocus = {
        focus: {
            boxShadow: "0 0 0 2px #3b82f6",
            transition: {
                duration: 0.2,
            },
        },
    };

    const { t } = useTranslation();
    return (
        <motion.section
            className="p-[5%] lg:max-w-[82rem] 2xl:max-w-[92rem] mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-8 items-center text-negro">
                {/* Título y descripción */}
                <motion.div
                    className="col-span-1 md:col-span-2 lg:col-span-4 text-center lg:text-left"
                    variants={itemVariants}
                >
                    <motion.h2
                        className="w-full px-[5%] text-[32px] mt-8 lg:mt-0 text-center lg:px-0 lg:text-start leading-[34px] lg:text-5xl lg:leading-[102%]"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                type: "spring",
                                stiffness: 100,
                                damping: 10,
                            },
                        }}
                    >
                        <TextWithHighlight text={landingFooter?.title} />
                    </motion.h2>
                    <motion.p
                        className="hidden lg:flex mt-8"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: {
                                delay: 0.4,
                                duration: 0.8,
                            },
                        }}
                    >
                        {landingFooter?.description}
                    </motion.p>
                </motion.div>

                {/* Campo de búsqueda */}
                <motion.label
                    htmlFor="txt-search"
                    className="col-span-1 md:col-span-1 lg:col-span-2 px-6 py-4 flex items-center rounded-3xl bg-white"
                    variants={{ ...itemVariants, ...inputFocus }}
                    whileHover={{ y: -3 }}
                    whileFocus="focus"
                >
                    <motion.i
                        className="fas fa-search text-negro mr-2"
                        whileHover={{ scale: 1.1 }}
                    />
                    <motion.input
                        id="txt-search"
                        type="text"
                        placeholder={t(
                            "public.post.search",
                            "	Buscar publicación"
                        )}
                        className="w-full bg-transparent border-none outline-none text-slate-800"
                        onChange={(e) =>
                            setFilter((old) => ({
                                ...old,
                                search: e.target.value,
                            }))
                        }
                        whileFocus={{
                            outline: "none",
                            x: 3,
                        }}
                    />
                </motion.label>

                {/* Botones de categorías */}
                <motion.div
                    className="col-span-1 md:col-span-2 lg:col-span-6 flex flex-wrap gap-3 justify-center lg:justify-start"
                    variants={containerVariants}
                >
                    {categories.map((item, index) => (
                        <motion.button
                            key={index}
                            className={`px-6 py-4 rounded-3xl uppercase ${
                                item.id == filter.category
                                    ? "bg-azul text-white"
                                    : "bg-slate-100 text-negro"
                            }`}
                            onClick={() =>
                                setFilter((old) => ({
                                    ...old,
                                    category:
                                        item.id == filter.category
                                            ? null
                                            : item.id,
                                }))
                            }
                            variants={{ ...itemVariants, ...buttonHover }}
                            whileHover="hover"
                            whileTap="tap"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                delay: index * 0.05,
                            }}
                        >
                            {item.name}
                        </motion.button>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Filter;
