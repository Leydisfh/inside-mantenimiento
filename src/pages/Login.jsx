import "../styles.css/login.css"
import logo from "../assets/logo.jpg";
export function Login({
  tipoAcceso,
  setTipoAcceso,
  pin,
  setPin,
  usuarioTecnico,
  setUsuarioTecnico,
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

   

          <div className="field">
                  {tipoAcceso === "tecnico" && (
  <>
    <label>Usuario</label>

    <input
      type="text"
      value={usuarioTecnico}
      onChange={(e) =>
        setUsuarioTecnico(e.target.value)
      }
      placeholder="Ej. jose"
      autoComplete="username"
    />
  </>
)}
            <label>Ingrese contraseña</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Contraseña"
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