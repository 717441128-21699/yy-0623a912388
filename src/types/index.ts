export type UserRole = 'safety' | 'construction' | 'teamLeader'

export interface Project {
  id: string
  name: string
  address: string
  status: '进行中' | '已完工' | '暂停'
}

export interface HazardType {
  id: string
  projectId: string
  name: string
  icon: string
  description: string
}

export interface Scheme {
  id: string
  typeId: string
  title: string
  description: string
}

export interface ControlPoint {
  id: string
  schemeId: string
  title: string
  description: string
  level: 'critical' | 'important' | 'normal'
}

export interface ConstructionStep {
  id: string
  schemeId: string
  order: number
  title: string
  description: string
}

export interface AcceptanceNode {
  id: string
  schemeId: string
  title: string
  type: '必检' | '抽检'
  description: string
}

export interface Prohibition {
  id: string
  schemeId: string
  title: string
  description: string
}

export interface QuizQuestion {
  id: string
  schemeId: string
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

export interface BriefingSession {
  id: string
  projectId: string
  schemeId: string
  date: string
  location: string
  signRecords: SignRecord[]
  photos: BriefingPhoto[]
}

export interface SignRecord {
  id: string
  name: string
  trade: string
  idCard: string
  signature: string
  signedAt: string
}

export interface BriefingPhoto {
  id: string
  url: string
  description: string
}

export interface Feedback {
  id: string
  projectId: string
  schemeId: string
  description: string
  location: string
  photos: string[]
  status: '待处理' | '已处理'
  createdAt: string
  reporterRole: UserRole
  reporterName: string
  handlerComment?: string
  handlerTime?: string
}
