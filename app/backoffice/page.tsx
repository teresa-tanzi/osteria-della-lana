import { redirect } from 'next/navigation'
import { InlineEditor } from '@/components/backoffice/inline-editor'
import { getContent } from '@/lib/content'
import { isAuthenticated } from '@/lib/session'

export default async function BackofficePage() {
  if (!(await isAuthenticated())) redirect('/backoffice/login')
  return <InlineEditor initial={await getContent()} />
}
