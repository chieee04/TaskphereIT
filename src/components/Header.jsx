import React from 'react'
import Logo from '../assets/img/Logo.png'
const Header = () => {
  return (
    <div className='mb-3 p-3'>
      <a href="index.html" style={{ display: 'inline-block' }}>
        <img src={Logo} width="100" height="90" alt="Logo" />
      </a>
      <hr/>
    </div>
  )
}

export default Header

