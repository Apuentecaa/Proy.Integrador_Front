"use client"

import { useState } from 'react'
import { Pill, Clock, Info, Sun, Sunset, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function PrescriptionsPage() {
  const medications = [
    {
      id: 1,
      name: 'Losartán 50mg',
      doctor: 'Dr. González',
      startDate: '2026-01-15',
      duration: '6 meses',
      instructions: 'Tomar 1 comprimido cada 24 horas',
      schedule: { morning: true, afternoon: false, night: false },
      notes: 'Tomar con el estómago vacío, preferiblemente en la mañana.',
    },
    {
      id: 2,
      name: 'Omeprazol 20mg',
      doctor: 'Dr. Rodríguez',
      startDate: '2026-02-01',
      duration: '3 meses',
      instructions: 'Tomar 1 cápsula antes del desayuno',
      schedule: { morning: true, afternoon: false, night: false },
      notes: 'Tomar 30 minutos antes de la primera comida del día.',
    },
    {
      id: 3,
      name: 'Simvastatina 20mg',
      doctor: 'Dr. González',
      startDate: '2026-01-15',
      duration: 'Permanente',
      instructions: 'Tomar 1 comprimido por la noche',
      schedule: { morning: false, afternoon: false, night: true },
      notes: 'Tomar antes de dormir. Evitar consumo excesivo de alcohol.',
    },
  ]

  const [selectedMed, setSelectedMed] = useState<typeof medications[0] | null>(null)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Pill className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Recetas Digitales</h2>
          <p className="text-sm text-muted-foreground">
            Medicamentos activos y prescripciones
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {medications.map((med) => (
          <div
            key={med.id}
            className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 shadow-sm hover:shadow-md transition-all hover:border-purple-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{med.name}</h3>
                <p className="text-sm text-gray-500">{med.doctor}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-purple-600 font-medium">
                <Clock className="h-4 w-4" />
                <span>{med.duration}</span>
              </div>
              <p className="text-gray-700">{med.instructions}</p>
            </div>

            {/* Schedule Indicator */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tomar:</span>
              <div className="flex gap-2">
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                    med.schedule.morning
                      ? 'bg-yellow-100 text-yellow-700 font-medium'
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <Sun className="h-3 w-3" />
                  <span className="text-xs">AM</span>
                </div>
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                    med.schedule.afternoon
                      ? 'bg-orange-100 text-orange-700 font-medium'
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <Sunset className="h-3 w-3" />
                  <span className="text-xs">PM</span>
                </div>
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                    med.schedule.night
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <Moon className="h-3 w-3" />
                  <span className="text-xs">Noche</span>
                </div>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
                  onClick={() => setSelectedMed(med)}
                >
                  <Info className="mr-2 h-4 w-4" />
                  Ver Indicaciones
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl text-purple-900 flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    {med.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-5 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Médico Prescriptor
                      </p>
                      <p className="text-gray-900 font-medium">{med.doctor}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Fecha de Inicio
                      </p>
                      <p className="text-gray-900 font-medium">
                        {new Date(med.startDate).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Duración del Tratamiento
                    </p>
                    <p className="text-gray-900 font-medium bg-purple-50 text-purple-800 px-3 py-1.5 rounded-md inline-block">
                      {med.duration}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Instrucciones Principales
                    </p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">{med.instructions}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Horario Sugerido
                    </p>
                    <div className="flex gap-3">
                      {med.schedule.morning && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg shadow-sm">
                          <Sun className="h-5 w-5" />
                          <span className="font-medium">Mañana</span>
                        </div>
                      )}
                      {med.schedule.afternoon && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg shadow-sm">
                          <Sunset className="h-5 w-5" />
                          <span className="font-medium">Tarde</span>
                        </div>
                      )}
                      {med.schedule.night && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg shadow-sm">
                          <Moon className="h-5 w-5" />
                          <span className="font-medium">Noche</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 items-start">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Notas Adicionales</p>
                      <p className="text-sm text-blue-800">{med.notes}</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  )
}
