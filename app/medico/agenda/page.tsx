"use client"

import { useState, useEffect, useMemo } from "react"
import { Calendar, ChevronLeft, ChevronRight, Clock, Check, AlertCircle, MapPin, Loader2, WifiOff } from "lucide-react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { getAgendaRango, type CitaMedico } from "@/lib/api/medico"
import { ApiError } from "@/lib/api/client"

const estadoConfig: Record<string, { label: string; cls: string; dot: string }> = {
  ATENDIDO:   { label: "Atendido",   cls: "bg-green-100 text-green-700 border-green-200",      dot: "bg-green-500"   },
  CONFIRMADO: { label: "Confirmada", cls: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  RESERVADO:  { label: "Reservada",  cls: "bg-blue-100 text-blue-700 border-blue-200",         dot: "bg-blue-500"    },
  CANCELADO:  { label: "Cancelada",  cls: "bg-red-100 text-red-600 border-red-200",            dot: "bg-red-500"     },
  NO_ASISTIO: { label: "No asistió", cls: "bg-gray-100 text-gray-500 border-gray-200",         dot: "bg-gray-400"    },
}

// Mock fallback
const MOCK_AGENDA: Record<string, CitaMedico[]> = {}

export default function AgendaPage() {
  const today = new Date()
  const { user } = useAuth()
  const [weekStart, setWeekStart] = useState(startOfWeek(today, { weekStartsOn: 1 }))
  const [selectedDay, setSelectedDay] = useState(0)
  const [citas, setCitas] = useState<CitaMedico[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)

  const weekDays = useMemo(() => Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)), [weekStart])
  const selectedDate = weekDays[selectedDay]
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd")

  useEffect(() => {
    const medicoId = user?.medicoId
    if (!medicoId) {
      setCitas([])
      setUsingMock(true)
      setLoading(false)
      return
    }
    setLoading(true)
    const desde = format(weekDays[0], "yyyy-MM-dd")
    const hasta = format(weekDays[4], "yyyy-MM-dd")
    getAgendaRango(medicoId, desde, hasta)
      .then(data => { setCitas(data); setUsingMock(false) })
      .catch((err: ApiError) => {
        console.warn("Backend no disponible, usando mock vacío:", err.message)
        setCitas([])
        setUsingMock(true)
      })
      .finally(() => setLoading(false))
  }, [user?.medicoId, weekStart])

  // Generamos slots de 30min entre 08:00 y 18:00 y los cruzamos con las citas del día
  const HORAS = useMemo(() => {
    const out: string[] = []
    for (let h = 8; h < 18; h++) {
      out.push(`${String(h).padStart(2, "0")}:00`)
      out.push(`${String(h).padStart(2, "0")}:30`)
    }
    return out
  }, [])

  const citasDelDia = citas.filter(c => c.fecha === selectedDateStr)
  const slotsConCita = new Map<string, CitaMedico>()
  citasDelDia.forEach(c => slotsConCita.set(c.hora.substring(0, 5), c))

  const ocupados = citasDelDia.filter(c => c.estado !== "CANCELADO" && c.estado !== "NO_ASISTIO").length
  const libres = HORAS.length - slotsConCita.size

  return (
    <div className="space-y-6">

      {usingMock && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-800">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span><strong>Sin conexión al servidor:</strong> agenda sin datos del backend. Inicia sesión en <a href="/medico/login" className="underline font-semibold">/medico/login</a>.</span>
        </div>
      )}

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

      {/* Selector de semana */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setWeekStart(w => addDays(w, -7))} className="p-2 hover:bg-gray-100 rounded-xl">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {format(weekStart, "MMM d", { locale: es })} — {format(addDays(weekStart, 4), "MMM d", { locale: es })}
          </span>
          <button onClick={() => setWeekStart(w => addDays(w, 7))} className="p-2 hover:bg-gray-100 rounded-xl">
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

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Ocupados", value: ocupados, color: "text-emerald-600 bg-emerald-50" },
          { label: "Libres",   value: libres,   color: "text-blue-600 bg-blue-50"        },
          { label: "Total",    value: HORAS.length, color: "text-gray-600 bg-gray-50"    },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Slots */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900">
            Horario — {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-emerald-500 mb-3" />
            <p className="text-sm">Cargando agenda...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {HORAS.map(hora => {
              const cita = slotsConCita.get(hora)
              const cfg = cita ? estadoConfig[cita.estado] : null
              return (
                <div key={hora} className={`flex items-start gap-4 p-4 ${!cita ? "opacity-60" : ""}`}>
                  <div className="w-14 text-center shrink-0">
                    <span className="text-sm font-bold text-gray-700">{hora}</span>
                  </div>
                  <div className={`w-1 self-stretch rounded-full ${cfg?.dot ?? "bg-gray-200"}`} />
                  <div className="flex-1 min-w-0">
                    {cita ? (
                      <>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900 text-sm">
                            {cita.pacienteNombres} {cita.pacienteApellidos}
                          </span>
                          <Badge className={`text-xs ${cfg?.cls}`}>{cfg?.label}</Badge>
                        </div>
                        {cita.motivoConsulta && (
                          <p className="text-xs text-gray-500 mt-0.5">{cita.motivoConsulta}</p>
                        )}
                        {cita.sala && (
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{cita.sala}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-400">Slot disponible</p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {cita?.estado === "ATENDIDO"
                      ? <Check className="w-4 h-4 text-green-500" />
                      : <Clock className={`w-4 h-4 ${cita ? "text-emerald-400" : "text-gray-300"}`} />}
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
