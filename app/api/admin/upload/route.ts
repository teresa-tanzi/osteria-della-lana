import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { isAuthenticated } from '@/lib/session'

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Solo chi ha una sessione valida può ottenere un token di upload.
        if (!(await isAuthenticated())) throw new Error('Non autorizzato')
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        }
      },
    })
    return Response.json(json)
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 })
  }
}
