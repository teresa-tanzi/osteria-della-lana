import { redirect } from 'next/navigation'
import { Editor } from '@/components/admin/editor'
import { getContent } from '@/lib/content'
import { isAuthenticated } from '@/lib/session'

export default async function AdminPage() {
  if (!(await isAuthenticated())) redirect('/admin/login')
  return <Editor initial={await getContent()} />
}
