 // questions - preguntas

export interface QuestionCategoryType {
  id: number
  name: string
  description?: string
}

export interface QuestionTypeType {
  id: number
  code: string
  description?: string
}

export interface QuestionType {
  id: number
  category: number // id de QuestionCategory
  type: number // id de QuestionType
  text: string
  is_required: boolean
}

export interface OptionType {
  id: number
  question: number // id de Question
  text: string
  allows_free_text: boolean
  disability?: number | null
  caregiver_role?: number | null
}

// survey - encuestas 

export interface SurveyPCDType {
  id: number  
  pcd: number // id de PCD
  survey_date: string // ISO datetime
  created_by: number // id de User
  district: number // id de Districts
}

export interface SurveyQuestionType {
  id: number
  survey: number // id de SurveyPCD
  question: number // id de Question
}

export interface AnswerType {
  id: number
  survey: number // id de SurveyPCD
  question: number // id de Question
  option?: number | null
  text_value?: string | null
  numeric_value?: number | null
  created_at: string // ISO datetime
}
