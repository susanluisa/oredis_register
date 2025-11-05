
export interface OrganizationType {
  id: number
  association_name: string
  legal_representative_name: string
  legal_representative_lastname: string
  district: number // id de Districts
  position: string
  associated_quantity: number
  disability: number // id de Disability
  phone_number: string
  address: string
  email: string
  created_at: string // ISO datetime
}

export interface OrganizationMemberType {
  id: number
  organization: number 
  pcd: number
  role: string
  join_date: string
  is_active: boolean
}
