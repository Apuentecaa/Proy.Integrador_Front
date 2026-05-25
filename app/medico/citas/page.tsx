"use client"

import { useState, useEffect } from "react"
import {
  Search, Stethoscope, Clock, Check, X, PlusCircle, AlertCircle,
  Calendar, ClipboardList, Loader2, WifiOff
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useDocuments } from "@/contexts/documents-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { getCitasByMedico, type CitaMedico } from "@/lib/api/medico"
import { ApiError } from "@/lib/api/client"

// Fallback mock para cuando el backend no está disponible (modo demo)
const MOCK_CITAS: CitaMedico[] = [
  { id: 1, codigoReserva: "DEMO0001", fecha: format(new Date(), "yyyy-MM-dd"), hora: "09:00:00", duracionMin: 30, tipoConsulta: "PRIMERA_VEZ",  modalidad: "PRESENCIAL", estado: "CONFIRMADO", motivoConsulta: "Control de presión arterial", sede: "Sede Central", sala: "Consultorio 1", pacienteId: 1, pacienteNombres: "Juan",    pacienteApellidos: "Pérez García",   pacienteDni: "12345678", pacienteTelefono: "987654321", pacienteEmail: "juan.perez@email.com" },
  { id: 2, codigoReserva: "DEMO0002", fecha: format(new Date(), "yyyy-MM-dd"), hora: "09:30:00", duracionMin: 30, tipoConsulta: "SEGUIMIENTO", modalidad: "PRESENCIAL", estado: "RESERVADO",  motivoConsulta: "Revisión post-operatoria",   sede: "Sede Central", sala: "Consultorio 1", pacienteId: 2, pacienteNombres: "María",   pacienteApellidos: "López Sánchez",   pacienteDni: "87654321", pacienteTelefono: "976543210", pacienteEmail: "maria.lopez@email.com" },
  { id: 3, codigoReserva: "DEMO0003", fecha: format(new Date(), "yyyy-MM-dd"), hora: "10:00:00", duracionMin: 30, tipoConsulta: "PRIMERA_VEZ",  modalidad: "PRESENCIAL", estado: "RESERVADO",  motivoConsulta: "Dolor lumbar crónico",         sede: "Sede Central", sala: "Consultorio 1", pacienteId: 3, pacienteNombres: "Carlos",  pacienteApellidos: "Torres Ruiz",     pacienteDni: "45678912", pacienteTelefono: "965432109", pacienteEmail: "carlos.torres@email.com" },
  { id: 4, codigoReserva: "DEMO0004", fecha: format(new Date(), "yyyy-MM-dd"), hora: "11:00:00", duracionMin: 30, tipoConsulta: "SEGUIMIENTO", modalidad: "PRESENCIAL", estado: "ATENDIDO",   motivoConsulta: "Perfil lipídico — ajuste",     sede: "Sede Central", sala: "Consultorio 2", pacienteId: 5, pacienteNombres: "Roberto", pacienteApellidos: "Vásquez Lima",    pacienteDni: "56789012", pacienteTelefono: "932109876", pacienteEmail: "roberto.v@email.com" },
]

const estadoBadge: Record<string, string> = {
  RESERVADO:  "bg-blue-100 text-blue-700 border-blue-200",
  CONFIRMADO: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ATENDIDO:   "bg-green-100 text-green-700 border-green-200",
  CANCELADO:  "bg-red-100 text-red-600 border-red-200",
  NO_ASISTIO: "bg-gray-100 text-gray-500 border-gray-200",
}

const estadoLabel: Record<string, string> = {
  RESERVADO: "Reservada", CONFIRMADO: "Confirmada", ATENDIDO: "Atendido",
  CANCELADO: "Cancelada", NO_ASISTIO: "No asistió",
}

export default function CitasPage() {
  const { user } = useAuth()
  const { addDocument } = useDocuments()
  const [citas, setCitas] = useState<CitaMedico[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [search, setSearch] = useState("")
  const [attending, setAttending] = useState<CitaMedico | null>(null)
  const [diagnosis, setDiagnosis] = useState("")
  const [prescription, setPrescription] = useState("")
  const [labRequest, setLabRequest] = useState("")
  const [imagingRequest, setImagingRequest] = useState("")

  const today = format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })

  useEffect(() => {
    const medicoId = user?.medicoId
    if (!medicoId) {
      // Sin login real: solo mock
      setCitas(MOCK_CITAS)
      setUsingMock(true)
      setLoading(false)
      return
    }
    setLoading(true)
    getCitasByMedico(medicoId)
      // Mostramos primero las citas de hoy y futuras
      .then(data => {
        const todayStr = format(new Date(), "yyyy-MM-dd")
        const filtered = data.filter(c => c.fecha >= todayStr)
        setCitas(filtered.length > 0 ? filtered : data)
        setUsingMock(false)
      })
      .catch((err: ApiError) => {
        console.warn("Backend no disponible, usando mock:", err.message)
        setCitas(MOCK_CITAS)
        setUsingMock(true)
      })
      .finally(() => setLoading(false))
  }, [user?.medicoId])

  const stats = {
    total:     citas.length,
    pendientes: citas.filter(c => c.estado !== "ATENDIDO" && c.estado !== "CANCELADO").length,
    atendidos:  citas.filter(c => c.estado === "ATENDIDO").length,
  }

  const filtered = citas.filter(c =>
    `${c.pacienteNombres} ${c.pacienteApellidos}`.toLowerCase().includes(search.toLowerCase()) ||
    (c.motivoConsulta ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const openAttend = (cita: CitaMedico) => {
    setAttending(cita)
    setDiagnosis(""); setPrescription(""); setLabRequest(""); setImagingRequest("")
  }

  const saveAttention = () => {
    if (!diagnosis.trim()) {
      toast.warning("Diagnóstico requerido")
      return
    }
    const pacienteEmail = attending!.pacienteEmail
    const pacienteName  = `${attending!.pacienteNombres} ${attending!.pacienteApellidos}`
    if (prescription)   addDocument({ patientId: pacienteEmail, title: `Receta — ${pacienteName}`,  type: "prescription", date: new Date().toISOString().split("T")[0], url: "#", createdBy: user?.name ?? "Dr." })
    if (labRequest)     addDocument({ patientId: pacienteEmail, title: `Lab: ${labRequest}`,        type: "lab_result",   date: new Date().toISOString().split("T")[0], url: "#", createdBy: user?.name ?? "Dr." })
    if (imagingRequest) addDocument({ patientId: pacienteEmail, title: `Imagen: ${imagingRequest}`, type: "imaging",      date: new Date().toISOString().split("T")[0], url: "#", createdBy: user?.name ?? "Dr." })

    setCitas(prev => prev.map(c => c.id === attending!.id ? { ...c, estado: "ATENDIDO" } : c))
    toast.success("Atención registrada", { description: `Documentos generados para ${pacienteName}` })
    setAttending(null)
  }

  const formatHora = (h: string) => h.substring(0, 5)

  return (
    <div className="space-y-6">

      {usingMock && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-800">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>
            <strong>Modo demo:</strong> mostrando datos de muestra. Inicia sesión en{" "}
            <a href="/medico/login" className="underline font-semibold">/medico/login</a>{" "}
            con el backend corriendo para ver tus citas reales.
          </span>
        </div>
      )}

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
            {user?.name ?? "Médico"}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total",      value: stats.total,      icon: Calendar, color: "bg-blue-100 text-blue-600"     },
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

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="font-bold text-gray-900">Cola de Atención</h3>
            <p className="text-sm text-gray-500">Gestiona las consultas programadas</p>
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

        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-emerald-500 mb-3" />
            <p className="text-sm">Cargando citas...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>Sin citas registradas</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(cita => (
              <div key={cita.id} className="p-5 hover:bg-gray-50/40 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-gray-900">
                        {cita.pacienteNombres} {cita.pacienteApellidos}
                      </h4>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                        DNI {cita.pacienteDni}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                        {formatHora(cita.hora)}
                      </span>
                      <Badge className={`text-xs ${estadoBadge[cita.estado] ?? ""}`}>
                        {cita.estado === "ATENDIDO" && <Check className="w-3 h-3 mr-1" />}
                        {estadoLabel[cita.estado] ?? cita.estado}
                      </Badge>
                    </div>
                    {cita.motivoConsulta && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-800">Motivo: </span>{cita.motivoConsulta}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {cita.pacienteEmail} • {cita.tipoConsulta.replace(/_/g, " ")} • {cita.modalidad}
                      {cita.sede && ` • ${cita.sede}`}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {cita.estado === "ATENDIDO" ? (
                      <Button disabled variant="outline" size="sm" className="border-gray-200 text-gray-400">
                        Completado
                      </Button>
                    ) : cita.estado === "CANCELADO" || cita.estado === "NO_ASISTIO" ? (
                      <Button disabled variant="outline" size="sm" className="border-red-100 text-red-400">
                        {estadoLabel[cita.estado]}
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
        )}
      </div>

      {/* Modal de atención */}
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
                  <p className="text-xs text-gray-500">
                    {attending.pacienteNombres} {attending.pacienteApellidos} • {formatHora(attending.hora)}
                  </p>
                </div>
              </div>
              <button onClick={() => setAttending(null)} className="p-2 hover:bg-gray-100 rounded-xl">
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
                  placeholder="Ej: Hipertensión arterial estadio I..."
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
                    <PlusCircle className="w-4 h-4 text-emerald-600" /> Laboratorio
                  </label>
                  <input
                    type="text"
                    value={labRequest}
                    onChange={e => setLabRequest(e.target.value)}
                    placeholder="Hemograma, glucosa..."
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
                    placeholder="Rayos X tórax..."
                    className="w-full p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
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
