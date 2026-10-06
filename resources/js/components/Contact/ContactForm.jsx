import React, { useEffect, useRef, useState } from "react";
import {
    Mail,
    User,
    MessageSquare,
    ArrowUpRight,
    ChevronDown,
} from "lucide-react";
import MessagesRest from "../../Actions/MessagesRest";
import Swal from "sweetalert2";
import { data } from "autoprefixer";
import { useTranslation } from "../../hooks/useTranslation";
import TextWithHighlight from "../../Utils/TextWithHighlight";

const messagesRest = new MessagesRest();

const PhoneInput = ({ onPhoneChange, t }) => {
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

    return (
        <div className="relative w-full">
            <label className="block text-sm font-medium mb-1">   {t(
                "public.form.phone",
                "Teléfono"
            )}*</label>

            <div className="flex border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
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
                            className={`h-4 w-4 transition-transform ${showDropdown ? "rotate-180" : ""
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
                    +{selectedCountry.phoneCode} {phoneNumber}
                </p>
            )}
        </div>
    );
};

const ContactForm = ({ }) => {
    const [formData, setFormData] = useState({
        phone: "",
    });
    const nameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const subjectRef = useRef();
    const descriptionRef = useRef();

    const [sending, setSending] = useState(false);

    const onMessageSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        const request = {
            name: nameRef.current.value + " " + lastNameRef.current.value,
            email: emailRef.current.value,
            subject: formData.phone,
            description: descriptionRef.current.value,
        };

        const result = await messagesRest.save(request);
        setSending(false);
        window.location.href = "/thanks";
        if (!result) return;

        Swal.fire({
            icon: "success",
            title: "Mensaje enviado",
            text: "Tu mensaje ha sido enviado correctamente. ¡Nos pondremos en contacto contigo pronto!",
            showConfirmButton: false,
            timer: 3000,
        });

        nameRef.current.value = null;
        lastNameRef.current.value = null; // Limpiar el campo de apellido materno después de enviarl
        emailRef.current.value = null;
        subjectRef.current.value = null;
        descriptionRef.current.value = null;
        setFormData({
            phone: "",
        });
    };

    const { t } = useTranslation();

    return (
        <form className="flex flex-col gap-y-6" onSubmit={onMessageSubmit}>
            <div>
                <label
                    htmlFor="nombre"
                    className="block text-sm font-medium  mb-1"
                >
                    {t("public.form.name", "Nombre")}
                </label>
                <input
                    ref={nameRef}
                    type="text"
                    id="nombre"
                    placeholder={t("public.form.name", "Nombre")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="">
                <div>
                    <label
                        htmlFor="apellido-materno"
                        className="block text-sm font-medium  mb-1"
                    >
                        {t("public.form.lastname", "Apelldios")}
                    </label>
                    <input
                        ref={lastNameRef}
                        type="text"
                        id="apellido-materno"
                        placeholder={t("public.form.lastname", "Apelldios")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium  mb-1"
                >
                    {t("public.form.email", "E-mail")}
                </label>
                <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    placeholder={t("public.form.email", "E-mail")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <PhoneInput
                    t={t}
                    onPhoneChange={(fullNumber) =>
                        setFormData({ ...formData, phone: fullNumber })
                    }
                />
            </div>

            <div>
                <label
                    htmlFor="mensaje"
                    className="block text-sm font-medium  mb-1"
                >
                    {t("public.form.message", "Escribe un mensaje")}
                </label>
                <textarea
                    ref={descriptionRef}
                    id="mensaje"
                    rows={6}
                    placeholder={t("public.form.message", "Escribe un mensaje")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                "Usted acepta nuestra amigable *política de privacidad*."
                            )}
                            link="/policies/privacy_policy"
                        />
                    </label>
                </div>
            </div>

            <button
                disabled={sending}
                type="submit"
                className=" mt-5 bg-[#224483] font-semibold w-8/12 lg:w-3/6 text-white py-1 pl-1 pr-3  gap-2 rounded-full flex items-center lg:h-14"
            >
                <div className="bg-[#EFF0F1] w-12 p-2 rounded-full">
                    <img src="/assets/img/icons/send.png" className=" h-auto" />
                </div>
                {!sending ? (
                    <p className="ml-4">
                        {t("public.btn.send_form", "Enviar formulario")}
                    </p>
                ) : (
                    <p> {t("public.btn.sending", "Enviando formulario...")}</p>
                )}
            </button>
        </form>
    );
};

export default ContactForm;
