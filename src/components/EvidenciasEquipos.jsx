import "../styles.css/evidenciasEquipos.css"

function EvidenciasEquipo({
  evidencias,
  setEvidencias,
}) {
  const tipos = [
    { id: "antes", nombre: "Antes" },
    { id: "despues", nombre: "Después" },
    { id: "falla", nombre: "Falla" },
    { id: "adicional", nombre: "Adicional" },
  ];

  const seleccionarImagen = (tipo, archivo) => {
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      alert("Selecciona un archivo de imagen.");
      return;
    }

    const lector = new FileReader();

    lector.onload = () => {
      setEvidencias((actuales) => ({
        ...actuales,
        [tipo]: lector.result,
      }));
    };

    lector.readAsDataURL(archivo);
  };

  const eliminarImagen = (tipo) => {
    setEvidencias((actuales) => ({
      ...actuales,
      [tipo]: null,
    }));
  };

  return (
    <section className="evidence-section">
      <div className="evidence-title">
        <h3>Evidencia fotográfica</h3>

        <p>
          Las fotografías son opcionales.
        </p>
      </div>

      <div className="evidence-grid">
        {tipos.map((tipo) => {
          const imagen = evidencias[tipo.id];

          return (
            <div
              className="evidence-card"
              key={tipo.id}
            >
              <strong>{tipo.nombre}</strong>

              {imagen ? (
                <>
                  <img
                    src={imagen}
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