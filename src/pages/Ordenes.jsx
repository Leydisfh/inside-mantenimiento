import "../styles.css/ordenes.css"
import logo from "../assets/logo.jpg";
export function Ordenes({
  tipoAcceso,
  nombreTecnico,
  ordenes,
  cerrarSesion,
  abrirOrden,
  nuevaOrden,
}) {
  return (
    <div className="app">
      <main className="mobile-container">

        <header className="orders-header">
          <div className="brand-small">
            <img src={logo} alt="Inside Panamá" />

            <div>
              <strong>Inside Panamá</strong>
              <span>Órdenes de servicio</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={cerrarSesion}
          >
            Salir
          </button>
        </header>

        <section className="orders-title">
          <h1>Órdenes de servicio</h1>

          <p>
            {tipoAcceso === "tecnico"
              ? `Técnico: ${nombreTecnico}`
              : "Administrador"}
          </p>
        </section>

        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Buscar por cliente o número..."
          />
        </div>

        <div className="tabs">
          <button className="tab active">
            Abiertas
          </button>

          <button className="tab">
            Cerradas
          </button>
        </div>

        {tipoAcceso === "administrador" && (
          <button
            className="new-order-button"
            onClick={nuevaOrden}
          >
            + Nueva orden
          </button>
        )}

        <section className="orders-list">

          {ordenes.map((orden) => (
            <article
              key={orden.numero}
              className="order-card"
              onClick={() => abrirOrden(orden)}
            >

              <div className="order-top">
                <div>
                  <h3>{orden.numero}</h3>

                  <p>
                    {orden.cliente} · {orden.ubicacion}
                  </p>
                </div>

                <span
                  className={
                    orden.estado === "Cerrado"
                      ? "status closed"
                      : "status progress"
                  }
                >
                  {orden.estado}
                </span>
              </div>

              <div className="order-details">
                <span>{orden.equipos} equipos</span>
                <strong>{orden.progreso}%</strong>
              </div>

              <div className="progress-bar">
                <div
                  className={
                    orden.estado === "Cerrado"
                      ? "progress-fill completed"
                      : "progress-fill"
                  }
                  style={{
                    width: `${orden.progreso}%`,
                  }}
                />
              </div>

              <div className="open-order">
                Ver orden →
              </div>

            </article>
          ))}

        </section>

      </main>
    </div>
  );
}

export default Ordenes;