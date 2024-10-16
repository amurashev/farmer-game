'use server'

import { redirect } from 'next/navigation'

import { deleteSession, createSession } from '@/lib/session'

export async function logout() {
  deleteSession()
  redirect('/')
}

export async function login(id: string) {
  createSession(id)
  redirect('/')
}
