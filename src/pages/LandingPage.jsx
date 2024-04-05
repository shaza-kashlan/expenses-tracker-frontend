import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

const LandingPage = () => {
	const navigate = useNavigate();
	const handleChangeLanguage = (lang) => {
		i18n.changeLanguage(lang);
	};
	const { t } = useTranslation();
	return (
		<div id="landing-page-content">
			<h1>{t("jaet")}</h1>
			<h2>{t("lp-claim-one")}</h2>
			<div
				className="parallax"
				style={{ backgroundImage: 'url("cash1.avif")' }}
			/>
			<h2>{t("lp-claim-two")}</h2>
			<div
				className="parallax"
				style={{ backgroundImage: 'url("cash2.avif")' }}
			/>
			<h2>{t("lp-claim-three")}</h2>
			<div
				className="parallax"
				style={{ backgroundImage: 'url("cash3.avif")' }}
			/>
			<button type="button" onClick={() => navigate("/signup")}>
				{t("sign_up")}
			</button>
		</div>
	);
};
export default LandingPage;
