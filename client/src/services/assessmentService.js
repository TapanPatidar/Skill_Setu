import api, { isMockMode } from './api.js';

export const assessmentService = {
  async getQuestions(domain = 'Engineering & Technology', subField = 'Computer Science & IT') {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 250));
      return {
        success: true,
        data: {
          domain,
          subField,
          sections: [
            {
              id: 'technical',
              title: `${subField} Technical Evaluation`,
              durationMinutes: 20,
              questions: [
                {
                  id: 'eng_01',
                  question: 'What is the worst-case time complexity of searching in a balanced Binary Search Tree (AVL / Red-Black)?',
                  options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
                },
                {
                  id: 'eng_02',
                  question: 'In React 18+, which hook is specifically designed to memoize heavy computational functions across re-renders?',
                  options: ['useEffect', 'useMemo', 'useCallback', 'useRef'],
                },
                {
                  id: 'eng_03',
                  question: 'In Node.js event loop architecture, in which phase are `setImmediate()` callbacks executed?',
                  options: ['Timers phase', 'Poll phase', 'Check phase', 'Close callbacks phase'],
                },
                {
                  id: 'eng_04',
                  question: 'Which consistency model ensures that every read receives the most recent write in a distributed system under CAP theorem?',
                  options: ['Eventual Consistency', 'Strong Consistency (Linearizability)', 'Causal Consistency', 'Monotonic Read Consistency'],
                },
                {
                  id: 'eng_14',
                  question: 'What is the primary operational advantage of multi-stage Docker builds?',
                  options: [
                    'They generate dramatically smaller, hardened production container images by separating compilation tooling from runtime artifacts.',
                    'They execute containers without Linux kernel cgroups.',
                    'They bypass network firewall restrictions.',
                    'They compress git history into tarballs.',
                  ],
                },
              ],
            },
            {
              id: 'soft-skills',
              title: 'Professional Scenario & Collaborative Judgment',
              durationMinutes: 10,
              questions: [
                {
                  id: 'soft_01',
                  question: 'During a cross-functional milestone, your technical partner strongly opposes your proposed design architecture 48 hours before prototype deadline. What is your optimal action?',
                  options: [
                    'Escalate immediately to the departmental dean or project director without further discussion.',
                    'Convene a 30-minute objective evaluation matrix comparing trade-offs, fallback risks, and user impact to find consensus.',
                    'Concede completely to avoid any friction and meet the immediate deadline.',
                    'Silently build your own version in parallel and submit both simultaneously.',
                  ],
                },
                {
                  id: 'soft_02',
                  question: 'You identify an unexpected data calculation error in a report that was already dispatched to an industry client. What represents highest professional accountability?',
                  options: [
                    'Wait for the client to notice first before acknowledging the issue.',
                    'Immediately alert your project lead with a rectified report, clear impact delta, and proactive mitigation steps.',
                    'Blame the automated data extraction pipeline and request an external audit.',
                    'Discreetly replace the server file without alerting any stakeholders.',
                  ],
                },
              ],
            },
            {
              id: 'aptitude',
              title: 'Cognitive & Quantitative Aptitude Test',
              durationMinutes: 15,
              questions: [
                {
                  id: 'apt_01',
                  question: 'In a certain code, "BRIDGE" is written as "CQKGFD". How would "TUNNEL" be written in that code?',
                  options: ['UVPODM', 'UWPODK', 'UVPODK', 'TVPODM'],
                },
                {
                  id: 'apt_03',
                  question: 'A project team delivers 3 modules in 12 days working 6 hours a day. How many hours a day must they work to finish 5 modules in 15 days?',
                  options: ['6.5 hours', '8.0 hours', '7.2 hours', '9.0 hours'],
                },
              ],
            },
          ],
        },
      };
    }

    try {
      return await api.get('/assessments/questions', { params: { domain, subField } });
    } catch (err) {
      return assessmentService.getQuestions(domain, subField);
    }
  },

  async submitAssessment(payload) {
    if (isMockMode) {
      await new Promise((res) => setTimeout(res, 500));
      return {
        success: true,
        data: {
          scores: {
            technicalScore: 88,
            aptitudeScore: 84,
            softSkillsScore: 92,
            overallScore: 88,
          },
          readinessScore: 88,
        },
        message: 'Assessment evaluated and profile updated successfully!',
      };
    }

    return await api.post('/assessments/submit', payload);
  },
};
