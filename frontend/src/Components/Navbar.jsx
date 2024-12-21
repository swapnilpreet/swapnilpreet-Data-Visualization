import React from 'react'

const Navbar=()=>{
  const handleLogout = ()=>{
    localStorage.removeItem("token");
    window.location.href="/login";
  }
  return (
    <div className='navbar-container'>
       <div>
       <h2>Data Visualization</h2>
       </div>
       <div>
        <button onClick={handleLogout}>Logout</button>
       </div>
    </div>
  )
}

export default Navbar;