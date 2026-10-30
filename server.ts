import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for calling Gemini with fallback if key is missing or quota exceeded
async function generateGeminiContent(prompt: string, systemInstruction?: string): Promise<string> {
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: systemInstruction
      ? {
          systemInstruction,
        }
      : undefined,
  });

  return response.text || '';
}

// 1. Health check & configuration status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    model: 'gemini-3.8-flash',
    platform: 'Career Plate AI',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 2. AI Resume Analyzer Endpoint
app.post('/api/ai/resume-analyze', async (req: Request, res: Response) => {
  try {
    const { resumeText, targetRole = 'Software Developer' } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 20) {
      return res.status(400).json({
        error: 'Please provide valid resume text of at least 20 characters.',
      });
    }

    const systemPrompt = `You are a Principal Tech Recruiter and Senior Engineering Hiring Manager at top tech firms.
Analyze the provided resume against the target role: "${targetRole}".
Return a strictly valid JSON object (no markdown code blocks, pure JSON) with the following exact shape:
{
  "candidateName": "Extracted candidate name or 'Candidate'",
  "atsScore": number between 40 and 96,
  "summary": "2-sentence executive summary of the resume's strengths and positioning for the target role",
  "scoreBreakdown": {
    "impactAndMetrics": number between 30 and 100,
    "skillsMatch": number between 30 and 100,
    "brevityAndFormat": number between 40 and 100,
    "experienceRelevance": number between 30 and 100
  },
  "education": ["Item 1", "Item 2"],
  "detectedSkills": ["Skill 1", "Skill 2", ...],
  "missingSkills": ["Missing High Priority 1", "Missing High Priority 2", ...],
  "topStrengths": ["Strength 1 with explanation", "Strength 2", "Strength 3"],
  "areasForImprovement": ["Improvement 1", "Improvement 2", "Improvement 3"],
  "bulletImprovements": [
    {
      "original": "A weak or typical bullet found or derived from the resume",
      "improved": "Action-verb driven, quantified STAR format rewrite",
      "rationale": "Why this change increases recruiter response rates"
    },
    {
      "original": "Second weak bullet",
      "improved": "Improved quantified bullet",
      "rationale": "Why this improves impact"
    }
  ],
  "recommendedCertifications": ["Cert 1", "Cert 2"]
}`;

    if (apiKey) {
      try {
        const textResponse = await generateGeminiContent(
          `Target Role: ${targetRole}\n\nResume Content:\n${resumeText.slice(0, 8000)}`,
          systemPrompt
        );

        // Clean up markdown block if model wrapped in ```json
        const cleaned = textResponse
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();

        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, data: parsed, isAiGenerated: true });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to heuristic engine:', geminiError?.message);
      }
    }

    // Heuristic Fallback Analysis Engine
    const lower = resumeText.toLowerCase();
    const commonTech = [
      'javascript', 'typescript', 'python', 'java', 'c++', 'react', 'node.js', 'express',
      'next.js', 'vue', 'angular', 'sql', 'postgresql', 'mongodb', 'docker', 'kubernetes',
      'aws', 'git', 'ci/cd', 'tailwind', 'graphql', 'rest api', 'machine learning', 'tensorflow'
    ];
    const detectedSkills = commonTech.filter(tech => lower.includes(tech));
    if (detectedSkills.length === 0) {
      detectedSkills.push('Problem Solving', 'Git', 'HTML/CSS', 'JavaScript');
    }

    const roleSpecificRequirements: Record<string, string[]> = {
      'Frontend Developer': ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Performance Optimization', 'Web Accessibility (a11y)'],
      'Backend Developer': ['Node.js', 'PostgreSQL', 'System Design', 'Docker', 'Redis', 'Microservices'],
      'Full Stack Developer': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'CI/CD Pipelines'],
      'Data Scientist': ['Python', 'SQL', 'Pandas', 'Scikit-Learn', 'Statistical Modeling', 'Tableau'],
      'AI/ML Engineer': ['PyTorch', 'TensorFlow', 'LLMs', 'Vector Databases', 'Model Fine-tuning', 'Python'],
      'DevOps Engineer': ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'Monitoring (Prometheus)', 'Linux'],
      'Cloud Engineer': ['AWS/GCP', 'Terraform', 'Cloud Architecture', 'Networking VPC', 'Serverless', 'Security'],
      'Cybersecurity Engineer': ['SIEM', 'Penetration Testing', 'Network Security', 'OWASP Top 10', 'SOC Analysis', 'Cryptography'],
      'Software Developer': ['Data Structures & Algorithms', 'Git', 'Clean Architecture', 'Unit Testing', 'Relational Databases', 'OOP'],
    };

    const targetList = roleSpecificRequirements[targetRole] || roleSpecificRequirements['Software Developer'];
    const missingSkills = targetList.filter(
      req => !detectedSkills.some(ds => ds.toLowerCase().includes(req.toLowerCase()))
    );

    const calculatedScore = Math.min(94, Math.max(58, 62 + detectedSkills.length * 3 - missingSkills.length * 2));

    const fallbackData = {
      candidateName: resumeText.match(/^[A-Z][a-z]+ [A-Z][a-z]+/m)?.[0] || 'Tech Applicant',
      atsScore: calculatedScore,
      summary: `Resume demonstrates solid baseline competencies for ${targetRole}. Adding concrete quantified metrics and highlighting modern cloud/testing tools will noticeably boost callback rates.`,
      scoreBreakdown: {
        impactAndMetrics: 68,
        skillsMatch: Math.min(95, 60 + detectedSkills.length * 4),
        brevityAndFormat: 85,
        experienceRelevance: 72,
      },
      education: ['B.S. in Computer Science or Related Field / Practical Equivalency'],
      detectedSkills: detectedSkills.map(s => s.toUpperCase()),
      missingSkills: missingSkills.length > 0 ? missingSkills : ['System Design', 'Performance Benchmarking', 'CI/CD Automation'],
      topStrengths: [
        'Clear organizational structure with logical chronology',
        'Direct mention of foundational languages and libraries',
        'Focus on software development deliverables',
      ],
      areasForImprovement: [
        'Quantify achievements (e.g., latency reduction, user scale, conversion metrics)',
        `Explicitly showcase more ${targetRole} industry standards like ${missingSkills.slice(0, 2).join(' and ')}`,
        'Use strong action verbs (Architected, Engineered, Optimized) instead of passive phrasing (Worked on, Helped with)',
      ],
      bulletImprovements: [
        {
          original: 'Worked on building frontend components for an internal tool.',
          improved: 'Architected 14+ reusable React/TypeScript UI modules, slashing frontend technical debt and cutting page load latency by 32%.',
          rationale: 'Replaces passive "Worked on" with high-agency "Architected" and introduces measurable impact.'
        },
        {
          original: 'Responsible for backend database queries and APIs.',
          improved: 'Engineered 12 RESTful API endpoints in Node.js/PostgreSQL, reducing average query response time from 420ms to 85ms under peak load.',
          rationale: 'Specifies technologies and provides concrete before/after performance benchmarks.'
        }
      ],
      recommendedCertifications: [
        'AWS Certified Cloud Practitioner or Developer Associate',
        'Meta Front-End / Back-End Developer Professional Certificate'
      ]
    };

    return res.json({
      success: true,
      data: fallbackData,
      isAiGenerated: false,
      notice: apiKey ? undefined : 'Running on Career Plate intelligent analysis engine. Attach GEMINI_API_KEY in Settings > Secrets for Gemini 3.8 Flash live analysis.',
    });
  } catch (error: any) {
    console.error('Error in resume-analyze:', error);
    res.status(500).json({ error: error.message || 'Internal server error analyzing resume.' });
  }
});

// 3. AI Skill Gap Analyzer Endpoint
app.post('/api/ai/skill-gap', async (req: Request, res: Response) => {
  try {
    const { targetRole, currentSkills = [], experienceLevel = 'Junior' } = req.body;

    if (!targetRole) {
      return res.status(400).json({ error: 'Target role is required.' });
    }

    const systemPrompt = `You are a Senior Tech Career Architect.
Analyze the candidate's skills for the target role "${targetRole}" at experience level "${experienceLevel}".
Current Skills: ${JSON.stringify(currentSkills)}.
Return a strictly valid JSON object (no markdown, pure JSON) with the following structure:
{
  "targetRole": "${targetRole}",
  "matchPercentage": number between 30 and 95,
  "existingSkillsMatching": ["Skill 1", "Skill 2"],
  "missingSkills": [
    {
      "name": "Skill Name",
      "priority": "Critical" | "Recommended" | "Good to have",
      "description": "Why it matters in 2026",
      "estimatedHours": number (e.g. 20)
    }
  ],
  "priorityAreas": [
    {
      "area": "Focus Area Name",
      "rationale": "Why prioritize this first"
    }
  ],
  "learningRoadmap": [
    {
      "phase": "Phase 1: Foundation (Weeks 1-3)",
      "goal": "Core objective",
      "keyTopics": ["Topic 1", "Topic 2", "Topic 3"]
    },
    {
      "phase": "Phase 2: Practical Mastery (Weeks 4-7)",
      "goal": "Core objective",
      "keyTopics": ["Topic 1", "Topic 2", "Topic 3"]
    },
    {
      "phase": "Phase 3: Production & Portfolio (Weeks 8-10)",
      "goal": "Core objective",
      "keyTopics": ["Topic 1", "Topic 2", "Topic 3"]
    }
  ],
  "recommendedProjects": [
    {
      "title": "Project Title",
      "description": "Production-grade project scope",
      "techStack": ["Tech 1", "Tech 2", "Tech 3"],
      "difficulty": "Intermediate" | "Advanced",
      "resumeImpact": "How it stands out to senior hiring managers"
    }
  ],
  "careerAdvice": "Direct actionable career advice for this transition"
}`;

    if (apiKey) {
      try {
        const textResponse = await generateGeminiContent(
          `Target Role: ${targetRole}\nLevel: ${experienceLevel}\nCurrent Skills: ${currentSkills.join(', ')}`,
          systemPrompt
        );
        const cleaned = textResponse
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, data: parsed, isAiGenerated: true });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed for skill gap:', geminiError?.message);
      }
    }

    // Role-based comprehensive fallback
    const roleBenchmarks: Record<string, { critical: string[]; recommended: string[]; optional: string[] }> = {
      'Frontend Developer': {
        critical: ['TypeScript', 'React 19 / Modern Hooks', 'Tailwind CSS', 'Next.js / SSR'],
        recommended: ['Web Performance Optimization', 'State Management (Zustand/Redux)', 'Unit Testing (Vitest/Jest)', 'Web Vitals'],
        optional: ['Three.js', 'Storybook', 'PWA / Service Workers', 'GraphQL'],
      },
      'Backend Developer': {
        critical: ['Node.js / Express', 'PostgreSQL / SQL Optimization', 'System Design Principles', 'REST & API Security'],
        recommended: ['Docker & Containerization', 'Redis Caching', 'Message Queues (Kafka/RabbitMQ)', 'Unit & Integration Tests'],
        optional: ['Kubernetes', 'gRPC', 'Elasticsearch', 'CI/CD Automation'],
      },
      'Full Stack Developer': {
        critical: ['TypeScript', 'React', 'Node.js / Backend Framework', 'Relational Databases (PostgreSQL)'],
        recommended: ['Docker', 'REST / GraphQL APIs', 'Tailwind CSS', 'Authentication & OAuth Flows'],
        optional: ['CI/CD Pipelines', 'AWS Deployment', 'Redis', 'Microservices'],
      },
      'Data Scientist': {
        critical: ['Python', 'SQL & Relational DBs', 'Pandas & NumPy', 'Data Visualization (Matplotlib/Seaborn)'],
        recommended: ['Scikit-Learn Machine Learning', 'Statistical Inference', 'Jupyter Lab Workflows', 'Feature Engineering'],
        optional: ['Deep Learning (PyTorch)', 'MLflow', 'Tableau / PowerBI', 'Big Data (Spark)'],
      },
      'AI/ML Engineer': {
        critical: ['Python', 'PyTorch or TensorFlow', 'Linear Algebra & Calculus', 'LLM Prompt Engineering & APIs'],
        recommended: ['Vector Databases (Pinecone/Chroma)', 'RAG Architecture', 'Model Quantization & Inference Optimization', 'Hugging Face Ecosystem'],
        optional: ['Fine-Tuning (LoRA/PEFT)', 'MLOps (Kubeflow/BentoML)', 'CUDA Basics', 'Evaluation Frameworks'],
      },
      'Cybersecurity Engineer': {
        critical: ['Network Protocols (TCP/IP, DNS, SSL/TLS)', 'Linux Systems Administration', 'OWASP Top 10 Vulnerabilities', 'Identity & Access Management (IAM)'],
        recommended: ['SIEM Tooling (Splunk/Wazuh)', 'Penetration Testing (Burp Suite)', 'Python Scripting for Security', 'Cryptography Fundamentals'],
        optional: ['Cloud Security (AWS Security Hub)', 'Incident Response Playbooks', 'Reverse Engineering', 'Zero Trust Architecture'],
      },
      'Cloud Engineer': {
        critical: ['AWS or GCP Core Services', 'Linux & Bash Scripting', 'Networking (VPC, Subnets, Route53)', 'Infrastructure as Code (Terraform)'],
        recommended: ['Docker & ECS/EKS', 'CloudFormation / Terraform Modules', 'IAM Security Policies', 'Cost Optimization'],
        optional: ['Serverless Frameworks', 'Ansible', 'Multi-Cloud Architecture', 'Site Reliability Engineering (SRE)'],
      },
      'DevOps Engineer': {
        critical: ['Docker', 'Kubernetes (K8s)', 'CI/CD Pipelines (GitHub Actions/GitLab)', 'Linux OS Internals & Bash'],
        recommended: ['Terraform', 'Prometheus & Grafana Monitoring', 'GitOps (ArgoCD)', 'Cloud Provider (AWS/GCP)'],
        optional: ['Helm Charts', 'Service Mesh (Istio)', 'Chaos Engineering', 'Security Scanning (Trivy/SonarQube)'],
      },
      'Software Developer': {
        critical: ['Data Structures & Algorithms', 'Object-Oriented Programming & Clean Code', 'Git Version Control', 'Relational Databases (SQL)'],
        recommended: ['Unit Testing & Test-Driven Development', 'Design Patterns', 'API Development', 'Basic Linux CLI'],
        optional: ['Docker', 'Cloud Hosting', 'Agile/Scrum Methodologies', 'Concurrent Programming'],
      },
    };

    const benchmark = roleBenchmarks[targetRole] || roleBenchmarks['Software Developer'];
    const currentLower: string[] = (currentSkills || []).map((s: string) => s.toLowerCase());

    const existingMatching = [...benchmark.critical, ...benchmark.recommended].filter(skill =>
      currentLower.some((c: string) => c.includes(skill.toLowerCase()) || skill.toLowerCase().includes(c))
    );

    const missingCritical = benchmark.critical.filter(
      skill => !currentLower.some((c: string) => c.includes(skill.toLowerCase()) || skill.toLowerCase().includes(c))
    );
    const missingRecommended = benchmark.recommended.filter(
      skill => !currentLower.some((c: string) => c.includes(skill.toLowerCase()) || skill.toLowerCase().includes(c))
    );

    const totalRequired = benchmark.critical.length + benchmark.recommended.length;
    const matchPercentage = Math.round(
      Math.min(95, Math.max(35, (existingMatching.length / totalRequired) * 100))
    );

    const missingSkillsObj = [
      ...missingCritical.map(name => ({
        name,
        priority: 'Critical' as const,
        description: `Core requirement for modern ${targetRole} positions.`,
        estimatedHours: 24,
      })),
      ...missingRecommended.map(name => ({
        name,
        priority: 'Recommended' as const,
        description: `Significantly enhances technical credibility during technical rounds.`,
        estimatedHours: 16,
      })),
    ];

    const fallbackResponse = {
      targetRole,
      matchPercentage,
      existingSkillsMatching: existingMatching.length > 0 ? existingMatching : ['Analytical Thinking', 'Git Basics'],
      missingSkills: missingSkillsObj,
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
          difficulty: 'Intermediate' as const,
          resumeImpact: `Proves hands-on competence in ${targetRole} workflows without hand-holding.`,
        },
      ],
      careerAdvice: `Focus your study blocks on building rather than passive video consumption. When interviewing for ${targetRole}, candidates who can articulate architectural trade-offs stand out over those who simply recite syntax.`,
    };

    return res.json({
      success: true,
      data: fallbackResponse,
      isAiGenerated: false,
      notice: apiKey ? undefined : 'Running on Career Plate curated skills graph. Attach GEMINI_API_KEY in Settings > Secrets for Gemini 3.8 Flash live analysis.',
    });
  } catch (error: any) {
    console.error('Error in skill-gap:', error);
    res.status(500).json({ error: error.message || 'Internal server error analyzing skills.' });
  }
});

// 4. AI Career Assistant Chatbot Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], userContext = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const systemPrompt = `You are "Career Plate AI", an elite AI-Powered Career Companion and Senior Tech Mentor.
User Context:
- Target Career: ${userContext.targetRole || 'Software Engineering'}
- Experience Level: ${userContext.experienceLevel || 'Student / Early Career'}
- Skills: ${Array.isArray(userContext.skills) ? userContext.skills.join(', ') : 'Not specified'}

Your mission:
1. Provide razor-sharp, actionable engineering guidance, code snippets, interview tactics, and career advice.
2. When asked coding questions, provide clean, idiomatic, typed code with clear comments.
3. When answering career/interview queries, share practical tips, STAR method frameworks, and real hiring insights.
4. Keep the tone encouraging, professional, and directly focused on tech industry best practices.
5. Format responses cleanly with markdown headers, bullet points, and code blocks where applicable.`;

    if (apiKey) {
      try {
        // Build conversational history representation
        let promptWithHistory = ``;
        if (Array.isArray(history) && history.length > 0) {
          promptWithHistory += `Recent Conversation History:\n`;
          for (const item of history.slice(-6)) {
            promptWithHistory += `${item.role === 'user' ? 'User' : 'Assistant'}: ${item.content}\n`;
          }
          promptWithHistory += `\nCurrent User Query: ${message}`;
        } else {
          promptWithHistory = message;
        }

        const reply = await generateGeminiContent(promptWithHistory, systemPrompt);
        return res.json({
          success: true,
          reply: reply || "I'm here to help navigate your career path. Could you elaborate on what you'd like to dive into?",
          isAiGenerated: true,
        });
      } catch (geminiError: any) {
        console.warn('Gemini chat error:', geminiError?.message);
      }
    }

    // High quality intelligent response generator for common career queries
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('interview') || lower.includes('behavioral') || lower.includes('star')) {
      reply = `### Mastering the Behavioral Interview: The STAR Framework

When answering behavioral questions (e.g., *"Tell me about a time you resolved a conflict"* or *"Describe a challenging bug"*), top tech interviewers grade on structured execution:

1. **Situation (15%)**: Briefly establish the context, company/project scale, and constraints.
2. **Task (15%)**: What was your specific personal ownership? Avoid saying *"we"* exclusively.
3. **Action (50%)**: The meat of your answer. Walk through your technical decision-making, trade-offs evaluated, and how you communicated.
4. **Result (20%)**: Quantify the business or technical outcome (*"Cut latency by 28%", "Shipped 2 weeks ahead of schedule"*), plus what you learned.

💡 **Pro Tip**: Keep answers between 90–120 seconds. Always pause and ask: *"I can dive deeper into the database schema or the team communication if you'd like!"*`;
    } else if (lower.includes('resume') || lower.includes('ats')) {
      reply = `### High-Impact Resume Optimization Rules for 2026

1. **The XYZ Bullet Formula**: Always format experience as:
   > *"Accomplished [X], as measured by [Y], by doing [Z]"*
2. **Eliminate Fluff Words**: Replace *"Responsible for maintaining"* with *"Engineered automated pipeline that maintained 99.9% uptime"*.
3. **ATS Optimization**:
   - Use clean, standard section headings (\`Experience\`, \`Projects\`, \`Education\`, \`Technical Skills\`).
   - Avoid complex multi-column tables that parse out of order in older applicant tracking systems.
   - List technologies directly inside project bullets to establish practical context.`;
    } else if (lower.includes('system design') || lower.includes('url shortener') || lower.includes('architecture')) {
      reply = `### System Design Core Methodology (4-Step Blueprint)

When asked to design a system (e.g., TinyURL, Rate Limiter, Notification Service):

1. **Scope Requirements (5 mins)**:
   - Functional: Shorten URL, redirect, custom alias, expiry.
   - Non-functional: 100M URLs/month, 100:1 read-to-write ratio, <10ms redirect latency, 99.99% availability.
2. **Back-of-the-envelope Math (3 mins)**:
   - Storage estimation: 100M writes * 500 bytes = 50GB/month (easily manageable on modern SSDs).
3. **High-Level Architecture (10 mins)**:
   - Client → DNS / CDN → Load Balancer → Application Servers (Stateless) → Redis Cache → Database (PostgreSQL/MongoDB).
4. **Deep Dive Key Bottlenecks (15 mins)**:
   - Hash Collision vs Base62 unique ID generation (Snowflake ID generator).
   - Cache invalidation and eviction policies (LRU cache for hot redirect links).`;
    } else {
      reply = `### Career Plate AI Advisory

Hello! I am your AI Career Companion. Here are 3 immediate ways we can boost your career readiness today:

- **Resume Evaluation**: Upload your resume to our AI Analyzer to pinpoint missing technical keywords and calculate your ATS score.
- **Skill Gap Mapping**: Pick your target role (Full Stack, AI/ML, Cloud, Cybersecurity) to see exactly which tools senior hiring managers expect in 2026.
- **Mock Interview Simulator**: Practice both technical and behavioral prompts with instant, constructive AI grading.

What specific challenge or topic would you like to explore next?`;
    }

    return res.json({
      success: true,
      reply,
      isAiGenerated: false,
      notice: apiKey ? undefined : 'Career Plate interactive guide. Attach GEMINI_API_KEY in Settings > Secrets for unrestricted live Gemini responses.',
    });
  } catch (error: any) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: error.message || 'Internal server error processing chat.' });
  }
});

// 5. AI Interview Answer Evaluation Endpoint
app.post('/api/ai/interview-evaluate', async (req: Request, res: Response) => {
  try {
    const { question, questionCategory, userAnswer, role = 'Software Developer', difficulty = 'Intermediate' } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ error: 'Question and User Answer are required.' });
    }

    const systemPrompt = `You are a Lead Technical Interviewer and Staff Engineer assessing a candidate for a "${role}" position at the "${difficulty}" level.
Evaluate the candidate's answer to the interview question:
Question (${questionCategory}): "${question}"
Candidate Answer: "${userAnswer}"

Return a strictly valid JSON object (no markdown, pure JSON) with this shape:
{
  "overallScore": number from 1 to 10,
  "verdict": "Strong Hire" | "Hire" | "Borderline" | "Needs Improvement",
  "technicalAccuracy": number from 1 to 10,
  "structureAndClarity": number from 1 to 10,
  "strengths": ["Key strength 1", "Key strength 2"],
  "areasForImprovement": ["Key omission or flaw 1", "Key improvement 2"],
  "modelAnswer": "An exemplary, concise 10/10 response that the candidate can study",
  "actionableTip": "One memorable takeaway for their next real interview"
}`;

    if (apiKey) {
      try {
        const textResponse = await generateGeminiContent(
          `Question: ${question}\nCandidate Answer: ${userAnswer}`,
          systemPrompt
        );
        const cleaned = textResponse
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, data: parsed, isAiGenerated: true });
      } catch (geminiError: any) {
        console.warn('Gemini interview evaluation error:', geminiError?.message);
      }
    }

    // Heuristic evaluation fallback
    const answerWords = userAnswer.trim().split(/\s+/).length;
    let score = 5;
    let verdict: 'Strong Hire' | 'Hire' | 'Borderline' | 'Needs Improvement' = 'Borderline';

    if (answerWords < 15) {
      score = 4;
      verdict = 'Needs Improvement';
    } else if (answerWords >= 40 && (userAnswer.includes('because') || userAnswer.includes('for example') || userAnswer.includes('trade-off'))) {
      score = 8;
      verdict = 'Hire';
    } else if (answerWords >= 20) {
      score = 6;
      verdict = 'Borderline';
    }

    const fallbackEvaluation = {
      overallScore: score,
      verdict,
      technicalAccuracy: Math.min(10, score + 1),
      structureAndClarity: Math.max(4, score - 1),
      strengths: [
        'Directly addressed the premise of the question',
        answerWords > 30 ? 'Provided adequate conceptual context' : 'Concise initial delivery',
      ],
      areasForImprovement: [
        'Incorporate explicit concrete examples from real or academic projects',
        'Discuss performance implications or trade-offs between alternative approaches',
      ],
      modelAnswer: `In a production environment, I approach this by first analyzing the core requirement and constraints. Specifically, I assess whether the primary bottleneck is memory, CPU latency, or maintainability. For instance, comparing the trade-offs allows the team to select the right pattern while preserving testability and resilience under scale.`,
      actionableTip: 'Always follow up your conceptual definition with a 1-sentence real-world trade-off or anecdote.',
    };

    return res.json({
      success: true,
      data: fallbackEvaluation,
      isAiGenerated: false,
      notice: apiKey ? undefined : 'Heuristic scoring engine. Add GEMINI_API_KEY for real-time Gemini evaluation.',
    });
  } catch (error: any) {
    console.error('Error in interview-evaluate:', error);
    res.status(500).json({ error: error.message || 'Internal server error evaluating interview answer.' });
  }
});

// 6. AI Personalized Roadmap Generator Endpoint
app.post('/api/ai/generate-roadmap', async (req: Request, res: Response) => {
  try {
    const { targetRole, currentSkills = [], experienceLevel = 'Student', dailyHours = 2 } = req.body;

    const systemPrompt = `You are a Principal Engineering Mentor designing an optimal, highly structured 8-week learning sprint for a candidate pursuing: "${targetRole}".
Experience Level: ${experienceLevel}
Daily Commitment: ${dailyHours} hours/day
Current Skills: ${currentSkills.join(', ')}

Return a strictly valid JSON object (no markdown, pure JSON):
{
  "title": "8-Week Mastery Sprint: ${targetRole}",
  "estimatedWeeklyHours": ${dailyHours * 7},
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Week theme",
      "milestones": ["Milestone 1", "Milestone 2", "Milestone 3"],
      "recommendedResources": ["Resource 1 (e.g. Official Docs/MDN)", "Resource 2"],
      "deliverable": "Concrete project component or test suite to finish this week"
    }
  ]
}`;

    if (apiKey) {
      try {
        const textResponse = await generateGeminiContent(
          `Target: ${targetRole}, Daily Hours: ${dailyHours}, Level: ${experienceLevel}, Skills: ${currentSkills.join(', ')}`,
          systemPrompt
        );
        const cleaned = textResponse
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, data: parsed, isAiGenerated: true });
      } catch (geminiError: any) {
        console.warn('Gemini roadmap generation error:', geminiError?.message);
      }
    }

    // High quality deterministic 8-week roadmap generator
    const weeks = [
      {
        weekNumber: 1,
        focus: 'Core Fundamentals & Deep Dives',
        milestones: [
          'Review advanced language syntax, memory model, and async runtime',
          'Configure professional tooling (ESLint, Prettier, TypeScript strict mode)',
          'Solve 10 targeted DSA problems focusing on arrays and hash maps',
        ],
        recommendedResources: ['Official Documentation', 'roadmap.sh curated guides'],
        deliverable: 'Clean GitHub repository initialized with strict typing and automated testing pipeline',
      },
      {
        weekNumber: 2,
        focus: 'Data Structures, Algorithms & State Modeling',
        milestones: [
          'Master Trees, Graphs, and Breadth/Depth-First Traversals',
          'Model normalized database schemas with foreign keys and indexes',
          'Implement efficient state handling without unnecessary rerenders',
        ],
        recommendedResources: ['LeetCode Top 75', 'NeetCode Roadmap'],
        deliverable: '5 validated algorithm implementations with unit test assertions',
      },
      {
        weekNumber: 3,
        focus: 'Modern API Architecture & Security',
        milestones: [
          'Design RESTful and GraphQL contracts with OpenAPI documentation',
          'Implement JWT & Session-based authentication with refresh tokens',
          'Add rate limiting, input validation (Zod), and CORS policies',
        ],
        recommendedResources: ['OWASP Secure Coding Practices', 'MDN HTTP Protocols'],
        deliverable: 'Secured authentication microservice with password hashing and validation tests',
      },
      {
        weekNumber: 4,
        focus: 'Relational & NoSQL Database Optimization',
        milestones: [
          'Master indexing strategies (B-Tree, Hash, Composite indexes)',
          'Write complex SQL aggregations, window functions, and migrations',
          'Set up Redis caching layer with cache-aside pattern',
        ],
        recommendedResources: ['Use The Index, Luke (SQL Guide)', 'PostgreSQL Official Docs'],
        deliverable: 'Benchmarked queries demonstrating a 5x speedup using proper index layout',
      },
      {
        weekNumber: 5,
        focus: 'Frontend Architecture & Design Systems',
        milestones: [
          'Build modular component libraries with strict accessibility (WCAG AA)',
          'Implement client-side caching, optimistic updates, and error boundaries',
          'Profile browser performance, Core Web Vitals, and bundle size',
        ],
        recommendedResources: ['Web.dev Performance Guides', 'Radix UI / Tailwind Architecture'],
        deliverable: 'Production-ready responsive dashboard interface with zero layout shifts',
      },
      {
        weekNumber: 6,
        focus: 'Containerization, CI/CD & Deployment',
        milestones: [
          'Write multi-stage Dockerfiles optimizing image size under 100MB',
          'Create automated GitHub Actions workflows (Lint, Test, Build)',
          'Deploy application to cloud runtime (Cloud Run / AWS / Vercel)',
        ],
        recommendedResources: ['Docker Official Docs', 'GitHub Actions Documentation'],
        deliverable: 'Working deployment with automatic continuous delivery on git push',
      },
      {
        weekNumber: 7,
        focus: 'Capstone Project Polish & Load Testing',
        milestones: [
          'Simulate concurrent traffic using load testing tools (k6 or artillery)',
          'Write end-to-end integration tests covering core user journey',
          'Author architectural decision records (ADRs) and comprehensive README',
        ],
        recommendedResources: ['k6 Documentation', 'Google Engineering Practices Guide'],
        deliverable: 'Live production URL with interactive demo credentials and README architecture diagram',
      },
      {
        weekNumber: 8,
        focus: 'Interview Drills & Technical Storytelling',
        milestones: [
          'Record 3 mock behavioral STAR responses for top engineering competencies',
          'Conduct 2 peer or AI system design walkthroughs',
          'Tailor resume bullets using quantified impact metrics',
        ],
        recommendedResources: ['Cracking the Coding Interview', 'Career Plate AI Interview Simulator'],
        deliverable: 'Polished portfolio, updated LinkedIn profile, and active application pipeline',
      },
    ];

    return res.json({
      success: true,
      data: {
        title: `8-Week Career Sprint: ${targetRole}`,
        estimatedWeeklyHours: dailyHours * 7,
        weeks,
      },
      isAiGenerated: false,
    });
  } catch (error: any) {
    console.error('Error in generate-roadmap:', error);
    res.status(500).json({ error: error.message || 'Internal server error generating roadmap.' });
  }
});

// Setup Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Career Plate AI Server] Running on http://localhost:${PORT}`);
    console.log(`[Gemini AI Status] ${apiKey ? 'Gemini 3.8 Flash Active' : 'Fallback Engine Ready (Add GEMINI_API_KEY in Secrets)'}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
