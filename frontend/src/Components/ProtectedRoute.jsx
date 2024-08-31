import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles, user }) => {

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" />;
    }
    return element;
};

export default ProtectedRoute;
