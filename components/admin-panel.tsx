"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Check,
  Heart,
  TrendingUp,
  Clock
} from "lucide-react"

interface AdminPanelProps {
  onBack: () => void
}

const initialDoctors = [
  { id: 1, name: "Dr. Carlos Mendoza", specialty: "Cardiologia", sede: "San Isidro", status: "Activo" },
  { id: 2, name: "Dra. Maria Garcia", specialty: "Cardiologia", sede: "Miraflores", status: "Activo" },
  { id: 3, name: "Dr. Jose Rodriguez", specialty: "Neurologia", sede: "San Isidro", status: "Activo" },
  { id: 4, name: "Dra. Ana Lopez", specialty: "Oftalmologia", sede: "Surco", status: "Inactivo" },
  { id: 5, name: "Dr. Luis Torres", specialty: "Traumatologia", sede: "San Isidro", status: "Activo" },
]

const initialAppointments = [
  { id: 1, patient: "Juan Perez", doctor: "Dr. Carlos Mendoza", date: "2026-04-22", time: "09:00", status: "Confirmada" },
  { id: 2, patient: "Maria Silva", doctor: "Dra. Maria Garcia", date: "2026-04-22", time: "10:30", status: "Pendiente" },
  { id: 3, patient: "Pedro Gomez", doctor: "Dr. Jose Rodriguez", date: "2026-04-23", time: "11:00", status: "Confirmada" },
  { id: 4, patient: "Ana Torres", doctor: "Dra. Ana Lopez", date: "2026-04-23", time: "14:00", status: "Cancelada" },
  { id: 5, patient: "Luis Martin", doctor: "Dr. Luis Torres", date: "2026-04-24", time: "08:30", status: "Confirmada" },
]

const specialties = [
  "Cardiologia", "Neurologia", "Oftalmologia", "Traumatologia",
  "Pediatria", "Medicina General", "Medicina Interna", "Dermatologia"
]

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"doctors" | "appointments" | "reports" | "settings">("doctors")
  const [doctors, setDoctors] = useState<typeof initialDoctors>([])
  const [appointments, setAppointments] = useState<typeof initialAppointments>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<typeof initialDoctors[0] | null>(null)
  const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "", sede: "San Isidro", status: "Activo" })

  // Efecto para cargar los datos iniciales desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // TODO: Reemplazar con tus llamadas a la API reales
        // const resDoctors = await fetch('/api/doctors')
        // const dataDoctors = await resDoctors.json()
        // const resAppointments = await fetch('/api/appointments')
        // const dataAppointments = await resAppointments.json()
        
        // setDoctors(dataDoctors)
        // setAppointments(dataAppointments)

        // Mock temporal simulando una petición de red
        setDoctors(initialDoctors)
        setAppointments(initialAppointments)
      } catch (error) {
        console.error("Error al cargar los datos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredDoctors = doctors.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredAppointments = appointments.filter(a =>
    a.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddDoctor = async () => {
    if (newDoctor.name && newDoctor.specialty) {
      try {
        // TODO: Llamada a la API para crear medico
        // const res = await fetch('/api/doctors', { method: 'POST', body: JSON.stringify(newDoctor) })
        // const createdDoctor = await res.json()
        // setDoctors([...doctors, createdDoctor])
        
        setDoctors([...doctors, { ...newDoctor, id: doctors.length + 1 }])
        setNewDoctor({ name: "", specialty: "", sede: "San Isidro", status: "Activo" })
        setShowAddDoctor(false)
      } catch (error) {
        console.error("Error al agregar medico:", error)
      }
    }
  }

  const handleEditDoctor = async () => {
    if (editingDoctor) {
      try {
        // TODO: Llamada a la API para actualizar medico
        // await fetch(`/api/doctors/${editingDoctor.id}`, { method: 'PUT', body: JSON.stringify(editingDoctor) })
        
        setDoctors(doctors.map(d => d.id === editingDoctor.id ? editingDoctor : d))
        setEditingDoctor(null)
      } catch (error) {
        console.error("Error al actualizar medico:", error)
      }
    }
  }

  const handleDeleteDoctor = async (id: number) => {
    if (confirm("Estas seguro de eliminar este medico?")) {
      try {
        // TODO: Llamada a la API para eliminar medico
        // await fetch(`/api/doctors/${id}`, { method: 'DELETE' })
        
        setDoctors(doctors.filter(d => d.id !== id))
      } catch (error) {
        console.error("Error al eliminar medico:", error)
      }
    }
  }

  const handleUpdateAppointmentStatus = async (id: number, status: string) => {
    try {
        // TODO: Llamada a la API para actualizar estado de la cita
        // await fetch(`/api/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
        
        setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a))
    } catch (error) {
        console.error("Error al actualizar estado de la cita:", error)
    }
  }

  const stats = {
    totalDoctors: doctors.length,
    activeDoctors: doctors.filter(d => d.status === "Activo").length,
    totalAppointments: appointments.length,
    confirmedAppointments: appointments.filter(a => a.status === "Confirmada").length,
    pendingAppointments: appointments.filter(a => a.status === "Pendiente").length,
    canceledAppointments: appointments.filter(a => a.status === "Cancelada").length,
  }

  const tabs = [
    { id: "doctors", label: "Medicos", icon: Users },
    { id: "appointments", label: "Citas", icon: Calendar },
    { id: "reports", label: "Reportes", icon: BarChart3 },
    { id: "settings", label: "Configuracion", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Panel de Administracion</h1>
                <p className="text-sm text-white/80">Gestion del sistema Smart Salud</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-gray-500">Total Medicos</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalDoctors}</p>
            <p className="text-sm text-emerald-600 mt-1">{stats.activeDoctors} activos</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500">Citas Totales</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</p>
            <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
              <TrendingUp className="w-4 h-4" />
              +12% esta semana
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">Confirmadas</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.confirmedAppointments}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-500">Pendientes</p>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingAppointments}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap font-medium transition-all ${activeTab === tab.id
                  ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {activeTab === "doctors" && (
            <div>
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 w-full sm:max-w-xs">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar medico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowAddDoctor(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all shadow-md font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Agregar Medico
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">Nombre</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Especialidad</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Sede</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Estado</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.map((doctor) => (
                      <tr key={doctor.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold">
                              {doctor.name.split(" ")[1][0]}
                            </div>
                            <span className="font-medium text-gray-900">{doctor.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{doctor.specialty}</td>
                        <td className="p-4 text-gray-600">{doctor.sede}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${doctor.status === "Activo"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                            }`}>
                            {doctor.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingDoctor(doctor)}
                              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                              <Edit className="w-5 h-5 text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleDeleteDoctor(doctor.id)}
                              className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "appointments" && (
            <div>
              <div className="p-5 border-b border-gray-100">
                <div className="relative max-w-xs">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar cita..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">Paciente</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Medico</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Fecha</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Hora</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Estado</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-900">{appointment.patient}</td>
                        <td className="p-4 text-gray-600">{appointment.doctor}</td>
                        <td className="p-4 text-gray-600">{appointment.date}</td>
                        <td className="p-4 text-gray-600">{appointment.time}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${appointment.status === "Confirmada"
                              ? "bg-emerald-100 text-emerald-700"
                              : appointment.status === "Pendiente"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={appointment.status}
                            onChange={(e) => handleUpdateAppointmentStatus(appointment.id, e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          >
                            <option value="Confirmada">Confirmada</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Cancelada">Cancelada</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Reportes de Citas</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Por Especialidad</h4>
                  <div className="space-y-4">
                    {specialties.slice(0, 5).map((specialty, idx) => (
                      <div key={specialty} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{specialty}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                              style={{ width: `${(5 - idx) * 20}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-900 w-8">{(5 - idx) * 12}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Por Estado</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-emerald-500" />
                        <span className="text-gray-700">Confirmadas</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">{stats.confirmedAppointments}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-yellow-500" />
                        <span className="text-gray-700">Pendientes</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">{stats.pendingAppointments}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-red-500" />
                        <span className="text-gray-700">Canceladas</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">{stats.canceledAppointments}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Por Sede</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                      <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">45</p>
                      <p className="text-gray-500 mt-1">San Isidro</p>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                      <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">32</p>
                      <p className="text-gray-500 mt-1">Miraflores</p>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                      <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">28</p>
                      <p className="text-gray-500 mt-1">Surco</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Configuracion del Sistema</h3>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Especialidades</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {specialties.map((specialty) => (
                      <span key={specialty} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:bg-white transition-colors text-gray-600 font-medium">
                    <Plus className="w-5 h-5" />
                    Agregar Especialidad
                  </button>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Sedes</h4>
                  <div className="space-y-3 mb-4">
                    {["San Isidro", "Miraflores", "Surco"].map((sede) => (
                      <div key={sede} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                        <span className="font-medium text-gray-900">{sede}</span>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:bg-white transition-colors text-gray-600 font-medium">
                    <Plus className="w-5 h-5" />
                    Agregar Sede
                  </button>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Horarios de Atencion</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Lunes a Viernes</p>
                      <p className="font-semibold text-gray-900">7:00 AM - 9:00 PM</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Sabados</p>
                      <p className="font-semibold text-gray-900">8:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddDoctor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Agregar Medico</h3>
              <button
                onClick={() => setShowAddDoctor(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo</label>
                <input
                  type="text"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  placeholder="Dr. Nombre Apellido"
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Especialidad</label>
                <select
                  value={newDoctor.specialty}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Seleccionar especialidad</option>
                  {specialties.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sede</label>
                <select
                  value={newDoctor.sede}
                  onChange={(e) => setNewDoctor({ ...newDoctor, sede: e.target.value })}
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="San Isidro">San Isidro</option>
                  <option value="Miraflores">Miraflores</option>
                  <option value="Surco">Surco</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddDoctor(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddDoctor}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all font-medium shadow-md"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Editar Medico</h3>
              <button
                onClick={() => setEditingDoctor(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo</label>
                <input
                  type="text"
                  value={editingDoctor.name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Especialidad</label>
                <select
                  value={editingDoctor.specialty}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {specialties.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sede</label>
                <select
                  value={editingDoctor.sede}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, sede: e.target.value })}
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="San Isidro">San Isidro</option>
                  <option value="Miraflores">Miraflores</option>
                  <option value="Surco">Surco</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                <select
                  value={editingDoctor.status}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, status: e.target.value })}
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingDoctor(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditDoctor}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all font-medium shadow-md"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
