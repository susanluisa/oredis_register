export type RegisterRecord = {
  id: number
  first_name: string
  last_name: string
  middle_name: string | null
  document_type: string
  document_number: string
  birth_date: string
  gender: string
  nationality: string
  email: string
  phone_number: string
}

export type CreateRegisterPayload = Omit<RegisterRecord, "id">

const REGISTER_PATH = "/api/pcd/"

const fallbackData: RegisterRecord[] = [
  {
    id: 1,
    first_name: "juan",
    last_name: "qwqwqwq",
    middle_name: "qwqwqwq",
    document_type: "DNI",
    document_number: "12121212",
    birth_date: "2025-10-05",
    gender: "femenino",
    nationality: "peru",
    email: "mymail@mail.com",
    phone_number: "33433443",
  },
]

function buildUrl(pathname: string, baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL) {
  if (!baseUrl) {
    return null
  }

  const normalizedBase = baseUrl.replace(/\/$/, "")
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`

  return `${normalizedBase}${normalizedPath}`
}

export async function fetchRegisterRecords(
  init?: RequestInit,
): Promise<RegisterRecord[]> {
  const url = buildUrl(REGISTER_PATH)

  if (!url) {
    return fallbackData
  }

  try {
    const response = await fetch(url, {
      cache: "no-store",
      ...init,
    })

    if (!response.ok) {
      throw new Error(`Unexpected response ${response.status}`)
    }

    const payload = await response.json()

    if (Array.isArray(payload)) {
      return payload as RegisterRecord[]
    }

    return fallbackData
  } catch (error) {
    console.error("Failed to load register records", error)
    return fallbackData
  }
}

function normalizeHeaders(headersInit?: HeadersInit) {
  const headers: Record<string, string> = {}

  if (!headersInit) {
    return headers
  }

  if (headersInit instanceof Headers) {
    headersInit.forEach((value, key) => {
      headers[key] = value
    })
    return headers
  }

  if (Array.isArray(headersInit)) {
    headersInit.forEach(([key, value]) => {
      headers[key] = value
    })
    return headers
  }

  return { ...headersInit }
}

export async function createRegisterRecord(
  payload: CreateRegisterPayload,
  init?: RequestInit,
): Promise<RegisterRecord> {
  const url = buildUrl(REGISTER_PATH)
  if (!url) {
    throw new Error("Error al crear.")
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...normalizeHeaders(init?.headers),
  }

  try {
    const response = await fetch(url, {
      // cache: "no-store",
      // ...init,
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || `Unexpected response ${response.status}`)
    }

    const created = (await response.json()) as RegisterRecord
    return created
  } catch (error) {
    console.error("Failed to create register record", error)
    throw error
  }
}

export const registerFallback = fallbackData
