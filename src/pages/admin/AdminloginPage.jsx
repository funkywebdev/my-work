import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AdminLogin from '../../components/admin-components/AdminLogin';

const AdminloginPage = () => {
  return (
    <div>
     <Navbar />
      <AdminLogin />
      <Footer /> 
    </div>
  )
}

export default AdminloginPage
