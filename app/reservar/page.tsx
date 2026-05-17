"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/header"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Heart,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  Star,
  Stethoscope,
  User,
  Users,
  X
} from "lucide-react"

const especialidades = [
  { id: 1, nombre: "Cardiologia", icono: Heart, color: "from-red-500 to-pink-500" },
  { id: 2, nombre: "Neurologia", icono: Stethoscope, color: "from-purple-500 to-indigo-500" },
  { id: 3, nombre: "Pediatria", icono: Users, color: "from-pink-500 to-rose-500" },
  { id: 4, nombre: "Medicina General", icono: Stethoscope, color: "from-emerald-500 to-teal-500" },
]

const medicos = [
  { id: 1, nombre: "Dr. Carlos Martinez", especialidad: "Cardiologia", rating: 4.9, experiencia: "15 años", foto: null },
  { id: 2, nombre: "Dra. Maria Garcia", especialidad: "Cardiologia", rating: 4.8, experiencia: "12 años", foto: null },
  { id: 3, nombre: "Dr. Jose Rodriguez", especialidad: "Neurologia", rating: 4.7, experiencia: "10 años", foto: null },
  { id: 4, nombre: "Dra. Ana Torres", especialidad: "Pediatria", rating: 4.9, experiencia: "8 años", foto: null },
]

const horarios = [
  { hora: "08:00", disponible: true },
  { hora: "08:30", disponible: false },
  { hora: "09:00", disponible: true },
  { hora: "09:30", disponible: true },
  { hora: "10:00", disponible: false },
  { hora: "10:30", disponible: true },
  { hora: "11:00", disponible: true },
  { hora: "11:30", disponible: false },
  { hora: "14:00", disponible: true },
  { hora: "14:30", disponible: true },
  { hora: "15:00", disponible: true },
  { hora: "15:30", disponible: false },
]

const sedes = [
  { id: 1, nombre: "San Isidro", direccion: "Av. Javier Prado 1234", piso: "Piso 3, Consultorio 305" },
  { id: 2, nombre: "Miraflores", direccion: "Av. Larco 567", piso: "Piso 2, Consultorio 201" },
  { id: 3, nombre: "Surco", direccion: "Av. Primavera 890", piso: "Piso 1, Consultorio 102" },
]

const steps = [
  { id: 1, titulo: "Especialidad", icono: Stethoscope },
  { id: 2, titulo: "Medico y Horario", icono: Calendar },
  { id: 3, titulo: "Datos", icono: User },
  { id: 4, titulo: "Pago", icono: CreditCard },
]

export default function ReservarPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedEspecialidad, setSelectedEspecialidad] = useState<number | null>(null)
  const [selectedMedico, setSelectedMedico] = useState<number | null>(null)
  const [selectedFecha, setSelectedFecha] = useState("")
  const [selectedHora, setSelectedHora] = useState("")
  const [selectedSede, setSelectedSede] = useState<number | null>(null)
  const [selectedPayment, setSelectedPayment] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    email: ""
  })

  const precioConsulta = 120

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedEspecialidad !== null
      case 2: return selectedMedico !== null && selectedFecha && selectedHora && selectedSede !== null
      case 3: return formData.nombres && formData.apellidos && formData.dni && formData.telefono && formData.email
      case 4: return selectedPayment !== ""
      default: return false
    }
  }

  const handleNext = () => {
    if (currentStep < 4 && canProceed()) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === 4 && canProceed()) {
      setShowConfirmation(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      if (date.getDay() !== 0) {
        dates.push({
          fecha: date.toISOString().split("T")[0],
          dia: date.toLocaleDateString("es-PE", { weekday: "short" }),
          numero: date.getDate(),
          mes: date.toLocaleDateString("es-PE", { month: "short" })
        })
      }
    }
    return dates.slice(0, 10)
  }

  const getMedicosFiltrados = () => {
    const esp = especialidades.find(e => e.id === selectedEspecialidad)
    if (!esp) return medicos
    return medicos.filter(m => m.especialidad === esp.nombre)
  }

  if (showConfirmation) {
    const medico = medicos.find(m => m.id === selectedMedico)
    const sede = sedes.find(s => s.id === selectedSede)
    const especialidad = especialidades.find(e => e.id === selectedEspecialidad)
    const codigoReserva = `RES-${Date.now().toString(36).toUpperCase()}`

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-8 text-center text-white">
              <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Reserva Confirmada</h1>
              <p className="text-white/90">Tu cita ha sido registrada exitosamente</p>
            </div>

            <div className="p-8">
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Codigo de Reserva</span>
                  <span className="font-mono font-bold text-emerald-600 text-lg">{codigoReserva}</span>
                </div>
                <div className="border-t border-emerald-100 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Paciente</span>
                    <span className="font-medium">{formData.nombres} {formData.apellidos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Especialidad</span>
                    <span className="font-medium">{especialidad?.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Medico</span>
                    <span className="font-medium">{medico?.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha y Hora</span>
                    <span className="font-medium">{selectedFecha} - {selectedHora}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sede</span>
                    <span className="font-medium">{sede?.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ubicacion</span>
                    <span className="font-medium text-right">{sede?.piso}</span>
                  </div>
                  <div className="border-t border-emerald-100 pt-3 flex justify-between">
                    <span className="text-gray-700 font-semibold">Total Pagado</span>
                    <span className="font-bold text-emerald-600">S/ {precioConsulta}.00</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all">
                  <Download className="w-5 h-5" />
                  Descargar Comprobante PDF
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-3 border border-emerald-200 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all">
                  <Mail className="w-5 h-5" />
                  Enviar por Correo
                </button>
                <Link 
                  href="/"
                  className="flex items-center justify-center gap-2 w-full py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        {/* Stepper */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= step.id 
                      ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white" 
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icono className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${
                    currentStep >= step.id ? "text-emerald-600" : "text-gray-400"
                  }`}>
                    {step.titulo}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 lg:w-24 h-1 mx-2 rounded-full ${
                    currentStep > step.id ? "bg-emerald-500" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          {/* Step 1: Especialidad */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Selecciona una Especialidad</h2>
              <p className="text-gray-500 mb-6">Elige la especialidad medica que necesitas</p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {especialidades.map((esp) => (
                  <button
                    key={esp.id}
                    onClick={() => setSelectedEspecialidad(esp.id)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${
                      selectedEspecialidad === esp.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${esp.color} rounded-2xl flex items-center justify-center`}>
                        <esp.icono className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{esp.nombre}</h3>
                        <p className="text-sm text-gray-500">Consulta especializada</p>
                      </div>
                      {selectedEspecialidad === esp.id && (
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Medico y Horario */}
          {currentStep === 2 && (
            <div className="space-y-8">
              {/* Medico */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Selecciona un Medico</h2>
                <p className="text-gray-500 mb-4">Elige al especialista de tu preferencia</p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {getMedicosFiltrados().map((medico) => (
                    <button
                      key={medico.id}
                      onClick={() => setSelectedMedico(medico.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        selectedMedico === medico.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{medico.nombre}</h3>
                          <p className="text-sm text-gray-500">{medico.experiencia} de experiencia</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-medium">{medico.rating}</span>
                          </div>
                        </div>
                        {selectedMedico === medico.id && (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fecha */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Selecciona una Fecha</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {generateDates().map((date) => (
                    <button
                      key={date.fecha}
                      onClick={() => setSelectedFecha(date.fecha)}
                      className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                        selectedFecha === date.fecha
                          ? "bg-gradient-to-br from-emerald-500 to-blue-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <p className="text-xs uppercase">{date.dia}</p>
                      <p className="text-xl font-bold">{date.numero}</p>
                      <p className="text-xs">{date.mes}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Horarios */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Selecciona un Horario</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {horarios.map((slot) => (
                    <button
                      key={slot.hora}
                      onClick={() => slot.disponible && setSelectedHora(slot.hora)}
                      disabled={!slot.disponible}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                        selectedHora === slot.hora
                          ? "bg-gradient-to-br from-emerald-500 to-blue-500 text-white"
                          : slot.disponible
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          : "bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                      }`}
                    >
                      {slot.hora}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sede */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Selecciona una Sede</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {sedes.map((sede) => (
                    <button
                      key={sede.id}
                      onClick={() => setSelectedSede(sede.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedSede === sede.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className={`w-5 h-5 mt-0.5 ${selectedSede === sede.id ? "text-emerald-500" : "text-gray-400"}`} />
                        <div>
                          <h4 className="font-bold text-gray-900">{sede.nombre}</h4>
                          <p className="text-xs text-gray-500">{sede.direccion}</p>
                          <p className="text-xs text-emerald-600 mt-1">{sede.piso}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Datos */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Datos del Paciente</h2>
              <p className="text-gray-500 mb-6">Completa tus datos para la reserva</p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombres</label>
                  <input
                    type="text"
                    value={formData.nombres}
                    onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Juan Carlos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                  <input
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Perez Garcia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                  <input
                    type="text"
                    value={formData.dni}
                    onChange={(e) => setFormData({...formData, dni: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="12345678"
                    maxLength={8}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="987654321"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electronico</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Pago */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Metodo de Pago</h2>
              <p className="text-gray-500 mb-6">Selecciona como deseas pagar tu consulta</p>

              {/* Resumen */}
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-5 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Resumen de tu Reserva</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Especialidad</span>
                    <span className="font-medium">{especialidades.find(e => e.id === selectedEspecialidad)?.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Medico</span>
                    <span className="font-medium">{medicos.find(m => m.id === selectedMedico)?.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha y Hora</span>
                    <span className="font-medium">{selectedFecha} - {selectedHora}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sede</span>
                    <span className="font-medium">{sedes.find(s => s.id === selectedSede)?.nombre}</span>
                  </div>
                  <div className="border-t border-emerald-200 pt-2 mt-2 flex justify-between">
                    <span className="font-semibold text-gray-700">Total a Pagar</span>
                    <span className="font-bold text-emerald-600 text-lg">S/ {precioConsulta}.00</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: "yape", nombre: "Yape", descripcion: "Pago con QR", icono: Smartphone },
                  { id: "plin", nombre: "Plin", descripcion: "Pago con QR", icono: Smartphone },
                  { id: "tarjeta", nombre: "Tarjeta de Credito/Debito", descripcion: "Visa, Mastercard", icono: CreditCard },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                      selectedPayment === method.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedPayment === method.id ? "bg-emerald-500" : "bg-gray-100"
                    }`}>
                      <method.icono className={`w-6 h-6 ${selectedPayment === method.id ? "text-white" : "text-gray-500"}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-bold text-gray-900">{method.nombre}</h4>
                      <p className="text-sm text-gray-500">{method.descripcion}</p>
                    </div>
                    {selectedPayment === method.id && (
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
              canProceed()
                ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {currentStep === 4 ? "Confirmar y Pagar" : "Siguiente"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  )
}
