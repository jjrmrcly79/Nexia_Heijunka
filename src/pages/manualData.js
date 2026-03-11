// Manual sections data — each section has an id, icon, title, and content (JSX-ready HTML string)
// This file separates data from presentation for the Manual page

export const MANUAL_SECTIONS = [
  {
    id: 'intro',
    num: 1,
    icon: '🎓',
    title: 'Introducción a Heijunka',
    keywords: 'heijunka nivelación producción lean manufacturing toyota flujo kanban',
    content: `
      <h3>¿Qué es Heijunka?</h3>
      <p><strong>Heijunka</strong> (平準化) es un término japonés que significa <strong>"nivelación"</strong>. En Lean Manufacturing, se refiere a la técnica de nivelar el tipo y la cantidad de producción durante un período fijo, eliminando las fluctuaciones de demanda y distribuyendo el trabajo de forma uniforme.</p>
      <p>Es uno de los pilares fundamentales del <strong>Toyota Production System (TPS)</strong> y un elemento esencial para lograr un flujo de producción continuo, predecible y libre de desperdicios.</p>

      <h3>¿Por qué nivelar la producción?</h3>
      <table class="manual-table"><thead><tr><th>Problema sin Heijunka</th><th>Solución con Heijunka</th></tr></thead><tbody>
        <tr><td>Picos y valles de producción</td><td>Producción uniforme y predecible</td></tr>
        <tr><td>Exceso de inventario en proceso (WIP)</td><td>WIP controlado y reducido</td></tr>
        <tr><td>Sobrecarga de operadores (Muri)</td><td>Carga de trabajo balanceada</td></tr>
        <tr><td>Tiempos muertos frecuentes</td><td>Utilización eficiente de recursos</td></tr>
        <tr><td>Lead Time largo e impredecible</td><td>Lead Time corto y consistente</td></tr>
      </tbody></table>

      <h3>Los dos niveles de Heijunka</h3>
      <table class="manual-table"><thead><tr><th>Nivel</th><th>Nombre</th><th>Descripción</th></tr></thead><tbody>
        <tr><td><strong>Nivel 1</strong></td><td>Nivelación por Volumen</td><td>Distribuir la cantidad total de producción de forma uniforme a lo largo del tiempo</td></tr>
        <tr><td><strong>Nivel 2</strong></td><td>Nivelación por Mix</td><td>Alternar los diferentes tipos de productos para producir un poco de cada uno en cada intervalo</td></tr>
      </tbody></table>

      <h3>¿Para quién es NexIA Heijunka?</h3>
      <table class="manual-table"><thead><tr><th>Perfil de Usuario</th><th>Uso Principal</th></tr></thead><tbody>
        <tr><td><strong>Ingenieros de producción</strong></td><td>Diseñar secuencias de producción niveladas</td></tr>
        <tr><td><strong>Planificadores de planta</strong></td><td>Calcular Takt Time, Pitch y EPEI de forma automática</td></tr>
        <tr><td><strong>Supervisores de línea</strong></td><td>Gestionar la Caja Heijunka y tarjetas Kanban</td></tr>
        <tr><td><strong>Líderes Lean</strong></td><td>Monitorear adherencia al plan nivelado</td></tr>
        <tr><td><strong>Consultores Lean</strong></td><td>Implementar nivelación con clientes de forma estandarizada</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'quickstart',
    num: 2,
    icon: '🚀',
    title: 'Inicio Rápido',
    keywords: 'inicio instalación requisitos npm ejecutar tutorial primeros pasos',
    content: `
      <h3>Requisitos del Sistema</h3>
      <table class="manual-table"><thead><tr><th>Requisito</th><th>Especificación</th></tr></thead><tbody>
        <tr><td><strong>Runtime</strong></td><td>Node.js versión 18 o superior</td></tr>
        <tr><td><strong>Navegador</strong></td><td>Chrome, Firefox, Edge o Safari (versiones recientes)</td></tr>
        <tr><td><strong>Sistema operativo</strong></td><td>Windows, macOS o Linux</td></tr>
        <tr><td><strong>Resolución recomendada</strong></td><td>1280 × 720 px o superior</td></tr>
      </tbody></table>

      <h3>Instalación y Ejecución</h3>
      <table class="manual-table"><thead><tr><th>Paso</th><th>Comando</th><th>Descripción</th></tr></thead><tbody>
        <tr><td>1</td><td><code>npm install</code></td><td>Descarga e instala todas las dependencias del proyecto</td></tr>
        <tr><td>2</td><td><code>npm run dev</code></td><td>Inicia el servidor de desarrollo en modo local</td></tr>
      </tbody></table>
      <p>Una vez iniciado, la aplicación estará disponible en <strong>http://localhost:5173/</strong></p>

      <h3>Primeros Pasos (Tutorial Rápido)</h3>
      <table class="manual-table"><thead><tr><th>Paso</th><th>Acción</th><th>Resultado Esperado</th></tr></thead><tbody>
        <tr><td>1</td><td>Abre la aplicación en tu navegador</td><td>Verás la pantalla de Inicio con estadísticas y módulos</td></tr>
        <tr><td>2</td><td>Haz clic en <strong>Datos y Demanda</strong> en la barra lateral</td><td>Se muestra la gestión de productos y demanda</td></tr>
        <tr><td>3</td><td>Configura los <strong>Parámetros de Planta</strong> (turnos, tiempo disponible, días)</td><td>Los cálculos Lean se actualizan automáticamente</td></tr>
        <tr><td>4</td><td>Agrega o edita los <strong>productos</strong> con su demanda semanal</td><td>Se generan clasificaciones ABC y cálculos</td></tr>
        <tr><td>5</td><td>Navega a <strong>Cálculos Lean</strong></td><td>Verás Takt Time, Pitch y EPEI calculados automáticamente</td></tr>
        <tr><td>6</td><td>Navega a <strong>Secuenciación</strong> para generar la secuencia nivelada</td><td>Generación automática de la secuencia de producción</td></tr>
        <tr><td>7</td><td>Abre la <strong>Caja Heijunka</strong></td><td>Tablero visual con las tarjetas Kanban asignadas</td></tr>
      </tbody></table>
      <div class="manual-note"><span class="manual-note-icon">📝</span><span>La aplicación viene con <strong>datos de ejemplo</strong> precargados. Son ideales para explorar todas las funcionalidades antes de ingresar tus propios datos.</span></div>
    `
  },
  {
    id: 'navigation',
    num: 3,
    icon: '🧭',
    title: 'Navegación General',
    keywords: 'navegación barra lateral sidebar módulos persistencia datos localstorage interfaz',
    content: `
      <h3>3.1 Barra Lateral</h3>
      <p>La barra lateral izquierda es permanente y siempre visible. Es el punto central de navegación.</p>
      <table class="manual-table"><thead><tr><th>Icono</th><th>Sección</th><th>Ruta</th><th>Descripción</th></tr></thead><tbody>
        <tr><td>🏠</td><td><strong>Inicio</strong></td><td>/</td><td>Panel principal con estadísticas, métricas clave y módulos</td></tr>
        <tr><td>📊</td><td><strong>Datos y Demanda</strong></td><td>/data</td><td>Gestión de productos, historial de demanda y clasificación ABC</td></tr>
        <tr><td>⚙️</td><td><strong>Cálculos Lean</strong></td><td>/calculations</td><td>Takt Time, Pitch, EPEI y cálculos automáticos</td></tr>
        <tr><td>🔄</td><td><strong>Secuenciación</strong></td><td>/sequencing</td><td>Nivelación por volumen y por mix de productos</td></tr>
        <tr><td>📦</td><td><strong>Caja Heijunka</strong></td><td>/heijunka-box</td><td>Tablero visual interactivo con tarjetas Kanban</td></tr>
        <tr><td>📈</td><td><strong>Dashboards</strong></td><td>/dashboards</td><td>Monitoreo de WIP, Lead Time y adherencia</td></tr>
        <tr><td>📘</td><td><strong>Manual</strong></td><td>/manual</td><td>Este manual de usuario</td></tr>
      </tbody></table>

      <h3>3.2 Persistencia de Datos</h3>
      <table class="manual-table"><thead><tr><th>Característica</th><th>Detalle</th></tr></thead><tbody>
        <tr><td><strong>Guardado automático</strong></td><td>Cada modificación se guarda inmediatamente sin presionar "Guardar"</td></tr>
        <tr><td><strong>Datos entre sesiones</strong></td><td>Al cerrar y reabrir el navegador, tus datos estarán donde los dejaste</td></tr>
        <tr><td><strong>Datos locales</strong></td><td>La información se almacena únicamente en el navegador en el que trabajas (localStorage)</td></tr>
        <tr><td><strong>Datos de ejemplo</strong></td><td>Al iniciar por primera vez, la aplicación carga productos de ejemplo</td></tr>
      </tbody></table>

      <h3>3.3 Convenciones de la Interfaz</h3>
      <table class="manual-table"><thead><tr><th>Elemento</th><th>Descripción</th><th>Ejemplo de Uso</th></tr></thead><tbody>
        <tr><td><strong>Tarjetas de cristal</strong></td><td>Contenedores con efecto glassmorphism y borde sutil</td><td>Tarjetas de estadísticas, módulos</td></tr>
        <tr><td><strong>Badges de color</strong></td><td>Etiquetas que indican clasificación o estado</td><td>A (verde), B (ámbar), C (rojo)</td></tr>
        <tr><td><strong>Botones primarios</strong></td><td>Acción principal de la sección (color accent)</td><td>"Agregar Producto", "Generar Secuencia"</td></tr>
        <tr><td><strong>Pestañas</strong></td><td>Navegación horizontal dentro de un módulo</td><td>Productos / Parámetros / Historial</td></tr>
        <tr><td><strong>Tema oscuro</strong></td><td>Interfaz diseñada con paleta oscura premium</td><td>Reducción de fatiga visual</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'home',
    num: 4,
    icon: '🏠',
    title: 'Página de Inicio',
    keywords: 'inicio home estadísticas módulos hero panel takt pitch demanda',
    content: `
      <h3>4.1 Sección Hero</h3>
      <p>En la parte superior se presenta el encabezado de bienvenida con el nombre <strong>Nexia Heijunka</strong> y una breve descripción del sistema de nivelación de producción.</p>

      <h3>4.2 Tarjetas de Estadísticas</h3>
      <table class="manual-table"><thead><tr><th>Tarjeta</th><th>Indicador</th><th>Interpretación</th></tr></thead><tbody>
        <tr><td><strong>Productos</strong></td><td>Cantidad de productos registrados</td><td>Incluye clasificación ABC (A, B, C)</td></tr>
        <tr><td><strong>Takt Time</strong></td><td>Ritmo de producción (seg)</td><td>Tiempo disponible / Demanda diaria total</td></tr>
        <tr><td><strong>Pitch</strong></td><td>Intervalo de control (min)</td><td>Takt Time × Tamaño de empaque promedio</td></tr>
        <tr><td><strong>Demanda Diaria</strong></td><td>Total de unidades/día</td><td>Suma de demanda diaria de todos los productos</td></tr>
      </tbody></table>

      <h3>4.3 Tarjetas de Módulos</h3>
      <p>Cinco tarjetas de acceso rápido permiten navegar directamente a cualquier sección: Datos y Demanda, Cálculos Lean, Secuenciación, Caja Heijunka y Dashboards.</p>
    `
  },
  {
    id: 'data-entry',
    num: 5,
    icon: '📊',
    title: 'Módulo: Datos y Demanda',
    keywords: 'datos demanda productos historial ABC clasificación pareto parámetros planta turnos',
    content: `
      <p><strong>Propósito:</strong> Gestionar los productos, sus datos de demanda, los parámetros de planta y realizar el análisis ABC para priorización.</p>

      <h3>5.1 Gestión de Productos</h3>
      <table class="manual-table"><thead><tr><th>Campo</th><th>Tipo</th><th>Descripción</th><th>Ejemplo</th></tr></thead><tbody>
        <tr><td><strong>Nombre / SKU</strong></td><td>Texto</td><td>Identificación del producto</td><td>"Producto A-100"</td></tr>
        <tr><td><strong>Demanda Semanal</strong></td><td>Número</td><td>Unidades requeridas por semana</td><td>500</td></tr>
        <tr><td><strong>Tiempo de Ciclo</strong></td><td>Número (seg)</td><td>Tiempo para producir una unidad</td><td>45</td></tr>
        <tr><td><strong>Tiempo de Setup</strong></td><td>Número (min)</td><td>Tiempo de cambio/preparación</td><td>15</td></tr>
        <tr><td><strong>Tamaño de Empaque</strong></td><td>Número</td><td>Unidades por contenedor/lote</td><td>20</td></tr>
      </tbody></table>
      <div class="manual-tip"><span class="manual-tip-icon">💡</span><span>Los productos se clasifican automáticamente como <strong>A</strong> (80% de la demanda), <strong>B</strong> (15%) o <strong>C</strong> (5%) según el análisis ABC/Pareto.</span></div>

      <h3>5.2 Parámetros de Planta</h3>
      <table class="manual-table"><thead><tr><th>Parámetro</th><th>Descripción</th><th>Ejemplo</th></tr></thead><tbody>
        <tr><td><strong>Tiempo Disponible por Turno</strong></td><td>Minutos netos de producción por turno</td><td>450 min</td></tr>
        <tr><td><strong>Turnos por Día</strong></td><td>Número de turnos de producción</td><td>2</td></tr>
        <tr><td><strong>Días Laborales por Semana</strong></td><td>Días de operación semanal</td><td>5</td></tr>
      </tbody></table>

      <h3>5.3 Clasificación ABC</h3>
      <table class="manual-table"><thead><tr><th>Clase</th><th>Badge</th><th>Criterio</th><th>Estrategia</th></tr></thead><tbody>
        <tr><td><strong>A</strong></td><td>🟢 Verde</td><td>~80% de la demanda total</td><td>Producir cada turno/día. Alta frecuencia.</td></tr>
        <tr><td><strong>B</strong></td><td>🟡 Ámbar</td><td>~15% de la demanda total</td><td>Producir cada 2-3 días. Frecuencia media.</td></tr>
        <tr><td><strong>C</strong></td><td>🔴 Rojo</td><td>~5% de la demanda total</td><td>Producir semanalmente o por pedido. Baja frecuencia.</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'calculations',
    num: 6,
    icon: '⚙️',
    title: 'Módulo: Cálculos Lean',
    keywords: 'cálculos lean takt time pitch EPEI disponible demanda capacidad utilización',
    content: `
      <p><strong>Propósito:</strong> Calcular automáticamente los indicadores fundamentales de Lean Manufacturing que determinan el ritmo de producción y los intervalos de nivelación.</p>

      <h3>6.1 Takt Time</h3>
      <table class="manual-table"><thead><tr><th>Elemento</th><th>Detalle</th></tr></thead><tbody>
        <tr><td><strong>Definición</strong></td><td>Ritmo al que se debe producir para satisfacer la demanda del cliente</td></tr>
        <tr><td><strong>Fórmula</strong></td><td>Takt Time = Tiempo Disponible / Demanda Diaria</td></tr>
        <tr><td><strong>Unidad</strong></td><td>Segundos por pieza (seg/pza)</td></tr>
        <tr><td><strong>Interpretación</strong></td><td>Cada X segundos debe salir una pieza terminada</td></tr>
      </tbody></table>

      <h3>6.2 Pitch</h3>
      <table class="manual-table"><thead><tr><th>Elemento</th><th>Detalle</th></tr></thead><tbody>
        <tr><td><strong>Definición</strong></td><td>Intervalo de tiempo en el que se debe liberar un contenedor o lote</td></tr>
        <tr><td><strong>Fórmula</strong></td><td>Pitch = Takt Time × Tamaño de Empaque</td></tr>
        <tr><td><strong>Unidad</strong></td><td>Minutos por contenedor</td></tr>
        <tr><td><strong>Uso</strong></td><td>Define los intervalos de la Caja Heijunka</td></tr>
      </tbody></table>

      <h3>6.3 EPEI (Every Part Every Interval)</h3>
      <table class="manual-table"><thead><tr><th>Elemento</th><th>Detalle</th></tr></thead><tbody>
        <tr><td><strong>Definición</strong></td><td>Frecuencia con la que se puede producir cada producto diferente</td></tr>
        <tr><td><strong>Fórmula</strong></td><td>Depende de tiempos de setup, tiempo de ciclo y demanda</td></tr>
        <tr><td><strong>Unidad</strong></td><td>Días (o turnos)</td></tr>
        <tr><td><strong>Meta</strong></td><td>Reducir el EPEI significa mayor capacidad de nivelación</td></tr>
      </tbody></table>
      <div class="manual-important"><span class="manual-tip-icon">⚠️</span><span>Para que los cálculos sean precisos, asegúrate de que los <strong>parámetros de planta</strong> y las <strong>demandas de productos</strong> estén correctamente configurados en el módulo de Datos y Demanda.</span></div>

      <h3>6.4 Métricas por Producto</h3>
      <table class="manual-table"><thead><tr><th>Columna</th><th>Cálculo</th></tr></thead><tbody>
        <tr><td><strong>Demanda Diaria</strong></td><td>Demanda Semanal / Días Laborales</td></tr>
        <tr><td><strong>Contenedores/Día</strong></td><td>Demanda Diaria / Tamaño de Empaque</td></tr>
        <tr><td><strong>Tiempo de Producción</strong></td><td>Demanda Diaria × Tiempo de Ciclo</td></tr>
        <tr><td><strong>% Utilización</strong></td><td>Tiempo de Producción / Tiempo Disponible × 100</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'sequencing',
    num: 7,
    icon: '🔄',
    title: 'Módulo: Secuenciación',
    keywords: 'secuenciación nivelación volumen mix orden producción runner repeater stranger alternancia',
    content: `
      <p><strong>Propósito:</strong> Generar la secuencia de producción nivelada que distribuye los diferentes productos de forma uniforme a lo largo del día.</p>

      <h3>7.1 Nivelación por Volumen</h3>
      <table class="manual-table"><thead><tr><th>Concepto</th><th>Descripción</th></tr></thead><tbody>
        <tr><td><strong>Objetivo</strong></td><td>Producir la misma cantidad total cada día, eliminando picos y valles</td></tr>
        <tr><td><strong>Cálculo</strong></td><td>Demanda semanal / Días laborales = Producción diaria constante</td></tr>
        <tr><td><strong>Resultado</strong></td><td>Cada día se produce un volumen fijo y predecible</td></tr>
      </tbody></table>

      <h3>7.2 Nivelación por Mix</h3>
      <table class="manual-table"><thead><tr><th>Concepto</th><th>Descripción</th></tr></thead><tbody>
        <tr><td><strong>Objetivo</strong></td><td>Alternar los tipos de productos para producir un poco de cada uno en cada intervalo de tiempo</td></tr>
        <tr><td><strong>Método</strong></td><td>Distribuir las tarjetas Kanban intercalando productos A, B y C según su demanda</td></tr>
        <tr><td><strong>Resultado</strong></td><td>Secuencia como: A-B-A-C-A-B-A en lugar de AAAA-BBB-CC</td></tr>
      </tbody></table>

      <h3>7.3 Clasificación Runner / Repeater / Stranger</h3>
      <table class="manual-table"><thead><tr><th>Tipo</th><th>Frecuencia</th><th>Equivalente</th><th>Estrategia</th></tr></thead><tbody>
        <tr><td><strong>Runner</strong></td><td>Diario</td><td>Clase A</td><td>Producir cada turno o cada día</td></tr>
        <tr><td><strong>Repeater</strong></td><td>Semanal</td><td>Clase B</td><td>Producir 2-3 veces por semana</td></tr>
        <tr><td><strong>Stranger</strong></td><td>Eventual</td><td>Clase C</td><td>Producir por pedido o semanalmente</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'heijunka-box',
    num: 8,
    icon: '📦',
    title: 'Módulo: Caja Heijunka',
    keywords: 'caja heijunka box tablero kanban tarjetas visual intervalos slots producción',
    content: `
      <p><strong>Propósito:</strong> Herramienta visual que materializa la secuencia nivelada en un tablero interactivo con filas (productos) y columnas (intervalos de tiempo).</p>

      <h3>8.1 Estructura del Tablero</h3>
      <table class="manual-table"><thead><tr><th>Elemento</th><th>Representación</th><th>Descripción</th></tr></thead><tbody>
        <tr><td><strong>Columnas</strong></td><td>Intervalos de Pitch</td><td>Cada columna representa un intervalo de tiempo (ej: 30 min)</td></tr>
        <tr><td><strong>Filas</strong></td><td>Productos / SKUs</td><td>Cada fila corresponde a un producto diferente</td></tr>
        <tr><td><strong>Celdas</strong></td><td>Slots de producción</td><td>Indican qué producto producir en qué intervalo</td></tr>
        <tr><td><strong>Tarjetas Kanban</strong></td><td>Unidades de control</td><td>Cada tarjeta representa un contenedor o lote a producir</td></tr>
      </tbody></table>

      <h3>8.2 Interacción con el Tablero</h3>
      <table class="manual-table"><thead><tr><th>Acción</th><th>Cómo</th><th>Efecto</th></tr></thead><tbody>
        <tr><td><strong>Ver detalles</strong></td><td>Hover sobre una tarjeta</td><td>Muestra producto, cantidad y tiempo</td></tr>
        <tr><td><strong>Generar tablero</strong></td><td>Automático desde Secuenciación</td><td>Se genera a partir de la secuencia nivelada</td></tr>
        <tr><td><strong>Código de colores</strong></td><td>Cada producto tiene un color</td><td>Identificación visual rápida</td></tr>
      </tbody></table>

      <h3>8.3 Beneficios del Tablero Visual</h3>
      <table class="manual-table"><thead><tr><th>Beneficio</th><th>Descripción</th></tr></thead><tbody>
        <tr><td><strong>Visibilidad</strong></td><td>Todo el equipo puede ver qué se produce y cuándo</td></tr>
        <tr><td><strong>Control de ritmo</strong></td><td>Cada intervalo de Pitch indica si se va adelantado o atrasado</td></tr>
        <tr><td><strong>Detección de problemas</strong></td><td>Slots vacíos o acumulación indican desviaciones</td></tr>
        <tr><td><strong>Comunicación</strong></td><td>Elimina la necesidad de programación verbal</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'dashboards',
    num: 9,
    icon: '📈',
    title: 'Módulo: Dashboards',
    keywords: 'dashboard métricas gráficas resumen KPI WIP lead time adherencia monitoreo',
    content: `
      <h3>9.1 Indicadores Clave</h3>
      <table class="manual-table"><thead><tr><th>KPI</th><th>Definición</th><th>Meta</th></tr></thead><tbody>
        <tr><td><strong>WIP (Work in Process)</strong></td><td>Inventario en proceso en cualquier momento</td><td>Minimizar: menos WIP = flujo más rápido</td></tr>
        <tr><td><strong>Lead Time</strong></td><td>Tiempo desde el inicio hasta la entrega</td><td>Reducir: menor tiempo = mayor agilidad</td></tr>
        <tr><td><strong>Adherencia al Plan</strong></td><td>% de cumplimiento de la secuencia nivelada</td><td>Maximizar: >95% indica estabilidad</td></tr>
        <tr><td><strong>Utilización</strong></td><td>% del tiempo disponible usado productivamente</td><td>Balance: ni sobrecarga ni subutilización</td></tr>
      </tbody></table>

      <h3>9.2 Gráficas de Análisis</h3>
      <table class="manual-table"><thead><tr><th>Gráfica</th><th>Formato</th><th>Utilidad</th></tr></thead><tbody>
        <tr><td><strong>Distribución ABC</strong></td><td>Gráfico de barras/pastel</td><td>Visualizar la clasificación de productos</td></tr>
        <tr><td><strong>Demanda por Producto</strong></td><td>Barras comparativas</td><td>Comparar volúmenes de demanda</td></tr>
        <tr><td><strong>Utilización de Capacidad</strong></td><td>Barra de progreso</td><td>Evaluar si hay sobre o sub-utilización</td></tr>
        <tr><td><strong>Takt vs Cycle Time</strong></td><td>Comparación</td><td>Identificar cuellos de botella</td></tr>
      </tbody></table>

      <h3>9.3 Interpretación de Resultados</h3>
      <table class="manual-table"><thead><tr><th>Escenario</th><th>Indicador</th><th>Acción Recomendada</th></tr></thead><tbody>
        <tr><td>Utilización >100%</td><td>🔴 Sobrecarga</td><td>Agregar capacidad o reducir demanda</td></tr>
        <tr><td>Utilización 85-100%</td><td>🟢 Óptimo</td><td>Mantener configuración actual</td></tr>
        <tr><td>Utilización <70%</td><td>🟡 Subutilización</td><td>Revisar parámetros o consolidar líneas</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'glossary',
    num: 10,
    icon: '📖',
    title: 'Glosario de Términos Lean',
    keywords: 'glosario términos definiciones heijunka lean kanban takt pitch EPEI muda muri mura',
    content: `
      <table class="manual-table"><thead><tr><th>Término</th><th>Definición</th></tr></thead><tbody>
        <tr><td><strong>Heijunka</strong></td><td>Nivelación de producción en volumen y mix para eliminar fluctuaciones</td></tr>
        <tr><td><strong>Takt Time</strong></td><td>Ritmo de producción que sincroniza la manufactura con la demanda del cliente</td></tr>
        <tr><td><strong>Pitch</strong></td><td>Intervalo de control = Takt Time × Tamaño de empaque. Unidad base de la Caja Heijunka</td></tr>
        <tr><td><strong>EPEI</strong></td><td>Every Part Every Interval — frecuencia con la que se puede producir cada producto</td></tr>
        <tr><td><strong>Kanban</strong></td><td>Señal visual (tarjeta) que autoriza y controla el flujo de producción</td></tr>
        <tr><td><strong>Caja Heijunka</strong></td><td>Tablero visual con slots para colocar tarjetas Kanban según la secuencia nivelada</td></tr>
        <tr><td><strong>Análisis ABC</strong></td><td>Clasificación de productos por impacto en la demanda total (regla de Pareto 80/20)</td></tr>
        <tr><td><strong>WIP</strong></td><td>Work in Process — Inventario en proceso dentro del sistema de producción</td></tr>
        <tr><td><strong>Lead Time</strong></td><td>Tiempo total desde la entrada de una orden hasta su entrega</td></tr>
        <tr><td><strong>Muda</strong></td><td>Desperdicio — cualquier actividad que no agrega valor al cliente</td></tr>
        <tr><td><strong>Muri</strong></td><td>Sobrecarga — exigir más de lo que el sistema puede manejar de forma sostenible</td></tr>
        <tr><td><strong>Mura</strong></td><td>Variabilidad — irregularidad en el flujo de trabajo que causa desperdicios</td></tr>
        <tr><td><strong>Runner</strong></td><td>Producto de alta demanda que se produce diariamente (Clase A)</td></tr>
        <tr><td><strong>Repeater</strong></td><td>Producto de demanda media que se produce varias veces por semana (Clase B)</td></tr>
        <tr><td><strong>Stranger</strong></td><td>Producto de baja demanda que se produce eventualmente (Clase C)</td></tr>
        <tr><td><strong>localStorage</strong></td><td>Almacenamiento del navegador que guarda datos entre sesiones</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'faq',
    num: 11,
    icon: '❓',
    title: 'Preguntas Frecuentes',
    keywords: 'preguntas frecuentes faq dudas ayuda resetear exportar editar datos',
    content: `
      <table class="manual-table"><thead><tr><th>Nº</th><th>Pregunta</th><th>Respuesta</th></tr></thead><tbody>
        <tr><td>1</td><td><strong>¿Cómo agrego un nuevo producto?</strong></td><td>Navega a Datos y Demanda, haz clic en "Agregar Producto" y completa los campos requeridos.</td></tr>
        <tr><td>2</td><td><strong>¿Qué es la clasificación ABC?</strong></td><td>Divide los productos en 3 categorías según su contribución a la demanda total (A=80%, B=15%, C=5%).</td></tr>
        <tr><td>3</td><td><strong>¿Cómo se calcula el Takt Time?</strong></td><td>Tiempo disponible por día dividido entre la demanda diaria total. Se actualiza automáticamente.</td></tr>
        <tr><td>4</td><td><strong>¿Dónde se guardan los datos?</strong></td><td>En el localStorage del navegador. Son locales a ese navegador.</td></tr>
        <tr><td>5</td><td><strong>¿Cómo reseteo los datos?</strong></td><td>Consola del navegador: <code>localStorage.removeItem('nexia-heijunka-data')</code> y recarga la página.</td></tr>
        <tr><td>6</td><td><strong>¿Puedo modificar los parámetros de planta?</strong></td><td>Sí. En Datos y Demanda, sección Parámetros de Planta. Los cálculos se actualizan automáticamente.</td></tr>
        <tr><td>7</td><td><strong>¿Qué pasa si mi utilización supera el 100%?</strong></td><td>Indica que no hay suficiente capacidad para cubrir la demanda. Considera agregar turnos o revisar tiempos de ciclo.</td></tr>
        <tr><td>8</td><td><strong>¿Cuántos productos puedo registrar?</strong></td><td>No hay límite definido en la aplicación.</td></tr>
        <tr><td>9</td><td><strong>¿Qué significa Pitch?</strong></td><td>Es el intervalo de control (Takt Time × Pack Size). Define los slots de la Caja Heijunka.</td></tr>
        <tr><td>10</td><td><strong>¿Puedo exportar mis datos?</strong></td><td>Actualmente no hay exportación nativa. Puedes copiar del localStorage por consola.</td></tr>
      </tbody></table>
    `
  },
  {
    id: 'flow',
    num: 12,
    icon: '🔁',
    title: 'Flujo Recomendado de Trabajo',
    keywords: 'flujo recomendado recorrido paso a paso secuencia completa proceso',
    content: `
      <h3>Paso 1: Configurar Parámetros de Planta</h3>
      <table class="manual-table"><thead><tr><th>Actividad</th><th>Ubicación</th><th>Entregable</th></tr></thead><tbody>
        <tr><td>Definir tiempo disponible por turno</td><td>Datos y Demanda</td><td>Minutos netos de producción</td></tr>
        <tr><td>Configurar turnos y días laborales</td><td>Datos y Demanda</td><td>Capacidad total del sistema</td></tr>
      </tbody></table>

      <h3>Paso 2: Registrar Productos</h3>
      <table class="manual-table"><thead><tr><th>Actividad</th><th>Ubicación</th><th>Entregable</th></tr></thead><tbody>
        <tr><td>Agregar cada producto/SKU</td><td>Datos y Demanda</td><td>Lista de productos con demanda</td></tr>
        <tr><td>Completar tiempos de ciclo y setup</td><td>Datos y Demanda</td><td>Datos para cálculos Lean</td></tr>
        <tr><td>Verificar clasificación ABC</td><td>Datos y Demanda</td><td>Priorización de productos</td></tr>
      </tbody></table>

      <h3>Paso 3: Revisar Cálculos Lean</h3>
      <table class="manual-table"><thead><tr><th>Actividad</th><th>Ubicación</th><th>Entregable</th></tr></thead><tbody>
        <tr><td>Verificar Takt Time y Pitch</td><td>Cálculos Lean</td><td>Ritmo de producción validado</td></tr>
        <tr><td>Revisar EPEI por producto</td><td>Cálculos Lean</td><td>Frecuencia de producción</td></tr>
        <tr><td>Evaluar utilización de capacidad</td><td>Cálculos Lean</td><td>Balance carga/capacidad</td></tr>
      </tbody></table>

      <h3>Paso 4: Generar Secuencia Nivelada</h3>
      <table class="manual-table"><thead><tr><th>Actividad</th><th>Ubicación</th><th>Entregable</th></tr></thead><tbody>
        <tr><td>Generar secuencia por volumen</td><td>Secuenciación</td><td>Distribución uniforme diaria</td></tr>
        <tr><td>Generar secuencia por mix</td><td>Secuenciación</td><td>Alternancia de productos</td></tr>
      </tbody></table>

      <h3>Paso 5: Visualizar en la Caja Heijunka</h3>
      <table class="manual-table"><thead><tr><th>Actividad</th><th>Ubicación</th><th>Entregable</th></tr></thead><tbody>
        <tr><td>Abrir el tablero visual</td><td>Caja Heijunka</td><td>Tablero con tarjetas Kanban</td></tr>
        <tr><td>Verificar la distribución</td><td>Caja Heijunka</td><td>Secuencia nivelada visual</td></tr>
      </tbody></table>

      <h3>Paso 6: Monitorear</h3>
      <table class="manual-table"><thead><tr><th>Actividad</th><th>Ubicación</th><th>Entregable</th></tr></thead><tbody>
        <tr><td>Revisar KPIs de desempeño</td><td>Dashboards</td><td>WIP, Lead Time, Adherencia</td></tr>
        <tr><td>Identificar desviaciones</td><td>Dashboards</td><td>Acciones correctivas</td></tr>
      </tbody></table>

      <div class="manual-tip"><span class="manual-tip-icon">💡</span><span><strong>NexIA Heijunka v1.0.0</strong> — Sistema de Nivelación de Producción. Desarrollado con ❤️ por NexIA</span></div>
    `
  }
];
