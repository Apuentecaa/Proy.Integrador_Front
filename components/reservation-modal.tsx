"use client"

import { useState } from "react"
import { X, ArrowLeft, ArrowRight, Check, Download, Mail, Star, MapPin, Clock, CreditCard, Smartphone, Building2 } from "lucide-react"

interface ReservationModalProps {
  onClose: () => void
}

const specialties = [
  { id: 1, name: "Cardiologia", price: 150, icon: "heart" },
  { id: 2, name: "Neurologia", price: 180, icon: "brain" },
  { id: 3, name: "Oftalmologia", price: 120, icon: "eye" },
  { id: 4, name: "Traumatologia", price: 140, icon: "bone" },
  { id: 5, name: "Pediatria", price: 100, icon: "baby" },
  { id: 6, name: "Medicina General", price: 80, icon: "stethoscope" },
  { id: 7, name: "Medicina Interna", price: 130, icon: "activity" },
  { id: 8, name: "Dermatologia", price: 110, icon: "pill" },
]

const doctors = [
  { id: 1, name: "Dr. Carlos Mendoza", specialty: 1, sede: "San Isidro", rating: 4.9, experience: "15 años", floor: "Piso 3", room: "301" },
  { id: 2, name: "Dra. Maria Garcia", specialty: 1, sede: "Miraflores", rating: 4.8, experience: "12 años", floor: "Piso 2", room: "205" },
  { id: 3, name: "Dr. Jose Rodriguez", specialty: 2, sede: "San Isidro", rating: 4.7, experience: "10 años", floor: "Piso 3", room: "308" },
  { id: 4, name: "Dra. Ana Lopez", specialty: 3, sede: "Surco", rating: 4.9, experience: "8 años", floor: "Piso 1", room: "102" },
  { id: 5, name: "Dr. Luis Torres", specialty: 4, sede: "San Isidro", rating: 4.6, experience: "20 años", floor: "Piso 3", room: "315" },
  { id: 6, name: "Dra. Carmen Diaz", specialty: 5, sede: "Miraflores", rating: 4.8, experience: "14 años", floor: "Piso 2", room: "210" },
  { id: 7, name: "Dr. Pedro Sanchez", specialty: 6, sede: "Surco", rating: 4.5, experience: "18 años", floor: "Piso 1", room: "105" },
  { id: 8, name: "Dra. Laura Martin", specialty: 7, sede: "San Isidro", rating: 4.7, experience: "11 años", floor: "Piso 3", room: "320" },
]

const timeSlots = [
  { time: "08:00", available: true },
  { time: "08:30", available: true },
  { time: "09:00", available: false },
  { time: "09:30", available: true },
  { time: "10:00", available: true },
  { time: "10:30", available: false },
  { time: "11:00", available: true },
  { time: "11:30", available: true },
  { time: "14:00", available: true },
  { time: "14:30", available: false },
  { time: "15:00", available: true },
  { time: "15:30", available: true },
  { time: "16:00", available: true },
  { time: "16:30", available: false },
  { time: "17:00", available: true },
  { time: "17:30", available: true },
]

const paymentMethods = [
  { id: "card", name: "Tarjeta de credito/debito", icon: CreditCard, description: "Visa, Mastercard, American Express" },
  { id: "yape", name: "Yape", icon: Smartphone, description: "Pago instantaneo con Yape" },
  { id: "plin", name: "Plin", icon: Smartphone, description: "Pago instantaneo con Plin" },
  { id: "transfer", name: "Transferencia bancaria", icon: Building2, description: "BCP, Interbank, BBVA, Scotiabank" },
]

export default function ReservationModal({ onClose }: ReservationModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    specialty: null as number | null,
    doctor: null as number | null,
    date: "",
    time: "",
    patientName: "",
    patientDNI: "",
    patientEmail: "",
    patientPhone: "",
    paymentMethod: "",
  })
  const [isConfirmed, setIsConfirmed] = useState(false)

  const selectedSpecialty = specialties.find(s => s.id === formData.specialty)
  const selectedDoctor = doctors.find(d => d.id === formData.doctor)
  const filteredDoctors = doctors.filter(d => d.specialty === formData.specialty)

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.specialty !== null
      case 2:
        return formData.doctor !== null && formData.date !== "" && formData.time !== ""
      case 3:
        return formData.patientName !== "" && formData.patientDNI !== "" &&
          formData.patientEmail !== "" && formData.patientPhone !== ""
      case 4:
        return formData.paymentMethod !== ""
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed() && step < 4) {
      setStep(step + 1)
    } else if (step === 4 && canProceed()) {
      setIsConfirmed(true)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const generateReservationCode = () => {
    return `VS-${Date.now().toString(36).toUpperCase()}`
  }

  const steps = [
    { number: 1, title: "Especialidad" },
    { number: 2, title: "Medico y Horario" },
    { number: 3, title: "Datos" },
    { number: 4, title: "Pago" },
  ]

  if (isConfirmed) {
    const reservationCode = generateReservationCode()
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reserva Confirmada</h2>
          <p className="text-gray-500 mb-6">
            Tu cita ha sido agendada exitosamente. Recibiras un correo de confirmacion.
          </p>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 text-left">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <span className="text-sm text-gray-500">Codigo de reserva</span>
              <span className="font-mono font-bold text-emerald-600 text-lg">{reservationCode}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Especialidad:</span>
                <span className="font-medium text-gray-900">{selectedSpecialty?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Medico:</span>
                <span className="font-medium text-gray-900">{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha:</span>
                <span className="font-medium text-gray-900">{formData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hora:</span>
                <span className="font-medium text-gray-900">{formData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sede:</span>
                <span className="font-medium text-gray-900">{selectedDoctor?.sede}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Consultorio:</span>
                <span className="font-medium text-gray-900">{selectedDoctor?.floor}, Sala {selectedDoctor?.room}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 mt-3">
                <span className="text-gray-500">Total pagado:</span>
                <span className="font-bold text-emerald-600 text-lg">S/ {selectedSpecialty?.price}.00</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => alert("Descargando comprobante PDF...")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              <Download className="w-5 h-5" />
              Descargar PDF
            </button>
            <button
              onClick={() => alert(`Enviando comprobante a ${formData.patientEmail}...`)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              <Mail className="w-5 h-5" />
              Enviar por correo
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all font-semibold shadow-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-500 to-blue-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Reservar Cita Medica</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-1">
            {steps.map((s, index) => (
              <div key={s.number} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${s.number === step
                        ? "bg-white text-emerald-600 shadow-lg"
                        : s.number < step
                          ? "bg-white/30 text-white"
                          : "bg-white/20 text-white/70"
                      }`}
                  >
                    {s.number < step ? <Check className="w-5 h-5" /> : s.number}
                  </div>
                  <span className="text-xs text-white/90 mt-2 hidden sm:block">{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-1 rounded ${s.number < step ? "bg-white/50" : "bg-white/20"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Selecciona una especialidad</h3>
              <p className="text-gray-500 text-sm mb-6">Elige el area medica que necesitas para tu consulta</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {specialties.map((specialty) => (
                  <button
                    key={specialty.id}
                    onClick={() => setFormData({ ...formData, specialty: specialty.id, doctor: null })}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.specialty === specialty.id
                        ? "border-emerald-500 bg-emerald-50 shadow-md"
                        : "border-gray-100 hover:border-emerald-200 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{specialty.name}</p>
                      {formData.specialty === specialty.id && (
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-emerald-600 font-bold mt-1">S/ {specialty.price}.00</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Selecciona un medico</h3>
                <p className="text-gray-500 text-sm mb-4">Elige el especialista de tu preferencia</p>
                <div className="space-y-3">
                  {filteredDoctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => setFormData({ ...formData, doctor: doctor.id })}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${formData.doctor === doctor.id
                          ? "border-emerald-500 bg-emerald-50 shadow-md"
                          : "border-gray-100 hover:border-emerald-200 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold">
                            {doctor.name.split(" ")[1][0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{doctor.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-500">Sede {doctor.sede}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-500">{doctor.experience} de experiencia</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-yellow-700">{doctor.rating}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Selecciona fecha</h3>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {formData.date && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Horarios disponibles</h3>
                  <p className="text-gray-500 text-sm mb-4">Los horarios en gris no estan disponibles</p>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setFormData({ ...formData, time: slot.time })}
                        disabled={!slot.available}
                        className={`p-3 rounded-xl text-sm font-semibold transition-all ${!slot.available
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                            : formData.time === slot.time
                              ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-md"
                              : "border-2 border-gray-100 hover:border-emerald-300 text-gray-700"
                          }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Datos del paciente</h3>
              <p className="text-gray-500 text-sm mb-6">Ingresa tus datos para completar la reserva</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Ingresa tu nombre completo"
                    className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    DNI
                  </label>
                  <input
                    type="text"
                    value={formData.patientDNI}
                    onChange={(e) => setFormData({ ...formData, patientDNI: e.target.value })}
                    placeholder="12345678"
                    maxLength={8}
                    className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Correo electronico
                  </label>
                  <input
                    type="email"
                    value={formData.patientEmail}
                    onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                    placeholder="987654321"
                    maxLength={9}
                    className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Resumen de la reserva</h3>
                <p className="text-gray-500 text-sm mb-4">Verifica los datos antes de confirmar</p>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Especialidad:</span>
                    <span className="font-semibold text-gray-900">{selectedSpecialty?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Medico:</span>
                    <span className="font-semibold text-gray-900">{selectedDoctor?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha:</span>
                    <span className="font-semibold text-gray-900">{formData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hora:</span>
                    <span className="font-semibold text-gray-900">{formData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sede:</span>
                    <span className="font-semibold text-gray-900">{selectedDoctor?.sede}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Consultorio:</span>
                    <span className="font-semibold text-gray-900">{selectedDoctor?.floor}, Sala {selectedDoctor?.room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Paciente:</span>
                    <span className="font-semibold text-gray-900">{formData.patientName}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total a pagar:</span>
                    <span className="font-bold text-emerald-600 text-xl">S/ {selectedSpecialty?.price}.00</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Metodo de pago</h3>
                <p className="text-gray-500 text-sm mb-4">Selecciona como deseas pagar</p>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${formData.paymentMethod === method.id
                          ? "border-emerald-500 bg-emerald-50 shadow-md"
                          : "border-gray-100 hover:border-emerald-200 hover:bg-gray-50"
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${formData.paymentMethod === method.id
                          ? "bg-gradient-to-br from-emerald-500 to-blue-500 text-white"
                          : "bg-gray-100 text-gray-500"
                        }`}>
                        <method.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                      {formData.paymentMethod === method.id && (
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${step === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
              }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${canProceed()
                ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            {step === 4 ? "Confirmar y Pagar" : "Siguiente"}
            {step < 4 && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
