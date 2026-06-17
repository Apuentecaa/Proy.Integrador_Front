"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Users,
  Calendar,
  Plus,
  Search,
  X,
  Check,
  Heart,
  TrendingUp,
  Clock,
  FileText,
  ClipboardList,
  Stethoscope,
  Activity,
  User,
  PlusCircle,
  AlertCircle
} from "lucide-react"
import { useDocuments } from "@/contexts/documents-context"
import { useAppointments } from "@/contexts/appointments-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface DoctorPanelProps {
  onBack: () => void
}

const initialDoctorAppointments = [
  { id: "apt-1", patientName: "Juan Pérez", email: "paciente@smartsalud.com", time: "09:00 AM", status: "Confirmada", specialty: "Medicina General", age: "28 años", motive: "Chequeo anual y dolor de cabeza recurrente" },
  { id: "apt-d1", patientName: "Juan Pérez", email: "juan.perez@gmail.com", time: "10:30 AM", status: "Confirmada", specialty: "Medicina General", age: "45 años", motive: "Control de presión arterial alta" },
  { id: "apt-d2", patientName: "María Silva", email: "maria.silva@outlook.com", time: "11:45 AM", status: "Pendiente de Pago", specialty: "Medicina General", age: "32 años", motive: "Dolor estomacal e indigestión" },
  { id: "apt-d3", patientName: "Pedro Gómez", email: "pedro.gomez@yahoo.com", time: "02:00 PM", status: "Atendido", specialty: "Medicina General", age: "50 años", motive: "Revisión de resultados de perfil lipídico" }
]

export default function DoctorPanel({ onBack }: DoctorPanelProps) {
  const { addDocument, documents } = useDocuments()
  const { appointments, updateAppointment } = useAppointments()
  const [activeTab, setActiveTab] = useState<"consultations" | "patients" | "documents" | "stats">("consultations")
  const [doctorApts, setDoctorApts] = useState(initialDoctorAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  
  // States for attending patient
  const [attendingApt, setAttendingApt] = useState<typeof initialDoctorAppointments[0] | null>(null)
  const [diagnosis, setDiagnosis] = useState("")
  const [prescriptionText, setPrescriptionText] = useState("")
  const [labResultText, setLabResultText] = useState("")
  const [imagingText, setImagingText] = useState("")

  // Statistics
  const stats = {
    totalPatients: 24,
    consultationsToday: doctorApts.filter(a => a.status !== "Atendido").length,
    completedToday: doctorApts.filter(a => a.status === "Atendido").length,
    averageRating: "4.9",
  }

  const handleRegisterAttention = (apt: typeof initialDoctorAppointments[0]) => {
    setAttendingApt(apt)
    setDiagnosis("")
    setPrescriptionText("")
    setLabResultText("")
    setImagingText("")
  }

  const handleSaveAttention = () => {
    if (!diagnosis) {
      toast.warning("Falta Diagnóstico", {
        description: "Por favor, escribe un diagnóstico para guardar la consulta médica.",
      })
      return
    }

    // 1. Create prescription document if filled
    if (prescriptionText) {
      addDocument({
        patientId: attendingApt!.email,
        title: `Receta Médica - ${attendingApt!.specialty}`,
        type: "prescription",
        date: new Date().toISOString().split("T")[0],
        url: "#",
        createdBy: "Dr. Médico"
      })
    }

    // 2. Create lab result document if filled
    if (labResultText) {
      addDocument({
        patientId: attendingApt!.email,
        title: `Resultado de Laboratorio - ${labResultText}`,
        type: "lab_result",
        date: new Date().toISOString().split("T")[0],
        url: "#",
        createdBy: "Dr. Médico"
      })
    }

    // 3. Create imaging document if filled
    if (imagingText) {
      addDocument({
        patientId: attendingApt!.email,
        title: `Examen de Imagen - ${imagingText}`,
        type: "imaging",
        date: new Date().toISOString().split("T")[0],
        url: "#",
        createdBy: "Dr. Médico"
      })
    }

    // 4. Mark appointment as completed
    setDoctorApts(prev =>
      prev.map(a => (a.id === attendingApt!.id ? { ...a, status: "Atendido" } : a))
    )

    toast.success("¡Atención Médica Registrada!", {
      description: `Se han generado los documentos clínicos para ${attendingApt!.patientName}.`,
    })

    setAttendingApt(null)
  }

  const filteredApts = doctorApts.filter(a =>
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.motive.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const patientHistoryDocs = documents.filter(doc =>
    doc.patientId === "paciente@smartsalud.com" || doc.patientId === "user-1"
  )

  const tabs = [
    { id: "consultations", label: "Consultas del Día", icon: ClipboardList },
    { id: "patients", label: "Historial de Pacientes", icon: Users },
    { id: "stats", label: "Desempeño y Estadísticas", icon: Activity },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Portal del Médico</h1>
                  <p className="text-sm text-white/80">Dr. Médico • Consultorio Medicina General</p>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/25 px-4 py-2 rounded-xl text-sm font-medium">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
              Médico de Turno
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-gray-500">Pacientes Asignados</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
            <p className="text-sm text-emerald-600 mt-1">4 nuevos este mes</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500">Citas Pendientes</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.consultationsToday}</p>
            <p className="text-sm text-blue-600 mt-1">Próxima cita en 15 mins</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">Atendidos Hoy</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.completedToday}</p>
            <p className="text-sm text-green-600 mt-1">100% de efectividad</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-500">Valoración Media</p>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.averageRating} ★</p>
            <p className="text-sm text-yellow-600 mt-1">Calificación de pacientes</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg shadow-emerald-100"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Console view panels */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* CONSULTATIONS TAB */}
          {activeTab === "consultations" && (
            <div>
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Cola de Atención Médica</h3>
                  <p className="text-sm text-gray-500">Registra y administra las consultas clínicas de hoy</p>
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por paciente o motivo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredApts.map((apt) => (
                  <div key={apt.id} className="p-6 hover:bg-gray-50/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-bold text-gray-900 text-lg">{apt.patientName}</h4>
                          <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">{apt.age}</span>
                          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">{apt.time}</span>
                          
                          {apt.status === "Atendido" ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                              <Check className="w-3.5 h-3.5 mr-1" />
                              Atendido
                            </Badge>
                          ) : apt.status === "Confirmada" ? (
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                              Confirmada
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              {apt.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          <strong className="text-gray-900 font-semibold">Motivo de consulta: </strong> 
                          {apt.motive}
                        </p>
                        <p className="text-xs text-gray-400">
                          Correo electrónico: {apt.email} • {apt.specialty}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        {apt.status === "Atendido" ? (
                          <Button disabled variant="outline" className="border-gray-200 text-gray-400">
                            Atención Completada
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleRegisterAttention(apt)}
                            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold"
                          >
                            <Stethoscope className="w-4 h-4 mr-2" />
                            Atender Paciente
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CLINICAL HISTORY TAB */}
          {activeTab === "patients" && (
            <div className="p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Directorio Clínico y Archivos de Pacientes</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Como médico tratante, puedes ver, auditar e inspeccionar los documentos clínicos que tú u otros médicos de Smart Salud han cargado para los pacientes.
                </p>
              </div>

              {/* Patient directory search */}
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl mb-6 bg-gray-50/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg">
                  PD
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Juan Pérez</h4>
                  <p className="text-xs text-gray-500">paciente@smartsalud.com • DNI: 72123456 • 28 años</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Paciente Activo</Badge>
              </div>

              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Documentos Clínicos Registrados ({patientHistoryDocs.length})
              </h4>

              <div className="grid md:grid-cols-2 gap-4">
                {patientHistoryDocs.map((doc) => (
                  <div key={doc.id} className="p-5 border border-gray-100 rounded-2xl bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-900 truncate" title={doc.title}>{doc.title}</h5>
                        <p className="text-xs text-red-500 font-semibold uppercase tracking-wider mt-1">{doc.type.replace('_', ' ')}</p>
                        <p className="text-xs text-gray-400 mt-2">Cargado por: {doc.createdBy} • Fecha: {doc.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === "stats" && (
            <div className="p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-6">Métricas de Rendimiento Clínico</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Stethoscope className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-3xl text-gray-900">45 hrs</h4>
                  <p className="text-sm text-gray-500 mt-1">Horas de Consulta Realizadas</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-3xl text-gray-900">112</h4>
                  <p className="text-sm text-gray-500 mt-1">Pacientes Atendidos Históricos</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-3xl text-gray-900">98%</h4>
                  <p className="text-sm text-gray-500 mt-1">Aprobación y Recomendación</p>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 border border-gray-100 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Evolución de Consultas Médicas</h4>
                <div className="h-6 flex items-end gap-3 max-w-md mt-6">
                  <div className="flex-1 bg-gradient-to-t from-emerald-500 to-blue-500 rounded-t-lg" style={{ height: "40%" }} />
                  <div className="flex-1 bg-gradient-to-t from-emerald-500 to-blue-500 rounded-t-lg" style={{ height: "65%" }} />
                  <div className="flex-1 bg-gradient-to-t from-emerald-500 to-blue-500 rounded-t-lg" style={{ height: "85%" }} />
                  <div className="flex-1 bg-gradient-to-t from-emerald-500 to-blue-500 rounded-t-lg" style={{ height: "70%" }} />
                  <div className="flex-1 bg-gradient-to-t from-emerald-500 to-blue-500 rounded-t-lg" style={{ height: "95%" }} />
                </div>
                <div className="flex justify-between max-w-md text-xs text-gray-500 mt-2">
                  <span>Enero</span>
                  <span>Febrero</span>
                  <span>Marzo</span>
                  <span>Abril</span>
                  <span>Mayo (Actual)</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* REGISTER ATTENTION MODAL */}
      {attendingApt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Consola Clínica: Registro de Atención</h3>
                  <p className="text-xs text-gray-500">Paciente: {attendingApt.patientName} • {attendingApt.age}</p>
                </div>
              </div>
              <button
                onClick={() => setAttendingApt(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">1. Diagnóstico Clínico <span className="text-red-500">*</span></label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Ej: Faringitis aguda bacteriana. Paciente refiere dolor de garganta intenso..."
                  rows={3}
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  2. Generar Receta Médica (Opcional)
                </label>
                <textarea
                  value={prescriptionText}
                  onChange={(e) => setPrescriptionText(e.target.value)}
                  placeholder="Ej: Amoxicilina 500mg - 1 tableta cada 8 horas por 7 días..."
                  rows={2}
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-emerald-600" />
                    3. Solicitar Laboratorios
                  </label>
                  <input
                    type="text"
                    value={labResultText}
                    onChange={(e) => setLabResultText(e.target.value)}
                    placeholder="Ej: Hemograma Completo, Glucosa"
                    className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-emerald-600" />
                    4. Solicitar Examen Imagen
                  </label>
                  <input
                    type="text"
                    value={imagingText}
                    onChange={(e) => setImagingText(e.target.value)}
                    placeholder="Ej: Radiografía de Tórax"
                    className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 p-4 border border-emerald-100 rounded-2xl text-xs text-emerald-800 leading-relaxed">
                <strong>Nota de Integración:</strong> Al registrar esta atención, todas las recetas e indicaciones de laboratorio generadas se subirán al archivo digital del paciente en tiempo real, reflejándose en su panel personal al instante.
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setAttendingApt(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Descartar
                </button>
                <button
                  onClick={handleSaveAttention}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all font-semibold shadow-md"
                >
                  Confirmar y Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
