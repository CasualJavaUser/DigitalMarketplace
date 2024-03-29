import {Outlet, useNavigate} from "react-router-dom";
import CurrencySelect from "../CurrencySelect";
import LanguageSelect from "../LanguageSelect";
import { useTranslation } from "react-i18next";

const Layout = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");

    return (
        <>
            <header>
                <img src="/logo.png" alt="logo" id="logo" onClick={() => {
                    navigate("/");
                    props.setSearched('');
                }}/>
                <input type="text" id="search-bar" placeholder={translate("search")} onKeyDown={e => {
                    if (e.key === 'Enter') {
                        props.setSearched(e.target.value.toLowerCase());
                        navigate("/");
                    }
                }}/>
            </header>
            <nav>
                <div className="global-actions inline align-right">
                    {
                        props.user.id === undefined ?
                        <button onClick={() => navigate("/login")}>{translate("login")}</button> :
                        <button onClick={() => navigate("/profile")}>{translate("profile")}</button>
                    }
                    <CurrencySelect setCurrency={props.setCurrency}/>
                    <LanguageSelect/>
                </div>
            </nav>
            <Outlet/>
        </>
    );
}

export default Layout;