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
  Loader2,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { useAppointments } from '@/contexts/appointments-context'
import { useDoctors } from '@/contexts/doctors-context'
import { listarSlotsDisponibles, type SlotDisponible } from '@/lib/api/cita'
import { PaymentFlow } from '@/components/payment-flow'
import Header from '@/components/header'
import Footer from '@/components/footer'

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const { addAppointment, updateAppointment } = useAppointments()
  const { doctors: allDoctors, specialties, getDoctorsBySpecialty, getDoctor, usingMock } = useDoctors()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [registeredAppointmentId, setRegisteredAppointmentId] = useState<string | null>(null)

  // Slots reales traídos del backend según el médico y la fecha elegidos
  const [realSlots, setRealSlots] = useState<SlotDisponible[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [bookingData, setBookingData] = useState({
    specialty: '',
    doctor: '',
    timeSlot: '',
    paymentMethod: '',
  })

  useEffect(() => {
    // If user is not authenticated, they should probably log in, but we let them see the first steps.
    // However, TO-BE model says auth is required before reserving.
    // We enforce it at step 3.
    const specialty = searchParams.get('specialty')
    const doctor = searchParams.get('doctor')
    if (specialty) {
      setBookingData(prev => ({ ...prev, specialty, doctor: doctor || '' }))
    }
  }, [searchParams])

  // Horarios estáticos de respaldo (cuando no hay backend o el médico no tiene IDs reales)
  const staticTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30',
  ]

  const selectedDoctorObj = bookingData.doctor ? getDoctor(bookingData.doctor) : null
  const canUseRealSlots = !usingMock && !!selectedDoctorObj?.backendId

  // Carga los slots reales cada vez que cambia la fecha o el médico
  useEffect(() => {
    if (!canUseRealSlots || !selectedDate || !selectedDoctorObj?.backendId) {
      setRealSlots([])
      return
    }
    const fechaStr = format(selectedDate, 'yyyy-MM-dd')
    let cancelled = false
    setLoadingSlots(true)
    listarSlotsDisponibles(selectedDoctorObj.backendId, fechaStr)
      .then((slots) => { if (!cancelled) setRealSlots(slots) })
      .catch((err) => {
        console.warn('No se pudieron cargar los horarios reales, usando estáticos', err)
        if (!cancelled) setRealSlots([])
      })
      .finally(() => { if (!cancelled) setLoadingSlots(false) })
    return () => { cancelled = true }
  }, [canUseRealSlots, selectedDate, selectedDoctorObj?.backendId])

  // Lista normalizada de horarios a mostrar: { hora 'HH:mm', disponible }
  const displaySlots: { hora: string; disponible: boolean }[] = canUseRealSlots
    ? realSlots.map((s) => ({ hora: s.hora.slice(0, 5), disponible: s.disponible }))
    : staticTimeSlots.map((h) => ({ hora: h, disponible: true }))

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
    if (!selectedDate || !bookingData.specialty || !bookingData.doctor) {
      toast.error('Faltan datos para registrar la cita')
      return
    }

    const selectedDoctor = getDoctor(bookingData.doctor)

    if (!selectedDoctor) {
      toast.error('Doctor no encontrado')
      return
    }

    try {
      const newAppointment = await addAppointment({
        specialty: bookingData.specialty,
        doctorId: bookingData.doctor,
        doctorName: selectedDoctor.name,
        doctorRating: selectedDoctor.rating,
        doctorExperience: selectedDoctor.experience,
        location: 'Policlínico Smart Salud - Sede Ate',
        floor: selectedDoctor.floor,
        room: selectedDoctor.room,
        date: selectedDate.toISOString(),
        timeSlot: bookingData.timeSlot,
        status: 'pending_payment',
        price: selectedDoctor.price,
        // IDs reales del backend para que la cita se guarde en la BD
        backendMedicoId: selectedDoctor.backendId,
        backendSedeId: 1,
      })

      setRegisteredAppointmentId(newAppointment.id)
      setCurrentStep(4)
      toast.success('Cita registrada', { description: 'Procede con el pago para confirmarla' })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudo registrar la cita'
      toast.error('Error al reservar', { description: msg })
    }
  }

  const selectedDoctor = bookingData.doctor ? getDoctor(bookingData.doctor) : null

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
                        {specialties.map((specialty) => (
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
                  {bookingData.specialty && getDoctorsBySpecialty(bookingData.specialty).length > 0 ? (
                    <RadioGroup
                      value={bookingData.doctor}
                      onValueChange={(value) => setBookingData({ ...bookingData, doctor: value })}
                      className="space-y-3"
                    >
                      {getDoctorsBySpecialty(bookingData.specialty).map((doctor) => (
                        <div
                          key={doctor.id}
                          onClick={() => setBookingData({ ...bookingData, doctor: doctor.id })}
                          className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-sm ${
                            bookingData.doctor === doctor.id
                              ? 'border-emerald-500 bg-emerald-50/30'
                              : 'border-gray-100 hover:border-emerald-200 bg-white'
                          }`}
                        >
                          <RadioGroupItem value={doctor.id} id={doctor.id} />
                          <label htmlFor={doctor.id} className="flex-1 cursor-pointer">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">{doctor.name}</p>
                                <p className="text-sm text-gray-500 mt-0.5">
                                  {doctor.experience} de experiencia
                                </p>
                              </div>
                              <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
                                ⭐ {doctor.rating}
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
                    onSelect={(date) => {
                      setSelectedDate(date)
                      setBookingData((prev) => ({ ...prev, timeSlot: '' }))
                    }}
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
                  {selectedDate ? (
                    loadingSlots ? (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <Loader2 className="h-7 w-7 animate-spin text-emerald-500 mb-3" />
                        <p className="text-sm">Cargando horarios disponibles...</p>
                      </div>
                    ) : displaySlots.length === 0 ? (
                      <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No hay horarios disponibles para este día</p>
                        <p className="text-xs text-gray-400 mt-1">Prueba con otra fecha</p>
                      </div>
                    ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {displaySlots.map(({ hora, disponible }) => (
                        <Button
                          key={hora}
                          disabled={!disponible}
                          variant={bookingData.timeSlot === hora ? 'default' : 'outline'}
                          title={disponible ? undefined : 'Horario ocupado'}
                          className={`h-12 rounded-xl transition-all ${
                            bookingData.timeSlot === hora
                              ? 'bg-gradient-to-r from-emerald-500 to-blue-500 shadow-md scale-105'
                              : 'hover:border-emerald-300 hover:text-emerald-700'
                          } ${!disponible ? 'opacity-40 line-through cursor-not-allowed' : ''}`}
                          onClick={() => setBookingData({ ...bookingData, timeSlot: hora })}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          {hora}
                        </Button>
                      ))}
                    </div>
                    )
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
                      <p className="font-semibold text-lg text-gray-900 mt-1">{selectedDoctor?.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">⭐ {selectedDoctor?.rating}</Badge>
                        <span className="text-sm text-gray-500">
                          {selectedDoctor?.experience}
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
                      S/ {selectedDoctor?.price.toFixed(2)}
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
          {currentStep === 4 && selectedDate && selectedDoctor && registeredAppointmentId && (
            <PaymentFlow 
              amount={selectedDoctor.price} 
              appointmentDetails={{
                id: registeredAppointmentId,
                doctor: selectedDoctor.name,
                specialty: bookingData.specialty,
                date: format(selectedDate, 'PPP', { locale: es }),
                time: bookingData.timeSlot
              }}
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
