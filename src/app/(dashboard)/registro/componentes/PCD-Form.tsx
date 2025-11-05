"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { Combobox } from "@/components/custom/Combobox"
import { useCountries } from "@/hooks/use-countries"
import { useDocumentTypes } from "@/hooks/use-document-types"
import { useDistricts } from "@/hooks/use-districts"
import { useDisabilities } from "@/hooks/use-disabilities"
import { useEducationLevels } from "@/hooks/use-education-levels"
import { useSocioeconomicStatuses } from "@/hooks/use-socioeconomic-status"
import { useOccupations } from "@/hooks/use-occupations"
import { useOffices } from "@/hooks/use-offices"
import { useOrganizations } from "@/hooks/use-organizations"
import { MultiSelect } from "@/components/custom/MultiSelect"
import { createPCDRecords } from "@/app/(dashboard)/registro/services/pcd_register"

type PCDFormValues = {
  name: string
  first_surname: string
  second_surname?: string
  document_number: string
  birth_date: string
  gender: string
  email?: string
  phone_number?: string
  conadis_card?: boolean
  address: string
  education_level?: string
  socioeconomic_status?: string
  occupation?: string
  office?: string
  organizations?: string // IDs separados por coma
}

export default function CreatePCDPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PCDFormValues>({
    defaultValues: {
      name: "",
      first_surname: "",
      second_surname: "",
      document_number: "",
      birth_date: "",
      gender: "",
      email: "",
      phone_number: "",
      conadis_card: false,
      address: "",
      education_level: "",
      socioeconomic_status: "",
      occupation: "",
      office: "",
      organizations: "",
    },
  })

  const [responseMessage, setResponseMessage] = useState("")
  // Catálogos comunes
  const { data: countries = [], isLoading: loadingCountries } = useCountries()
  const { data: docs = [], isLoading: loadingDocs } = useDocumentTypes()
  const { data: districts = [], isLoading: loadingDistricts } = useDistricts()
  const { data: disabilities = [], isLoading: loadingDisabilities } = useDisabilities()
  const { data: educationLevels = [], isLoading: loadingEducation } = useEducationLevels()
  const { data: socioeconomicStatuses = [], isLoading: loadingSocio } = useSocioeconomicStatuses()
  const { data: occupations = [], isLoading: loadingOccupations } = useOccupations()
  const { data: offices = [], isLoading: loadingOffices } = useOffices()
  const { data: orgs = [], isLoading: loadingOrgs } = useOrganizations()

  // Selecciones
  const [selectedDocType, setSelectedDocType] = useState<number | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null)
  const [selectedDisability, setSelectedDisability] = useState<number | null>(null)
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<number | null>(null)
  const [selectedSocioeconomic, setSelectedSocioeconomic] = useState<number | null>(null)
  const [selectedOccupation, setSelectedOccupation] = useState<number | null>(null)
  const [selectedOffice, setSelectedOffice] = useState<number | null>(null)
  const [selectedOrganizations, setSelectedOrganizations] = useState<number[]>([])

  const countryOptions = useMemo(
    () => countries.map((c) => ({ value: c.id, label: c.name })),
    [countries]
  )
  const documentTypeOptions = useMemo(
    () => docs.map((d) => ({ value: d.id, label: `${d.acronym ? ` ${d.acronym}` : ""}` })),
    [docs]
  )
  const districtOptions = useMemo(
    () => districts.map((d) => ({ value: d.id, label: d.name })),
    [districts]
  )
  const disabilityOptions = useMemo(
    () => disabilities.map((d) => ({ value: d.id, label: d.type })),
    [disabilities]
  )
  const educationLevelOptions = useMemo(
    () => educationLevels.map((e) => ({ value: e.id, label: e.name })),
    [educationLevels]
  )
  const socioeconomicOptions = useMemo(
    () => socioeconomicStatuses.map((s) => ({ value: s.id, label: s.name })),
    [socioeconomicStatuses]
  )
  const occupationOptions = useMemo(
    () => occupations.map((o) => ({ value: o.id, label: o.name })),
    [occupations]
  )
  const officeOptions = useMemo(
    () => offices.map((o) => ({ value: o.id, label: o.name })),
    [offices]
  )
  const organizationOptions = useMemo(
    () => orgs.map((o) => ({ value: o.id, label: o.association_name })),
    [orgs]
  )

  const onSubmit = async (data: PCDFormValues) => {
    try {
      if (!selectedDocType || !selectedDistrict || !selectedDisability || !selectedOffice) {
        setResponseMessage("Selecciona tipo de documento, distrito, discapacidad y oficina")
        return
      }
      const payload = {
        name: data.name,
        first_surname: data.first_surname,
        second_surname: data.second_surname || null,
        document_number: data.document_number,
        birth_date: data.birth_date,
        gender: data.gender,
        email: data.email || null,
        phone_number: data.phone_number || null,
        conadis_card: !!data.conadis_card,
        nationality: selectedCountry ?? null,
        education_level: selectedEducationLevel ?? (data.education_level ? Number(data.education_level) : null),
        socioeconomic_status: selectedSocioeconomic ?? (data.socioeconomic_status ? Number(data.socioeconomic_status) : null),
        occupation: selectedOccupation ?? (data.occupation ? Number(data.occupation) : null),
        organizations: selectedOrganizations,
        office: selectedOffice ?? (data.office ? Number(data.office) : null),
        address: data.address,
        document_type: selectedDocType,
        district: selectedDistrict,
        disability: selectedDisability,
      }
      const created = await createPCDRecords(payload as any)
      if (!created?.id) throw new Error("Error al crear registro")
      setResponseMessage("PCD registrado correctamente")
      reset()
      setSelectedDocType(null)
      setSelectedCountry(null)
      setSelectedDistrict(null)
      setSelectedDisability(null)
      setSelectedEducationLevel(null)
      setSelectedSocioeconomic(null)
      setSelectedOccupation(null)
      setSelectedOffice(null)
      setSelectedOrganizations([])
    } catch (error) {
      setResponseMessage("Ocurrió un error al guardar")
    }
  }

  return (
    <div className="p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 rounded-2xl h-full overflow-y-auto p-3 bg-background/50"
      >
        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Nombre</label>
          <Input {...register("name", { required: true })} placeholder="Ej: Juan" />
          {errors.name && <span className="text-xs text-red-500">Campo requerido</span>}
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Carné CONADIS</label>
          <input type="checkbox" {...register("conadis_card")} className="size-4" />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Nivel educativo</label>
          <Combobox
            options={educationLevelOptions}
            value={selectedEducationLevel}
            onChange={(val) => setSelectedEducationLevel(val as number | null)}
            placeholder="Selecciona nivel educativo..."
            loading={loadingEducation}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Situación socioeconómica</label>
          <Combobox
            options={socioeconomicOptions}
            value={selectedSocioeconomic}
            onChange={(val) => setSelectedSocioeconomic(val as number | null)}
            placeholder="Selecciona situación socioeconómica..."
            loading={loadingSocio}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Ocupación</label>
          <Combobox
            options={occupationOptions}
            value={selectedOccupation}
            onChange={(val) => setSelectedOccupation(val as number | null)}
            placeholder="Selecciona ocupación..."
            loading={loadingOccupations}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Primer Apellido</label>
          <Input {...register("first_surname", { required: true })} />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Oficina</label>
          <Combobox
            value={selectedOffice}
            options={officeOptions}
            onChange={(val) => setSelectedOffice(val as number | null)}
            placeholder="Selecciona oficina..."
            loading={loadingOffices}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Segundo Apellido</label>
          <Input {...register("second_surname")} />
        </div>

        <div className="grid gap-1 col-span-2">
          <label className="text-xs text-muted-foreground">Organizaciones</label>
          <MultiSelect
            options={organizationOptions}
            values={selectedOrganizations}
            onChange={(vals) => setSelectedOrganizations(vals.map(v => typeof v === 'number' ? v : Number(v)).filter(v => !Number.isNaN(v)))}
            placeholder="Selecciona una o más organizaciones..."
            loading={loadingOrgs}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Documento</label>
          <Input {...register("document_number", { required: true })} />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Tipo documento</label>
          <Combobox
            options={documentTypeOptions}
            value={selectedDocType}
            onChange={(val) => setSelectedDocType(val as number | null)}
            placeholder="Selecciona tipo de documento..."
            loading={loadingDocs}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Nacimiento</label>
          <Input type="date" {...register("birth_date", { required: true })} />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Género</label>
          <Input {...register("gender", { required: true })} />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Nacionalidad</label>
          <Combobox
            options={countryOptions}
            value={selectedCountry}
            onChange={(val) => setSelectedCountry(val as number | null)}
            placeholder="Selecciona nacionalidad..."
            loading={loadingCountries}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Email</label>
          <Input type="email" {...register("email")} />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Celular</label>
          <Input {...register("phone_number")} />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Dirección</label>
          <Input {...register("address", { required: true })} />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Distrito</label>
          <Combobox
            options={districtOptions}
            value={selectedDistrict}
            onChange={(val) => setSelectedDistrict(val as number | null)}
            placeholder="Selecciona un distrito..."
            loading={loadingDistricts}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs text-muted-foreground">Discapacidad</label>
          <Combobox
            options={disabilityOptions}
            value={selectedDisability}
            onChange={(val) => setSelectedDisability(val as number | null)}
            placeholder="Selecciona una discapacidad..."
            loading={loadingDisabilities}
          />
        </div>

        <div className="col-span-2 flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Limpiar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>

      {responseMessage && (
        <p className="text-sm mt-4 text-center">{responseMessage}</p>
      )}
    </div>
  )
}
