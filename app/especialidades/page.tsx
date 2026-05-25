"use client"

import { useState } from 'react'
import { Search, Filter, X, MapPin, Calendar, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useDoctors } from '@/contexts/doctors-context'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function SearchDoctorsPage() {
  const router = useRouter()
  const { doctors: allDoctors, specialties } = useDoctors()
  const [filters, setFilters] = useState({
    specialty: '',
    doctor: '',
    availability: '',
    searchTerm: '',
  })

  const filteredDoctors = allDoctors.filter((doctor) => {
    const matchesSpecialty = !filters.specialty || filters.specialty === 'all' || doctor.specialty === filters.specialty
    const matchesDoctor = !filters.doctor || filters.doctor === 'all' || doctor.id === filters.doctor
    const matchesAvailability = !filters.availability || filters.availability === 'all' || doctor.availability === filters.availability
    const matchesSearch = !filters.searchTerm ||
      doctor.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(filters.searchTerm.toLowerCase())
    const matchesStatus = doctor.status === 'active'

    return matchesSpecialty && matchesDoctor && matchesAvailability && matchesSearch && matchesStatus
  })

  const doctorsBySpecialty = filters.specialty
    ? allDoctors.filter(d => d.specialty === filters.specialty)
    : []

  const clearFilters = () => {
    setFilters({ specialty: '', doctor: '', availability: '', searchTerm: '' })
  }

  const handleBookDoctor = (doctorId: string, specialty: string) => {
    router.push(`/reservar?specialty=${encodeURIComponent(specialty)}&doctor=${doctorId}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-grow bg-gradient-to-br from-emerald-50 via-blue-50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            Encuentra a tu{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Médico Ideal
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Busca por especialidad, nombre o disponibilidad y agenda tu cita en nuestro Policlínico Smart Salud - Sede Ate.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="shadow-lg border-emerald-100/50">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 text-gray-800">
                <Filter className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-lg">Filtros de Búsqueda Avanzada</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre del doctor o especialidad..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="pl-12 h-14 text-lg rounded-xl border-gray-200 focus:ring-emerald-500 shadow-sm"
                />
              </div>

              {/* Filter row */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Especialidad</Label>
                  <Select
                    value={filters.specialty || undefined}
                    onValueChange={(value) => setFilters({ ...filters, specialty: value, doctor: '' })}
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:ring-emerald-500 rounded-lg">
                      <SelectValue placeholder="Todas las especialidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-gray-500 italic">Todas las especialidades</SelectItem>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Médico Específico</Label>
                  <Select
                    value={filters.doctor || undefined}
                    onValueChange={(value) => setFilters({ ...filters, doctor: value })}
                    disabled={!filters.specialty || filters.specialty === 'all'}
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:ring-emerald-500 rounded-lg">
                      <SelectValue placeholder={!filters.specialty || filters.specialty === 'all' ? "Selecciona una especialidad primero" : "Cualquier médico"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-gray-500 italic">Cualquier médico</SelectItem>
                      {doctorsBySpecialty.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Horario de Disponibilidad</Label>
                  <Select
                    value={filters.availability || undefined}
                    onValueChange={(value) => setFilters({ ...filters, availability: value })}
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:ring-emerald-500 rounded-lg">
                      <SelectValue placeholder="Cualquier horario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-gray-500 italic">Cualquier horario</SelectItem>
                      <SelectItem value="Mañana">Turno Mañana (9:00 - 13:00)</SelectItem>
                      <SelectItem value="Tarde">Turno Tarde (14:00 - 18:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active filters */}
              {(filters.specialty && filters.specialty !== 'all' || filters.doctor && filters.doctor !== 'all' || filters.availability && filters.availability !== 'all' || filters.searchTerm) && (
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mr-2">Filtros activos:</span>
                  {filters.specialty && filters.specialty !== 'all' && (
                    <Badge variant="secondary" className="gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 py-1.5 px-3">
                      {filters.specialty}
                      <X
                        className="h-3.5 w-3.5 cursor-pointer ml-1"
                        onClick={() => setFilters({ ...filters, specialty: '', doctor: '' })}
                      />
                    </Badge>
                  )}
                  {filters.availability && filters.availability !== 'all' && (
                    <Badge variant="secondary" className="gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 py-1.5 px-3">
                      Turno {filters.availability}
                      <X
                        className="h-3.5 w-3.5 cursor-pointer ml-1"
                        onClick={() => setFilters({ ...filters, availability: '' })}
                      />
                    </Badge>
                  )}
                  {filters.searchTerm && (
                    <Badge variant="secondary" className="gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 py-1.5 px-3">
                      "{filters.searchTerm}"
                      <X
                        className="h-3.5 w-3.5 cursor-pointer ml-1"
                        onClick={() => setFilters({ ...filters, searchTerm: '' })}
                      />
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto">
                    Limpiar todos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Resultados de tu búsqueda</h2>
            <p className="text-emerald-600 font-medium bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
              {filteredDoctors.length} {filteredDoctors.length === 1 ? 'médico disponible' : 'médicos disponibles'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-emerald-300 group flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-gray-900 group-hover:text-emerald-700 transition-colors">{doctor.name}</CardTitle>
                      <p className="font-medium text-emerald-600 mt-1">{doctor.specialty}</p>
                    </div>
                    <Badge variant="secondary" className="gap-1 bg-yellow-50 text-yellow-700 border-yellow-200 px-2 py-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                      {doctor.rating}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-100 rounded-md">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                      <span><strong className="text-gray-900">Experiencia:</strong> {doctor.experience}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-blue-50 rounded-md">
                        <Clock className="h-4 w-4 text-blue-500" />
                      </div>
                      <span><strong className="text-gray-900">Turno:</strong> {doctor.availability}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-red-50 rounded-md">
                        <MapPin className="h-4 w-4 text-red-500" />
                      </div>
                      <span>Policlínico Smart Salud - Ate</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-4 border-t border-gray-100 mt-auto">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 animate-pulse shrink-0" />
                      <p className="text-sm text-emerald-900 leading-tight">
                        <strong>Próximo turno disponible:</strong><br />
                        {doctor.nextSlot}
                      </p>
                    </div>

                    <Button
                      className="w-full h-12 text-md bg-gray-900 hover:bg-emerald-600 text-white shadow-md transition-all group-hover:shadow-lg"
                      onClick={() => handleBookDoctor(doctor.id, doctor.specialty)}
                    >
                      Reservar Cita
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <Card className="p-16 text-center shadow-sm border-dashed border-2 border-gray-200 bg-gray-50/50">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">No encontramos coincidencias</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                Lo sentimos, no hay médicos que coincidan con tus criterios de búsqueda actuales. Intenta ajustar los filtros o buscar en otra especialidad.
              </p>
              <Button variant="outline" size="lg" onClick={clearFilters} className="rounded-full px-8 border-gray-300 hover:bg-gray-100">
                Limpiar todos los filtros
              </Button>
            </Card>
          )}
        </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
