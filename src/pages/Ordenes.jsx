import "../styles.css/ordenes.css"
import { useState } from "react";
import logo from "../assets/logo.jpg";

export function Ordenes({
  tipoAcceso,
  nombreTecnico,
  ordenes,
  cerrarSesion,
  abrirOrden,
  nuevaOrden,
}) {
  const [vistaOrdenes, setVistaOrdenes] =
    useState("abiertas");

  const [busqueda, setBusqueda] =
    useState("");

  const ordenesVisibles =
    ordenes.filter((orden) => {
      const esCerrada =
        orden.estado === "Cerrada";

      const coincideVista =
        vistaOrdenes === "cerradas"
          ? esCerrada
          : !esCerrada;

      const texto =
        busqueda
          .trim()
          .toLowerCase();

      const coincideBusqueda =
        !texto ||
        orden.numero
          ?.toLowerCase()
          .includes(texto) ||
        orden.cliente
          ?.toLowerCase()
          .includes(texto) ||
        orden.ubicacion
          ?.toLowerCase()
          .includes(texto);

      return (
        coincideVista &&
        coincideBusqueda
      );
    });

  return (
    <div className="app">
      <main className="mobile-container">

        <header className="orders-header">
          <div className="brand-small">
            <img
              src={logo}
              alt="Inside Panamá"
            />

            <div>
              <strong>
                Inside Panamá
              </strong>

              <span>
                Órdenes de servicio
              </span>
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
          <h1>
            Órdenes de servicio
          </h1>

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
            value={busqueda}
            onChange={(e) =>
              setBusqueda(
                e.target.value
              )
            }
          />
        </div>

        <div className="tabs">
          <button
            type="button"
            className={
              vistaOrdenes ===
              "abiertas"
                ? "tab active"
                : "tab"
            }
            onClick={() =>
              setVistaOrdenes(
                "abiertas"
              )
            }
          >
            Abiertas
          </button>

          <button
            type="button"
            className={
              vistaOrdenes ===
              "cerradas"
                ? "tab active"
                : "tab"
            }
            onClick={() =>
              setVistaOrdenes(
                "cerradas"
              )
            }
          >
            Cerradas
          </button>
        </div>

        {tipoAcceso ===
          "administrador" && (
          <button
            className="new-order-button"
            onClick={nuevaOrden}
          >
            + Nueva orden
          </button>
        )}

        <section className="orders-list">

          {ordenesVisibles.length ===
          0 ? (
            <p className="empty-orders">
              {vistaOrdenes ===
              "cerradas"
                ? "No hay órdenes cerradas."
                : "No hay órdenes abiertas."}
            </p>
          ) : (
            ordenesVisibles.map(
              (orden) => (
                <article
                  key={orden.numero}
                  className="order-card"
                  onClick={() =>
                    abrirOrden(
                      orden
                    )
                  }
                >
                  <div className="order-top">
                    <div>
                      <h3>
                        {orden.numero}
                      </h3>

                      <p>
                        {orden.cliente}
                        {" · "}
                        {orden.ubicacion}
                      </p>
                    </div>

                    <span
                      className={
                        orden.estado ===
                        "Cerrada"
                          ? "status closed"
                          : "status progress"
                      }
                    >
                      {orden.estado}
                    </span>
                  </div>

                  <div className="order-details">
                    <span>
                      {orden.equipos}{" "}
                      equipos
                    </span>

                    <strong>
                      {orden.progreso}%
                    </strong>
                  </div>

                  <div className="progress-bar">
                    <div
                      className={
                        orden.estado ===
                        "Cerrada"
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
              )
            )
          )}

        </section>

      </main>
    </div>
  );
}

export default Ordenes;