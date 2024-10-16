import { NextRequest } from 'next/server'
import humps from 'humps'

import { apiError, successResponse } from '@/lib/api'
import prisma from '@/lib/prisma'

export async function GET(
  _: NextRequest,
  params: {
    params: {
      id: string
    }
  }
) {
  const { id } = params.params

  if (!id) {
    return apiError({ message: 'Id is not correct' })
  }

  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    return apiError({ message: 'User is not found' })
  }

  // Create a new object without the password field
  const { password, ...userWithoutPassword } = user // eslint-disable-line @typescript-eslint/no-unused-vars
  const fixedItem = humps.camelizeKeys(userWithoutPassword)

  return successResponse(
    fixedItem as {
      id: string
      email: string
      firstName: string
      lastName: string
    }
  )
}

// export async function PUT(request: NextRequest) {
//   let data: {
//     id: string
//     email: string
//     firstName: string
//     lastName: string
//   }
//   try {
//     data = await request.json()
//   } catch {
//     return apiError({ message: 'There is no data provided' })
//   }

//   const authResult = checkAuth()
//   if (authResult) return authResult

//   const { id, firstName, lastName } = data

//   if (!id) {
//     return apiError({ message: 'Id is not correct' })
//   }

//   try {
//     const client = await sql.connect()

//     const { rows: oldDataResponse } =
//       await client.sql`SELECT * from scraps_users WHERE id = ${data.id};`

//     if (!oldDataResponse.length) {
//       return apiError({ message: 'Item is not found' })
//     }

//     const [oldData] = oldDataResponse

//     await client.sql`
//     UPDATE scraps_users
//     SET first_name = ${firstName || oldData.firstName}, last_name = ${lastName || oldData.lastName}
//     WHERE id = ${id};`

//     const { rows } =
//       await client.sql`SELECT * from scraps_users WHERE id = ${data.id};`
//     client.release()

//     const updatedItem = rows.length ? rows[0] : null

//     return successResponse(updatedItem)
//   } catch (error) {
//     return apiError({ message: error?.toString(), status: 500 })
//   }
// }
