import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from "react-i18next";

const ToggleLanguage = ({style}) => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        localStorage.setItem('language',lng)
        i18n.changeLanguage(lng); // Function to change the language
        console.log('lng',i18n.language)
    };

    if (style === "toggle") {
        return <button type="button" onClick={() => changeLanguage(i18n.language === "de" ? "en" : "de")} className="button-small outline" aria-label="Language">{i18n.language === "de" ? "🇬🇧" : "🇩🇪"}</button>
    }
    return (
        <details className="dropdown" aria-label="Language selector" id="language-dropdown">
            <summary><LanguageIcon /></summary>
            <ul>
            <li><button type="button" onClick={() => changeLanguage("en")} className="button-small outline" aria-label="English">🇬🇧</button></li>
            <li><button type="button" onClick={() => changeLanguage("de")} className="button-small outline" aria-label="German">🇩🇪</button></li>
            </ul>
        </details>
    )
}
export default ToggleLanguage