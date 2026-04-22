"use client"

import { Heart, Facebook, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Smart Salud</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Policlinico VidaSalud - Mas de 14 años brindando atencion medica de calidad a las familias peruanas.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Linkedin, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-blue-500 rounded-lg flex items-center justify-center transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rapidos</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#nosotros" className="hover:text-white transition-colors">Nosotros</a></li>
              <li><a href="#especialidades" className="hover:text-white transition-colors">Especialidades</a></li>
              <li><a href="#contacto" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="font-semibold mb-4">Especialidades</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Cardiologia</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Neurologia</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pediatria</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Medicina General</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dermatologia</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-emerald-500" />
                <span>Av. Javier Prado 1234, San Isidro, Lima</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>(01) 234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>citas@smartsalud.pe</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>Lun - Sab: 7:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 Smart Salud - Policlinico VidaSalud. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Terminos y Condiciones</a>
            <a href="#" className="hover:text-white transition-colors">Politica de Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
