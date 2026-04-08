'use client'

import { useEffect, useState } from 'react'

const useData = () => {
  const [data, setData] = useState('')

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:5001/hello')
      const json = await response.json()
      setData(typeof json === 'string' ? json : '')
    }

    fetchData().catch(() => {
      setData('Error')
    })
  }, [])

  return data
}

export function Hello(): React.JSX.Element {
  const data = useData()

  return <h1>{data}</h1>
}
