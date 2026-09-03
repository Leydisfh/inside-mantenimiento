import { supabase } from "./supabaseClient";

const BUCKET = "evidencias-mantenimiento";

const limpiarNombre = (texto = "imagen") =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

const obtenerExtension = (archivo) => {
  const nombre = archivo.name || "";

  if (nombre.includes(".")) {
    return nombre.split(".").pop().toLowerCase();
  }

  if (archivo.type === "image/png") return "png";
  if (archivo.type === "image/webp") return "webp";
  if (archivo.type === "image/heic") return "heic";
  if (archivo.type === "image/heif") return "heif";

  return "jpg";
};

export const subirEvidencia = async ({
  ordenId,
  equipoId,
  carpeta,
  nombre,
  archivo,
}) => {
  if (!archivo) {
    throw new Error("No se recibió ningún archivo.");
  }

  if (!archivo.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen.");
  }

  if (archivo.size > 10 * 1024 * 1024) {
    throw new Error(
      "La fotografía no puede superar los 10 MB."
    );
  }

  const extension = obtenerExtension(archivo);

  const nombreArchivo =
    `${limpiarNombre(nombre)}-${Date.now()}.${extension}`;

  const path =
    `${ordenId}/${equipoId}/${carpeta}/${nombreArchivo}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, archivo, {
      contentType: archivo.type,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const {
    data,
    error: errorUrl,
  } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 3600);

  if (errorUrl) {
    throw errorUrl;
  }

  return {
    path,
    url: data.signedUrl,
  };
};

export const eliminarEvidencia = async (path) => {
  if (!path) return;

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
};

export const obtenerUrlEvidencia = async (evidencia) => {
  if (!evidencia) return null;

  // Puede recibir directamente un path
  // o un objeto { path, url }.
  const path =
    typeof evidencia === "string"
      ? evidencia
      : evidencia?.path;

  if (!path) {
    console.error(
      "La evidencia no contiene un path válido:",
      evidencia
    );

    return null;
  }

  // Compatibilidad temporal con fotografías
  // antiguas guardadas como Base64 o URL.
  if (
    path.startsWith("data:image") ||
    path.startsWith("http")
  ) {
    return path;
  }

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 3600);

  if (error) {
    throw error;
  }

  return data.signedUrl;
};