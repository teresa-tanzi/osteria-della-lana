import { redirect } from 'next/navigation'
import { Editor } from '@/components/backoffice/editor'
import { getContent } from '@/lib/content'
import { isAuthenticated } from '@/lib/session'

export default async function BackofficePage() {
  if (!(await isAuthenticated())) redirect('/backoffice/login')
  return <Editor initial={await getContent()} />
}
