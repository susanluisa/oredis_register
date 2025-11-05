export interface GeneratedReportType {
  id: number
  report_type: "PCD_SUMMARY" | "SURVEY_STATS" | "ORGANIZATION_LIST"
  file_format: "PDF" | "XLSX" | "CSV"
  file?: string | null // URL o ruta del archivo en el backend
  generated_at: string // ISO datetime
  generated_by?: number | null // id de User
  filters_used?: Record<string, any> | null
  preview_url?: string | null
}
