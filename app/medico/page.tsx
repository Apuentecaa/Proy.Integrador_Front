"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MedicoPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/medico/citas')
  }, [router])
  return null
}
