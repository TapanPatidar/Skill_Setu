import api, { isMockMode } from './api.js';

export const aiService = {
  async getCareerGuidance(prompt, domain = 'Engineering & Technology', subField = '') {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 500));
      const p = (prompt || '').toLowerCase();
      let reply = '';

      if (p.includes('internship') || p.includes('apply') || p.includes('job')) {
        reply = `Based on current industry demand in **${domain}**${subField ? ` (${subField})` : ''}:\n\n` +
          `1. **Active Hiring Roles**: Specialized Engineers, Research Associates, and Associate Consultants.\n` +
          `2. **Benchmark Readiness**: Leading corporate recruiters prioritize students with a skill index of 85%+ and verified project credentials.\n` +
          `3. **Immediate Step**: Check the open internships in the portal matching your domain to apply directly with your verified institutional profile.`;
      } else if (p.includes('skill') || p.includes('gap') || p.includes('prepare')) {
        reply = `For students specializing in **${domain}**:\n\n` +
          `• **Top In-Demand Skills**: Domain-specific analytics, automated testing frameworks, and national regulatory compliance (GCP / Ind AS / ISO).\n` +
          `• **Target Gap**: Complete the diagnostic skill assessment to bridge critical microservice and modeling proficiencies.\n` +
          `• **Micro-Credentials**: Pair your degree with NPTEL/SWAYAM verified certifications to earn institutional credit transfer.`;
      } else {
        reply = `Welcome to SkillSetu AI Advisor! Specializing in **${domain}** unlocks significant placement opportunities across Tier-1 corporates and national research bodies.\n\n` +
          `• **Placement Strategy**: Focus on demonstrable GitHub/portfolio case studies and complete your institutional verification queue claims.\n` +
          `• **Mentorship**: Connect with accredited industry mentors and faculty advisors via the Collaboration Hub.\n` +
          `Feel free to ask about specific role preparation, interview questions, or domain skill roadmaps!`;
      }

      return {
        success: true,
        data: {
          reply,
          domain,
          subField,
          source: 'domain-aware-assistant',
        },
      };
    }

    try {
      return await api.post('/ai/career-guidance', { prompt, domain, subField });
    } catch (err) {
      return {
        success: true,
        data: {
          reply: `For your focus in **${domain}**, top recruiters look for verified skills and active industry capstones. Take the diagnostic assessment in your dashboard to benchmark your readiness!`,
          domain,
        },
      };
    }
  },
};
