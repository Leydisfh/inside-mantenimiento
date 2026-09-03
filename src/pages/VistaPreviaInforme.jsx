import "../styles.css/vistaPreviaInforme.css"
import { useState } from "react";


import {
  generarInformePDF,
} from "../lib/generarInformePDF";
function VistaPreviaInforme({
  orden,
  equipos,
  volver,
  
}) {
  const completados = equipos.filter(
    (equipo) => equipo.estado === "Completado"
  );

  const operativos = completados.filter(
    (equipo) =>
      equipo.diagnostico?.estadoFinal === "Operativo"
  );

  const conObservaciones = completados.filter(
    (equipo) =>
      equipo.diagnostico?.estadoFinal ===
      "Operativo con observaciones"
  );

  const requierenReparacion = completados.filter(
    (equipo) =>
      equipo.diagnostico?.estadoFinal ===
      "Requiere reparación"
  );

  const fueraServicio = completados.filter(
    (equipo) =>
      equipo.diagnostico?.estadoFinal ===
      "Fuera de servicio"
  );
  const [generandoPDF, setGenerandoPDF] =
  useState(false);

const descargarPDF = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    setGenerandoPDF(true);

    console.log("INICIANDO GENERACION PDF");

    await generarInformePDF(
      orden,
      equipos
    );

    console.log("PDF GENERADO");
  } catch (error) {
    console.error(
      "ERROR GENERANDO PDF:",
      error
    );

    alert(
      "No fue posible generar el informe PDF."
    );
  } finally {
    setGenerandoPDF(false);
  }
};

  const equiposAtencion = [
    ...fueraServicio,
    ...requierenReparacion,
    ...conObservaciones,
  ];

  return (
    <div className="app">
      <main className="mobile-container">

        <header className="equipment-header">
          <button
            className="back-button"
            onClick={volver}
          >
            ←
          </button>

          <div>
            <strong>Vista previa del informe</strong>
            <span>{orden.numero}</span>
          </div>
        </header>

        {/* DATOS GENERALES */}

        <section className="report-preview-section">
          <h2>Informe de mantenimiento</h2>

          <div className="detail-row">
            <span>Cliente</span>
            <strong>{orden.cliente}</strong>
          </div>

          <div className="detail-row">
            <span>Ubicación</span>
            <strong>{orden.ubicacion}</strong>
          </div>

          <div className="detail-row">
            <span>Fecha</span>
            <strong>{orden.fecha}</strong>
          </div>

          <div className="detail-row">
            <span>Orden</span>
            <strong>{orden.numero}</strong>
          </div>

          {orden.observaciones && (
            <div className="report-observations">
              <span>Observaciones de la orden</span>
              <p>{orden.observaciones}</p>
            </div>
          )}
        </section>

        {/* RESUMEN */}

        <section className="report-preview-section">
          <h3>Resumen del servicio</h3>

          <div className="review-summary">
            <div className="review-summary-card">
              <span>Total equipos</span>
              <strong>{equipos.length}</strong>
            </div>

            <div className="review-summary-card">
              <span>Operativos</span>
              <strong>{operativos.length}</strong>
            </div>

            <div className="review-summary-card">
              <span>Con observaciones</span>
              <strong>{conObservaciones.length}</strong>
            </div>

            <div className="review-summary-card">
              <span>Reparación</span>
              <strong>{requierenReparacion.length}</strong>
            </div>

            <div className="review-summary-card">
              <span>Fuera de servicio</span>
              <strong>{fueraServicio.length}</strong>
            </div>
          </div>
        </section>

        {/* ATENCIÓN REQUERIDA */}

        <section className="report-preview-section">
          <h3>Equipos que requieren atención</h3>

          {equiposAtencion.length === 0 ? (
            <p className="empty-result">
              No se registraron equipos con incidencias.
            </p>
          ) : (
            equiposAtencion.map((equipo) => {
              const diagnostico =
                equipo.diagnostico || {};

              return (
                <article
                  className="report-equipment-card"
                  key={equipo.id}
                >
                  <div className="report-equipment-header">
                    <div>
                      <strong>{equipo.modelo}</strong>
                      <span>
                        SN:{" "}
                        {equipo.serial ||
                          "No registrado"}
                      </span>
                    </div>

                    <span className="report-equipment-status">
                      {diagnostico.estadoFinal}
                    </span>
                  </div>

                  {diagnostico.fallaDetectada && (
                    <div className="report-field">
                      <span>Falla detectada</span>
                      <p>
                        {diagnostico.fallaDetectada}
                      </p>
                    </div>
                  )}

                  {diagnostico.repuesto && (
                    <div className="report-field">
                      <span>Repuesto requerido</span>
                      <p>{diagnostico.repuesto}</p>
                    </div>
                  )}

                  {diagnostico.recomendacion && (
                    <div className="report-field">
                      <span>Recomendación</span>
                      <p>
                        {diagnostico.recomendacion}
                      </p>
                    </div>
                  )}

                  <div className="detail-row">
                    <span>Prioridad</span>
                    <strong>
                      {diagnostico.prioridad ||
                        "No definida"}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Técnico</span>
                    <strong>
                      {equipo.tecnico ||
                        "No registrado"}
                    </strong>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* OPERATIVOS */}

        <section className="report-preview-section">
          <h3>Equipos operativos</h3>

          {operativos.length > 0 ? (
            operativos.map((equipo) => (
              <div
                className="report-operational-row"
                key={equipo.id}
              >
                <div>
                  <strong>{equipo.modelo}</strong>
                  <span>
                    SN:{" "}
                    {equipo.serial ||
                      "No registrado"}
                  </span>
                </div>

                <span>Operativo</span>
              </div>
            ))
          ) : (
            <p className="empty-result">
              No hay equipos clasificados como
              operativos.
            </p>
          )}
        </section>

      <div className="report-next-step">
  <strong>
    Informe listo para generar
  </strong>

  <p>
    Revisa la información antes de generar
    el documento definitivo.
  </p>
</div>

<button
  type="button"
  className="generate-report-button"
  onClick={descargarPDF}
  disabled={generandoPDF}
>
  {generandoPDF
    ? "Generando PDF..."
    : "Generar PDF"}
</button>

      </main>
    </div>
  );
}

export default VistaPreviaInforme;