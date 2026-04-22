import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { 
  Building2, 
  CheckCircle, 
  Users, 
  Award, 
  Clock, 
  Heart,
  Shield,
  Sparkles,
  Target
} from "lucide-react"

const stats = [
  { value: "+50K", label: "Pacientes atendidos", icon: Users },
  { value: "98%", label: "Satisfaccion", icon: Award },
  { value: "14", label: "Años de experiencia", icon: Clock },
  { value: "3", label: "Sedes en Lima", icon: Building2 },
]

const benefits = [
  "Proceso guiado paso a paso con interfaz intuitiva",
  "Disponibilidad de horarios en tiempo real",
  "Multiples metodos de pago: Yape, Plin, tarjeta",
  "Comprobante digital inmediato por correo",
  "Recordatorios automaticos de tu cita",
  "Historial de citas y documentos medicos"
]

const values = [
  {
    icon: Heart,
    title: "Compromiso con el Paciente",
    description: "Cada paciente es unico y merece atencion personalizada y de calidad."
  },
  {
    icon: Shield,
    title: "Seguridad y Confianza",
    description: "Protocolos estrictos de seguridad y privacidad en todos nuestros procesos."
  },
  {
    icon: Sparkles,
    title: "Innovacion Constante",
    description: "Tecnologia de vanguardia para mejorar la experiencia de nuestros pacientes."
  },
  {
    icon: Target,
    title: "Excelencia Medica",
    description: "Profesionales altamente capacitados y en constante actualizacion."
  }
]

const team = [
  { 
    name: "Dr. Carlos Martinez", 
    role: "Director Medico", 
    specialty: "Cardiologia",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80"
  },
  { 
    name: "Dra. Maria Garcia", 
    role: "Jefa de Pediatria", 
    specialty: "Pediatria",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80"
  },
  { 
    name: "Dr. Jose Rodriguez", 
    role: "Jefe de Neurologia", 
    specialty: "Neurologia",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80"
  },
  { 
    name: "Dra. Ana Torres", 
    role: "Coordinadora General", 
    specialty: "Medicina Interna",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80"
  },
]

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 py-20 lg:py-28">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              Conocenos
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
              Mas de 14 años cuidando la salud de las familias peruanas
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto text-pretty">
              Policlinico Smart Salud nacio con la mision de brindar atencion medica de calidad, 
              accesible y con tecnologia de vanguardia.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
                  <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
                  <Heart className="w-4 h-4" />
                  Nuestra Historia
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-balance">
                  Un compromiso con tu bienestar desde el primer dia
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed text-pretty">
                  Fundado en 2012, Smart Salud comenzo como un pequeño consultorio con la vision 
                  de transformar la atencion medica en Peru. Hoy, contamos con un equipo de mas de 
                  50 profesionales altamente calificados y 3 sedes estrategicamente ubicadas en Lima.
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed text-pretty">
                  Nuestra plataforma digital permite a nuestros pacientes gestionar sus citas de 
                  manera facil y rapida, con disponibilidad en tiempo real y multiples opciones de pago.
                </p>
                
                <div className="space-y-3">
                  {benefits.slice(0, 4).map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?w=800&q=80"
                    alt="Profesional de salud"
                    width={600}
                    height={500}
                    className="w-full h-[500px] object-cover"
                  />
                </div>
                
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-200 rounded-full -z-10" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-200 rounded-full -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-3xl overflow-hidden shadow-xl order-2 lg:order-1">
                <Image
                  src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80"
                  alt="Equipo medico trabajando"
                  width={600}
                  height={500}
                  className="w-full h-[500px] object-cover"
                />
              </div>

              <div className="order-1 lg:order-2">
                <div className="bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6">Beneficios de nuestra plataforma</h3>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={benefit} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="font-bold">{index + 1}</span>
                        </div>
                        <p className="text-white/90">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                <Target className="w-4 h-4" />
                Nuestros Valores
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
                Principios que nos guian
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-pretty">
                Cada decision que tomamos esta fundamentada en nuestros valores institucionales.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="group bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-500">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                <Users className="w-4 h-4" />
                Nuestro Equipo
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
                Profesionales de excelencia
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-pretty">
                Conoce a los lideres de nuestro equipo medico, comprometidos con tu salud.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative h-64">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                    <p className="text-emerald-600 text-sm font-medium">{member.role}</p>
                    <p className="text-gray-500 text-sm mt-1">{member.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
