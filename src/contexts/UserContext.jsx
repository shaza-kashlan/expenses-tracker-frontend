import { createContext, useState } from "react";


const UserContext = createContext();

//This is the wrapper that will wrap our <App/>
const UserWrapper = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);


}




//make sure to export both the wrapper and the context
export { UserContext, AuthWrapper }