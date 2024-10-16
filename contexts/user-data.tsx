'use client'

import { createContext, useContext, ReactNode } from 'react'

type ActualUser = {
  id: string
  email: string
  firstName: string
  lastName: string
}

const UserDataContext = createContext<ActualUser | null>(null)

function UserDataProvider({
  user,
  children,
}: {
  user: ActualUser | null
  children: ReactNode
}) {
  return (
    <UserDataContext.Provider value={user}>{children}</UserDataContext.Provider>
  )
}

export const useUserData = () => useContext(UserDataContext)

export default UserDataProvider
