export interface ProjectItem {
  id: string;
  /**
   * Real screenshots under /public/work/<id>/. Captured from the project
   * running locally. Absent means no capture exists yet and the UI falls back
   * to a placeholder.
   */
  shots?: string[];
  title: string;
  subtitle: string;
  year: string;
  category: "Full-Stack Web" | "IoT & Hardware" | "Mobile & AI";
  description: string;
  highlights: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  status: "Completed" | "Active Development" | "Production";
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  type: "Work Experience" | "Organizational Leadership";
  summary: string;
  achievements: string[];
  skills: string[];
}

export interface SkillCategory {
  title: string;
  items: { name: string; level: string; description: string }[];
}

export const PERSONAL_INFO = {
  name: "Syafik Barda",
  title: "Computer Engineering Student | Full-Stack & Backend Developer",
  institution: "Diponegoro University (UNDIP)",
  gpa: "3.85 / 4.0",
  location: "Semarang, Indonesia",
  email: "syafikbarda60@gmail.com",
  phone: "+6283869193470",
  whatsappUrl: "https://wa.me/6283869193470",
  github: "https://github.com/syafikbarda60",
  linkedin: "https://www.linkedin.com/in/syafik-barda-7077573ab/",
  availability: "Available for Internship & Full-Stack Opportunities",
  bio: "Computer Engineering undergraduate at Diponegoro University with strong expertise in full-stack web architectures, IoT engineering, and backend systems. Experienced in leading organizational governance as Chief of Organizational Management & Development Unit at HIMASKOM, balancing software craft with strategic execution.",
};

export const HIGHLIGHT_STATS = [
  { value: "3.85", label: "Cumulative GPA", note: "Diponegoro University (UNDIP)" },
  { value: "7+", label: "Engineering Projects", note: "Web, IoT & Machine Learning" },
  { value: "2+", label: "Industry Experiences", note: "Web Dev & IT Systems Support" },
  { value: "3+", label: "Leadership Roles", note: "HIMASKOM, CERC, & URDC" },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "drift",
    shots: ["/work/drift/01.jpg", "/work/drift/02.jpg", "/work/drift/03.jpg", "/work/drift/04.jpg", "/work/drift/05.jpg", "/work/drift/06.jpg"],
    title: "Drift",
    subtitle: "Web-Based Animation Template Platform",
    year: "2026 - Present",
    category: "Full-Stack Web",
    description:
      "A motion-template editor for people with no motion-design background. Pick a Lottie preset, drop in your own text and logo, arrange the scene on a canvas, and export a short showcase video without touching a keyframe.",
    highlights: [
      "Built the whole stack on the Next.js App Router. The API is Route Handlers in the same codebase, so there is no separate backend service to run.",
      "Implemented account handling end to end: registration, email OTP verification, JWT sessions, and hashed credentials against PostgreSQL.",
      "Built a canvas editor over Lottie where scenes are composed visually and rendered out to video, so the export is the product rather than a code snippet.",
    ],
    techStack: ["Next.js", "React", "JavaScript", "PostgreSQL", "JWT Auth", "Lottie", "GSAP", "Tailwind CSS"],
    featured: true,
    status: "Active Development",
  },
  {
    id: "creation-exam",
    shots: ["/work/creation-exam/01.png", "/work/creation-exam/02.png"],
    title: "CREATION 2026 Exam",
    subtitle: "Online Examination Platform with Cheating Detection",
    year: "2026",
    category: "Full-Stack Web",
    description:
      "A secure, real-time online examination platform engineered for the CREATION 2026 event with integrated proctoring safeguards.",
    highlights: [
      "Built continuous webcam proctoring on LiveKit, keeping a live view of each participant for the whole session.",
      "Implemented focus-lockdown detection that logs every tab and window switch straight to the database, surfaced live to proctors as a violations feed.",
      "Split the system into three coordinated services (a Laravel portal, an Express API, and a Next.js exam client) joined by single sign-on over HMAC-SHA256 signed tokens.",
    ],
    techStack: ["Laravel", "Next.js", "Express.js", "LiveKit", "SSE", "MySQL"],
    featured: true,
    status: "Completed",
  },
  {
    id: "swadaya-panen",
    shots: ["/work/swadaya-panen/01.jpg", "/work/swadaya-panen/02.jpg", "/work/swadaya-panen/03.jpg"],
    title: "Swadaya Panen",
    subtitle: "IoT-Based Rice Field Precision Monitoring",
    year: "2025",
    category: "IoT & Hardware",
    description:
      "An integrated IoT telemetry node and web dashboard designed to optimize agricultural yields through precision microclimate monitoring.",
    highlights: [
      "Engineered multi-sensor field nodes logging soil moisture, air temperature, humidity, and light intensity on a single timestamped reading.",
      "Built automated data transmission pipeline streaming real-time telemetry to central database servers.",
      "Created a responsive web dashboard with threshold alarms for immediate critical condition alerts.",
    ],
    techStack: ["IoT Microcontroller", "Sensors", "Laravel", "React", "Vite", "Chakra UI", "MySQL"],
    featured: true,
    status: "Completed",
  },
  {
    id: "npk-monitoring",
    shots: ["/work/npk-monitoring/01.jpg", "/work/npk-monitoring/02.jpg", "/work/npk-monitoring/03.jpg"],
    title: "NPK Precision Soil Analyzer",
    subtitle: "Microcontroller Soil Nutrient Telemetry System",
    year: "2025",
    category: "IoT & Hardware",
    description:
      "A solar-powered IoT system that reads soil Nitrogen, Phosphorus, and Potassium continuously and drives automatic nutrient control, with a web dashboard over the readings.",
    highlights: [
      "Integrated industrial NPK probes with microcontroller firmware, running the whole node off a standalone solar array.",
      "Built the dashboard around hourly N-P-K averages, daily aggregates, and a full sensor-reading history, all served from a Laravel API.",
      "Added harvest logging alongside the sensor stream, so nutrient levels can be read against what the land actually produced.",
    ],
    techStack: ["C++ / Embedded", "NPK Probes", "Solar / PLTS", "Laravel", "React", "Material UI", "MySQL"],
    featured: false,
    status: "Completed",
  },
  {
    id: "rat-pest-detection",
    shots: ["/work/rat-pest-detection/01.jpg", "/work/rat-pest-detection/02.png", "/work/rat-pest-detection/03.png", "/work/rat-pest-detection/04.png"],
    title: "Thermal Rat Pest Detection",
    subtitle: "Ultrasonic Pest Control with Thermal Detection & Field Telemetry",
    year: "2026",
    category: "IoT & Hardware",
    description:
      "A field system that detects rat activity in rice paddies and drives ultrasonic repellers against it: solar-powered nodes reporting telemetry to a web dashboard, with thermal imaging and a CNN on the detection side.",
    highlights: [
      "Trained a Convolutional Neural Network on MLX90640 thermal captures to separate rat activity from background heat at night.",
      "Built the field side on ESP32 and Raspberry Pi: PIR motion sensing, relay-driven ultrasonic emitters, and solar power, posting telemetry over HTTP every few minutes.",
      "Built the Gropyok dashboard on top of it: device health, detection trends, hot-spot ranking, and event rules over PostgreSQL, polled live in the browser.",
    ],
    techStack: ["Python", "CNN", "Thermal Vision", "ESP32 / C++", "Raspberry Pi", "Next.js", "PostgreSQL", "Recharts"],
    featured: false,
    status: "Completed",
  },
  {
    id: "expense-tracker",
    shots: [
      "/work/expense-tracker/01.jpg",
      "/work/expense-tracker/02.jpg",
      "/work/expense-tracker/03.jpg",
      "/work/expense-tracker/04.jpg",
      "/work/expense-tracker/05.jpg",
      "/work/expense-tracker/06.jpg",
      "/work/expense-tracker/07.jpg",
    ],
    title: "ExpenseTracker Mobile",
    subtitle: "Personal Finance & Cash Flow Analytics App",
    year: "2025",
    category: "Mobile & AI",
    description:
      "A cross-platform mobile application providing intuitive transaction logging and dynamic visual analytics.",
    highlights: [
      "Built the app on Expo Router with React Native, backed by a separate Express API deployed to Vercel.",
      "Implemented dynamic charting of monthly cash flow and category breakdowns, plus PDF export and sharing straight from the device.",
      "Combined Supabase-backed accounts with on-device caching, so the ledger stays readable without a connection.",
    ],
    techStack: ["React Native", "Expo", "TypeScript", "Supabase", "Express.js", "Chart Kit"],
    featured: false,
    status: "Completed",
  },
  {
    id: "sitiga",
    shots: ["/work/sitiga/01.jpg", "/work/sitiga/02.jpg", "/work/sitiga/03.jpg", "/work/sitiga/04.jpg"],
    title: "SITIGA",
    subtitle: "RFID-Based Child Growth Monitoring Platform",
    year: "2026",
    category: "Full-Stack Web",
    description:
      "A growth-monitoring platform for parents and health workers. A child taps an RFID card at the post, the measurement is recorded against WHO growth standards, and the history stays readable to whoever is allowed to see it.",
    highlights: [
      "Built an RFID pipeline end to end: tag assignment, a device-facing scan endpoint, scan logs, and health entry keyed straight off the tag.",
      "Issued API keys to field devices through a separate device-auth flow, so hardware authenticates without a human account.",
      "Layered role-based access across user, admin, and super-admin, with an approvals queue for new accounts and bulk spreadsheet import for existing records.",
    ],
    techStack: ["Next.js", "Express.js", "MySQL", "JWT Auth", "RFID", "Recharts", "Tailwind CSS"],
    featured: false,
    status: "Completed",
  },
  {
    id: "whs-portal",
    shots: ["/work/whs-portal/01.jpg", "/work/whs-portal/02.jpg", "/work/whs-portal/03.jpg", "/work/whs-portal/04.jpg", "/work/whs-portal/05.jpg"],
    title: "PT WHS Maritime Corporate Platform",
    subtitle: "Modern Maritime Investment Portal & CMS",
    year: "2025",
    category: "Full-Stack Web",
    description:
      "Complete digital overhaul for PT WHS Maritime Investments, featuring dynamic CMS integration for corporate communications.",
    highlights: [
      "Modernized brand web presence with high-performance responsive page architecture.",
      "Implemented a custom Content Management System for non-technical teams to manage portfolios and press releases.",
      "Structured clear information hierarchy for international maritime stakeholders.",
    ],
    techStack: ["Laravel", "PHP", "React", "Vite", "Material UI", "Bootstrap"],
    featured: false,
    status: "Production",
  },
  {
    id: "himaskom-profile",
    shots: ["/work/himaskom-profile/01.jpg", "/work/himaskom-profile/02.jpg", "/work/himaskom-profile/03.jpg", "/work/himaskom-profile/04.jpg", "/work/himaskom-profile/05.jpg"],
    title: "HIMASKOM Official Web Portal",
    subtitle: "Student Association Digital Hub & Archive",
    year: "2026",
    category: "Full-Stack Web",
    description:
      "Official website and organization portal for the Diponegoro University Computer Engineering Student Association.",
    highlights: [
      "Built the organizational hierarchy, division catalogue, article index, and merchandise store as one content model in a typed data module.",
      "Layered GSAP and Lenis over the whole site so scrolling and section transitions carry the identity rather than sitting on a stock template.",
      "Strengthened institutional visibility across students, faculty, and alumni.",
    ],
    techStack: ["Next.js", "React", "TypeScript", "CSS Modules", "GSAP", "Lenis"],
    featured: false,
    status: "Production",
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    company: "PT WHS Maritime Investments",
    role: "Web Developer Intern",
    period: "Jun 2025 - Jul 2025",
    location: "South Jakarta, Indonesia",
    type: "Work Experience",
    summary:
      "Led the digital transformation and web revitalization for PT WHS Maritime Investments, aligning technical architecture with corporate brand goals.",
    achievements: [
      "Revamped the corporate digital presence by building a modern, performant website aligned with maritime investment brand standards.",
      "Collaborated with executive stakeholders to structure information architecture, communicating core services clearly to institutional investors.",
      "Engineered an intuitive Content Management System (CMS) enabling the internal communications team to deploy news, portfolio updates, and corporate reports seamlessly.",
    ],
    skills: ["Web Development", "CMS Engineering", "Information Architecture", "UI Design", "Stakeholder Communication"],
  },
  {
    company: "PT SidoAgung Farm",
    role: "IT Support Specialist",
    period: "Jan 2022 - Jun 2022",
    location: "Magelang, Indonesia",
    type: "Work Experience",
    summary:
      "Managed critical network infrastructure, hardware reliability, and system configurations across factory operational facilities.",
    achievements: [
      "Provided frontline technical support to factory personnel for network connectivity, hardware diagnostics, and software configurations.",
      "Assisted in deploying and configuring new network nodes and IT equipment during factory operational expansion.",
      "Monitored network traffic and latency metrics, diagnosing and mitigating throughput bottlenecks to ensure uninterrupted data access.",
    ],
    skills: ["Network Infrastructure", "System Administration", "Hardware Diagnostics", "Operational Support"],
  },
  {
    company: "HIMASKOM Diponegoro University",
    role: "Chief of Organizational Management & Development Unit",
    period: "Mar 2025 - Jun 2026",
    location: "Semarang, Indonesia",
    type: "Organizational Leadership",
    summary:
      "Directed the governance, performance oversight, and organizational growth for the Computer Engineering Student Association across a full term.",
    achievements: [
      "Pioneered a major structural reform by founding the Monitoring and Upgrading Division to systematically evaluate and elevate member performance.",
      "Served as Head of Evaluation and Achievement Division, establishing KPI assessment frameworks across all units in HIMASKOM 24.",
      "Mentored division heads, supervised organizational milestones, and streamlined cross-functional coordination.",
    ],
    skills: ["Strategic Leadership", "Organizational Governance", "Performance Evaluation", "Mentorship", "Team Management"],
  },
  {
    company: "Computer Engineering Research Club (CERC)",
    role: "Junior Staff - Software Division",
    period: "Dec 2025 - Present",
    location: "Semarang, Indonesia",
    type: "Organizational Leadership",
    summary:
      "Engage in collaborative software engineering research and cutting-edge tech adoption alongside department researchers.",
    achievements: [
      "Investigated emerging software architectures, web protocols, and modern development frameworks.",
      "Contributed to departmental open-source initiatives and technical knowledge-sharing workshops.",
    ],
    skills: ["Software Engineering Research", "Modern Tech Stacks", "Collaborative Development"],
  },
  {
    company: "UNDIP Robotic Development Center (URDC)",
    role: "Staff - Andromeda Division",
    period: "Sep 2023 - Mar 2024",
    location: "Semarang, Indonesia",
    type: "Organizational Leadership",
    summary:
      "Contributed to specialized research and embedded robotics development for national SAR robotics competitions.",
    achievements: [
      "Completed rigorous technical training focused on Search and Rescue (SAR) robot architectures and autonomous sensor integration.",
      "Assisted in testing hardware-software control loops and sensor telemetry.",
    ],
    skills: ["Robotics Systems", "Sensor Integration", "Embedded Control", "Team Collaboration"],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Full-Stack Web Development",
    items: [
      { name: "React & Next.js", level: "Advanced", description: "App Router, SSR, Server Components, and reactive motion interfaces." },
      { name: "TypeScript & JavaScript", level: "Advanced", description: "Strict type safety, modern ESNext features, asynchronous patterns." },
      { name: "Tailwind CSS", level: "Advanced", description: "Responsive layouts, design tokens, light and dark theming." },
      { name: "Motion & UI Physics", level: "Proficient", description: "Spring transitions, scroll reveals, and layout animation with Motion." },
    ],
  },
  {
    title: "Backend & Systems",
    items: [
      { name: "Node.js & Express", level: "Proficient", description: "RESTful API design, authentication, WebSockets, real-time events." },
      { name: "PHP & Laravel", level: "Proficient", description: "MVC architecture, ORM, CMS development, secure backend services." },
      { name: "MySQL & PostgreSQL", level: "Proficient", description: "Schema normalization, indexing, query optimization, data integrity." },
      { name: "REST APIs & WebSockets", level: "Proficient", description: "Contract design, real-time proctoring streams, sensor telemetry ingestion." },
    ],
  },
  {
    title: "IoT, Hardware & ML",
    items: [
      { name: "Microcontrollers & C++", level: "Proficient", description: "Sensor interfacing (NPK, soil moisture, thermal), serial communication." },
      { name: "IoT Telemetry Architectures", level: "Proficient", description: "Edge-to-cloud data pipelines, threshold alerts, agricultural automation." },
      { name: "Python & Machine Learning", level: "Intermediate", description: "Convolutional Neural Networks (CNN), thermal imaging, computer vision." },
      { name: "React Native", level: "Proficient", description: "Cross-platform mobile apps, offline caching, transactional visualization." },
    ],
  },
  {
    title: "Engineering Practices & Soft Skills",
    items: [
      { name: "Git & Version Control", level: "Advanced", description: "Gitflow branching, collaborative review, repository hygiene." },
      { name: "Organizational Leadership", level: "Advanced", description: "Supervisory oversight, performance KPIs, division restructuring." },
      { name: "System Diagnostics & IT", level: "Proficient", description: "Network performance monitoring, hardware troubleshooting, node rollout." },
      { name: "Bilingual Communication", level: "Fluent", description: "Bahasa Indonesia (Native), English (Professional fluency)." },
    ],
  },
];

export const EDUCATION_INFO = {
  institution: "Diponegoro University (UNDIP)",
  location: "Semarang, Indonesia",
  period: "Aug 2023 - Aug 2027 (expected)",
  degree: "Bachelor of Computer Engineering (S.T.)",
  gpa: "3.85 / 4.0",
  achievements: [
    "Maintained outstanding academic standing with a 3.85 GPA across core computer science and engineering coursework.",
    "Latihan Manajemen Mahasiswa Pradasar Teknik Komputer (LKMM-PD) certification (2023).",
    "Leadership Training Teknik Komputer Diponegoro University (2023).",
  ],
};
