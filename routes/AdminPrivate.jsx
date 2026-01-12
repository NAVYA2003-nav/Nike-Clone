import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const AdminPrivate = ({ children }) => {
  const { token, user } = useSelector((state) => state.authReducer);

  if (!token || user.role !== "admin") {
    return <Navigate to="/admin-login" />;
  }

  return children;
};
