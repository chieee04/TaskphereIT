import React from 'react'
import { UserAuth } from '../Contex/AuthContext';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();


 console.log("Logged in user:", session?.user?.email);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <h1> hi</h1>
      <h2>welcome, {session?.user?.email}</h2>
      <div>
        <p onClick={handleSignOut} className="hover:cursor-pointer border inline-block px-4 py-3 mt-4">
          Sign out
        </p>
      </div>
    </div>
  )
}

export default Dashboard
