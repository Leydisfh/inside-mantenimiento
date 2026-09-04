import { jsPDF } from "jspdf";
import logoInside from "../assets/logo.jpg";
import {
  obtenerUrlEvidencia,
} from "./evidenciasStorage";

const margen = 15;
const anchoPagina = 210;
const altoPagina = 297;

const limpiarNombreArchivo = (texto) =>
  String(texto || "informe")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-");

const asegurarEspacio = (
  doc,
  y,
  espacioNecesario,
  orden
) => {
  if (y + espacioNecesario > 275) {
    doc.addPage();

    doc.setFontSize(8);
    doc.setTextColor(110, 120, 135);

    doc.text(
      `Inside Panamá - ${orden.numero}`,
      margen,
      12
    );

    return 22;
  }

  return y;
};

const agregarTitulo = (
  doc,
  titulo,
  y,
  orden
) => {
  y = asegurarEspacio(
    doc,
    y,
    15,
    orden
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(16, 41, 75);

  doc.text(titulo, margen, y);

  doc.setDrawColor(215, 223, 232);

  doc.line(
    margen,
    y + 3,
    anchoPagina - margen,
    y + 3
  );

  return y + 10;
};

const agregarCampo = (
  doc,
  etiqueta,
  valor,
  y,
  orden
) => {
  const texto = String(
    valor || "No registrado"
  );

  const lineas = doc.splitTextToSize(
    texto,
    125
  );

  const altura =
    Math.max(1, lineas.length) * 4.5;

  y = asegurarEspacio(
    doc,
    y,
    altura + 4,
    orden
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(110, 120, 135);

  doc.text(etiqueta, margen, y);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(9);
  doc.setTextColor(35, 55, 78);

  doc.text(
    lineas,
    margen + 45,
    y
  );

  return y + altura + 2;
};
const cargarImagen = (src) =>
  new Promise((resolve, reject) => {
    const imagen = new Image();

    imagen.onload = () => {
      const canvas =
        document.createElement("canvas");

      canvas.width = imagen.width;
      canvas.height = imagen.height;

      const contexto =
        canvas.getContext("2d");

      contexto.drawImage(
        imagen,
        0,
        0
      );

      resolve(
        canvas.toDataURL(
          "image/jpeg",
          0.9
        )
      );
    };

    imagen.onerror = reject;

    imagen.src = src;
  });
  const prepararEvidenciaPDF = async (evidencia) => {
  if (!evidencia) return null;

  try {
    const url =
      await obtenerUrlEvidencia(evidencia);

    if (!url) return null;

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(
        "No fue posible descargar la evidencia."
      );
    }

    const blob = await respuesta.blob();

    const objectUrl =
      URL.createObjectURL(blob);

    try {
      const imagen =
        await new Promise(
          (resolve, reject) => {
            const img = new Image();

            img.onload = () =>
              resolve(img);

            img.onerror = reject;

            img.src = objectUrl;
          }
        );

      /*
        Reducimos imágenes grandes tomadas
        desde celulares para evitar PDFs pesados.
      */

      const maximo = 1400;

      const escala = Math.min(
        1,
        maximo / imagen.width,
        maximo / imagen.height
      );

      const canvas =
        document.createElement("canvas");

      canvas.width = Math.round(
        imagen.width * escala
      );

      canvas.height = Math.round(
        imagen.height * escala
      );

      const contexto =
        canvas.getContext("2d");

      contexto.drawImage(
        imagen,
        0,
        0,
        canvas.width,
        canvas.height
      );

      return {
        dataUrl: canvas.toDataURL(
          "image/jpeg",
          0.8
        ),

        width: canvas.width,
        height: canvas.height,
      };
    } finally {
      URL.revokeObjectURL(
        objectUrl
      );
    }
  } catch (error) {
    console.error(
      "ERROR PREPARANDO EVIDENCIA PARA PDF:",
      error
    );

    return null;
  }
};
const agregarEvidenciasPDF = async (
  doc,
  evidencias,
  y,
  orden
) => {
  const evidenciasValidas =
    evidencias.filter(
      (item) => item.evidencia
    );
    console.log(
  "EVIDENCIAS RECIBIDAS POR EL PDF:",
  evidencias
);

console.log(
  "EVIDENCIAS VALIDAS:",
  evidenciasValidas
);

  if (
    evidenciasValidas.length === 0
  ) {
    return y;
  }

  y = asegurarEspacio(
    doc,
    y,
    15,
    orden
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(9);
  doc.setTextColor(
    16,
    41,
    75
  );

  doc.text(
    "Evidencias fotográficas",
    margen,
    y
  );

  y += 7;

  /*
    Mostraremos dos imágenes por fila.
  */

  for (
    let i = 0;
    i < evidenciasValidas.length;
    i += 3
  ) {
    const fila =
      evidenciasValidas.slice(
        i,
        i + 3
      );

    const preparadas =
      await Promise.all(
        fila.map(async (item) => ({
          ...item,

          imagen:
            await prepararEvidenciaPDF(
              item.evidencia
            ),
        }))
      );

    const disponibles =
      preparadas.filter(
        (item) => item.imagen
      );

    if (disponibles.length === 0) {
      continue;
    }

    y = asegurarEspacio(
      doc,
      y,
      48,
      orden
    );

    for (
      let columna = 0;
      columna < disponibles.length;
      columna += 1
    ) {
      const item =
        disponibles[columna];

      const x =
        margen +
        columna * 65;

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(7.5);
      doc.setTextColor(
        100,
        112,
        128
      );

      const titulo =
        doc.splitTextToSize(
          item.nombre,
          82
        );

      doc.text(
        titulo,
        x,
        y
      );

      const maxWidth = 82;
      const maxHeight = 43;

      const relacion =
        item.imagen.width /
        item.imagen.height;

      let anchoImagen =
        maxWidth;

      let altoImagen =
        anchoImagen / relacion;

      if (
        altoImagen > maxHeight
      ) {
        altoImagen =
          maxHeight;

        anchoImagen =
          altoImagen *
          relacion;
      }

      doc.addImage(
        item.imagen.dataUrl,
        "JPEG",
        x,
        y + 6,
        anchoImagen,
        altoImagen
      );
    }

    y += 56;
  }

  return y;
};

export const generarInformePDF = async (
  orden,
  equipos
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const completados = equipos.filter(
    (equipo) =>
      equipo.estado === "Completado"
  );

  const operativos = completados.filter(
    (equipo) =>
      equipo.diagnostico?.estadoFinal ===
      "Operativo"
  );

  const conObservaciones =
    completados.filter(
      (equipo) =>
        equipo.diagnostico?.estadoFinal ===
        "Operativo con observaciones"
    );

  const reparacion = completados.filter(
    (equipo) =>
      equipo.diagnostico?.estadoFinal ===
      "Requiere reparación"
  );

  const fueraServicio =
    completados.filter(
      (equipo) =>
        equipo.diagnostico?.estadoFinal ===
        "Fuera de servicio"
    );

  const atencion = [
    ...fueraServicio,
    ...reparacion,
    ...conObservaciones,
  ];
  
 let y = 18;

// =====================================
// ENCABEZADO CON LOGO
// =====================================

try {
  const logoBase64 =
    await cargarImagen(logoInside);

  doc.addImage(
    logoBase64,
    "JPEG",
    margen,
    y,
    32,
    18
  );
} catch (error) {
  console.error(
    "No se pudo agregar el logo al PDF:",
    error
  );
}

doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.setTextColor(16, 41, 75);

doc.text(
  "INFORME DE MANTENIMIENTO",
  anchoPagina - margen,
  y + 6,
  {
    align: "right",
  }
);

doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.setTextColor(110, 120, 135);

doc.text(
  `Orden de servicio: ${orden.numero}`,
  anchoPagina - margen,
  y + 13,
  {
    align: "right",
  }
);

// Línea inferior del encabezado

doc.setDrawColor(215, 223, 232);

doc.line(
  margen,
  y + 21,
  anchoPagina - margen,
  y + 21
);

y += 32;

  // INFORMACIÓN GENERAL

  y = agregarTitulo(
    doc,
    "Información del servicio",
    y,
    orden
  );

  y = agregarCampo(
    doc,
    "Cliente",
    orden.cliente,
    y,
    orden
  );

  y = agregarCampo(
    doc,
    "Ubicación",
    orden.ubicacion,
    y,
    orden
  );

  y = agregarCampo(
    doc,
    "Fecha",
    orden.fecha,
    y,
    orden
  );

  y = agregarCampo(
    doc,
    "Orden",
    orden.numero,
    y,
    orden
  );

  if (orden.observaciones) {
    y = agregarCampo(
      doc,
      "Observaciones",
      orden.observaciones,
      y,
      orden
    );
  }

  // RESUMEN

  y += 5;

  y = agregarTitulo(
    doc,
    "Resumen del servicio",
    y,
    orden
  );

  const resumen = [
    ["Total de equipos", equipos.length],
    ["Operativos", operativos.length],
    [
      "Operativos con observaciones",
      conObservaciones.length,
    ],
    [
      "Requieren reparación",
      reparacion.length,
    ],
    [
      "Fuera de servicio",
      fueraServicio.length,
    ],
  ];

  resumen.forEach(
    ([nombre, cantidad]) => {
      y = asegurarEspacio(
        doc,
        y,
        7,
        orden
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(9);
      doc.setTextColor(
        80,
        95,
        112
      );

      doc.text(nombre, margen, y);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setTextColor(
        16,
        41,
        75
      );

      doc.text(
        String(cantidad),
        anchoPagina - margen,
        y,
        {
          align: "right",
        }
      );

      y += 6;
    }
  );

  // EQUIPOS CON ATENCIÓN

  y += 5;

  y = agregarTitulo(
    doc,
    "Equipos que requieren atención",
    y,
    orden
  );

  if (atencion.length === 0) {
    doc.setFontSize(9);
    doc.setTextColor(8, 124, 103);

    doc.text(
      "No se registraron equipos con incidencias.",
      margen,
      y
    );

    y += 10;
  }

  for (const equipo of atencion) {
    for (const equipo of atencion) {
  const diagnostico =
    equipo.diagnostico || {};

  const checklist =
    equipo.checklist || {};

  const evidencias =
    checklist.evidencias || {};

  const fotosFalla =
    checklist.fotosFalla || {};

  const resultados =
    checklist.resultados || {};

  const observaciones =
    checklist.observaciones || {};

  // aquí continúa el resto
  // del código del equipo
    y = asegurarEspacio(
      doc,
      y,
      35,
      orden
    );


    doc.setFillColor(
      246,
      248,
      251
    );

    doc.roundedRect(
      margen,
      y,
      180,
      17,
      2,
      2,
      "F"
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(10);
    doc.setTextColor(
      16,
      41,
      75
    );

    doc.text(
      equipo.modelo,
      margen + 4,
      y + 6
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(8);
    doc.setTextColor(
      110,
      120,
      135
    );

    doc.text(
      `SN: ${
        equipo.serial ||
        "No registrado"
      }`,
      margen + 4,
      y + 12
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setTextColor(
      166,
      66,
      66
    );

    doc.text(
      diagnostico.estadoFinal ||
        "",
      anchoPagina - margen - 4,
      y + 9,
      {
        align: "right",
      }
    );

    y += 23;

    if (diagnostico.diagnostico) {
      y = agregarCampo(
        doc,
        "Diagnóstico",
        diagnostico.diagnostico,
        y,
        orden
      );
    }

    if (
      diagnostico.fallaDetectada
    ) {
      y = agregarCampo(
        doc,
        "Falla detectada",
        diagnostico.fallaDetectada,
        y,
        orden
      );
    }

    if (diagnostico.repuesto) {
      y = agregarCampo(
        doc,
        "Repuesto requerido",
        diagnostico.repuesto,
        y,
        orden
      );
    }

    if (
      diagnostico.recomendacion
    ) {
      y = agregarCampo(
        doc,
        "Recomendación",
        diagnostico.recomendacion,
        y,
        orden
      );
    }

    y = agregarCampo(
      doc,
      "Prioridad",
      diagnostico.prioridad ||
        "No definida",
      y,
      orden
    );

    y = agregarCampo(
      doc,
      "Técnico",
      equipo.tecnico ||
        "No registrado",
      y,
      orden
    );

    /*
      Mostrar únicamente los puntos
      del checklist que fallaron.
    */


    const fallas = Object.entries(
      resultados
    ).filter(
      ([, resultado]) =>
        resultado === "Falla"
    );

    if (fallas.length > 0) {
      y += 3;

      y = asegurarEspacio(
        doc,
        y,
        10,
        orden
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(9);
      doc.setTextColor(
        16,
        41,
        75
      );

      doc.text(
        "Hallazgos del checklist",
        margen,
        y
      );

      y += 8;

      for (
        const [prueba] of fallas
      ) {
        y = asegurarEspacio(
          doc,
          y,
          12,
          orden
        );

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(8.5);
        doc.setTextColor(
          166,
          66,
          66
        );

        const pruebaLineas =
          doc.splitTextToSize(
            `• ${prueba}`,
            175
          );

        doc.text(
          pruebaLineas,
          margen + 3,
          y
        );

        y +=
          pruebaLineas.length * 4;

        if (
          observaciones[prueba]
        ) {
          doc.setFont(
            "helvetica",
            "normal"
          );

          doc.setFontSize(8);
          doc.setTextColor(
            100,
            112,
            128
          );

          const lineas =
            doc.splitTextToSize(
              observaciones[
                prueba
              ],
              168
            );

          doc.text(
            lineas,
            margen + 7,
            y
          );

          y +=
            lineas.length * 4 +
            3;
        }
      }
    
    }
   


const imagenesEquipo = [];

if (evidencias.antes) {
  imagenesEquipo.push({
    nombre: "Estado al recibir",
    evidencia: evidencias.antes,
  });
}

Object.entries(
  fotosFalla
).forEach(
  ([prueba, fotografia]) => {
    if (fotografia) {
      imagenesEquipo.push({
        nombre: `Falla: ${prueba}`,
        evidencia: fotografia,
      });
    }
  }
);

if (evidencias.despues) {
  imagenesEquipo.push({
    nombre:
      "Después del mantenimiento",
    evidencia:
      evidencias.despues,
  });
}

if (evidencias.adicional) {
  imagenesEquipo.push({
    nombre:
      "Evidencia adicional",
    evidencia:
      evidencias.adicional,
  });
}

y = await agregarEvidenciasPDF(
  doc,
  imagenesEquipo,
  y,
  orden
);

y += 7;
    

    y += 7;
  }
  

  // EQUIPOS OPERATIVOS

  y = agregarTitulo(
    doc,
    "Equipos operativos",
    y,
    orden
  );

  if (operativos.length === 0) {
    doc.setFontSize(9);
    doc.setTextColor(
      110,
      120,
      135
    );

    doc.text(
      "No hay equipos clasificados como operativos.",
      margen,
      y
    );
  } else {
    for (
      const equipo of operativos
    ) {
      y = asegurarEspacio(
        doc,
        y,
        9,
        orden
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(8.5);
      doc.setTextColor(
        35,
        55,
        78
      );

      doc.text(
        equipo.modelo,
        margen,
        y
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(
        110,
        120,
        135
      );

      doc.text(
        `SN: ${
          equipo.serial ||
          "No registrado"
        }`,
        90,
        y
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setTextColor(
        8,
        124,
        103
      );

      doc.text(
        "Operativo",
        anchoPagina - margen,
        y,
        {
          align: "right",
        }
      );

      y += 7;
    }
  }

  // PIE DE PÁGINA

  const totalPaginas =
    doc.getNumberOfPages();

  for (
    let pagina = 1;
    pagina <= totalPaginas;
    pagina += 1
  ) {
    doc.setPage(pagina);

    doc.setDrawColor(
      225,
      230,
      236
    );

    doc.line(
      margen,
      282,
      anchoPagina - margen,
      282
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(7);
    doc.setTextColor(
      120,
      130,
      145
    );

    doc.text(
      "Inside Panamá",
      margen,
      288
    );

    doc.text(
      `Página ${pagina} de ${totalPaginas}`,
      anchoPagina - margen,
      288,
      {
        align: "right",
      }
    );
  }

  const nombre =
    `Informe-${limpiarNombreArchivo(
      orden.numero
    )}.pdf`;

  doc.save(nombre);
};}