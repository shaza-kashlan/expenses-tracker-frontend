import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { API_URL } from "../App";

const AuthContext = createContext();

//This is the wrapper that will wrap our <App/>
const AuthWrapper = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [expenses, setExpenses] = useState(null)
	const [sources, setSources] = useState(null)
	const [categories, setCategories] = useState({count: 0, categories: []})

	const authenticateUser = () => {
		const accessToken = localStorage.getItem("accessToken");
		const refreshToken = localStorage.getItem("refreshToken");
		if (accessToken) {
			return axios
				.get(`${API_URL}/users/verify`, {
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
				})
				.then((response) => {
					console.log("Authentication successful:", response.data);
					setUser(response.data);
					setIsLoading(false);
					setIsLoggedIn(true);
				})
				.catch((err) => {
					if (err.response.status === 401) {
						console.log(
							"Authentication failed: Unauthorized Access Token check The refresh token",
						);
						handleUnauthorizedErrorForAccessToken(refreshToken); // generate new access token
					} else {
						console.log("Authentication failed for other reasons");
						handleAuthenticationFailure(); // Handle other authentication failures
					}
				});
		}
		handleAuthenticationFailure();
	};

	const handleAuthenticationFailure = () => {
		setUser(null);
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		setIsLoading(false);
		setIsLoggedIn(false);
	};

	const handleUnauthorizedErrorForAccessToken = (refreshToken) => {
		if (refreshToken) {
			return axios
				.post(
					`${API_URL}/users/refresh`,
					{},
					{
						headers: {
							authorization: `Bearer ${refreshToken}`,
						},
					},
				)
				.then((response) => {
					console.log(
						"Successfully generate new access token:",
						response.data.token,
					);
					localStorage.setItem("accessToken", response.data.token);
					authenticateUser();
				})
				.catch((err) => {
					if (err.response.status === 401) {
						console.log(
							"Authentication failed: Unauthorized refresh token please log in !",
						);

						handleAuthenticationFailure();
					} else {
						console.log("Authentication refresh token  for other reasons");
						setError(err.response.data.message);
						handleAuthenticationFailure(); // Handle other authentication failures
					}
				});
		}
		handleAuthenticationFailure();
	};

	//every time the application mounts, we try to authenticate the user
	useEffect(() => {
		authenticateUser();
	}, []);

	const getCategories = async () => {
		if (isLoggedIn && user._id) {
			try {
				const token = localStorage.getItem("accessToken");
				const categoriesResponse = await axios.get(`${API_URL}/categories`, {
					headers: {
						authorization: `Bearer ${token}`,
					},
				})
				//console.log(expensesResponse)
				const categoriesArray = categoriesResponse.data
				//console.log(`got ${categoriesArray.length} categories`, categoriesArray)
				setCategories({count:categoriesArray.length, categories: categoriesArray})
			}
			catch(err) {
				console.error("error getting users's list of expenses",err)
			}
		}
	}

	const getExpenses = async () => {
		if (isLoggedIn && user._id) {
			try {
				const token = localStorage.getItem("accessToken");
				const expensesResponse = await axios.get(`${API_URL}/expenses`, {
					headers: {
						authorization: `Bearer ${token}`,
					},
					params: {
						include_source_details: true
					}
				})
				//console.log(expensesResponse)
				const expensesArray = expensesResponse.data
				console.log(`got ${expensesArray.length} expenses`, expensesArray)
				setExpenses({count:expensesArray.length, expenses: expensesArray})
			}
			catch(err) {
				console.error("error getting users's list of expenses",err)
			}
		}
	}

	const getSources = async () => {
		if (isLoggedIn && user._id) {
			try {
				const token = localStorage.getItem("accessToken");
				const sourcesResponse = await axios.get(`${API_URL}/sources`, {
					headers: {
						authorization: `Bearer ${token}`,
					}
				})
				//console.log(expensesResponse)
				const sourcesArray = sourcesResponse.data
				console.log(`got ${sourcesArray.length} sources`, sourcesArray)
				setSources({count:sourcesArray.length, sources: sourcesArray})
			}
			catch(err) {
				console.error("error getting users's list of sources",err)
			}
		}
	}

	useEffect(() => {
		getExpenses();
		getCategories();
		getSources();
	}, [isLoggedIn]);

	//logout function
	const handleLogout = async () => {
		console.log("handle log ot \n \n");
		localStorage.removeItem("accessToken");
		await authenticateUser();
	};
	return (
		//the value is basically the fridge, where all the food is stored
		<AuthContext.Provider
			value={{
				user,
				setUser,
				isLoading,
				isLoggedIn,
				authenticateUser,
				handleLogout,
				expenses,
				setExpenses,
				categories,
				sources, 
				setSources
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
//make sure to export both the wrapper and the context
export { AuthContext, AuthWrapper };
