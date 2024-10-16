export type BaseRouteType = {
  query?: Record<string, string>
  params?: Record<string, string>
}

type RouteOptions<RouteType extends BaseRouteType> = {
  query?: RouteType['query']
  params?: RouteType['params']
}

const addParamsToString = ({
  str,
  params = {},
  query = {},
}: {
  str: string
  params?: Record<string, string>
  query?: Record<string, string>
}) => {
  const finalStr = str
    .replace(/\[(\w+)\]?/g, (a, b) => {
      if (params && params[b]) {
        return params[b]
      }

      return a
    })
    .replace(/\/\[\[...(\w+)\]\]?/g, (a, b) => {
      if (params && params[b]) {
        if (Array.isArray(params[b])) {
          return `/${params[b][0]}`
        }
        return `/${params[b]}`
      }

      return ''
    })

  const queryString = new URLSearchParams(query).toString()

  return `${finalStr}${queryString ? `?${queryString}` : ''}`
}

export type Route<RouteType extends BaseRouteType> = {
  getPathName(): string
  getUrl(routeParams?: RouteOptions<RouteType>): string
}

const getUrl = <RouteType extends BaseRouteType>(
  pathname: string,
  routeParams?: RouteOptions<RouteType>
) => {
  const { query, params } = routeParams || {}
  const url = addParamsToString({
    str: pathname,
    params: params as BaseRouteType['params'],
    query: query as BaseRouteType['query'],
  })
  return url
}

export const route = <RouteType extends BaseRouteType>(
  pathname: string,
  params?: {
    defaultUrl?: string
  }
): Route<RouteType> => {
  const { defaultUrl } = params || {}

  return {
    getPathName: () => pathname || '',
    getUrl: (routeParams) => getUrl(pathname, routeParams) || defaultUrl || '',
  }
}
