import {Outlet, Link, useNavigate} from "react-router-dom";
import CurrencySelect from "../CurrencySelect";
import LanguageSelect from "../LanguageSelect";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";

const EmpLayout = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    useEffect(() => {
        if (props.user.surname === undefined)
            navigate("/empLogin");
    }, []);

    return (
        <>
            <header>
                <img src="/logo.png" alt="logo" id="logo"/>
                <h1 className="inline">{translate("employee_platform")}</h1>
            </header>
            <nav>
                <div className="global-actions inline">
                    <Link to="customers" className="tab">{translate("customers")}</Link>
                    <Link to="offers" className="tab">{translate("offers")}</Link>
                    <Link to="purchases" className="tab">{translate("purchases")}</Link>
                </div>
                <div className="global-actions inline align-right">
                    <CurrencySelect setCurrency={props.setCurrency}/>
                    <LanguageSelect setLanguage={props.setLanguage}/>
                </div>
            </nav>
            <Outlet/>
        </>
    );
}

export default EmpLayout;