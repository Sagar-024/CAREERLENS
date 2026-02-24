export interface Skill {
    name: string;
    has: boolean;
    score: number;
}

export interface SkillMatrix {
    [role: string]: string[];
}

export const SKILL_MATRIX: SkillMatrix = {
    "Data Analyst": ["SQL", "Excel", "Tableau", "Power BI", "Data Visualization", "Statistics", "Data Cleaning", "Dashboards", "Reporting", "Analysis"],
    "Data Scientist": ["Python", "Machine Learning", "TensorFlow", "PyTorch", "NLP", "Model Training", "Deep Learning", "Statistics", "Pandas", "Data Mining"],
    "Software Engineer": ["JavaScript", "Java", "Python", "C++", "Algorithms", "Data Structures", "API", "Backend", "Frontend", "Debugging"],
    "Product Manager": ["Roadmap", "Stakeholder Management", "Agile", "Scrum", "OKR", "Product Strategy", "User Stories", "Market Research", "Analytics", "Prioritization"],
    "UX/UI Designer": ["Figma", "Wireframe", "Prototyping", "User Research", "Adobe XD", "Design System", "Usability Testing", "Typography", "Interaction Design", "Mockups"],
    "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "AWS", "Azure", "Terraform", "Jenkins", "Linux", "Monitoring", "Infrastructure"],
    "Marketing Manager": ["SEO", "Google Ads", "Campaigns", "Branding", "Social Media", "Analytics", "Content Marketing", "Email Marketing", "Lead Generation", "Strategy"],
    "Business Analyst": ["Requirements Gathering", "BRD", "Process Mapping", "Jira", "Workflow", "Stakeholder Communication", "Documentation", "Gap Analysis", "SQL", "Reporting"],
    "Full Stack Developer": ["React", "Node.js", "MongoDB", "Express", "REST API", "JavaScript", "Frontend", "Backend", "Git", "Deployment"],
    "Cybersecurity Analyst": ["Penetration Testing", "SIEM", "Firewall", "Compliance", "Risk Assessment", "Incident Response", "Encryption", "Vulnerability Scanning", "Network Security", "SOC"],
    "Machine Learning Engineer": ["Python", "Sklearn", "TensorFlow", "Model Deployment", "Feature Engineering", "MLOps", "Deep Learning", "Docker", "Cloud", "Data Pipelines"],
    "Cloud Engineer": ["AWS", "Azure", "GCP", "Cloud Architecture", "Networking", "Security", "Terraform", "Automation", "Linux", "Virtualization"],
    "Database Administrator": ["SQL", "Oracle", "MySQL", "PostgreSQL", "Indexing", "Backup", "Recovery", "Performance Tuning", "Replication", "Database Security"],
    "Network Engineer": ["Routing", "Switching", "Cisco", "TCP/IP", "Firewall", "VPN", "LAN", "WAN", "Troubleshooting", "Network Security"],
    "Mobile App Developer": ["Android", "iOS", "Kotlin", "Swift", "Flutter", "React Native", "API Integration", "Firebase", "UI Design", "Deployment"],
    "AI Engineer": ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Python", "TensorFlow", "PyTorch", "Neural Networks", "Model Optimization", "Data Preprocessing"],
    "Blockchain Developer": ["Solidity", "Ethereum", "Smart Contracts", "Web3", "Cryptography", "DApps", "Blockchain Architecture", "Node.js", "Consensus", "DeFi"],
    "Game Developer": ["Unity", "Unreal Engine", "C#", "3D Modeling", "Animation", "Physics Engine", "Gameplay Mechanics", "Debugging", "Graphics", "AI"],
    "System Administrator": ["Linux", "Windows Server", "Active Directory", "Virtualization", "Backup", "Networking", "Troubleshooting", "Security", "Scripting", "Monitoring"],
    "QA Engineer": ["Manual Testing", "Automation Testing", "Selenium", "Test Cases", "Regression Testing", "Jira", "Bug Tracking", "API Testing", "Performance Testing", "Agile"],
    "HR Manager": ["Recruitment", "Onboarding", "Payroll", "Employee Engagement", "Compliance", "Training", "HR Policies", "Performance Management", "Talent Acquisition", "Benefits"],
    "Financial Analyst": ["Financial Modeling", "Budgeting", "Forecasting", "Excel", "Accounting", "Variance Analysis", "Reporting", "Risk Analysis", "Financial Statements", "Valuation"],
    "Operations Manager": ["Supply Chain", "Logistics", "Inventory", "Process Improvement", "KPI", "Vendor Management", "Planning", "Quality Control", "Operations Strategy", "Reporting"],
    "Sales Manager": ["CRM", "Lead Generation", "Negotiation", "Sales Strategy", "Revenue Growth", "Client Relationship", "Forecasting", "Pipeline Management", "Presentations", "Targets"],
    "Project Manager": ["Agile", "Scrum", "Budgeting", "Scheduling", "Risk Management", "Stakeholder Management", "Project Planning", "Jira", "Communication", "Reporting"],
    "Ethical Hacker": ["Penetration Testing", "Kali Linux", "Vulnerability Assessment", "Exploit Development", "Networking", "Cryptography", "Security Auditing", "Web Security", "OWASP", "Scripting"],
    "SOC Analyst": ["SIEM", "Incident Response", "Log Analysis", "Threat Detection", "Firewall", "IDS/IPS", "Malware Analysis", "Network Monitoring", "Risk Management", "Cybersecurity"],
    "IT Support Engineer": ["Troubleshooting", "Hardware", "Software", "Networking", "Windows", "Linux", "Ticketing System", "Remote Support", "System Maintenance", "Helpdesk"],
    "Cloud Security Engineer": ["Cloud Security", "AWS Security", "IAM", "Encryption", "Compliance", "Monitoring", "Risk Assessment", "Firewall", "Vulnerability Scanning", "DevSecOps"],
    "BI Developer": ["Power BI", "Tableau", "SQL", "Dashboards", "Data Modeling", "ETL", "Reporting", "DWH", "Visualization", "Analytics"],
    "Data Engineer": ["Python", "SQL", "Spark", "Hadoop", "ETL", "Data Pipelines", "Airflow", "Kafka", "Cloud", "Data Warehousing"],
    "Statistician": ["Probability", "Regression", "Hypothesis Testing", "R", "SPSS", "Data Analysis", "Statistical Modeling", "Forecasting", "Sampling", "Data Interpretation"],
    "Quantitative Analyst": ["Financial Modeling", "Python", "R", "Risk Modeling", "Derivatives", "Statistics", "Algorithms", "Econometrics", "Forecasting", "Trading Models"],
    "Graphic Designer": ["Photoshop", "Illustrator", "Branding", "Typography", "Logo Design", "Creativity", "Layout", "Adobe Suite", "Visual Design", "Marketing Materials"],
    "Video Editor": ["Premiere Pro", "After Effects", "Storytelling", "Color Grading", "Audio Editing", "Motion Graphics", "Video Production", "Editing", "Cinematography", "Transitions"],
    "Content Writer": ["SEO", "Blogging", "Copywriting", "Research", "Editing", "Storytelling", "Grammar", "Content Strategy", "Marketing", "Social Media"],
    "Social Media Manager": ["Content Creation", "Instagram", "Facebook Ads", "Analytics", "Branding", "Campaigns", "Engagement", "Strategy", "Scheduling", "SEO"],
    "Civil Engineer": ["AutoCAD", "Structural Analysis", "Construction", "Project Planning", "Site Management", "Estimation", "Materials", "Safety Standards", "Surveying", "Design"],
    "Mechanical Engineer": ["CAD", "SolidWorks", "Thermodynamics", "Manufacturing", "Maintenance", "Mechanical Design", "Robotics", "Testing", "Quality Control", "Production"],
    "Electrical Engineer": ["Circuit Design", "PLC", "Power Systems", "AutoCAD Electrical", "Troubleshooting", "Maintenance", "Control Systems", "Instrumentation", "Safety"],
    "Doctor": ["Diagnosis", "Patient Care", "Treatment Planning", "Medical Knowledge", "Surgery", "Communication", "Healthcare Management", "Clinical Research", "Documentation", "Ethics"],
    "Pharmacist": ["Prescriptions", "Drug Dispensing", "Patient Counseling", "Inventory Management", "Pharmacology", "Compliance", "Healthcare", "Dosage Calculation", "Customer Service", "Documentation"],
};

export const getSkillsForRole = (role: string): Skill[] => {
    const skills = SKILL_MATRIX[role] || SKILL_MATRIX["Software Engineer"]; // Fallback
    return skills.map((skill, index) => ({
        name: skill,
        has: index < 6, // Simulation: User has first 6 skills, missing last 4
        score: index < 6 ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 20,
    }));
};
