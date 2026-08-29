function DetalleEquipo({
  equipo,
  orden,
  volver,
}) {
  const checklist = equipo.checklist;
  const diagnostico = equipo.diagnostico;

  const resultados =
    checklist?.resultados || {};

  const observaciones =
    checklist?.observaciones || {};

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
            <strong>Resultado del equipo</strong>

            <span>
              {orden?.numero}
            </span>
          </div>
        </header>

        <section className="checklist-equipment-card">
          <div>
            <span className="checklist-label">
              Equipo
            </span>

            <h2>{equipo.modelo}</h2>

            <div className="equipment-meta">
              <span className="equipment-category">
                {equipo.categoria}
              </span>

              {equipo.codigoInterno && (
                <span className="equipment-code">
                  {equipo.codigoInterno}
                </span>
              )}
            </div>

            <p>
              SN: {equipo.serial || "No registrado"}
            </p>
          </div>

          <span className="equipment-status completed">
            Completado
          </span>
        </section>

        <section className="diagnosis-section">
          <h3>Información del servicio</h3>

          <div className="detail-row">
            <span>Técnico</span>
            <strong>
              {equipo.tecnico || "No registrado"}
            </strong>
          </div>

          <div className="detail-row">
            <span>Fecha de finalización</span>

            <strong>
              {equipo.fechaFinalizacion
                ? new Date(
                    equipo.fechaFinalizacion
                  ).toLocaleString()
                : "No registrada"}
            </strong>
          </div>

          {equipo.origen && (
            <div className="detail-row">
              <span>Origen</span>
              <strong>{equipo.origen}</strong>
            </div>
          )}
        </section>

        <section className="diagnosis-section">
          <h3>Diagnóstico final</h3>

          {diagnostico ? (
            <>
              <div className="detail-block">
                <span>Estado final</span>
                <strong>
                  {diagnostico.estadoFinal}
                </strong>
              </div>

              <div className="detail-block">
                <span>Diagnóstico</span>
                <p>
                  {diagnostico.diagnostico ||
                    "Sin información"}
                </p>
              </div>

              {diagnostico.fallaDetectada && (
                <div className="detail-block">
                  <span>Falla detectada</span>
                  <p>
                    {diagnostico.fallaDetectada}
                  </p>
                </div>
              )}

              {diagnostico.repuesto && (
                <div className="detail-block">
                  <span>Repuesto necesario</span>
                  <p>{diagnostico.repuesto}</p>
                </div>
              )}

              {diagnostico.recomendacion && (
                <div className="detail-block">
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
            </>
          ) : (
            <p className="empty-result">
              Este equipo no tiene un diagnóstico
              almacenado.
            </p>
          )}
        </section>

        <section className="diagnosis-section">
          <h3>Checklist realizado</h3>

          {Object.keys(resultados).length > 0 ? (
            Object.entries(resultados).map(
              ([prueba, resultado]) => (
                <div
                  className="result-row"
                  key={prueba}
                >
                  <div>
                    <strong>{prueba}</strong>

                    {observaciones[prueba] && (
                      <p>
                        {observaciones[prueba]}
                      </p>
                    )}
                  </div>

                  <span
                    className={`result-badge ${
                      resultado === "OK"
                        ? "result-ok"
                        : resultado === "Falla"
                        ? "result-fail"
                        : "result-neutral"
                    }`}
                  >
                    {resultado}
                  </span>
                </div>
              )
            )
          ) : (
            <p className="empty-result">
              No hay checklist almacenado para este
              equipo.
            </p>
          )}
        </section>

      </main>
    </div>
  );
}

export default DetalleEquipo;