"use client"

import { useState, useEffect } from 'react'
import { CreditCard, DollarSign, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppointments } from '@/contexts/appointments-context'
import { procesarPago } from '@/lib/api/pago'
import { toast } from 'sonner'

export default function PaymentsPage() {
  const { appointments, reload } = useAppointments()
  const [payingId, setPayingId] = useState<string | null>(null)

  // Refresca al entrar para reflejar el estado real de las citas
  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Citas no pagadas (estado RESERVADO en backend = pending_payment)
  const pendientes = appointments.filter((apt) => apt.status === 'pending_payment')
  const totalPending = pendientes.reduce((acc, c) => acc + c.price, 0)

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount)

  const handlePay = async (apt: typeof pendientes[number]) => {
    if (!apt.backendId) {
      toast.error('Esta cita no tiene un ID válido del servidor')
      return
    }
    setPayingId(apt.id)
    try {
      await procesarPago({ citaId: apt.backendId, monto: apt.price, metodo: 'TARJETA_CREDITO' })
      toast.success('¡Pago realizado!', {
        description: `Tu cita con ${apt.doctorName} quedó confirmada.`,
      })
      await reload()
    } catch (e) {
      toast.error('No se pudo procesar el pago', {
        description: 'Inténtalo de nuevo en unos segundos.',
      })
    } finally {
      setPayingId(null)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <DollarSign className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Pagos Pendientes</h2>
          <p className="text-sm text-muted-foreground">
            Paga tus citas reservadas para confirmarlas
          </p>
        </div>
      </div>

      {pendientes.length === 0 ? (
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-12 text-center shadow-inner">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h3 className="font-semibold text-xl mb-2 text-gray-900">No tienes pagos pendientes</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Todas tus citas están pagadas. Las citas pagadas aparecen en "Próximas Citas".
          </p>
        </div>
      ) : (
        <>
          {/* Resumen */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <DollarSign className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-medium opacity-90 mb-2 uppercase tracking-wider">Total por pagar</h3>
              <p className="text-5xl font-bold mb-4">{formatCurrency(totalPending)}</p>
              <p className="text-sm opacity-90 max-w-sm">
                Tienes {pendientes.length} cita{pendientes.length === 1 ? '' : 's'} reservada{pendientes.length === 1 ? '' : 's'} sin pagar.
                Hasta que las pagues no aparecerán como próximas citas.
              </p>
            </div>
          </div>

          {/* Lista de citas por pagar */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Citas por pagar ({pendientes.length})</h3>
            </div>

            <div className="divide-y divide-gray-100">
              {pendientes.map((apt) => (
                <div key={apt.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-semibold text-gray-900">Cita con {apt.doctorName}</h4>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Clock className="h-3 w-3 mr-1" />
                          Pendiente de pago
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {apt.specialty} • {new Date(apt.date).toLocaleDateString('es-ES', {
                          day: '2-digit', month: 'long', year: 'numeric',
                        })} a las {apt.timeSlot} hrs
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                      <p className="font-bold text-lg text-gray-900">{formatCurrency(apt.price)}</p>
                      <Button
                        onClick={() => handlePay(apt)}
                        disabled={payingId === apt.id}
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
                      >
                        {payingId === apt.id ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Procesando...</>
                        ) : (
                          <><CreditCard className="h-4 w-4 mr-2" /> Pagar ahora</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Información de pagos */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
        <h3 className="font-semibold text-lg text-gray-900">Información de Pagos</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              <p className="font-semibold text-emerald-900">Pago con Tarjeta</p>
            </div>
            <p className="text-sm text-emerald-800 leading-relaxed">
              Al pagar con tarjeta tu cita se confirma de inmediato y pasa a "Próximas Citas".
            </p>
          </div>
          <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <p className="font-semibold text-blue-900">Citas sin pagar</p>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              Una cita reservada queda como pendiente de pago y no aparece en tus próximas citas hasta que la pagues.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
