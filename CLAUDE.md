# Time is money — Contexto del proyecto

## Qué es
App de finanzas personales para uso propio (un solo usuario: yo).
Objetivo: registrar gastos e ingresos de forma RÁPIDA y sin fricción, y
obtener métricas, dashboards y control mensual/anual. La fricción es el
enemigo número uno: si cargar un gasto cuesta, no lo voy a usar.

## Principios de producto
1. Agregar un movimiento debe tomar < 5 segundos. Eso manda sobre todo lo demás.
2. Soportar efectivo y digital sin distinción de esfuerzo.
3. Las métricas y consejos se derivan de los datos, no los pide el usuario.
4. Mensual y anual son vistas de primera clase.

## Stack
- Vite + React + TypeScript
- SQLite en el browser vía @sqlite.org/sqlite-wasm (OPFS) para persistencia local
- Recharts/visx para gráficos (a definir)
- Sync a Supabase = FASE 2, no implementar todavía

## Arquitectura
- Local-first. Toda la app accede a datos a través de interfaces de repositorio
  (ej: TransactionRepository), NUNCA a SQLite directamente.
- La implementación SQLite vive en src/data/sqlite/. El sync futuro será otra
  implementación de la misma interfaz. No acoplar la UI a la fuente de datos.
- Lógica de negocio en src/domain/, agnóstica de persistencia y de React.

## Design system (IMPORTANTE: identidad propia, NO look de template)
- Paleta: verde oscuro + negro. Valores de arranque (afinar después):
  - bg base:        #0A0F0D
  - superficie:     #121A16
  - superficie-2:   #18231E
  - borde:          #233029
  - verde primario: #2FBF71  (acento, CTAs, datos positivos)
  - verde tenue:    #1C7C4A
  - texto:          #E7EFEA
  - texto-muted:    #8A988F
  - rojo (gastos):  #E5544B
- Todos los colores como tokens CSS/variables. PROHIBIDO hardcodear hex en componentes.
- Tipografía con personalidad (no Inter por default). Proponer 1-2 opciones antes de fijar.
- Evitar deliberadamente: sombras genéricas, bordes redondeados estándar de shadcn,
  el espaciado default. Buscar un look propio, denso y sobrio tipo terminal/finanzas.

## Convenciones de código
- TypeScript estricto. Nada de `any`.
- Componentes funcionales, hooks. Sin librerías de estado hasta que haga falta.
- Nombres en inglés en el código; UI en español.

## Modelo de datos (alto nivel, a refinar)
- transactions: id, type(income|expense), amount, currency, category_id,
  account, date, note, payment_method(cash|card|transfer)
- categories: id, name, type, color
- (cuentas/presupuestos: fases posteriores)

## Cómo quiero que trabajes (Claude Code)
- Antes de construir cualquier feature, PLANIFICÁ primero y mostrame el plan.
- Una tarea por vez, acotada. No armes la app entera de una.
- Cuando tomes una decisión de arquitectura, registrala en docs/decisions/.
- Preguntá si algo es ambiguo en vez de asumir.

## Roadmap por fases
- F1: capa de datos local + cargar/listar movimientos (CRUD mínimo)
- F2: dashboard mensual (totales, por categoría, gráfico)
- F3: vista anual + comparativas
- F4: métricas y consejos derivados
- F5: sync opcional a Supabase