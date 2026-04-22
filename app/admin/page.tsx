"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/header"
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  Save,
  ArrowLeft
} from "lucide-react"

type TabType = "medicos" | "citas" | "reportes" | "configuracion"

interface Medico {
  id: number
  nombre: string
  especialidad: string
  sede: string
  rating: number
  pacientes: number
  estado: "activo" | "inactivo"
}

interface Cita {
  id: string
  paciente: string
  medico: string
  especialidad: string
  fecha: string
  hora: string
  estado: "confirmada" | "pendiente" | "cancelada"
  sede: string
}

const initialMedicos: Medico[] = [
  { id: 1, nombre: "Dr. Carlos Martinez", especialidad: "Cardiologia", sede: "San Isidro", rating: 4.9, pacientes: 1250, estado: "activo" },
  { id: 2, nombre: "Dra. Maria Garcia", especialidad: "Pediatria", sede: "Miraflores", rating: 4.8, pacientes: 980, estado: "activo" },
  { id: 3, nombre: "Dr. Jose Rodriguez", especialidad: "Neurologia", sede: "San Isidro", rating: 4.7, pacientes: 750, estado: "activo" },
  { id: 4, nombre: "Dra. Ana Torres", especialidad: "Medicina General", sede: "Surco", rating: 4.9, pacientes: 1500, estado: "activo" },
  { id: 5, nombre: "Dr. Luis Fernandez", especialidad: "Traumatologia", sede: "San Isidro", rating: 4.6, pacientes: 620, estado: "inactivo" },
]

const initialCitas: Cita[] = [
  { id: "CIT-001", paciente: "Juan Perez", medico: "Dr. Carlos Martinez", especialidad: "Cardiologia", fecha: "2024-01-15", hora: "09:00", estado: "confirmada", sede: "San Isidro" },
  { id: "CIT-002", paciente: "Maria Lopez", medico: "Dra. Maria Garcia", especialidad: "Pediatria", fecha: "2024-01-15", hora: "10:30", estado: "pendiente", sede: "Miraflores" },
  { id: "CIT-003", paciente: "Carlos Ruiz", medico: "Dr. Jose Rodriguez", especialidad: "Neurologia", fecha: "2024-01-15", hora: "11:00", estado: "confirmada", sede: "San Isidro" },
  { id: "CIT-004", paciente: "Ana Sanchez", medico: "Dra. Ana Torres", especialidad: "Medicina General", fecha: "2024-01-16", hora: "08:00", estado: "cancelada", sede: "Surco" },
  { id: "CIT-005", paciente: "Pedro Garcia", medico: "Dr. Carlos Martinez", especialidad: "Cardiologia", fecha: "2024-01-16", hora: "14:00", estado: "pendiente", sede: "San Isidro" },
]

const especialidades = ["Cardiologia", "Neurologia", "Oftalmologia", "Traumatologia", "Pediatria", "Medicina General", "Medicina Interna", "Dermatologia"]
const sedes = ["San Isidro", "Miraflores", "Surco"]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("medicos")
  const [medicos, setMedicos] = useState<Medico[]>(initialMedicos)
  const [citas, setCitas] = useState<Cita[]>(initialCitas)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingMedico, setEditingMedico] = useState<Medico | null>(null)
  const [newMedico, setNewMedico] = useState({ nombre: "", especialidad: "", sede: "" })

  const tabs = [
    { id: "medicos" as TabType, label: "Medicos", icon: Users },
    { id: "citas" as TabType, label: "Citas", icon: Calendar },
    { id: "reportes" as TabType, label: "Reportes", icon: BarChart3 },
    { id: "configuracion" as TabType, label: "Configuracion", icon: Settings },
  ]

  const stats = [
    { label: "Total Medicos", value: medicos.length, icon: Users, trend: "+2 este mes", color: "from-blue-500 to-blue-600" },
    { label: "Citas Hoy", value: citas.filter(c => c.fecha === "2024-01-15").length, icon: Calendar, trend: "+12% vs ayer", color: "from-emerald-500 to-emerald-600" },
    { label: "Confirmadas", value: citas.filter(c => c.estado === "confirmada").length, icon: CheckCircle, trend: "85% del total", color: "from-teal-500 to-teal-600" },
    { label: "Pendientes", value: citas.filter(c => c.estado === "pendiente").length, icon: Clock, trend: "Requieren atencion", color: "from-amber-500 to-amber-600" },
  ]

  const handleAddMedico = () => {
    if (newMedico.nombre && newMedico.especialidad && newMedico.sede) {
      const medico: Medico = {
        id: medicos.length + 1,
        nombre: newMedico.nombre,
        especialidad: newMedico.especialidad,
        sede: newMedico.sede,
        rating: 5.0,
        pacientes: 0,
        estado: "activo"
      }
      setMedicos([...medicos, medico])
      setNewMedico({ nombre: "", especialidad: "", sede: "" })
      setShowModal(false)
    }
  }

  const handleEditMedico = () => {
    if (editingMedico) {
      setMedicos(medicos.map(m => m.id === editingMedico.id ? editingMedico : m))
      setEditingMedico(null)
      setShowModal(false)
    }
  }

  const handleDeleteMedico = (id: number) => {
    setMedicos(medicos.filter(m => m.id !== id))
  }

  const handleCitaStatusChange = (id: string, estado: Cita["estado"]) => {
    setCitas(citas.map(c => c.id === id ? { ...c, estado } : c))
  }

  const filteredMedicos = medicos.filter(m => 
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredCitas = citas.filter(c =>
    c.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.medico.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button & Title */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administracion</h1>
            <p className="text-gray-500">Gestiona medicos, citas y configuracion del sistema</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xs text-emerald-600 mt-1">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Search & Actions */}
            {(activeTab === "medicos" || activeTab === "citas") && (
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={activeTab === "medicos" ? "Buscar medico..." : "Buscar cita..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                {activeTab === "medicos" && (
                  <button
                    onClick={() => { setEditingMedico(null); setShowModal(true) }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Medico
                  </button>
                )}
              </div>
            )}

            {/* Medicos Tab */}
            {activeTab === "medicos" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Medico</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Especialidad</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Sede</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Rating</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Estado</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedicos.map((medico) => (
                      <tr key={medico.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{medico.nombre}</p>
                              <p className="text-xs text-gray-500">{medico.pacientes} pacientes</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{medico.especialidad}</td>
                        <td className="py-4 px-4 text-gray-600">{medico.sede}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="font-medium">{medico.rating}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            medico.estado === "activo" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {medico.estado}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => { setEditingMedico(medico); setShowModal(true) }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteMedico(medico.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Citas Tab */}
            {activeTab === "citas" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Paciente</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Medico</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Fecha/Hora</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Estado</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCitas.map((cita) => (
                      <tr key={cita.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm text-gray-600">{cita.id}</span>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-900">{cita.paciente}</td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-gray-900">{cita.medico}</p>
                            <p className="text-xs text-gray-500">{cita.especialidad}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-gray-900">{cita.fecha}</p>
                            <p className="text-xs text-gray-500">{cita.hora}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={cita.estado}
                            onChange={(e) => handleCitaStatusChange(cita.id, e.target.value as Cita["estado"])}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer ${
                              cita.estado === "confirmada" ? "bg-emerald-100 text-emerald-700" :
                              cita.estado === "pendiente" ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                            }`}
                          >
                            <option value="confirmada">Confirmada</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="cancelada">Cancelada</option>
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-500">Mostrando 1-5 de {citas.length} citas</p>
                  <div className="flex items-center gap-2">
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-1 bg-emerald-500 text-white rounded-lg">1</button>
                    <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg">2</button>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reportes Tab */}
            {activeTab === "reportes" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border">
                    <h3 className="font-bold text-gray-900 mb-4">Citas por Especialidad</h3>
                    <div className="space-y-3">
                      {especialidades.slice(0, 5).map((esp, i) => (
                        <div key={esp} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-600">{esp}</span>
                              <span className="text-sm font-medium">{(5 - i) * 12}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                                style={{ width: `${(5 - i) * 20}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border">
                    <h3 className="font-bold text-gray-900 mb-4">Estado de Citas</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                          <span className="text-gray-700">Confirmadas</span>
                        </div>
                        <span className="font-bold text-emerald-600">{citas.filter(c => c.estado === "confirmada").length}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <span className="text-gray-700">Pendientes</span>
                        </div>
                        <span className="font-bold text-amber-600">{citas.filter(c => c.estado === "pendiente").length}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="text-gray-700">Canceladas</span>
                        </div>
                        <span className="font-bold text-red-600">{citas.filter(c => c.estado === "cancelada").length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Configuracion Tab */}
            {activeTab === "configuracion" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border">
                  <h3 className="font-bold text-gray-900 mb-4">Especialidades Disponibles</h3>
                  <div className="flex flex-wrap gap-2">
                    {especialidades.map((esp) => (
                      <span key={esp} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                        {esp}
                      </span>
                    ))}
                    <button className="px-3 py-1.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                      + Agregar
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border">
                  <h3 className="font-bold text-gray-900 mb-4">Sedes</h3>
                  <div className="space-y-3">
                    {sedes.map((sede) => (
                      <div key={sede} className="flex items-center justify-between p-3 bg-white border rounded-xl">
                        <span className="text-gray-700">{sede}</span>
                        <div className="flex gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border">
                  <h3 className="font-bold text-gray-900 mb-4">Horarios de Atencion</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Lunes - Viernes</p>
                      <p className="font-medium text-gray-900">7:00 AM - 9:00 PM</p>
                    </div>
                    <div className="p-4 bg-white border rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Sabados</p>
                      <p className="font-medium text-gray-900">8:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingMedico ? "Editar Medico" : "Agregar Medico"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                <input
                  type="text"
                  value={editingMedico ? editingMedico.nombre : newMedico.nombre}
                  onChange={(e) => editingMedico 
                    ? setEditingMedico({...editingMedico, nombre: e.target.value})
                    : setNewMedico({...newMedico, nombre: e.target.value})
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Dr. Juan Perez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                <select
                  value={editingMedico ? editingMedico.especialidad : newMedico.especialidad}
                  onChange={(e) => editingMedico
                    ? setEditingMedico({...editingMedico, especialidad: e.target.value})
                    : setNewMedico({...newMedico, especialidad: e.target.value})
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Seleccionar...</option>
                  {especialidades.map((esp) => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sede</label>
                <select
                  value={editingMedico ? editingMedico.sede : newMedico.sede}
                  onChange={(e) => editingMedico
                    ? setEditingMedico({...editingMedico, sede: e.target.value})
                    : setNewMedico({...newMedico, sede: e.target.value})
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Seleccionar...</option>
                  {sedes.map((sede) => (
                    <option key={sede} value={sede}>{sede}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editingMedico ? handleEditMedico : handleAddMedico}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all"
              >
                <Save className="w-4 h-4" />
                {editingMedico ? "Guardar" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
