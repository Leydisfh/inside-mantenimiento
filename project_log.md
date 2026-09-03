# Inside Panamá - Sistema de Mantenimiento

## Objetivo

Aplicación web móvil para gestionar mantenimientos preventivos y diagnósticos de equipos de diferentes clientes.

Flujo principal:

Orden de servicio → Equipos → Checklist → Diagnóstico → Informe PDF → Compartir

---

# Estado del proyecto

## Versión actual
Prototipo funcional local.

## Tecnología
- React
- Vite
- JavaScript
- CSS
- Visual Studio Code

## Pendiente para etapas posteriores
- Supabase
- Base de datos
- Trabajo simultáneo real
- Almacenamiento de fotografías
- PDF
- Compartir informe
- PWA
- Publicación

---

# Funcionalidades desarrolladas

## 1. Acceso

Existen dos tipos de acceso:

- Técnico
- Administrador

El técnico debe registrar su nombre al iniciar.

Pendiente:
- Implementar PIN real.
- Seguridad.

---

## 2. Órdenes de servicio

Pantalla de listado de órdenes.

Estados:

- En proceso
- Cerrado

El administrador puede acceder a:

- Nueva orden

Los técnicos no pueden crear órdenes.

---

## 3. Creación de orden

Datos registrados:

- Cliente
- Abreviatura
- Sucursal / ubicación
- Fecha
- Observaciones

Formato de orden:

CLIENTE-AÑO-CONSECUTIVO

Ejemplo:

COCH-2026-0001

---

## 4. Registro de equipos

El administrador registra:

- Categoría
- Modelo
- Cantidad

El administrador NO registra el serial.

Ejemplo:

Categoría: Terminal móvil
Modelo: Zebra MC330L
Cantidad: 15

El sistema crea:

EQ-001
EQ-002
EQ-003
...

El número de serie se registra posteriormente por el técnico durante el mantenimiento.

---

## 5. Categorías

Actualmente:

- Terminal móvil
- Impresora
- Scanner
- RFID
- Cradle
- Otro

Cada equipo almacena:

- Categoría
- Modelo
- Código interno
- Serial
- Técnico
- Estado

---

## 6. Estados de equipos

- Pendiente
- En proceso
- Completado

Cuando un técnico toma un equipo:

Pendiente → En proceso

Se registra el técnico.

Al finalizar diagnóstico:

En proceso → Completado

---

## 7. Bloqueo de equipos

Si un equipo está siendo trabajado por otro técnico, otro técnico no puede abrirlo.

Actualmente funciona únicamente dentro del estado local de React.

Pendiente:

Implementar bloqueo real entre diferentes celulares mediante base de datos.

---

## 8. Listado de equipos

Incluye:

- Modelo
- Categoría
- Serial
- Técnico
- Estado

Filtros:

- Todos
- Pendientes
- En proceso
- Completados

Buscador:

- Modelo
- Serial

---

## 9. Número de serie

El serial se registra por el técnico cuando tiene físicamente el equipo.

Es obligatorio antes de finalizar el checklist.

---

## 10. Checklist

Opciones:

- OK
- Falla
- N/A
- No probado

Cuando se selecciona Falla:

- Aparece campo para descripción.
- Se contempla fotografía opcional.

El sistema verifica que todos los puntos hayan sido respondidos antes de continuar.

---

## 11. Checklist por categoría

Cada categoría tiene un checklist diferente.

### Terminal móvil
Inspección, limpieza, pantalla, touch, scanner, Wi-Fi, Bluetooth, batería, carga, etc.

### Impresora
Cabezal, platen roller, sensores, medio, ribbon, calibración, impresión, etc.

### Scanner
Ventana de lectura, gatillo, lectura 1D/2D, conectividad, etc.

### RFID
Lectura RFID, conexión, gatillo, batería, carga, etc.

### Cradle
Slots, contactos, fuente, carga, indicadores, etc.

### Otro
Checklist general.

Pendiente:

Agregar pruebas específicas por modelo.

## Checklist específico por modelo

Se separó la configuración de checklists del componente visual.

Archivo:

src/data/checklists.js

Funcionamiento:

Categoría → checklist estándar  
Modelo → pruebas adicionales

Esto permite agregar nuevos modelos sin modificar la pantalla Checklist.jsx.

---

## 12. Diagnóstico final

Estados disponibles:

- Operativo
- Operativo con observaciones
- Requiere reparación
- Fuera de servicio

Campos:

- Diagnóstico
- Falla detectada
- Repuesto necesario
- Recomendación
- Prioridad

Prioridades:

- Baja
- Media
- Alta
- Crítica

---

## 13. Fotografías

Diseñado para permitir:

- Antes
- Después
- Falla
- Adicional

Máximo previsto:

4 fotografías por equipo.

Actualmente solo está diseñado visualmente.

Pendiente:

Implementar cámara y almacenamiento.

---
## Almacenamiento de resultados por equipo

Al finalizar un mantenimiento, cada equipo conserva:

- Categoría
- Modelo
- Código interno
- Número de serie
- Técnico
- Estado
- Checklist completo
- Observaciones de fallas
- Diagnóstico final
- Repuesto necesario
- Recomendación
- Prioridad
- Fecha de finalización

Estos datos serán utilizados posteriormente para generar el informe PDF de la orden.

## Equipos adicionales durante el mantenimiento

Una orden abierta permite agregar equipos adicionales.

Puede hacerlo:
- Técnico
- Administrador

El técnico puede agregar:
- Categoría
- Modelo
- Cantidad

Los equipos adicionales quedan identificados con:
- Origen: Adicional
- Usuario que lo agregó
- Fecha y hora
- Estado inicial: Pendiente

El técnico no puede eliminar equipos ni modificar la orden.

El administrador no puede realizar checklists ni diagnósticos técnicos.

# Próximas etapas

1. Checklist específico por modelo.
2. Guardar resultados individuales de cada equipo.
3. Resumen de la orden.
4. Vista previa del informe.
5. Generación de PDF.
6. Fotografías reales.
7. Supabase.
8. Sincronización entre técnicos.
9. Seguridad y PIN.
10. Compartir PDF por WhatsApp y correo.
11. Eliminación automática de servicios después de 30 días.
12. Convertir aplicación en PWA.
13. Publicación.

## Persistencia con Supabase

Implementado:
- Proyecto React conectado a Supabase.
- Supabase Auth para Administrador y Técnico.
- Validación de rol mediante tabla perfiles.
- RLS habilitado.
- Políticas de lectura y escritura por rol.
- Tablas clientes, ordenes, equipos y resultados_equipo.
- Creación de órdenes en Supabase.
- Creación automática de clientes.
- Generación consecutiva de números de orden desde la base de datos.
- Equipos asociados a cada orden.
- Carga de clientes, órdenes, equipos y resultados desde Supabase después del login.

Pendiente:
- Guardar toma/asignación de equipo en Supabase.
- Guardar serial en Supabase.
- Guardar checklist y diagnóstico en resultados_equipo.
- Guardar evidencias fotográficas en Supabase Storage.
- Restaurar sesión automáticamente después de F5.
- Generación del informe PDF.
- Cierre de órdenes.

## Persistencia técnica en Supabase

Implementado:
- Asignación de equipo a técnico en Supabase.
- Registro persistente de serial.
- Guardado de checklist en resultados_equipo.
- Guardado de diagnóstico en resultados_equipo.
- Estado Completado persistente.
- Fecha de finalización persistente.
- Equipos adicionales guardados en Supabase.
- Equipos adicionales conservados después de recargar la aplicación.

Pendiente:
- Evidencias fotográficas con Supabase Storage.
- Restauración automática de sesión.
- Informe PDF.
- Cierre de órdenes.
## Evidencias fotográficas con Supabase Storage

Implementado:
- Bucket privado evidencias-mantenimiento.
- Políticas de acceso para Técnico y Administrador.
- Fotografías almacenadas en Supabase Storage.
- Evidencias generales: Antes, Después, Falla y Adicional.
- Fotografías individuales asociadas a cada punto del checklist con Falla.
- Almacenamiento del path de la fotografía en lugar de Base64.
- Generación de URLs privadas temporales para visualizar evidencias.
- Visualización de fotografías de fallas en DetalleEquipo.
- Compatibilidad temporal con evidencias antiguas almacenadas como Base64.

Pendiente:
- Verificar persistencia de todas las evidencias después de F5.
- Mostrar evidencias generales en DetalleEquipo desde Storage.
- Generación del informe PDF.
- Restauración automática de sesión.
- Cierre de órdenes.