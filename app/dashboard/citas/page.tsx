"use client"

import { API_BASE_URL } from "@/lib/api-client";

import jsPDF from 'jspdf'
import { Calendar, Clock, MapPin, MoreVertical, Edit, X, CheckCircle2, AlertCircle, DollarSign, CreditCard, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAppointments } from '@/contexts/appointments-context'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

export default function MyAppointmentsPage() {
  const { appointments, cancelAppointment } = useAppointments()
  const router = useRouter()
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [cancelError, setCancelError] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)

  const handleDownloadDocument = async (citaId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/historial/cita/${citaId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('smartSaludToken')}`,
        },
      })
      if (!response.ok) {
        toast.error("Error", { description: "No se pudo recuperar el historial de esta cita." })
        return
      }
      
      const data = await response.json()
      
      const labText = data.observaciones?.includes('Laboratorios:') ? data.observaciones.split('|')[0].replace('Laboratorios:', '').trim() : ''
      const imgText = data.observaciones?.includes('Imágenes:') ? data.observaciones.split('Imágenes:')[1].trim() : ''

      const doc = new jsPDF()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(22)
      doc.setTextColor(16, 185, 129)
      doc.text("SMART SALUD", 20, 20)
      
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text("Documento Clínico Oficial", 20, 26)
      doc.line(20, 30, 190, 30)

      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.text("Datos de Atención", 20, 45)
      
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text(`Paciente: ${data.pacienteNombre}`, 20, 55)
      doc.text(`DNI: ${data.dniPaciente || 'No registrado'}`, 20, 62)
      doc.text(`Médico: ${data.medicoNombre}`, 20, 69)
      doc.text(`Especialidad: ${data.especialidadNombre}`, 20, 76)
      doc.text(`Fecha de Atención: ${data.fecha}`, 20, 83)

      doc.line(20, 90, 190, 90)

      doc.setFont("helvetica", "bold")
      doc.text("1. Diagnóstico Clínico", 20, 105)
      doc.setFont("helvetica", "normal")
      const diagLines = doc.splitTextToSize(data.diagnostico || 'Sin diagnóstico', 170)
      doc.text(diagLines, 20, 112)

      let currentY = 112 + (diagLines.length * 7) + 10

      if (data.tratamiento) {
        doc.setFont("helvetica", "bold")
        doc.text("2. Receta Médica / Tratamiento", 20, currentY)
        doc.setFont("helvetica", "normal")
        const presLines = doc.splitTextToSize(data.tratamiento, 170)
        doc.text(presLines, 20, currentY + 7)
        currentY += (presLines.length * 7) + 15
      }

      if (labText || imgText) {
        doc.setFont("helvetica", "bold")
        doc.text("3. Órdenes / Exámenes", 20, currentY)
        doc.setFont("helvetica", "normal")
        if (labText) {
          doc.text(`- Laboratorio: ${labText}`, 20, currentY + 7)
          currentY += 7
        }
        if (imgText) {
          doc.text(`- Imágenes: ${imgText}`, 20, currentY + 7)
          currentY += 7
        }
      }

      doc.save(`Historial_${data.pacienteNombre.replace(/\s+/g, '_')}_${data.fecha}.pdf`)
      
      toast.success("Documento Generado", {
        description: "El PDF ha sido descargado exitosamente.",
      })
    } catch (error) {
      console.error(error)
      toast.error("Error", { description: "Ocurrió un error al descargar el PDF." })
    }
  }

  const handleReschedule = (appointmentId: string) => {
    toast.info('Función en desarrollo', {
      description: 'La reprogramación de citas estará disponible próximamente',
    })
  }

  const handleCancelClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId)
    setCancelDialogOpen(true)
  }

  const handleConfirmCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!cancelReason.trim()) {
      setCancelError(true)
      return
    }
    
    if (selectedAppointmentId) {
      cancelAppointment(selectedAppointmentId)
      toast.success('Cita cancelada', {
        description: 'La cita ha sido cancelada exitosamente. Si realizó un pago, su devolución se procesará en 3-5 días hábiles.',
      })
      setCancelDialogOpen(false)
      setSelectedAppointmentId(null)
      setCancelReason("")
      setCancelError(false)
    }
  }

  const getStatusBadge = (status: string, paymentStatus?: string) => {
    if (status === 'cancelled') {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
          <X className="h-3 w-3 mr-1" />
          Cancelada
        </Badge>
      )
    }
    if (status === 'pending_payment') {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
          <AlertCircle className="h-3 w-3 mr-1" />
          Pendiente de Pago
        </Badge>
      )
    }
    if (status === 'confirmed') {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-300">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Confirmada
        </Badge>
      )
    }
    return null
  }

  // Filter appointments
  const activeAppointments = appointments.filter(
    (apt) => apt.status !== 'cancelled' && new Date(apt.date) >= new Date(new Date().setHours(0, 0, 0, 0))
  )

  const pendingPaymentAppointments = activeAppointments.filter(
    (apt) => apt.status === 'pending_payment' && apt.paymentMethod === 'transfer'
  )
  const confirmedAppointments = activeAppointments.filter((apt) => apt.status === 'confirmed')
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.date) < new Date(new Date().setHours(0, 0, 0, 0))
  )

  const selectedAppointment = appointments.find((apt) => apt.id === selectedAppointmentId)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Mis Citas Médicas</h2>
            <p className="text-sm text-muted-foreground">
              Gestiona y consulta tus citas médicas
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push('/reservar')}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Nueva Cita
        </Button>
      </div>

      {/* Pending Payment Appointments */}
      {pendingPaymentAppointments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Citas Pendientes de Verificación
          </h3>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900">
              <strong>Transferencias bancarias pendientes de verificación:</strong> Tu cita será confirmada una vez que el personal administrativo verifique el pago.
            </p>
          </div>
          <div className="grid gap-4">
            {pendingPaymentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-yellow-50 rounded-lg border-2 border-yellow-300 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">
                          {appointment.doctorName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {appointment.specialty}
                        </p>
                      </div>
                      {getStatusBadge(appointment.status, appointment.paymentStatus)}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(appointment.date), "EEEE, d 'de' MMMM", { locale: es })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.timeSlot} hrs</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{appointment.location}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg text-sm">
                      <p className="text-blue-900">
                        <strong>Ubicación:</strong> Piso {appointment.floor} • Sala {appointment.room}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-yellow-200">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-yellow-600" />
                        <span className="font-semibold text-yellow-900">S/ {appointment.price.toFixed(2)}</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                        Esperando verificación
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Appointments */}
      {confirmedAppointments.length > 0 ? (
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-medium">Próximas Citas Confirmadas</h3>
          <div className="grid gap-4">
            {confirmedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">
                          {appointment.doctorName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {appointment.specialty}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">⭐ {appointment.doctorRating}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {appointment.doctorExperience}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(appointment.status, appointment.paymentStatus)}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(appointment.date), "EEEE, d 'de' MMMM", { locale: es })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.timeSlot} hrs</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{appointment.location}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-lg text-sm border border-emerald-100">
                      <p className="text-emerald-900">
                        <strong>Ubicación:</strong> Piso {appointment.floor} • Sala {appointment.room}
                      </p>
                    </div>

                    {appointment.paymentMethod && (
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Método de pago: {
                          appointment.paymentMethod === 'card' ? 'Tarjeta de Crédito/Débito' :
                          appointment.paymentMethod === 'transfer' ? 'Transferencia Bancaria' :
                          'Pago en Centro Médico'
                        }
                      </div>
                    )}
                  </div>

                  {/* Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleReschedule(appointment.id)}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Reprogramar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleCancelClick(appointment.id)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancelar Cita
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : pendingPaymentAppointments.length === 0 ? (
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-lg p-12 text-center shadow-inner">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Calendar className="h-10 w-10 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-xl mb-2">No tienes citas programadas</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Agenda una cita con nuestros especialistas para empezar a cuidar tu salud. Es rápido y sencillo.
          </p>
          <Button
            onClick={() => router.push('/reservar')}
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-md"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Agendar Nueva Cita
          </Button>
        </div>
      ) : null}

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="space-y-4 mt-8 pt-6 border-t">
          <h3 className="text-lg font-medium">Historial de Citas</h3>
          <div className="grid gap-3">
            {pastAppointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment.id}
                className="bg-gray-50 rounded-lg border border-border p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{appointment.doctorName}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(appointment.date), 'PPP', { locale: es })}
                      {' • '}
                      {appointment.timeSlot} hrs • {appointment.specialty}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                      Completada
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownloadDocument(parseInt(appointment.id))}
                      className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Descargar PDF
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {pastAppointments.length > 5 && (
            <p className="text-sm text-muted-foreground text-center">
              Mostrando las 5 citas más recientes de {pastAppointments.length} en total
            </p>
          )}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={(open) => { setCancelDialogOpen(open); if(!open) { setCancelReason(""); setCancelError(false); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Seguro que deseas cancelar?</AlertDialogTitle>
            <AlertDialogDescription>
              Puedes <strong>reprogramar</strong> en lugar de perder el turno. Si cancelas,
              perderás tu cita con <span className="font-semibold text-gray-900">{selectedAppointment?.doctorName}</span> programada para el{' '}
              {selectedAppointment &&
                format(new Date(selectedAppointment.date), 'PPP', { locale: es })}{' '}
              a las {selectedAppointment?.timeSlot} hrs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => {
                if (selectedAppointmentId) {
                  handleReschedule(selectedAppointmentId)
                  setCancelDialogOpen(false)
                }
              }}
            >
              Reprogramar
            </Button>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Sí, Cancelar Cita
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
