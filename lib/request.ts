const apiHost = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:3000'

export type Response<T> = {
  data?: T
  error?: { message: string; field: string; code: string }
  status: number
}

export const apiRequest = async <T>(
  url: string,
  props: {
    data?: Record<string, string | number | boolean>
    method?: 'GET' | 'POST' | 'PUT'
    cache?: 'force-cache'
  }
): Promise<Response<T>> => {
  const { data, method = 'GET', cache } = props || {}

  const getParams =
    method === 'GET' && data
      ? new URLSearchParams(data as Record<string, string>).toString()
      : ''

  let body: string | undefined = ''

  if (method === 'GET') {
    body = undefined
  } else if (data) {
    body = JSON.stringify(data)
  }

  return fetch(`${apiHost}${url}${getParams.length ? `?${getParams}` : ''}`, {
    method,
    body,
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Authorization: `TOKEN`,
      Accept: 'application/vnd.api+json',
    },
    cache,
  }).then((res) => res.json())
}
