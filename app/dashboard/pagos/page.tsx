"use client"

import { useState } from 'react'
import { CreditCard, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppointments } from '@/contexts/appointments-context'

export default function PaymentsPage() {
  const { appointments } = useAppointments()

  // Filter transactions
  const pendingTransactions = appointments.filter(apt => apt.paymentMethod === 'transfer' && apt.status === 'pending_payment')
  const completedTransactions = appointments.filter(apt => apt.paymentStatus === 'completed')

  const totalPending = pendingTransactions.reduce((acc, curr) => acc + curr.price, 0)
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <DollarSign className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Pagos y Cobertura</h2>
          <p className="text-sm text-muted-foreground">
            Estado financiero y métodos de pago
          </p>
        </div>
      </div>

      {pendingTransactions.length === 0 ? (
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-12 text-center shadow-inner">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h3 className="font-semibold text-xl mb-2 text-gray-900">No tienes pagos pendientes</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Los pagos con tarjeta se confirman inmediatamente. Solo las transferencias bancarias aparecen aquí hasta su verificación.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <DollarSign className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-medium opacity-90 mb-2 uppercase tracking-wider">Transferencias Pendientes</h3>
              <p className="text-5xl font-bold mb-4">{formatCurrency(totalPending)}</p>
              <p className="text-sm opacity-90 max-w-sm">
                Estas transferencias serán verificadas por nuestro equipo administrativo para confirmar tus citas.
              </p>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Transferencias en Verificación ({pendingTransactions.length})</h3>
            </div>

            <div className="divide-y divide-gray-100">
              {pendingTransactions.map((transaction) => (
                <div key={transaction.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">Cita con {transaction.doctorName}</h4>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Clock className="h-3 w-3 mr-1" />
                          Pendiente
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {transaction.specialty} • {new Date(transaction.date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })} a las {transaction.timeSlot} hrs
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-lg text-gray-900">{formatCurrency(transaction.price)}</p>
                      <span className="text-xs text-yellow-600 font-medium">Verificando...</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Information Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
        <h3 className="font-semibold text-lg text-gray-900">Información de Pagos</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              <p className="font-semibold text-emerald-900">Pagos con Tarjeta</p>
            </div>
            <p className="text-sm text-emerald-800 leading-relaxed">
              Los pagos realizados con tarjeta de crédito o débito se confirman de forma inmediata y tu cita queda confirmada al instante en el sistema.
            </p>
          </div>
          
          <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <p className="font-semibold text-blue-900">Transferencias Bancarias</p>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              Las transferencias bancarias quedan pendientes de verificación por nuestro equipo administrativo. Tu cita será confirmada usualmente en 24 horas hábiles.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mt-4">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-500" />
            Cuentas Autorizadas para Transferencias
          </h4>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="space-y-2">
              <p><strong className="text-gray-900 font-medium">Banco:</strong> BCP - Banco de Crédito del Perú</p>
              <p><strong className="text-gray-900 font-medium">Cuenta Corriente:</strong> 194-1234567-0-89</p>
              <p><strong className="text-gray-900 font-medium">CCI:</strong> 002-194-001234567089-15</p>
            </div>
            <div className="space-y-2">
              <p><strong className="text-gray-900 font-medium">RUC:</strong> 20123456789</p>
              <p><strong className="text-gray-900 font-medium">Titular:</strong> Policlínico Smart Salud SAC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
