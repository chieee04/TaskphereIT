import React from 'react';

const Footer = () => {
    return (
        <>
            <hr style={{ borderTop: '2px solid #3B0304', margin: 0 }} className='mt-4' />
            <footer className="bg-white py-3 mt-auto">
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <p className="mb-0 text-center text-md-start" style={{ color: '#3B0304' }}>
                        ©2025 TaskSphere IT - All Rights Reserved
                    </p>
                    <a
                        href="#"
                        className="text-decoration-none text-center text-md-end mt-2 mt-md-0"
                        style={{ color: '#3B0304' }}
                    >
                        Terms of Service
                    </a>
                </div>
            </footer>
        </>
    );
};

export default Footer;