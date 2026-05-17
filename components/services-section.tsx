"use client"

import {
  Heart,
  Brain,
  Eye,
  Bone,
  Baby,
  Stethoscope,
  Activity,
  Pill,
  MapPin,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  ArrowRight,
  Users,
  Building2
} from "lucide-react"

const specialties = [
  { icon: Heart, name: "Cardiologia", description: "Diagnostico y tratamiento cardiovascular", color: "from-red-500 to-pink-500" },
  { icon: Brain, name: "Neurologia", description: "Atencion del sistema nervioso", color: "from-purple-500 to-indigo-500" },
  { icon: Eye, name: "Oftalmologia", description: "Cuidado integral de la vision", color: "from-blue-500 to-cyan-500" },
  { icon: Bone, name: "Traumatologia", description: "Sistema musculoesqueletico", color: "from-orange-500 to-amber-500" },
  { icon: Baby, name: "Pediatria", description: "Salud infantil y adolescente", color: "from-pink-500 to-rose-500" },
  { icon: Stethoscope, name: "Medicina General", description: "Atencion primaria integral", color: "from-emerald-500 to-teal-500" },
  { icon: Activity, name: "Medicina Interna", description: "Diagnostico y prevencion", color: "from-teal-500 to-cyan-500" },
  { icon: Pill, name: "Dermatologia", description: "Cuidado de la piel", color: "from-violet-500 to-purple-500" },
]

const sedes = [
  {
    name: "Sede Central - San Isidro",
    address: "Av. Javier Prado 1234",
    floor: "Piso 3, Consultorios 301-315",
    phone: "(01) 234-5678",
    hours: "Lun - Sab: 7:00 AM - 9:00 PM"
  },
  {
    name: "Sede Miraflores",
    address: "Av. Larco 567",
    floor: "Piso 2, Consultorios 201-210",
    phone: "(01) 345-6789",
    hours: "Lun - Vie: 8:00 AM - 8:00 PM"
  },
  {
    name: "Sede Surco",
    address: "Av. Primavera 890",
    floor: "Piso 1, Consultorios 101-108",
    phone: "(01) 456-7890",
    hours: "Lun - Sab: 8:00 AM - 6:00 PM"
  },
]

const benefits = [
  "Proceso guiado paso a paso con interfaz intuitiva",
  "Disponibilidad de horarios en tiempo real",
  "Multiples metodos de pago: Yape, Plin, tarjeta",
  "Comprobante digital inmediato por correo",
  "Recordatorios automaticos de tu cita",
  "Historial de citas y documentos medicos"
]

export default function ServicesSection() {
  return (
    <>
      {/* About Section */}
      <section id="nosotros" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                Sobre Nosotros
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-balance">
                Mas de 14 años cuidando la salud de las familias peruanas
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-pretty">
                Policlinico VidaSalud nacio con la mision de brindar atencion medica de calidad, 
                accesible y con tecnologia de vanguardia. Contamos con un equipo de mas de 50 
                profesionales altamente calificados y 3 sedes estrategicamente ubicadas en Lima.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl">
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">+50K</p>
                  <p className="text-sm text-gray-600">Pacientes atendidos</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl">
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">98%</p>
                  <p className="text-sm text-gray-600">Satisfaccion</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl">
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">14</p>
                  <p className="text-sm text-gray-600">Años de experiencia</p>
                </div>
              </div>

              <div className="space-y-3">
                {benefits.slice(0, 3).map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">¿Por que elegirnos?</h3>
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
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-200 rounded-full -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-200 rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="especialidades" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              <Stethoscope className="w-4 h-4" />
              Nuestros Servicios
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
              Especialidades Medicas
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-pretty">
              Contamos con un equipo de profesionales altamente calificados en diversas
              especialidades para brindarte la mejor atencion medica.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialties.map((specialty) => (
              <div
                key={specialty.name}
                className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${specialty.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <specialty.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{specialty.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{specialty.description}</p>
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Ver medicos</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Locations Section */}
      <section id="contacto" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" />
              Contacto
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
              Nuestras Sedes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-pretty">
              Visitanos en cualquiera de nuestras sedes estrategicamente ubicadas en Lima.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {sedes.map((sede) => (
              <div
                key={sede.name}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{sede.name}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 flex items-start gap-2">
                    <Building2 className="w-4 h-4 mt-0.5 text-gray-400" />
                    {sede.address}
                  </p>
                  <p className="text-gray-500 ml-6">{sede.floor}</p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {sede.phone}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {sede.hours}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                  ¿Tienes alguna consulta?
                </h3>
                <p className="text-white/90 mb-6">
                  Nuestro equipo esta disponible para ayudarte. Contactanos por cualquiera de estos medios.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Central telefonica</p>
                      <p className="font-semibold">(01) 234-5678</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Correo electronico</p>
                      <p className="font-semibold">citas@smartsalud.pe</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">WhatsApp</p>
                      <p className="font-semibold">+51 987 654 321</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6">
                <h4 className="font-bold text-gray-900 mb-4">Envianos un mensaje</h4>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Correo electronico"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Tu mensaje"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all font-semibold"
                  >
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
