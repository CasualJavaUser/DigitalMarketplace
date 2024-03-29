import {useTranslation} from "react-i18next";

const LanguageSelect = (props) => {
    const [translate, i18n] = useTranslation("global");

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <select defaultValue="pl" onChange={e => changeLanguage(e.target.value)}>
            <option value="pl">Polski</option>
            <option value="en">English</option>
        </select>
    );
}

export default LanguageSelect