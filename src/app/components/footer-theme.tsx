"use client"

import { useTheme } from "./theme-context"
import { useEffect } from "react"

export function FooterTheme() {
  const { isDarkMode, isThemeLoaded } = useTheme()

  useEffect(() => {
    if (!isThemeLoaded) return

    const footer = document.querySelector('footer')
    const links = document.querySelectorAll('footer a')
    
    if (footer && links) {
      if (isDarkMode) {
        links.forEach(link => {
          link.classList.remove('text-blue-400', 'hover:text-blue-300')
          link.classList.add('text-[#a90068]', 'hover:text-pink-600')
        })
      } else {
        links.forEach(link => {
          link.classList.remove('text-[#a90068]', 'hover:text-pink-600')
          link.classList.add('text-blue-400', 'hover:text-blue-300')
        })
      }
    }
  }, [isDarkMode, isThemeLoaded])

  return null
}