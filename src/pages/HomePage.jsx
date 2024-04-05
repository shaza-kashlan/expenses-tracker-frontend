import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const HomePage = () => {
  const { user, handleLogout } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome {user.userName}</h1>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
