export enum UserRole {
  ADMIN = 'ADMIN',
  PROPOSAL_SUBMITTER = 'PROPOSAL_SUBMITTER',
  PROPOSAL_REVIEWER = 'PROPOSAL_REVIEWER',
}

export enum ProgramCategory {
  PENELITIAN = 'PENELITIAN',
  PENGABDIAN = 'PENGABDIAN',
}

export enum FocusType {
  TEMATIK = 'TEMATIK',
  RIRN = 'RIRN',
}

export enum ScopeLevel {
  LOKAL = 'LOKAL',
  REGIONAL = 'REGIONAL',
  NASIONAL = 'NASIONAL',
  INTERNASIONAL = 'INTERNASIONAL',
}

export enum ProposalStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ProposalInputMode {
  EDITOR = 'EDITOR',
  UPLOAD = 'UPLOAD',
}

export interface Proposal {
  id: string
  ownerId: string
  title: string
  category: ProgramCategory
  focusType: FocusType
  focusValue: string
  schemeGroup: string
  scopeLevel: ScopeLevel
  firstProposalYear: number
  durationMonths: number
  scientificFieldLevel1: string
  scientificFieldLevel2: string
  scientificFieldLevel3: string
  leadName: string
  status: ProposalStatus
  inputMode: ProposalInputMode
  editorContent?: string | null
  fileUrl?: string | null
  fileName?: string | null
  fileMimeType?: string | null
  fileSize?: number | null
  createdAt?: string
  updatedAt?: string
}