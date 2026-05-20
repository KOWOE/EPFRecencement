import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    
    // Échanger le code contre une session Supabase
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.session?.user?.email) {
      // Stratégie Liste Blanche : Vérifier si l'email existe dans notre table Admin Prisma
      const email = data.session.user.email
      
      try {
        const admin = await prisma.admin.findUnique({
          where: { email: email.toLowerCase() }
        })
        
        if (admin) {
          // L'admin existe dans Prisma, accès autorisé.
          // On redirige vers le dashboard.
          return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
        } else {
          // L'utilisateur n'est pas un administrateur reconnu.
          // On détruit immédiatement la session Supabase qui vient d'être créée
          await supabase.auth.signOut()
          
          // Redirection vers la page de connexion avec un message d'erreur
          return NextResponse.redirect(`${requestUrl.origin}/connexion?error=UnauthorizedAccess`)
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de l'admin:", err)
        await supabase.auth.signOut()
        return NextResponse.redirect(`${requestUrl.origin}/connexion?error=ServerError`)
      }
    }
  }

  // URL fallback s'il n'y a pas de code
  return NextResponse.redirect(`${requestUrl.origin}/connexion?error=AuthFailed`)
}
