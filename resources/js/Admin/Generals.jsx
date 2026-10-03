import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Swal from "sweetalert2";

// Asume que tienes un servicio para guardar los datos
import BaseAdminto from "../Components/Adminto/Base";
import GeneralsRest from "../Actions/Admin/GeneralsRest";
import CreateReactScript from "../Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import Global from "../Utils/Global";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";

const generalsRest = new GeneralsRest();

const Generals = ({ generals }) => {
    const location =
        generals.find((x) => x.correlative == "location")?.description ?? "0,0";

    const [formData, setFormData] = useState({
        phones: generals
            .find((x) => x.correlative == "phone_contact")
            ?.description?.split(",")
            ?.map((x) => x.trim()) ?? [""],
        emails: generals
            .find((x) => x.correlative == "email_contact")
            ?.description?.split(",")
            ?.map((x) => x.trim()) ?? [""],
        address:
            generals.find((x) => x.correlative == "address")?.description ?? "",
        openingHours:
            generals.find((x) => x.correlative == "opening_hours")
                ?.description ?? "",
        supportPhone:
            generals.find((x) => x.correlative == "support_phone")
                ?.description ?? "",
        supportEmail:
            generals.find((x) => x.correlative == "support_email")
                ?.description ?? "",
        privacyPolicy:
            generals.find((x) => x.correlative == "privacy_policy")
                ?.description ?? "",
        termsConditions:
            generals.find((x) => x.correlative == "terms_conditions")
                ?.description ?? "",
        exchangePolicy:
            generals.find((x) => x.correlative == "exchange_policy")
                ?.description ?? "",
        cookiesPolicy:
            generals.find((x) => x.correlative == "cookies_policy")
                ?.description ?? "",
        seoTitle:
            generals.find((x) => x.correlative == "seo_title")?.description ??
            "",
        seoDescription:
            generals.find((x) => x.correlative == "seo_description")
                ?.description ?? "",
        seoKeywords:
            generals.find((x) => x.correlative == "seo_keywords")
                ?.description ?? "",
        location: {
            lat: Number(location.split(",").map((x) => x.trim())[0]),
            lng: Number(location.split(",").map((x) => x.trim())[1]),
        },
    });

    const [activeTab, setActiveTab] = useState("policies");
    const [generatingSitemap, setGeneratingSitemap] = useState(false);

    const handleGenerateSitemap = async () => {
        try {
            setGeneratingSitemap(true);
            const res = await generalsRest.generateSitemap();
            const isOk = res?.status === 200 || res?.status === true;
            if (isOk) {
                const payload = res?.data ?? res?.result ?? {};
                const totalUrls = payload.total_urls ?? 0;
                const servicesCount = payload.services_count ?? 0;
                const postsCount = payload.posts_count ?? 0;
                const generatedAt = payload.generated_at || new Date().toLocaleString();

                Swal.fire({
                    icon: "success",
                    title: "¡Sitemap Generado!",
                    html: `
                        <div class="text-start">
                            <p class="mb-2"><strong>Total URLs agregadas:</strong> ${totalUrls}</p>
                            <p class="mb-2"><strong>Servicios con slug:</strong> ${servicesCount}</p>
                            <p class="mb-2"><strong>Artículos de Blog:</strong> ${postsCount}</p>
                            <p class="mb-3 text-muted small"><strong>Fecha:</strong> ${generatedAt}</p>
                        </div>
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Ver Sitemap XML',
                    cancelButtonText: 'Cerrar',
                    confirmButtonColor: '#224483',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.open('/sitemap.xml', '_blank');
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: res?.message || "Ocurrió un error al generar el archivo sitemap.xml",
                });
            }
        } catch (error) {
            console.error("Error generando sitemap:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo comunicar con el servidor para generar el sitemap.",
            });
        } finally {
            setGeneratingSitemap(false);
        }
    };

    const handleInputChange = (e, index, field) => {
        const { value } = e.target;
        const list = [...formData[field]];
        list[index] = value;
        setFormData((prevState) => ({
            ...prevState,
            [field]: list,
        }));
    };

    const handleAddField = (field) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: [...prevState[field], ""],
        }));
    };

    const handleRemoveField = (index, field) => {
        const list = [...formData[field]];
        list.splice(index, 1);
        setFormData((prevState) => ({
            ...prevState,
            [field]: list,
        }));
    };

    const handleMapClick = (event) => {
        setFormData((prevState) => ({
            ...prevState,
            location: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await generalsRest.save([
                {
                    correlative: "phone_contact",
                    name: "Teléfono de contacto",
                    description: formData.phones.join(","),
                },
                {
                    correlative: "email_contact",
                    name: "Correo de contacto",
                    description: formData.emails.join(","),
                },
                {
                    correlative: "address",
                    name: "Dirección",
                    description: formData.address,
                },
                {
                    correlative: "opening_hours",
                    name: "Horarios de atención",
                    description: formData.openingHours,
                },
                {
                    correlative: "support_phone",
                    name: "Número de soporte",
                    description: formData.supportPhone,
                },
                {
                    correlative: "support_email",
                    name: "Correo de soporte",
                    description: formData.supportEmail,
                },
                {
                    correlative: "privacy_policy",
                    name: "Política de privacidad",
                    description: formData.privacyPolicy,
                },
                {
                    correlative: "terms_conditions",
                    name: "Términos y condiciones",
                    description: formData.termsConditions,
                },
                {
                    correlative: "exchange_policy",
                    name: "Política de cambio",
                    description: formData.exchangePolicy,
                },
                {
                    correlative: "cookies_policy",
                    name: "Política de cookies",
                    description: formData.cookiesPolicy,
                },
                {
                    correlative: "seo_title",
                    name: "Titulo - SEO",
                    description: formData.seoTitle,
                },
                {
                    correlative: "seo_description",
                    name: "Descripcion - SEO",
                    description: formData.seoDescription,
                },
                {
                    correlative: "seo_keywords",
                    name: "Palabras clave - SEO",
                    description: formData.seoKeywords,
                },
                {
                    correlative: "location",
                    name: "Ubicación",
                    description: `${formData.location.lat},${formData.location.lng}`,
                },
            ]);
            // alert('Datos guardados exitosamente');
        } catch (error) {
            console.error("Error al guardar los datos:", error);
            // alert('Error al guardar los datos');
        }
    };

    const seo_keywords = (
        generals.find((x) => x.correlative == "seo_keywords")?.description ?? ""
    )
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

    useEffect(() => {
        $("#cbo-keywords option").prop("selected", true).trigger("change");
    }, [null]);

    console.log(formData);

    return (
        <div className="card">
            <form className="card-body" onSubmit={handleSubmit}>
                <ul className="nav nav-tabs" id="contactTabs" role="tablist">
                    <li className="nav-item" role="presentation" hidden>
                        {" "}
                        {/* Quitar el hidden para que se muestren las opciones */}
                        <button
                            className={`nav-link ${
                                activeTab === "contact" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("contact")}
                            type="button"
                            role="tab"
                        >
                            Información de Contacto
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${
                                activeTab === "policies" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("policies")}
                            type="button"
                            role="tab"
                        >
                            Políticas y Términos
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${
                                activeTab === "seo" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("seo")}
                            type="button"
                            role="tab"
                        >
                            SEO (Metatags)
                        </button>
                    </li>
                    <li className="nav-item" role="presentation" hidden>
                        {" "}
                        {/* Quitar el hidden para que se muestren las opciones */}
                        <button
                            className={`nav-link ${
                                activeTab === "location" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("location")}
                            type="button"
                            role="tab"
                        >
                            Ubicación
                        </button>
                    </li>
                </ul>

                <div className="tab-content" id="contactTabsContent">
                    <div
                        className={`tab-pane fade ${
                            activeTab === "contact" ? "show active" : ""
                        }`}
                        role="tabpanel"
                    >
                        <div className="row">
                            <div className="col-md-6">
                                {formData.phones.map((phone, index) => (
                                    <div
                                        key={`phone-${index}`}
                                        className="mb-3"
                                    >
                                        <label
                                            htmlFor={`phone-${index}`}
                                            className="form-label"
                                        >
                                            Teléfono {index + 1}
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id={`phone-${index}`}
                                                value={phone}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        index,
                                                        "phones"
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleRemoveField(
                                                        index,
                                                        "phones"
                                                    )
                                                }
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleAddField("phones")}
                                >
                                    Agregar teléfono
                                </button>
                            </div>
                            <div className="col-md-6">
                                {formData.emails.map((email, index) => (
                                    <div
                                        key={`email-${index}`}
                                        className="mb-3"
                                    >
                                        <label
                                            htmlFor={`email-${index}`}
                                            className="form-label"
                                        >
                                            Correo {index + 1}
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`email-${index}`}
                                                value={email}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        index,
                                                        "emails"
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleRemoveField(
                                                        index,
                                                        "emails"
                                                    )
                                                }
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleAddField("emails")}
                                >
                                    Agregar correo
                                </button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">
                                Dirección
                            </label>
                            <textarea
                                className="form-control"
                                id="address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        address: e.target.value,
                                    })
                                }
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <TextareaFormGroup
                                label="Horarios de atencion"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        openingHours: e.target.value,
                                    })
                                }
                                value={formData.openingHours}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="supportPhone"
                                className="form-label"
                            >
                                Número de soporte
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="supportPhone"
                                value={formData.supportPhone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        supportPhone: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="supportEmail"
                                className="form-label"
                            >
                                Correo de soporte
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="supportEmail"
                                value={formData.supportEmail}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        supportEmail: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${
                            activeTab === "policies" ? "show active" : ""
                        }`}
                        role="tabpanel"
                    >
                        <div className="mb-3">
                            <QuillFormGroup
                                label="Política de privacidad"
                                value={formData.privacyPolicy}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        privacyPolicy: value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <QuillFormGroup
                                label="Términos y condiciones"
                                value={formData.termsConditions}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        termsConditions: value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <QuillFormGroup
                                label="Políticas de cambio"
                                value={formData.exchangePolicy}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        exchangePolicy: value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <QuillFormGroup
                                label="Políticas de cookies"
                                value={formData.cookiesPolicy}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        cookiesPolicy: value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${
                            activeTab === "seo" ? "show active" : ""
                        }`}
                        role="tabpanel"
                    >
                        <InputFormGroup
                            label="Titulo - SEO"
                            value={formData.seoTitle ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    seoTitle: e.target.value,
                                })
                            }
                        />
                        <TextareaFormGroup
                            label="Descripcion - SEO"
                            value={formData.seoDescription ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    seoDescription: e.target.value,
                                })
                            }
                        />
                        <SelectFormGroup
                            id="cbo-keywords"
                            label="Palabras clave - SEO"
                            tags
                            multiple
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    seoKeywords: [...$(e.target).val()].join(
                                        ", "
                                    ),
                                })
                            }
                        >
                            {seo_keywords.map((keyword, index) => {
                                return (
                                    <option key={index} value={keyword}>
                                        {keyword}
                                    </option>
                                );
                            })}
                        </SelectFormGroup>

                        <div className="card mt-4 border border-info bg-light">
                            <div className="card-body">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                    <div>
                                        <h5 className="card-title mb-1 text-primary d-flex align-items-center gap-2">
                                            <i className="fas fa-sitemap me-2"></i> Mapa del Sitio Web (Sitemap XML)
                                        </h5>
                                        <p className="card-text text-muted mb-0 small">
                                            Genera y actualiza dinámicamente el archivo <code>public/sitemap.xml</code> incluyendo automáticamente todas las páginas principales, servicios con sus slugs y artículos del blog para Google y motores de búsqueda.
                                        </p>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        <a
                                            href="/sitemap.xml"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-outline-secondary btn-sm"
                                        >
                                            <i className="fas fa-external-link-alt me-1"></i> Ver actual
                                        </a>
                                        <button
                                            type="button"
                                            className="btn btn-success btn-sm d-flex align-items-center gap-1"
                                            onClick={handleGenerateSitemap}
                                            disabled={generatingSitemap}
                                        >
                                            {generatingSitemap ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                    Generando...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-sync-alt me-1"></i> Generar Sitemap XML
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${
                            activeTab === "location" ? "show active" : ""
                        }`}
                        role="tabpanel"
                    >
                        <LoadScript googleMapsApiKey={Global.GMAPS_API_KEY}>
                            <GoogleMap
                                mapContainerStyle={{
                                    width: "100%",
                                    height: "400px",
                                }}
                                center={formData.location}
                                zoom={10}
                                onClick={handleMapClick}
                            >
                                <Marker position={formData.location} />
                            </GoogleMap>
                        </LoadScript>
                        <small className="form-text text-muted">
                            Haz clic en el mapa para seleccionar la ubicación.
                        </small>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary mt-3">
                    Guardar
                </button>
            </form>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Datos Generales">
            <Generals {...properties} />
        </BaseAdminto>
    );
});
