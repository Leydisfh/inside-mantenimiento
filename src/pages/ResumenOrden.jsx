import "../styles.css/resumenOrden.css"
function ResumenOrden({
  orden,
  equipos,
  volver,
  verEquipo,
  generarInforme,
  generarInformeCerrado,
}) {
  const ordenCerrada =
  orden?.estado === "Cerrada";
  {ordenCerrada && (
  <div className="closed-order-notice">
    Orden cerrada
  </div>
)}
  const total = equipos.length;

  const completados = equipos.filter(
    (equipo) => equipo.estado === "Completado"
  ).length;

  const pendientes = equipos.filter(
    (equipo) => equipo.estado === "Pendiente"
  ).length;

  const enProceso = equipos.filter(
    (equipo) => equipo.estado === "En proceso"
  ).length;

  const obtenerEstadoFinal = (equipo) =>
    equipo.diagnostico?.estadoFinal || "";

  const operativos = equipos.filter(
    (equipo) =>
      equipo.estado === "Completado" &&
      obtenerEstadoFinal(equipo) === "Operativo"
  );

  const conObservaciones = equipos.filter(
    (equipo) =>
      equipo.estado === "Completado" &&
      obtenerEstadoFinal(equipo) ===
        "Operativo con observaciones"
  );

  const requierenReparacion = equipos.filter(
    (equipo) =>
      equipo.estado === "Completado" &&
      obtenerEstadoFinal(equipo) ===
        "Requiere reparación"
  );
  const ordenCompleta =
  total > 0 &&
  completados === total;

  const fueraServicio = equipos.filter(
    (equipo) =>
      equipo.estado === "Completado" &&
      obtenerEstadoFinal(equipo) ===
        "Fuera de servicio"
  );

  const equiposAtencion = [
    ...fueraServicio,
    ...requierenReparacion,
    ...conObservaciones,
  ];

  const porcentaje =
    total === 0
      ? 0
      : Math.round((completados / total) * 100);

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
            <strong>Revisión de la orden</strong>
            <span>{orden.numero}</span>
          </div>
        </header>

        {/* INFORMACIÓN DE LA ORDEN */}

        <section className="review-order-info">
          <h2>{orden.cliente}</h2>

          <p>
            {orden.ubicacion}
          </p>

          <div className="review-progress-header">
            <span>
              {completados} de {total} equipos
            </span>

            <strong>{porcentaje}%</strong>
          </div>

          <div className="review-progress-bar">
            <div
              className="review-progress-value"
              style={{ width: `${porcentaje}%` }}
            />
          </div>

          {(pendientes > 0 || enProceso > 0) && (
            <p className="review-pending">
              Pendientes: {pendientes} · En proceso:{" "}
              {enProceso}
            </p>
          )}
        </section>

        {/* RESUMEN */}

        <section className="review-summary">
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
        </section>

        {/* EQUIPOS QUE REQUIEREN ATENCIÓN */}

        <section className="review-section">
          <div className="review-section-title">
            <div>
              <h3>Atención requerida</h3>

              <p>
                Equipos con fallas, observaciones o
                fuera de servicio.
              </p>
            </div>

            <strong>
              {equiposAtencion.length}
            </strong>
          </div>

          {equiposAtencion.length === 0 ? (
            <div className="review-empty">
              No hay equipos que requieran atención.
            </div>
          ) : (
            equiposAtencion.map((equipo) => {
              const diagnostico =
                equipo.diagnostico || {};

              return (
                <article
                  className="review-alert-card"
                  key={equipo.id}
                >
                  <div className="review-alert-header">
                    <div>
                      <strong>
                        {equipo.modelo}
                      </strong>

                      <span>
                        SN:{" "}
                        {equipo.serial ||
                          "No registrado"}
                      </span>
                    </div>

                    <span
                      className={`review-status ${
                        diagnostico.estadoFinal ===
                        "Fuera de servicio"
                          ? "review-status-critical"
                          : diagnostico.estadoFinal ===
                            "Requiere reparación"
                          ? "review-status-repair"
                          : "review-status-warning"
                      }`}
                    >
                      {diagnostico.estadoFinal}
                    </span>
                  </div>

                  {diagnostico.fallaDetectada && (
                    <div className="review-detail">
                      <span>Falla detectada</span>

                      <p>
                        {diagnostico.fallaDetectada}
                      </p>
                    </div>
                  )}

                  {diagnostico.repuesto && (
                    <div className="review-detail">
                      <span>
                        Repuesto necesario
                      </span>

                      <p>
                        {diagnostico.repuesto}
                      </p>
                    </div>
                  )}

                  {diagnostico.recomendacion && (
                    <div className="review-detail">
                      <span>Recomendación</span>

                      <p>
                        {diagnostico.recomendacion}
                      </p>
                    </div>
                  )}

                  {diagnostico.prioridad && (
                    <div className="review-priority">
                      Prioridad:{" "}
                      <strong>
                        {diagnostico.prioridad}
                      </strong>
                    </div>
                  )}

                  <button
                    className="review-detail-button"
                    onClick={() =>
                      verEquipo(equipo)
                    }
                  >
                    Ver resultado completo
                  </button>
                </article>
              );
            })
          )}
        </section>

        {/* EQUIPOS OPERATIVOS */}

        <section className="review-section">
          <div className="review-section-title">
            <div>
              <h3>Equipos operativos</h3>

              <p>
                Equipos que finalizaron el
                mantenimiento sin incidencias.
              </p>
            </div>

            <strong>{operativos.length}</strong>
          </div>

          {operativos.map((equipo) => (
            <div
              className="review-operational-row"
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

              <span className="review-operational-status">
                Operativo
              </span>
            </div>
          ))}

          {operativos.length === 0 && (
            <div className="review-empty">
              No hay equipos operativos registrados.
            </div>
          )}
        </section>
{ordenCompleta && !ordenCerrada && (
  <button
    type="button"
    className="new-order-button"
    onClick={generarInforme}
  >
    Generar informe y cerrar orden
  </button>
)}
{ordenCerrada && (
  <button
    type="button"
    className="new-order-button"
    onClick={
      generarInformeCerrado
    }
  >
    Generar informe PDF
  </button>
)}
{!ordenCompleta && (
  <div className="report-disabled-message">
    El informe estará disponible cuando todos
    los equipos hayan sido completados.
  </div>
)}
      </main>
    </div>
  );
}

export default ResumenOrden;