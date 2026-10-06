import React, { useEffect, useRef, useState } from "react";
import {
    Mail,
    User,
    MessageSquare,
    ArrowUpRight,
    ChevronDown,
} from "lucide-react";

import Swal from "sweetalert2";
import { data } from "autoprefixer";

const messagesRest = new AppointmentsRest();
import { X } from "lucide-react";
import AppointmentsRest from "../../actions/Admin/AppointmentsRest";
import { useTranslation } from "../../hooks/useTranslation";
import TextWithHighlight from "../../Utils/TextWithHighlight";
const PhoneInput = ({ onPhoneChange }) => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Cargar países y establecer Perú como predeterminado
    useEffect(() => {
        const loadCountries = async () => {
            try {
                // Si está en public/data
                const response = await fetch(
                    "/assets/data/countries_phone.json"
                );
                // Si está en src/data (importar directamente)
                // import countriesData from '../data/countries_phone.json';

                const data = await response.json();
                setCountries(data);

                // Establecer Perú como predeterminado (código PE)
                const peru = data.find((c) => c.iso2 === "PE");
                setSelectedCountry(peru || data[0]);
            } catch (error) {
                console.error("Error loading countries:", error);
            }
        };

        loadCountries();
    }, []);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Solo números
        setPhoneNumber(value);

        // Enviar el número completo con prefijo al formulario padre
        if (selectedCountry) {
            const fullNumber = `+${selectedCountry.phoneCode.replace(
                /\D/g,
                ""
            )}${value}`;
            onPhoneChange(fullNumber);
        }
    };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setShowDropdown(false);
    };

    const { t } = useTranslation();

    return (
        <div className="relative w-full">
            <label className="block text-sm  mb-1">
                {t("public.form.phone", "Número de teléfono")}*
            </label>

            <div className="flex border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-azul">
                {/* Selector de país */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        className="flex items-center justify-between px-3 py-2 h-full border-r border-gray-300 bg-gray-50 rounded-l-md w-20"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <div className="flex items-center">
                            <span
                                className={`fi fi-${selectedCountry?.iso2.toLowerCase()} mr-2`}
                            ></span>
                            <span>{selectedCountry?.iso2}</span>
                        </div>
                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                                showDropdown ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {showDropdown && (
                        <div className="absolute z-10 mt-1 w-64 bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto border border-gray-200">
                            {countries.map((country) => (
                                <div
                                    key={country.iso2}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                    onClick={() => handleCountrySelect(country)}
                                >
                                    <span
                                        className={`fi fi-${country.iso2.toLowerCase()} mr-3`}
                                    ></span>
                                    <span className="flex-1">
                                        {country.nameES}
                                    </span>
                                    <span className="text-gray-500">
                                        +{country.phoneCode}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input de teléfono */}
                <input
                    required
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Ej: 987654321"
                    className="flex-1 px-4 py-2 focus:outline-none rounded-r-md"
                    pattern="[0-9]*"
                />
            </div>

            {/* Mostrar número completo */}
            {phoneNumber && selectedCountry && (
                <p className="mt-1 text-sm text-gray-500">
                    Número completo: +{selectedCountry.phoneCode} {phoneNumber}
                </p>
            )}
        </div>
    );
};
export default function ModalAppointment({
    isOpen,
    onClose,
    randomImage,
    linkWhatsApp,
}) {
    const [formData, setFormData] = useState({
        phone: "",
    });
    const nameRef = useRef();
    const lastNameRef = useRef();
    const lastName2Ref = useRef();
    const documentRef = useRef();

    const emailRef = useRef();
    const numberRef = useRef();
    const descriptionRef = useRef();

    const [sending, setSending] = useState(false);

    const onMessageSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        const request = {
            name: nameRef.current.value,
            lastname_father: lastNameRef.current.value,
            lastname_mother: lastName2Ref.current.value,
            document: documentRef.current.value,
            email: emailRef.current.value,
            number: formData.phone,
            description: descriptionRef.current.value,
        };

        const result = await messagesRest.save(request);
        setSending(false);

        if (!result) return;

        Swal.fire({
            icon: "success",
            title: "Mensaje enviado",
            text: "Tu mensaje ha sido enviado correctamente. ¡Nos pondremos en contacto contigo pronto!",
            showConfirmButton: false,
            timer: 3000,
        });

        nameRef.current.value = null;
        lastNameRef.current.value = null;
        lastName2Ref.current.value = null;
        documentRef.current.value = null;
        emailRef.current.value = null;
        numberRef.current.value = null;
        descriptionRef.current.value = null;
        setFormData({
            phone: "",
        });
    };

    if (!isOpen) return null;
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 px-[5%] lg:px-0 z-50 flex items-center justify-center py-10  bg-black bg-opacity-50 overflow-y-auto scrollbar-hide">
            <div className="relative  w-full mt-[1000px] lg:mt-[500px] max-w-5xl bg-white rounded-3xl shadow-3xl overflow-hidden flex flex-col md:flex-row">
                {/* Botón de cierre */}
                <button
                    onClick={onClose}
                    className="absolute top-8 lg:top-4 right-4 bg-gray-100 rounded-full p-1 z-10"
                    aria-label="Cerrar"
                >
                    <X className="h-5 w-5 text-azul" />
                </button>

                {/* Formulario */}
                <div className="w-full md:w-1/2 p-6 md:p-8">
                    <h2 className="text-[40px]  mb-6 max-w-[15rem] leading-10">
                        <TextWithHighlight
                            text={t(
                                "public.form.form_cita",
                                " Reservar una *cita* ahora"
                            )}
                        />
                    </h2>

                    <form
                        className="flex flex-col gap-y-6"
                        onSubmit={onMessageSubmit}
                    >
                        <div>
                            <label
                                htmlFor="nombre"
                                className="block text-sm   mb-1"
                            >
                                {t("public.form.name", "Nombre")}*
                            </label>
                            <input
                                ref={nameRef}
                                required
                                type="text"
                                id="nombre"
                                placeholder={t("public.form.name", "Nombre")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-azul"
                            />
                        </div>

                        <div className="flex flex-col lg:flex-row gap-4">
                            <div>
                                <label
                                    htmlFor="apellido-paterno"
                                    className="block text-sm   mb-1"
                                >
                                    {t(
                                        "public.form.lastname_father",
                                        "Apellido paterno"
                                    )}
                                    *
                                </label>
                                <input
                                    ref={lastNameRef}
                                    required
                                    type="text"
                                    id="apellido-paterno"
                                    placeholder={t(
                                        "public.form.lastname_father",
                                        "Apellido paterno"
                                    )}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-azul"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="apellido-materno"
                                    className="block text-sm   mb-1"
                                >
                                    {t(
                                        "public.form.lastname_mother",
                                        "Apellido materno"
                                    )}
                                    *
                                </label>
                                <input
                                    ref={lastName2Ref}
                                    required
                                    type="text"
                                    id="apellido-materno"
                                    placeholder={t(
                                        "public.form.lastname_mother",
                                        "Apellido materno"
                                    )}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-azul"
                                />
                            </div>
                        </div>

                        <div>
                            <PhoneInput
                                onPhoneChange={(fullNumber) =>
                                    setFormData({
                                        ...formData,
                                        phone: fullNumber,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="document"
                                className="block text-sm   mb-1"
                            >
                                {t("public.form.dni", " DNI o CE")}
                            </label>
                            <input
                                ref={documentRef}
                                type="text"
                                id="document"
                                placeholder={t("public.form.dni", " DNI o CE")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-azul"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm   mb-1"
                            >
                                {t("public.form.email", " Correo electrónico")}
                            </label>
                            <input
                                required
                                ref={emailRef}
                                type="email"
                                id="email"
                                placeholder={t(
                                    "public.form.email",
                                    "Correo electrónico"
                                )}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-azul"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="mensaje"
                                className="block text-sm   mb-1"
                            >
                                {t("public.form.message", "Escribe un mensaje")}
                            </label>
                            <textarea
                                required
                                ref={descriptionRef}
                                id="mensaje"
                                rows={6}
                                placeholder={t(
                                    "public.form.message",
                                    "Escribe un mensaje"
                                )}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-azul"
                            ></textarea>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="privacidad"
                                    type="checkbox"
                                    className="h-4 w-4 text-azul border-gray-300 rounded focus:ring-azul/50"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="privacidad" className="">
                                    <TextWithHighlight
                                        text={t(
                                            "public.form.privacy",
                                            " Usted acepta nuestra amigable *política de privacidad*."
                                        )}
                                        link="/policies/privacy_policy"
                                    />
                                </label>
                            </div>
                        </div>

                        <button
                            disabled={sending}
                            type="submit"
                            className=" mt-5 bg-[#224483] font-semibold w-max text-white py-1 pl-1 pr-3  gap-2 rounded-full flex items-center lg:h-14"
                        >
                            <div className="bg-[#EFF0F1] w-12 p-2 rounded-full">
                                <img
                                    src="/assets/img/icons/send.png"
                                    className=" h-auto"
                                />
                            </div>
                            {!sending ? (
                                <p className="ml-4">
                                    {t(
                                        "public.btn.send_form",
                                        "Enviar formulario"
                                    )}
                                </p>
                            ) : (
                                <p>
                                    {t(
                                        "public.btn.sending",
                                        " Enviando formulario..."
                                    )}
                                </p>
                            )}
                        </button>
                    </form>

                    {/* WhatsApp Section */}
                    <div className="mt-6 bg-[#F2F4F8] p-4 rounded-3xl flex items-center">
                        <div className="bg-green-500 text-white p-2 rounded-full mr-3 flex-shrink-0">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[#242424] text-base">
                                {t(
                                    "public.form.whatsapp",
                                    "¿Tienes dudas sobre como agendar?"
                                )}
                                <br />
                                <a
                                    href={linkWhatsApp?.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-azul cursor-pointer"
                                >
                                    {t(
                                        "public.form.link_whatsapp",
                                        "Chatea con nosotros por WhatsApp"
                                    )}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Imagen - Visible solo en desktop */}
                <div className="block lg:w-1/2 bg-gray-100">
                    <img
                        src={`/api/service/media/${randomImage.image}`}
                        alt="Fisioterapeuta con paciente"
                        className="w-full h-80 lg:h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
