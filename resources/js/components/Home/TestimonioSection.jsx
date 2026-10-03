// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Navigation, Pagination } from "swiper/modules";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonioSection({ testimonies }) {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <div className="mt-0 font-poppins w-full max-w-full overflow-x-clip relative">
            <div className="max-w-md mx-auto px-4 py-4 lg:max-w-3xl lg:mt-4 relative">
                <Swiper
                    navigation={{
                        prevEl: ".custom-prev",
                        nextEl: ".custom-next",
                    }}
                    slidesPerView={3}
                    spaceBetween={30}
                    loop={true}
                    breakpoints={{
                        0: { slidesPerView: 1, spaceBetween: 10 },
                        640: { slidesPerView: 1, spaceBetween: 10 },
                        1024: { slidesPerView: 1, spaceBetween: 0 },
                    }}
                    modules={[Navigation, Pagination]}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                >
                    {testimonies.map((testimonio, index) => (
                        <SwiperSlide key={index}>
                            <div className="gap-4 w-full my-6 relative min-h-[400px] cursor-pointer">
                                <img
                                    className="absolute -z-10 mt-10 lg:left-1/2 lg:-translate-x-1/2"
                                    src="/assets/img/testimonioSection/Ellipse.png"
                                />
                                <div className="flex items-center justify-center flex-col">
                                    <img
                                        className="w-20 h-20 rounded-full"
                                        src={`/api/testimony/media/${testimonio.image}`}
                                    />
                                    <p className="text-xl mt-6 text-center lg:text-[22px]">
                                        {testimonio.description}
                                    </p>
                                    <p className="text-center text-2xl text-[#224483] mt-10 font-semibold">
                                        {testimonio.name}
                                    </p>
                                    <p className="text-[#242424A3] text-center">
                                        {testimonio.correlative}
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* Botones de navegación personalizados */}
                <div className="hidden lg:block absolute top-1/2 left-[-40px] transform -translate-y-1/2 custom-prev cursor-pointer">
                    <ChevronLeft
                        size={40}
                        strokeWidth={3}
                        className="text-[#224483]"
                    />
                </div>

                <div className="hidden lg:block absolute top-1/2 right-[-40px] transform -translate-y-1/2 custom-next cursor-pointer">
                    <ChevronRight
                        size={40}
                        strokeWidth={3}
                        className="text-[#224483]"
                    />
                </div>
                {/* Paginacion personalizada */}
                <div className="flex justify-center gap-2 mt-10">
                    {testimonies.map((_, index) => (
                        <button
                            key={index}
                            className={`rounded-full transition-all duration-300 ${
                                index === activeIndex
                                    ? "bg-[#224483] w-[20px] h-[12px]"
                                    : "bg-[#22448366] w-[12px] h-[12px]"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
