import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";

const Header = ({ loggedin }) => {
	const navigate = useNavigate();

	return (
		<header>
			<nav>
				<ul>
					<Link to="/">
						<li>🤑</li>
					</Link>
				</ul>
				{loggedin ? (
					<ul>
						<li>
							<button className="button-small" type="button">
								dashboard
							</button>
						</li>
					</ul>
				) : (
					<ul>
						<button
							type="button"
							className="button-small"
							onClick={() => navigate("/login")}
						>
							Log in
						</button>
					</ul>
				)}
			</nav>
		</header>
	);
};
export default Header;
