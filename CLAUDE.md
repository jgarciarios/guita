# Mango — Contexto del proyecto

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

## Estado actual (Fase 1 completa)
Implementado y funcionando:
- Design system en src/design/: tokens verde/negro, primitivos Surface y Text,
  IBM Plex Sans + Mono self-hosted.
- Dominio en src/domain/: Transaction, Category, calculateBalance, formatARS, formatDate.
- Repository pattern (interface async TransactionRepository) con dos
  implementaciones: InMemory y Sqlite.
- Persistencia real: SQLite WASM sobre OPFS (VFS opfs-sahpool), persistente entre
  recargas. App.tsx usa SqliteTransactionRepository con loading state.
- Pantalla: saldo + lista de movimientos.

Decisiones clave:
- Los montos se guardan y manejan como INTEGER en centavos en TODO el sistema.
  formatARS divide por 100 solo al mostrar. Nunca float para dinero.
- VFS opfs-sahpool (los headers COOP/COEP están puestos aunque sahpool no los
  exige estrictamente).

Gotchas de SQLite WASM (para no re-tropezar):
- El export sqlite3Worker1Promiser del paquete ESM YA es la función .v2; no
  llamar .v2() encima.
- El worker de stock no instala opfs-sahpool; usar worker propio que llame
  installOpfsSAHPoolVfs antes de initWorker1API.

Próximo paso:
- Completar el CRUD: formulario de carga de movimientos (objetivo < 5 segundos,
  principio #1). Agregar add() a la interface e implementarlo en ambos repos.
  Después: dashboard mensual (Fase 2).

## Estado actual (Fase 2 completa + Layout Shell)
Implementado y funcionando:
- Bottom nav mobile (AppShell) con max-width 480px centrado en desktop
- Dashboard mensual: ingresos/gastos/neto + breakdown por categoría con barras CSS
- Navegación entre meses con flechas ← →
- FAB siempre visible, sincroniza dashboard al guardar

Próximo paso (después de una semana de uso real):
- Polish basado en uso real (fricción, categorías faltantes, ajustes UX)
- Después: Fase 3 (vista anual)