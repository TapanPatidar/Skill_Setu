/**
 * Client-side mirrored Domain Taxonomy & Competencies
 * Single Source of Truth for filters, profile onboarding, skill assessment, and search.
 */

export const SOFT_SKILLS = [
  'Communication & Presentation',
  'Critical Thinking',
  'Problem-Solving',
  'Teamwork & Collaboration',
  'Adaptability & Agility',
  'Time Management',
  'Leadership & Ownership',
  'Active Listening',
];

export const INDUSTRY_SECTORS = [
  'IT Services & Software',
  'Product Startups & SaaS',
  'Manufacturing & Heavy Engineering',
  'Automobile & Electric Vehicles (EV)',
  'Construction, Infrastructure & Real Estate',
  'Energy, Renewables & Power',
  'Banking, Financial Services & Fintech',
  'Consulting & Advisory',
  'FMCG & Consumer Goods',
  'Pharmaceuticals & Bio-Tech',
  'Healthcare, Hospitals & Wellness',
  'EdTech & Education',
  'Agri-Tech & Modern Agriculture',
  'Media, Digital & Advertising',
  'E-Commerce, Supply Chain & Logistics',
  'Government, Defense & PSUs',
  'NGOs & Public Policy',
];

export const DOMAIN_TAXONOMY = {
  'Engineering & Technology': {
    code: 'ENG',
    description: 'Software, hardware, infrastructure, core engineering, and intelligent systems.',
    subFields: {
      'Computer Science & IT': {
        skills: ['DSA', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'Cloud/AWS', 'Docker', 'System Design', 'Git'],
        roles: ['Full-Stack Developer', 'Frontend Engineer', 'Backend Developer', 'DevOps Associate', 'Software Engineer Trainee'],
        industrySectors: ['IT Services & Software', 'Product Startups & SaaS', 'Banking, Financial Services & Fintech', 'E-Commerce, Supply Chain & Logistics'],
        programs: ['Cloud-Native Architecture Micro-Credential', 'Full-Stack Modern Web Engineering', 'Scalable Microservices with Node.js'],
      },
      'Data Science & AI': {
        skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch/TensorFlow', 'Data Wrangling', 'SQL', 'NLP', 'Computer Vision', 'Power BI'],
        roles: ['Data Scientist Intern', 'AI/ML Research Engineer', 'Business Intelligence Analyst', 'Data Engineer'],
        industrySectors: ['Product Startups & SaaS', 'Banking, Financial Services & Fintech', 'Healthcare, Hospitals & Wellness', 'Consulting & Advisory'],
        programs: ['Applied AI & LLM Systems Design', 'Enterprise Data Science & Analytics BootCamp'],
      },
      'Electronics & Communication': {
        skills: ['Embedded C', 'VLSI Design', 'MATLAB', 'IoT Protocols', 'Microcontrollers (ARM/ESP32)', 'PCB Design', 'Signal Processing'],
        roles: ['Embedded Systems Intern', 'VLSI Verification Trainee', 'IoT Solutions Architect', 'Hardware Design Engineer'],
        industrySectors: ['Automobile & Electric Vehicles (EV)', 'Manufacturing & Heavy Engineering', 'IT Services & Software'],
        programs: ['Embedded Linux & Automotive Microcontrollers', 'FPGA & ASIC Prototyping Essentials'],
      },
      'Mechanical & Automation': {
        skills: ['CAD/SolidWorks', 'AutoCAD', 'ANSYS', 'PLC/SCADA', 'CNC Machining', 'Thermodynamics', 'Robotics Simulation'],
        roles: ['Design Engineer Intern', 'Quality Assurance Engineer', 'Production & Plant Trainee', 'Robotics Automation Associate'],
        industrySectors: ['Automobile & Electric Vehicles (EV)', 'Manufacturing & Heavy Engineering', 'Energy, Renewables & Power'],
        programs: ['SolidWorks Industrial Parametric Modeling', 'Industry 4.0 & Smart Plant Automation'],
      },
      'Civil & Infrastructure': {
        skills: ['AutoCAD Civil 3D', 'STAAD Pro', 'Revit BIM', 'Structural Analysis', 'Project Estimation', 'Surveying & GIS'],
        roles: ['Site Engineer Intern', 'Structural Design Trainee', 'BIM Modeler', 'Urban Infrastructure Planner'],
        industrySectors: ['Construction, Infrastructure & Real Estate', 'Government, Defense & PSUs', 'Consulting & Advisory'],
        programs: ['Building Information Modeling (BIM) Professional Certification', 'Green Infrastructure & Structural Analysis'],
      },
      'Biotechnology & Bio-Engineering': {
        skills: ['Bioinformatics', 'Fermentation Technology', 'Molecular Biology Protocols', 'Downstream Processing', 'HPLC', 'Cell Culture'],
        roles: ['Bio-Process Trainee', 'Bioinformatics Analyst', 'R&D Associate', 'Quality Control Analyst'],
        industrySectors: ['Pharmaceuticals & Bio-Tech', 'Healthcare, Hospitals & Wellness', 'Agri-Tech & Modern Agriculture'],
        programs: ['Industrial Fermentation & Downstream Operations', 'Computational Drug Discovery Fundamentals'],
      },
    },
  },

  'Management & Business': {
    code: 'MGT',
    description: 'Corporate strategy, operations, marketing, human capital, and entrepreneurship.',
    subFields: {
      'Marketing & Growth': {
        skills: ['Digital Marketing & SEO', 'Google Analytics', 'Brand Strategy', 'Market Research', 'Content Marketing', 'CRM Management (HubSpot)'],
        roles: ['Growth Marketing Intern', 'Digital Marketing Executive', 'Brand Management Trainee', 'Performance Marketing Specialist'],
        industrySectors: ['FMCG & Consumer Goods', 'Product Startups & SaaS', 'Media, Digital & Advertising', 'E-Commerce, Supply Chain & Logistics'],
        programs: ['Growth & Performance Marketing Playbook', 'Strategic Brand Positioning in Consumer Markets'],
      },
      'Finance & Corporate Strategy': {
        skills: ['Financial Modeling', 'Valuation (DCF)', 'Advanced Excel', 'Power BI', 'Budgeting & Forecasting', 'Capital Markets Analysis'],
        roles: ['Investment Banking Analyst Intern', 'Financial Analyst Trainee', 'Corporate Treasury Associate', 'Equity Research Assistant'],
        industrySectors: ['Banking, Financial Services & Fintech', 'Consulting & Advisory', 'FMCG & Consumer Goods'],
        programs: ['Wall Street Financial Modeling & Valuation', 'Corporate Mergers & Acquisitions Workshop'],
      },
      'Operations & Supply Chain': {
        skills: ['Supply Chain Optimization', 'Six Sigma / Lean', 'Inventory Analytics', 'Procurement & Vendor Management', 'ERP (SAP/Oracle)', 'Logistics Planning'],
        roles: ['Supply Chain Trainee', 'Operations Excellence Intern', 'Procurement Specialist', 'Warehouse Operations Lead'],
        industrySectors: ['E-Commerce, Supply Chain & Logistics', 'FMCG & Consumer Goods', 'Manufacturing & Heavy Engineering'],
        programs: ['Global Supply Chain & Freight Logistics Masterclass', 'Lean Six Sigma Green Belt Execution'],
      },
      'Human Resources & Talent Management': {
        skills: ['Talent Acquisition', 'HR Analytics', 'Employee Engagement', 'Labor Compliance', 'Payroll Systems', 'Performance Management'],
        roles: ['HR Business Partner Intern', 'Technical Recruiter Associate', 'HR Operations Trainee', 'People Analytics Specialist'],
        industrySectors: ['IT Services & Software', 'Consulting & Advisory', 'Banking, Financial Services & Fintech'],
        programs: ['Strategic Talent Acquisition & People Analytics', 'Contemporary HR Business Partnering'],
      },
      'Product Management': {
        skills: ['Product Lifecycle Management', 'User Stories & Wireframing', 'Agile/Scrum', 'Data-Driven Prioritization', 'A/B Testing', 'Jira'],
        roles: ['Associate Product Manager (APM)', 'Product Analyst Intern', 'Scrum Product Owner'],
        industrySectors: ['Product Startups & SaaS', 'E-Commerce, Supply Chain & Logistics', 'EdTech & Education'],
        programs: ['0 to 1 Product Discovery & Execution', 'Metrics-Driven Product Growth Strategy'],
      },
    },
  },

  'Healthcare & Ayush': {
    code: 'HLT',
    description: 'Ayurveda, integrative clinical sciences, pharma formulations, nursing, and medical informatics.',
    subFields: {
      'Ayurveda & Traditional Medicine': {
        skills: ['Classical Diagnostic Principles (Ashtavidha)', 'Panchakarma Protocol Design', 'Dravyaguna & Herbal Identification', 'Rasa Shastra Formulation', 'Patient Case Documentation'],
        roles: ['Ayurveda Clinical Resident', 'Panchakarma Consultant Trainee', 'Herbal Formulation Research Assistant', 'Wellness Director Intern'],
        industrySectors: ['Healthcare, Hospitals & Wellness', 'Pharmaceuticals & Bio-Tech', 'FMCG & Consumer Goods'],
        programs: ['Evidence-Based Panchakarma Protocols', 'Herbal Drug Standardization & Quality Assurance'],
      },
      'Pharmaceutical Sciences & Regulatory': {
        skills: ['HPLC/GC-MS Analysis', 'Good Manufacturing Practices (GMP)', 'Pharmacovigilance', 'Drug Dossier Regulatory Filing (USFDA/Ayush)', 'Stability Testing'],
        roles: ['Formulation Scientist Intern', 'Regulatory Affairs Trainee', 'Quality Assurance Officer', 'Analytical Chemistry Associate'],
        industrySectors: ['Pharmaceuticals & Bio-Tech', 'Healthcare, Hospitals & Wellness', 'FMCG & Consumer Goods'],
        programs: ['Pharma Regulatory Affairs & International Dossiers', 'Modern Analytical Chromatography in Drug Testing'],
      },
      'Clinical Research & Trials': {
        skills: ['Good Clinical Practice (GCP)', 'Clinical Data Management (EDC/CRF)', 'Bio-statistics & SPSS', 'Informed Consent & Ethics Audit', 'Pharmacovigilance Reporting'],
        roles: ['Clinical Research Coordinator (CRC)', 'Clinical Data Analyst', 'Ethics Committee Associate', 'Trial Monitor Trainee'],
        industrySectors: ['Pharmaceuticals & Bio-Tech', 'Healthcare, Hospitals & Wellness', 'Consulting & Advisory'],
        programs: ['ICH-GCP Certified Clinical Trial Investigator', 'Clinical Data Management with SAS/R'],
      },
      'Health Informatics & Digital Health': {
        skills: ['Ayushman Bharat Digital Mission (ABDM) Standards', 'HL7/FHIR Protocols', 'EHR System Configuration', 'Medical Data Security', 'Tele-Health Architecture'],
        roles: ['Health Informatics Specialist', 'Hospital Information System Analyst', 'Digital Health Consultant'],
        industrySectors: ['Healthcare, Hospitals & Wellness', 'IT Services & Software', 'Product Startups & SaaS'],
        programs: ['Interoperable Digital Health & FHIR Standards', 'Ayush Health Informatics & Big Data'],
      },
    },
  },

  'Commerce & Finance': {
    code: 'COM',
    description: 'Accounting, banking operations, international taxation, auditing, and financial technology.',
    subFields: {
      'Accounting & Audit': {
        skills: ['TallyPrime', 'Statutory Audit', 'Ind AS / IFRS', 'GST Filing & Compliance', 'Cost Accounting', 'Internal Controls'],
        roles: ['Audit Associate Intern', 'Tax Consultant Trainee', 'Staff Accountant', 'Financial Reporting Associate'],
        industrySectors: ['Consulting & Advisory', 'Banking, Financial Services & Fintech', 'Manufacturing & Heavy Engineering'],
        programs: ['Corporate Statutory Auditing & Taxation', 'IFRS Practical Implementation Certificate'],
      },
      'Banking & Fintech': {
        skills: ['Core Banking Solutions', 'Credit Risk Modeling', 'Fintech APIs & Payments', 'KYC & AML Compliance', 'Trade Finance'],
        roles: ['Credit Risk Analyst Intern', 'Fintech Product Associate', 'Retail Banking Officer Trainee', 'Wealth Management Associate'],
        industrySectors: ['Banking, Financial Services & Fintech', 'Consulting & Advisory', 'Product Startups & SaaS'],
        programs: ['Digital Banking Architecture & Neo-Banks', 'Credit Risk Underwriting & Financial Analytics'],
      },
    },
  },

  'Science & Research': {
    code: 'SCI',
    description: 'Fundamental and applied scientific investigations across physical, chemical, environmental, and statistical disciplines.',
    subFields: {
      'Applied Chemistry & Material Science': {
        skills: ['Spectroscopy (NMR/IR/UV)', 'Polymer Synthesis', 'Material Characterization', 'Green Chemistry', 'Hazardous Materials Handling'],
        roles: ['R&D Chemist Intern', 'Material Science Trainee', 'Polymer Testing Analyst'],
        industrySectors: ['Pharmaceuticals & Bio-Tech', 'Energy, Renewables & Power', 'Manufacturing & Heavy Engineering'],
        programs: ['Green Chemistry & Sustainable Industrial Catalysis', 'Advanced Spectroscopic Elucidation'],
      },
      'Environmental Science & Sustainability': {
        skills: ['Environmental Impact Assessment (EIA)', 'Carbon Accounting & ESG', 'Air & Water Quality Monitoring', 'GIS & Remote Sensing', 'Waste Management'],
        roles: ['ESG Analyst Intern', 'Sustainability Consultant Trainee', 'Environmental Monitoring Officer'],
        industrySectors: ['Energy, Renewables & Power', 'Consulting & Advisory', 'Government, Defense & PSUs'],
        programs: ['Corporate ESG Reporting & Decarbonization Roadmap', 'Geospatial Analysis for Environmental Planning'],
      },
    },
  },

  'Design & Creative Arts': {
    code: 'DSG',
    description: 'User experience, visual communication, industrial styling, architecture, and multimedia aesthetics.',
    subFields: {
      'UI/UX & Product Design': {
        skills: ['Figma', 'Design Systems', 'User Research & Persona Design', 'Wireframing & Prototyping', 'Usability Testing', 'Interaction Design'],
        roles: ['UI/UX Design Intern', 'Product Designer Trainee', 'UX Researcher Associate', 'Visual Designer'],
        industrySectors: ['Product Startups & SaaS', 'IT Services & Software', 'Media, Digital & Advertising'],
        programs: ['Enterprise Design Systems with Figma', 'Cognitive Psychology & Interaction Design'],
      },
      'Graphic & Brand Communication': {
        skills: ['Adobe Illustrator', 'Photoshop', 'Brand Identity Design', 'Typography', 'Motion Graphics (After Effects)', 'Print Production'],
        roles: ['Graphic Designer Intern', 'Brand Identity Designer', 'Motion Graphics Trainee'],
        industrySectors: ['Media, Digital & Advertising', 'FMCG & Consumer Goods', 'E-Commerce, Supply Chain & Logistics'],
        programs: ['Brand Narrative & Visual Identity Systems', 'Commercial Motion Design & Kinetic Typography'],
      },
    },
  },

  'Law, Policy & Governance': {
    code: 'LAW',
    description: 'Corporate law, intellectual property, regulatory compliance, public policy, and institutional governance.',
    subFields: {
      'Corporate & Intellectual Property Law': {
        skills: ['Contract Drafting & Review', 'Patent Search & Drafting', 'IPR Trademark Filings', 'Due Diligence', 'Corporate Governance'],
        roles: ['Legal Intern', 'IPR Research Associate', 'Compliance Officer Trainee', 'Contract Analyst'],
        industrySectors: ['Consulting & Advisory', 'Pharmaceuticals & Bio-Tech', 'Banking, Financial Services & Fintech'],
        programs: ['Intellectual Property Rights in Science & Tech', 'Commercial Contract Drafting & Negotiations'],
      },
      'Public Policy & Social Governance': {
        skills: ['Policy Analysis', 'Socio-Economic Survey Design', 'Government Scheme Implementation', 'Stakeholder Management', 'Legislative Research'],
        roles: ['Policy Research Intern', 'Governance Fellow', 'Monitoring & Evaluation Associate'],
        industrySectors: ['Government, Defense & PSUs', 'NGOs & Public Policy', 'Consulting & Advisory'],
        programs: ['Evidence-Based Public Policy Formulation', 'Monitoring & Evaluation in Development Programs'],
      },
    },
  },

  'Agriculture & Agri-Tech': {
    code: 'AGR',
    description: 'Precision farming, smart irrigation, agronomy, supply chain integration, and medicinal crop cultivation.',
    subFields: {
      'Precision Agriculture & Crop Science': {
        skills: ['Drone Imagery & Remote Sensing', 'Hydroponics & Polyhouse Management', 'Soil Fertility Analytics', 'Medicinal Plants Cultivation (GAP)', 'Seed Genetics'],
        roles: ['Agronomist Intern', 'Precision Farming Specialist', 'Medicinal Plant Cultivation Lead', 'Agri-Data Trainee'],
        industrySectors: ['Agri-Tech & Modern Agriculture', 'Pharmaceuticals & Bio-Tech', 'FMCG & Consumer Goods'],
        programs: ['Smart Farming with IoT & Drone Analytics', 'Good Agricultural Practices (GAP) for Herbal Flora'],
      },
    },
  },

  'Media & Communication': {
    code: 'MED',
    description: 'Digital journalism, audiovisual production, strategic PR, broadcasting, and content ecosystems.',
    subFields: {
      'Digital Journalism & Media Production': {
        skills: ['Investigative Reporting', 'Video Editing (Premiere/DaVinci)', 'Podcast Production', 'Data Journalism', 'Media Ethics', 'Social Media Storytelling'],
        roles: ['Multimedia Journalist Intern', 'Content Producer Associate', 'Broadcast Assistant', 'Digital Communications Trainee'],
        industrySectors: ['Media, Digital & Advertising', 'Product Startups & SaaS', 'EdTech & Education'],
        programs: ['Next-Gen Multimedia Journalism & Podcasting', 'Data-Driven Investigative Storytelling'],
      },
      'Public Relations & Strategic Comms': {
        skills: ['Crisis Communication', 'Press Release Writing', 'Brand Reputation Management', 'Influencer Alliances', 'Media Pitching'],
        roles: ['PR Associate Intern', 'Corporate Communications Specialist', 'Media Relations Trainee'],
        industrySectors: ['Media, Digital & Advertising', 'Consulting & Advisory', 'FMCG & Consumer Goods'],
        programs: ['Crisis Communications & Brand Strategy', 'Digital PR & Corporate Messaging'],
      },
    },
  },

  'Education & Pedagogy': {
    code: 'EDU',
    description: 'Instructional design, learning science, curriculum engineering, EdTech integration, and academic assessment.',
    subFields: {
      'Instructional Design & EdTech': {
        skills: ['Curriculum Design', 'Instructional Systems Design (ADDIE)', 'LMS Administration (Moodle/Canvas)', 'Gamified Learning', 'Assessment Analytics', 'SCORM Creation'],
        roles: ['Instructional Design Intern', 'EdTech Content Developer', 'Curriculum Specialist Trainee', 'Learning Experience Designer'],
        industrySectors: ['EdTech & Education', 'IT Services & Software', 'Consulting & Advisory'],
        programs: ['Modern Instructional Design & Cognitive Psychology', 'Gamification in Digital Learning'],
      },
      'Higher Education & Faculty Leadership': {
        skills: ['Outcome-Based Education (OBE)', 'NAAC/NIRF Accreditation Metrics', 'Pedagogical Mentorship', 'Research Methodology', 'Grant Writing'],
        roles: ['Academic Research Fellow', 'Pedagogy Trainee', 'Institutional Quality Associate'],
        industrySectors: ['EdTech & Education', 'Government, Defense & PSUs', 'NGOs & Public Policy'],
        programs: ['Outcome-Based Education (OBE) Masterclass', 'Academic Research & Grant Proposal Writing'],
      },
    },
  },

  'Hospitality & Tourism': {
    code: 'HSP',
    description: 'Hotel operations, luxury guest relations, tourism management, culinary logistics, and wellness retreats.',
    subFields: {
      'Hotel & Resort Operations': {
        skills: ['Front Office PMS (Opera)', 'Guest Relationship Management', 'Food & Beverage Operations', 'Revenue Management', 'Hospitality Standards & HACCP'],
        roles: ['Management Trainee (Hotels)', 'Guest Relations Officer', 'F&B Operations Associate', 'Revenue Management Intern'],
        industrySectors: ['FMCG & Consumer Goods', 'Consulting & Advisory', 'Healthcare, Hospitals & Wellness'],
        programs: ['Luxury Hospitality & Guest Experience Management', 'Hospitality Revenue Optimization'],
      },
      'Eco-Tourism & Wellness Retreats': {
        skills: ['Wellness Tourism Programming', 'Eco-Tourism Site Management', 'Ayush Spa Operations', 'Sustainable Travel Logistics', 'Event Coordination'],
        roles: ['Wellness Retreat Coordinator', 'Tourism Experience Curator', 'Eco-Tour Guide Associate'],
        industrySectors: ['Healthcare, Hospitals & Wellness', 'FMCG & Consumer Goods', 'NGOs & Public Policy'],
        programs: ['Holistic Wellness & Ayush Tourism Curatorship', 'Sustainable Ecotourism Design'],
      },
    },
  },
};

export const getAllDomains = () => Object.keys(DOMAIN_TAXONOMY);

export const getSubFieldsForDomain = (domain) => {
  return DOMAIN_TAXONOMY[domain]?.subFields ? Object.keys(DOMAIN_TAXONOMY[domain].subFields) : [];
};

export const getSkillsForSubField = (domain, subField) => {
  return DOMAIN_TAXONOMY[domain]?.subFields?.[subField]?.skills || [];
};

export const getAllSkillsList = () => {
  const allSkills = new Set();
  Object.values(DOMAIN_TAXONOMY).forEach((domainObj) => {
    Object.values(domainObj.subFields).forEach((sf) => {
      sf.skills.forEach((s) => allSkills.add(s));
    });
  });
  SOFT_SKILLS.forEach((s) => allSkills.add(s));
  return Array.from(allSkills);
};
