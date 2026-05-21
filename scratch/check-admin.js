const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const prisma = new PrismaClient()

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function main() {
  const email = 'mathiaskowoeofficiel@gmail.com'
  console.log('Checking admin:', email)
  
  // 1. Check Prisma DB
  try {
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() }
    })
    console.log('Prisma DB Admin Record:', admin)
  } catch (err) {
    console.error('Prisma query failed:', err.message)
  }

  // 2. Check Supabase Auth
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers()
    if (error) {
      console.error('Supabase list users failed:', error.message)
    } else {
      const authUser = data.users.find(u => u.email === email.toLowerCase())
      console.log('Supabase Auth Record:', authUser ? { id: authUser.id, email: authUser.email, user_metadata: authUser.user_metadata } : 'Not found')
    }
  } catch (err) {
    console.error('Supabase query failed:', err.message)
  }

  await prisma.$disconnect()
}

main()
