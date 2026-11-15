# English Quiz

Aplicación web gamificada para practicar inglés. El jugador elige una dificultad, gira una **ruleta** y resuelve un reto en cada una de sus 4 categorías: **Vocabulary**, **Trivia**, **Tongue Twister** y **Spelling**. Cada categoría vale hasta 10 puntos (máximo **40**). Al terminar, se muestra un resumen con el puntaje por categoría.

Funciona **100 % local**: sin servidor, sin base de datos y sin internet. Solo se usa HTML5, CSS3 y JavaScript vanilla.

---

## Cómo ejecutarla

1. Copiar la carpeta del proyecto a cualquier ubicación (disco local o USB).
2. Hacer **doble clic en `index.html`**.
3. Listo. No requiere instalar nada ni configurar puertos.

> Probada en Google Chrome. La interfaz está en inglés.

---

## Flujo del juego

```
Inicio (dificultad) ──► Ruleta ──► Ejercicio ──► Ruleta ──► ... ──► Resumen ──► Play again
```

1. **Inicio**: se elige *Easy*, *Medium* o *Hard*. Se toma al azar una pregunta de cada categoría de esa dificultad.
2. **Ruleta**: al pulsar **Spin** se elige al azar una categoría **no jugada**. Las categorías ya jugadas aparecen en gris con candado.
3. **Ejercicio**: al terminar, se muestra el resultado y el botón **Back to the wheel**.
4. Cuando las 4 categorías están jugadas, el juego pasa al **Resumen**.

---

## Categorías y puntaje

| Categoría | Qué hace el jugador | Quién califica | Puntaje |
|---|---|---|---|
| **Vocabulary** | Completa una oración eligiendo entre 3 opciones | Sistema | 1.er intento: 10 · 2.º intento: 5 · falla los dos: 0 (con aviso y respuesta correcta) |
| **Trivia** | Responde una pregunta con 4 opciones | Sistema | Igual que Vocabulary |
| **Tongue Twister** | Lee el trabalenguas en voz alta mientras corre el timer | **Encargado del juego** | Perfect: 10 · Good try: 5 · Incorrect: 0 |
| **Spelling** | Describe una imagen escribiendo una palabra por casilla | Sistema (automático) | 100 %: 10 · ≥ 40 %: 5 · < 40 %: 0 |

### Detalles

- **Segundo intento** (Vocabulary/Trivia): la opción fallada queda deshabilitada y marcada en rojo.
- **Timer del Tongue Twister**: Easy 10 s, Medium 7 s, Hard 5 s. Los botones de calificación del encargado aparecen **solo cuando termina el timer**.
- **Spelling**:
  - Se muestra **una casilla por cada palabra** de la frase esperada (ej. *"a red apple"* → 3 casillas). Todas tienen el mismo tamaño: la única pista es el número de palabras.
  - **Espacio** o **Enter** pasan a la siguiente casilla; **Backspace** en una casilla vacía vuelve a la anterior. Pegar una frase la reparte en las casillas.
  - Se califica **por posición**: la casilla *i* se compara con la palabra *i*. Se ignoran mayúsculas, acentos, signos de puntuación y espacios extra. Las casillas vacías cuentan como fallo.
  - Porcentaje = palabras correctas / total de palabras. Ej.: `a / apple / red` frente a *"a red apple"* → 1/3 = 33 % → 0 puntos.
  - Se puede enviar con al menos una casilla escrita. Al enviar, cada casilla se pinta en verde o rojo.
- **Resumen**: puntaje total (X / 40) y una línea por categoría con sus puntos. **Play again** reinicia la partida.

---

## Estructura del proyecto

```text
english-quiz/
├── index.html        # Punto de entrada: contiene todas las pantallas (<section class="screen">)
├── style.css         # Estilos globales, responsive (móvil primero), ruleta y estados
├── script.js         # Lógica: estado, navegación, ruleta, ejercicios, puntaje y resumen
├── questions.js      # Banco de preguntas y configuración de timers
├── assets/images/    # Imágenes para Spelling (SVG de ejemplo)
└── english_quiz_requeriments.txt   # Especificación original
```

### Cómo funciona por dentro

- **Una sola página (SPA)**: todas las pantallas están en `index.html` y solo una tiene la clase `.active`. Cambiar de pantalla es mostrar u ocultar secciones.
- **Sin `fetch` ni módulos ES**: los navegadores los bloquean al abrir archivos con `file://`. Por eso las preguntas están en `questions.js`, un script clásico que define `window.QUESTIONS` y `window.CONFIG`, y se carga antes de `script.js`.
- **Estado** (`script.js`): dificultad, pregunta elegida por categoría, categorías bloqueadas y resultados.
- **Ruleta**: se dibuja con `conic-gradient` y se anima con `transform: rotate()`. Primero se elige la categoría y luego se calcula el ángulo exacto para que el puntero caiga en ella.
- **Validación de datos**: al abrir la app se revisa que `questions.js` tenga las 3 dificultades y las 4 categorías. Si falta algo, se muestra un mensaje en la pantalla de inicio.
- **Consola de pruebas**: `window.EnglishQuiz` expone el estado y las funciones de Spelling (`normalize`, `positionalSimilarity`, `spellingPoints`) para revisarlas desde las herramientas de desarrollo del navegador.

---

## Cómo agregar o cambiar preguntas

Editar `questions.js`. La estructura es `QUESTIONS[dificultad][categoría] = [ ... ]`:

```js
window.QUESTIONS = {
  easy: {
    vocabulary: [
      { id: "v1", sentence: "She ___ to the store yesterday.", options: ["go", "goes", "went"], correct: "went" }
    ],
    trivia: [
      { id: "t1", question: "What is the capital of the United States?",
        options: ["New York", "Washington D.C.", "Los Angeles", "Chicago"], correct: "Washington D.C." }
    ],
    tongue_twister: [
      { id: "tt1", text: "Red lorry, yellow lorry." }
    ],
    spelling: [
      { id: "s1", image_url: "assets/images/apple.svg", expected_text: "a red apple" }
    ]
  },
  medium: { /* misma estructura */ },
  hard:   { /* misma estructura */ }
};

window.CONFIG = { timers: { easy: 10, medium: 7, hard: 5 } }; // segundos del Tongue Twister
```

Reglas:
- **Vocabulary**: 3 opciones; usar `___` para marcar el espacio en blanco.
- **Trivia**: 4 opciones.
- `correct` debe ser **exactamente igual** a una de las `options`.
- **Spelling**: colocar la imagen en `assets/images/` y referenciarla con ruta relativa. El número de casillas sale de las palabras de `expected_text`.
- Cada categoría necesita al menos 1 elemento por dificultad. Con más elementos, cada partida varía porque se elige uno al azar.

---

## Pruebas

> La carpeta `.e2e/` es **solo local**: está excluida del repositorio en `.gitignore`.

La carpeta `.e2e/` contiene una prueba automática que juega una partida completa en Chrome sin interfaz (modo headless):

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --virtual-time-budget=120000 --dump-dom "file:///C:/Projects/english-quiz/.e2e/test.html"
```

El resultado aparece en el bloque `<pre id="TESTLOG">` del DOM que imprime el comando. `test.html#N` detiene la prueba después de N giros, lo que sirve para tomar capturas.

> `.e2e/test.html` es una copia de `index.html` con rutas `../` y el script `autotest.js`. Si cambia `index.html`, hay que regenerarla.
