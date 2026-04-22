"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Shield, Users, Star, CheckCircle, ArrowRight, Heart } from "lucide-react"

export default function HeroSection() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-blue-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2310b981%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 mb-6">
                <Heart className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Tu salud, nuestra prioridad</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 text-balance">
                Cuidamos de tu{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                  salud
                </span>
                {" "}con tecnologia y humanidad
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed text-pretty">
                Policlinico Smart Salud en Ate, Lima. Tu portal integral de salud. 
                Reserva citas medicas, accede a tus resultados, gestiona tus recetas 
                y manten el control total de tu bienestar en un solo lugar.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/reservar"
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
                >
                  <Calendar className="w-5 h-5" />
                  Reservar Cita Ahora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/especialidades"
                  className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-lg font-medium"
                >
                  Conocer Servicios
                </Link>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1080&q=80"
                  alt="Clinica medica moderna"
                  width={600}
                  height={500}
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              
              {/* Stats overlay */}
              <div className="absolute -bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Pacientes", value: "50K+" },
                  { label: "Especialistas", value: "200+" },
                  { label: "Satisfaccion", value: "98%" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/95 backdrop-blur rounded-xl p-4 text-center shadow-lg"
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Floating testimonial */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl max-w-xs hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                    MR
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">&quot;Excelente atencion&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Servicios que{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                transforman
              </span>
              {" "}tu experiencia
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tecnologia de punta y atencion personalizada para cuidar de ti y tu familia
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Calendar, title: "Reserva Express", description: "Agenda tu cita en 3 clics desde cualquier dispositivo", color: "from-emerald-500 to-emerald-600" },
              { icon: Shield, title: "Especialistas Certificados", description: "Accede a mas de 50 especialidades medicas", color: "from-blue-500 to-blue-600" },
              { icon: Clock, title: "Historial Medico", description: "Toda tu informacion clinica en un solo lugar", color: "from-purple-500 to-purple-600" },
              { icon: Users, title: "Telemedicina", description: "Consultas online desde la comodidad de tu hogar", color: "from-cyan-500 to-cyan-600" },
            ].map((service) => (
              <div
                key={service.title}
                className="group p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} mb-4`}>
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?w=1080&q=80"
                alt="Profesional de salud"
                width={600}
                height={400}
                className="w-full h-[400px] object-cover"
              />
            </div>

            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Nuestra Mision</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Democratizar el acceso a servicios de salud de calidad mediante tecnologia innovadora,
                  facilitando la conexion entre pacientes y profesionales medicos, mientras mantenemos
                  el foco en la atencion humanizada y personalizada.
                </p>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Star className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Nuestra Vision</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Ser la plataforma lider de salud digital en Peru, reconocida por transformar
                  la experiencia del paciente a traves de soluciones tecnologicas que simplifican,
                  integran y mejoran el acceso a la atencion medica en Lima y todo el pais.
                </p>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Nuestros Valores</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["Empatia", "Innovacion", "Excelencia", "Transparencia"].map((value) => (
                    <div key={value} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
                Todo lo que necesitas en{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                  un solo lugar
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Smart Salud integra todas las herramientas necesarias para gestionar tu salud de manera eficiente y segura.
              </p>
              <div className="space-y-4">
                {[
                  "Atencion 24/7 para emergencias",
                  "Sistema de pago seguro y flexible",
                  "Recordatorios automaticos de citas",
                  "Acceso a resultados de examenes",
                  "Recetas medicas digitales",
                  "Red de farmacias asociadas",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100"
                  >
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1080&q=80"
                alt="Equipo medico"
                width={600}
                height={500}
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-emerald-500 to-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Clock className="h-12 w-12 text-white mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            ¿Listo para tomar el control de tu salud?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Unete a miles de pacientes que ya confian en Smart Salud para gestionar su bienestar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservar"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-xl hover:bg-gray-100 transition-all font-semibold shadow-lg"
            >
              Comenzar Ahora
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all font-semibold"
            >
              Contactanos
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
