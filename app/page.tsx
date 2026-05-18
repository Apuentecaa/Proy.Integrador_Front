"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Calendar, 
  Clock, 
  Shield, 
  Heart, 
  Users, 
  Target, 
  Award,
  ChevronRight,
  CheckCircle2,
  Stethoscope,
  Activity
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import Image from 'next/image'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const services = [
    {
      icon: Calendar,
      title: 'Reserva Express',
      description: 'Agenda tu cita en 3 clics desde cualquier dispositivo',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: Stethoscope,
      title: 'Especialistas Certificados',
      description: 'Accede a más de 50 especialidades médicas',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Activity,
      title: 'Historial Médico',
      description: 'Toda tu información clínica en un solo lugar',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Shield,
      title: 'Telemedicina',
      description: 'Consultas online desde la comodidad de tu hogar',
      color: 'from-cyan-500 to-cyan-600',
    },
  ]

  const features = [
    'Atención 24/7 para emergencias',
    'Sistema de pago seguro y flexible',
    'Recordatorios automáticos de citas',
    'Acceso a resultados de exámenes',
    'Recetas médicas digitales',
    'Red de farmacias asociadas',
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-50 via-blue-50 to-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 mb-6 shadow-sm">
                  <Heart className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">Tu salud, nuestra prioridad</span>
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                  Cuidamos de tu{' '}
                  <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                    salud
                  </span>
                  <br />con tecnología
                </h1>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                  Policlínico Smart Salud en Ate, Lima. Tu portal integral de salud. Reserva citas médicas, accede a tus resultados y gestiona tu bienestar en un solo lugar.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={() => router.push(isAuthenticated ? '/reservar' : '/registro')}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 h-14 px-8 text-lg rounded-xl"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    {isAuthenticated ? 'Reservar Cita Ahora' : 'Crear Cuenta Gratis'}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                  {!isAuthenticated && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => router.push('/login')}
                      className="border-2 border-gray-200 hover:bg-gray-50 h-14 px-8 text-lg rounded-xl"
                    >
                      Ya tengo cuenta
                    </Button>
                  )}
                  {isAuthenticated && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => router.push('/especialidades')}
                      className="border-2 border-gray-200 hover:bg-gray-50 h-14 px-8 text-lg rounded-xl"
                    >
                      Buscar Médicos
                    </Button>
                  )}
                </div>
              </div>

              <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1762625570087-6d98fca29531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZWRpY2FsJTIwY2xpbmljJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc2MjA0NjIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Modern medical clinic"
                    className="w-full h-[400px] lg:h-[550px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
                {/* Stats overlay */}
                <div className="absolute -bottom-8 left-8 right-8 grid grid-cols-3 gap-4">
                  {[
                    { label: 'Pacientes', value: '50K+' },
                    { label: 'Especialistas', value: '200+' },
                    { label: 'Satisfacción', value: '98%' },
                  ].map((stat, index) => (
                    <div key={stat.label} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${400 + index * 100}ms` }}>
                      <Card className="bg-white/95 backdrop-blur shadow-xl border-0">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                            {stat.value}
                          </div>
                          <div className="text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">{stat.label}</div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
                Servicios que{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                  transforman
                </span>
                {' '}tu experiencia
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tecnología de punta y atención personalizada para cuidar de ti y tu familia
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <div key={service.title} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 border-gray-100 hover:border-emerald-200 group bg-white">
                      <CardContent className="p-8">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{service.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="rounded-3xl overflow-hidden shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent mix-blend-multiply z-10" />
                  <img
                    src="https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3NjIyMDAyMHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Healthcare professional"
                    className="w-full h-[600px] object-cover"
                  />
                </div>
              </div>

              <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000">
                <div>
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Target className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Nuestra Misión</h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Democratizar el acceso a servicios de salud de calidad mediante tecnología innovadora,
                    facilitando la conexión entre pacientes and profesionales médicos, mientras mantenemos
                    el foco en la atención humanizada y personalizada.
                  </p>
                </div>

                <div>
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Nuestra Visión</h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Ser la plataforma líder de salud digital en Perú, reconocida por transformar
                    la experiencia del paciente a través de soluciones tecnológicas que simplifican,
                    integran y mejoran el acceso a la atención médica en Lima y todo el país.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Nuestros Valores</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {['Empatía', 'Innovación', 'Excelencia', 'Transparencia'].map((value) => (
                      <div key={value} className="flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        <span className="text-lg font-medium text-gray-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                <div>
                  <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
                    Todo lo que necesitas en{' '}
                    <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                      un solo lugar
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600">
                    Smart Salud integra todas las herramientas necesarias para gestionar tu salud de manera eficiente y segura.
                  </p>
                </div>
                <div className="grid gap-4">
                  {features.map((feature, index) => (
                    <div
                      key={feature}
                      className="flex items-center gap-4 p-5 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors"
                    >
                      <div className="p-1 bg-emerald-100 rounded-full">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                      </div>
                      <span className="text-lg font-medium text-gray-800">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2 relative animate-in fade-in slide-in-from-right-8 duration-1000">
                <div className="rounded-3xl overflow-hidden shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent mix-blend-multiply z-10" />
                  <img
                    src="https://images.unsplash.com/photo-1758653500437-26660f405fe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZWRpY2FsJTIwdGVhbSUyMGhvc3BpdGFsfGVufDF8fHx8MTc3NjIwNDYyMnww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Medical team"
                    className="w-full h-[500px] lg:h-[600px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-emerald-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="animate-in fade-in zoom-in-95 duration-1000">
              <div className="inline-flex p-4 rounded-full bg-white/10 backdrop-blur mb-8">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
                ¿Listo para tomar el control de tu salud?
              </h2>
              <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto">
                Únete a miles de pacientes que ya confían en Smart Salud para gestionar su bienestar y el de sus familias.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  onClick={() => router.push(isAuthenticated ? '/reservar' : '/registro')}
                  className="bg-white text-emerald-600 hover:bg-gray-50 shadow-xl h-16 px-10 text-lg rounded-xl transition-transform hover:scale-105"
                >
                  Comenzar Ahora Mismo
                  <ChevronRight className="ml-2 h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
