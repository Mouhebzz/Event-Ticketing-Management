import { useContext } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../Providers/UserProvider';
import CreateEvent from '../components/CreateEvent/CreateEvent';

//const { user } = useContext(UserContext);
//<Navigate to="/login" replace />

/**
 * The function checks if there is a user in local storage and either renders the child components or
 * navigates to the login page.
 * @returns The `ProtectedRoute` component is returning either the `Outlet` component or the `Navigate`
 * component based on whether there is a `user` object in the local storage. If there is a `user`
 * object, the `Outlet` component is returned, which allows the user to access the protected route. If
 * there is no `user` object, the `Navigate` component is returned. The `Navigate` component redirects the user to the login page.
 */
const ProtectedRoute = () => {
    const  user = JSON.parse(localStorage.getItem('user')); ;
    return (
          user ? <Outlet /> : <Navigate to="/login" replace/>
      );

  };
  
  export default ProtectedRoute;
