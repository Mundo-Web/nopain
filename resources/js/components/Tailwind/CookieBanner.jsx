import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { X } from 'lucide-react';

const CookieBanner = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const hasAccepted = localStorage.getItem('cookiesAccepted');
        if (!hasAccepted) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        setIsVisible(false);
        window.location.reload();
    };

    const rejectCookies = () => {
        localStorage.setItem('cookiesAccepted', 'false');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <>
            <div className="fixed bottom-0 left-0 w-full bg-[#224483] text-white shadow-[0_-4px_15px_rgba(0,0,0,0.3)] z-[99999] px-6 py-6 md:py-8 font-poppins flex flex-col xl:flex-row items-center justify-between gap-6 transition-transform">
                <div className="flex-1 w-full xl:max-w-[70%]">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                        🍪 {t('public.cookies.title', 'Uso de Cookies')}
                    </h3>
                    <p className="text-sm md:text-[15px] text-gray-200 leading-relaxed">
                        {t('public.cookies.text', 'Utilizamos cookies propias y de terceros para personalizar el contenido, adaptar nuestros anuncios y mejorar su experiencia en nuestro sitio web. Al hacer clic en "Aceptar todas", aceptas su uso. También puedes configurar tus preferencias o rechazar las cookies no esenciales.')}{' '}
                        <a href="/policies/cookies_policy" className="text-white font-bold underline hover:text-gray-300">
                            {t('public.cookies.more_info', 'Leer Política de Cookies')}
                        </a>.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full xl:w-auto">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-transparent border-2 border-white/50 text-white px-5 py-3 rounded-full font-medium hover:bg-white/10 hover:border-white transition-all text-center"
                    >
                        {t('public.cookies.config', 'Configurar opciones')}
                    </button>
                    <button 
                        onClick={rejectCookies} 
                        className="bg-white/10 text-white px-5 py-3 rounded-full font-medium hover:bg-white/20 transition-all text-center"
                    >
                        {t('public.cookies.reject', 'Rechazar')}
                    </button>
                    <button 
                        onClick={acceptCookies} 
                        className="bg-white text-[#224483] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg text-center"
                    >
                        {t('public.cookies.accept', 'Aceptar todas')}
                    </button>
                </div>
            </div>

            {/* Modal de configuración de cookies */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[999999] flex items-center justify-center p-4 font-poppins backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 transition-colors"
                        >
                            <X size={24} />
                        </button>
                        
                        <h2 className="text-2xl font-bold text-[#224483] mb-4 pr-8">
                            {t('public.cookies.config_title', 'Configuración de Cookies')}
                        </h2>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            {t('public.cookies.config_desc', 'Puedes gestionar tus preferencias de cookies aquí. Las cookies necesarias no se pueden desactivar ya que son indispensables para el funcionamiento seguro y básico del sitio web.')}
                        </p>

                        <div className="space-y-4 mb-8">
                            {/* Cookie Estrictamente Necesaria */}
                            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-gray-800 text-[15px]">{t('public.cookies.strict', 'Cookies estrictamente necesarias')}</h4>
                                    <span className="text-xs font-bold bg-[#224483] text-white px-3 py-1 rounded-full shadow-sm">Siempre activas</span>
                                </div>
                                <p className="text-[13px] text-gray-500 leading-relaxed">Permiten funciones básicas como la navegación por páginas y el acceso a áreas seguras del sitio.</p>
                            </div>
                            
                            {/* Cookie Analíticas */}
                            <div className="border border-gray-200 rounded-xl p-5 hover:border-[#224483]/30 transition-colors">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-gray-800 text-[15px]">{t('public.cookies.analytics', 'Cookies analíticas')}</h4>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#224483]"></div>
                                    </label>
                                </div>
                                <p className="text-[13px] text-gray-500 leading-relaxed">Nos ayudan a entender cómo interactúan los visitantes con la web reuniendo y proporcionando información de forma anónima para mejorar el rendimiento.</p>
                            </div>

                            {/* Cookie Marketing */}
                            <div className="border border-gray-200 rounded-xl p-5 hover:border-[#224483]/30 transition-colors">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-gray-800 text-[15px]">{t('public.cookies.marketing', 'Cookies de marketing')}</h4>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#224483]"></div>
                                    </label>
                                </div>
                                <p className="text-[13px] text-gray-500 leading-relaxed">Se utilizan para rastrear a los visitantes en las páginas web. La intención es mostrar anuncios que sean relevantes y atractivos para el usuario individual.</p>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5 border-t border-gray-100">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 rounded-full font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => {
                                    acceptCookies();
                                    setIsModalOpen(false);
                                }} 
                                className="bg-[#224483] text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-800 transition-colors shadow-md"
                            >
                                Guardar preferencias
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookieBanner;
