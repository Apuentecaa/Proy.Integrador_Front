"use client"

import { useState, useEffect } from "react"
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

type TabType = "medicos" | "usuarios" | "citas" | "reportes" | "configuracion"

interface Usuario {
  id: number
  dni: string
  nombres: string
  apellidos: string
  email: string
  telefono: string
  rolNombre: string
}

interface Medico {
  id: number
  nombres: string
  apellidos: string
  dni?: string
  email?: string
  telefono?: string
  cmp: string
  especialidadId: number
  especialidadNombre: string
  aniosExperiencia: number
  rating?: number
  pacientes?: number
  estado?: string
}

interface Especialidad {
  id: number
  nombre: string
  descripcion: string
  iconoUrl?: string
}

interface Sede {
  id: number
  nombre: string
  direccion: string
  distrito: string
  ciudad: string
}

interface Cita {
  id: number
  pacienteNombre: string
  medicoNombre: string
  especialidadNombre: string
  fecha: string
  hora: string
  estado: string
  sedeNombre: string
}

const initialMedicos: Medico[] = []
const initialCitas: Cita[] = []

const especialidades = ["Cardiologia", "Neurologia", "Oftalmologia", "Traumatologia", "Pediatria", "Medicina General", "Medicina Interna", "Dermatologia"]
const sedes = ["San Isidro", "Miraflores", "Surco"]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("medicos")
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [citas, setCitas] = useState<Cita[]>(initialCitas)
  const [especialidadesDB, setEspecialidadesDB] = useState<Especialidad[]>([])
  const [sedesDB, setSedesDB] = useState<Sede[]>([])
  
  const [showEspecialidadModal, setShowEspecialidadModal] = useState(false)
  const [showSedeModal, setShowSedeModal] = useState(false)
  const [showCitaEditModal, setShowCitaEditModal] = useState(false)
  
  const [editingEspecialidadId, setEditingEspecialidadId] = useState<number | null>(null)
  const [editingSedeId, setEditingSedeId] = useState<number | null>(null)
  const [editingCitaId, setEditingCitaId] = useState<number | null>(null)
  
  const [newEspecialidad, setNewEspecialidad] = useState({ nombre: '', descripcion: '', iconoUrl: '' })
  const [newSede, setNewSede] = useState({ nombre: '', direccion: '', distrito: '', ciudad: 'Lima', telefono: '', email: '' })
  const [newCitaDatos, setNewCitaDatos] = useState({ medicoId: 0, fecha: '', hora: '' })
  const [disponiblesCita, setDisponiblesCita] = useState<{horaInicio: string}[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  
  // Modals
  const [showMedicoModal, setShowMedicoModal] = useState(false)
  const [showUsuarioModal, setShowUsuarioModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  
  // Edit States
  const [editingMedicoId, setEditingMedicoId] = useState<number | null>(null)
  const [editingUsuarioId, setEditingUsuarioId] = useState<number | null>(null)
  
  // Forms
  const [newMedico, setNewMedico] = useState({ 
    dni: "", nombres: "", apellidos: "", cmp: "", 
    especialidadId: 1, email: "", telefono: "", 
    password: "", aniosExperiencia: 0, sedesIds: [1] 
  })
  const [newUsuario, setNewUsuario] = useState({
    dni: "", nombres: "", apellidos: "", email: "", telefono: "", password: "", rolNombre: "RECEPCION"
  })

  // Data Fetching
  useEffect(() => {
    fetchMedicos()
    fetchUsuarios()
    fetchEspecialidades()
    fetchCitas()
    fetchSedes()
  }, [])

  const fetchSedes = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/sedes")
      if (res.ok) setSedesDB(await res.json())
    } catch (e) { console.error(e) }
  }

  const fetchCitas = async () => {
    try {
      const token = localStorage.getItem("smartSaludToken")
      const res = await fetch("http://localhost:8080/api/v1/citas/admin/todas", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) setCitas(await res.json())
    } catch (e) { console.error(e) }
  }

  const fetchMedicos = async () => {
    try {
      const token = localStorage.getItem("smartSaludToken")
      const res = await fetch("http://localhost:8080/api/v1/medicos", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) setMedicos(await res.json())
    } catch (e) { console.error(e) }
  }

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("smartSaludToken")
      const res = await fetch("http://localhost:8080/api/v1/admin/usuarios", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) setUsuarios(await res.json())
    } catch (e) { console.error(e) }
  }

  const fetchEspecialidades = async () => {
    try {
      const token = localStorage.getItem("smartSaludToken")
      const res = await fetch("http://localhost:8080/api/v1/especialidades", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) setEspecialidadesDB(await res.json())
    } catch (e) { console.error(e) }
  }

  const tabs = [
    { id: "medicos" as TabType, label: "Medicos", icon: Users },
    { id: "usuarios" as TabType, label: "Usuarios", icon: Users },
    { id: "citas" as TabType, label: "Citas", icon: Calendar },
    { id: "reportes" as TabType, label: "Reportes", icon: BarChart3 },
    { id: "configuracion" as TabType, label: "Configuracion", icon: Settings },
  ]

  const stats = [
    { label: "Total Medicos", value: medicos.length, icon: Users, trend: "+2 este mes", color: "from-blue-500 to-blue-600" },
    { label: "Citas Hoy", value: citas.filter(c => c.fecha === new Date().toISOString().split('T')[0]).length, icon: Calendar, trend: "Nuevas hoy", color: "from-emerald-500 to-emerald-600" },
    { label: "Confirmadas", value: citas.filter(c => c.estado === "CONFIRMADO").length, icon: CheckCircle, trend: "85% del total", color: "from-teal-500 to-teal-600" },
    { label: "Reservadas", value: citas.filter(c => c.estado === "RESERVADO").length, icon: Clock, trend: "Requieren atencion", color: "from-amber-500 to-amber-600" },
  ]


  // Handlers for Especialidad
  const handleAddEspecialidad = async () => {
    try {
      const token = localStorage.getItem("smartSaludToken")
      const url = editingEspecialidadId 
        ? `http://localhost:8080/api/v1/especialidades/${editingEspecialidadId}` 
        : "http://localhost:8080/api/v1/especialidades"
      const res = await fetch(url, {
        method: editingEspecialidadId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newEspecialidad)
      })
      if (res.ok) {
        setShowEspecialidadModal(false)
        setSuccessMessage(editingEspecialidadId ? "Especialidad actualizada" : "Especialidad agregada")
        setTimeout(() => setSuccessMessage(""), 3000)
        setEditingEspecialidadId(null)
        fetchEspecialidades()
      }
    } catch (e) { console.error(e) }
  }

  const handleEditEspecialidadClick = (esp: Especialidad) => {
    setNewEspecialidad({ nombre: esp.nombre, descripcion: esp.descripcion || '', iconoUrl: esp.iconoUrl || '' })
    setEditingEspecialidadId(esp.id)
    setShowEspecialidadModal(true)
  }

  const handleDeleteEspecialidad = async (id: number) => {
    if (!confirm("¿Eliminar especialidad?")) return;
    try {
      const token = localStorage.getItem("smartSaludToken")
      const res = await fetch(`http://localhost:8080/api/v1/especialidades/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) fetchEspecialidades()
    } catch (e) { console.error(e) }
  }

  // Handlers for Sede
  const handleAddSede = async () => {
    try {
      const token = localStorage.getItem("smartSaludToken")
      const url = editingSedeId 
        ? `http://localhost:8080/api/v1/sedes/${editingSedeId}` 
        : "http://localhost:8080/api/v1/sedes"
      const res = await fetch(url, {
        method: editingSedeId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newSede)
      })
      if (res.ok) {
        setShowSedeModal(false)
        setSuccessMessage(editingSedeId ? "Sede actualizada" : "Sede agregada")
        setTimeout(() => setSuccessMessage(""), 3000)
        setEditingSedeId(null)
        fetchSedes()
      }
    } catch (e) { console.error(e) }
  }

  const handleEditSedeClick = (sede: Sede) => {
    setNewSede({ nombre: sede.nombre, direccion: sede.direccion, distrito: sede.distrito || '', ciudad: sede.ciudad, telefono: '', email: '' })
    setEditingSedeId(sede.id)
    setShowSedeModal(true)
  }

  const handleDeleteSede = async (id: number) => {
    if (!confirm("¿Eliminar sede?")) return;
    try {
      const token = localStorage.getItem("smartSaludToken")
      const res = await fetch(`http://localhost:8080/api/v1/sedes/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) fetchSedes()
    } catch (e) { console.error(e) }
  }

  // Handlers for Cita
  const handleEditCitaClick = async (cita: Cita) => {
    // Find medico id from medicos array (a bit of a hack since we don't have medicoId in Cita directly)
    const m = medicos.find(x => x.nombres + " " + x.apellidos === cita.medicoNombre)
    const mid = m ? m.id : 0
    setNewCitaDatos({ medicoId: mid, fecha: cita.fecha, hora: cita.hora })
    setEditingCitaId(cita.id)
    setShowCitaEditModal(true)
    if (mid && cita.fecha) {
        const res = await fetch(`http://localhost:8080/api/v1/citas/disponibles?medicoId=${mid}&fecha=${cita.fecha}`)
        if (res.ok) {
            const data = await res.json()
            setDisponiblesCita(data)
        }
    }
  }

  const handleSaveCitaEdit = async () => {
    try {
      const token = localStorage.getItem("smartSaludToken")
      const res = await fetch(`http://localhost:8080/api/v1/citas/admin/${editingCitaId}/datos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newCitaDatos)
      })
      if (res.ok) {
        setShowCitaEditModal(false)
        setSuccessMessage("Cita actualizada")
        setTimeout(() => setSuccessMessage(""), 3000)
        setEditingCitaId(null)
        fetchCitas()
      } else {
        alert("Error al actualizar la cita. Asegúrese de que el horario seleccionado esté disponible.")
      }
    } catch (e) { console.error(e) }
  }

  const handleAddMedico = async () => {
    try {
      const token = localStorage.getItem("smartSaludToken")
      const url = editingMedicoId 
        ? `http://localhost:8080/api/v1/medicos/${editingMedicoId}` 
        : "http://localhost:8080/api/v1/medicos"
      const res = await fetch(url, {
        method: editingMedicoId ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newMedico)
      })
      if (res.ok) {
        setShowMedicoModal(false)
        setSuccessMessage(editingMedicoId ? "Médico actualizado exitosamente" : "Médico agregado exitosamente")
        setTimeout(() => setSuccessMessage(""), 3000)
        setEditingMedicoId(null)
        fetchMedicos()
      } else {
        alert("Error al guardar médico")
      }
    } catch (e) { console.error(e) }
  }

  const handleEditMedicoClick = (medico: Medico) => {
    setNewMedico({
      dni: medico.dni || "",
      nombres: medico.nombres,
      apellidos: medico.apellidos,
      cmp: medico.cmp,
      especialidadId: medico.especialidadId,
      email: medico.email || "",
      telefono: medico.telefono || "",
      password: "",
      aniosExperiencia: medico.aniosExperiencia,
      sedesIds: [1]
    })
    setEditingMedicoId(medico.id)
    setShowMedicoModal(true)
  }

  const handleDeleteMedico = async (id: number) => {
    if(!confirm("¿Eliminar médico?")) return;
    try {
      const token = localStorage.getItem("smartSaludToken")
      const res = await fetch(`http://localhost:8080/api/v1/medicos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) fetchMedicos()
    } catch (e) { console.error(e) }
  }

  const handleAddUsuario = async () => {
    try {
      const token = localStorage.getItem("smartSaludToken")
      const url = editingUsuarioId 
        ? `http://localhost:8080/api/v1/admin/usuarios/${editingUsuarioId}` 
        : "http://localhost:8080/api/v1/admin/usuarios"
      const res = await fetch(url, {
        method: editingUsuarioId ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newUsuario)
      })
      if (res.ok) {
        setShowUsuarioModal(false)
        setSuccessMessage(editingUsuarioId ? "Usuario actualizado exitosamente" : "Usuario agregado exitosamente")
        setTimeout(() => setSuccessMessage(""), 3000)
        setEditingUsuarioId(null)
        fetchUsuarios()
      } else {
        alert("Error al guardar usuario")
      }
    } catch (e) { console.error(e) }
  }

  const handleEditUsuarioClick = (usuario: Usuario) => {
    setNewUsuario({
      dni: usuario.dni,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      telefono: usuario.telefono,
      password: "",
      rolNombre: usuario.rolNombre
    })
    setEditingUsuarioId(usuario.id)
    setShowUsuarioModal(true)
  }

  const handleDeleteUsuario = async (id: number) => {
    if(!confirm("¿Eliminar usuario?")) return;
    try {
      const token = localStorage.getItem("smartSaludToken")
      const res = await fetch(`http://localhost:8080/api/v1/admin/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) fetchUsuarios()
    } catch (e) { console.error(e) }
  }

  const handleCitaStatusChange = async (id: number, estado: string) => {
    try {
      const token = localStorage.getItem("smartSaludToken")
      const res = await fetch(`http://localhost:8080/api/v1/citas/admin/${id}/estado?estado=${estado}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setCitas(citas.map(c => c.id === id ? { ...c, estado } : c))
        setSuccessMessage("Estado de la cita actualizado")
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        alert("Error al actualizar estado")
      }
    } catch (e) { console.error(e) }
  }

  const filteredMedicos = medicos.filter(m => 
    (m.nombres + " " + m.apellidos).toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.especialidadNombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredUsuarios = usuarios.filter(u => 
    (u.nombres + " " + u.apellidos).toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.rolNombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredCitas = citas.filter(c =>
    (c.pacienteNombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.medicoNombre || "").toLowerCase().includes(searchTerm.toLowerCase())
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

        {/* Success Message Alert */}
        {successMessage && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

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
            {(activeTab === "medicos" || activeTab === "citas" || activeTab === "usuarios") && (
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={activeTab === "medicos" ? "Buscar medico..." : activeTab === "usuarios" ? "Buscar usuario..." : "Buscar cita..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                {activeTab === "medicos" && (
                  <button
                    onClick={() => { 
                      setEditingMedicoId(null)
                      setNewMedico({ dni: "", nombres: "", apellidos: "", cmp: "", especialidadId: 1, email: "", telefono: "", password: "", aniosExperiencia: 0, sedesIds: [1] })
                      setShowMedicoModal(true) 
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Medico
                  </button>
                )}
                {activeTab === "usuarios" && (
                  <button
                    onClick={() => { 
                      setEditingUsuarioId(null)
                      setNewUsuario({ dni: "", nombres: "", apellidos: "", email: "", telefono: "", password: "", rolNombre: "RECEPCION" })
                      setShowUsuarioModal(true) 
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Usuario
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
                              <p className="font-medium text-gray-900">{medico.nombres} {medico.apellidos}</p>
                              <p className="text-xs text-gray-500">{medico.cmp}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{medico.especialidadNombre}</td>
                        <td className="py-4 px-4 text-gray-600">{medico.aniosExperiencia} años exp.</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="font-medium">{medico.rating}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700`}>
                            Activo
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEditMedicoClick(medico)}
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

            {/* Usuarios Tab */}
            {activeTab === "usuarios" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Usuario</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">DNI</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Rol</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsuarios.map((usuario) => (
                      <tr key={usuario.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{usuario.nombres} {usuario.apellidos}</p>
                              <p className="text-xs text-gray-500">{usuario.telefono}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{usuario.dni}</td>
                        <td className="py-4 px-4 text-gray-600">{usuario.email}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            usuario.rolNombre === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {usuario.rolNombre}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEditUsuarioClick(usuario)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUsuario(usuario.id)}
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
                        <td className="py-4 px-4 font-medium text-gray-900">{cita.pacienteNombre}</td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-gray-900">{cita.medicoNombre}</p>
                            <p className="text-xs text-gray-500">{cita.especialidadNombre}</p>
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
                            onChange={(e) => handleCitaStatusChange(cita.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer ${
                              cita.estado === "CONFIRMADO" || cita.estado === "ATENDIDO" ? "bg-emerald-100 text-emerald-700" :
                              cita.estado === "RESERVADO" ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                            }`}
                          >
                            <option value="RESERVADO">Reservado</option>
                            <option value="CONFIRMADO">Confirmado</option>
                            <option value="ATENDIDO">Atendido</option>
                            <option value="CANCELADO">Cancelado</option>
                            <option value="NO_ASISTIO">No Asistió</option>
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEditCitaClick(cita)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Editar cita"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm("¿Estás seguro de cancelar esta cita?")) {
                                  handleCitaStatusChange(cita.id, "CANCELADO");
                                }
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Cancelar cita"
                            >
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
                      {(() => {
                        const citasPorEspecialidad = citas.reduce((acc, cita) => {
                          acc[cita.especialidadNombre] = (acc[cita.especialidadNombre] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>);
                        
                        const total = citas.length || 1;
                        const topEspecialidades = Object.entries(citasPorEspecialidad)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 5);

                        if (topEspecialidades.length === 0) {
                          return <p className="text-gray-500 text-sm">No hay citas registradas</p>;
                        }

                        return topEspecialidades.map(([esp, count], i) => {
                          const percentage = Math.round((count / total) * 100);
                          return (
                            <div key={esp} className="flex items-center gap-3">
                              <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm text-gray-600">{esp}</span>
                                  <span className="text-sm font-medium">{percentage}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        });
                      })()}
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
                        <span className="font-bold text-emerald-600">{citas.filter(c => c.estado === "CONFIRMADO").length}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <span className="text-gray-700">Reservadas</span>
                        </div>
                        <span className="font-bold text-amber-600">{citas.filter(c => c.estado === "RESERVADO").length}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="text-gray-700">Canceladas</span>
                        </div>
                        <span className="font-bold text-red-600">{citas.filter(c => c.estado === "CANCELADO").length}</span>
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
                    {especialidadesDB.map((esp) => (
                      <span key={esp.id} className="group flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                        {esp.nombre}
                        <button onClick={() => handleEditEspecialidadClick(esp)} className="hidden group-hover:block hover:text-blue-600"><Edit2 className="w-3 h-3" /></button>
                        <button onClick={() => handleDeleteEspecialidad(esp.id)} className="hidden group-hover:block hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                      </span>
                    ))}
                    <button onClick={() => { setNewEspecialidad({ nombre: '', descripcion: '', iconoUrl: '' }); setEditingEspecialidadId(null); setShowEspecialidadModal(true); }} className="px-3 py-1.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                      + Agregar
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border">
                  <h3 className="font-bold text-gray-900 mb-4">Sedes</h3>
                  <div className="space-y-3">
                    <button onClick={() => { setNewSede({ nombre: '', direccion: '', distrito: '', ciudad: 'Lima', telefono: '', email: '' }); setEditingSedeId(null); setShowSedeModal(true); }} className="w-full py-2 mb-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-colors text-sm font-medium">
                      + Agregar Sede
                    </button>
                    {sedesDB.map((sede) => (
                      <div key={sede.id} className="flex items-center justify-between p-3 bg-white border rounded-xl">
                        <span className="text-gray-700 font-medium">{sede.nombre} <span className="text-sm font-normal text-gray-500 block">{sede.direccion} - {sede.ciudad}</span></span>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditSedeClick(sede)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteSede(sede.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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

      
      {/* Especialidad Modal */}
      {showEspecialidadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingEspecialidadId ? "Editar Especialidad" : "Agregar Especialidad"}</h3>
              <button onClick={() => setShowEspecialidadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input type="text" value={newEspecialidad.nombre} onChange={(e) => setNewEspecialidad({...newEspecialidad, nombre: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea value={newEspecialidad.descripcion} onChange={(e) => setNewEspecialidad({...newEspecialidad, descripcion: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"></textarea>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={() => setShowEspecialidadModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl">Cancelar</button>
              <button onClick={handleAddEspecialidad} className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Sede Modal */}
      {showSedeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingSedeId ? "Editar Sede" : "Agregar Sede"}</h3>
              <button onClick={() => setShowSedeModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label><input type="text" value={newSede.nombre} onChange={(e) => setNewSede({...newSede, nombre: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label><input type="text" value={newSede.direccion} onChange={(e) => setNewSede({...newSede, direccion: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label><input type="text" value={newSede.ciudad} onChange={(e) => setNewSede({...newSede, ciudad: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Distrito</label><input type="text" value={newSede.distrito} onChange={(e) => setNewSede({...newSede, distrito: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={() => setShowSedeModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl">Cancelar</button>
              <button onClick={handleAddSede} className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Cita Edit Modal */}
      {showCitaEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">Editar Cita</h3>
              <button onClick={() => setShowCitaEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Médico</label>
                <select value={newCitaDatos.medicoId} onChange={async (e) => {
                    const mid = parseInt(e.target.value);
                    setNewCitaDatos({...newCitaDatos, medicoId: mid});
                    if (newCitaDatos.fecha) {
                      const res = await fetch(`http://localhost:8080/api/v1/citas/disponibles?medicoId=${mid}&fecha=${newCitaDatos.fecha}`);
                      if (res.ok) setDisponiblesCita(await res.json());
                    }
                  }} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500">
                  <option value={0} disabled>Seleccione un médico</option>
                  {medicos.map(m => <option key={m.id} value={m.id}>{m.nombres} {m.apellidos} - {m.especialidadNombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                <input type="date" value={newCitaDatos.fecha} onChange={async (e) => {
                    const date = e.target.value;
                    setNewCitaDatos({...newCitaDatos, fecha: date});
                    if (newCitaDatos.medicoId) {
                      const res = await fetch(`http://localhost:8080/api/v1/citas/disponibles?medicoId=${newCitaDatos.medicoId}&fecha=${date}`);
                      if (res.ok) setDisponiblesCita(await res.json());
                    }
                  }} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hora (Debe seleccionar disponibilidad)</label>
                <select value={newCitaDatos.hora} onChange={(e) => setNewCitaDatos({...newCitaDatos, hora: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl">
                  <option value="" disabled>Seleccione un horario</option>
                  {/* Keep current hora as an option if not in disponibles since we are editing and it is already ours */}
                  <option value={newCitaDatos.hora} className="bg-blue-50">Hora actual ({newCitaDatos.hora})</option>
                  {disponiblesCita.map(h => <option key={h.horaInicio} value={h.horaInicio}>{h.horaInicio}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={() => setShowCitaEditModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl">Cancelar</button>
              <button onClick={handleSaveCitaEdit} className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Medico Modal */}
      {showMedicoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingMedicoId ? "Editar Medico" : "Agregar Medico"}</h3>
              <button onClick={() => setShowMedicoModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                <input
                  type="text"
                  value={newMedico.dni}
                  onChange={(e) => setNewMedico({...newMedico, dni: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombres</label>
                  <input
                    type="text"
                    value={newMedico.nombres}
                    onChange={(e) => setNewMedico({...newMedico, nombres: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                  <input
                    type="text"
                    value={newMedico.apellidos}
                    onChange={(e) => setNewMedico({...newMedico, apellidos: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (Para iniciar sesión)</label>
                  <input
                    type="email"
                    value={newMedico.email}
                    onChange={(e) => setNewMedico({...newMedico, email: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="text"
                    value={newMedico.telefono}
                    onChange={(e) => setNewMedico({...newMedico, telefono: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña {editingMedicoId && "(Opcional, dejar en blanco para mantenerla)"}</label>
                <input
                  type="password"
                  value={newMedico.password}
                  onChange={(e) => setNewMedico({...newMedico, password: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CMP</label>
                  <input
                    type="text"
                    value={newMedico.cmp}
                    onChange={(e) => setNewMedico({...newMedico, cmp: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Años Exp.</label>
                  <input
                    type="number"
                    value={newMedico.aniosExperiencia}
                    onChange={(e) => setNewMedico({...newMedico, aniosExperiencia: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                <select
                  value={newMedico.especialidadId}
                  onChange={(e) => setNewMedico({...newMedico, especialidadId: parseInt(e.target.value)})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={0} disabled>Seleccione una especialidad</option>
                  {especialidadesDB.map((esp) => (
                    <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={() => setShowMedicoModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={handleAddMedico} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600">
                <Save className="w-4 h-4" /> {editingMedicoId ? "Guardar Cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Usuario Modal */}
      {showUsuarioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingUsuarioId ? "Editar Usuario Admin" : "Agregar Usuario Admin"}</h3>
              <button onClick={() => setShowUsuarioModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                <input
                  type="text"
                  value={newUsuario.dni}
                  onChange={(e) => setNewUsuario({...newUsuario, dni: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombres</label>
                  <input
                    type="text"
                    value={newUsuario.nombres}
                    onChange={(e) => setNewUsuario({...newUsuario, nombres: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                  <input
                    type="text"
                    value={newUsuario.apellidos}
                    onChange={(e) => setNewUsuario({...newUsuario, apellidos: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newUsuario.email}
                  onChange={(e) => setNewUsuario({...newUsuario, email: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña {editingUsuarioId && "(Opcional)"}</label>
                <input
                  type="password"
                  value={newUsuario.password}
                  onChange={(e) => setNewUsuario({...newUsuario, password: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                <select
                  value={newUsuario.rolNombre}
                  onChange={(e) => setNewUsuario({...newUsuario, rolNombre: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="RECEPCION">RECEPCION</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={() => setShowUsuarioModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={handleAddUsuario} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600">
                <Save className="w-4 h-4" /> {editingUsuarioId ? "Guardar Cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
