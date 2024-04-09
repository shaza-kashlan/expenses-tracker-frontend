import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = ({ loggedin }) => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<header id="main-header">
			<nav>
				<ul>
					<Link to="/">
						<li>🤑</li>
					</Link>
				</ul>
				{loggedin ? (
					<ul>
						<li>
							<button className="button-small" type="button" onClick={() => navigate("/dashboard")}>
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
							{t("login")}
						</button>
					</ul>
				)}
			</nav>
		</header>
	);
};
export default Header;
