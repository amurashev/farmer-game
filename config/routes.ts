import { route } from '@/lib/routing'

type BaseRoute<Params = {}> = {
  params: Params
}

export const indexRoute = route<BaseRoute>('/')
export const gameplayRoute = route<BaseRoute>('/gameplay')
