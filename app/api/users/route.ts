import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

import { checkAuth, apiError, successResponse } from '@/lib/api'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const email = searchParams.get('email')
  const password = searchParams.get('password')

  const authResult = checkAuth()
  if (authResult) return authResult

  if (!email) return apiError({ message: 'Email is not provided' })
  if (!password) return apiError({ message: 'Password is not provided' })

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return apiError({ message: 'User is not found' })
  }

  const checkPassword = await bcrypt.compare(password, user.password)

  if (!checkPassword) {
    return apiError({ message: 'Password is wrong', field: 'password' })
  }

  return successResponse({ id: user.id })
}

// export async function POST(request: NextRequest) {
//   const data: {
//     email: string
//     password: string
//   } = await request.json()
//   const authResult = checkAuth()
//   if (authResult) return authResult

//   const client = await sql.connect()

//   const { rows } =
//     await client.sql`SELECT * FROM scraps_users WHERE email = ${data.email};`
//   client.release()

//   const item = rows.length ? rows[0] : null

//   if (!item) {
//     return apiError({ message: 'User is not found' })
//   }

//   const checkPassword = await bcrypt.compare(data.password, item.password)

//   if (!checkPassword) {
//     return apiError({ message: 'Password is wrong', field: 'password' })
//   }

//   return successResponse({ id: item.id })
// }

// export async function PUT(request: NextRequest) {
//   const data: {
//     email: string
//     password: string
//   } = await request.json()
//   const authResult = checkAuth()
//   if (authResult) return authResult

//   const hashedPassword = await bcrypt.hash(data.password, 10)

//   const client = await sql.connect()
//   await client.sql`INSERT INTO scraps_users (email, password) VALUES (${data.email}, ${hashedPassword});`
//   const { rows } = await client.sql`SELECT currval('scraps_users_id_seq');`
//   client.release()

//   const id = rows.length ? rows[0].currval : null

//   if (!id) {
//     return apiError({ message: 'Something went wrong' })
//   }

//   return successResponse({ id })
// }
