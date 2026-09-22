import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Institution } from '../models/Institution.js';
import { Opportunity } from '../models/Opportunity.js';
import { LearningProgram } from '../models/LearningProgram.js';
import { FacultyOpportunity } from '../models/FacultyOpportunity.js';
import { CollabEvent } from '../models/CollabEvent.js';
import { SkillAssessment } from '../models/SkillAssessment.js';
import { SkillProfile } from '../models/SkillProfile.js';
import { Application } from '../models/Application.js';
import { InternshipRecord } from '../models/InternshipRecord.js';
import { PortfolioItem } from '../models/PortfolioItem.js';
import { Document } from '../models/Document.js';
import { Notification } from '../models/Notification.js';
import { Enrollment } from '../models/Enrollment.js';

import {
  SHARED_DEMO_PASSWORD,
  seedInstitutions,
  demoAccounts,
  additionalStudents,
  additionalIndustries,
  seedOpportunities,
  seedLearningPrograms,
  seedFacultyOpportunities,
  seedCollabEvents,
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const runSeed = async () => {
  console.log('[Seed]: Connecting to database...');
  const conn = await connectDB();

  if (!conn) {
    console.error('[Seed Error]: MongoDB is not reachable. Ensure MONGO_URI is configured and running.');
    process.exit(1);
  }

  try {
    console.log('[Seed]: Clearing existing records across all collections...');
    await Promise.all([
      User.deleteMany({}),
      Institution.deleteMany({}),
      Opportunity.deleteMany({}),
      LearningProgram.deleteMany({}),
      FacultyOpportunity.deleteMany({}),
      CollabEvent.deleteMany({}),
      SkillAssessment.deleteMany({}),
      SkillProfile.deleteMany({}),
      Application.deleteMany({}),
      InternshipRecord.deleteMany({}),
      PortfolioItem.deleteMany({}),
      Document.deleteMany({}),
      Notification.deleteMany({}),
      Enrollment.deleteMany({}),
    ]);

    console.log('[Seed]: Creating institution...');
    const [institution] = await Institution.insertMany(seedInstitutions);

    console.log('[Seed]: Creating demo users...');
    const createdDemoUsers = [];
    for (const acc of demoAccounts) {
      const user = await User.create({
        ...acc,
        password: SHARED_DEMO_PASSWORD,
        institution: institution._id,
      });
      createdDemoUsers.push(user);
    }

    const demoStudent = createdDemoUsers.find((u) => u.role === 'student');
    const demoFaculty = createdDemoUsers.find((u) => u.role === 'academician');
    const demoIndustry = createdDemoUsers.find((u) => u.role === 'industry');
    const demoInstitution = createdDemoUsers.find((u) => u.role === 'institution');

    console.log('[Seed]: Creating cross-domain student roster (Engineering, Management, Healthcare, Design, Commerce, Science)...');
    const createdStudents = [demoStudent];
    for (const s of additionalStudents) {
      const stud = await User.create({
        ...s,
        password: SHARED_DEMO_PASSWORD,
        institution: institution._id,
      });
      createdStudents.push(stud);
    }

    console.log('[Seed]: Creating additional industry recruiters...');
    const createdIndustries = [demoIndustry];
    for (const ind of additionalIndustries) {
      const indUser = await User.create({
        ...ind,
        password: SHARED_DEMO_PASSWORD,
      });
      createdIndustries.push(indUser);
    }

    console.log('[Seed]: Seeding opportunities (40% Engg, 20% Mgt, 10% Health, 30% others)...');
    const createdOpps = [];
    for (let i = 0; i < seedOpportunities.length; i++) {
      const opp = seedOpportunities[i];
      const companyUser = createdIndustries[i % createdIndustries.length];
      const oppDoc = await Opportunity.create({
        ...opp,
        company: companyUser._id,
        companyName: companyUser.profile?.companyName || opp.companyName,
      });
      createdOpps.push(oppDoc);
    }

    console.log('[Seed]: Creating learning programs & enrollments...');
    const createdPrograms = [];
    for (let i = 0; i < seedLearningPrograms.length; i++) {
      const prog = seedLearningPrograms[i];
      const providerUser = createdIndustries[i % createdIndustries.length];
      const pDoc = await LearningProgram.create({
        ...prog,
        provider: providerUser._id,
        providerName: providerUser.profile?.companyName || prog.providerName,
      });
      createdPrograms.push(pDoc);
    }

    // Enroll demo student in first learning program
    await Enrollment.create({
      student: demoStudent._id,
      program: createdPrograms[0]._id,
      progressPercent: 45,
      status: 'in-progress',
    });

    console.log('[Seed]: Creating documents vault for demo student...');
    const resumeDoc = await Document.create({
      owner: demoStudent._id,
      title: 'Aarav_Sharma_Engineering_Resume_2026.pdf',
      category: 'resume',
      filePath: '/uploads/demo-student-resume.pdf',
      fileSize: 412000,
      mimeType: 'application/pdf',
      metadata: { verifiedByInstitution: true, hash: 'SHA256-AARAV-RESUME-VERIFIED' },
    });

    await Document.create({
      owner: demoStudent._id,
      title: 'Dean_NOC_Summer_Internship_Approval.pdf',
      category: 'noc',
      filePath: '/uploads/demo-student-noc.pdf',
      fileSize: 228000,
      mimeType: 'application/pdf',
      metadata: { verifiedByInstitution: true, hash: 'SHA256-NOC-NIT-DELHI' },
    });

    await Document.create({
      owner: demoStudent._id,
      title: 'Cloud_Architecture_Certificate.pdf',
      category: 'certificate',
      filePath: '/uploads/demo-cert-cloud.pdf',
      fileSize: 310000,
      mimeType: 'application/pdf',
      metadata: { verifiedByInstitution: true },
    });

    console.log('[Seed]: Creating candidate applications & pipeline...');
    // Demo student applied to 3 opportunities
    await Application.create({
      student: demoStudent._id,
      opportunity: createdOpps[0]._id, // NexGen Full Stack
      resumeDocument: resumeDoc._id,
      resumeUrl: 'https://skillsetu.in/vault/aarav-resume.pdf',
      coverLetter: 'Excited to contribute to NexGen cloud services with my React, Node.js and distributed systems background.',
      status: 'interview',
      statusHistory: [
        { status: 'applied', changedAt: new Date(Date.now() - 5 * 86400000), note: 'Submitted application with verified resume' },
        { status: 'shortlisted', changedAt: new Date(Date.now() - 3 * 86400000), note: 'Profile matched 92% with core skill criteria' },
        { status: 'interview', changedAt: new Date(Date.now() - 1 * 86400000), note: 'Technical rounds scheduled for Friday 3:00 PM' },
      ],
      interviewSchedule: {
        date: new Date(Date.now() + 2 * 86400000),
        meetingLink: 'https://meet.google.com/setu-tech-demo',
        notes: 'Technical discussion on React 18 concurrency and microservice API design',
      },
    });

    await Application.create({
      student: demoStudent._id,
      opportunity: createdOpps[1]._id, // Apex Cloud AI
      resumeDocument: resumeDoc._id,
      status: 'shortlisted',
      statusHistory: [
        { status: 'applied', changedAt: new Date(Date.now() - 7 * 86400000), note: 'Application received' },
        { status: 'shortlisted', changedAt: new Date(Date.now() - 2 * 86400000), note: 'Reviewing Kaggle & GitHub portfolio' },
      ],
    });

    // Also populate other student candidates for Demo Industry (createdOpps[0])
    for (let i = 1; i < Math.min(createdStudents.length, 5); i++) {
      await Application.create({
        student: createdStudents[i]._id,
        opportunity: createdOpps[0]._id,
        coverLetter: `Honored to apply for ${createdOpps[0].title}. Ready to start immediately.`,
        status: i === 1 ? 'shortlisted' : i === 2 ? 'interview' : 'applied',
        statusHistory: [
          { status: 'applied', changedAt: new Date(Date.now() - 4 * 86400000), note: 'Application submitted' },
        ],
      });
    }

    console.log('[Seed]: Creating active internship record with milestones & logs...');
    await InternshipRecord.create({
      student: demoStudent._id,
      opportunity: createdOpps[0]._id,
      industryMentor: demoIndustry._id,
      facultySupervisor: demoFaculty._id,
      institution: institution._id,
      status: 'in-progress',
      startDate: new Date(Date.now() - 30 * 86400000),
      endDate: new Date(Date.now() + 90 * 86400000),
      milestones: [
        {
          title: 'Milestone 1: Architecture Onboarding & Local Dev Setup',
          description: 'Set up Dockerized dev environment, configure ESLint & CI/CD workflows',
          status: 'completed',
          dueDate: new Date(Date.now() - 20 * 86400000),
          completedDate: new Date(Date.now() - 21 * 86400000),
          deliverableUrl: 'https://github.com/aarav-demo/nexgen-service-onboarding',
        },
        {
          title: 'Milestone 2: Core Microservice REST API Implementation',
          description: 'Implement secure auth tokens, rate limiters, and telemetry logging in Express',
          status: 'completed',
          dueDate: new Date(Date.now() - 5 * 86400000),
          completedDate: new Date(Date.now() - 6 * 86400000),
          deliverableUrl: 'https://github.com/aarav-demo/microservice-api-pr-42',
        },
        {
          title: 'Milestone 3: React Dashboard & Telemetry Visualizer',
          description: 'Integrate Recharts visual stream and WebSocket heartbeat status indicators',
          status: 'in-progress',
          dueDate: new Date(Date.now() + 15 * 86400000),
        },
        {
          title: 'Milestone 4: Production Deployment & Load Testing',
          description: 'Stress test endpoints under 5,000 req/sec and generate final internship report',
          status: 'pending',
          dueDate: new Date(Date.now() + 45 * 86400000),
        },
      ],
      weeklyLogs: [
        {
          weekNumber: 1,
          summary: 'Completed security compliance briefing, repository access setup, and ran local docker-compose cluster.',
          tasksCompleted: ['Configured environment variables', 'Built smoke test suite', 'Attended team sprint planning'],
          hoursLogged: 40,
          mentorVerified: true,
          submittedAt: new Date(Date.now() - 21 * 86400000),
        },
        {
          weekNumber: 2,
          summary: 'Implemented JWT token refresh mechanism and unit tested user authentication controllers.',
          tasksCompleted: ['Auth controller refactoring', 'Added Jest tests with 88% coverage', 'Fixed CORS header issue'],
          hoursLogged: 42,
          mentorVerified: true,
          submittedAt: new Date(Date.now() - 14 * 86400000),
        },
        {
          weekNumber: 3,
          summary: 'Integrated Redis caching layer on high-traffic opportunity search endpoints.',
          tasksCompleted: ['Redis cache wrapper', 'Latency benchmark reduced from 140ms to 18ms'],
          hoursLogged: 38,
          mentorVerified: true,
          submittedAt: new Date(Date.now() - 7 * 86400000),
        },
      ],
      mentorFeedback: [
        {
          author: demoIndustry._id,
          role: 'Industry Mentor',
          rating: 5,
          remarks: 'Aarav demonstrated exemplary code quality, rigorous adherence to design guidelines, and excellent communication in sprint reviews.',
          date: new Date(Date.now() - 6 * 86400000),
        },
      ],
    });

    console.log('[Seed]: Creating student portfolio items...');
    await PortfolioItem.create({
      student: demoStudent._id,
      title: 'SkillSetu High-Performance Matching Engine',
      description: 'Engineered a weighted cross-domain matching algorithm supporting adjacent career mobility and radar benchmark comparisons.',
      category: 'Project',
      githubUrl: 'https://github.com/aarav-demo/skillsetu-matching-core',
      externalLink: 'https://skillsetu.in',
      tags: ['Node.js', 'Algorithms', 'React', 'MongoDB'],
      skills: ['Node.js', 'React', 'DSA', 'System Design'],
      verified: true,
      verifiedBy: demoFaculty._id,
      verifiedRole: 'academician',
      verifiedAt: new Date(Date.now() - 10 * 86400000),
    });

    await PortfolioItem.create({
      student: demoStudent._id,
      title: 'Certified Kubernetes Application Developer (CKAD)',
      description: 'Official Linux Foundation / CNCF professional certification for container deployment and pod networking.',
      category: 'Certification',
      externalLink: 'https://www.credly.com/badges/demo-ckad-aarav',
      tags: ['Cloud', 'DevOps', 'Kubernetes'],
      skills: ['Docker', 'Kubernetes', 'Cloud/AWS'],
      verified: true,
      verifiedBy: demoIndustry._id,
      verifiedRole: 'industry',
      verifiedAt: new Date(Date.now() - 15 * 86400000),
    });

    console.log('[Seed]: Creating skill assessments & profile for demo student...');
    await SkillAssessment.create({
      student: demoStudent._id,
      title: 'Engineering Core & Full-Stack System Architecture Diagnostic',
      domain: 'Engineering & Technology',
      subField: 'Computer Science & IT',
      technicalScore: 88,
      aptitudeScore: 84,
      softSkillsScore: 90,
      overallScore: 87,
      scoresByCategory: [
        { category: 'Technical Domain Knowledge', scorePercent: 88, proficiencyLevel: 'Advanced' },
        { category: 'Aptitude & Problem Solving', scorePercent: 84, proficiencyLevel: 'Advanced' },
        { category: 'Soft Skills & Leadership', scorePercent: 90, proficiencyLevel: 'Advanced' },
      ],
      status: 'verified',
      completedAt: new Date(),
    });

    await SkillProfile.create({
      student: demoStudent._id,
      verifiedSkills: [
        { skillName: 'React', level: 'Advanced', verifiedAt: new Date() },
        { skillName: 'Node.js', level: 'Advanced', verifiedAt: new Date() },
        { skillName: 'SQL', level: 'Intermediate', verifiedAt: new Date() },
        { skillName: 'Git', level: 'Advanced', verifiedAt: new Date() },
        { skillName: 'Docker', level: 'Intermediate', verifiedAt: new Date() },
      ],
      targetRoles: ['Full-Stack Software Engineer', 'Cloud Solutions Architect', 'DevOps Engineer'],
      readinessScore: 87,
      benchmarks: [
        { subject: 'Technical Core', studentScore: 88, industryBenchmark: 75, fullMark: 100 },
        { subject: 'Analytical Aptitude', studentScore: 84, industryBenchmark: 70, fullMark: 100 },
        { subject: 'Professional Soft Skills', studentScore: 90, industryBenchmark: 80, fullMark: 100 },
        { subject: 'System Design & Scalability', studentScore: 82, industryBenchmark: 75, fullMark: 100 },
        { subject: 'Cloud & Tooling', studentScore: 78, industryBenchmark: 65, fullMark: 100 },
      ],
      skillGaps: [
        {
          skillName: 'Kubernetes Orchestration',
          currentProficiency: 45,
          requiredProficiency: 80,
          severity: 'moderate',
          category: 'Engineering & Technology',
          recommendedProgram: createdPrograms[0]._id,
        },
        {
          skillName: 'gRPC & Protocol Buffers',
          currentProficiency: 30,
          requiredProficiency: 75,
          severity: 'critical',
          category: 'Engineering & Technology',
          recommendedProgram: createdPrograms[0]._id,
        },
        {
          skillName: 'Financial Modeling (Adjacent)',
          currentProficiency: 20,
          requiredProficiency: 70,
          severity: 'low',
          category: 'Management & Business',
          recommendedProgram: createdPrograms[2]._id,
        },
      ],
    });

    console.log('[Seed]: Creating realistic notifications...');
    await Notification.create({
      recipient: demoStudent._id,
      title: 'Interview Scheduled with NexGen Tech',
      message: 'Your technical interview for Full-Stack Cloud & Web Engineering Intern is confirmed for Friday at 3:00 PM.',
      type: 'opportunity',
      link: '/dashboard/applications',
    });

    await Notification.create({
      recipient: demoStudent._id,
      title: 'Weekly Progress Log Approved',
      message: 'Vikramaditya Singhania approved your Week 3 progress submission with 5/5 remarks.',
      type: 'system',
      link: '/dashboard/my-internship',
    });

    await Notification.create({
      recipient: demoIndustry._id,
      title: 'New Candidate Applications Received',
      message: '4 students applied for "Full-Stack Cloud & Web Engineering Intern". Review ranked candidate scores now.',
      type: 'application',
      link: '/dashboard/pipeline',
    });

    console.log('\n========================================================');
    console.log(' SEEDING COMPLETE FOR SKILLSETU (ALL DOMAINS - PHASE 2)');
    console.log('========================================================');
    console.log('Balanced Data: 40% Engg | 20% Mgt | 10% Health | 30% Other');
    console.log('Demo Accounts (Password: ' + SHARED_DEMO_PASSWORD + '):');
    console.log('  1. Student:     demo.student@skillsetu.in');
    console.log('  2. Faculty:     demo.faculty@skillsetu.in');
    console.log('  3. Industry:    demo.industry@skillsetu.in');
    console.log('  4. Institution: demo.institution@skillsetu.in');
    console.log('========================================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

runSeed();
