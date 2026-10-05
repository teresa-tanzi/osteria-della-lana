'use client'

import { createContext, useContext } from 'react'
import type { SiteContent } from '@/lib/content-schema'

// Nella pagina pubblica `editing` è false e le funzioni non fanno nulla; nel backoffice
// la stessa pagina riceve le funzioni vere e i componenti diventano modificabili.
export type EditorApi = {
  site: SiteContent
  editing: boolean
  set: (path: string, value: string) => void
  addItem: (path: string, value?: unknown) => void
  removeItem: (path: string, index: number) => void
  moveSection: (key: string, direction: -1 | 1) => void
}

const EditorContext = createContext<EditorApi | null>(null)

export const EditorProvider = EditorContext.Provider

export function useEditor() {
  const api = useContext(EditorContext)
  if (!api) throw new Error('useEditor va usato dentro OsteriaPage')
  return api
}
