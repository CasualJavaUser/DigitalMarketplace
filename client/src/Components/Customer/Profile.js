import {Link, Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";

const Profile = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");

    useEffect(() => {
        if (props.user.id === undefined)
            navigate("/login");
    }, []);

    return (
        <div className="center container">
            <h1>{props.user.name}</h1>
            <strong>email:</strong>{props.user.email}<br/>
            <Link to={"edit"}>zmień dane</Link><br/><br/>
            <button onClick={() => navigate("purchases")}>{translate("user_purchases")}</button>
            <button onClick={() => navigate("offers")}>{translate("user_offers")}</button><br/>
            <Outlet/>
        </div>
    );
}

export default Profile;