import { apiRequest } from '../lib/request'

type Session = {
  id: string
}

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
}

export const getUserById = async (data: { id: string }) => {
  const response = await apiRequest<User>(`/api/users/${data.id}`, {
    method: 'GET',
  })

  return response
}

export const updateUser = async (data: {
  id: string
  email: string
  firstName: string
  lastName: string
}) => {
  const response = await apiRequest<User>(`/api/users/${data.id}`, {
    method: 'PUT',
    data,
  })

  return response
}

export const getUserByEmail = async (data: {
  email: string
  password: string
}) => {
  const response = await apiRequest<Session>('/api/users', {
    method: 'GET',
    data,
  })

  return response
}
