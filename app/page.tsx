import OsteriaPage from '@/components/osteria/osteria-page'
import { getContent } from '@/lib/content'

// Statica: viene rigenerata da revalidatePath('/') quando si salva da /admin.
export default async function Page() {
  return <OsteriaPage site={await getContent()} />
}
