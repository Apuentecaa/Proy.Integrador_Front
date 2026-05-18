"use client"

import { Download, Eye, TestTube, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function LabResultsPage() {
  const results = [
    {
      id: 1,
      date: '2026-04-05',
      exam: 'Hemograma Completo',
      status: 'completado',
      doctor: 'Dr. González',
    },
    {
      id: 2,
      date: '2026-03-20',
      exam: 'Perfil Lipídico',
      status: 'completado',
      doctor: 'Dr. Rodríguez',
    },
    {
      id: 3,
      date: '2026-03-15',
      exam: 'Glucosa en Ayunas',
      status: 'completado',
      doctor: 'Dr. González',
    },
    {
      id: 4,
      date: '2026-02-28',
      exam: 'Función Renal',
      status: 'completado',
      doctor: 'Dr. Martínez',
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <TestTube className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Resultados de Laboratorio</h2>
          <p className="text-sm text-muted-foreground">
            Accede a tus exámenes médicos
          </p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Examen</TableHead>
              <TableHead>Médico Solicitante</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium">
                  {new Date(result.date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>{result.exam}</TableCell>
                <TableCell>{result.doctor}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Completado
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {results.map((result) => (
          <div key={result.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <p className="font-semibold text-gray-900">{result.exam}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {new Date(result.date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <p className="text-sm text-gray-500">{result.doctor}</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Completado
              </Badge>
            </div>
            <Button variant="outline" size="sm" className="w-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
