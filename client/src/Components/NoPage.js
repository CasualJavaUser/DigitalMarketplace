import {useTranslation} from "react-i18next";

const NoPage = () => {
    const [translate, i18n] = useTranslation("global");
    return (
        <div className="center container">
            <h1>{translate("not_found")}</h1>
        </div>
    );
}

export default NoPage;