"use client"

import { FileText, Download, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDocuments } from '@/contexts/documents-context'
import { useAuth } from '@/contexts/auth-context'

export default function DocumentsPage() {
  const { user } = useAuth()
  const { getPatientDocuments } = useDocuments()

  const documents = user ? getPatientDocuments(user.email) : []

  const getDocumentIcon = (type: string) => {
    return <FileText className="h-6 w-6 text-red-600" />
  }

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <FolderOpen className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Mis Documentos</h2>
          <p className="text-sm text-muted-foreground">
            Archivo clínico y documentos médicos ({documents.length})
          </p>
        </div>
      </div>

      {documents.length > 0 ? (
        <>
          {/* Desktop: Large Icons View */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all hover:border-red-200 group shadow-sm"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-red-50 rounded-xl group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300">
                    {getDocumentIcon(doc.type)}
                  </div>
                  <div className="space-y-1.5 w-full">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2" title={doc.title}>{doc.title}</h3>
                    <p className="text-xs font-medium uppercase tracking-wider text-red-600">{getTypeLabel(doc.type)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.date).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
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

          {/* Mobile: List View */}
          <div className="md:hidden space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-red-50 rounded-xl flex-shrink-0">
                    {getDocumentIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{doc.title}</h3>
                    <div className="flex items-center gap-2 text-xs font-medium text-red-600 mb-1">
                      <span>{getTypeLabel(doc.type)}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.date).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <Button variant="outline" size="icon" className="flex-shrink-0 mt-1 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-12 text-center shadow-inner">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FolderOpen className="h-10 w-10 text-orange-400" />
          </div>
          <h3 className="font-semibold text-xl mb-2 text-gray-900">No tienes documentos aún</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Tus documentos médicos, exámenes y recetas aparecerán aquí una vez que sean cargados por el personal médico.
          </p>
        </div>
      )}
    </div>
  )
}
