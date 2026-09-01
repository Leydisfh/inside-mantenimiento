import "../styles.css/login.css"
import logo from "../assets/logo.jpg";
export function Login({
  tipoAcceso,
  setTipoAcceso,
  pin,
  setPin,
  nombreTecnico,
  setNombreTecnico,
  ingresar,
}) {
  return (
    <div className="app">
      <main className="login-container">
        <div className="brand">
          <img src={logo} alt="Inside Panamá" />
          <div>
            <h1>Inside Panamá</h1>
            <p>Mantenimiento preventivo y diagnóstico</p>
          </div>
        </div>

        <section className="welcome">
          <h2>Acceso al sistema</h2>
          <p>Selecciona el tipo de acceso para continuar.</p>
        </section>

        <div className="access-options">

          <button
            className={
              tipoAcceso === "tecnico"
                ? "access-card selected"
                : "access-card"
            }
            onClick={() => setTipoAcceso("tecnico")}
          >
            <div className="access-icon">🔧</div>

            <div>
              <strong>Ingreso técnico</strong>
              <span>Uso durante mantenimientos</span>
            </div>
          </button>

          <button
            className={
              tipoAcceso === "administrador"
                ? "access-card selected"
                : "access-card"
            }
            onClick={() => setTipoAcceso("administrador")}
          >
            <div className="access-icon">⚙</div>

            <div>
              <strong>Ingreso administrador</strong>
              <span>Configuración y órdenes</span>
            </div>
          </button>

        </div>

        <section className="form-card">

          {tipoAcceso === "tecnico" && (
            <div className="field">
              <label>Nombre del técnico</label>

              <input
                type="text"
                placeholder="Ej. Jaime"
                value={nombreTecnico}
                onChange={(e) =>
                  setNombreTecnico(e.target.value)
                }
              />
            </div>
          )}

          <div className="field">
            <label>Ingrese PIN</label>

            <input
              type="password"
              inputMode="numeric"
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>

          <button
            className="continue-button"
            onClick={ingresar}
          >
            Continuar
          </button>

        </section>

        <div className="info-box">
          <strong>Acceso rápido para uso en campo</strong>

          <p>
            Los técnicos podrán trabajar simultáneamente
            sobre una misma orden de servicio.
          </p>
        </div>

        <footer>
          Inside Panamá · Sistema de mantenimiento
        </footer>

      </main>
    </div>
  );
}

export default Login;