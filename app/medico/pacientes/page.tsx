"use client"

import { useState } from "react"
import {
  Search, Users, FileText, Calendar, ChevronRight, X,
  Phone, Mail, User, AlertCircle, ClipboardList
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDocuments } from "@/contexts/documents-context"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Paciente {
  id: string
  nombres: string
  apellidos: string
  dni: string
  email: string
  telefono: string
  fechaNacimiento: string
  sexo: "M" | "F"
  totalCitas: number
  ultimaCita: string
  estado: "Activo" | "Inactivo"
  observaciones?: string
}

const PACIENTES: Paciente[] = [
  { id: "p-1", nombres: "Juan",    apellidos: "Pérez García",    dni: "12345678", email: "juan.perez@email.com",    telefono: "987654321", fechaNacimiento: "1990-05-15", sexo: "M", totalCitas: 5,  ultimaCita: "2026-05-20", estado: "Activo",  observaciones: "Hipertensión arterial bajo control. Alérgico a la penicilina." },
  { id: "p-2", nombres: "María",   apellidos: "López Sánchez",   dni: "87654321", email: "maria.lopez@email.com",   telefono: "976543210", fechaNacimiento: "1985-08-22", sexo: "F", totalCitas: 8,  ultimaCita: "2026-05-18", estado: "Activo",  observaciones: "Post-operatoria de apendicectomía. Seguimiento mensual." },
  { id: "p-3", nombres: "Carlos",  apellidos: "Torres Ruiz",     dni: "45678912", email: "carlos.torres@email.com", telefono: "965432109", fechaNacimiento: "1995-03-10", sexo: "M", totalCitas: 3,  ultimaCita: "2026-05-15", estado: "Activo",  observaciones: "Lumbalgia crónica. Fisioterapia en curso." },
  { id: "p-4", nombres: "Ana",     apellidos: "Flores Huanca",   dni: "78901234", email: "ana.flores@email.com",    telefono: "943210987", fechaNacimiento: "1970-11-03", sexo: "F", totalCitas: 12, ultimaCita: "2026-04-30", estado: "Activo",  observaciones: "Diabetes tipo 2. Control de HbA1c cada 3 meses." },
  { id: "p-5", nombres: "Roberto", apellidos: "Vásquez Lima",    dni: "56789012", email: "roberto.v@email.com",     telefono: "932109876", fechaNacimiento: "1965-07-19", sexo: "M", totalCitas: 6,  ultimaCita: "2026-05-10", estado: "Activo",  observaciones: "Dislipidemia mixta. Estatinas. Control lipídico bimestral." },
  { id: "p-6", nombres: "Lucía",   apellidos: "Torres Meza",     dni: "11223344", email: "lucia.torres@email.com",  telefono: "921098765", fechaNacimiento: "2000-02-14", sexo: "F", totalCitas: 2,  ultimaCita: "2026-03-22", estado: "Activo",  observaciones: "Primera consulta por cefalea tensional." },
  { id: "p-7", nombres: "Diego",   apellidos: "Ríos Soto",       dni: "99887766", email: "diego.rios@email.com",    telefono: "910987654", fechaNacimiento: "1978-09-01", sexo: "M", totalCitas: 4,  ultimaCita: "2026-02-10", estado: "Inactivo" },
]

const TIPO_DOC: Record<string, string> = {
  prescription: "Receta",
  lab_result:   "Laboratorio",
  medical_report: "Informe",
  imaging:      "Imagen",
}

const DOC_COLOR: Record<string, string> = {
  prescription:   "bg-emerald-50 text-emerald-700",
  lab_result:     "bg-blue-50 text-blue-700",
  medical_report: "bg-purple-50 text-purple-700",
  imaging:        "bg-orange-50 text-orange-700",
}

export default function PacientesPage() {
  const { documents } = useDocuments()
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Paciente | null>(null)

  const filtered = PACIENTES.filter(p =>
    `${p.nombres} ${p.apellidos} ${p.dni}`.toLowerCase().includes(search.toLowerCase())
  )

  const calcEdad = (dob: string) => {
    const d = new Date(dob)
    const hoy = new Date()
    return hoy.getFullYear() - d.getFullYear()
  }

  const pacienteDocs = selected
    ? documents.filter(d => d.patientId === selected.email)
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Mis Pacientes</h1>
            <p className="text-sm text-white/80">{PACIENTES.length} pacientes registrados</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Lista de pacientes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o DNI..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm"
            />
          </div>

          <div className="space-y-2">
            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 shadow-sm">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Sin resultados</p>
              </div>
            )}
            {filtered.map(p => (
              <button
                key={p.id}
                onClick={() => setSelected(selected?.id === p.id ? null : p)}
                className={`w-full text-left bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all ${
                  selected?.id === p.id ? "border-emerald-400 ring-1 ring-emerald-200" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {p.nombres[0]}{p.apellidos[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm truncate">
                        {p.nombres} {p.apellidos}
                      </span>
                      {p.estado === "Inactivo" && (
                        <Badge className="bg-gray-100 text-gray-500 border-gray-200 text-xs shrink-0">Inactivo</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">DNI {p.dni} • {calcEdad(p.fechaNacimiento)} años</p>
                    <p className="text-xs text-emerald-600 mt-0.5">{p.totalCitas} citas</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${selected?.id === p.id ? "text-emerald-500 rotate-90" : "text-gray-300"}`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Panel de detalle */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 h-full flex flex-col items-center justify-center">
              <User className="w-14 h-14 mb-4 opacity-20" />
              <p className="font-medium">Selecciona un paciente</p>
              <p className="text-sm mt-1">para ver su información y historial</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Info del paciente */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white font-bold text-xl">
                      {selected.nombres[0]}{selected.apellidos[0]}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{selected.nombres} {selected.apellidos}</h2>
                      <p className="text-sm text-gray-500">
                        {calcEdad(selected.fechaNacimiento)} años • {selected.sexo === "M" ? "Masculino" : "Femenino"}
                      </p>
                      <Badge className={selected.estado === "Activo" ? "bg-emerald-100 text-emerald-700 border-emerald-200 mt-1" : "bg-gray-100 text-gray-500 mt-1"}>
                        {selected.estado}
                      </Badge>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  {[
                    { icon: User,     label: "DNI",        value: selected.dni        },
                    { icon: Mail,     label: "Email",      value: selected.email      },
                    { icon: Phone,    label: "Teléfono",   value: selected.telefono   },
                    { icon: Calendar, label: "Nacimiento", value: format(new Date(selected.fechaNacimiento), "d MMM yyyy", { locale: es }) },
                    { icon: ClipboardList, label: "Total citas", value: `${selected.totalCitas} consultas` },
                    { icon: Calendar, label: "Última cita", value: format(new Date(selected.ultimaCita), "d MMM yyyy", { locale: es }) },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                      <item.icon className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-gray-500 shrink-0">{item.label}:</span>
                      <span className="text-gray-800 font-medium truncate">{item.value}</span>
                    </div>
                  ))}
                </div>

                {selected.observaciones && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-xs font-semibold text-amber-700 mb-1">Observaciones clínicas</p>
                    <p className="text-sm text-amber-800">{selected.observaciones}</p>
                  </div>
                )}
              </div>

              {/* Documentos */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Documentos Clínicos ({pacienteDocs.length})
                </h3>

                {pacienteDocs.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 border border-dashed rounded-xl">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Sin documentos registrados</p>
                    <p className="text-xs mt-1">Los documentos aparecerán al atender al paciente</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pacienteDocs.map(doc => (
                      <div key={doc.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className={`p-2 rounded-lg shrink-0 ${DOC_COLOR[doc.type] ?? "bg-gray-100 text-gray-600"}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">{doc.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {TIPO_DOC[doc.type] ?? doc.type} • {doc.date} • {doc.createdBy}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
