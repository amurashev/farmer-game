'use client'

import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../hooks/redux'

import { increaseTime } from '../slices/time'

export default function TimeController() {
  const dispatch = useAppDispatch()
  const { isPaused } = useAppSelector((state) => state.time)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        dispatch(increaseTime())
      }
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [dispatch, isPaused])

  return null
}
