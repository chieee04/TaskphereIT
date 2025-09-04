import { useState } from 'react'
import Signin from './components/signin'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
    <Header />
      <div className="d-flex">
        <main className="flex-grow-1 p-3">
          <Outlet /> {/* Dito magpapalit-palit yung pages */}
        </main>
      </div>
      <Footer />
    </>
  )
}


export default App
