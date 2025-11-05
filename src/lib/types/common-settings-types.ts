export interface CountryType {
  id: number
  name: string
  code: string
}

export interface RegionType {
  id: number
  name: string
  code: string
  country: number
}

export interface ProvinceType {
  id: number
  name: string
  code: string
  region: number
}

export interface DistrictType {
  id: number
  name: string
  code: string
  province: number
}

export interface DocumentIdType {
  id: number
  document: string
  acronym: string
}

export interface CaregiverRoleType {
  id: number
  name: string
  description?: string | null
}

export interface KinshipType {
  id: number;
  name: string;
  description?: string | null;
  role: number;
}

// Education level, socioeconomic status and occupation

export interface EducationLevelType {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
}

export interface SocioeconomicStatusType {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  order: number;
  created_at: string;
}

export interface OccupationType {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
}

// tipos expandidos

export interface CountryExpanded {
  id: number
  name: string
  code: string
}

export interface RegionExpanded {
  id: number
  name: string
  code: string
  country: CountryExpanded
}

export interface ProvinceExpanded {
  id: number
  name: string
  code: string
  region: RegionExpanded
}

export interface DistrictExpanded {
  id: number
  name: string
  code: string
  province: ProvinceExpanded
}

export interface DocumentIdTypeExpanded {
  id: number
  name: string
}


export interface CaregiverRoleTypeExpanded {
  id: number
  name: string
  description?: string | null
}

export interface KinshipTypeExpanded {
  id: number;
  name: string;
  description?: string | null;
  role: CaregiverRoleTypeExpanded;
}

export interface EducationLevelExpanded {
  id: number;
  name: string;
}

export interface SocioeconomicStatusExpanded {
  id: number;
  name: string;
}

export interface OccupationExpanded {
  id: number;
  name: string;
}

export interface Kinship {
  id: number
  name: string
  description?: string | null
  role: number
  created_at: string
}

export interface EducationLevel {
  id: number
  code: string
  name: string
  description?: string | null
  order: number
  is_active: boolean
  created_at: string
}

export interface SocioeconomicStatus {
  id: number
  code: string
  name: string
  description?: string | null
  is_active: boolean
  order: number
  created_at: string
}

export interface Occupation {
  id: number
  code: string
  name: string
  description?: string | null
  order: number
  is_active: boolean
  created_at: string
}
