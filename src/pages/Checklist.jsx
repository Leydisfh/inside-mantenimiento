import "../styles.css/checklist.css"
import { useState } from "react";
import { obtenerChecklist } from "../data/checklists";


function Checklist({
   equipo,
  nombreTecnico,
  volverEquipos,
  continuarDiagnostico,
  guardarSerialEquipo,
}) {
 
const pruebas = obtenerChecklist(
  equipo.categoria,
  equipo.modelo
);
  const [resultados, setResultados] = useState({});
  const [observaciones, setObservaciones] = useState({});
  const [serialEquipo, setSerialEquipo] = useState(
  equipo.serial || ""
);

  const seleccionarResultado = (item, resultado) => {
    setResultados({
      ...resultados,
      [item]: resultado,
    });
  };

  const cambiarObservacion = (item, texto) => {
    setObservaciones({
      ...observaciones,
      [item]: texto,
    });
  };

  const guardarChecklist = () => {
    if (!serialEquipo.trim()) {
  alert(
    "Ingresa el número de serie del equipo antes de continuar."
  );
  return;
}

  guardarSerialEquipo(serialEquipo.trim());
    const totalPruebas = pruebas.reduce(
      (total, grupo) => total + grupo.items.length,
      0
    );

    const respondidas = Object.keys(resultados).length;

    if (respondidas < totalPruebas) {
      alert(
        `Faltan ${totalPruebas - respondidas} puntos por completar.`
      );
      return;
    }

    continuarDiagnostico({
  resultados,
  observaciones,
});
  };

  return (
    <div className="app">
      <main className="mobile-container checklist-page">

        <header className="equipment-header">
          <button
            className="back-button"
            onClick={volverEquipos}
          >
            ←
          </button>

          <div>
            <strong>Checklist de equipo</strong>
            <span>Mantenimiento preventivo</span>
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
    {equipo.categoria || "Sin categoría"}
  </span>

  <span className="equipment-code">
    {equipo.codigoInterno || "Equipo"}
  </span>
</div>
            <div className="diagnosis-field serial-entry">
        <label>Número de serie *</label>

  <input
    type="text"
    value={serialEquipo}
    onChange={(e) =>
      setSerialEquipo(e.target.value)
    }
    placeholder="Ingrese el serial del equipo"
  />
</div>
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

        {pruebas.map((grupo) => (
          <section
            className="checklist-section"
            key={grupo.grupo}
          >
            <h3>{grupo.grupo}</h3>

            {grupo.items.map((item) => (
              <div
                className="checklist-item"
                key={item}
              >
                <p>{item}</p>

                <div className="checklist-options">

                  <button
                    className={
                      resultados[item] === "OK"
                        ? "check-option ok selected"
                        : "check-option ok"
                    }
                    onClick={() =>
                      seleccionarResultado(item, "OK")
                    }
                  >
                    OK
                  </button>

                  <button
                    className={
                      resultados[item] === "Falla"
                        ? "check-option fail selected"
                        : "check-option fail"
                    }
                    onClick={() =>
                      seleccionarResultado(item, "Falla")
                    }
                  >
                    Falla
                  </button>

                  <button
                    className={
                      resultados[item] === "N/A"
                        ? "check-option na selected"
                        : "check-option na"
                    }
                    onClick={() =>
                      seleccionarResultado(item, "N/A")
                    }
                  >
                    N/A
                  </button>

                  <button
                    className={
                      resultados[item] === "No probado"
                        ? "check-option untested selected"
                        : "check-option untested"
                    }
                    onClick={() =>
                      seleccionarResultado(
                        item,
                        "No probado"
                      )
                    }
                  >
                    No probado
                  </button>

                </div>

                {resultados[item] === "Falla" && (
                  <div className="failure-details">
                    <label>
                      Describe la falla
                    </label>

                    <textarea
                      placeholder="Ej. El botón presenta desgaste y responde de forma intermitente."
                      value={observaciones[item] || ""}
                      onChange={(e) =>
                        cambiarObservacion(
                          item,
                          e.target.value
                        )
                      }
                    />

                    <button className="photo-button">
                      + Agregar fotografía
                    </button>
                  </div>
                )}

              </div>
            ))}

          </section>
        ))}

        <button
          className="continue-button"
          onClick={guardarChecklist}
        >
          Guardar y continuar
        </button>

      </main>
    </div>
  );
}

export default Checklist;