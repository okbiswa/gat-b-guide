import { tool } from 'ai';
import { z } from 'zod';
import { getInstitutes, getCutoffs } from './dataStore';

export const agentTools = {
  recommendColleges: tool({
    description: 'Suggest colleges where the historical minimum cutoff is less than or equal to the user score.',
    parameters: z.object({
      score: z.number().describe("The user's GAT-B score"),
      category: z.enum(['UR', 'EWS', 'OBC', 'SC', 'ST', 'DA']).describe("The user's category"),
      state_preference: z.string().optional().describe('Optional state filter'),
    }),
    execute: async ({ score, category, state_preference }) => {
      const institutes = getInstitutes();
      const cutoffs = getCutoffs();
      
      const categoryCutoffs = cutoffs.filter(c => c.category === category && parseFloat(c.min_score) <= score);
      let recommended = categoryCutoffs.map(c => {
        const inst = institutes.find(i => i.institute_id === c.institute_id);
        return {
          ...c,
          institute_name: inst?.institute_name,
          state: inst?.state,
          programme: inst?.programme_offered
        };
      });

      if (state_preference) {
        recommended = recommended.filter(r => r.state?.toLowerCase() === state_preference.toLowerCase());
      }
      
      return recommended.slice(0, 10); // Return top 10 to fit in context
    },
  }),

  ambitiousChoices: tool({
    description: 'Suggest colleges where the user is slightly below the cutoff (reach colleges).',
    parameters: z.object({
      score: z.number(),
      category: z.enum(['UR', 'EWS', 'OBC', 'SC', 'ST', 'DA']),
    }),
    execute: async ({ score, category }) => {
      const institutes = getInstitutes();
      const cutoffs = getCutoffs();
      
      const categoryCutoffs = cutoffs.filter(c => 
        c.category === category && 
        parseFloat(c.min_score) > score && 
        parseFloat(c.min_score) <= score + 15
      );
      
      return categoryCutoffs.map(c => {
        const inst = institutes.find(i => i.institute_id === c.institute_id);
        return {
          ...c,
          institute_name: inst?.institute_name,
          state: inst?.state,
          programme: inst?.programme_offered
        };
      }).slice(0, 5);
    },
  }),

  safeChoices: tool({
    description: 'Suggest safe colleges where the user is well above the cutoff.',
    parameters: z.object({
      score: z.number(),
      category: z.enum(['UR', 'EWS', 'OBC', 'SC', 'ST', 'DA']),
    }),
    execute: async ({ score, category }) => {
      const institutes = getInstitutes();
      const cutoffs = getCutoffs();
      
      const categoryCutoffs = cutoffs.filter(c => 
        c.category === category && 
        parseFloat(c.min_score) <= score - 15
      );
      
      return categoryCutoffs.map(c => {
        const inst = institutes.find(i => i.institute_id === c.institute_id);
        return {
          ...c,
          institute_name: inst?.institute_name,
          state: inst?.state,
          programme: inst?.programme_offered
        };
      }).slice(0, 5);
    },
  }),

  searchInstitute: tool({
    description: 'Fetch detailed metadata for a specific institute.',
    parameters: z.object({
      institute_name: z.string(),
    }),
    execute: async ({ institute_name }) => {
      const institutes = getInstitutes();
      const match = institutes.find(i => i.institute_name.toLowerCase().includes(institute_name.toLowerCase()));
      return match || { error: 'Institute not found' };
    },
  }),

  compareInstitutes: tool({
    description: 'Compare two specific colleges.',
    parameters: z.object({
      institute_a: z.string(),
      institute_b: z.string(),
      category: z.enum(['UR', 'EWS', 'OBC', 'SC', 'ST', 'DA']),
    }),
    execute: async ({ institute_a, institute_b, category }) => {
      const institutes = getInstitutes();
      const cutoffs = getCutoffs();
      
      const instA = institutes.find(i => i.institute_name.toLowerCase().includes(institute_a.toLowerCase()));
      const instB = institutes.find(i => i.institute_name.toLowerCase().includes(institute_b.toLowerCase()));
      
      const cutoffsA = instA ? cutoffs.filter(c => c.institute_id === instA.institute_id && c.category === category) : [];
      const cutoffsB = instB ? cutoffs.filter(c => c.institute_id === instB.institute_id && c.category === category) : [];
      
      return {
        instituteA: { details: instA, cutoffs: cutoffsA },
        instituteB: { details: instB, cutoffs: cutoffsB },
      };
    },
  }),

  cutoffTrend: tool({
    description: 'Retrieve historical cutoffs for a specific program to analyze trends.',
    parameters: z.object({
      institute_name: z.string(),
      category: z.enum(['UR', 'EWS', 'OBC', 'SC', 'ST', 'DA']),
    }),
    execute: async ({ institute_name, category }) => {
      const institutes = getInstitutes();
      const cutoffs = getCutoffs();
      
      const inst = institutes.find(i => i.institute_name.toLowerCase().includes(institute_name.toLowerCase()));
      if (!inst) return { error: 'Institute not found' };
      
      return cutoffs.filter(c => c.institute_id === inst.institute_id && c.category === category);
    },
  }),

  eligibility: tool({
    description: 'Check degree/subject requirements for a specific institute.',
    parameters: z.object({
      institute_name: z.string(),
    }),
    execute: async ({ institute_name }) => {
      const institutes = getInstitutes();
      const inst = institutes.find(i => i.institute_name.toLowerCase().includes(institute_name.toLowerCase()));
      return inst ? { institute: inst.institute_name, eligibility: inst.eligibility } : { error: 'Not found' };
    },
  }),

  seatMatrix: tool({
    description: 'Retrieve available seats for a specific institute.',
    parameters: z.object({
      institute_name: z.string(),
    }),
    execute: async ({ institute_name }) => {
      const institutes = getInstitutes();
      const inst = institutes.find(i => i.institute_name.toLowerCase().includes(institute_name.toLowerCase()));
      return inst ? { institute: inst.institute_name, total_seats: inst.total_seats } : { error: 'Not found' };
    },
  }),
};
