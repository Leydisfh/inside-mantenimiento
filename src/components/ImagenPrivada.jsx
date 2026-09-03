import { useEffect, useState } from "react";
import { obtenerUrlEvidencia } from "../lib/evidenciasStorage";

function ImagenPrivada({
  path,
  alt,
  className,
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargarImagen = async () => {
      if (!path) return;

      try {
        const urlTemporal =
          await obtenerUrlEvidencia(path);

        if (activo) {
          setUrl(urlTemporal);
        }
      } catch (error) {
        console.error(
          "ERROR CARGANDO IMAGEN:",
          error
        );

        if (activo) {
          setError(true);
        }
      }
    };

    cargarImagen();

    return () => {
      activo = false;
    };
  }, [path]);

  if (!path) return null;

  if (error) {
    return (
      <span className="private-image-error">
        No fue posible cargar la imagen.
      </span>
    );
  }

  if (!url) {
    return (
      <span className="private-image-loading">
        Cargando imagen...
      </span>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={className}
    />
  );
}

export default ImagenPrivada;