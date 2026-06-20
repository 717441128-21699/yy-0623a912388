import { create } from 'zustand'
import type { UserRole, SignRecord, BriefingSession, BriefingPhoto, Feedback } from '@/types'
import { projects, hazardTypes, schemes, controlPoints, constructionSteps, acceptanceNodes, prohibitions, quizQuestions, initialFeedbacks } from '@/data/mockData'

interface AppState {
  currentRole: UserRole | null
  currentProjectId: string | null
  currentTypeId: string | null
  currentSchemeId: string | null
  briefingSessions: BriefingSession[]
  feedbacks: Feedback[]
  quizAnswers: Record<string, number>

  setRole: (role: UserRole) => void
  setProject: (projectId: string) => void
  setType: (typeId: string) => void
  setScheme: (schemeId: string) => void
  addSignRecord: (session: BriefingSession, record: SignRecord) => void
  addBriefingPhoto: (sessionId: string, photo: BriefingPhoto) => void
  createBriefingSession: (session: BriefingSession) => void
  setQuizAnswer: (questionId: string, answerIndex: number) => void
  clearQuizAnswers: () => void
  addFeedback: (feedback: Feedback) => void
  updateFeedbackStatus: (feedbackId: string, status: '待处理' | '已处理') => void

  getProject: () => typeof projects[0] | undefined
  getHazardTypes: () => typeof hazardTypes
  getScheme: () => typeof schemes[0] | undefined
  getControlPoints: () => typeof controlPoints
  getConstructionSteps: () => typeof constructionSteps
  getAcceptanceNodes: () => typeof acceptanceNodes
  getProhibitions: () => typeof prohibitions
  getQuizQuestions: () => typeof quizQuestions
  getLatestSession: () => BriefingSession | undefined
}

export const useStore = create<AppState>((set, get) => ({
  currentRole: null,
  currentProjectId: null,
  currentTypeId: null,
  currentSchemeId: null,
  briefingSessions: [],
  feedbacks: [...initialFeedbacks],
  quizAnswers: {},

  setRole: (role) => set({ currentRole: role }),
  setProject: (projectId) => set({ currentProjectId: projectId, currentTypeId: null, currentSchemeId: null }),
  setType: (typeId) => {
    const scheme = schemes.find(s => s.typeId === typeId)
    set({ currentTypeId: typeId, currentSchemeId: scheme?.id ?? null })
  },
  setScheme: (schemeId) => set({ currentSchemeId: schemeId }),

  createBriefingSession: (session) => set(state => ({
    briefingSessions: [...state.briefingSessions, session]
  })),

  addSignRecord: (session, record) => set(state => {
    const existing = state.briefingSessions.find(s => s.id === session.id)
    if (existing) {
      return {
        briefingSessions: state.briefingSessions.map(s =>
          s.id === session.id
            ? { ...s, signRecords: [...s.signRecords, record] }
            : s
        ),
      }
    }
    return {
      briefingSessions: [...state.briefingSessions, { ...session, signRecords: [record] }],
    }
  }),

  addBriefingPhoto: (sessionId, photo) => set(state => ({
    briefingSessions: state.briefingSessions.map(s =>
      s.id === sessionId
        ? { ...s, photos: [...s.photos, photo] }
        : s
    ),
  })),

  setQuizAnswer: (questionId, answerIndex) => set(state => ({
    quizAnswers: { ...state.quizAnswers, [questionId]: answerIndex }
  })),

  clearQuizAnswers: () => set({ quizAnswers: {} }),

  addFeedback: (feedback) => set(state => ({
    feedbacks: [feedback, ...state.feedbacks]
  })),

  updateFeedbackStatus: (feedbackId, status) => set(state => ({
    feedbacks: state.feedbacks.map(f =>
      f.id === feedbackId ? { ...f, status } : f
    ),
  })),

  getProject: () => {
    const id = get().currentProjectId
    return projects.find(p => p.id === id)
  },

  getHazardTypes: () => {
    const id = get().currentProjectId
    return hazardTypes.filter(h => h.projectId === id)
  },

  getScheme: () => {
    const id = get().currentSchemeId
    return schemes.find(s => s.id === id)
  },

  getControlPoints: () => {
    const id = get().currentSchemeId
    return controlPoints.filter(c => c.schemeId === id)
  },

  getConstructionSteps: () => {
    const id = get().currentSchemeId
    return constructionSteps.filter(c => c.schemeId === id)
  },

  getAcceptanceNodes: () => {
    const id = get().currentSchemeId
    return acceptanceNodes.filter(a => a.schemeId === id)
  },

  getProhibitions: () => {
    const id = get().currentSchemeId
    return prohibitions.filter(p => p.schemeId === id)
  },

  getQuizQuestions: () => {
    const id = get().currentSchemeId
    return quizQuestions.filter(q => q.schemeId === id)
  },

  getLatestSession: () => {
    const id = get().currentSchemeId
    const sessions = get().briefingSessions.filter(s => s.schemeId === id)
    return sessions[sessions.length - 1]
  },
}))
