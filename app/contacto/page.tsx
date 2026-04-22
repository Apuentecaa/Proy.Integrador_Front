"use client"

import { useState } from "react"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Building2, 
  Users, 
  Send,
  CheckCircle,
  MessageSquare
} from "lucide-react"

const sedes = [
  {
    name: "Sede Central - San Isidro",
    address: "Av. Javier Prado 1234",
    floor: "Piso 3, Consultorios 301-315",
    phone: "(01) 234-5678",
    hours: "Lun - Sab: 7:00 AM - 9:00 PM",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80"
  },
  {
    name: "Sede Miraflores",
    address: "Av. Larco 567",
    floor: "Piso 2, Consultorios 201-210",
    phone: "(01) 345-6789",
    hours: "Lun - Vie: 8:00 AM - 8:00 PM",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80"
  },
  {
    name: "Sede Surco",
    address: "Av. Primavera 890",
    floor: "Piso 1, Consultorios 101-108",
    phone: "(01) 456-7890",
    hours: "Lun - Sab: 8:00 AM - 6:00 PM",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80"
  },
]

const contactInfo = [
  {
    icon: Phone,
    label: "Central Telefonica",
    value: "(01) 234-5678",
    description: "Lunes a Sabado de 7am a 9pm"
  },
  {
    icon: Mail,
    label: "Correo Electronico",
    value: "citas@smartsalud.pe",
    description: "Respuesta en menos de 24 horas"
  },
  {
    icon: Users,
    label: "WhatsApp",
    value: "+51 987 654 321",
    description: "Atencion inmediata"
  }
]

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: ""
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" })
  }

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
                  <MessageSquare className="w-4 h-4" />
                  Contactanos
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
                  Estamos aqui para ayudarte
                </h1>
                <p className="text-xl text-white/90 max-w-xl text-pretty">
                  ¿Tienes alguna consulta? Nuestro equipo esta disponible para brindarte 
                  toda la informacion que necesitas.
                </p>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
                    alt="Recepcion clinica"
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

        {/* Contact Info Cards */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-center gap-4 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{info.label}</p>
                    <p className="font-bold text-gray-900">{info.value}</p>
                    <p className="text-xs text-gray-500">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Image */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Envianos un mensaje</h2>
                <p className="text-gray-500 mb-6">Completa el formulario y te responderemos lo antes posible.</p>
                
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Mensaje enviado</h3>
                    <p className="text-gray-500">Te contactaremos pronto.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                        <input
                          type="text"
                          required
                          value={formData.nombre}
                          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Juan Perez"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
                        <input
                          type="tel"
                          value={formData.telefono}
                          onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="+51 999 999 999"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Correo electronico</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="juan@ejemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                      <select
                        value={formData.asunto}
                        onChange={(e) => setFormData({...formData, asunto: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Selecciona un asunto</option>
                        <option value="citas">Consulta sobre citas</option>
                        <option value="servicios">Informacion de servicios</option>
                        <option value="precios">Consulta de precios</option>
                        <option value="reclamo">Reclamo o sugerencia</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.mensaje}
                        onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                        placeholder="Escribe tu mensaje aqui..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all font-semibold shadow-lg hover:shadow-xl"
                    >
                      <Send className="w-5 h-5" />
                      Enviar Mensaje
                    </button>
                  </form>
                )}
              </div>

              {/* Image & Hours */}
              <div className="space-y-6">
                <div className="relative rounded-3xl overflow-hidden shadow-xl h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80"
                    alt="Equipo medico"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="font-bold text-xl mb-2">Nuestro equipo te espera</h3>
                    <p className="text-white/80 text-sm">Profesionales comprometidos con tu bienestar</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    Horarios de Atencion
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lunes - Viernes</span>
                      <span className="font-medium text-gray-900">7:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sabados</span>
                      <span className="font-medium text-gray-900">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Domingos</span>
                      <span className="font-medium text-gray-500">Cerrado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Locations */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                <MapPin className="w-4 h-4" />
                Ubicaciones
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
                Nuestras Sedes
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-pretty">
                Visitanos en cualquiera de nuestras sedes estrategicamente ubicadas en Lima.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {sedes.map((sede) => (
                <div
                  key={sede.name}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
                >
                  <div className="relative h-48">
                    <Image
                      src={sede.image}
                      alt={sede.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-bold text-white">{sede.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 flex items-start gap-2">
                        <Building2 className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span>{sede.address}</span>
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
                    <button className="mt-4 w-full py-2.5 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-colors">
                      Ver en mapa
                    </button>
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
