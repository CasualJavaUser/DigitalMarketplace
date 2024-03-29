import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const ThankYou = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");

    return (
        <div className="center container">
            <h1>{translate("thank_you")}</h1>
            <h2>{translate("your_key")}: <a className="monospace">{props.keyCode}</a></h2>
            <button onClick={() => navigate("/")}>{translate("back_to_store")}</button>
        </div>
    );
}

export default ThankYou;