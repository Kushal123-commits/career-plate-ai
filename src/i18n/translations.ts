import { LanguageCode } from '../types';

export interface Translations {
  // Navigation
  dashboard: string;
  resumeAnalyzer: string;
  skillGapAnalyzer: string;
  aiAssistant: string;
  interviewPrep: string;
  learningRoadmap: string;
  jobsTracker: string;
  profile: string;
  login: string;
  signup: string;
  logout: string;
  settings: string;
  
  // Dashboard
  welcomeBack: string;
  careerReadiness: string;
  verifiedSkills: string;
  resumeScore: string;
  quizzesCompleted: string;
  quickActions: string;
  auditResume: string;
  analyzeGaps: string;
  askAssistant: string;
  practiceInterview: string;
  viewRoadmap: string;
  recommendedCareers: string;
  recentActivity: string;
  learningProgress: string;

  // Resume Analyzer
  uploadResume: string;
  uploadDesc: string;
  browseFiles: string;
  dragDrop: string;
  loadSample: string;
  sampleJunior: string;
  sampleStudent: string;
  sampleDevOps: string;
  analyzeButton: string;
  analyzingText: string;
  atsScoreTitle: string;
  scoreBreakdown: string;
  impactMetrics: string;
  skillsMatched: string;
  formatting: string;
  detectedSkills: string;
  missingSkills: string;
  strengths: string;
  weaknesses: string;
  bulletUpgrades: string;
  downloadReport: string;

  // Skill Gap
  targetRoleLabel: string;
  experienceLevelLabel: string;
  yourSkillsLabel: string;
  analyzeSkillsButton: string;
  analyzingSkills: string;
  matchScore: string;
  criticalMissing: string;
  recommendedMissing: string;
  priorityLearning: string;
  suggestedProjects: string;

  // AI Assistant
  assistantTitle: string;
  assistantSubtitle: string;
  typePlaceholder: string;
  send: string;
  clearChat: string;
  popularPrompts: string;

  // Interview Prep
  technicalPractice: string;
  hrBehavioral: string;
  mcqQuizzes: string;
  aiEvaluator: string;
  selectDifficulty: string;
  startQuiz: string;
  yourAnswerLabel: string;
  evaluateAnswer: string;
  evaluating: string;
  evaluationResult: string;
  verdict: string;
  feedback: string;

  // Roadmap & Jobs
  weeklyRoadmap: string;
  generateRoadmap: string;
  dailyHoursLabel: string;
  markComplete: string;
  applicationTracker: string;
  addApplication: string;
  allOpportunities: string;

  // General & Footer
  theme: string;
  language: string;
  footerRights: string;
  hacktoberfest: string;
  about: string;
  features: string;
  privacy: string;
  contact: string;
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    dashboard: 'Dashboard',
    resumeAnalyzer: 'Resume Analyzer',
    skillGapAnalyzer: 'Skill Gap Analyzer',
    aiAssistant: 'AI Career Assistant',
    interviewPrep: 'Interview Preparation',
    learningRoadmap: 'Learning Roadmap',
    jobsTracker: 'Jobs & Internships',
    profile: 'Profile',
    login: 'Log In',
    signup: 'Sign Up',
    logout: 'Log Out',
    settings: 'Settings',

    welcomeBack: 'Welcome back',
    careerReadiness: 'Career Readiness',
    verifiedSkills: 'Verified Skills',
    resumeScore: 'ATS Resume Score',
    quizzesCompleted: 'Quizzes Taken',
    quickActions: 'Quick Actions',
    auditResume: 'Audit Resume',
    analyzeGaps: 'Find Skill Gaps',
    askAssistant: 'Ask AI Copilot',
    practiceInterview: 'Practice Questions',
    viewRoadmap: 'Sprint Roadmap',
    recommendedCareers: 'Recommended Career Paths',
    recentActivity: 'Recent Platform Activity',
    learningProgress: 'Weekly Skill Mastery Progress',

    uploadResume: 'Upload Resume Document',
    uploadDesc: 'Supports PDF, DOCX, and TXT files up to 10MB',
    browseFiles: 'Browse Files',
    dragDrop: 'or drag and drop your resume file here',
    loadSample: 'Or load a sample candidate resume:',
    sampleJunior: 'Junior Full-Stack Dev',
    sampleStudent: 'CS Student / Intern',
    sampleDevOps: 'Cloud & DevOps Intern',
    analyzeButton: 'Analyze Resume with AI',
    analyzingText: 'Analyzing with Gemini AI...',
    atsScoreTitle: 'Overall ATS Score',
    scoreBreakdown: 'Scoring Breakdown',
    impactMetrics: 'Impact & Quantification',
    skillsMatched: 'Skills Alignment',
    formatting: 'Format & ATS Readability',
    detectedSkills: 'Identified Skills',
    missingSkills: 'Missing Critical Skills',
    strengths: 'Candidate Strengths',
    weaknesses: 'Areas for Improvement',
    bulletUpgrades: 'STAR Method Bullet Rewrites',
    downloadReport: 'Download Complete Report',

    targetRoleLabel: 'Select Target Career',
    experienceLevelLabel: 'Current Experience Level',
    yourSkillsLabel: 'Your Current Skills',
    analyzeSkillsButton: 'Analyze Skill Gaps with AI',
    analyzingSkills: 'Mapping Competency Matrix...',
    matchScore: 'Role Match',
    criticalMissing: 'Critical Skills to Acquire',
    recommendedMissing: 'Recommended Complementary Skills',
    priorityLearning: 'Priority Learning Directives',
    suggestedProjects: 'Resume-Defining Portfolio Projects',

    assistantTitle: 'AI Career Companion',
    assistantSubtitle: 'Ask technical questions, system design concepts, or behavioral interview strategies.',
    typePlaceholder: 'Ask anything about code, interviews, resumes, or system design...',
    send: 'Send',
    clearChat: 'Clear Chat',
    popularPrompts: 'Suggested Inquiries',

    technicalPractice: 'Technical Questions',
    hrBehavioral: 'HR & Behavioral',
    mcqQuizzes: 'MCQ Quiz Drills',
    aiEvaluator: 'AI Answer Evaluator',
    selectDifficulty: 'Difficulty Level',
    startQuiz: 'Start Practice Drill',
    yourAnswerLabel: 'Type Your Interview Answer',
    evaluateAnswer: 'Evaluate Answer with AI',
    evaluating: 'Evaluating Answer Depth...',
    evaluationResult: 'Hiring Committee Assessment',
    verdict: 'Interview Verdict',
    feedback: 'Actionable Interview Feedback',

    weeklyRoadmap: '8-Week Personalized Sprint',
    generateRoadmap: 'Generate Custom Roadmap',
    dailyHoursLabel: 'Available Study Time (Hours / Day)',
    markComplete: 'Mark Completed',
    applicationTracker: 'Application Pipeline',
    addApplication: 'Log Application',
    allOpportunities: 'Curated Opportunities',

    theme: 'Theme',
    language: 'Language',
    footerRights: 'All rights reserved.',
    hacktoberfest: 'Hacktoberfest 2026 Special Edition',
    about: 'About',
    features: 'Features',
    privacy: 'Privacy Policy',
    contact: 'Contact Us',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    resumeAnalyzer: 'रिज्यूमे विश्लेषक',
    skillGapAnalyzer: 'स्किल गैप विश्लेषक',
    aiAssistant: 'AI करियर सहायक',
    interviewPrep: 'साक्षात्कार की तैयारी',
    learningRoadmap: 'लर्निंग रोडमैप',
    jobsTracker: 'नौकरी एवं इंटर्नशिप',
    profile: 'प्रोफ़ाइल',
    login: 'लॉग इन',
    signup: 'साइन अप',
    logout: 'लॉग आउट',
    settings: 'सेटिंग्स',

    welcomeBack: 'वापसी पर स्वागत है',
    careerReadiness: 'करियर तत्परता',
    verifiedSkills: 'सत्यापित कौशल',
    resumeScore: 'ATS स्कोर',
    quizzesCompleted: 'प्रश्नोत्तरी पूर्ण',
    quickActions: 'त्वरित कार्रवाई',
    auditResume: 'रिज्यूमे जांचें',
    analyzeGaps: 'स्किल गैप खोजें',
    askAssistant: 'AI से पूछें',
    practiceInterview: 'साक्षात्कार अभ्यास',
    viewRoadmap: 'रोडमैप देखें',
    recommendedCareers: 'अनुशंसित करियर मार्ग',
    recentActivity: 'हाल की गतिविधियां',
    learningProgress: 'कौशल प्रगति चार्ट',

    uploadResume: 'रिज्यूमे अपलोड करें',
    uploadDesc: 'PDF, DOCX और TXT फाइलों का समर्थन (10MB तक)',
    browseFiles: 'फ़ाइल चुनें',
    dragDrop: 'या फ़ाइल को यहां खींचकर छोड़ें',
    loadSample: 'या एक नमूना रिज्यूमे लोड करें:',
    sampleJunior: 'जूनियर फुल-स्टैक',
    sampleStudent: 'कंप्यूटर साइंस छात्र',
    sampleDevOps: 'क्लाउड एवं डेवऑप्स',
    analyzeButton: 'AI से विश्लेषण करें',
    analyzingText: 'Gemini AI विश्लेषण कर रहा है...',
    atsScoreTitle: 'कुल ATS स्कोर',
    scoreBreakdown: 'स्कोर विवरण',
    impactMetrics: 'प्रभाव और आंकड़े',
    skillsMatched: 'कौशल मिलान',
    formatting: 'प्रारूप और पठनीयता',
    detectedSkills: 'पहचाने गए कौशल',
    missingSkills: 'आवश्यक कौशल जो गायब हैं',
    strengths: 'मजबूत पक्ष',
    weaknesses: 'सुधार के क्षेत्र',
    bulletUpgrades: 'STAR पद्धति द्वारा सुधार',
    downloadReport: 'पूरी रिपोर्ट डाउनलोड करें',

    targetRoleLabel: 'लक्षित करियर चुनें',
    experienceLevelLabel: 'वर्तमान अनुभव स्तर',
    yourSkillsLabel: 'आपके वर्तमान कौशल',
    analyzeSkillsButton: 'कौशल विश्लेषण करें',
    analyzingSkills: 'विश्लेषण प्रगति पर है...',
    matchScore: 'भूमिका मिलान',
    criticalMissing: 'अति महत्वपूर्ण कौशल',
    recommendedMissing: 'अनुशंसित कौशल',
    priorityLearning: 'प्राथमिकता क्षेत्र',
    suggestedProjects: 'पोर्टफोलियो प्रोजेक्ट्स',

    assistantTitle: 'AI करियर साथी',
    assistantSubtitle: 'प्रोग्रामिंग, सिस्टम डिज़ाइन या साक्षात्कार रणनीतियों के बारे में पूछें।',
    typePlaceholder: 'कोडिंग, साक्षात्कार या करियर के बारे में पूछें...',
    send: 'भेजें',
    clearChat: 'चैट साफ़ करें',
    popularPrompts: 'सुझाए गए प्रश्न',

    technicalPractice: 'तकनीकी प्रश्न',
    hrBehavioral: 'एचआर और व्यवहार संबंधी',
    mcqQuizzes: 'MCQ क्विज',
    aiEvaluator: 'AI उत्तर मूल्यांकन',
    selectDifficulty: 'कठिनाई स्तर',
    startQuiz: 'अभ्यास शुरू करें',
    yourAnswerLabel: 'अपना उत्तर लिखें',
    evaluateAnswer: 'AI से उत्तर जांचें',
    evaluating: 'मूल्यांकन जारी है...',
    evaluationResult: 'साक्षात्कार मूल्यांकन परिणाम',
    verdict: 'अंतिम निर्णय',
    feedback: 'सुझाव एवं प्रतिक्रिया',

    weeklyRoadmap: '8 सप्ताह का व्यक्तिगत स्प्रिंट',
    generateRoadmap: 'रोडमैप तैयार करें',
    dailyHoursLabel: 'दैनिक अध्ययन समय (घंटे / दिन)',
    markComplete: 'पूर्ण के रूप में चिह्नित करें',
    applicationTracker: 'आवेदन ट्रैकर',
    addApplication: 'आवेदन जोड़ें',
    allOpportunities: 'उपलब्ध अवसर',

    theme: 'थीम',
    language: 'भाषा',
    footerRights: 'सर्वाधिकार सुरक्षित।',
    hacktoberfest: 'हैक्टोबरफेस्ट 2026 संस्करण',
    about: 'परिचय',
    features: 'सुविधाएं',
    privacy: 'गोपनीयता नीति',
    contact: 'संपर्क करें',
  },
  es: {
    dashboard: 'Panel Principal',
    resumeAnalyzer: 'Analizador de CV',
    skillGapAnalyzer: 'Analizador de Habilidades',
    aiAssistant: 'Asistente IA de Carrera',
    interviewPrep: 'Preparación de Entrevistas',
    learningRoadmap: 'Hoja de Ruta',
    jobsTracker: 'Empleos y Prácticas',
    profile: 'Perfil',
    login: 'Iniciar Sesión',
    signup: 'Registrarse',
    logout: 'Cerrar Sesión',
    settings: 'Configuración',

    welcomeBack: 'Bienvenido de nuevo',
    careerReadiness: 'Preparación Profesional',
    verifiedSkills: 'Habilidades Verificadas',
    resumeScore: 'Puntuación ATS',
    quizzesCompleted: 'Cuestionarios Realizados',
    quickActions: 'Acciones Rápidas',
    auditResume: 'Auditar Currículum',
    analyzeGaps: 'Detectar Brechas',
    askAssistant: 'Consultar a la IA',
    practiceInterview: 'Practicar Preguntas',
    viewRoadmap: 'Ver Hoja de Ruta',
    recommendedCareers: 'Rutas Recomendadas',
    recentActivity: 'Actividad Reciente',
    learningProgress: 'Progreso de Habilidades',

    uploadResume: 'Subir Currículum Vitae',
    uploadDesc: 'Soporta archivos PDF, DOCX y TXT hasta 10MB',
    browseFiles: 'Examinar Archivos',
    dragDrop: 'o arrastra y suelta tu archivo aquí',
    loadSample: 'O carga un currículum de muestra:',
    sampleJunior: 'Desarrollador Junior',
    sampleStudent: 'Estudiante de Informática',
    sampleDevOps: 'Practicante DevOps',
    analyzeButton: 'Analizar CV con IA',
    analyzingText: 'Analizando con Gemini IA...',
    atsScoreTitle: 'Puntuación ATS Global',
    scoreBreakdown: 'Desglose de Puntuación',
    impactMetrics: 'Impacto y Cuantificación',
    skillsMatched: 'Alineación de Habilidades',
    formatting: 'Formato y Legibilidad ATS',
    detectedSkills: 'Habilidades Detectadas',
    missingSkills: 'Habilidades Clave Faltantes',
    strengths: 'Fortalezas Principales',
    weaknesses: 'Áreas de Mejora',
    bulletUpgrades: 'Reescrituras Método STAR',
    downloadReport: 'Descargar Informe Completo',

    targetRoleLabel: 'Seleccionar Carrera Objetivo',
    experienceLevelLabel: 'Nivel de Experiencia',
    yourSkillsLabel: 'Tus Habilidades Actuales',
    analyzeSkillsButton: 'Analizar Brechas con IA',
    analyzingSkills: 'Mapeando Competencias...',
    matchScore: 'Compatibilidad de Rol',
    criticalMissing: 'Habilidades Críticas Faltantes',
    recommendedMissing: 'Habilidades Recomendadas',
    priorityLearning: 'Áreas de Aprendizaje Prioritarias',
    suggestedProjects: 'Proyectos de Portafolio',

    assistantTitle: 'Compañero de Carrera IA',
    assistantSubtitle: 'Pregunta sobre código, diseño de sistemas o entrevistas de trabajo.',
    typePlaceholder: 'Escribe tu consulta sobre desarrollo o entrevistas...',
    send: 'Enviar',
    clearChat: 'Limpiar Chat',
    popularPrompts: 'Consultas Populares',

    technicalPractice: 'Preguntas Técnicas',
    hrBehavioral: 'Preguntas de RRHH',
    mcqQuizzes: 'Cuestionarios de Prueba',
    aiEvaluator: 'Evaluador de Respuestas IA',
    selectDifficulty: 'Nivel de Dificultad',
    startQuiz: 'Comenzar Práctica',
    yourAnswerLabel: 'Escribe tu Respuesta',
    evaluateAnswer: 'Evaluar con IA',
    evaluating: 'Evaluando Respuesta...',
    evaluationResult: 'Resultado de la Evaluación',
    verdict: 'Veredicto de Entrevista',
    feedback: 'Comentarios de Mejora',

    weeklyRoadmap: 'Sprint Personalizado de 8 Semanas',
    generateRoadmap: 'Generar Hoja de Ruta',
    dailyHoursLabel: 'Tiempo Diario (Horas / Día)',
    markComplete: 'Marcar como Completado',
    applicationTracker: 'Seguimiento de Postulaciones',
    addApplication: 'Registrar Postulación',
    allOpportunities: 'Oportunidades Seleccionadas',

    theme: 'Tema',
    language: 'Idioma',
    footerRights: 'Todos los derechos reservados.',
    hacktoberfest: 'Edición Hacktoberfest 2026',
    about: 'Acerca de',
    features: 'Características',
    privacy: 'Privacidad',
    contact: 'Contacto',
  },
  fr: {
    dashboard: 'Tableau de Bord',
    resumeAnalyzer: 'Analyseur de CV',
    skillGapAnalyzer: 'Analyse des Compétences',
    aiAssistant: 'Assistant Carrière IA',
    interviewPrep: 'Préparation Entretien',
    learningRoadmap: 'Feuille de Route',
    jobsTracker: 'Emplois et Stages',
    profile: 'Profil',
    login: 'Connexion',
    signup: 'Inscription',
    logout: 'Déconnexion',
    settings: 'Paramètres',

    welcomeBack: 'Bon retour',
    careerReadiness: 'Préparation Carrière',
    verifiedSkills: 'Compétences Validées',
    resumeScore: 'Score ATS du CV',
    quizzesCompleted: 'Quiz Complétés',
    quickActions: 'Actions Rapides',
    auditResume: 'Auditer le CV',
    analyzeGaps: 'Détecter les Écarts',
    askAssistant: 'Consulter l\'IA',
    practiceInterview: 'Pratiquer Entretien',
    viewRoadmap: 'Voir Feuille de Route',
    recommendedCareers: 'Parcours Conseillés',
    recentActivity: 'Activité Récente',
    learningProgress: 'Progression des Compétences',

    uploadResume: 'Téléverser un CV',
    uploadDesc: 'Prend en charge PDF, DOCX et TXT jusqu\'à 10 Mo',
    browseFiles: 'Parcourir les Fichiers',
    dragDrop: 'ou glissez-déposez votre CV ici',
    loadSample: 'Ou chargez un CV d\'exemple :',
    sampleJunior: 'Développeur Junior',
    sampleStudent: 'Étudiant en Informatique',
    sampleDevOps: 'Stagiaire Cloud DevOps',
    analyzeButton: 'Analyser le CV avec l\'IA',
    analyzingText: 'Analyse Gemini IA en cours...',
    atsScoreTitle: 'Score ATS Global',
    scoreBreakdown: 'Détail des Scores',
    impactMetrics: 'Impact et Chiffres',
    skillsMatched: 'Compétences Requises',
    formatting: 'Mise en Page et ATS',
    detectedSkills: 'Compétences Identifiées',
    missingSkills: 'Compétences Manquantes',
    strengths: 'Points Forts',
    weaknesses: 'Axes d\'Amélioration',
    bulletUpgrades: 'Réécritures Méthode STAR',
    downloadReport: 'Télécharger le Rapport',

    targetRoleLabel: 'Métier Cible',
    experienceLevelLabel: 'Niveau d\'Expérience',
    yourSkillsLabel: 'Vos Compétences Actuelles',
    analyzeSkillsButton: 'Analyser avec l\'IA',
    analyzingSkills: 'Analyse des compétences...',
    matchScore: 'Compatibilité du Rôle',
    criticalMissing: 'Compétences Critiques',
    recommendedMissing: 'Compétences Conseillées',
    priorityLearning: 'Axes Prioritaires',
    suggestedProjects: 'Projets de Portfolio',

    assistantTitle: 'Compagnon de Carrière IA',
    assistantSubtitle: 'Posez vos questions sur le code, l\'architecture ou les entretiens.',
    typePlaceholder: 'Posez une question technique ou sur votre carrière...',
    send: 'Envoyer',
    clearChat: 'Effacer Chat',
    popularPrompts: 'Requêtes Suggérées',

    technicalPractice: 'Questions Techniques',
    hrBehavioral: 'Questions RH & Comportement',
    mcqQuizzes: 'Quiz QCM',
    aiEvaluator: 'Évaluateur de Réponse IA',
    selectDifficulty: 'Niveau de Difficulté',
    startQuiz: 'Lancer l\'Exercice',
    yourAnswerLabel: 'Rédigez Votre Réponse',
    evaluateAnswer: 'Évaluer avec l\'IA',
    evaluating: 'Évaluation en cours...',
    evaluationResult: 'Évaluation du Jury',
    verdict: 'Verdict Entretien',
    feedback: 'Recommandations Pratiques',

    weeklyRoadmap: 'Sprint Personnalisé de 8 Semaines',
    generateRoadmap: 'Générer la Feuille de Route',
    dailyHoursLabel: 'Temps Quotidien (Heures / Jour)',
    markComplete: 'Marquer comme Terminé',
    applicationTracker: 'Suivi des Candidatures',
    addApplication: 'Ajouter Candidature',
    allOpportunities: 'Opportunités Sélectionnées',

    theme: 'Thème',
    language: 'Langue',
    footerRights: 'Tous droits réservés.',
    hacktoberfest: 'Édition Hacktoberfest 2026',
    about: 'À Propos',
    features: 'Fonctionnalités',
    privacy: 'Confidentialité',
    contact: 'Contact',
  },
  de: {
    dashboard: 'Dashboard',
    resumeAnalyzer: 'Lebenslauf-Prüfer',
    skillGapAnalyzer: 'Skill-Gap-Analyse',
    aiAssistant: 'KI-Karriereassistent',
    interviewPrep: 'Interview-Vorbereitung',
    learningRoadmap: 'Lern-Roadmap',
    jobsTracker: 'Jobs & Praktika',
    profile: 'Profil',
    login: 'Anmelden',
    signup: 'Registrieren',
    logout: 'Abmelden',
    settings: 'Einstellungen',

    welcomeBack: 'Willkommen zurück',
    careerReadiness: 'Karriere-Bereitschaft',
    verifiedSkills: 'Verifizierte Skills',
    resumeScore: 'ATS-Lebenslauf-Score',
    quizzesCompleted: 'Abgeschlossene Tests',
    quickActions: 'Schnellaktionen',
    auditResume: 'Lebenslauf prüfen',
    analyzeGaps: 'Skill-Lücken finden',
    askAssistant: 'KI-Copilot fragen',
    practiceInterview: 'Interview üben',
    viewRoadmap: 'Roadmap anzeigen',
    recommendedCareers: 'Empfohlene Karrierewege',
    recentActivity: 'Neueste Aktivitäten',
    learningProgress: 'Wöchentlicher Lernfortschritt',

    uploadResume: 'Lebenslauf hochladen',
    uploadDesc: 'Unterstützt PDF, DOCX und TXT bis 10 MB',
    browseFiles: 'Dateien durchsuchen',
    dragDrop: 'oder Datei hierher ziehen',
    loadSample: 'Oder Beispiel-Lebenslauf laden:',
    sampleJunior: 'Junior Full-Stack Entwickler',
    sampleStudent: 'Informatik-Student',
    sampleDevOps: 'Cloud- & DevOps-Praktikant',
    analyzeButton: 'Mit KI analysieren',
    analyzingText: 'Gemini KI analysiert...',
    atsScoreTitle: 'Gesamt-ATS-Score',
    scoreBreakdown: 'Score-Aufschlüsselung',
    impactMetrics: 'Messbarer Einfluss',
    skillsMatched: 'Skill-Übereinstimmung',
    formatting: 'Formatierung & Lesbarkeit',
    detectedSkills: 'Erkannte Fähigkeiten',
    missingSkills: 'Fehlende Schlüsselqualifikationen',
    strengths: 'Kandidaten-Stärken',
    weaknesses: 'Verbesserungspotenziale',
    bulletUpgrades: 'STAR-Methode Optimierungen',
    downloadReport: 'Vollständigen Bericht herunterladen',

    targetRoleLabel: 'Zielberuf auswählen',
    experienceLevelLabel: 'Erfahrungsstufe',
    yourSkillsLabel: 'Ihre aktuellen Skills',
    analyzeSkillsButton: 'Skills mit KI analysieren',
    analyzingSkills: 'Kompetenzmatrix wird erstellt...',
    matchScore: 'Rollen-Passung',
    criticalMissing: 'Kritische Qualifikationen',
    recommendedMissing: 'Empfohlene Ergänzungen',
    priorityLearning: 'Prioritäre Lernbereiche',
    suggestedProjects: 'Portfolio-Projekte',

    assistantTitle: 'KI-Karrierebegleiter',
    assistantSubtitle: 'Fragen zu Code, Systemdesign oder Interview-Strategien stellen.',
    typePlaceholder: 'Frage zu Programmierung oder Karriere stellen...',
    send: 'Senden',
    clearChat: 'Verlauf leeren',
    popularPrompts: 'Häufige Anfragen',

    technicalPractice: 'Technische Fragen',
    hrBehavioral: 'HR & Verhaltensfragen',
    mcqQuizzes: 'MCQ-Übungstests',
    aiEvaluator: 'KI-Antwort-Bewerter',
    selectDifficulty: 'Schwierigkeitsgrad',
    startQuiz: 'Übung starten',
    yourAnswerLabel: 'Ihre Antwort eingeben',
    evaluateAnswer: 'Antwort mit KI bewerten',
    evaluating: 'Antworttiefe wird bewertet...',
    evaluationResult: 'Bewertungsergebnis',
    verdict: 'Interview-Urteil',
    feedback: 'Praktisches Feedback',

    weeklyRoadmap: 'Personalisierter 8-Wochen-Sprint',
    generateRoadmap: 'Roadmap generieren',
    dailyHoursLabel: 'Tägliche Lernzeit (Stunden / Tag)',
    markComplete: 'Als erledigt markieren',
    applicationTracker: 'Bewerbungs-Tracker',
    addApplication: 'Bewerbung erfassen',
    allOpportunities: 'Kuratierte Stellenangebote',

    theme: 'Design',
    language: 'Sprache',
    footerRights: 'Alle Rechte vorbehalten.',
    hacktoberfest: 'Hacktoberfest 2026 Sonderausgabe',
    about: 'Über uns',
    features: 'Funktionen',
    privacy: 'Datenschutz',
    contact: 'Kontakt',
  },
};
