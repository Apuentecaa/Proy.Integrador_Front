"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  FileText,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { useAppointments } from '@/contexts/appointments-context'
import { useDoctors } from '@/contexts/doctors-context'
import { PaymentFlow } from '@/components/payment-flow'
import Header from '@/components/header'
import Footer from '@/components/footer'

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const { addAppointment, updateAppointment } = useAppointments()
  const { doctors: allDoctors, specialties, getDoctorsBySpecialty, getDoctor } = useDoctors()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [registeredAppointmentId, setRegisteredAppointmentId] = useState<string | null>(null)
  
  const [bookingData, setBookingData] = useState({
    specialty: '',
    doctor: '',
    timeSlot: '',
    horarioId: 0,
    paymentMethod: '',
  })

  // Data from API
  const [apiDoctors, setApiDoctors] = useState<any[]>([])
  const [apiTimeSlots, setApiTimeSlots] = useState<any[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  // Fetch doctors on mount
  useEffect(() => {
    fetch('http://localhost:8080/api/v1/medicos')
      .then(res => res.json())
      .then(data => setApiDoctors(data))
      .catch(err => console.error("Error loading doctors", err))
  }, [])

  // Fetch available slots when doctor and date change
  useEffect(() => {
    if (bookingData.doctor && selectedDate) {
      setIsLoadingSlots(true)
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      fetch(`http://localhost:8080/api/v1/citas/disponibles?medicoId=${bookingData.doctor}&fecha=${dateStr}`)
        .then(res => res.json())
        .then(data => setApiTimeSlots(data))
        .catch(err => console.error("Error loading slots", err))
        .finally(() => setIsLoadingSlots(false))
    }
  }, [bookingData.doctor, selectedDate])

  // Derive specialties from doctors
  const uniqueSpecialties = Array.from(new Set(apiDoctors.map(d => d.especialidadNombre)))

  useEffect(() => {
    // If user is not authenticated, they should probably log in, but we let them see the first steps.
    const specialty = searchParams.get('specialty')
    const doctor = searchParams.get('doctor')
    if (specialty) {
      setBookingData(prev => ({ ...prev, specialty, doctor: doctor || '' }))
    }
  }, [searchParams])

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30',
  ]

  const steps = [
    { number: 1, title: 'Especialidad y Doctor', icon: Stethoscope },
    { number: 2, title: 'Fecha y Hora', icon: CalendarIcon },
    { number: 3, title: 'Resumen', icon: FileText },
    { number: 4, title: 'Pago', icon: CreditCard },
  ]

  const handleNext = () => {
    if (currentStep === 1 && (!bookingData.specialty || !bookingData.doctor)) {
      toast.error('Por favor selecciona especialidad y médico')
      return
    }
    if (currentStep === 2 && (!selectedDate || !bookingData.timeSlot)) {
      toast.error('Por favor selecciona fecha y hora')
      return
    }
    if (currentStep === 2 && !isAuthenticated) {
      toast.info('Debes iniciar sesión para continuar', {
        description: 'Serás redirigido al login'
      })
      router.push('/login?redirect=/reservar')
      return
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleRegisterAppointment = async () => {
    if (!selectedDate || !bookingData.specialty || !bookingData.doctor || !bookingData.horarioId) {
      toast.error('Faltan datos para registrar la cita')
      return
    }

    const selectedDoctorInfo = apiDoctors.find(d => d.id.toString() === bookingData.doctor)

    if (!selectedDoctorInfo) {
      toast.error('Doctor no encontrado')
      return
    }

    // Just advance to step 4 (payment). The actual API call will happen inside PaymentFlow
    setCurrentStep(4)
  }

  const handleProcessPayment = async (cardNumber: string, cvv: string): Promise<string | null> => {
    try {
      const token = localStorage.getItem('smartSaludToken')
      const response = await fetch('http://localhost:8080/api/v1/citas/reservar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          horarioId: bookingData.horarioId,
          fecha: format(selectedDate!, 'yyyy-MM-dd'),
          hora: bookingData.timeSlot + ":00",
          tarjetaNumero: cardNumber,
          cvv: cvv
        })
      })

      if (!response.ok) {
        return null;
      }

      const resCode = await response.text()
      setRegisteredAppointmentId(resCode) // Save the real code from backend
      return resCode;
    } catch (e) {
      console.error(e)
      return null;
    }
  }

  const selectedDoctor = bookingData.doctor ? apiDoctors.find(d => d.id.toString() === bookingData.doctor) : null

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Reserva tu{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Cita Médica
            </span>
          </h1>
          <p className="text-muted-foreground">Proceso rápido y seguro en 4 simples pasos</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] mx-auto px-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center z-10">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-blue-500 border-transparent text-white scale-110'
                          : 'bg-white border-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <p
                      className={`text-xs mt-3 text-center w-24 font-medium transition-colors duration-300 ${
                        isActive ? 'text-gray-900' : isCompleted ? 'text-emerald-600' : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded transition-colors duration-300 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
          
          {/* Step 1: Specialty and Doctor */}
          {currentStep === 1 && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-md border-emerald-100/50">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Selecciona la Especialidad</CardTitle>
                  <CardDescription>Elige el área médica que necesitas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Especialidad</Label>
                    <Select
                      value={bookingData.specialty}
                      onValueChange={(value) =>
                        setBookingData({ ...bookingData, specialty: value, doctor: '' })
                      }
                    >
                      <SelectTrigger className="h-12 border-gray-200 focus:ring-emerald-500">
                        <SelectValue placeholder="Seleccionar especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueSpecialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-3 text-sm text-emerald-800">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span><strong>Sede única:</strong> Policlínico Smart Salud - Ate, Lima</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-blue-100/50">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Selecciona tu Médico</CardTitle>
                  <CardDescription>
                    {bookingData.specialty
                      ? `Médicos disponibles en ${bookingData.specialty}`
                      : 'Primero selecciona una especialidad'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookingData.specialty && apiDoctors.filter(d => d.especialidadNombre === bookingData.specialty).length > 0 ? (
                    <RadioGroup
                      value={bookingData.doctor}
                      onValueChange={(value) => setBookingData({ ...bookingData, doctor: value })}
                      className="space-y-3"
                    >
                      {apiDoctors.filter(d => d.especialidadNombre === bookingData.specialty).map((doctor) => (
                        <div
                          key={doctor.id}
                          onClick={() => setBookingData({ ...bookingData, doctor: doctor.id.toString() })}
                          className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-sm ${
                            bookingData.doctor === doctor.id.toString()
                              ? 'border-emerald-500 bg-emerald-50/30'
                              : 'border-gray-100 hover:border-emerald-200 bg-white'
                          }`}
                        >
                          <RadioGroupItem value={doctor.id.toString()} id={doctor.id.toString()} />
                          <label htmlFor={doctor.id.toString()} className="flex-1 cursor-pointer">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">{doctor.nombres} {doctor.apellidos}</p>
                                <p className="text-sm text-gray-500 mt-0.5">
                                  {doctor.aniosExperiencia} años de experiencia
                                </p>
                              </div>
                              <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
                                ⭐ 5.0
                              </Badge>
                            </div>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">Selecciona una especialidad para ver los médicos disponibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Date and Time */}
          {currentStep === 2 && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Selecciona la Fecha</CardTitle>
                  <CardDescription>Elige el día de tu cita médica</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-8">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={es}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) || date.getDay() === 0}
                    className="rounded-xl border shadow-sm p-4 pointer-events-auto"
                  />
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Selecciona la Hora</CardTitle>
                  <CardDescription>
                    {selectedDate
                      ? `Horarios para ${format(selectedDate, 'PPP', { locale: es })}`
                      : 'Primero selecciona una fecha'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDate && isLoadingSlots ? (
                    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                      <p className="text-gray-500">Cargando horarios...</p>
                    </div>
                  ) : selectedDate && apiTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {apiTimeSlots.filter(t => t.disponible).map((slot) => {
                        const time = slot.horaInicio.substring(0, 5) // "10:00:00" -> "10:00"
                        return (
                        <Button
                          key={slot.id}
                          variant={bookingData.timeSlot === time ? 'default' : 'outline'}
                          className={`h-12 rounded-xl transition-all ${
                            bookingData.timeSlot === time
                              ? 'bg-gradient-to-r from-emerald-500 to-blue-500 shadow-md scale-105'
                              : 'hover:border-emerald-300 hover:text-emerald-700'
                          }`}
                          onClick={() => setBookingData({ ...bookingData, timeSlot: time, horarioId: slot.id })}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          {time}
                        </Button>
                      )})}
                    </div>
                  ) : selectedDate ? (
                     <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                      <p className="text-gray-500">No hay horarios disponibles para esta fecha.</p>
                     </div>
                  ) : (
                    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <CalendarIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">Selecciona una fecha para ver los horarios disponibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <Card className="max-w-2xl mx-auto shadow-xl border-emerald-100">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-b border-gray-100">
                <CardTitle className="text-2xl text-gray-800">Resumen de tu Cita</CardTitle>
                <CardDescription>Verifica los datos antes de proceder al pago</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <Stethoscope className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Especialidad</p>
                      <p className="font-semibold text-lg text-gray-900 mt-1">{bookingData.specialty}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Médico</p>
                      <p className="font-semibold text-lg text-gray-900 mt-1">{selectedDoctor?.nombres} {selectedDoctor?.apellidos}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">⭐ 5.0</Badge>
                        <span className="text-sm text-gray-500">
                          {selectedDoctor?.aniosExperiencia} años
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <CalendarIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Fecha y Hora</p>
                      <p className="font-semibold text-lg text-gray-900 mt-1">
                        {selectedDate && format(selectedDate, 'PPP', { locale: es })}
                      </p>
                      <div className="inline-flex items-center mt-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                        <Clock className="h-4 w-4 mr-2" />
                        {bookingData.timeSlot}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mt-6">
                  <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-xl">
                    <span className="text-lg font-medium text-gray-700">Costo de la Consulta:</span>
                    <span className="text-3xl font-bold text-emerald-600">
                      S/ 150.00
                    </span>
                  </div>

                  {/* Edit buttons */}
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="rounded-xl border-gray-200 hover:bg-gray-50"
                    >
                      Editar Médico
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="rounded-xl border-gray-200 hover:bg-gray-50"
                    >
                      Editar Fecha/Hora
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Payment Component */}
          {currentStep === 4 && selectedDate && selectedDoctor && (
            <PaymentFlow 
              amount={150.00} 
              appointmentDetails={{
                id: registeredAppointmentId || 'NUEVA',
                doctor: selectedDoctor.nombres + " " + selectedDoctor.apellidos,
                specialty: bookingData.specialty,
                date: format(selectedDate, 'PPP', { locale: es }),
                time: bookingData.timeSlot
              }}
              onProcessPayment={handleProcessPayment}
              onComplete={() => {
                // The payment component handles the routing or we can do it here
              }}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100 max-w-5xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(currentStep - 1)
                } else {
                  router.back()
                }
              }}
              size="lg"
              className="text-gray-500 hover:text-gray-900"
            >
              {currentStep === 1 ? 'Cancelar' : 'Volver Atrás'}
            </Button>

            {currentStep === 3 ? (
              <Button
                onClick={handleRegisterAppointment}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg shadow-emerald-500/25 px-8 rounded-xl h-12"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Proceder al Pago
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white shadow-md px-8 rounded-xl h-12"
              >
                Continuar
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-grow">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>}>
          <BookingContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
