"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  FileText,
  CreditCard,
  Clock,
  ArrowRight,
  Activity,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useAppointments } from '@/contexts/appointments-context'
import { useDocuments } from '@/contexts/documents-context'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { appointments } = useAppointments()
  const { getPatientDocuments } = useDocuments()

  // Calculate real data from appointments
  const upcomingAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(apt.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return apt.status === 'confirmed' && aptDate >= today
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pendingPayments = appointments.filter(
    (apt) => apt.status === 'pending_payment' && apt.paymentMethod === 'transfer'
  ).length

  const patientDocuments = user ? getPatientDocuments(user.email) : []

  const quickStats = [
    {
      title: 'Próximas Citas',
      value: upcomingAppointments.length.toString(),
      icon: Calendar,
      color: 'from-emerald-500 to-emerald-600',
      link: '/dashboard/citas',
    },
    {
      title: 'Pagos Pendientes',
      value: pendingPayments.toString(),
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600',
      link: '/dashboard/citas',
    },
    {
      title: 'Mis Documentos',
      value: patientDocuments.length.toString(),
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      link: '/dashboard/documentos',
    },
    {
      title: 'Total Citas',
      value: appointments.length.toString(),
      icon: Activity,
      color: 'from-purple-500 to-purple-600',
      link: '/dashboard/citas',
    },
  ]

  const recentActivity = appointments
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((apt) => ({
      id: apt.id,
      type: `Cita ${
        apt.status === 'confirmed'
          ? 'confirmada'
          : apt.status === 'pending_payment'
          ? 'pendiente de pago'
          : 'cancelada'
      } con ${apt.doctorName}`,
      date: format(new Date(apt.createdAt), 'PPP', { locale: es }),
      icon: Calendar,
    }))

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Section */}
      <div>
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">¡Hola, {user?.name}!</h1>
              <p className="text-white/90">Bienvenido a tu portal de salud</p>
            </div>
            <Button
              onClick={() => router.push('/reservar')}
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Nueva Cita
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={stat.title}>
              <Link href={stat.link}>
                <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-emerald-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Próximas Citas</CardTitle>
            <Link href="/dashboard/citas">
              <Button variant="ghost" size="sm">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200"
                >
                  <div className="p-2 rounded-lg bg-white">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{appointment.doctorName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(appointment.date), 'PPP', { locale: es })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {appointment.timeSlot}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50 text-emerald-500" />
                <p>No tienes citas próximas</p>
                <Button
                  onClick={() => router.push('/reservar')}
                  className="mt-4 bg-gradient-to-r from-emerald-500 to-blue-500"
                >
                  Reservar Cita
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start gap-4 p-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.type}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50 text-blue-500" />
                <p>No hay actividad reciente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Reservar Cita', icon: Calendar, link: '/reservar' },
              { label: 'Mis Documentos', icon: FileText, link: '/dashboard/documentos' },
            ].map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto flex-col gap-2 p-6 hover:border-emerald-200 border-2"
                  onClick={() => router.push(action.link)}
                >
                  <Icon className="h-6 w-6 text-emerald-600" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
