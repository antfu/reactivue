import React from 'react'
import { defineComponent } from 'reactivue'
import { useBattery } from '@vueuse/core'

export const Battery = defineComponent(
  () => {
    return useBattery()
  },
  ({ level, charging }) => {
    return (
      <div className="card">
        <p>useBattery</p>
        <div className="p-1">Battery: {Math.round(level * 100)}% {charging ? '⚡️' : ''}</div>
      </div>
    )
  },
)
