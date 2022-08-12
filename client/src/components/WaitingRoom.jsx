import React from 'react'

export default function WaitingRoom() {
  return (
    <div className='vh-100 d-flex align-items-center justify-content-center bg-warning'>
      <div className='text-danger fw-bold fs-2 text-center'>
        <p className='m-0'>Welcome to BlackJack!</p>
        <picture>
          <img src="/images/logo.webp" width={'50%'}/>
        </picture>
        <p className='m-0'>Please wait while we connect you with another player! 👀</p>
      </div> 
    </div>
  )
}
