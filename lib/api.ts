import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export const checkAuth = () => {
  const headersList = headers()
  const authorization = headersList.get('authorization')

  if (authorization !== 'TOKEN') {
    return NextResponse.json({ error: 'Token is wrong' }, { status: 401 })
  }

  return undefined
}

export const apiError = (props: {
  message?: string
  field?: string | null
  code?: string
  status?: number
}) => {
  const { message, field = null, code = null, status = 400 } = props
  return NextResponse.json(
    {
      error: { message, field, code },
    },
    { status }
  )
}

export const successResponse = (
  data: Record<string, string | number | null> | null
) => {
  return NextResponse.json({ data })
}
