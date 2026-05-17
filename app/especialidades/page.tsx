import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  Heart,
  Brain,
  Eye,
  Bone,
  Baby,
  Stethoscope,
  Activity,
  Pill,
  ArrowRight,
  Calendar,
  Users,
  Clock,
  Star
} from "lucide-react"

const specialties = [
  { 
    icon: Heart, 
    name: "Cardiologia", 
    description: "Diagnostico y tratamiento de enfermedades del corazon y sistema cardiovascular.",
    color: "from-red-500 to-pink-500",
    doctors: 8,
    avgWait: "15 min"
  },
  { 
    icon: Brain, 
    name: "Neurologia", 
    description: "Atencion especializada del sistema nervioso central y periferico.",
    color: "from-purple-500 to-indigo-500",
    doctors: 5,
    avgWait: "20 min"
  },
  { 
    icon: Eye, 
    name: "Oftalmologia", 
    description: "Cuidado integral de la salud visual y tratamiento de enfermedades oculares.",
    color: "from-blue-500 to-cyan-500",
    doctors: 6,
    avgWait: "10 min"
  },
  { 
    icon: Bone, 
    name: "Traumatologia", 
    description: "Tratamiento de lesiones y enfermedades del sistema musculoesqueletico.",
    color: "from-orange-500 to-amber-500",
    doctors: 7,
    avgWait: "25 min"
  },
  { 
    icon: Baby, 
    name: "Pediatria", 
    description: "Atencion medica integral para bebes, niños y adolescentes.",
    color: "from-pink-500 to-rose-500",
    doctors: 10,
    avgWait: "15 min"
  },
  { 
    icon: Stethoscope, 
    name: "Medicina General", 
    description: "Atencion primaria, chequeos preventivos y orientacion medica general.",
    color: "from-emerald-500 to-teal-500",
    doctors: 12,
    avgWait: "10 min"
  },
  { 
    icon: Activity, 
    name: "Medicina Interna", 
    description: "Diagnostico y tratamiento de enfermedades complejas en adultos.",
    color: "from-teal-500 to-cyan-500",
    doctors: 6,
    avgWait: "20 min"
  },
  { 
    icon: Pill, 
    name: "Dermatologia", 
    description: "Cuidado de la piel, cabello y uñas. Tratamientos esteticos y medicos.",
    color: "from-violet-500 to-purple-500",
    doctors: 4,
    avgWait: "15 min"
  },
]

const features = [
  {
    icon: Calendar,
    title: "Citas disponibles",
    description: "Reserva tu cita en linea las 24 horas del dia"
  },
  {
    icon: Users,
    title: "+50 especialistas",
    description: "Medicos certificados y con amplia experiencia"
  },
  {
    icon: Clock,
    title: "Horarios flexibles",
    description: "Atencion de lunes a sabado en multiples turnos"
  },
  {
    icon: Star,
    title: "98% satisfaccion",
    description: "Calificacion promedio de nuestros pacientes"
  }
]

export default function EspecialidadesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
                  <Stethoscope className="w-4 h-4" />
                  Nuestros Servicios
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
                  Especialidades Medicas
                </h1>
                <p className="text-xl text-white/90 max-w-xl text-pretty">
                  Contamos con un equipo de profesionales altamente calificados en diversas
                  especialidades para brindarte la mejor atencion medica.
                </p>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80"
                    alt="Equipo medico"
                    width={600}
                    height={400}
                    className="w-full h-[350px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/50 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{feature.title}</p>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialties Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {specialties.map((specialty) => (
                <div
                  key={specialty.name}
                  className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${specialty.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <specialty.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{specialty.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{specialty.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {specialty.doctors} medicos
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ~{specialty.avgWait}
                    </span>
                  </div>

                  <Link 
                    href="/reservar"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all hover:from-emerald-600 hover:to-blue-600"
                  >
                    <Calendar className="w-4 h-4" />
                    Reservar Cita
                  </Link>
                  
                  <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium group-hover:opacity-0 transition-opacity">
                    <span>Ver disponibilidad</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Doctors Preview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                  <Users className="w-4 h-4" />
                  Nuestros Medicos
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-balance">
                  Profesionales comprometidos con tu salud
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed text-pretty">
                  Nuestro equipo esta conformado por medicos con amplia experiencia y formacion 
                  en las mejores universidades del pais y del extranjero. Cada especialista 
                  esta comprometido con brindarte una atencion de calidad.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { value: "+50", label: "Medicos especialistas" },
                    { value: "15+", label: "Años de experiencia promedio" },
                    { value: "98%", label: "Satisfaccion de pacientes" },
                    { value: "24/7", label: "Disponibilidad online" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl">
                      <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/reservar"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all shadow-lg"
                >
                  <Calendar className="w-5 h-5" />
                  Reservar con un especialista
                </Link>
              </div>

              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?w=800&q=80"
                    alt="Doctor profesional"
                    width={600}
                    height={500}
                    className="w-full h-[500px] object-cover"
                  />
                </div>
                
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">4.9/5</p>
                      <p className="text-sm text-gray-500">Calificacion promedio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl p-8 lg:p-12 text-white">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-balance">
                ¿No encuentras la especialidad que buscas?
              </h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto text-pretty">
                Contactanos y te ayudaremos a encontrar al especialista adecuado para ti. 
                Nuestro equipo esta disponible para orientarte.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Contactar
                </Link>
                <Link
                  href="/reservar"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  Reservar Cita
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
