import React, { useContext, useRef, useState, useEffect } from "react";
import Logout from "../../Actions/Logout";
import Global from "../../Utils/Global";
import WhatsAppStatuses from "../../Reutilizables/WhatsApp/WhatsAppStatuses";
import {
    LanguageContext,
    LanguageProvider,
} from "../../context/LanguageContext";
//const NavBar = ({ session = {}, title = "Pagina", whatsappStatus })
const NavBar = ({ session = {}, title = "Pagina", languagesSystem }) => {
    //   console.log(languagesSystem);
    // const { color } = WhatsAppStatuses[whatsappStatus];

    useEffect(() => {
        document.title = `${title} | ${Global.APP_NAME}`;
    }, [null]);
    const { currentLanguage, changeLanguage } = useContext(LanguageContext);
    const [selectLanguage, setSelectLanguage] = useState(
        currentLanguage || languagesSystem[0]
    );
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
                window.location.reload(); // ⚠️ Opcional temporal para forzar actualización
            } else {
                console.error("Error:", await response.text());
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
        <div className="navbar-custom">
            <ul className="list-unstyled topnav-menu float-end mb-0">
                <li className="dropdown notification-list topbar-dropdown ">
                    <div className=" ">
                        <div className="d-flex gap-0 align-items-center justify-content-center ">
                            {languagesSystem.map((language) => (
                                <a
                                    key={language.id}
                                    className={`nav-link dropdown-toggle nav-user me-0 waves-effect waves-light `}
                                    data-bs-toggle="dropdown"
                                    href="#"
                                    role="button"
                                    aria-haspopup="false"
                                    aria-expanded="false"
                                    onClick={() => onUseLanguage(language)}
                                >
                                    <img
                                        src={`/api/lang/media/${language.image}`}
                                        className={`${selectLanguage.id === language.id
                                                ? "border border-2 border-primary"
                                                : ""
                                            }`}
                                        style={{
                                            width: "40px",

                                            borderRadius: "20%",
                                        }}
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </li>
                <li className="dropdown notification-list topbar-dropdown">
                    {/*
                      <li className="notification-list topbar-dropdown d-none d-lg-block">
                    <a
                        className="nav-link waves-effect waves-light"
                        data-bs-toggle="modal"
                        data-bs-target="#whatsapp-modal"
                    >
                        <span className="position-relative">
                            <i className="mdi mdi-whatsapp noti-icon"></i>
                            <span
                                className={`position-absolute top-0 start-100 translate-middle p-1 bg-${color} rounded-circle`}
                            >
                                <span className="visually-hidden">
                                    New alerts
                                </span>
                            </span>
                        </span>
                    </a>
                </li>
                    */}

                    <a
                        className="nav-link dropdown-toggle nav-user me-0 waves-effect waves-light"
                        data-bs-toggle="dropdown"
                        href="#"
                        role="button"
                        aria-haspopup="false"
                        aria-expanded="false"
                    >
                        <img
                            src={`/api/admin/profile/thumbnail/${session.relative_id
                                }?v=${crypto.randomUUID()}`}
                            alt="user-image"
                            className="rounded-circle"
                            style={{
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                            onError={(e) =>
                                (e.target.src = `https://ui-avatars.com/api/?name=${session.name}+${session.lastname}&color=7F9CF5&background=EBF4FF`)
                            }
                        />
                        <span className="pro-user-name ms-1">
                            {session.name.split(" ")[0]}{" "}
                            {session.lastname.split(" ")[0]}
                            <i className="mdi mdi-chevron-down"></i>
                        </span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end profile-dropdown ">
                        <div className="dropdown-header noti-title">
                            <h6 className="text-overflow m-0">Bienvenido !</h6>
                        </div>

                        <a
                            href="/profile"
                            className="dropdown-item notify-item"
                        >
                            <i className="fe-user"></i>
                            <span>Mi perfil</span>
                        </a>

                        <a
                            href="/account"
                            className="dropdown-item notify-item"
                        >
                            <i className="mdi mdi-account-key-outline"></i>
                            <span>Mi cuenta</span>
                        </a>
                        <a
                            href="#"
                            className="dropdown-item notify-item right-bar-toggle dropdown notification-list"
                        >
                            <i className="fe-lock"></i>
                            <span>Configuracion</span>
                        </a>

                        <div className="dropdown-divider"></div>

                        <a
                            href="#"
                            className="dropdown-item notify-item"
                            onClick={Logout}
                        >
                            <i className="fe-log-out"></i>
                            <span>Cerrar sesion</span>
                        </a>
                    </div>
                </li>

                <li className="dropdown notification-list">
                    <a
                        href="#"
                        className="nav-link right-bar-toggle waves-effect waves-light"
                    >
                        <i className="fe-settings noti-icon"></i>
                    </a>
                </li>
            </ul>

            <div
                className="logo-box"
                style={{
                    background: "#224483 ",
                }}
            >
                <a href="/" className="logo logo-light text-center">
                    <span className="logo-sm">
                        <img src="/assets/img/favicon.png" alt="" height="22" />
                    </span>
                    <span className="logo-lg">
                        <img
                            src="/assets/img/logo-white.png"
                            alt=""
                            height="36"
                        />
                    </span>
                </a>
                <a href="/" className="logo logo-dark text-center">
                    <span className="logo-sm">
                        <img src="/assets/img/favicon.png" alt="" height="22" />
                    </span>
                    <span className="logo-lg">
                        <img src="/assets/img/logo.png" alt="" height="16" />
                    </span>
                </a>
            </div>

            <ul className="list-unstyled topnav-menu topnav-menu-left mb-0">
                <li>
                    <button className="button-menu-mobile disable-btn waves-effect">
                        <i className="fe-menu"></i>
                    </button>
                </li>

                <li>
                    <h4 className="page-title-main">{title}</h4>
                </li>
            </ul>

            <div className="clearfix"></div>
        </div>
    );
};

export default NavBar;
