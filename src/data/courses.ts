export type Level = 'Beginner' | 'Intermediate' | 'Advanced'
export type Category =
  | 'AI & Machine Learning'
  | 'Data Analysis'
  | 'Web Development'
  | 'UI/UX'
  | 'Generative AI'
  | 'Data Science'
  | 'AI Automation'

export interface Lesson {
  id: string
  title: string
  duration: string
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  slug: string
  title: string
  instructor: string
  instructorRole: string
  instructorBio: string
  duration: string
  price: number | 'Free'
  rating: number
  reviews: number
  level: Level
  category: Category
  overview: string
  skills: string[]
  students: number
  featured: boolean
  mode: 'Online' | 'Hybrid' | 'Physical'
  curriculum: Module[]
}

export const categories: Category[] = [
  'AI & Machine Learning',
  'Data Analysis',
  'Web Development',
  'UI/UX',
  'Generative AI',
  'Data Science',
  'AI Automation',
]

export const homeCategories = [
  { name: 'AI', label: 'Artificial Intelligence', href: '/courses?category=AI+%26+Machine+Learning' },
  { name: 'Data', label: 'Data & Analytics', href: '/courses?category=Data+Analysis' },
  { name: 'Programming', label: 'Web Development', href: '/courses?category=Web+Development' },
  { name: 'Design', label: 'UI/UX Design', href: '/courses?category=UI%2FUX' },
]

export const courses: Course[] = [
  {
    id: '1',
    slug: 'ai-fundamentals',
    title: 'AI Fundamentals for Innovators',
    instructor: 'Dr. Ada Okonkwo',
    instructorRole: 'AI Research Lead',
    instructorBio: 'Former ML engineer with 10+ years building production AI systems across Africa and Europe.',
    duration: '6 Weeks',
    price: 'Free',
    rating: 4.9,
    reviews: 312,
    level: 'Beginner',
    category: 'AI & Machine Learning',
    overview:
      'Build a practical foundation in artificial intelligence — from core concepts to real-world applications. Ideal for beginners ready to enter the AI economy.',
    skills: ['Machine Learning Basics', 'Python for AI', 'Model Evaluation', 'Problem Framing'],
    students: 1840,
    featured: true,
    mode: 'Online',
    curriculum: [
      {
        id: 'm1',
        title: 'Introduction to AI',
        lessons: [
          { id: 'l1', title: 'What is Artificial Intelligence?', duration: '12 min' },
          { id: 'l2', title: 'History & Modern Applications', duration: '18 min' },
          { id: 'l3', title: 'Ethics and Responsible AI', duration: '15 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Machine Learning Essentials',
        lessons: [
          { id: 'l4', title: 'Supervised vs Unsupervised Learning', duration: '22 min' },
          { id: 'l5', title: 'Your First Model in Python', duration: '35 min' },
          { id: 'l6', title: 'Evaluating Model Performance', duration: '20 min' },
        ],
      },
      {
        id: 'm3',
        title: 'Capstone Project',
        lessons: [
          { id: 'l7', title: 'Project Brief & Dataset', duration: '10 min' },
          { id: 'l8', title: 'Build & Present Your Solution', duration: '45 min' },
        ],
      },
    ],
  },
  {
    id: '2',
    slug: 'data-analysis-with-python',
    title: 'Data Analysis with Python',
    instructor: 'Chinedu Bello',
    instructorRole: 'Senior Data Analyst',
    instructorBio: 'Data lead who has trained 2,000+ analysts for startups, NGOs, and government programs.',
    duration: '8 Weeks',
    price: 45000,
    rating: 4.8,
    reviews: 256,
    level: 'Beginner',
    category: 'Data Analysis',
    overview:
      'Master data cleaning, visualization, and insight storytelling with Python, Pandas, and modern analytics workflows used in industry.',
    skills: ['Data Cleaning', 'Data Visualization', 'Python Programming', 'Problem Solving'],
    students: 2210,
    featured: true,
    mode: 'Hybrid',
    curriculum: [
      {
        id: 'm1',
        title: 'Python for Analysts',
        lessons: [
          { id: 'l1', title: 'Setup & Notebooks', duration: '15 min' },
          { id: 'l2', title: 'Pandas Essentials', duration: '28 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Visualization & Storytelling',
        lessons: [
          { id: 'l3', title: 'Charts that Communicate', duration: '24 min' },
          { id: 'l4', title: 'Dashboard Thinking', duration: '30 min' },
        ],
      },
    ],
  },
  {
    id: '3',
    slug: 'full-stack-web-development',
    title: 'Full-Stack Web Development',
    instructor: 'Tomiwa Adeyemi',
    instructorRole: 'Lead Software Engineer',
    instructorBio: 'Builds scalable products for edtech and fintech. Passionate about teaching clean architecture.',
    duration: '12 Weeks',
    price: 85000,
    rating: 4.7,
    reviews: 189,
    level: 'Intermediate',
    category: 'Web Development',
    overview:
      'Learn to design, build, and deploy modern web applications — from responsive frontends to secure APIs and databases.',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'APIs', 'Deployment'],
    students: 1560,
    featured: true,
    mode: 'Online',
    curriculum: [
      {
        id: 'm1',
        title: 'Frontend Foundations',
        lessons: [
          { id: 'l1', title: 'Semantic HTML & Modern CSS', duration: '25 min' },
          { id: 'l2', title: 'JavaScript Deep Dive', duration: '40 min' },
        ],
      },
      {
        id: 'm2',
        title: 'React & Backend',
        lessons: [
          { id: 'l3', title: 'Component Architecture', duration: '35 min' },
          { id: 'l4', title: 'APIs & Authentication', duration: '42 min' },
        ],
      },
    ],
  },
  {
    id: '4',
    slug: 'ui-ux-product-design',
    title: 'UI/UX Product Design',
    instructor: 'Zainab Musa',
    instructorRole: 'Product Design Director',
    instructorBio: 'Design systems specialist focused on inclusive, high-conversion digital experiences.',
    duration: '6 Weeks',
    price: 55000,
    rating: 4.9,
    reviews: 142,
    level: 'Beginner',
    category: 'UI/UX',
    overview:
      'From research to high-fidelity prototypes — learn how to craft interfaces people love and businesses trust.',
    skills: ['User Research', 'Wireframing', 'Figma', 'Design Systems'],
    students: 980,
    featured: true,
    mode: 'Online',
    curriculum: [
      {
        id: 'm1',
        title: 'Design Thinking',
        lessons: [
          { id: 'l1', title: 'Empathy & Research', duration: '20 min' },
          { id: 'l2', title: 'Flows & Wireframes', duration: '26 min' },
        ],
      },
    ],
  },
  {
    id: '5',
    slug: 'generative-ai-mastery',
    title: 'Generative AI Mastery',
    instructor: 'Dr. Ada Okonkwo',
    instructorRole: 'AI Research Lead',
    instructorBio: 'Former ML engineer with 10+ years building production AI systems across Africa and Europe.',
    duration: '5 Weeks',
    price: 65000,
    rating: 4.8,
    reviews: 201,
    level: 'Intermediate',
    category: 'Generative AI',
    overview:
      'Prompt engineering, LLM workflows, and building useful generative AI tools for business and education.',
    skills: ['Prompt Engineering', 'LLM Apps', 'RAG Basics', 'AI Product Thinking'],
    students: 1340,
    featured: false,
    mode: 'Online',
    curriculum: [
      {
        id: 'm1',
        title: 'Working with LLMs',
        lessons: [
          { id: 'l1', title: 'Prompt Patterns that Work', duration: '22 min' },
          { id: 'l2', title: 'Building a Simple AI Assistant', duration: '38 min' },
        ],
      },
    ],
  },
  {
    id: '6',
    slug: 'data-science-bootcamp',
    title: 'Applied Data Science Bootcamp',
    instructor: 'Chinedu Bello',
    instructorRole: 'Senior Data Analyst',
    instructorBio: 'Data lead who has trained 2,000+ analysts for startups, NGOs, and government programs.',
    duration: '10 Weeks',
    price: 95000,
    rating: 4.7,
    reviews: 118,
    level: 'Advanced',
    category: 'Data Science',
    overview:
      'Go beyond analysis — build predictive models, evaluate rigorously, and ship data products that drive decisions.',
    skills: ['Statistics', 'Feature Engineering', 'ML Pipelines', 'Model Deployment'],
    students: 760,
    featured: false,
    mode: 'Hybrid',
    curriculum: [
      {
        id: 'm1',
        title: 'Modeling in Practice',
        lessons: [
          { id: 'l1', title: 'Feature Stores & Pipelines', duration: '30 min' },
          { id: 'l2', title: 'Deploying Predictions', duration: '35 min' },
        ],
      },
    ],
  },
  {
    id: '7',
    slug: 'ai-automation-for-business',
    title: 'AI Automation for Business',
    instructor: 'Funke Adebayo',
    instructorRole: 'Automation Strategist',
    instructorBio: 'Helps organizations cut operational waste with intelligent workflows and no-code AI tools.',
    duration: '4 Weeks',
    price: 40000,
    rating: 4.6,
    reviews: 97,
    level: 'Beginner',
    category: 'AI Automation',
    overview:
      'Automate repetitive work with AI agents, integrations, and practical workflows tailored for African businesses and NGOs.',
    skills: ['Workflow Automation', 'No-code AI', 'Integrations', 'ROI Measurement'],
    students: 640,
    featured: false,
    mode: 'Online',
    curriculum: [
      {
        id: 'm1',
        title: 'Automation Foundations',
        lessons: [
          { id: 'l1', title: 'Mapping Processes Worth Automating', duration: '18 min' },
          { id: 'l2', title: 'Building Your First Agent', duration: '32 min' },
        ],
      },
    ],
  },
]

export const testimonials = [
  {
    name: 'Amaka Eze',
    role: 'Data Analyst, Lagos',
    quote:
      'Prime Digital Academy gave me the skills and confidence to land my first analytics role within three months.',
  },
  {
    name: 'Ibrahim Yusuf',
    role: 'NGO Program Manager',
    quote:
      'The AI automation course helped our team cut reporting time in half. Practical, relevant, and well taught.',
  },
  {
    name: 'Sarah Mensah',
    role: 'Product Designer',
    quote:
      'Clear curriculum, strong mentorship, and a certificate that actually reflects real competence.',
  },
]

export const blogPosts = [
  {
    slug: 'future-of-ai-education-africa',
    title: 'The Future of AI Education in Africa',
    excerpt: 'Why practical, accessible AI training is the next infrastructure for opportunity.',
    date: 'June 12, 2026',
    category: 'Insights',
  },
  {
    slug: 'building-job-ready-data-talent',
    title: 'Building Job-Ready Data Talent',
    excerpt: 'How Prime Digital Academy designs programs that employers actually trust.',
    date: 'May 28, 2026',
    category: 'Academy',
  },
  {
    slug: 'partners-ngos-investors',
    title: 'Partnering for Scale: NGOs & Investors',
    excerpt: 'A look at how collaboration expands access to digital skills across communities.',
    date: 'May 4, 2026',
    category: 'Network',
  },
]

export const faqs = [
  {
    q: 'What is Prime Innovation Network?',
    a: 'Prime Innovation Network is our official corporate identity and brand authority — showcasing vision, programs, and partnerships. Prime Digital Academy is our learning portal powered by the Network.',
  },
  {
    q: 'Are courses free or paid?',
    a: 'We offer both. Some foundational courses are free; advanced and specialized programs are paid. Prices are shown on each course page.',
  },
  {
    q: 'Do I get a certificate?',
    a: 'Yes. After completing a program and meeting requirements, you receive a downloadable Certificate of Completion from Prime Digital Academy with a unique verification ID.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We support Paystack and Flutterwave for secure local and international payments.',
  },
  {
    q: 'Can I learn at my own pace?',
    a: 'Most online courses are self-paced within the program window, with progress tracking, notes, quizzes, and downloadable materials in your learning dashboard.',
  },
  {
    q: 'How do I become an instructor?',
    a: 'Apply through the Instructor Panel. Approved instructors can upload courses, manage content, and track students.',
  },
]

export function formatPrice(price: number | 'Free') {
  if (price === 'Free') return 'Free'
  return `₦${price.toLocaleString()}`
}

export function getCourseBySlug(slug: string) {
  return courses.find((c) => c.slug === slug)
}
