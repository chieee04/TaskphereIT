import React from 'react';
import Logo from '../assets/img/Logo.png';
 
const Header = () => {
  return (
    <div
      className="mb-3 px-4 py-2"
      style={{
        backgroundColor: 'rgba(240, 240, 240, 0.4)', // ✅ Only the background is transparent now
        borderBottomLeftRadius: '14px',
        borderBottomRightRadius: '14px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        height: '60px',
      }}
    >
      <a href="index.html" style={{ display: 'inline-block' }}>
        <img src={Logo} width="150" height="120" alt="Logo" /> {/* ✅ Logo will stay in full color */}
      </a>
    </div>
  );
};
 
export default Header;