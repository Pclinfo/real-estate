// src/routes/ProtectedRoutes.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const auth = useSelector((state) => state.auth);
  if (!auth.token || auth.role !== role) {
    return <Navigate to={`/${role}/login`} />;
  }
  return children;
};

export default ProtectedRoute;
