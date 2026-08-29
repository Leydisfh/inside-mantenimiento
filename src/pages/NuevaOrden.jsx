import "../styles.css/nuevaOrden.css"
import { useState } from "react";

function NuevaOrden({
  ordenes,
  volverOrdenes,
  guardarNuevaOrden,
}) {
  const [cliente, setCliente] = useState("");
  const [abreviatura, setAbreviatura] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [fecha, setFecha] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [categoria, setCategoria] = useState("Terminal móvil");
  const [modelo, setModelo] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const [equiposAgregados, setEquiposAgregados] = useState([]);

  const agregarEquipo = () => {
    if (!modelo.trim()) {
      alert("Ingresa el modelo del equipo.");
      return;
    }

    const cantidadNumerica = Number(cantidad);

    if (!Number.isInteger(cantidadNumerica) || cantidadNumerica < 1) {
      alert("La cantidad debe ser un número mayor a 0.");
      return;
    }

    const nuevosEquipos = Array.from(
      { length: cantidadNumerica },
      (_, index) => ({
        id: Date.now() + index,

        codigoInterno: `EQ-${String(
          equiposAgregados.length + index + 1
        ).padStart(3, "0")}`,

        categoria,
        modelo: modelo.trim(),

        // El serial será ingresado por el técnico
        // durante el mantenimiento.
        serial: "",

        tecnico: "",
        estado: "Pendiente",
        origen: "Planificado",
        agregadoPor: "Administrador",
        fechaAgregado: new Date().toISOString(),
      })
    );

    setEquiposAgregados((equiposActuales) => [
      ...equiposActuales,
      ...nuevosEquipos,
    ]);

    setModelo("");
    setCantidad(1);
  };

  const eliminarEquipo = (id) => {
    setEquiposAgregados((equiposActuales) =>
      equiposActuales.filter(
        (equipo) => equipo.id !== id
      )
    );
  };

  const guardarOrden = () => {
    if (!cliente.trim()) {
      alert("Ingresa el nombre del cliente.");
      return;
    }

    if (!abreviatura.trim()) {
      alert("Ingresa la abreviatura del cliente.");
      return;
    }

    if (!ubicacion.trim()) {
      alert("Ingresa la ubicación.");
      return;
    }

    if (!fecha) {
      alert("Selecciona la fecha.");
      return;
    }

    if (equiposAgregados.length === 0) {
      alert("Agrega al menos un equipo.");
      return;
    }

    const año = fecha.substring(0, 4);

    const codigo = abreviatura
      .trim()
      .toUpperCase();

    const ordenesCliente = ordenes.filter(
      (orden) =>
        orden.numero.startsWith(
          `${codigo}-${año}-`
        )
    );

    const consecutivo = String(
      ordenesCliente.length + 1
    ).padStart(4, "0");

    const numeroOrden =
      `${codigo}-${año}-${consecutivo}`;

    const nuevaOrden = {
      numero: numeroOrden,
      cliente: cliente.trim(),
      ubicacion: ubicacion.trim(),
      fecha,
      observaciones: observaciones.trim(),
      equipos: equiposAgregados.length,
      progreso: 0,
      estado: "En proceso",
    };

    guardarNuevaOrden(
      nuevaOrden,
      equiposAgregados
    );
  };

  return (
    <div className="app">
      <main className="mobile-container">

        <header className="equipment-header">
          <button
            className="back-button"
            onClick={volverOrdenes}
          >
            ←
          </button>

          <div>
            <strong>Nueva orden de servicio</strong>
            <span>Crear mantenimiento</span>
          </div>
        </header>

        <section className="diagnosis-section">

          <div className="diagnosis-field">
            <label>Cliente *</label>

            <input
              type="text"
              value={cliente}
              onChange={(e) =>
                setCliente(e.target.value)
              }
              placeholder="Ej. Cochez"
            />
          </div>

          <div className="diagnosis-field">
            <label>Abreviatura *</label>

            <input
              type="text"
              value={abreviatura}
              onChange={(e) =>
                setAbreviatura(e.target.value)
              }
              placeholder="Ej. COCH"
              maxLength="8"
            />
          </div>

          <div className="diagnosis-field">
            <label>Sucursal / ubicación *</label>

            <input
              type="text"
              value={ubicacion}
              onChange={(e) =>
                setUbicacion(e.target.value)
              }
              placeholder="Ej. CEDI Central"
            />
          </div>

          <div className="diagnosis-field">
            <label>Fecha *</label>

            <input
              type="date"
              value={fecha}
              onChange={(e) =>
                setFecha(e.target.value)
              }
            />
          </div>

          <div className="diagnosis-field">
            <label>Observaciones</label>

            <textarea
              value={observaciones}
              onChange={(e) =>
                setObservaciones(e.target.value)
              }
              placeholder="Opcional"
            />
          </div>

        </section>

        <section className="diagnosis-section">

          <h3>Agregar equipos</h3>

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
              step="1"
              value={cantidad}
              onChange={(e) =>
                setCantidad(e.target.value)
              }
            />
          </div>

          <button
            className="service-summary-button"
            onClick={agregarEquipo}
          >
            + Agregar equipo
          </button>

        </section>

        {equiposAgregados.length > 0 && (
          <section className="diagnosis-section">

            <h3>
              Equipos agregados (
              {equiposAgregados.length}
              )
            </h3>

            {equiposAgregados.map((equipo) => (
              <div
                className="new-order-equipment"
                key={equipo.id}
              >
                <div>
                  <strong>
                    {equipo.modelo}
                  </strong>

                  <span>
                    {equipo.categoria}
                  </span>

                  <small>
                    {equipo.codigoInterno}
                    {" · "}
                    Serial pendiente
                  </small>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    eliminarEquipo(equipo.id)
                  }
                  title="Eliminar equipo"
                >
                  ×
                </button>
              </div>
            ))}

          </section>
        )}

        <button
          className="continue-button"
          onClick={guardarOrden}
        >
          Crear orden de servicio
        </button>

      </main>
    </div>
  );
}

export default NuevaOrden;