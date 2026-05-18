"use client"

import { useState } from 'react'
import { CheckCircle2, XCircle, Loader2, Download, Calendar as CalendarIcon, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

type PaymentState = 'form' | 'processing' | 'success' | 'error'

interface PaymentFlowProps {
  amount: number
  appointmentDetails: {
    id: string
    doctor: string
    specialty: string
    date: string
    time: string
  }
  onComplete: () => void
}

export function PaymentFlow({ amount, appointmentDetails, onComplete }: PaymentFlowProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>('form')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentState('processing')

    // Simulate payment processing
    setTimeout(() => {
      // 90% success rate
      const success = Math.random() > 0.1
      setPaymentState(success ? 'success' : 'error')
    }, 2500)
  }

  const handleRetry = () => {
    setPaymentState('form')
    setCardNumber('')
    setCardName('')
    setExpiryDate('')
    setCvv('')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(value)
  }

  const downloadPDF = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(22)
    doc.setTextColor(16, 185, 129) // Emerald 500
    doc.text('Smart Salud', 20, 20)
    
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('Comprobante de Reserva', 20, 35)
    
    // Details
    doc.setFontSize(12)
    doc.text(`N° de Reserva: #${appointmentDetails.id.slice(-8).toUpperCase()}`, 20, 50)
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 20, 60)
    
    // Line separator
    doc.line(20, 65, 190, 65)
    
    // Appointment details
    doc.setFontSize(14)
    doc.text('Detalles de la Cita Médica:', 20, 80)
    
    doc.setFontSize(12)
    doc.text(`Especialidad: ${appointmentDetails.specialty}`, 20, 95)
    doc.text(`Médico: ${appointmentDetails.doctor}`, 20, 105)
    doc.text(`Fecha: ${appointmentDetails.date}`, 20, 115)
    doc.text(`Hora: ${appointmentDetails.time}`, 20, 125)
    doc.text(`Lugar: Policlínico Smart Salud - Sede Ate`, 20, 135)
    
    // Line separator
    doc.line(20, 145, 190, 145)
    
    // Payment details
    doc.text(`Total Pagado: S/ ${amount.toFixed(2)}`, 20, 160)
    doc.text(`Método: Tarjeta de Crédito/Débito`, 20, 170)
    
    // Footer
    doc.setFontSize(10)
    doc.setTextColor(128, 128, 128)
    doc.text('Este documento es un comprobante válido de su cita médica.', 20, 270)
    doc.text('Por favor, asista 15 minutos antes de su turno.', 20, 278)

    doc.save(`Reserva_SmartSalud_${appointmentDetails.id.slice(-8)}.pdf`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {paymentState === 'form' && (
        <div className="bg-white rounded-lg border border-border p-8 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-semibold mb-6">Información de Pago Seguro</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2">Resumen de la Cita</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Médico:</strong> {appointmentDetails.doctor}</p>
              <p><strong>Especialidad:</strong> {appointmentDetails.specialty}</p>
              <p><strong>Fecha:</strong> {appointmentDetails.date} a las {appointmentDetails.time}</p>
              <p className="text-lg font-semibold mt-2 text-emerald-600">Total a Pagar: {formatCurrency(amount)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre del Titular</label>
              <Input
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Nombre como aparece en la tarjeta"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Número de Tarjeta</label>
              <Input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de Vencimiento</label>
                <Input
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/AA"
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CVV</label>
                <Input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                <CreditCard className="mr-2 h-5 w-5" />
                Pagar {formatCurrency(amount)}
              </Button>
            </div>
          </form>
        </div>
      )}

      {paymentState === 'processing' && (
        <div className="bg-white rounded-lg border border-border p-12 text-center animate-in zoom-in-95">
          <Loader2 className="h-16 w-16 text-emerald-600 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-2">Procesando pago seguro...</h2>
          <p className="text-muted-foreground">
            Validando la transacción. No cierres esta ventana.
          </p>
        </div>
      )}

      {paymentState === 'success' && (
        <div className="bg-white rounded-lg border border-emerald-200 p-12 text-center animate-in zoom-in-95 shadow-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          <h2 className="text-3xl font-bold mb-2 text-green-600">
            ¡Pago Exitoso!
          </h2>
          <p className="text-muted-foreground mb-8">
            Tu cita ha sido confirmada y pagada exitosamente
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium mb-2 text-green-900">Ticket de Reserva: #{appointmentDetails.id.slice(-8).toUpperCase()}</h3>
            <div className="space-y-1 text-sm text-green-800">
              <p><strong>Médico:</strong> {appointmentDetails.doctor}</p>
              <p><strong>Fecha:</strong> {appointmentDetails.date}</p>
              <p><strong>Hora:</strong> {appointmentDetails.time}</p>
              <p><strong>Monto Pagado:</strong> {formatCurrency(amount)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={downloadPDF} className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Descargar Comprobante PDF
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                onComplete()
                router.push('/dashboard/citas')
              }} 
              className="w-full"
            >
              Ir a Mis Citas
            </Button>
          </div>
        </div>
      )}

      {paymentState === 'error' && (
        <div className="bg-white rounded-lg border border-red-200 p-12 text-center animate-in zoom-in-95">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>

          <h2 className="text-2xl font-semibold mb-2 text-red-600">
            Pago Rechazado
          </h2>
          <p className="text-muted-foreground mb-8">
            Tu banco rechazó la operación. Por favor, intenta nuevamente.
          </p>

          <div className="space-y-3">
            <Button onClick={handleRetry} className="w-full" size="lg">
              Reintentar con otra Tarjeta
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
