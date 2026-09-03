import { useState } from "react";
import "../styles.css/evidenciasEquipos.css"
import {
  subirEvidencia,
  eliminarEvidencia,
} from "../lib/evidenciasStorage";

function EvidenciasEquipo({
  evidencias,
  setEvidencias,
  ordenId,
  equipoId,
  tipos,
  titulo = "Evidencia fotográfica",
  descripcion = "Las fotografías son opcionales.",
}) {
  const [cargando, setCargando] = useState({});



  const seleccionarImagen = async (
    tipo,
    archivo
  ) => {
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      alert("Selecciona un archivo de imagen.");
      return;
    }

    try {
      setCargando((actual) => ({
        ...actual,
        [tipo]: true,
      }));

      const evidenciaAnterior =
        evidencias[tipo];

      const nuevaEvidencia =
        await subirEvidencia({
          ordenId,
          equipoId,
          carpeta: "generales",
          nombre: tipo,
          archivo,
        });

      if (evidenciaAnterior?.path) {
        try {
          await eliminarEvidencia(
            evidenciaAnterior.path
          );
        } catch (error) {
          console.error(
            "No se pudo eliminar la foto anterior:",
            error
          );
        }
      }

      setEvidencias((actuales) => ({
        ...actuales,
        [tipo]: nuevaEvidencia,
      }));
    } catch (error) {
      console.error(
        "ERROR SUBIENDO EVIDENCIA:",
        error
      );

      alert(
        error.message ||
          "No fue posible subir la fotografía."
      );
    } finally {
      setCargando((actual) => ({
        ...actual,
        [tipo]: false,
      }));
    }
  };

  const eliminarImagen = async (tipo) => {
    const evidencia = evidencias[tipo];

    if (!evidencia) return;

    try {
      if (evidencia.path) {
        await eliminarEvidencia(
          evidencia.path
        );
      }

      setEvidencias((actuales) => ({
        ...actuales,
        [tipo]: null,
      }));
    } catch (error) {
      console.error(
        "ERROR ELIMINANDO FOTO:",
        error
      );

      alert(
        "No fue posible eliminar la fotografía."
      );
    }
  };

  return (
    <section className="evidence-section">
      <div className="evidence-title">
        <h3>{titulo}</h3>
        <p>{descripcion}</p>
      </div>

      <div className="evidence-grid">
        {tipos.map((tipo) => {
          const evidencia =
            evidencias[tipo.id];

          return (
            <div
              className="evidence-card"
              key={tipo.id}
            >
              <strong>{tipo.nombre}</strong>

              {cargando[tipo.id] ? (
                <div className="evidence-upload">
                  Subiendo...
                </div>
              ) : evidencia ? (
                <>
                  <img
                    src={evidencia.url}
                    alt={`Evidencia ${tipo.nombre}`}
                    className="evidence-preview"
                  />

                  <div className="evidence-actions">
                    <label className="evidence-change-button">
                      Cambiar

                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) =>
                          seleccionarImagen(
                            tipo.id,
                            e.target.files[0]
                          )
                        }
                      />
                    </label>

                    <button
                      type="button"
                      className="evidence-delete-button"
                      onClick={() =>
                        eliminarImagen(tipo.id)
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              ) : (
                <label className="evidence-upload">
                  <span>+ Agregar foto</span>

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) =>
                      seleccionarImagen(
                        tipo.id,
                        e.target.files[0]
                      )
                    }
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default EvidenciasEquipo;