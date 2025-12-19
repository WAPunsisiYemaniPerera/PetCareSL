import React from 'react';
import { Navigate  }  from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ( { children}) => {
    const { user} = useAuth();

    //if the user is there and he is admin, then go in , if not redirect to login page
    return user && user.isAdmin ? children: <Navigate to="/admin/login"/>;
}

export default AdminRoute;