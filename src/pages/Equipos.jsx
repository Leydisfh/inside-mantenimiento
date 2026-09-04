import { useState } from "react";
import "../styles.css/equipos.css"

export function Equipos({
  ordenSeleccionada,
  equipos,
  volverOrdenes,
  abrirEquipo,
  obtenerClaseEstado,
  tipoAcceso,
  agregarEquipo,
  revisarOrden

}
) {
  const ordenCerrada =
    ordenSeleccionada?.estado === "Cerrada";
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const totalEquipos = equipos.length;

  const completados = equipos.filter(
    (equipo) => equipo.estado === "Completado"
  ).length;
  const porcentajeProgreso =
  totalEquipos === 0
    ? 0
    : Math.round(
        (completados / totalEquipos) * 100
      );
      

const listaParaCerrar =
  totalEquipos > 0 &&
  completados === totalEquipos;

  const pendientes = equipos.filter(
    (equipo) => equipo.estado === "Pendiente"
  ).length;

  const enProceso = equipos.filter(
    (equipo) => equipo.estado === "En proceso"
  ).length;
  const equiposFiltrados = equipos.filter((equipo) => {
  const coincideEstado =
    filtro === "Todos" ||
    equipo.estado === filtro;
    {tipoAcceso === "administrador" &&
  listaParaCerrar && (
    <div className="order-ready-card">
      <strong>
        Mantenimiento técnico completado
      </strong>

      <p>
        Los {totalEquipos} equipos de esta orden
        tienen su checklist y diagnóstico
        completados.
      </p>

      <span>
        Orden lista para revisión del informe
      </span>
    </div>
  )}

  const textoBusqueda =
    busqueda.toLowerCase();

  const coincideBusqueda =
    equipo.modelo
      .toLowerCase()
      .includes(textoBusqueda) ||
    equipo.serial
      .toLowerCase()
      .includes(textoBusqueda);

  return coincideEstado && coincideBusqueda;
});
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
            {ordenCerrada && (
              <div className="closed-order-notice">
                Orden cerrada·
              </div>
)}    
          <div>
            <strong>
              {ordenSeleccionada.numero}
            </strong>
            <span>
              {ordenSeleccionada.cliente} ·{" "}
              {ordenSeleccionada.ubicacion}
            </span>
          </div>

        </header>
        <section className="equipment-summary">
          <div className="summary-box">
  <strong>{totalEquipos}</strong>
  <span>Equipos</span>
</div>

<div className="summary-box green">
  <strong>{completados}</strong>
  <span>Completados</span>
</div>

<div className="summary-box orange">
  <strong>{pendientes}</strong>
  <span>Pendientes</span>
</div>

<div className="summary-box blue">
  <strong>{enProceso}</strong>
  <span>En proceso</span>
</div>
        </section>

        <div className="equipment-search">
          <input
  placeholder="Buscar por modelo o serie..."
  type="text"
  value={busqueda}
  onChange={(e) =>
    setBusqueda(e.target.value)
  }
/>
        </div>
        <div className="equipment-filters">
         <button
  className={
    filtro === "Todos"
      ? "filter active"
      : "filter"
  }
  onClick={() => setFiltro("Todos")}
>
  Todos
</button>

<button
  className={
    filtro === "Pendiente"
      ? "filter active"
      : "filter"
  }
  onClick={() => setFiltro("Pendiente")}
>
  Pendientes
</button>

<button
  className={
    filtro === "En proceso"
      ? "filter active"
      : "filter"
  }
  onClick={() => setFiltro("En proceso")}
>
  En proceso
</button>

<button
  className={
    filtro === "Completado"
      ? "filter active"
      : "filter"
  }
  onClick={() => setFiltro("Completado")}
>
  Completados
</button>


        </div>
        {!ordenCerrada && (
    <button
        className="add-found-equipment-button"
        onClick={agregarEquipo} >
        + Agregar equipo 
    </button>
)}
        <section className="equipment-list">

          {equiposFiltrados.map((equipo) => (
            <article
              key={equipo.id}
              className="equipment-card"
              onClick={() => abrirEquipo(equipo)}
            >

              <div className="equipment-card-content">

                <div className="equipment-icon">
                  {equipo.modelo.includes("ZT") ||
                  equipo.modelo.includes("ZD")
                    ? "▤"
                    : "▥"}
                </div>

    <div className="equipment-information">
  <strong>{equipo.modelo}</strong>

  <span className="equipment-category-list">
    {equipo.categoria || "Sin categoría"}
  </span>
  {equipo.origen === "Adicional" && (
  <span className="additional-equipment-tag">
    Agregado durante mantenimiento
  </span>
)}

  <span className="equipment-serial">
    {equipo.serial
      ? `SN: ${equipo.serial}`
      : "Serial pendiente"}
  </span>

  <small>
    Técnico:{" "}
    {equipo.tecnico
      ? equipo.tecnico
      : "Sin asignar"}
  </small>
</div>
              </div>

              <div className="equipment-right">

                <span
                  className={obtenerClaseEstado(
                    equipo.estado
                  )}
                >
                  {equipo.estado}
                </span>

                <span className="equipment-arrow">
                  ›
                </span>
              </div>

            </article>
          ))}

        </section>

    {tipoAcceso === "administrador" && (
  <button
    className="review-order-button"
    onClick={revisarOrden}
  >
    Revisar resultados de la orden
  </button>
)}

      </main>
    </div>
  );
  {tipoAcceso === "administrador" && (
  <button
    className="review-order-button"
    onClick={revisarOrden}
  >
    Revisar resultados de la orden
  </button>
)}
}

export default Equipos;