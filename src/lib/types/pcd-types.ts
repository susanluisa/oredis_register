export interface DisabilityType {
  id: number
  type: string
  description: string
}

export interface PCDType {
  id: number
  name: string
  first_surname: string
  second_surname?: string | null
  document_number: string
  birth_date: string // formato ISO (ej. "2025-10-30")
  gender: string
  email?: string | null
  phone_number?: string | null
  conadis_card?: boolean | null
  nationality: number | null
  education_level: number | null
  socioeconomic_status: number | null
  occupation: number | null
  organizations: number[]
  office: number
  address: string
  district: number
  disability: number
  document_type: number
  created_at: string
  updated_at: string
}

export interface PCDExpandedType {
  id: number
  name: string
  disability: DisabilityType
}

// Caregiver - cuidador types

export interface RelatedPersonType {
  id: number
  first_name: string
  last_name: string
  middle_name?: string | null
  phone_number?: string | null
  document_number?: string | null
  document: number // id de DocumentIdType
  role: number // id de CaregiverRole
}

export interface PCDRelationshipType {
  id: number
  pcd: number // id de PCD
  related_person: number // id de RelatedPerson
  kinship: number
}

