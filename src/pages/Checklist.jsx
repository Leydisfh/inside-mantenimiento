import { useState } from "react";
import "../styles.css/checklist.css"
function Checklist({
   equipo,
  nombreTecnico,
  volverEquipos,
  continuarDiagnostico,
  guardarSerialEquipo,
}) {
 const checklistsPorCategoria = {
  "Terminal móvil": [
    {
      grupo: "Inspección y limpieza",
      items: [
        "Limpieza exterior",
        "Limpieza de pantalla",
        "Limpieza de teclado y botones",
        "Limpieza de gatillo",
        "Limpieza de ventana del scanner",
        "Limpieza del compartimiento de batería",
        "Limpieza de contactos de carga",
        "Inspección de carcasa",
      ],
    },
    {
      grupo: "Pruebas funcionales",
      items: [
        "Encendido correcto",
        "Pantalla",
        "Touch",
        "Teclado y botones",
        "Gatillo",
        "Lectura de código de barras",
        "Wi-Fi",
        "Bluetooth",
        "Batería",
        "Carga en cradle",
        "Reinicio correcto",
        "Sistema inicia sin errores",
      ],
    },
  ],

  Impresora: [
    {
      grupo: "Inspección y limpieza",
      items: [
        "Limpieza exterior",
        "Limpieza interior",
        "Limpieza de cabezal",
        "Limpieza de platen roller",
        "Limpieza de sensores",
        "Limpieza del recorrido del medio",
        "Inspección de cabezal",
        "Inspección de rodillos",
        "Inspección de carcasa y mecanismos",
      ],
    },
    {
      grupo: "Pruebas funcionales",
      items: [
        "Encendido correcto",
        "Pantalla y controles",
        "Detección del medio",
        "Detección de ribbon",
        "Feed",
        "Calibración",
        "Impresión de prueba",
        "Calidad de impresión",
        "Alineación",
        "Conectividad",
        "Sensores",
        "Errores o alertas",
      ],
    },
  ],

  Scanner: [
    {
      grupo: "Inspección y limpieza",
      items: [
        "Limpieza exterior",
        "Limpieza de ventana de lectura",
        "Limpieza de gatillo",
        "Limpieza de contactos",
        "Inspección de carcasa",
        "Inspección de cable o conector",
      ],
    },
    {
      grupo: "Pruebas funcionales",
      items: [
        "Encendido",
        "Gatillo",
        "Lectura de código 1D",
        "Lectura de código 2D",
        "Calidad de lectura",
        "Conectividad",
        "Indicadores LED",
        "Alertas sonoras",
      ],
    },
  ],

  RFID: [
    {
      grupo: "Inspección y limpieza",
      items: [
        "Limpieza exterior",
        "Limpieza de contactos",
        "Inspección de gatillo",
        "Inspección de carcasa",
        "Inspección de batería",
      ],
    },
    {
      grupo: "Pruebas funcionales",
      items: [
        "Encendido",
        "Gatillo",
        "Comunicación con dispositivo host",
        "Lectura RFID",
        "Lectura consecutiva de etiquetas RFID",
        "Estabilidad de conexión",
        "Bluetooth",
        "Batería",
        "Carga",
        "Indicadores LED",
      ],
    },
  ],

  Cradle: [
    {
      grupo: "Inspección y limpieza",
      items: [
        "Limpieza exterior",
        "Limpieza de slots",
        "Limpieza de contactos",
        "Inspección de fuente de alimentación",
        "Inspección de cableado",
        "Inspección física",
      ],
    },
    {
      grupo: "Pruebas funcionales",
      items: [
        "Alimentación eléctrica",
        "Detección del equipo",
        "Inicio de carga",
        "Estabilidad de carga",
        "Indicadores LED",
        "Prueba de todos los slots",
        "Carga simultánea",
      ],
    },
  ],

  Otro: [
    {
      grupo: "Inspección general",
      items: [
        "Limpieza exterior",
        "Inspección física",
        "Conectores",
        "Cableado",
      ],
    },
    {
      grupo: "Pruebas funcionales",
      items: [
        "Encendido",
        "Funcionamiento general",
        "Conectividad",
        "Errores o alertas",
      ],
    },
  ],
};
const pruebas =
  checklistsPorCategoria[equipo.categoria] ||
  checklistsPorCategoria["Otro"];

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