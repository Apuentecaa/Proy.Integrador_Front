"use client"

import { useState, useEffect } from "react"
import {
  Search, Users, FileText, Calendar, ChevronRight, X, Phone, Mail, User,
  AlertCircle, ClipboardList, Loader2, WifiOff
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useDocuments } from "@/contexts/documents-context"
import { getPacientesByMedico, type PacienteMedico } from "@/lib/api/medico"
import { ApiError } from "@/lib/api/client"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const MOCK_PACIENTES: PacienteMedico[] = [
  { id: 1, nombres: "Juan",    apellidos: "Pérez García",  dni: "12345678", email: "juan.perez@email.com",    telefono: "987654321", fechaNacimiento: "1990-05-15", sexo: "M", totalCitas: 5,  ultimaCita: "2026-05-20" },
  { id: 2, nombres: "María",   apellidos: "López Sánchez", dni: "87654321", email: "maria.lopez@email.com",   telefono: "976543210", fechaNacimiento: "1985-08-22", sexo: "F", totalCitas: 8,  ultimaCita: "2026-05-18" },
  { id: 3, nombres: "Carlos",  apellidos: "Torres Ruiz",   dni: "45678912", email: "carlos.torres@email.com", telefono: "965432109", fechaNacimiento: "1995-03-10", sexo: "M", totalCitas: 3,  ultimaCita: "2026-05-15" },
]

const TIPO_DOC: Record<string, string> = {
  prescription: "Receta", lab_result: "Laboratorio", medical_report: "Informe", imaging: "Imagen",
}
const DOC_COLOR: Record<string, string> = {
  prescription: "bg-emerald-50 text-emerald-700",
  lab_result:   "bg-blue-50 text-blue-700",
  medical_report: "bg-purple-50 text-purple-700",
  imaging:      "bg-orange-50 text-orange-700",
}

export default function PacientesPage() {
  const { user } = useAuth()
  const { documents } = useDocuments()
  const [pacientes, setPacientes] = useState<PacienteMedico[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<PacienteMedico | null>(null)

  useEffect(() => {
    const medicoId = user?.medicoId
    if (!medicoId) {
      setPacientes(MOCK_PACIENTES)
      setUsingMock(true)
      setLoading(false)
      return
    }
    setLoading(true)
    getPacientesByMedico(medicoId)
      .then(data => { setPacientes(data); setUsingMock(false) })
      .catch((err: ApiError) => {
        console.warn("Backend no disponible, usando mock:", err.message)
        setPacientes(MOCK_PACIENTES)
        setUsingMock(true)
      })
      .finally(() => setLoading(false))
  }, [user?.medicoId])

  const filtered = pacientes.filter(p =>
    `${p.nombres} ${p.apellidos} ${p.dni}`.toLowerCase().includes(search.toLowerCase())
  )

  const calcEdad = (dob: string | null) => {
    if (!dob) return "—"
    const d = new Date(dob)
    return `${new Date().getFullYear() - d.getFullYear()} años`
  }

  const pacienteDocs = selected ? documents.filter(d => d.patientId === selected.email) : []

  return (
    <div className="space-y-6">

      {usingMock && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-800">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span><strong>Sin conexión al servidor:</strong> pacientes de referencia. Inicia sesión en <a href="/medico/login" className="underline font-semibold">/medico/login</a>.</span>
        </div>
      )}

      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Mis Pacientes</h1>
            <p className="text-sm text-white/80">{pacientes.length} pacientes atendidos</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Lista */}
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
            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 shadow-sm">
                <Loader2 className="w-6 h-6 mx-auto animate-spin text-emerald-500 mb-2" />
                <p className="text-sm">Cargando...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 shadow-sm">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Sin resultados</p>
              </div>
            ) : (
              filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelected(selected?.id === p.id ? null : p)}
                  className={`w-full text-left bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all ${
                    selected?.id === p.id ? "border-emerald-400 ring-1 ring-emerald-200" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {p.nombres[0]}{p.apellidos[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-gray-900 text-sm truncate block">
                        {p.nombres} {p.apellidos}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">DNI {p.dni} • {calcEdad(p.fechaNacimiento)}</p>
                      <p className="text-xs text-emerald-600 mt-0.5">{p.totalCitas} cita{p.totalCitas === 1 ? "" : "s"}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                      selected?.id === p.id ? "text-emerald-500 rotate-90" : "text-gray-300"
                    }`} />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detalle */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 h-full flex flex-col items-center justify-center">
              <User className="w-14 h-14 mb-4 opacity-20" />
              <p className="font-medium">Selecciona un paciente</p>
              <p className="text-sm mt-1">para ver su información y documentos</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white font-bold text-xl">
                      {selected.nombres[0]}{selected.apellidos[0]}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {selected.nombres} {selected.apellidos}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {calcEdad(selected.fechaNacimiento)} • {selected.sexo === "M" ? "Masculino" : selected.sexo === "F" ? "Femenino" : "—"}
                      </p>
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mt-1">
                        {selected.totalCitas} consulta{selected.totalCitas === 1 ? "" : "s"}
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
                    { icon: Phone,    label: "Teléfono",   value: selected.telefono ?? "—" },
                    { icon: Calendar, label: "Nacimiento", value: selected.fechaNacimiento
                        ? format(new Date(selected.fechaNacimiento), "d MMM yyyy", { locale: es })
                        : "—" },
                    { icon: ClipboardList, label: "Total citas",  value: `${selected.totalCitas}` },
                    { icon: Calendar, label: "Última cita", value: selected.ultimaCita
                        ? format(new Date(selected.ultimaCita), "d MMM yyyy", { locale: es })
                        : "—" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                      <item.icon className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-gray-500 shrink-0">{item.label}:</span>
                      <span className="text-gray-800 font-medium truncate">{item.value}</span>
                    </div>
                  ))}
                </div>
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
                    <p className="text-xs mt-1">Los documentos se generan al atender al paciente</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pacienteDocs.map(doc => (
                      <div key={doc.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50">
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
