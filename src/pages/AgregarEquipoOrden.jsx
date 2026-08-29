import { useState } from "react";

function AgregarEquipoOrden({
  orden,
  equiposActuales,
  usuario,
  volver,
  agregarEquipos,
}) {
  const [categoria, setCategoria] = useState("Terminal móvil");
  const [modelo, setModelo] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const guardar = () => {
    if (!modelo.trim()) {
      alert("Ingresa el modelo del equipo.");
      return;
    }

    const cantidadNumerica = Number(cantidad);

    if (
      !Number.isInteger(cantidadNumerica) ||
      cantidadNumerica < 1
    ) {
      alert("La cantidad debe ser mayor a 0.");
      return;
    }

    agregarEquipos({
      categoria,
      modelo: modelo.trim(),
      cantidad: cantidadNumerica,
    });
  };

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
            <strong>Agregar equipos</strong>

            <span>
              {orden.numero}
            </span>
          </div>
        </header>

        <section className="diagnosis-section">

          <div className="additional-equipment-info">
            <strong>
              Equipo encontrado durante el mantenimiento
            </strong>

            <p>
              Será agregado a la orden actual y quedará
              registrado como equipo adicional.
            </p>
          </div>

          <div className="diagnosis-field">
            <label>Categoría</label>

            <select
              value={categoria}
              onChange={(e) =>
                setCategoria(e.target.value)
              }
            >
              <option>Terminal móvil</option>
              <option>Impresora</option>
              <option>Scanner</option>
              <option>RFID</option>
              <option>Cradle</option>
              <option>Otro</option>
            </select>
          </div>

          <div className="diagnosis-field">
            <label>Modelo *</label>

            <input
              type="text"
              value={modelo}
              onChange={(e) =>
                setModelo(e.target.value)
              }
              placeholder="Ej. Zebra MC330L"
            />
          </div>

          <div className="diagnosis-field">
            <label>Cantidad *</label>

            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) =>
                setCantidad(e.target.value)
              }
            />
          </div>

        </section>

        <div className="checklist-technician">
          Agregado por:{" "}
          <strong>{usuario}</strong>
        </div>

        <button
          className="continue-button"
          onClick={guardar}
        >
          Agregar a la orden
        </button>

      </main>
    </div>
  );
}

export default AgregarEquipoOrden;