import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// Clé secrète pour signer les JWT. En production, cela DOIT être une variable d'environnement (ex: process.env.SESSION_SECRET)
const secretKey = process.env.SESSION_SECRET || 'epf-recensement-secret-key-super-secure-2026'
const encodedKey = new TextEncoder().encode(secretKey)

export type SessionPayload = {
  email: string
  nom: string
  role: string
  expiresAt: Date
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as SessionPayload
  } catch (error) {
    return null
  }
}

export async function createSession(email: string, nom: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ email, nom, role, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('admin_session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}

export async function verifySession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('admin_session')?.value
  const session = await decrypt(cookie)

  if (!session?.email) {
    return null
  }

  return session
}
