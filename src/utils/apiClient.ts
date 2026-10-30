import { ResumeAnalysisData, SkillGapData, CareerRole } from '../types';

/**
 * Robust API Client with safe JSON parsing, Content-Type validation,
 * and reliable offline/client-side fallback for serverless deployments (e.g. Vercel).
 */

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  isAiGenerated?: boolean;
}

export async function safePostJson<T = any>(
  endpoint: string,
  body: Record<string, any>,
  fallbackGenerator?: () => T
): Promise<{ success: boolean; data: T; error?: string; isFallback?: boolean }> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    // 1. If response is not JSON (e.g. HTML 404 error page from Vercel static rewrites)
    if (!isJson) {
      const rawText = await response.text();
      console.warn(`[API Client] Received non-JSON response from ${endpoint} (Status ${response.status}):`, rawText.slice(0, 150));

      if (fallbackGenerator) {
        return {
          success: true,
          data: fallbackGenerator(),
          isFallback: true,
        };
      }

      throw new Error(
        `Server returned non-JSON (${response.status}). If deployed on Vercel, ensure GEMINI_API_KEY is configured in Vercel Project Settings > Environment Variables.`
      );
    }

    // 2. Response is JSON - parse safely
    const json = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !json.success) {
      // If server returned a controlled error message
      const errorMsg = json.error || `Server responded with status ${response.status}`;
      if (fallbackGenerator) {
        console.warn(`[API Client] API error (${errorMsg}), applying intelligent fallback.`);
        return {
          success: true,
          data: fallbackGenerator(),
          isFallback: true,
        };
      }
      throw new Error(errorMsg);
    }

    if (!json.data) {
      if (fallbackGenerator) {
        return {
          success: true,
          data: fallbackGenerator(),
          isFallback: true,
        };
      }
      throw new Error('API returned success without data payload.');
    }

    return {
      success: true,
      data: json.data,
      isFallback: false,
    };
  } catch (err: any) {
    console.warn(`[API Client] Error calling ${endpoint}:`, err.message);

    if (fallbackGenerator) {
      console.info(`[API Client] Seamlessly activating client-side analysis fallback.`);
      return {
        success: true,
        data: fallbackGenerator(),
        isFallback: true,
      };
    }

    throw new Error(
      err.message?.includes('JSON')
        ? 'Could not connect to backend API. Please verify backend deployment and environment variables.'
        : err.message || 'Network request failed'
    );
  }
}

/**
 * Client-Side Heuristic Fallback for Resume Analysis
 * Ensures users NEVER get a blank screen or JSON parse error on Vercel
 */
export function generateClientResumeAnalysis(resumeText: string, targetRole: CareerRole): ResumeAnalysisData {
  const lower = resumeText.toLowerCase();

  const commonTech = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'react', 'node.js', 'express',
    'next.js', 'vue', 'angular', 'sql', 'postgresql', 'mongodb', 'docker', 'kubernetes',
    'aws', 'git', 'ci/cd', 'tailwind', 'graphql', 'rest api', 'machine learning', 'tensorflow',
    'html', 'css', 'redux', 'linux', 'bash', 'redis'
  ];

  const detectedSkills = commonTech.filter(tech => lower.includes(tech));
  if (detectedSkills.length === 0) {
    detectedSkills.push('JavaScript', 'Git', 'HTML/CSS', 'Problem Solving');
  }

  const roleSpecificSkills: Record<string, string[]> = {
    'Frontend Developer': ['React 19', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Web Performance Optimization', 'Unit Testing'],
    'Backend Developer': ['Node.js', 'PostgreSQL', 'System Design', 'Docker', 'Redis', 'Microservices Architecture'],
    'Full Stack Developer': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'CI/CD Automation'],
    'Data Scientist': ['Python', 'SQL', 'Pandas', 'Scikit-Learn', 'Statistical Inference', 'Data Visualization'],
    'AI/ML Engineer': ['PyTorch', 'Linear Algebra', 'LLMs & RAG', 'Vector Databases', 'Model Optimization', 'Python'],
    'DevOps Engineer': ['Kubernetes', 'Terraform', 'AWS/GCP', 'Docker', 'Prometheus & Grafana', 'Linux'],
    'Cloud Engineer': ['AWS/GCP Architecture', 'Terraform', 'VPC Networking', 'IAM Policies', 'Serverless', 'Security'],
    'Cybersecurity Engineer': ['OWASP Top 10', 'Network Security', 'Penetration Testing', 'SIEM Tooling', 'Cryptography', 'Linux'],
    'Software Developer': ['Data Structures & Algorithms', 'Clean Code Architecture', 'Git', 'Relational Databases', 'Unit Testing'],
  };

  const targetList = roleSpecificSkills[targetRole] || roleSpecificSkills['Software Developer'];
  const missingSkills = targetList.filter(
    req => !detectedSkills.some(ds => ds.toLowerCase().includes(req.toLowerCase()))
  );

  const candidateName =
    resumeText.match(/^[A-Z][a-z]+ [A-Z][a-z]+/m)?.[0] || 'Technical Candidate';

  const atsScore = Math.min(94, Math.max(62, 60 + detectedSkills.length * 3 - missingSkills.length * 2));

  return {
    candidateName,
    atsScore,
    summary: `Resume demonstrates solid competencies for ${targetRole}. Adding quantified performance benchmarks and highlighting missing modern toolchains will significantly boost recruiter callbacks.`,
    scoreBreakdown: {
      impactAndMetrics: 72,
      skillsMatch: Math.min(95, 60 + detectedSkills.length * 4),
      brevityAndFormat: 88,
      experienceRelevance: 75,
    },
    education: ['B.S. in Computer Science or Technical Field / Equivalent Practical Experience'],
    detectedSkills: detectedSkills.map(s => s.toUpperCase()),
    missingSkills: missingSkills.length > 0 ? missingSkills : ['System Design', 'Performance Benchmarking', 'CI/CD Automation'],
    topStrengths: [
      'Clear, logical document structure and readable technical hierarchy',
      'Direct inclusion of foundational programming languages and libraries',
      'Demonstrated focus on practical software deliverables',
    ],
    areasForImprovement: [
      'Quantify impact metrics (e.g., latency reduction, request scale, conversion lifts)',
      `Explicitly showcase more ${targetRole} industry standards like ${missingSkills.slice(0, 2).join(' and ') || 'modern cloud tooling'}`,
      'Upgrade passive phrasing (Worked on, Helped with) to high-agency action verbs (Architected, Engineered, Optimized)',
    ],
    bulletImprovements: [
      {
        original: 'Worked on building frontend components for an internal tool.',
        improved: 'Architected 14+ reusable React/TypeScript UI modules, slashing frontend technical debt and cutting page load latency by 32%.',
        rationale: 'Replaces passive "Worked on" with high-agency "Architected" and introduces measurable impact.',
      },
      {
        original: 'Responsible for backend database queries and APIs.',
        improved: 'Engineered 12 RESTful API endpoints in Node.js/PostgreSQL, reducing average query response time from 420ms to 85ms under peak load.',
        rationale: 'Specifies technologies and provides concrete before/after performance benchmarks.',
      },
      {
        original: 'Helped deploy application and fixed bugs.',
        improved: 'Automated CI/CD pipeline with Docker and GitHub Actions, reducing release cycle deployment time from 45 minutes to 4 minutes.',
        rationale: 'Quantifies time savings and names industry-standard DevOps tools.',
      },
    ],
    recommendedCertifications: [
      'AWS Certified Developer Associate / Cloud Practitioner',
      'Meta Professional Frontend / Backend Certification',
    ],
    fileName: `${targetRole.replace(/\s+/g, '_')}_Resume.txt`,
    analyzedAt: new Date().toLocaleDateString(),
  };
}

/**
 * Client-Side Heuristic Fallback for Skill Gap Analysis
 */
export function generateClientSkillGap(
  targetRole: string,
  currentSkills: string[],
  experienceLevel: string
): SkillGapData {
  const roleBenchmarks: Record<string, { critical: string[]; recommended: string[] }> = {
    'Frontend Developer': {
      critical: ['TypeScript', 'React 19 / Modern Hooks', 'Tailwind CSS', 'Next.js / SSR'],
      recommended: ['Web Performance Optimization', 'State Management (Zustand)', 'Unit Testing (Vitest)', 'Web Vitals'],
    },
    'Backend Developer': {
      critical: ['Node.js / Express', 'PostgreSQL / SQL Optimization', 'System Design Principles', 'REST & API Security'],
      recommended: ['Docker & Containerization', 'Redis Caching', 'Message Queues (Kafka)', 'Unit & Integration Tests'],
    },
    'Full Stack Developer': {
      critical: ['TypeScript', 'React', 'Node.js / Backend Framework', 'Relational Databases (PostgreSQL)'],
      recommended: ['Docker', 'REST / GraphQL APIs', 'Tailwind CSS', 'Authentication & OAuth Flows'],
    },
    'Data Scientist': {
      critical: ['Python', 'SQL & Relational DBs', 'Pandas & NumPy', 'Data Visualization (Matplotlib)'],
      recommended: ['Scikit-Learn Machine Learning', 'Statistical Inference', 'Jupyter Lab Workflows', 'Feature Engineering'],
    },
    'AI/ML Engineer': {
      critical: ['Python', 'PyTorch or TensorFlow', 'Linear Algebra & Calculus', 'LLM Prompt Engineering & APIs'],
      recommended: ['Vector Databases (Pinecone/Chroma)', 'RAG Architecture', 'Model Quantization', 'Hugging Face Ecosystem'],
    },
    'Cybersecurity Engineer': {
      critical: ['Network Protocols (TCP/IP, DNS, SSL/TLS)', 'Linux Systems Administration', 'OWASP Top 10 Vulnerabilities', 'Identity & Access Management (IAM)'],
      recommended: ['SIEM Tooling (Splunk/Wazuh)', 'Penetration Testing (Burp Suite)', 'Python Scripting for Security', 'Cryptography Fundamentals'],
    },
    'Cloud Engineer': {
      critical: ['AWS or GCP Core Services', 'Linux & Bash Scripting', 'Networking (VPC, Subnets)', 'Infrastructure as Code (Terraform)'],
      recommended: ['Docker & ECS/EKS', 'Terraform Modules', 'IAM Security Policies', 'Cost Optimization'],
    },
    'DevOps Engineer': {
      critical: ['Docker', 'Kubernetes (K8s)', 'CI/CD Pipelines (GitHub Actions)', 'Linux OS Internals & Bash'],
      recommended: ['Terraform', 'Prometheus & Grafana Monitoring', 'GitOps (ArgoCD)', 'Cloud Provider (AWS/GCP)'],
    },
    'Software Developer': {
      critical: ['Data Structures & Algorithms', 'Object-Oriented Programming & Clean Code', 'Git Version Control', 'Relational Databases (SQL)'],
      recommended: ['Unit Testing & Test-Driven Development', 'Design Patterns', 'API Development', 'Basic Linux CLI'],
    },
  };

  const benchmark = roleBenchmarks[targetRole] || roleBenchmarks['Software Developer'];
  const currentLower = (currentSkills || []).map(s => s.toLowerCase());

  const existingMatching = [...benchmark.critical, ...benchmark.recommended].filter(skill =>
    currentLower.some(c => c.includes(skill.toLowerCase()) || skill.toLowerCase().includes(c))
  );

  const missingCritical = benchmark.critical.filter(
    skill => !currentLower.some(c => c.includes(skill.toLowerCase()) || skill.toLowerCase().includes(c))
  );

  const missingRecommended = benchmark.recommended.filter(
    skill => !currentLower.some(c => c.includes(skill.toLowerCase()) || skill.toLowerCase().includes(c))
  );

  const totalRequired = benchmark.critical.length + benchmark.recommended.length;
  const matchPercentage = Math.round(
    Math.min(95, Math.max(35, (existingMatching.length / totalRequired) * 100))
  );

  return {
    targetRole,
    matchPercentage,
    existingSkillsMatching: existingMatching.length > 0 ? existingMatching : ['Analytical Problem Solving', 'Git'],
    missingSkills: [
      ...missingCritical.map(name => ({
        name,
        priority: 'Critical' as const,
        description: `Core requirement for modern ${targetRole} positions.`,
        estimatedHours: 24,
      })),
      ...missingRecommended.map(name => ({
        name,
        priority: 'Recommended' as const,
        description: `Significantly enhances technical credibility during technical screening rounds.`,
        estimatedHours: 16,
      })),
    ],
    priorityAreas: [
      {
        area: missingCritical[0] || 'Core Architecture',
        rationale: `Highest weight in tech screen rounds for ${targetRole}.`,
      },
      {
        area: missingCritical[1] || 'Production Tooling & Testing',
        rationale: 'Demonstrates professional development rigor beyond tutorial projects.',
      },
    ],
    learningRoadmap: [
      {
        phase: 'Phase 1: Critical Foundations (Weeks 1-3)',
        goal: `Master missing high-priority core competencies (${missingCritical.slice(0, 2).join(', ') || 'Core Stack'}).`,
        keyTopics: [
          missingCritical[0] || 'Core Programming Fundamentals',
          'Modern Design Patterns & Idioms',
          'Real-world debugging techniques',
        ],
      },
      {
        phase: 'Phase 2: Architectural Depth & Tooling (Weeks 4-7)',
        goal: 'Integrate databases, automated testing, and containerized deployment.',
        keyTopics: [
          missingRecommended[0] || 'Database Query Optimization',
          'Automated Testing Suite (Unit & Integration)',
          'Containerization and Deployment pipelines',
        ],
      },
      {
        phase: 'Phase 3: Capstone Showcase & Portfolio (Weeks 8-10)',
        goal: 'Build an end-to-end production-grade portfolio application showcasing high concurrency or data integrity.',
        keyTopics: [
          'System Architecture Documentation & README',
          'Live Deployment with CI/CD',
          'Technical Interview Defense Preparation',
        ],
      },
    ],
    recommendedProjects: [
      {
        title: `${targetRole} Production Ecosystem`,
        description: `A full-lifecycle application solving a genuine business use case with automated tests, CI/CD, and live monitoring.`,
        techStack: [
          existingMatching[0] || 'TypeScript',
          missingCritical[0] || 'Modern Database',
          'Docker',
          'Cloud Deploy',
        ],
        difficulty: 'Intermediate',
        resumeImpact: `Proves hands-on competence in ${targetRole} workflows without hand-holding.`,
      },
    ],
    careerAdvice: `Focus your study blocks on building rather than passive video consumption. When interviewing for ${targetRole}, candidates who can articulate architectural trade-offs stand out over those who simply recite syntax.`,
  };
}
