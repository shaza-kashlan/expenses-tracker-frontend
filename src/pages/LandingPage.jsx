import { useNavigate } from "react-router-dom";

const LandingPage = () => {
	const navigate = useNavigate();
	return (
		<div id="landing-page-content">
			<h1>just another expense tracker</h1>
			<h2>Money stuff we good</h2>
			<div
				className="parallax"
				style={{ backgroundImage: 'url("cash1.avif")' }}
			/>
			<h2>track give and get money</h2>
			<div
				className="parallax"
				style={{ backgroundImage: 'url("cash2.avif")' }}
			/>
			<h2>import your money movements</h2>
			<div
				className="parallax"
				style={{ backgroundImage: 'url("cash3.avif")' }}
			/>
			<button type="button" onClick={() => navigate("/signup")}>
				Sign up
			</button>
		</div>
	);
};
export default LandingPage;
