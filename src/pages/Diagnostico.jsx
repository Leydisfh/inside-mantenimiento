import { useState } from "react";
import "../styles.css/diagnostico.css"
function Diagnostico({
  equipo,
  nombreTecnico,
  volverChecklist,
  guardarDiagnostico,
}) {
  const [estadoFinal, setEstadoFinal] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [fallaDetectada, setFallaDetectada] = useState("");
  const [repuesto, setRepuesto] = useState("");
  const [recomendacion, setRecomendacion] = useState("");
  const [prioridad, setPrioridad] = useState("Baja");

  const finalizar = () => {
    if (!estadoFinal) {
      alert("Selecciona el estado final del equipo.");
      return;
    }

    if (!diagnostico.trim()) {
      alert("Escribe el diagnóstico del equipo.");
      return;
    }

    const datos = {
      estadoFinal,
      diagnostico,
      fallaDetectada,
      repuesto,
      recomendacion,
      prioridad,
      tecnico: nombreTecnico || "Administrador",
    };

    guardarDiagnostico(datos);
  };

  return (
    <div className="app">
      <main className="mobile-container diagnosis-page">

        <header className="equipment-header">
          <button
            className="back-button"
            onClick={volverChecklist}
          >
            ←
          </button>

          <div>
            <strong>Diagnóstico final</strong>
            <span>Resultado del mantenimiento</span>
          </div>
        </header>

        <section className="checklist-equipment-card">
          <div>
            <span className="checklist-label">
              Equipo evaluado
            </span>

            <h2>{equipo.modelo}</h2>

            <p>SN: {equipo.serial}</p>
          </div>

          <span className="equipment-status working">
            En proceso
          </span>
        </section>

        <div className="checklist-technician">
          Técnico:{" "}
          <strong>
            {nombreTecnico || "Administrador"}
          </strong>
        </div>

        <section className="diagnosis-section">
          <h3>Estado final</h3>

          <div className="status-grid">

            <button
              className={
                estadoFinal === "Operativo"
                  ? "status-choice operational selected"
                  : "status-choice operational"
              }
              onClick={() =>
                setEstadoFinal("Operativo")
              }
            >
              ✓
              <span>Operativo</span>
            </button>

            <button
              className={
                estadoFinal === "Operativo con observaciones"
                  ? "status-choice observations selected"
                  : "status-choice observations"
              }
              onClick={() =>
                setEstadoFinal(
                  "Operativo con observaciones"
                )
              }
            >
              !
              <span>
                Operativo con observaciones
              </span>
            </button>

            <button
              className={
                estadoFinal === "Requiere reparación"
                  ? "status-choice repair selected"
                  : "status-choice repair"
              }
              onClick={() =>
                setEstadoFinal(
                  "Requiere reparación"
                )
              }
            >
              🔧
              <span>Requiere reparación</span>
            </button>

            <button
              className={
                estadoFinal === "Fuera de servicio"
                  ? "status-choice out selected"
                  : "status-choice out"
              }
              onClick={() =>
                setEstadoFinal(
                  "Fuera de servicio"
                )
              }
            >
              ×
              <span>Fuera de servicio</span>
            </button>

          </div>
        </section>

        <section className="diagnosis-section">

          <div className="diagnosis-field">
            <label>Diagnóstico *</label>

            <textarea
              placeholder="Describe el estado general del equipo..."
              value={diagnostico}
              onChange={(e) =>
                setDiagnostico(e.target.value)
              }
            />
          </div>

          <div className="diagnosis-field">
            <label>Falla detectada</label>

            <textarea
              placeholder="Describe la falla encontrada, si aplica."
              value={fallaDetectada}
              onChange={(e) =>
                setFallaDetectada(e.target.value)
              }
            />
          </div>

          <div className="diagnosis-field">
            <label>Repuesto necesario</label>

            <input
              type="text"
              placeholder="Ej. Batería, pantalla, gatillo..."
              value={repuesto}
              onChange={(e) =>
                setRepuesto(e.target.value)
              }
            />
          </div>

          <div className="diagnosis-field">
            <label>Recomendación técnica</label>

            <textarea
              placeholder="Indica las acciones recomendadas."
              value={recomendacion}
              onChange={(e) =>
                setRecomendacion(e.target.value)
              }
            />
          </div>

          <div className="diagnosis-field">
            <label>Prioridad</label>

            <select
              value={prioridad}
              onChange={(e) =>
                setPrioridad(e.target.value)
              }
            >
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
              <option>Crítica</option>
            </select>
          </div>

        </section>

        <button
          className="continue-button"
          onClick={finalizar}
        >
          Guardar resultado
        </button>

      </main>
    </div>
  );
}

export default Diagnostico;