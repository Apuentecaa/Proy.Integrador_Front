"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-context'

export interface Document {
  id: string
  patientId: string
  title: string
  type: 'lab_result' | 'prescription' | 'medical_report' | 'imaging'
  date: string
  url: string
  createdBy: string
  createdAt: string
}

interface DocumentsContextType {
  documents: Document[]
  addDocument: (document: Omit<Document, 'id' | 'createdAt'>) => void
  deleteDocument: (id: string) => void
  getPatientDocuments: (patientId: string) => Document[]
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined)

const mockDocuments: Document[] = [
  {
    id: '1',
    patientId: 'user-1',
    title: 'Resultados de Laboratorio - Hemograma Completo',
    type: 'lab_result',
    date: '2026-04-15',
    url: '#',
    createdBy: 'admin',
    createdAt: '2026-04-15T10:30:00',
  },
  {
    id: '2',
    patientId: 'user-1',
    title: 'Receta Médica - Antibióticos',
    type: 'prescription',
    date: '2026-04-10',
    url: '#',
    createdBy: 'admin',
    createdAt: '2026-04-10T14:20:00',
  },
  {
    id: '3',
    patientId: 'user-1',
    title: 'Informe Médico - Consulta Cardiología',
    type: 'medical_report',
    date: '2026-04-08',
    url: '#',
    createdBy: 'admin',
    createdAt: '2026-04-08T16:45:00',
  },
  {
    id: '4',
    patientId: 'user-1',
    title: 'Radiografía de Tórax',
    type: 'imaging',
    date: '2026-04-05',
    url: '#',
    createdBy: 'admin',
    createdAt: '2026-04-05T11:00:00',
  },
]

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    const savedDocuments = localStorage.getItem('smartSaludDocuments')
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments))
    } else {
      setDocuments(mockDocuments)
      localStorage.setItem('smartSaludDocuments', JSON.stringify(mockDocuments))
    }
  }, [])

  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('smartSaludDocuments', JSON.stringify(documents))
    }
  }, [documents])

  const addDocument = (document: Omit<Document, 'id' | 'createdAt'>) => {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    }
    setDocuments((prev) => [...prev, newDocument])
  }

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const getPatientDocuments = (patientId: string) => {
    return documents.filter((doc) => doc.patientId === patientId)
  }

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        addDocument,
        deleteDocument,
        getPatientDocuments,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentsContext)
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentsProvider')
  }
  return context
}
