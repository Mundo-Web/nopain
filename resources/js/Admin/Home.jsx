import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import CreateReactScript from "../Utils/CreateReactScript";
import BaseAdminto from "../Components/Adminto/Base";
import Chart from "chart.js/auto";
import {
    Eye,
    Users,
    Calendar,
    Mail,
    TrendingUp,
    TrendingDown,
    Smartphone,
    Monitor,
    Tablet,
    Globe,
    RefreshCw,
    Filter,
    ArrowUpRight,
    Clock,
    FileText,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

const Home = ({ session, initialAnalytics }) => {
    const [period, setPeriod] = useState(initialAnalytics?.period || "30d");
    const [startDate, setStartDate] = useState(initialAnalytics?.startDate || "");
    const [endDate, setEndDate] = useState(initialAnalytics?.endDate || "");
    const [analytics, setAnalytics] = useState(initialAnalytics || null);
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState("");

    const timelineCanvasRef = useRef(null);
    const deviceCanvasRef = useRef(null);
    const timelineChartInstance = useRef(null);
    const deviceChartInstance = useRef(null);

    // Fetch analytics data from the server
    const fetchAnalytics = async (selectedPeriod, start = "", end = "") => {
        setLoading(true);
        setValidationError("");
        try {
            const response = await fetch("/api/admin/dashboard/analytics", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf_token"]')?.getAttribute("content") || "",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    period: selectedPeriod,
                    start_date: start,
                    end_date: end,
                }),
            });

            const res = await response.json();
            if (response.ok && res.status === 200) {
                setAnalytics(res.data);
                if (res.data?.startDate) setStartDate(res.data.startDate);
                if (res.data?.endDate) setEndDate(res.data.endDate);
            } else {
                setValidationError(res.message || "Error al obtener las analíticas.");
            }
        } catch (err) {
            setValidationError("Error de conexión al cargar las métricas.");
        } finally {
            setLoading(false);
        }
    };

    // Quick filter button click
    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
        if (newPeriod !== "custom") {
            fetchAnalytics(newPeriod);
        }
    };

    // Custom date range form submit
    const handleCustomFilterSubmit = (e) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            setValidationError("Debes seleccionar fecha de inicio y fecha de fin.");
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            setValidationError("La fecha de inicio no puede ser posterior a la fecha de fin.");
            return;
        }
        setPeriod("custom");
        fetchAnalytics("custom", startDate, endDate);
    };

    // Render Timeline Chart (Visits & Unique Visitors)
    useEffect(() => {
        if (!timelineCanvasRef.current || !analytics?.timeline) return;

        if (timelineChartInstance.current) {
            timelineChartInstance.current.destroy();
        }

        const labels = analytics.timeline.map((item) => item.label);
        const visitsData = analytics.timeline.map((item) => item.visits);
        const uniquesData = analytics.timeline.map((item) => item.uniques);

        const ctx = timelineCanvasRef.current.getContext("2d");

        // Primary Blue Gradient
        const gradientVisits = ctx.createLinearGradient(0, 0, 0, 300);
        gradientVisits.addColorStop(0, "rgba(34, 68, 131, 0.45)");
        gradientVisits.addColorStop(1, "rgba(34, 68, 131, 0.0)");

        // Teal Gradient
        const gradientUniques = ctx.createLinearGradient(0, 0, 0, 300);
        gradientUniques.addColorStop(0, "rgba(16, 185, 129, 0.35)");
        gradientUniques.addColorStop(1, "rgba(16, 185, 129, 0.0)");

        timelineChartInstance.current = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [
                    {
                        label: "Visitas Totales",
                        data: visitsData,
                        borderColor: "#224483",
                        backgroundColor: gradientVisits,
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: "#224483",
                        pointBorderColor: "#fff",
                        pointHoverRadius: 6,
                        pointRadius: labels.length > 31 ? 0 : 3,
                    },
                    {
                        label: "Visitantes Únicos",
                        data: uniquesData,
                        borderColor: "#10b981",
                        backgroundColor: gradientUniques,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: "#10b981",
                        pointBorderColor: "#fff",
                        pointHoverRadius: 6,
                        pointRadius: labels.length > 31 ? 0 : 3,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: "index",
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: "top",
                        labels: {
                            font: { family: "Poppins", size: 12 },
                            usePointStyle: true,
                            padding: 16,
                        },
                    },
                    tooltip: {
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        titleFont: { family: "Poppins", size: 13, weight: "bold" },
                        bodyFont: { family: "Poppins", size: 12 },
                        padding: 12,
                        cornerRadius: 8,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: "rgba(226, 232, 240, 0.7)",
                        },
                        ticks: {
                            font: { family: "Poppins", size: 11 },
                            precision: 0,
                        },
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            font: { family: "Poppins", size: 11 },
                            maxRotation: 45,
                            autoSkip: true,
                            maxTicksLimit: 14,
                        },
                    },
                },
            },
        });

        return () => {
            if (timelineChartInstance.current) {
                timelineChartInstance.current.destroy();
            }
        };
    }, [analytics?.timeline]);

    // Render Devices Doughnut Chart
    useEffect(() => {
        if (!deviceCanvasRef.current || !analytics?.devices) return;

        if (deviceChartInstance.current) {
            deviceChartInstance.current.destroy();
        }

        const dev = analytics.devices;
        const totalDev = (dev.mobile || 0) + (dev.desktop || 0) + (dev.tablet || 0);

        const ctx = deviceCanvasRef.current.getContext("2d");
        deviceChartInstance.current = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Móvil", "Escritorio", "Tablet"],
                datasets: [
                    {
                        data: [dev.mobile || 0, dev.desktop || 0, dev.tablet || 0],
                        backgroundColor: ["#3b82f6", "#224483", "#f59e0b"],
                        borderColor: "#ffffff",
                        borderWidth: 2,
                        hoverOffset: 6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "70%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            font: { family: "Poppins", size: 12 },
                            usePointStyle: true,
                            padding: 12,
                        },
                    },
                    tooltip: {
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        titleFont: { family: "Poppins", size: 13, weight: "bold" },
                        bodyFont: { family: "Poppins", size: 12 },
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: function (context) {
                                const val = context.parsed || 0;
                                const pct = totalDev > 0 ? ((val / totalDev) * 100).toFixed(1) : 0;
                                return ` ${context.label}: ${val.toLocaleString()} (${pct}%)`;
                            },
                        },
                    },
                },
            },
        });

        return () => {
            if (deviceChartInstance.current) {
                deviceChartInstance.current.destroy();
            }
        };
    }, [analytics?.devices]);

    const kpis = analytics?.kpis || {};
    const totalDevices =
        (analytics?.devices?.mobile || 0) +
        (analytics?.devices?.desktop || 0) +
        (analytics?.devices?.tablet || 0);

    return (
        <div className="py-2">
            {/* Header & Date Range Filter */}
            <div className="row align-items-center mb-4 g-3">
                <div className="col-12 col-xl-5">
                    <h2 className="mb-1 text-dark fw-bold" style={{ fontSize: "1.65rem" }}>
                        ¡Hola {session?.name || "Administrador"}! 👋
                    </h2>
                    <p className="text-muted mb-0 small">
                        Panel de Analíticas y Métricas de Tráfico del proyecto NoPain.
                    </p>
                </div>

                <div className="col-12 col-xl-7">
                    <div className="d-flex flex-wrap align-items-center justify-content-xl-end gap-2">
                        {/* Quick Period Buttons */}
                        <div className="btn-group shadow-sm bg-white rounded" role="group">
                            <button
                                type="button"
                                className={`btn btn-sm ${
                                    period === "today" ? "btn-primary" : "btn-outline-secondary border-0"
                                }`}
                                onClick={() => handlePeriodChange("today")}
                            >
                                Hoy
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${
                                    period === "7d" ? "btn-primary" : "btn-outline-secondary border-0"
                                }`}
                                onClick={() => handlePeriodChange("7d")}
                            >
                                7 Días
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${
                                    period === "30d" ? "btn-primary" : "btn-outline-secondary border-0"
                                }`}
                                onClick={() => handlePeriodChange("30d")}
                            >
                                30 Días
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${
                                    period === "month" ? "btn-primary" : "btn-outline-secondary border-0"
                                }`}
                                onClick={() => handlePeriodChange("month")}
                            >
                                Este Mes
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${
                                    period === "year" ? "btn-primary" : "btn-outline-secondary border-0"
                                }`}
                                onClick={() => handlePeriodChange("year")}
                            >
                                Este Año
                            </button>
                        </div>

                        {/* Custom Date Form */}
                        <form
                            onSubmit={handleCustomFilterSubmit}
                            className="d-flex align-items-center gap-1 bg-white p-1 rounded shadow-sm border"
                        >
                            <input
                                type="date"
                                className="form-control form-control-sm border-0 py-0 px-1 text-muted"
                                style={{ width: "128px" }}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                title="Fecha inicial"
                            />
                            <span className="text-muted small">-</span>
                            <input
                                type="date"
                                className="form-control form-control-sm border-0 py-0 px-1 text-muted"
                                style={{ width: "128px" }}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                title="Fecha final"
                            />
                            <button
                                type="submit"
                                className="btn btn-sm btn-primary px-2"
                                title="Aplicar filtro personalizado"
                                disabled={loading}
                            >
                                <Filter size={14} />
                            </button>
                        </form>

                        {/* Refresh Button */}
                        <button
                            type="button"
                            className="btn btn-sm btn-refresh-dashboard d-flex align-items-center gap-1 shadow-sm"
                            onClick={() => fetchAnalytics(period, startDate, endDate)}
                            disabled={loading}
                            title="Recargar datos"
                        >
                            <RefreshCw size={14} className={loading ? "spin-animation" : ""} />
                            <span className="d-none d-sm-inline">Actualizar</span>
                        </button>
                    </div>

                    {validationError && (
                        <div className="alert alert-danger py-1 px-2 mt-2 mb-0 small text-end border-0 shadow-sm">
                            <AlertCircle size={14} className="me-1 d-inline" />
                            {validationError}
                        </div>
                    )}
                </div>
            </div>

            {/* Row of KPI Cards */}
            <div className="row g-3 mb-4">
                {/* Total Visits Card */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 position-relative overflow-hidden">
                        <div
                            className="position-absolute top-0 start-0 h-100"
                            style={{ width: "4px", backgroundColor: "#224483" }}
                        ></div>
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="text-muted small fw-medium text-uppercase">Visitas Totales</span>
                                <div
                                    className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                                    style={{ backgroundColor: "rgba(34, 68, 131, 0.1)", color: "#224483" }}
                                >
                                    <Eye size={20} />
                                </div>
                            </div>
                            <h3 className="fw-bold mb-2 text-dark">
                                {(kpis.totalVisits || 0).toLocaleString()}
                            </h3>
                            <div className="d-flex align-items-center small">
                                {kpis.visitsGrowth >= 0 ? (
                                    <span className="badge bg-success-subtle text-success me-1 d-flex align-items-center gap-1">
                                        <TrendingUp size={12} />+{kpis.visitsGrowth}%
                                    </span>
                                ) : (
                                    <span className="badge bg-danger-subtle text-danger me-1 d-flex align-items-center gap-1">
                                        <TrendingDown size={12} />
                                        {kpis.visitsGrowth}%
                                    </span>
                                )}
                                <span className="text-muted ms-1" style={{ fontSize: "11px" }}>
                                    vs periodo anterior
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Unique Visitors Card */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 position-relative overflow-hidden">
                        <div
                            className="position-absolute top-0 start-0 h-100"
                            style={{ width: "4px", backgroundColor: "#10b981" }}
                        ></div>
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="text-muted small fw-medium text-uppercase">Visitantes Únicos</span>
                                <div
                                    className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                                    style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}
                                >
                                    <Users size={20} />
                                </div>
                            </div>
                            <h3 className="fw-bold mb-2 text-dark">
                                {(kpis.uniqueVisitors || 0).toLocaleString()}
                            </h3>
                            <div className="d-flex align-items-center small">
                                {kpis.uniquesGrowth >= 0 ? (
                                    <span className="badge bg-success-subtle text-success me-1 d-flex align-items-center gap-1">
                                        <TrendingUp size={12} />+{kpis.uniquesGrowth}%
                                    </span>
                                ) : (
                                    <span className="badge bg-danger-subtle text-danger me-1 d-flex align-items-center gap-1">
                                        <TrendingDown size={12} />
                                        {kpis.uniquesGrowth}%
                                    </span>
                                )}
                                <span className="text-muted ms-1" style={{ fontSize: "11px" }}>
                                    audiencia real
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments (Citas) Card */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 position-relative overflow-hidden">
                        <div
                            className="position-absolute top-0 start-0 h-100"
                            style={{ width: "4px", backgroundColor: "#f59e0b" }}
                        ></div>
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="text-muted small fw-medium text-uppercase">Citas Médicas</span>
                                <div
                                    className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                                    style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}
                                >
                                    <Calendar size={20} />
                                </div>
                            </div>
                            <h3 className="fw-bold mb-2 text-dark">
                                {(kpis.appointmentsCount || 0).toLocaleString()}
                            </h3>
                            <div className="d-flex align-items-center justify-content-between small">
                                <span className="text-muted" style={{ fontSize: "12px" }}>
                                    Pendientes:{" "}
                                    <strong className="text-warning">
                                        {kpis.pendingAppointments || 0}
                                    </strong>
                                </span>
                                <a
                                    href="/admin/appointments"
                                    className="text-primary text-decoration-none fw-semibold d-flex align-items-center gap-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    Ver citas <ArrowUpRight size={13} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages / Leads Card */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 position-relative overflow-hidden">
                        <div
                            className="position-absolute top-0 start-0 h-100"
                            style={{ width: "4px", backgroundColor: "#8b5cf6" }}
                        ></div>
                        <div className="card-body p-3">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="text-muted small fw-medium text-uppercase">Contactos / Leads</span>
                                <div
                                    className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                                    style={{ backgroundColor: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}
                                >
                                    <Mail size={20} />
                                </div>
                            </div>
                            <h3 className="fw-bold mb-2 text-dark">
                                {(kpis.messagesCount || 0).toLocaleString()}
                            </h3>
                            <div className="d-flex align-items-center justify-content-between small">
                                <span className="text-muted" style={{ fontSize: "12px" }}>
                                    No leídos:{" "}
                                    <strong className="text-danger">{kpis.unreadMessages || 0}</strong>
                                </span>
                                <a
                                    href="/admin/messages"
                                    className="text-primary text-decoration-none fw-semibold d-flex align-items-center gap-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    Ver mensajes <ArrowUpRight size={13} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="row g-3 mb-4">
                {/* Main Timeline Chart */}
                <div className="col-12 col-xl-8">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                                <div>
                                    <h5 className="fw-bold mb-1 text-dark">Evolución de Tráfico y Visitas</h5>
                                    <p className="text-muted small mb-0">
                                        Monitoreo de visitas acumuladas y visitantes únicos en el tiempo.
                                    </p>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <span className="badge bg-light text-dark border px-2 py-1 small">
                                        Tasa de conversión:{" "}
                                        <strong className="text-primary">{kpis.conversionRate || 0}%</strong>
                                    </span>
                                </div>
                            </div>
                            <div style={{ height: "320px", position: "relative" }}>
                                <canvas ref={timelineCanvasRef} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Device Distribution Chart */}
                <div className="col-12 col-xl-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4 d-flex flex-column justify-content-between">
                            <div>
                                <h5 className="fw-bold mb-1 text-dark">Dispositivos de Entrada</h5>
                                <p className="text-muted small mb-3">
                                    Porcentaje de acceso según plataforma del usuario.
                                </p>
                                <div style={{ height: "200px", position: "relative" }}>
                                    <canvas ref={deviceCanvasRef} />
                                </div>
                            </div>

                            <div className="border-top pt-3 mt-3">
                                <div className="row text-center g-2">
                                    <div className="col-4">
                                        <div className="d-flex align-items-center justify-content-center gap-1 text-muted small mb-1">
                                            <Smartphone size={14} className="text-primary" /> Móvil
                                        </div>
                                        <span className="fw-bold text-dark">
                                            {totalDevices > 0
                                                ? Math.round(
                                                      ((analytics?.devices?.mobile || 0) / totalDevices) *
                                                          100
                                                  )
                                                : 0}
                                            %
                                        </span>
                                    </div>
                                    <div className="col-4">
                                        <div className="d-flex align-items-center justify-content-center gap-1 text-muted small mb-1">
                                            <Monitor size={14} style={{ color: "#224483" }} /> PC
                                        </div>
                                        <span className="fw-bold text-dark">
                                            {totalDevices > 0
                                                ? Math.round(
                                                      ((analytics?.devices?.desktop || 0) / totalDevices) *
                                                          100
                                                  )
                                                : 0}
                                            %
                                        </span>
                                    </div>
                                    <div className="col-4">
                                        <div className="d-flex align-items-center justify-content-center gap-1 text-muted small mb-1">
                                            <Tablet size={14} className="text-warning" /> Tablet
                                        </div>
                                        <span className="fw-bold text-dark">
                                            {totalDevices > 0
                                                ? Math.round(
                                                      ((analytics?.devices?.tablet || 0) / totalDevices) *
                                                          100
                                                  )
                                                : 0}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Analytics Row: Top Pages & Browsers */}
            <div className="row g-3 mb-4">
                {/* Top Pages */}
                <div className="col-12 col-xl-7">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <h5 className="fw-bold mb-1 text-dark">Páginas Más Visitadas</h5>
                                    <p className="text-muted small mb-0">
                                        Secciones con mayor concurrencia e interés de los usuarios.
                                    </p>
                                </div>
                                <Globe size={18} className="text-muted" />
                            </div>

                            <div className="table-responsive">
                                <table className="table table-borderless table-hover align-middle mb-0">
                                    <thead className="table-light text-muted small">
                                        <tr>
                                            <th>PÁGINA / RUTA</th>
                                            <th className="text-center">VISITAS</th>
                                            <th className="text-end" style={{ width: "160px" }}>
                                                POPULARIDAD
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics?.topPages && analytics.topPages.length > 0 ? (
                                            analytics.topPages.map((page, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <div className="fw-semibold text-dark small">
                                                            {page.title}
                                                        </div>
                                                        <div
                                                            className="text-muted"
                                                            style={{ fontSize: "11px" }}
                                                        >
                                                            {page.path}
                                                        </div>
                                                    </td>
                                                    <td className="text-center fw-bold text-dark small">
                                                        {page.visits.toLocaleString()}
                                                    </td>
                                                    <td className="text-end">
                                                        <div className="d-flex align-items-center justify-content-end gap-2">
                                                            <div
                                                                className="progress flex-grow-1"
                                                                style={{ height: "6px" }}
                                                            >
                                                                <div
                                                                    className="progress-bar rounded"
                                                                    style={{
                                                                        width: `${page.percentage}%`,
                                                                        backgroundColor:
                                                                            idx === 0
                                                                                ? "#224483"
                                                                                : idx === 1
                                                                                ? "#3b82f6"
                                                                                : "#94a3b8",
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span
                                                                className="text-muted fw-semibold"
                                                                style={{ fontSize: "11px", minWidth: "35px" }}
                                                            >
                                                                {page.percentage}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4 text-muted small">
                                                    No hay visitas registradas para este periodo.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Browsers & System Health */}
                <div className="col-12 col-xl-5">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4 d-flex flex-column justify-content-between">
                            <div>
                                <h5 className="fw-bold mb-1 text-dark">Navegadores Principales</h5>
                                <p className="text-muted small mb-3">
                                    Software preferido por tus visitantes.
                                </p>

                                <div className="d-flex flex-column gap-3 mb-4">
                                    {analytics?.browsers && analytics.browsers.length > 0 ? (
                                        analytics.browsers.map((b, idx) => {
                                            const totalVisits = kpis.totalVisits || 1;
                                            const pct = Math.round((b.total / totalVisits) * 100);
                                            return (
                                                <div key={idx}>
                                                    <div className="d-flex justify-content-between align-items-center mb-1 small">
                                                        <span className="fw-semibold text-dark">
                                                            {b.browser || "Otro"}
                                                        </span>
                                                        <span className="text-muted">
                                                            {b.total.toLocaleString()} ({pct}%)
                                                        </span>
                                                    </div>
                                                    <div className="progress" style={{ height: "6px" }}>
                                                        <div
                                                            className="progress-bar bg-primary"
                                                            style={{ width: `${pct}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-muted small">Sin datos de navegadores.</p>
                                    )}
                                </div>
                            </div>

                            {/* Compliance & Quick Health Badges */}
                            <div className="bg-light p-3 rounded-3">
                                <h6 className="fw-bold mb-2 small text-dark d-flex align-items-center gap-1">
                                    <ShieldCheck size={16} className="text-success" /> Cumplimiento y Legalidad
                                </h6>
                                <p className="text-muted mb-2" style={{ fontSize: "11px" }}>
                                    El banner de Cookies está enlazado con la Política de Privacidad y Google Tag
                                    Manager bajo consentimiento activo.
                                </p>
                                <div className="d-flex flex-wrap gap-2">
                                    <a
                                        href="/admin/generals"
                                        className="btn btn-sm btn-outline-primary py-1 px-2"
                                        style={{ fontSize: "11px" }}
                                    >
                                        Editar Políticas de Cookies
                                    </a>
                                    <a
                                        href="/admin/complaints"
                                        className="btn btn-sm btn-outline-secondary py-1 px-2"
                                        style={{ fontSize: "11px" }}
                                    >
                                        Reclamos ({kpis.complaintsCount || 0})
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Leads & Appointments Row */}
            <div className="row g-3">
                {/* Recent Appointments */}
                <div className="col-12 col-xl-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <div
                                        className="p-2 rounded-3"
                                        style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}
                                    >
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-0 text-dark">Citas Médicas Recientes</h5>
                                        <small className="text-muted">Últimas solicitudes agendadas</small>
                                    </div>
                                </div>
                                <a
                                    href="/admin/appointments"
                                    className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                    style={{ fontSize: "12px" }}
                                >
                                    Ver Todas
                                </a>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light text-muted small">
                                        <tr>
                                            <th>PACIENTE</th>
                                            <th>CONTACTO</th>
                                            <th>FECHA</th>
                                            <th>ESTADO</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {analytics?.recentAppointments &&
                                        analytics.recentAppointments.length > 0 ? (
                                            analytics.recentAppointments.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <div className="fw-semibold text-dark">
                                                            {item.name} {item.lastname_father || ""}
                                                        </div>
                                                        <small className="text-muted">{item.document || "Sin DNI"}</small>
                                                    </td>
                                                    <td>
                                                        <div>{item.number || "Sin teléfono"}</div>
                                                        <small className="text-muted">{item.email}</small>
                                                    </td>
                                                    <td className="text-muted">
                                                        {new Date(item.created_at).toLocaleDateString("es-PE", {
                                                            day: "2-digit",
                                                            month: "short",
                                                        })}
                                                    </td>
                                                    <td>
                                                        {item.seen ? (
                                                            <span className="badge bg-success-subtle text-success">
                                                                Revisada
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-warning-subtle text-warning">
                                                                Pendiente
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 text-muted">
                                                    No hay citas registradas recientemente.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Messages */}
                <div className="col-12 col-xl-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <div
                                        className="p-2 rounded-3"
                                        style={{ backgroundColor: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}
                                    >
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-0 text-dark">Consultas de Contacto</h5>
                                        <small className="text-muted">Últimos mensajes recibidos</small>
                                    </div>
                                </div>
                                <a
                                    href="/admin/messages"
                                    className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                    style={{ fontSize: "12px" }}
                                >
                                    Ver Todos
                                </a>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light text-muted small">
                                        <tr>
                                            <th>REMITENTE</th>
                                            <th>ASUNTO / CONSULTA</th>
                                            <th>FECHA</th>
                                            <th>ESTADO</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {analytics?.recentMessages && analytics.recentMessages.length > 0 ? (
                                            analytics.recentMessages.map((msg, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <div className="fw-semibold text-dark">{msg.name}</div>
                                                        <small className="text-muted">{msg.email}</small>
                                                    </td>
                                                    <td>
                                                        <div
                                                            className="text-dark text-truncate"
                                                            style={{ maxWidth: "200px" }}
                                                        >
                                                            {msg.subject || msg.description || "Consulta general"}
                                                        </div>
                                                    </td>
                                                    <td className="text-muted">
                                                        {new Date(msg.created_at).toLocaleDateString("es-PE", {
                                                            day: "2-digit",
                                                            month: "short",
                                                        })}
                                                    </td>
                                                    <td>
                                                        {msg.seen ? (
                                                            <span className="badge bg-light text-muted border">
                                                                Leído
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-danger-subtle text-danger">
                                                                Nuevo
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 text-muted">
                                                    No hay mensajes de contacto recientes.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style>{`
                .spin-animation {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .btn-refresh-dashboard {
                    background-color: #ffffff !important;
                    color: #224483 !important;
                    border: 1px solid #224483 !important;
                    transition: all 0.2s ease-in-out;
                }
                .btn-refresh-dashboard:hover,
                .btn-refresh-dashboard:focus,
                .btn-refresh-dashboard:active {
                    background-color: #224483 !important;
                    color: #ffffff !important;
                    border-color: #224483 !important;
                }
                .btn-refresh-dashboard:hover svg,
                .btn-refresh-dashboard:hover span {
                    color: #ffffff !important;
                }
            `}</style>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Dashboard de Analíticas">
            <Home {...properties} />
        </BaseAdminto>
    );
});

export default Home;
