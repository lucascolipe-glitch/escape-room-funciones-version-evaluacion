# Escape Room 2 - Alerta en el banco de pruebas

Nueva versión del escape room de Análisis Matemático para 4.º B Vespertino.

## Qué cambió

- Conserva la estructura de cinco estaciones y una página final.
- Utiliza funciones nuevas en todas las estaciones.
- Incluye campos para que el alumnado escriba el análisis completo.
- Guarda automáticamente datos y respuestas en `localStorage`.
- Genera un informe final con respuestas, intentos, pistas, tiempo y estado de cada estación.
- Permite imprimir el informe o guardarlo como PDF.
- Permite descargar una copia en `.txt`.
- Prepara un correo mediante `mailto:` usando la dirección ingresada en la portada.

## Estructura

```text
escape-room-funciones-version-2/
├── index.html
├── indexPrimero.html
├── estacion1.html
├── estacion2.html
├── estacion3.html
├── estacion4.html
├── estacion5.html
├── final.html
├── docente.html
├── css/
│   └── estilos.css
├── js/
│   └── escape.js
└── imprimibles/
```

## Códigos

| Estación | Función | Código | Palabra |
|---|---|---:|---|
| Lineal | `f(x) = -2x + 8` | 0408 | PENDIENTE |
| Cuadrática | `g(x) = x² - 6x + 5` | 1534 | VÉRTICE |
| Racional | `h(x) = -6/(x-3) + 1` | 9313 | ASÍNTOTA |
| Exponencial | `p(x) = 3^x - 9` | 0209 | POTENCIA |
| Logarítmica | `q(x) = log₂(x-4)` | 4520 | DOMINIO |
| Final | Integración | 9724 | Sistema reactivado |

## Página docente

- Archivo: `docente.html`
- Clave: `FUNCIONES`

La clave no ofrece seguridad real porque GitHub Pages publica archivos estáticos.

## Entrega por correo

Una página estática no puede adjuntar archivos automáticamente a un correo. El flujo previsto es:

1. Completar las respuestas.
2. Ir a `final.html`.
3. Pulsar **Imprimir / guardar PDF**.
4. Elegir **Guardar como PDF** en el navegador.
5. Pulsar **Preparar correo**.
6. Adjuntar manualmente el PDF y enviar.

## Importante sobre las respuestas

Los datos quedan guardados únicamente en el navegador y dispositivo usados por el grupo. Al borrar los datos del navegador, usar modo incógnito o pulsar **Reiniciar**, se eliminan.

## Publicar en GitHub Pages

1. Subir todos los archivos dejando `index.html` en la raíz.
2. Ir a `Settings` → `Pages`.
3. Seleccionar `Deploy from a branch`, rama `main`, carpeta `/root`.
4. Guardar y abrir la URL publicada.
