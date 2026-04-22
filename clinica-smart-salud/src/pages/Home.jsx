import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
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
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
  ];

  const features = [
    'Atención 24/7 para emergencias',
    'Sistema de pago seguro y flexible',
    'Recordatorios automáticos de citas',
    'Acceso a resultados de exámenes',
    'Recetas médicas digitales',
    'Red de farmacias asociadas',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-blue-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 mb-6">
                <Heart className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Tu salud, nuestra prioridad</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                Cuidamos de tu{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                  salud
                </span>
                {' '}con tecnología y humanidad
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Policlínico Smart Salud en Ate, Lima. Tu portal integral de salud. Reserva citas médicas, accede a tus resultados, gestiona tus recetas y mantén el control total de tu bienestar en un solo lugar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate(isAuthenticated ? '/reservar' : '/registro')}
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  {isAuthenticated ? 'Reservar Cita Ahora' : 'Crear Cuenta Gratis'}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                {!isAuthenticated && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="border-2"
                  >
                    Ya tengo cuenta
                  </Button>
                )}
                {isAuthenticated && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/servicios')}
                    className="border-2"
                  >
                    Conocer Servicios
                  </Button>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1762625570087-6d98fca29531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZWRpY2FsJTIwY2xpbmljJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc2MjA0NjIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Modern medical clinic"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              {/* Stats overlay */}
              <div className="absolute -bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
                {[
                  { label: 'Pacientes', value: '50K+' },
                  { label: 'Especialistas', value: '200+' },
                  { label: 'Satisfacción', value: '98%' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Card className="bg-background/95 backdrop-blur">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Servicios que{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                transforman
              </span>
              {' '}tu experiencia
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tecnología de punta y atención personalizada para cuidar de ti y tu familia
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-emerald-200">
                    <CardContent className="p-6">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mision y Vision */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1666886573681-a8fbe983a3fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3NjIyMDAyMHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Healthcare professional"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 mb-4">
                    <Target className="h-6 w-6 text-emerald-600" />
                    <h3 className="text-2xl font-bold">Nuestra Misión</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Democratizar el acceso a servicios de salud de calidad mediante tecnología innovadora,
                    facilitando la conexión entre pacientes y profesionales médicos, mientras mantenemos
                    el foco en la atención humanizada y personalizada.
                  </p>
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 mb-4">
                    <Award className="h-6 w-6 text-blue-600" />
                    <h3 className="text-2xl font-bold">Nuestra Visión</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Ser la plataforma líder de salud digital en Perú, reconocida por transformar
                    la experiencia del paciente a través de soluciones tecnológicas que simplifican,
                    integran y mejoran el acceso a la atención médica en Lima y todo el país.
                  </p>
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                    <h3 className="text-2xl font-bold">Nuestros Valores</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['Empatía', 'Innovación', 'Excelencia', 'Transparencia'].map((value) => (
                      <div key={value} className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Todo lo que necesitas en{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                  un solo lugar
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Smart Salud integra todas las herramientas necesarias para gestionar tu salud de manera eficiente y segura.
              </p>
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758653500437-26660f405fe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVhbSUyMGhvc3BpdGFsfGVufDF8fHx8MTc3NjIwNDYyMnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Medical team"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-emerald-500 to-blue-500">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Clock className="h-12 w-12 text-white mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              ¿Listo para tomar el control de tu salud?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Únete a miles de pacientes que ya confían en Smart Salud para gestionar su bienestar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate(isAuthenticated ? '/reservar' : '/registro')}
                className="bg-white text-emerald-600 hover:bg-gray-100 shadow-lg"
              >
                Comenzar Ahora
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/contacto')}
                className="border-2 border-white text-white hover:bg-white/10"
              >
                Contáctanos
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
