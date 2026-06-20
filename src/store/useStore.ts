import { create } from 'zustand'
import type { UserRole, SignRecord, BriefingSession, BriefingPhoto, Feedback } from '@/types'
import { projects, hazardTypes, schemes, controlPoints, constructionSteps, acceptanceNodes, prohibitions, quizQuestions, initialFeedbacks } from '@/data/mockData'

const STORAGE_KEY = 'hazard-briefing-store-v1'

interface PersistedState {
  currentRole: UserRole | null
  currentProjectId: string | null
  currentTypeId: string | null
  currentSchemeId: string | null
  briefingSessions: BriefingSession[]
  feedbacks: Feedback[]
  quizAnswers: Record<string, number>
  currentHandlerName: string
}

interface AppState extends PersistedState {
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
  handleFeedback: (feedbackId: string, handlerComment: string, handlerTime: string, handlerName?: string) => void
  setCurrentHandlerName: (name: string) => void

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

const loadPersisted = (): Partial<PersistedState> => {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return parsed
  } catch (e) {
    return {}
  }
}

const persisted = loadPersisted()

export const useStore = create<AppState>((set, get) => ({
  currentRole: persisted.currentRole ?? null,
  currentProjectId: persisted.currentProjectId ?? null,
  currentTypeId: persisted.currentTypeId ?? null,
  currentSchemeId: persisted.currentSchemeId ?? null,
  briefingSessions: persisted.briefingSessions ?? [],
  feedbacks: persisted.feedbacks ?? [...initialFeedbacks],
  quizAnswers: persisted.quizAnswers ?? {},
  currentHandlerName: persisted.currentHandlerName ?? '赵技术负责人',

  setRole: (role) => {
    set({ currentRole: role })
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), currentRole: role }))
    }
  },

  setProject: (projectId) => {
    const newState = { currentProjectId: projectId, currentTypeId: null, currentSchemeId: null }
    set(newState)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), ...newState }))
    }
  },

  setType: (typeId) => {
    const scheme = schemes.find(s => s.typeId === typeId)
    const newState = { currentTypeId: typeId, currentSchemeId: scheme?.id ?? null }
    set(newState)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), ...newState }))
    }
  },

  setScheme: (schemeId) => {
    set({ currentSchemeId: schemeId })
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), currentSchemeId: schemeId }))
    }
  },

  setCurrentHandlerName: (name) => {
    set({ currentHandlerName: name })
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), currentHandlerName: name }))
    }
  },

  createBriefingSession: (session) => {
    const newSessions = [...get().briefingSessions, session]
    set({ briefingSessions: newSessions })
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), briefingSessions: newSessions }))
    }
  },

  addSignRecord: (session, record) => {
    const state = get()
    const existing = state.briefingSessions.find(s => s.id === session.id)
    let newSessions: BriefingSession[]
    if (existing) {
      newSessions = state.briefingSessions.map(s =>
        s.id === session.id
          ? { ...s, signRecords: [...s.signRecords, record] }
          : s
      )
    } else {
      newSessions = [...state.briefingSessions, { ...session, signRecords: [record] }]
    }
    set({ briefingSessions: newSessions })
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), briefingSessions: newSessions }))
    }
  },

  addBriefingPhoto: (sessionId, photo) => {
    const newSessions = get().briefingSessions.map(s =>
      s.id === sessionId
        ? { ...s, photos: [...s.photos, photo] }
        : s
    )
    set({ briefingSessions: newSessions })
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), briefingSessions: newSessions }))
    }
  },

  setQuizAnswer: (questionId, answerIndex) => {
    const newAnswers = { ...get().quizAnswers, [questionId]: answerIndex }
    set({ quizAnswers: newAnswers })
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), quizAnswers: newAnswers }))
    }
  },

  clearQuizAnswers: () => {
    set({ quizAnswers: {} })
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), quizAnswers: {} }))
    }
  },

  addFeedback: (feedback) => {
    const newFeedbacks = [feedback, ...get().feedbacks]
    set({ feedbacks: newFeedbacks })
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), feedbacks: newFeedbacks }))
    }
  },

  updateFeedbackStatus: (feedbackId, status) => {
    const newFeedbacks = get().feedbacks.map(f =>
      f.id === feedbackId ? { ...f, status } : f
    )
    set({ feedbacks: newFeedbacks })
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), feedbacks: newFeedbacks }))
    }
  },

  handleFeedback: (feedbackId, handlerComment, handlerTime, handlerName) => {
    const newFeedbacks = get().feedbacks.map(f =>
      f.id === feedbackId ? { ...f, status: '已处理' as const, handlerComment, handlerTime, handlerName } : f
    )
    set({ feedbacks: newFeedbacks })
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), feedbacks: newFeedbacks }))
    }
  },

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
