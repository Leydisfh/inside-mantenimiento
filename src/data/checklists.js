export const checklistsPorCategoria = {
  "Terminal móvil": [
    {
      grupo: "Inspección y limpieza",
      items: [
        "Limpieza de teclado y botones",
        "Limpieza de pantalla",
        "Limpieza de gatillo",
        "Limpieza de ventana del scanner",
        "Limpieza del compartimiento de batería",
        "Limpieza de contactos de carga",
        "Inspección de carcasa",
        "Limpieza exterior",
      ],
    },
    {
      grupo: "Pruebas funcionales",
      items: [
        "Encendido correcto",
        "Pantalla",
        "Touch",
        "Teclado y botones",
        "Gatillo",
        "Lectura de código de barras",
        "Wi-Fi",
        "Bluetooth",
        "Batería",
        "Carga en cradle",
        "Reinicio correcto",
        "Sistema inicia sin errores",
      ],
    },
  ],

  Impresora: [
    {
      grupo: "Inspección y limpieza",
      items: [
        "Limpieza interior",
        "Limpieza de cabezal",
        "Limpieza de platen roller",
        "Limpieza de sensores",
        "Limpieza del recorrido del medio",
        "Inspección de cabezal",
        "Inspección de rodillos",
        "Inspección de carcasa y mecanismos",
        "Limpieza exterior",
      ],
    },
    {
      grupo: "Pruebas funcionales",
      items: [
        "Encendido correcto",
        "Pantalla y controles",
        "Detección del medio",
        "Detección de ribbon",
        "Feed",
        "Calibración",
        "Impresión de prueba",
        "Calidad de impresión",
        "Alineación",
        "Conectividad",
        "Sensores",
        "Errores o alertas",
      ],
    },
  ],

  Scanner: [
    {
      grupo: "Inspección y limpieza",
      items: [
        "Limpieza de ventana de lectura",
        "Limpieza de gatillo",
        "Limpieza de contactos",
        "Inspección de carcasa",
        "Inspección de cable o conector",
        "Limpieza exterior",
      ],
    },
    {
      grupo: "Pruebas funcionales",
      items: [
        "Encendido",
        "Gatillo",
        "Lectura de código 1D",
        "Lectura de código 2D",
        "Calidad de lectura",
        "Conectividad",
        "Indicadores LED",
        "Alertas sonoras",
      ],
    },
  ],

  RFID: [
    {
      grupo: "Inspección y limpieza",
      items: [
        "Limpieza de contactos",
        "Inspección de gatillo",
        "Inspección de carcasa",
        "Inspección de batería",
        "Limpieza exterior",
      ],
    },
    {
      grupo: "Pruebas funcionales",
      items: [
        "Encendido",
        "Gatillo",
        "Comunicación con dispositivo host",
        "Lectura RFID",
        "Lectura consecutiva de etiquetas RFID",
        "Estabilidad de conexión",
        "Bluetooth",
        "Batería",
        "Carga",
        "Indicadores LED",
      ],
    },
  ],

  Cradle: [
    {
      grupo: "Inspección y limpieza",
      items: [
        "Limpieza de slots",
        "Limpieza de contactos",
        "Inspección de fuente de alimentación",
        "Inspección de cableado",
        "Inspección física",
        "Limpieza exterior",
      ],
    },
    {
      grupo: "Pruebas funcionales",
      items: [
        "Alimentación eléctrica",
        "Detección del equipo",
        "Inicio de carga",
        "Estabilidad de carga",
        "Indicadores LED",
        "Prueba de todos los slots",
        "Carga simultánea",
      ],
    },
  ],

  Otro: [
    {
      grupo: "Inspección general",
      items: [
        "Inspección física",
        "Conectores",
        "Cableado",
        "Limpieza exterior",
      ],
    },
    {
      grupo: "Pruebas funcionales",
      items: [
        "Encendido",
        "Funcionamiento general",
        "Conectividad",
        "Errores o alertas",
      ],
    },
  ],
};


/*
  Pruebas adicionales según modelo.

  IMPORTANTE:
  El modelo se guarda en minúsculas para evitar problemas
  si el administrador escribe Zebra MC330L, zebra mc330l, etc.
*/

export const pruebasPorModelo = {
  "zebra mc330l": [
    "Prueba individual de teclas",
    "Prueba de botones laterales",
    "Prueba repetitiva del gatillo de escaneo",
  ],

  "zebra tc22": [
    "Prueba de botones laterales",
    "Prueba de cámara",
    "Prueba del puerto de carga",
  ],

  "zebra rfd40": [
    "Prueba de conexión con terminal móvil",
    "Prueba repetitiva de lectura RFID",
  ],

  "zebra zt411": [
    "Prueba de mecanismo de apertura del cabezal",
    "Prueba prolongada de impresión",
    "Verificación del sistema de ribbon",
  ],

  "zebra zd621": [
    "Prueba prolongada de impresión",
    "Verificación del mecanismo de cierre",
  ],
};


/*
  Esta función combina:

  1. Checklist estándar de la categoría
  2. Pruebas adicionales del modelo
*/

export function obtenerChecklist(categoria, modelo) {
  const checklistBase =
    checklistsPorCategoria[categoria] ||
    checklistsPorCategoria["Otro"];

  const modeloNormalizado = (modelo || "")
    .trim()
    .toLowerCase();

  const pruebasEspecificas =
    pruebasPorModelo[modeloNormalizado] || [];

  if (pruebasEspecificas.length === 0) {
    return checklistBase;
  }

  return [
    ...checklistBase,
    {
      grupo: "Pruebas específicas del modelo",
      items: pruebasEspecificas,
    },
  ];
}