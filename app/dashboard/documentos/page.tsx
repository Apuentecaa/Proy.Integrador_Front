"use client"

import { useEffect, useState } from 'react'
import { FileText, Download, FolderOpen, Stethoscope, Pill, ClipboardList, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDocuments } from '@/contexts/documents-context'
import { useAuth } from '@/contexts/auth-context'
import { listarHistorialPaciente, type HistorialClinico } from '@/lib/api/historial'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function DocumentsPage() {
  const { user } = useAuth()
  const { getPatientDocuments } = useDocuments()

  const documents = user ? getPatientDocuments(user.email) : []

  const [historial, setHistorial] = useState<HistorialClinico[]>([])
  const [loadingHist, setLoadingHist] = useState(false)

  // Trae el historial clínico real (diagnósticos que escribió el médico)
  useEffect(() => {
    if (!user?.pacienteId) return
    setLoadingHist(true)
    listarHistorialPaciente(user.pacienteId)
      .then(setHistorial)
      .catch((e) => console.warn('No se pudo cargar el historial', e))
      .finally(() => setLoadingHist(false))
  }, [user?.pacienteId])

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      lab_result: 'Resultado de Laboratorio',
      prescription: 'Receta Médica',
      medical_report: 'Informe Médico',
      imaging: 'Imagen Diagnóstica',
    }
    return labels[type] || 'Documento'
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <FolderOpen className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Mi Historial Clínico</h2>
          <p className="text-sm text-muted-foreground">
            Diagnósticos, recetas y documentos médicos
          </p>
        </div>
      </div>

      {/* ============ HISTORIAL CLÍNICO (desde la BD) ============ */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
          <Stethoscope className="h-5 w-5 text-emerald-600" />
          Atenciones Médicas ({historial.length})
        </h3>

        {loadingHist ? (
          <div className="p-8 text-center text-gray-400">
            <Loader2 className="h-6 w-6 mx-auto animate-spin text-emerald-500 mb-2" />
            <p className="text-sm">Cargando historial...</p>
          </div>
        ) : historial.length > 0 ? (
          <div className="space-y-4">
            {historial.map((h) => (
              <div key={h.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-emerald-600" />
                    Consulta del {format(new Date(h.fecha), "d 'de' MMMM yyyy", { locale: es })}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  {h.diagnostico && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">Diagnóstico</p>
                      <p className="text-gray-800">{h.diagnostico}</p>
                    </div>
                  )}
                  {h.tratamiento && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <Pill className="h-3 w-3" /> Receta / Tratamiento
                      </p>
                      <p className="text-gray-800">{h.tratamiento}</p>
                    </div>
                  )}
                  {h.observaciones && (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Indicaciones</p>
                      <p className="text-gray-800">{h.observaciones}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-500">
            <Stethoscope className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>Aún no tienes atenciones registradas.</p>
            <p className="text-xs mt-1">Cuando un médico te atienda, su diagnóstico aparecerá aquí.</p>
          </div>
        )}
      </section>

      {/* ============ DOCUMENTOS (recetas/exámenes locales) ============ */}
      {documents.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <FileText className="h-5 w-5 text-red-600" />
            Documentos ({documents.length})
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all hover:border-red-200 group shadow-sm"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-red-50 rounded-xl group-hover:bg-red-100 transition-all">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="space-y-1.5 w-full">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2" title={doc.title}>{doc.title}</h3>
                    <p className="text-xs font-medium uppercase tracking-wider text-red-600">{getTypeLabel(doc.type)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
