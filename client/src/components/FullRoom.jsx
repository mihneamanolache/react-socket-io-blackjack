import React from 'react'

export default function FullRoom() {
  return (
    <div className='vh-100 d-flex align-items-center justify-content-center bg-danger'>
      <div className='text-white fw-bold fs-2 text-center'>
      <p className='m-0 fs-1'> Ups... </p>
        <picture>
          <img src="/images/logo.webp" width={'50%'}/>
        </picture>
        <p className='m-0'>The room is currently full. Please try again later! 😔 </p>
      </div> 
    </div>
  )
}
