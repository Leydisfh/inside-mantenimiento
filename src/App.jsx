import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Ordenes from "./pages/Ordenes";
import Equipos from "./pages/Equipos";
import Checklist from "./pages/Checklist";
import Diagnostico from "./pages/Diagnostico";
import NuevaOrden from "./pages/NuevaOrden";
import AgregarEquipoOrden from "./pages/AgregarEquipoOrden";
import DetalleEquipo from "./pages/DetalleEquipo";
import ResumenOrden from "./pages/ResumenOrden";


function App() {
  const [pantalla, setPantalla] = useState("login");
  const [tipoAcceso, setTipoAcceso] = useState("tecnico");
  const [pin, setPin] = useState("");
  const [nombreTecnico, setNombreTecnico] = useState("");
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [checklistActual, setChecklistActual] = useState(null);
  const [diagnosticoActual, setDiagnosticoActual] = useState(null);
  const [origenDetalle, setOrigenDetalle] = useState("equipos");

  const [ordenes, setOrdenes] = useState([
    {
      numero: "COCH-2026-0001",
      cliente: "Cochez",
      ubicacion: "CEDI Central",
      equipos: 48,
      progreso: 62,
      estado: "En proceso",
    },
    {
      numero: "FELIX-2026-0002",
      cliente: "Félix B. Maduro",
      ubicacion: "Albrook",
      equipos: 14,
      progreso: 100,
      estado: "Cerrado",
    },
    {
      numero: "DHL-2026-0003",
      cliente: "DHL",
      ubicacion: "Panamá Pacífico",
      equipos: 22,
      progreso: 18,
      estado: "En proceso",
    },
  ]);

const [equiposPorOrden, setEquiposPorOrden] = useState({
  "COCH-2026-0001": [
    {
      id: 1,
      modelo: "Zebra MC330L",
      serial: "MC330L-001",
      tecnico: "Jaime",
      estado: "Completado",
    },
    {
      id: 2,
      modelo: "Zebra MC330L",
      serial: "MC330L-002",
      tecnico: "Ana",
      estado: "En proceso",
    },
    {
      id: 3,
      modelo: "Zebra MC330L",
      serial: "MC330L-003",
      tecnico: "",
      estado: "Pendiente",
    },
    {
      id: 4,
      modelo: "Zebra TC22",
      serial: "TC22-001",
      tecnico: "",
      estado: "Pendiente",
    },
    {
      id: 5,
      modelo: "Zebra TC22",
      serial: "TC22-002",
      tecnico: "Luis",
      estado: "En proceso",
    },
    {
      id: 6,
      modelo: "Zebra RFD40",
      serial: "RFD40-001",
      tecnico: "",
      estado: "Pendiente",
    },
    {
      id: 7,
      modelo: "Zebra ZT411",
      serial: "ZT411-001",
      tecnico: "Jaime",
      estado: "Completado",
    },
    {
      id: 8,
      modelo: "Zebra ZD621",
      serial: "ZD621-001",
      tecnico: "",
      estado: "Pendiente",
    },
  ]});
  const equipos =
  ordenSeleccionada
    ? equiposPorOrden[
        ordenSeleccionada.numero
      ] || []
    : [];
    const ordenesConProgreso = ordenes.map((orden) => {
  const equiposOrden =
    equiposPorOrden[orden.numero] || [];

  const totalEquipos = equiposOrden.length;

  const completados = equiposOrden.filter(
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

  const progreso =
    totalEquipos === 0
      ? 0
      : Math.round(
          (completados / totalEquipos) * 100
        );

  let estadoCalculado = orden.estado;
  

  if (orden.estado !== "Cerrada") {
    if (
      totalEquipos > 0 &&
      completados === totalEquipos
    ) {
      estadoCalculado = "Lista para cerrar";
    } else {
      estadoCalculado = "En proceso";
    }
  }

  return {
    ...orden,
    equipos: totalEquipos,
    completados,
    progreso,
    estado: estadoCalculado,
  };
});
    const actualizarEquiposOrden = (actualizador) => {
  if (!ordenSeleccionada) return;

  setEquiposPorOrden((estadoActual) => {
    const listaActual =
      estadoActual[
        ordenSeleccionada.numero
      ] || [];

    const nuevaLista =
      typeof actualizador === "function"
        ? actualizador(listaActual)
        : actualizador;

    return {
      ...estadoActual,
      [ordenSeleccionada.numero]:
        nuevaLista,
    };
  });
};

  const ingresar = () => {
    if (!pin.trim()) {
      alert("Ingresa el PIN");
      return;
    }

    if (tipoAcceso === "tecnico" && !nombreTecnico.trim()) {
      alert("Ingresa el nombre del técnico");
      return;
    }

    setPantalla("ordenes");
  };

  const cerrarSesion = () => {
    setPantalla("login");
    setPin("");
  };

  const abrirOrden = (orden) => {
    if (orden.estado === "Cerrado") {
      alert("Esta orden ya se encuentra cerrada.");
      return;
    }

    setOrdenSeleccionada(orden);
    setPantalla("equipos");
  };

  const obtenerClaseEstado = (estado) => {
    if (estado === "Completado") return "equipment-status completed";
    if (estado === "En proceso") return "equipment-status working";

    return "equipment-status pending";
  };

const abrirEquipo = (equipo) => {
  // Un equipo terminado puede ser consultado
  // tanto por técnico como por administrador.
  if (equipo.estado === "Completado") {
  setEquipoSeleccionado(equipo);
  setOrigenDetalle("equipos");
  setPantalla("detalleEquipo");
  return;
}

  // El administrador no realiza mantenimiento.
  if (tipoAcceso === "administrador") {
    alert(
      "El administrador puede supervisar la orden, pero el mantenimiento debe ser realizado por un técnico."
    );
    return;
  }

  // Bloqueo si otro técnico ya trabaja el equipo.
  if (
    equipo.estado === "En proceso" &&
    equipo.tecnico !== nombreTecnico
  ) {
    alert(
      `Este equipo está siendo trabajado por ${equipo.tecnico}.`
    );
    return;
  }

  let equipoActualizado = equipo;

  if (equipo.estado === "Pendiente") {
    equipoActualizado = {
      ...equipo,
      estado: "En proceso",
      tecnico: nombreTecnico,
    };

    actualizarEquiposOrden((equiposActuales) =>
      equiposActuales.map((item) =>
        item.id === equipo.id
          ? equipoActualizado
          : item
      )
    );
  }

  setEquipoSeleccionado(equipoActualizado);
  setPantalla("checklist");
};
  const continuarADiagnostico = (datosChecklist) => {
  setChecklistActual(datosChecklist);
  setPantalla("diagnostico");
};

const finalizarDiagnostico = (datosDiagnostico) => {
  actualizarEquiposOrden((equiposActuales) =>
    equiposActuales.map((equipo) =>
      equipo.id === equipoSeleccionado.id
        ? {
            ...equipo,

            estado: "Completado",

            tecnico:
              nombreTecnico || "Administrador",

            checklist: checklistActual,

            diagnostico: datosDiagnostico,

            fechaFinalizacion:
              new Date().toISOString(),
          }
        : equipo
    )
  );

  setDiagnosticoActual(datosDiagnostico);

  alert("Resultado guardado correctamente.");

  setEquipoSeleccionado(null);
  setChecklistActual(null);

  setPantalla("equipos");
};
  const crearNuevaOrden = (
  nuevaOrden,
  nuevosEquipos
) => {
  setOrdenes((ordenesActuales) => [
    ...ordenesActuales,
    nuevaOrden,
  ]);

  setEquiposPorOrden((estadoActual) => ({
    ...estadoActual,
    [nuevaOrden.numero]: nuevosEquipos,
  }));

  setOrdenSeleccionada(nuevaOrden);

  setPantalla("equipos");
};
const guardarSerialEquipo = (serial) => {
  if (!equipoSeleccionado) return;

  const equipoActualizado = {
    ...equipoSeleccionado,
    serial,
  };

  actualizarEquiposOrden((equiposActuales) =>
    equiposActuales.map((equipo) =>
      equipo.id === equipoSeleccionado.id
        ? equipoActualizado
        : equipo
    )
  );

  setEquipoSeleccionado(equipoActualizado);
};
const agregarEquiposAOrden = ({
  categoria,
  modelo,
  cantidad,
}) => {
  if (!ordenSeleccionada) return;

  const usuario =
    tipoAcceso === "tecnico"
      ? nombreTecnico
      : "Administrador";

  actualizarEquiposOrden((equiposActuales) => {
    const numerosExistentes = equiposActuales
      .map((equipo) => {
        if (!equipo.codigoInterno) return 0;

        const numero = Number(
          equipo.codigoInterno.replace("EQ-", "")
        );

        return Number.isNaN(numero)
          ? 0
          : numero;
      });

    const ultimoNumero =
      numerosExistentes.length > 0
        ? Math.max(...numerosExistentes)
        : 0;

    const nuevosEquipos = Array.from(
      { length: cantidad },
      (_, index) => ({
        id: Date.now() + index,

        codigoInterno: `EQ-${String(
          ultimoNumero + index + 1
        ).padStart(3, "0")}`,

        categoria,
        modelo,
        serial: "",
        tecnico: "",
        estado: "Pendiente",

        origen: "Adicional",
        agregadoPor: usuario,
        fechaAgregado: new Date().toISOString(),
      })
    );

    return [
      ...equiposActuales,
      ...nuevosEquipos,
    ];
  });

  alert(
    `${cantidad} equipo(s) agregado(s) correctamente.`
  );

  setPantalla("equipos");
};
const abrirResumenOrden = () => {
  setPantalla("resumenOrden");
};
const verEquipoDesdeResumen = (equipo) => {
  setEquipoSeleccionado(equipo);
  setOrigenDetalle("resumenOrden");
  setPantalla("detalleEquipo");
};
 {
  if (
  pantalla === "resumenOrden" &&
  ordenSeleccionada
) {
  return (
    <ResumenOrden
      orden={ordenSeleccionada}
      equipos={equipos}
      volver={() =>
        setPantalla("equipos")
      }
      verEquipo={verEquipoDesdeResumen}
    />
  );
}if (
  pantalla === "detalleEquipo" &&
  equipoSeleccionado
) {
  return (
    <DetalleEquipo
      equipo={equipoSeleccionado}
      orden={ordenSeleccionada}
      volver={() =>
        setPantalla(origenDetalle)
      }
    />
  );
}
}
if (
  pantalla === "agregarEquipoOrden" &&
  ordenSeleccionada
) {
  return (
    <AgregarEquipoOrden
      orden={ordenSeleccionada}
      equiposActuales={equipos}
      usuario={
        tipoAcceso === "tecnico"
          ? nombreTecnico
          : "Administrador"
      }
      volver={() =>
        setPantalla("equipos")
      }
      agregarEquipos={agregarEquiposAOrden}
    />
  );
}
if (pantalla === "nuevaOrden") {
  return (
    <NuevaOrden
      ordenes={ordenes}
      volverOrdenes={() =>
        setPantalla("ordenes")
      }
      guardarNuevaOrden={crearNuevaOrden}
    />
  );
}
if (
  pantalla === "diagnostico" &&
  equipoSeleccionado
) {
  return (
    <Diagnostico
      equipo={equipoSeleccionado}
      nombreTecnico={nombreTecnico}
      volverChecklist={() =>
        setPantalla("checklist")
      }
      guardarDiagnostico={
        finalizarDiagnostico
      }
    />
  );
}
if (
  pantalla === "checklist" &&
  equipoSeleccionado
) {
  return (
    <Checklist
      equipo={equipoSeleccionado}
      nombreTecnico={nombreTecnico}
      volverEquipos={() => setPantalla("equipos")}
      continuarDiagnostico={continuarADiagnostico}
      guardarSerialEquipo={guardarSerialEquipo}
    />
  );
 
 
}
    if (pantalla === "equipos" && ordenSeleccionada) {
    return (
      <Equipos
        ordenSeleccionada={ordenSeleccionada}
        equipos={equipos}
        volverOrdenes={() => setPantalla("ordenes")}
        abrirEquipo={abrirEquipo}
        obtenerClaseEstado={obtenerClaseEstado}
        tipoAcceso={tipoAcceso}
        agregarEquipo={() =>
        setPantalla("agregarEquipoOrden")
}
        revisarOrden={abrirResumenOrden}
      />
    );
  }
  if (
  pantalla === "resumenOrden" &&
  ordenSeleccionada
) {
  return (
    <ResumenOrden
      orden={ordenSeleccionada}
      equipos={equipos}
      volver={() => setPantalla("equipos")}
      verEquipo={verEquipoDesdeResumen}
    />
  );
}

  if (pantalla === "ordenes") {
    return (
      <Ordenes
        tipoAcceso={tipoAcceso}
        nombreTecnico={nombreTecnico}
        ordenes={ordenesConProgreso}
        cerrarSesion={cerrarSesion}
        abrirOrden={abrirOrden}
        nuevaOrden={() => setPantalla("nuevaOrden")}
      />
    );
  }

  return (
    <Login
      tipoAcceso={tipoAcceso}
      setTipoAcceso={setTipoAcceso}
      pin={pin}
      setPin={setPin}
      nombreTecnico={nombreTecnico}
      setNombreTecnico={setNombreTecnico}
      ingresar={ingresar}
    />
  );
  

}


 

export default App;

