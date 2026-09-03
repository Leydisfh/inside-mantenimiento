import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
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
  const [verificandoSesion, setVerificandoSesion] =
  useState(true);

  const [ordenes, setOrdenes] = useState([]);

const [equiposPorOrden, setEquiposPorOrden] = useState({});
  
  
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
const cargarDatosDesdeSupabase = async () => {
  try {
    const [
      respuestaClientes,
      respuestaOrdenes,
      respuestaEquipos,
      respuestaResultados,
    ] = await Promise.all([
      supabase
        .from("clientes")
        .select("*"),

      supabase
        .from("ordenes")
        .select("*")
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("equipos")
        .select("*"),

      supabase
        .from("resultados_equipo")
        .select("*"),
    ]);

    if (respuestaClientes.error) {
      console.error(
        "ERROR CLIENTES:",
        respuestaClientes.error
      );
      return false;
    }

    if (respuestaOrdenes.error) {
      console.error(
        "ERROR ORDENES:",
        respuestaOrdenes.error
      );
      return false;
    }

    if (respuestaEquipos.error) {
      console.error(
        "ERROR EQUIPOS:",
        respuestaEquipos.error
      );
      return false;
    }

    if (respuestaResultados.error) {
      console.error(
        "ERROR RESULTADOS:",
        respuestaResultados.error
      );
      return false;
    }

    const clientes =
      respuestaClientes.data || [];

    const ordenesBD =
      respuestaOrdenes.data || [];

    const equiposBD =
      respuestaEquipos.data || [];

    const resultadosBD =
      respuestaResultados.data || [];

    /*
      Crear un mapa de clientes.

      Esto nos permite encontrar rápidamente
      el nombre y abreviatura usando cliente_id.
    */

    const clientesPorId = {};

    clientes.forEach((cliente) => {
      clientesPorId[cliente.id] = cliente;
    });

    /*
      Crear un mapa de resultados técnicos.
    */

    const resultadosPorEquipo = {};

    resultadosBD.forEach((resultado) => {
      resultadosPorEquipo[
        resultado.equipo_id
      ] = resultado;
    });

    /*
      Convertir las órdenes de Supabase
      al formato que usa nuestra aplicación.
    */

    const ordenesParaApp =
      ordenesBD.map((orden) => {
        const cliente =
          clientesPorId[orden.cliente_id];

        return {
          id: orden.id,

          numero: orden.numero,

          cliente:
            cliente?.nombre ||
            "Cliente no identificado",

          abreviatura:
            cliente?.abreviatura || "",

          ubicacion:
            orden.ubicacion,

          fecha:
            orden.fecha,

          observaciones:
            orden.observaciones || "",

          estado:
            orden.estado,

          equipos: 0,

          progreso: 0,
        };
      });

    /*
      Relacionar ID de la orden
      con número de orden.
    */

    const numeroOrdenPorId = {};

    ordenesParaApp.forEach((orden) => {
      numeroOrdenPorId[orden.id] =
        orden.numero;
    });

    /*
      Construir equiposPorOrden
    */

    const equiposAgrupados = {};

    ordenesParaApp.forEach((orden) => {
      equiposAgrupados[orden.numero] = [];
    });

    equiposBD.forEach((equipo) => {
      const numeroOrden =
        numeroOrdenPorId[equipo.orden_id];

      if (!numeroOrden) return;

      const resultado =
        resultadosPorEquipo[equipo.id];

      const equipoParaApp = {
        id: equipo.id,

        codigoInterno:
          equipo.codigo_interno,

        categoria:
          equipo.categoria,

        modelo:
          equipo.modelo,

        serial:
          equipo.serial || "",

        tecnico:
          equipo.tecnico || "",

        estado:
          equipo.estado,

        origen:
          equipo.origen,

        agregadoPor:
          equipo.agregado_por,

        fechaAgregado:
          equipo.fecha_agregado,

        checklist:
          resultado?.checklist ||
          equipo.checklist ||
          null,

        diagnostico:
          resultado?.diagnostico ||
          equipo.diagnostico ||
          null,

        fechaFinalizacion:
          resultado?.fecha_finalizacion ||
          equipo.fecha_finalizacion ||
          null,
      };

      equiposAgrupados[
        numeroOrden
      ].push(equipoParaApp);
    });

    setOrdenes(ordenesParaApp);

    setEquiposPorOrden(
      equiposAgrupados
    );

    return true;
  } catch (error) {
    console.error(
      "ERROR CARGANDO DATOS:",
      error
    );

    return false;
  }
};

  const ingresar = async () => {
  if (!pin.trim()) {
    alert("Ingresa el PIN.");
    return;
  }

  if (
    tipoAcceso === "tecnico" &&
    !nombreTecnico.trim()
  ) {
    alert("Ingresa el nombre del técnico.");
    return;
  }

  const email =
    tipoAcceso === "administrador"
      ? "insidepanama@zohomail.com"
      : "soporte-inside@zohomail.com";

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password: pin.trim(),
    });

  if (error) {
    console.error("ERROR LOGIN:", error);

    alert(
      "No fue posible iniciar sesión. Verifica el PIN."
    );

    return;
  }

  const userId = data.user?.id;

  if (!userId) {
    alert(
      "No fue posible identificar el usuario."
    );
    return;
  }

  const {
    data: perfil,
    error: errorPerfil,
  } = await supabase
    .from("perfiles")
    .select("rol, activo")
    .eq("id", userId)
    .single();

  if (errorPerfil || !perfil) {
    console.error(
      "ERROR PERFIL:",
      errorPerfil
    );

    await supabase.auth.signOut();

    alert(
      "No se pudo obtener el perfil del usuario."
    );

    return;
  }

  if (!perfil.activo) {
    await supabase.auth.signOut();

    alert(
      "Este usuario se encuentra desactivado."
    );

    return;
  }

  if (perfil.rol !== tipoAcceso) {
    await supabase.auth.signOut();

    alert(
      "El tipo de acceso seleccionado no corresponde a este usuario."
    );

    return;
  }

  const datosCargados =
  await cargarDatosDesdeSupabase();

if (!datosCargados) {
  alert(
    "Se inició sesión, pero no fue posible cargar la información."
  );
  return;
}
if (perfil.rol === "tecnico") {
  localStorage.setItem(
    "inside_nombre_tecnico",
    nombreTecnico.trim()
  );
} else {
  localStorage.removeItem(
    "inside_nombre_tecnico"
  );
}

setPin("");
setPantalla("ordenes");
};

useEffect(() => {
  const restaurarSesion = async () => {
    try {
      const {
        data: { session },
        error: errorSesion,
      } = await supabase.auth.getSession();

      if (errorSesion) {
        console.error(
          "ERROR RECUPERANDO SESION:",
          errorSesion
        );

        setVerificandoSesion(false);
        return;
      }

      /*
        Si no hay sesión activa,
        mostramos el Login normalmente.
      */

      if (!session?.user) {
        setVerificandoSesion(false);
        return;
      }

      /*
        Consultar el perfil correspondiente
        al usuario autenticado.
      */

      const {
        data: perfil,
        error: errorPerfil,
      } = await supabase
        .from("perfiles")
        .select("rol, activo")
        .eq("id", session.user.id)
        .single();

      if (
        errorPerfil ||
        !perfil ||
        !perfil.activo
      ) {
        console.error(
          "ERROR RESTAURANDO PERFIL:",
          errorPerfil
        );

        await supabase.auth.signOut();

        setVerificandoSesion(false);
        return;
      }

      /*
        Restaurar rol.
      */

      setTipoAcceso(perfil.rol);

      /*
        Si es técnico, recuperar su nombre.
      */

      if (perfil.rol === "tecnico") {
        const tecnicoGuardado =
          localStorage.getItem(
            "inside_nombre_tecnico"
          );

        if (tecnicoGuardado) {
          setNombreTecnico(
            tecnicoGuardado
          );
        } else {
          /*
            Existe sesión técnica, pero no sabemos
            qué técnico está utilizando el equipo.

            Cerramos la sesión para solicitar
            nuevamente nombre + PIN.
          */

          await supabase.auth.signOut();

          setVerificandoSesion(false);
          return;
        }
      }

      /*
        Cargar órdenes, equipos y resultados.
      */

      const datosCargados =
        await cargarDatosDesdeSupabase();

      if (!datosCargados) {
        console.error(
          "No fue posible recuperar los datos."
        );

        setVerificandoSesion(false);
        return;
      }

      setPantalla("ordenes");
    } catch (error) {
      console.error(
        "ERROR RESTAURANDO SESION:",
        error
      );
    } finally {
      setVerificandoSesion(false);
    }
  };

  restaurarSesion();
}, []);

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

const abrirEquipo = async (equipo) => {
  // Los equipos completados solo se consultan.
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

  // Evitar que dos técnicos trabajen el mismo equipo.
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
    const { error } = await supabase
      .from("equipos")
      .update({
        estado: "En proceso",
        tecnico: nombreTecnico,
      })
      .eq("id", equipo.id);

    if (error) {
      console.error(
        "ERROR TOMANDO EQUIPO:",
        error
      );

      alert(
        "No fue posible asignar el equipo. Intenta nuevamente."
      );

      return;
    }

    equipoActualizado = {
      ...equipo,
      estado: "En proceso",
      tecnico: nombreTecnico,
    };

    actualizarEquiposOrden(
      (equiposActuales) =>
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

const finalizarDiagnostico = async (
  datosDiagnostico
) => {
  if (!equipoSeleccionado) {
    return;
  }

  try {
    /*
      1. Guardar resultado técnico
    */

    const {
      error: errorResultado,
    } = await supabase
      .from("resultados_equipo")
      .upsert(
        {
          equipo_id:
            equipoSeleccionado.id,

          tecnico:
            nombreTecnico,

          checklist:
            checklistActual,

          diagnostico:
            datosDiagnostico,

          fecha_finalizacion:
            new Date().toISOString(),

          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict: "equipo_id",
        }
      );

    if (errorResultado) {
      console.error(
        "ERROR GUARDANDO RESULTADO:",
        errorResultado
      );

      alert(
        "No fue posible guardar el resultado técnico."
      );

      return;
    }

    /*
      2. Marcar equipo como completado
    */

    const fechaFinalizacion =
      new Date().toISOString();

    const {
      error: errorEquipo,
    } = await supabase
      .from("equipos")
      .update({
        estado: "Completado",
        tecnico: nombreTecnico,
        fecha_finalizacion:
          fechaFinalizacion,
      })
      .eq(
        "id",
        equipoSeleccionado.id
      );

    if (errorEquipo) {
      console.error(
        "ERROR COMPLETANDO EQUIPO:",
        errorEquipo
      );

      alert(
        "El diagnóstico fue guardado, pero no fue posible actualizar el estado del equipo."
      );

      return;
    }

    /*
      3. Actualizar la interfaz
    */

    actualizarEquiposOrden(
      (equiposActuales) =>
        equiposActuales.map((equipo) =>
          equipo.id ===
          equipoSeleccionado.id
            ? {
                ...equipo,

                estado: "Completado",

                tecnico:
                  nombreTecnico,

                checklist:
                  checklistActual,

                diagnostico:
                  datosDiagnostico,

                fechaFinalizacion,
              }
            : equipo
        )
    );

    setDiagnosticoActual(
      datosDiagnostico
    );

    alert(
      "Resultado guardado correctamente."
    );

    setEquipoSeleccionado(null);
    setChecklistActual(null);

    setPantalla("equipos");
  } catch (error) {
    console.error(
      "ERROR FINALIZANDO DIAGNÓSTICO:",
      error
    );

    alert(
      "Ocurrió un error inesperado al guardar el mantenimiento."
    );
  }
};
const crearNuevaOrden = async (
  nuevaOrden,
  nuevosEquipos
) => {
  try {
    const codigo = nuevaOrden.abreviatura
      .trim()
      .toUpperCase();

    /*
      1. Buscar si el cliente ya existe
    */

    const {
      data: clienteExistente,
      error: errorBuscarCliente,
    } = await supabase
      .from("clientes")
      .select("id, nombre, abreviatura")
      .eq("abreviatura", codigo)
      .maybeSingle();

    if (errorBuscarCliente) {
      console.error(
        "ERROR BUSCANDO CLIENTE:",
        errorBuscarCliente
      );

      alert(
        "No fue posible verificar el cliente."
      );

      return;
    }

    let clienteId;

    /*
      2. Si no existe, crear el cliente
    */

    if (!clienteExistente) {
      const {
        data: clienteCreado,
        error: errorCrearCliente,
      } = await supabase
        .from("clientes")
        .insert({
          nombre: nuevaOrden.cliente,
          abreviatura: codigo,
        })
        .select()
        .single();

      if (errorCrearCliente) {
        console.error(
          "ERROR CREANDO CLIENTE:",
          errorCrearCliente
        );

        alert(
          "No fue posible crear el cliente."
        );

        return;
      }

      clienteId = clienteCreado.id;
    } else {
      clienteId = clienteExistente.id;
    }

    /*
      3. Calcular el número real de la orden
         usando las órdenes guardadas en Supabase
    */

    const año = nuevaOrden.fecha.substring(0, 4);

    const {
      data: ultimaOrden,
      error: errorUltimaOrden,
    } = await supabase
      .from("ordenes")
      .select("numero")
      .like(
        "numero",
        `${codigo}-${año}-%`
      )
      .order("numero", {
        ascending: false,
      })
      .limit(1);

    if (errorUltimaOrden) {
      console.error(
        "ERROR BUSCANDO ORDENES:",
        errorUltimaOrden
      );

      alert(
        "No fue posible calcular el número de la orden."
      );

      return;
    }

    let siguienteNumero = 1;

    if (
      ultimaOrden &&
      ultimaOrden.length > 0
    ) {
      const partes =
        ultimaOrden[0].numero.split("-");

      const ultimoConsecutivo = Number(
        partes[partes.length - 1]
      );

      if (!Number.isNaN(ultimoConsecutivo)) {
        siguienteNumero =
          ultimoConsecutivo + 1;
      }
    }

    const numeroOrden =
      `${codigo}-${año}-${String(
        siguienteNumero
      ).padStart(4, "0")}`;

    /*
      4. Crear la orden
    */

    const {
      data: ordenCreada,
      error: errorOrden,
    } = await supabase
      .from("ordenes")
      .insert({
        numero: numeroOrden,
        cliente_id: clienteId,
        ubicacion: nuevaOrden.ubicacion,
        fecha: nuevaOrden.fecha,
        observaciones:
          nuevaOrden.observaciones || null,
        estado: "En proceso",
      })
      .select()
      .single();

    if (errorOrden) {
      console.error(
        "ERROR CREANDO ORDEN:",
        errorOrden
      );

      alert(
        "No fue posible crear la orden."
      );

      return;
    }

    /*
      5. Preparar los equipos para Supabase
    */

    const equiposParaGuardar =
      nuevosEquipos.map((equipo) => ({
        orden_id: ordenCreada.id,

        codigo_interno:
          equipo.codigoInterno,

        categoria: equipo.categoria,

        modelo: equipo.modelo,

        serial: equipo.serial || null,

        tecnico: null,

        estado: "Pendiente",

        origen:
          equipo.origen || "Planificado",

        agregado_por:
          equipo.agregadoPor ||
          "Administrador",

        fecha_agregado:
          equipo.fechaAgregado ||
          new Date().toISOString(),
      }));

    /*
      6. Guardar los equipos
    */

    const {
      data: equiposGuardados,
      error: errorEquipos,
    } = await supabase
      .from("equipos")
      .insert(equiposParaGuardar)
      .select();

    if (errorEquipos) {
      console.error(
        "ERROR CREANDO EQUIPOS:",
        errorEquipos
      );

      alert(
        "La orden fue creada, pero ocurrió un error al guardar los equipos."
      );

      return;
    }

    /*
      7. Convertir los datos de Supabase
         al formato que actualmente usa React
    */

    const ordenParaApp = {
      ...nuevaOrden,

      id: ordenCreada.id,

      numero: numeroOrden,

      equipos: equiposGuardados.length,

      progreso: 0,

      estado: "En proceso",
    };

    const equiposParaApp =
      equiposGuardados.map((equipo) => ({
        id: equipo.id,

        codigoInterno:
          equipo.codigo_interno,

        categoria: equipo.categoria,

        modelo: equipo.modelo,

        serial: equipo.serial || "",

        tecnico: equipo.tecnico || "",

        estado: equipo.estado,

        origen: equipo.origen,

        agregadoPor:
          equipo.agregado_por,

        fechaAgregado:
          equipo.fecha_agregado,
      }));

    /*
      8. Actualizar React
    */

    setOrdenes((actuales) => [
      ...actuales,
      ordenParaApp,
    ]);

    setEquiposPorOrden(
      (estadoActual) => ({
        ...estadoActual,

        [numeroOrden]:
          equiposParaApp,
      })
    );

    setOrdenSeleccionada(
      ordenParaApp
    );

    setPantalla("equipos");

    alert(
      `Orden ${numeroOrden} creada correctamente.`
    );
  } catch (error) {
    console.error(
      "ERROR INESPERADO:",
      error
    );

    alert(
      "Ocurrió un error inesperado al crear la orden."
    );
  }
};
const guardarSerialEquipo = async (serial) => {
  if (!equipoSeleccionado) return false;

  const { error } = await supabase
    .from("equipos")
    .update({
      serial,
    })
    .eq("id", equipoSeleccionado.id);

  if (error) {
    console.error(
      "ERROR GUARDANDO SERIAL:",
      error
    );

    alert(
      "No fue posible guardar el número de serie."
    );

    return false;
  }

  const equipoActualizado = {
    ...equipoSeleccionado,
    serial,
  };

  actualizarEquiposOrden(
    (equiposActuales) =>
      equiposActuales.map((equipo) =>
        equipo.id === equipoSeleccionado.id
          ? equipoActualizado
          : equipo
      )
  );

  setEquipoSeleccionado(
    equipoActualizado
  );

  return true;
};
const agregarEquiposAOrden = async ({
  categoria,
  modelo,
  cantidad,
}) => {
  if (!ordenSeleccionada?.id) {
    alert(
      "No fue posible identificar la orden en la base de datos."
    );
    return;
  }

  try {
    const usuario =
      tipoAcceso === "tecnico"
        ? nombreTecnico
        : "Administrador";

    /*
      1. Consultar los códigos actuales
         directamente desde Supabase
    */

    const {
      data: equiposExistentes,
      error: errorConsulta,
    } = await supabase
      .from("equipos")
      .select("codigo_interno")
      .eq(
        "orden_id",
        ordenSeleccionada.id
      );

    if (errorConsulta) {
      console.error(
        "ERROR CONSULTANDO EQUIPOS:",
        errorConsulta
      );

      alert(
        "No fue posible consultar los equipos actuales."
      );

      return;
    }

    /*
      2. Encontrar el último número EQ
    */

    const numerosExistentes =
      (equiposExistentes || []).map(
        (equipo) => {
          const numero = Number(
            equipo.codigo_interno?.replace(
              "EQ-",
              ""
            )
          );

          return Number.isNaN(numero)
            ? 0
            : numero;
        }
      );

    const ultimoNumero =
      numerosExistentes.length > 0
        ? Math.max(...numerosExistentes)
        : 0;

    /*
      3. Preparar equipos nuevos
    */

    const fechaAgregado =
      new Date().toISOString();

    const equiposNuevos =
      Array.from(
        { length: cantidad },
        (_, index) => ({
          orden_id:
            ordenSeleccionada.id,

          codigo_interno: `EQ-${String(
            ultimoNumero + index + 1
          ).padStart(3, "0")}`,

          categoria,

          modelo,

          serial: null,

          tecnico: null,

          estado: "Pendiente",

          origen: "Adicional",

          agregado_por: usuario,

          fecha_agregado:
            fechaAgregado,
        })
      );

    /*
      4. Guardar en Supabase
    */

    const {
      data: equiposGuardados,
      error: errorGuardar,
    } = await supabase
      .from("equipos")
      .insert(equiposNuevos)
      .select();

    if (errorGuardar) {
      console.error(
        "ERROR AGREGANDO EQUIPOS:",
        errorGuardar
      );

      alert(
        "No fue posible agregar los equipos a la orden."
      );

      return;
    }

    /*
      5. Convertirlos al formato de React
    */

    const equiposParaApp =
      equiposGuardados.map(
        (equipo) => ({
          id: equipo.id,

          codigoInterno:
            equipo.codigo_interno,

          categoria:
            equipo.categoria,

          modelo:
            equipo.modelo,

          serial:
            equipo.serial || "",

          tecnico:
            equipo.tecnico || "",

          estado:
            equipo.estado,

          origen:
            equipo.origen,

          agregadoPor:
            equipo.agregado_por,

          fechaAgregado:
            equipo.fecha_agregado,

          checklist: null,

          diagnostico: null,

          fechaFinalizacion: null,
        })
      );

    /*
      6. Actualizar la pantalla
    */

    actualizarEquiposOrden(
      (equiposActuales) => [
        ...equiposActuales,
        ...equiposParaApp,
      ]
    );

    alert(
      `${cantidad} equipo(s) agregado(s) correctamente.`
    );

    setPantalla("equipos");
  } catch (error) {
    console.error(
      "ERROR INESPERADO AGREGANDO EQUIPOS:",
      error
    );

    alert(
      "Ocurrió un error inesperado al agregar los equipos."
    );
  }
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


if (verificandoSesion) {
  return (
    <div className="app">
      <main className="login-container">
        <div className="session-loading">
          Cargando...
        </div>
      </main>
    </div>
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
      ordenId={ordenSeleccionada.id}
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

