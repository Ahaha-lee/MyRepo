import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles, user }) => {

    if (!user || !allowedRoles.includes(user.Position)) {
        return (
            <>
            路由保护组件ProtectedRoute
            <Navigate to="/login" />
            </>);
    }
    return element;
};

export default ProtectedRoute;
