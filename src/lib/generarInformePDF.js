import { jsPDF } from "jspdf";

import logoInside from "../assets/logo.jpg";

import {
  obtenerUrlEvidencia,
} from "./evidenciasStorage";

const MARGEN = 15;
const ANCHO_PAGINA = 210;
const ALTO_PAGINA = 297;
const ANCHO_CONTENIDO =
  ANCHO_PAGINA - MARGEN * 2;

const AZUL = [16, 41, 75];
const GRIS = [102, 119, 141];
const GRIS_CLARO = [238, 242, 247];
const VERDE = [8, 124, 103];
const ROJO = [166, 66, 66];

const limpiarNombreArchivo = (texto) =>
  String(texto || "informe")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-");

const convertirImagenAJpeg = async (url) => {
  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error(
      "No fue posible descargar la imagen."
    );
  }

  const blob = await respuesta.blob();
  const objectUrl = URL.createObjectURL(blob);

  try {
    const imagen = await new Promise(
      (resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);
        img.onerror = reject;

        img.src = objectUrl;
      }
    );

    const maximo = 1600;

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
        0.82
      ),
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const cargarEvidencia = async (
  evidencia
) => {
  if (!evidencia) return null;

  try {
    const url =
      await obtenerUrlEvidencia(
        evidencia
      );

    if (!url) return null;

    return await convertirImagenAJpeg(
      url
    );
  } catch (error) {
    console.error(
      "No se pudo cargar evidencia para PDF:",
      error
    );

    return null;
  }
};

const obtenerMedidasImagen = (
  imagen,
  maxWidth,
  maxHeight
) => {
  const relacion =
    imagen.width / imagen.height;

  let width = maxWidth;
  let height = width / relacion;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * relacion;
  }

  return {
    width,
    height,
  };
};

const encabezadoContinuacion = (
  doc,
  orden
) => {
  doc.setFontSize(8);
  doc.setTextColor(...GRIS);

  doc.text(
    `Inside Panamá - ${orden.numero}`,
    MARGEN,
    10
  );

  doc.setDrawColor(220, 226, 233);

  doc.line(
    MARGEN,
    13,
    ANCHO_PAGINA - MARGEN,
    13
  );
};

const asegurarEspacio = (
  doc,
  y,
  espacio,
  orden
) => {
  if (y + espacio > 278) {
    doc.addPage();

    encabezadoContinuacion(
      doc,
      orden
    );

    return 21;
  }

  return y;
};

const agregarTituloSeccion = (
  doc,
  titulo,
  y,
  orden
) => {
  y = asegurarEspacio(
    doc,
    y,
    14,
    orden
  );

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...AZUL);

  doc.text(titulo, MARGEN, y);

  doc.setDrawColor(215, 223, 232);

  doc.line(
    MARGEN,
    y + 3,
    ANCHO_PAGINA - MARGEN,
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
  y = asegurarEspacio(
    doc,
    y,
    12,
    orden
  );

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GRIS);

  doc.text(etiqueta, MARGEN, y);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...AZUL);

  const lineas =
    doc.splitTextToSize(
      String(valor || "No registrado"),
      125
    );

  doc.text(
    lineas,
    MARGEN + 45,
    y
  );

  return (
    y +
    Math.max(
      6,
      lineas.length * 4.5
    )
  );
};

const agregarGaleria = async (
  doc,
  imagenes,
  y,
  orden
) => {
  const existentes =
    imagenes.filter(
      (imagen) => imagen.evidencia
    );

  if (existentes.length === 0) {
    return y;
  }

  y = asegurarEspacio(
    doc,
    y,
    15,
    orden
  );

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...AZUL);

  doc.text(
    "Evidencias fotográficas",
    MARGEN,
    y
  );

  y += 7;

  for (
    let i = 0;
    i < existentes.length;
    i += 2
  ) {
    const fila =
      existentes.slice(i, i + 2);

    const imagenesCargadas =
      await Promise.all(
        fila.map(async (item) => ({
          ...item,
          imagen:
            await cargarEvidencia(
              item.evidencia
            ),
        }))
      );

    const imagenesValidas =
      imagenesCargadas.filter(
        (item) => item.imagen
      );

    if (
      imagenesValidas.length === 0
    ) {
      continue;
    }

    y = asegurarEspacio(
      doc,
      y,
      58,
      orden
    );

    for (
      let columna = 0;
      columna < imagenesValidas.length;
      columna += 1
    ) {
      const item =
        imagenesValidas[columna];

      const x =
        MARGEN +
        columna * 90;

      doc.setFontSize(7.5);
      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setTextColor(...GRIS);

      const etiqueta =
        doc.splitTextToSize(
          item.nombre,
          82
        );

      doc.text(
        etiqueta,
        x,
        y
      );

      const medidas =
        obtenerMedidasImagen(
          item.imagen,
          82,
          45
        );

      doc.addImage(
        item.imagen.dataUrl,
        "JPEG",
        x,
        y + 5,
        medidas.width,
        medidas.height
      );
    }

    y += 57;
  }

  return y;
};

export const generarInformePDF =
  async (orden, equipos) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const completados =
      equipos.filter(
        (equipo) =>
          equipo.estado ===
          "Completado"
      );

    const operativos =
      completados.filter(
        (equipo) =>
          equipo.diagnostico
            ?.estadoFinal ===
          "Operativo"
      );

    const conObservaciones =
      completados.filter(
        (equipo) =>
          equipo.diagnostico
            ?.estadoFinal ===
          "Operativo con observaciones"
      );

    const requierenReparacion =
      completados.filter(
        (equipo) =>
          equipo.diagnostico
            ?.estadoFinal ===
          "Requiere reparación"
      );

    const fueraServicio =
      completados.filter(
        (equipo) =>
          equipo.diagnostico
            ?.estadoFinal ===
          "Fuera de servicio"
      );

    const requierenAtencion = [
      ...fueraServicio,
      ...requierenReparacion,
      ...conObservaciones,
    ];

    let y = 15;

    /*
      LOGO
    */

    try {
      const logo =
        await convertirImagenAJpeg(
          logoInside
        );

      const medidasLogo =
        obtenerMedidasImagen(
          logo,
          35,
          16
        );

      doc.addImage(
        logo.dataUrl,
        "JPEG",
        MARGEN,
        y,
        medidasLogo.width,
        medidasLogo.height
      );
    } catch (error) {
      console.error(
        "No se pudo cargar el logo:",
        error
      );
    }

    /*
      ENCABEZADO
    */

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(16);
    doc.setTextColor(...AZUL);

    doc.text(
      "INFORME DE MANTENIMIENTO",
      ANCHO_PAGINA - MARGEN,
      y + 6,
      {
        align: "right",
      }
    );

    doc.setFontSize(9);
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setTextColor(...GRIS);

    doc.text(
      orden.numero,
      ANCHO_PAGINA - MARGEN,
      y + 13,
      {
        align: "right",
      }
    );

    y += 28;

    /*
      INFORMACIÓN GENERAL
    */

    y = agregarTituloSeccion(
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

    /*
      RESUMEN
    */

    y += 4;

    y = agregarTituloSeccion(
      doc,
      "Resumen del servicio",
      y,
      orden
    );

    const resumen = [
      {
        nombre: "Total",
        valor: equipos.length,
      },
      {
        nombre: "Operativos",
        valor: operativos.length,
      },
      {
        nombre: "Con observ.",
        valor:
          conObservaciones.length,
      },
      {
        nombre: "Reparación",
        valor:
          requierenReparacion.length,
      },
      {
        nombre: "Fuera servicio",
        valor:
          fueraServicio.length,
      },
    ];

    const anchoCaja = 34;
    const separacion = 2.5;

    resumen.forEach(
      (item, index) => {
        const x =
          MARGEN +
          index *
            (anchoCaja +
              separacion);

        doc.setFillColor(
          ...GRIS_CLARO
        );

        doc.roundedRect(
          x,
          y,
          anchoCaja,
          20,
          2,
          2,
          "F"
        );

        doc.setFontSize(7);
        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setTextColor(
          ...GRIS
        );

        doc.text(
          item.nombre,
          x + anchoCaja / 2,
          y + 6,
          {
            align: "center",
          }
        );

        doc.setFontSize(14);
        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setTextColor(
          ...AZUL
        );

        doc.text(
          String(item.valor),
          x + anchoCaja / 2,
          y + 15,
          {
            align: "center",
          }
        );
      }
    );

    y += 29;

    /*
      EQUIPOS QUE REQUIEREN ATENCIÓN
    */

    y = agregarTituloSeccion(
      doc,
      "Equipos que requieren atención",
      y,
      orden
    );

    if (
      requierenAtencion.length === 0
    ) {
      doc.setFontSize(9);
      doc.setTextColor(...VERDE);

      doc.text(
        "No se registraron equipos con incidencias.",
        MARGEN,
        y
      );

      y += 9;
    }

    for (
      const equipo of requierenAtencion
    ) {
      y = asegurarEspacio(
        doc,
        y,
        32,
        orden
      );

      const diagnostico =
        equipo.diagnostico || {};

      const checklist =
        equipo.checklist || {};

      const resultados =
        checklist.resultados || {};

      const observaciones =
        checklist.observaciones ||
        {};

      const fotosFalla =
        checklist.fotosFalla || {};

      const evidencias =
        checklist.evidencias || {};

      /*
        CABECERA DEL EQUIPO
      */

      doc.setFillColor(
        248,
        250,
        252
      );

      doc.roundedRect(
        MARGEN,
        y,
        ANCHO_CONTENIDO,
        18,
        2,
        2,
        "F"
      );

      doc.setFontSize(11);
      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setTextColor(...AZUL);

      doc.text(
        equipo.modelo,
        MARGEN + 4,
        y + 7
      );

      doc.setFontSize(8);
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(...GRIS);

      doc.text(
        `SN: ${
          equipo.serial ||
          "No registrado"
        }`,
        MARGEN + 4,
        y + 13
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setTextColor(...ROJO);

      doc.text(
        diagnostico.estadoFinal ||
          "",
        ANCHO_PAGINA -
          MARGEN -
          4,
        y + 9,
        {
          align: "right",
        }
      );

      y += 24;

      /*
        DIAGNÓSTICO
      */

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
        SOLO LOS PUNTOS DEL CHECKLIST
        QUE PRESENTARON FALLA
      */

      const fallasChecklist =
        Object.entries(
          resultados
        ).filter(
          ([, resultado]) =>
            resultado === "Falla"
        );

      if (
        fallasChecklist.length > 0
      ) {
        y = asegurarEspacio(
          doc,
          y,
          12,
          orden
        );

        doc.setFontSize(9);
        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setTextColor(...AZUL);

        doc.text(
          "Hallazgos del checklist",
          MARGEN,
          y
        );

        y += 6;

        for (
          const [
            prueba,
          ] of fallasChecklist
        ) {
          y = asegurarEspacio(
            doc,
            y,
            12,
            orden
          );

          doc.setFontSize(8.5);
          doc.setFont(
            "helvetica",
            "bold"
          );

          doc.setTextColor(
            ...ROJO
          );

          doc.text(
            `- ${prueba}`,
            MARGEN + 3,
            y
          );

          y += 5;

          if (
            observaciones[prueba]
          ) {
            doc.setFontSize(8);
            doc.setFont(
              "helvetica",
              "normal"
            );

            doc.setTextColor(
              ...GRIS
            );

            const lineas =
              doc.splitTextToSize(
                observaciones[
                  prueba
                ],
                165
              );

            doc.text(
              lineas,
              MARGEN + 7,
              y
            );

            y +=
              lineas.length *
                4 +
              3;
          }
        }
      }

      /*
        EVIDENCIAS DEL EQUIPO
      */

      const imagenes = [];

      if (evidencias.antes) {
        imagenes.push({
          nombre:
            "Estado al recibir",
          evidencia:
            evidencias.antes,
        });
      }

      Object.entries(
        fotosFalla
      ).forEach(
        ([prueba, foto]) => {
          if (foto) {
            imagenes.push({
              nombre:
                `Falla: ${prueba}`,
              evidencia: foto,
            });
          }
        }
      );

      if (evidencias.despues) {
        imagenes.push({
          nombre:
            "Después del mantenimiento",
          evidencia:
            evidencias.despues,
        });
      }

      if (evidencias.adicional) {
        imagenes.push({
          nombre:
            "Evidencia adicional",
          evidencia:
            evidencias.adicional,
        });
      }

      y = await agregarGaleria(
        doc,
        imagenes,
        y,
        orden
      );

      y += 8;
    }

    /*
      EQUIPOS OPERATIVOS
    */

    y = agregarTituloSeccion(
      doc,
      "Equipos operativos",
      y,
      orden
    );

    if (operativos.length === 0) {
      doc.setFontSize(9);
      doc.setTextColor(...GRIS);

      doc.text(
        "No hay equipos clasificados como operativos.",
        MARGEN,
        y
      );

      y += 8;
    } else {
      for (const equipo of operativos) {
        y = asegurarEspacio(
          doc,
          y,
          9,
          orden
        );

        doc.setFontSize(8.5);
        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setTextColor(...AZUL);

        doc.text(
          equipo.modelo,
          MARGEN,
          y
        );

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setTextColor(...GRIS);

        doc.text(
          `SN: ${
            equipo.serial ||
            "No registrado"
          }`,
          85,
          y
        );

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setTextColor(...VERDE);

        doc.text(
          "Operativo",
          ANCHO_PAGINA -
            MARGEN,
          y,
          {
            align: "right",
          }
        );

        doc.setDrawColor(
          235,
          239,
          244
        );

        doc.line(
          MARGEN,
          y + 3,
          ANCHO_PAGINA -
            MARGEN,
          y + 3
        );

        y += 8;
      }
    }

    /*
      NUMERACIÓN DE PÁGINAS
    */

    const totalPaginas =
      doc.getNumberOfPages();

    for (
      let pagina = 1;
      pagina <= totalPaginas;
      pagina += 1
    ) {
      doc.setPage(pagina);

      doc.setFontSize(7);
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(...GRIS);

      doc.text(
        "Inside Panamá",
        MARGEN,
        289
      );

      doc.text(
        `Página ${pagina} de ${totalPaginas}`,
        ANCHO_PAGINA -
          MARGEN,
        289,
        {
          align: "right",
        }
      );
    }

    /*
      DESCARGA
    */

    const nombreArchivo =
      `Informe-${limpiarNombreArchivo(
        orden.numero
      )}.pdf`;

    doc.save(nombreArchivo);
  };