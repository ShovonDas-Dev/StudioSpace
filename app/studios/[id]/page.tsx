'use client'
import { useParams } from 'next/navigation'
import React from 'react'

const DetailsPage = () => {
    const params = useParams()
    const { id } = params
    console.log('Studio ID:', id) 

  return (
    <div>DetailsPage</div>
  )
}

export default DetailsPage