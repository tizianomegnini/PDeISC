/**
 * Datos de ejemplo del portfolio.
 *
 * IMPORTANTE: reemplazá estos valores por tus datos reales antes de publicar
 * el sitio. Este archivo se usa como respaldo automático cuando Supabase
 * no está configurado (ver src/lib/supabaseClient.js y src/hooks/usePortfolioData.js),
 * así el sitio funciona igual sin depender de una base de datos.
 */

export const profile = {
  name: "Tiziano Ian Riquelme Megnini",
  role: "Estudiantes Secundario Tecnico",
  location: "Mar del Plata, Argentina",
  summary:
    "Men enfoco en el mantenimiento del hardware dde las Pc.",
  bio: [
    "Estoy cursando el ingreso a la facultad de ingenieria.",
    "Fuera del código, dedico tiemp.",
  ],
  email: "tizianoriquelmemegnini@gmail.com",
  github: "https://github.com/tizianomegnini",
  linkedin: "https://linkedin.com/in/tiziano-riquelme",
  facts: [
    { label: "Años programando", value: "3+" },
    { label: "Proyectos entregados", value: "30+" },
    { label: "Stack principal", value: "React" },
    { label: "Disponibilidad", value: "Full-time" },
  ],
};

export const skillGroups = [
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      { name: "React", level: 75 },
      { name: "JavaScript (ES6+)", level: 80 },
      { name: "CSS / diseño responsive", level: 90 },
    ],
  },
  {
    id: "backend",
    title: "Backend & datos",
    skills: [
      { name: "Node.js", level: 75 },
      { name: "SQL / Supabase", level: 75 },
      { name: "APIs REST", level: 70 },
    ],
  },
  {
    id: "herramientas",
    title: "Herramientas",
    skills: [
      { name: "Git / GitHub", level: 85 },
      { name: "Figma", level: 60 },
      { name: "Testing (Vitest)", level: 55 },
    ],
  },
];

export const achievements = [
  {
    id: "a1",
    value: "1er puesto",
    label: "Hackathon Universitaria 2025",
    detail: "Proyecto de accesibilidad web, entre 40 equipos.",
  },
  {
    id: "a2",
    value: "+15",
    label: "Contribuciones open source",
    detail: "Pull requests aceptados en proyectos de la comunidad.",
  },
  {
    id: "a3",
    value: "Certificación",
    label: "React avanzado",
    detail: "Curso completo con proyecto final evaluado.",
  },
  {
    id: "a4",
    value: "4.9/5",
    label: "Valoración freelance",
    detail: "Promedio en 20 proyectos entregados.",
  },
];

export const experience = [
  {
    id: "e1",
    role: "Desarrolladora Frontend",
    org: "Estudio Digital SRL",
    period: "2024 — Presente",
    description:
      "Desarrollo de interfaces en React para productos de e-commerce, coordinando con diseño y backend.",
    tags: ["React", "TypeScript", "Vite"],
  },
  {
    id: "e2",
    role: "Pasantía en desarrollo web",
    org: "Cooperativa TechLab",
    period: "2023 — 2024",
    description: "Construcción de landing pages y mantenimiento de un CMS interno.",
    tags: ["JavaScript", "WordPress", "CSS"],
  },
  {
    id: "e3",
    role: "Freelance",
    org: "Proyectos independientes",
    period: "2022 — 2023",
    description: "Sitios a medida para emprendimientos locales, del diseño al despliegue.",
    tags: ["HTML/CSS", "Figma", "Hosting"],
  },
];

export const projects = [
  {
    id: "p1",
    title: "Gestor de tareas colaborativo",
    description: "Tablero estilo Kanban en tiempo real, con autenticación y roles de equipo.",
    tags: ["React", "Supabase", "Realtime"],
    category: "Web app",
    repoUrl: "https://github.com/tu-usuario/proyecto-1",
    demoUrl: "https://ejemplo-demo.vercel.app",
  },
  {
    id: "p2",
    title: "Visualizador de datos climáticos",
    description: "Dashboard con gráficos interactivos a partir de una API pública.",
    tags: ["React", "Charts", "API REST"],
    category: "Dashboard",
    repoUrl: "https://github.com/tu-usuario/proyecto-2",
    demoUrl: "",
  },
  {
    id: "p3",
    title: "Tienda de artesanías",
    description: "E-commerce chico con carrito, checkout simulado y panel de administración.",
    tags: ["React", "Node.js", "SQL"],
    category: "Web app",
    repoUrl: "https://github.com/tu-usuario/proyecto-3",
    demoUrl: "https://ejemplo-tienda.vercel.app",
  },
  {
    id: "p4",
    title: "Identidad visual — estudio Lúmina",
    description: "Sitio de una página para un estudio de diseño, con foco en tipografía.",
    tags: ["React", "Diseño"],
    category: "Landing",
    repoUrl: "https://github.com/tu-usuario/proyecto-4",
    demoUrl: "",
  },
];

/*```js
/**
 * Datos de ejemplo del portfolio.
 *
 * IMPORTANTE: reemplazá estos valores por tus datos reales antes de publicar
 * el sitio. Este archivo se usa como respaldo automático cuando Supabase
 * no está configurado (ver src/lib/supabaseClient.js y src/hooks/usePortfolioData.js),
 * así el sitio funciona igual sin depender de una base de datos.
 

export const profile = {
  name: "Tiziano Ian Riquelme Megnini",
  role: "Estudiante Técnico en Informática",
  location: "Mar del Plata, Argentina",
  summary:
    "Me enfoco en el mantenimiento y reparación de PCs, con conocimientos de programación y redes informáticas.",
  bio: [
    "Me gusta la informática, especialmente el hardware y el mantenimiento de computadoras.",
    "Mi objetivo es estudiar Ingeniería en Computación y continuar desarrollándome en el área tecnológica.",
  ],
  email: "tizianoriquelmemegnini@gmail.com",
  github: "https://github.com/tizianomegnini",
  linkedin: "https://www.linkedin.com/in/tiziano-riquelme/",
  facts: [
    { label: "Años programando", value: "4+" },
    { label: "Proyectos web", value: "25+" },
    { label: "Stack principal", value: "JavaScript" },
    { label: "Disponibilidad", value: "Full-time" },
  ],
};

export const skillGroups = [
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      { name: "HTML", level: 90 },
      { name: "CSS / diseño responsive", level: 90 },
      { name: "JavaScript", level: 70 },
      { name: "React", level: 45 },
    ],
  },
  {
    id: "backend",
    title: "Backend & datos",
    skills: [
      { name: "Node.js", level: 70 },
      { name: "Express", level: 70 },
      { name: "MySQL / SQL", level: 70 },
      { name: "Python", level: 70 },
    ],
  },
  {
    id: "herramientas",
    title: "Herramientas y sistemas",
    skills: [
      { name: "Git / GitHub", level: 85 },
      { name: "Linux", level: 45 },
      { name: "Redes / Packet Tracer", level: 80 },
      { name: "Hardware / mantenimiento de PC", level: 95 },
    ],
  },
];

export const achievements = [
  {
    id: "a1",
    value: "2 cursos",
    label: "Cisco Networking Academy",
    detail:
      "Cursos realizados sobre Cisco Packet Tracer y Linux.",
  },
  {
    id: "a2",
    value: "3",
    label: "Ferias de ciencias",
    detail:
      "Participación en dos ferias provinciales y una municipal en Mar del Plata y Mar de Ajó.",
  },
  {
    id: "a3",
    value: "3",
    label: "Exposiciones escolares",
    detail:
      "Presentación de proyectos tecnológicos, incluyendo el robot K2-SO y diferentes juegos web desarrollados con JavaScript.",
  },
  {
    id: "a4",
    value: "K2-SO",
    label: "Proyecto de robótica",
    detail:
      "Robot desarrollado en equipo para competencias de robótica, utilizando Arduino Uno, sensores ultrasónicos e infrarrojos.",
  },
];

export const experience = [
  {
    id: "e1",
    role: "Mantenimiento y reparación de PCs",
    org: "Trabajos independientes",
    period: "Actualidad",
    description:
      "Diagnóstico, armado, actualización y reparación de computadoras. También realizo limpieza, cambio de componentes, instalación de sistemas operativos y drivers, evaluación de componentes y tasación de equipos. Trabajo de manera remunerada para conocidos.",
    tags: ["Hardware", "Diagnóstico", "Armado de PC", "Mantenimiento"],
  },
  {
    id: "e2",
    role: "Desarrollo web",
    org: "Escuela de Artes Visuales Martín A. Malharro",
    period: "En desarrollo",
    description:
      "Participo en un proyecto grupal para desarrollar la página web de la institución. Mi participación incluye tareas de frontend, como la implementación de imágenes rotativas en el footer, y algunas tareas de backend.",
    tags: ["React", "Frontend", "Backend", "Trabajo grupal"],
  },
];

export const projects = [
  {
    id: "p1",
    title: "PDeISC — Colección de proyectos web",
    description:
      "Repositorio escolar que reúne alrededor de 25 proyectos organizados en diferentes carpetas. Incluye páginas informativas, sistemas de registro e inicio de sesión, APIs y distintos proyectos desarrollados con HTML, CSS, JavaScript, Node.js, React y MySQL. El repositorio continúa creciendo con nuevos proyectos.",
    tags: ["HTML", "CSS", "JavaScript", "Node.js", "React", "MySQL"],
    category: "Colección web",
    repoUrl: "https://github.com/tizianomegnini/PDeISC",
    demoUrl: "",
  },
  {
    id: "p2",
    title: "K2-SO — Robot de competición",
    description:
      "Robot desarrollado en equipo de dos integrantes para participar en competencias de robótica. La primera prueba consistía en retirar cubos de una zona de manera autónoma utilizando sensores; la segunda era una competencia de sumo 1 contra 1 controlada mediante celular; y la tercera era un desafío de seguimiento de línea. Participé principalmente en el armado, sensores, conexiones, diseño, pruebas y parte de la programación.",
    tags: ["Arduino Uno", "Sensores", "Robótica", "Programación"],
    category: "Robótica",
    repoUrl: "",
    demoUrl: "",
  },
  {
    id: "p3",
    title: "Web Escuela de Artes Visuales Martín A. Malharro",
    description:
      "Proyecto grupal para el desarrollo de la página web de la Escuela de Artes Visuales Martín A. Malharro. Mi participación se centra principalmente en el frontend, incluyendo una sección con imágenes rotativas en el footer, además de algunas tareas relacionadas con el backend. El proyecto continúa actualmente en desarrollo.",
    tags: ["React", "Frontend", "Backend", "Trabajo grupal"],
    category: "Web app",
    repoUrl: "",
    demoUrl: "",
  },
];
```
*/