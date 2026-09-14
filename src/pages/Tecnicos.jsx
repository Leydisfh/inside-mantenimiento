import "../styles.css/tecnicos.css"
export function Tecnicos({
  tecnicos,
  cambiarEstadoTecnico,
  volver,
}) {
  return (
    <div className="app">
      <main className="mobile-container">

        <header className="technicians-header">
          <button
            type="button"
            className="back-button"
            onClick={volver}
          >
            ← Volver
          </button>
        </header>

        <section className="orders-title">
          <h1>Gestión de técnicos</h1>

          <p>
            Controla quién puede acceder al sistema.
          </p>
        </section>

        <section className="technicians-list">

          {tecnicos.length === 0 ? (
            <p>
              No hay técnicos registrados.
            </p>
          ) : (
            tecnicos.map((tecnico) => (
              <article
                className="technician-card"
                key={tecnico.id}
              >
                <div className="technician-info">

                  <strong>
                    {tecnico.nombre ||
                      "Técnico"}
                  </strong>

                  <span>
                    {tecnico.correo}
                  </span>

                  <small
                    className={
                      tecnico.activo
                        ? "technician-active"
                        : "technician-blocked"
                    }
                  >
                    {tecnico.activo
                      ? "Acceso habilitado"
                      : "Acceso bloqueado"}
                  </small>

                </div>

                <button
                  type="button"
                  className={
                    tecnico.activo
                      ? "technician-block-button"
                      : "technician-enable-button"
                  }
                  onClick={() =>
                    cambiarEstadoTecnico(
                      tecnico
                    )
                  }
                >
                  {tecnico.activo
                    ? "Bloquear"
                    : "Habilitar"}
                </button>

              </article>
            ))
          )}

        </section>

      </main>
    </div>
  );
}

export default Tecnicos;