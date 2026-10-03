import { motion } from "framer-motion";
import TextWithHighlight from "../../Utils/TextWithHighlight";
import { useTranslation } from "../../hooks/useTranslation";

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

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const imageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
};

const AcercaDe = ({ staff_boss }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            className="min-h-screen mt-12 font-poppins px-[5%] lg:mt-48 lg:max-w-[82rem] lg:mx-auto lg:min-h-full lg:flex lg:gap-10 overflow-x-clip"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.img
                src={`/api/staff/media/${staff_boss?.image}`}
                className="w-full lg:flex lg:w-6/12 object-cover"
                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                variants={imageVariants}
            />

            <motion.div
                className="px-[4%] lg:px-0 lg:w-6/12 lg:pr-6"
                variants={containerVariants}
            >
                <motion.p className="mt-6 text-2xl" variants={itemVariants}>
                    {staff_boss?.job}
                </motion.p>

                <motion.h2
                    className="text-4xl font-medium leading-[102%] w-full mt-2 lg:text-5xl"
                    variants={itemVariants}
                >
                    <TextWithHighlight text={staff_boss?.name} />
                </motion.h2>

                <motion.p
                    className="mt-6 text-lg leading-[1.7rem] lg:text-[17px]"
                    variants={itemVariants}
                >
                    {staff_boss?.description}
                </motion.p>

                <motion.div
                    className="mt-8 lg:mt-8"
                    variants={containerVariants}
                >
                    {staff_boss?.characteristics?.map(
                        (characteristic, index) => (
                            <motion.div
                                className="flex gap-3 mb-3 lg:mb-2"
                                key={index}
                                variants={itemVariants}
                            >
                                <img
                                    src="/assets/img/acercaDe/pin.png"
                                    className="w-6 h-6"
                                />
                                <p className="text-lg lg:text-[17px]">
                                    {characteristic}
                                </p>
                            </motion.div>
                        )
                    )}
                </motion.div>

                <motion.div
                    className="w-full flex items-center justify-start "
                    variants={itemVariants}
                >
                    <a
                        href="/about"
                        className="mt-6 bg-[#F8F8F8] text-[#242424] py-1 pl-1 pr-5 gap-2 rounded-full flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="bg-[#224483] w-12 p-2 rounded-full">
                            <img
                                src="/assets/img/icons/user-group.png"
                                className="h-auto"
                            />
                        </div>
                        {t("public.btn.all_staff", "Ver staff")}
                    </a>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default AcercaDe;
