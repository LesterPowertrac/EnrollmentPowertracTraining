import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';

const Guestlayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default Guestlayout