"use client"

import { useState } from "react"
import {
  Search, Stethoscope, Clock, Check, X, PlusCircle, AlertCircle,
  Calendar, Users, ClipboardList, Activity
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useDocuments } from "@/contexts/documents-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type EstadoCita = "Confirmada" | "Pendiente de Pago" | "Atendido" | "Reservada"

interface CitaItem {
  id: string
  patientName: string
  email: string
  time: string
  status: EstadoCita
  specialty: string
  age: string
  motive: string
}

const CITAS_HOY: CitaItem[] = [
  { id: "c-1", patientName: "Juan Pérez García",   email: "juan.perez@email.com",    time: "09:00", status: "Confirmada",        specialty: "Medicina General", age: "35 años", motive: "Control de presión arterial alta y cefalea recurrente" },
  { id: "c-2", patientName: "María López Sánchez",  email: "maria.lopez@email.com",   time: "09:30", status: "Confirmada",        specialty: "Medicina General", age: "42 años", motive: "Revisión post-operatoria y cambio de vendaje" },
  { id: "c-3", patientName: "Carlos Torres Ruiz",   email: "carlos.torres@email.com", time: "10:00", status: "Pendiente de Pago", specialty: "Medicina General", age: "28 años", motive: "Dolor lumbar crónico e inflamación articular" },
  { id: "c-4", patientName: "Ana Flores Huanca",    email: "ana.flores@email.com",    time: "10:30", status: "Reservada",         specialty: "Medicina General", age: "55 años", motive: "Chequeo general anual y solicitud de exámenes de laboratorio" },
  { id: "c-5", patientName: "Roberto Vásquez Lima", email: "roberto.v@email.com",     time: "11:00", status: "Atendido",          specialty: "Medicina General", age: "60 años", motive: "Resultados de perfil lipídico y ajuste de medicación" },
]

export default function CitasPage() {
  const { user } = useAuth()
  const { addDocument } = useDocuments()
  const [citas, setCitas] = useState<CitaItem[]>(CITAS_HOY)
  const [search, setSearch] = useState("")
  const [attending, setAttending] = useState<CitaItem | null>(null)
  const [diagnosis, setDiagnosis] = useState("")
  const [prescription, setPrescription] = useState("")
  const [labRequest, setLabRequest] = useState("")
  const [imagingRequest, setImagingRequest] = useState("")

  const today = format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })

  const stats = {
    total:     citas.length,
    pendientes: citas.filter(c => c.status !== "Atendido").length,
    atendidos:  citas.filter(c => c.status === "Atendido").length,
  }

  const filtered = citas.filter(c =>
    c.patientName.toLowerCase().includes(search.toLowerCase()) ||
    c.motive.toLowerCase().includes(search.toLowerCase())
  )

  const openAttend = (cita: CitaItem) => {
    setAttending(cita)
    setDiagnosis("")
    setPrescription("")
    setLabRequest("")
    setImagingRequest("")
  }

  const saveAttention = () => {
    if (!diagnosis.trim()) {
      toast.warning("Diagnóstico requerido", { description: "Escribe el diagnóstico antes de guardar." })
      return
    }
    if (prescription) addDocument({ patientId: attending!.email, title: `Receta — ${attending!.patientName}`, type: "prescription",  date: new Date().toISOString().split("T")[0], url: "#", createdBy: user?.name ?? "Dr." })
    if (labRequest)   addDocument({ patientId: attending!.email, title: `Lab: ${labRequest}`,                  type: "lab_result",    date: new Date().toISOString().split("T")[0], url: "#", createdBy: user?.name ?? "Dr." })
    if (imagingRequest) addDocument({ patientId: attending!.email, title: `Imagen: ${imagingRequest}`,         type: "imaging",       date: new Date().toISOString().split("T")[0], url: "#", createdBy: user?.name ?? "Dr." })

    setCitas(prev => prev.map(c => c.id === attending!.id ? { ...c, status: "Atendido" } : c))
    toast.success("Atención registrada", { description: `Documentos generados para ${attending!.patientName}.` })
    setAttending(null)
  }

  const badgeClass: Record<EstadoCita, string> = {
    "Confirmada":        "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Pendiente de Pago": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Atendido":          "bg-green-100 text-green-700 border-green-200",
    "Reservada":         "bg-blue-100 text-blue-700 border-blue-200",
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Citas del Día</h1>
              <p className="text-sm text-white/80 capitalize">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/25 px-4 py-2 rounded-xl text-sm font-medium">
            <span className="w-2.5 h-2.5 bg-emerald-300 rounded-full animate-pulse" />
            Médico de Turno
          </div>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total",      value: stats.total,     icon: Calendar, color: "bg-blue-100 text-blue-600"    },
          { label: "Pendientes", value: stats.pendientes, icon: Clock,    color: "bg-yellow-100 text-yellow-600" },
          { label: "Atendidos",  value: stats.atendidos,  icon: Check,    color: "bg-green-100 text-green-600"   },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lista de citas */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="font-bold text-gray-900">Cola de Atención</h3>
            <p className="text-sm text-gray-500">Gestiona las consultas programadas para hoy</p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar paciente o motivo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No se encontraron citas</p>
            </div>
          )}
          {filtered.map(cita => (
            <div key={cita.id} className="p-5 hover:bg-gray-50/40 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-gray-900">{cita.patientName}</h4>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{cita.age}</span>
                    <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium">{cita.time}</span>
                    <Badge className={`text-xs ${badgeClass[cita.status]}`}>
                      {cita.status === "Atendido" && <Check className="w-3 h-3 mr-1" />}
                      {cita.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">Motivo: </span>{cita.motive}
                  </p>
                  <p className="text-xs text-gray-400">{cita.email} • {cita.specialty}</p>
                </div>
                <div className="shrink-0">
                  {cita.status === "Atendido" ? (
                    <Button disabled variant="outline" size="sm" className="border-gray-200 text-gray-400">
                      Completado
                    </Button>
                  ) : (
                    <Button
                      onClick={() => openAttend(cita)}
                      size="sm"
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold"
                    >
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Atender
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal atención */}
      {attending && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-5 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Registro de Atención</h3>
                  <p className="text-xs text-gray-500">{attending.patientName} • {attending.age} • {attending.time}</p>
                </div>
              </div>
              <button onClick={() => setAttending(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Diagnóstico Clínico <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="Ej: Hipertensión arterial estadio I. Paciente con presión 145/95 mmHg..."
                  rows={3}
                  className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-emerald-600" /> Receta Médica
                </label>
                <textarea
                  value={prescription}
                  onChange={e => setPrescription(e.target.value)}
                  placeholder="Ej: Enalapril 10mg — 1 tableta c/12h por 30 días..."
                  rows={2}
                  className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-emerald-600" /> Solicitar Laboratorio
                  </label>
                  <input
                    type="text"
                    value={labRequest}
                    onChange={e => setLabRequest(e.target.value)}
                    placeholder="Ej: Hemograma, glucosa, perfil lipídico"
                    className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-emerald-600" /> Examen de Imagen
                  </label>
                  <input
                    type="text"
                    value={imagingRequest}
                    onChange={e => setImagingRequest(e.target.value)}
                    placeholder="Ej: Radiografía de tórax PA y lateral"
                    className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800">
                Los documentos generados se cargarán automáticamente al historial del paciente.
              </div>

              <div className="flex gap-3 pt-2 border-t">
                <button
                  onClick={() => setAttending(null)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveAttention}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 font-semibold text-sm shadow-md"
                >
                  Guardar Atención
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
