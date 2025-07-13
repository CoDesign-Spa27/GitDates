'use client'
import { useEffect } from 'react'

export default function RemoveNextJsToast() {
  useEffect(() => {
    const toast = document.querySelector('[data-nextjs-toast]')
    if (toast) toast.remove()
  }, [])

  return null
}
