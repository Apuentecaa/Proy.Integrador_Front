"use client"

import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Clock, Check, AlertCircle, MapPin } from "lucide-react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

type EstadoSlot = "Confirmada" | "Reservada" | "Disponible" | "Atendido" | "Bloqueado"

interface SlotAgenda {
  hora: string
  estado: EstadoSlot
  paciente?: string
  motivo?: string
  sala?: string
}

const AGENDA_BASE: Record<string, SlotAgenda[]> = {
  "Lun": [
    { hora: "08:00", estado: "Atendido",   paciente: "Juan Pérez García",   motivo: "Control de presión",      sala: "Consultorio 1" },
    { hora: "08:30", estado: "Atendido",   paciente: "María López Sánchez", motivo: "Revisión post-op",        sala: "Consultorio 1" },
    { hora: "09:00", estado: "Confirmada", paciente: "Carlos Torres Ruiz",  motivo: "Dolor lumbar crónico",    sala: "Consultorio 1" },
    { hora: "09:30", estado: "Reservada",  paciente: "Ana Flores Huanca",   motivo: "Chequeo anual",           sala: "Consultorio 1" },
    { hora: "10:00", estado: "Disponible" },
    { hora: "10:30", estado: "Disponible" },
    { hora: "11:00", estado: "Bloqueado",  motivo: "Reunión de equipo médico" },
    { hora: "11:30", estado: "Disponible" },
    { hora: "14:00", estado: "Confirmada", paciente: "Roberto Vásquez Lima", motivo: "Perfil lipídico",        sala: "Consultorio 2" },
    { hora: "14:30", estado: "Disponible" },
    { hora: "15:00", estado: "Reservada",  paciente: "Lucía Torres Meza",   motivo: "Primera consulta",       sala: "Consultorio 2" },
    { hora: "15:30", estado: "Disponible" },
    { hora: "16:00", estado: "Disponible" },
    { hora: "16:30", estado: "Disponible" },
  ],
  "Mar": [
    { hora: "08:00", estado: "Confirmada", paciente: "Diego Ríos Soto",     motivo: "Control diabetes",       sala: "Consultorio 1" },
    { hora: "08:30", estado: "Disponible" },
    { hora: "09:00", estado: "Reservada",  paciente: "Carmen Chávez Vega",  motivo: "Dolor de cabeza",        sala: "Consultorio 1" },
    { hora: "09:30", estado: "Disponible" },
    { hora: "10:00", estado: "Disponible" },
    { hora: "10:30", estado: "Confirmada", paciente: "Marcos Paredes Ríos", motivo: "Seguimiento tratamiento", sala: "Consultorio 1" },
    { hora: "14:00", estado: "Disponible" },
    { hora: "14:30", estado: "Disponible" },
    { hora: "15:00", estado: "Disponible" },
  ],
}

const estadoConfig: Record<EstadoSlot, { label: string; cls: string; dot: string }> = {
  Atendido:   { label: "Atendido",    cls: "bg-green-100 text-green-700 border-green-200",   dot: "bg-green-500"   },
  Confirmada: { label: "Confirmada",  cls: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  Reservada:  { label: "Reservada",   cls: "bg-blue-100 text-blue-700 border-blue-200",      dot: "bg-blue-500"    },
  Disponible: { label: "Disponible",  cls: "bg-gray-100 text-gray-500 border-gray-200",      dot: "bg-gray-300"    },
  Bloqueado:  { label: "Bloqueado",   cls: "bg-red-100 text-red-600 border-red-200",         dot: "bg-red-500"     },
}

export default function AgendaPage() {
  const today = new Date()
  const [weekStart, setWeekStart] = useState(startOfWeek(today, { weekStartsOn: 1 }))
  const [selectedDay, setSelectedDay] = useState(0)

  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i))
  const dayKeys = ["Lun", "Mar", "Mie", "Jue", "Vie"]
  const slots: SlotAgenda[] = AGENDA_BASE[dayKeys[selectedDay]] ?? []

  const ocupados  = slots.filter(s => s.estado !== "Disponible" && s.estado !== "Bloqueado").length
  const libres    = slots.filter(s => s.estado === "Disponible").length
  const bloqueados = slots.filter(s => s.estado === "Bloqueado").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Agenda Médica</h1>
            <p className="text-sm text-white/80">Semana del {format(weekStart, "d 'de' MMMM", { locale: es })}</p>
          </div>
        </div>
      </div>

      {/* Selector de semana + días */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekStart(w => addDays(w, -7))}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {format(weekStart, "MMM d", { locale: es })} — {format(addDays(weekStart, 4), "MMM d", { locale: es })}
          </span>
          <button
            onClick={() => setWeekStart(w => addDays(w, 7))}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {weekDays.map((day, i) => {
            const isToday = isSameDay(day, today)
            const isSelected = selectedDay === i
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  isSelected
                    ? "bg-gradient-to-b from-emerald-500 to-blue-500 text-white shadow-md"
                    : isToday
                    ? "bg-emerald-50 border-2 border-emerald-300 text-emerald-700"
                    : "hover:bg-gray-50 text-gray-600 border border-gray-100"
                }`}
              >
                <span className="text-xs font-medium uppercase">{format(day, "EEE", { locale: es })}</span>
                <span className="text-lg font-bold mt-0.5">{format(day, "d")}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Resumen del día */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Ocupados",   value: ocupados,   color: "text-emerald-600 bg-emerald-50" },
          { label: "Libres",     value: libres,     color: "text-blue-600 bg-blue-50"       },
          { label: "Bloqueados", value: bloqueados, color: "text-red-600 bg-red-50"         },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color} border border-white`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lista de slots */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900">
            Horario — {format(weekDays[selectedDay], "EEEE d 'de' MMMM", { locale: es })}
          </h3>
        </div>

        {slots.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>Sin horario registrado para este día</p>
          </div>
        )}

        <div className="divide-y divide-gray-50">
          {slots.map((slot, i) => {
            const cfg = estadoConfig[slot.estado]
            return (
              <div key={i} className={`flex items-start gap-4 p-4 ${slot.estado === "Disponible" ? "opacity-60" : ""}`}>
                <div className="w-14 text-center shrink-0">
                  <span className="text-sm font-bold text-gray-700">{slot.hora}</span>
                </div>
                <div className={`w-1 self-stretch rounded-full ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  {slot.paciente ? (
                    <>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">{slot.paciente}</span>
                        <Badge className={`text-xs ${cfg.cls}`}>{cfg.label}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{slot.motivo}</p>
                      {slot.sala && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{slot.sala}</span>
                        </div>
                      )}
                    </>
                  ) : slot.estado === "Bloqueado" ? (
                    <p className="text-sm text-red-600 font-medium">{slot.motivo ?? "Bloqueado"}</p>
                  ) : (
                    <p className="text-sm text-gray-400">Slot disponible</p>
                  )}
                </div>
                <div className="shrink-0">
                  {slot.estado === "Atendido" && <Check className="w-4 h-4 text-green-500" />}
                  {slot.estado !== "Atendido" && slot.estado !== "Bloqueado" && (
                    <Clock className={`w-4 h-4 ${slot.estado === "Disponible" ? "text-gray-300" : "text-emerald-400"}`} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Leyenda</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(estadoConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
              <span className="text-xs text-gray-600">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
