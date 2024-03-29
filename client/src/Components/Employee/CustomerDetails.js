import React, {useState, useEffect} from "react";
import {Link, Outlet, useNavigate, useParams} from "react-router-dom";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";

const CustomerDetails = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const {customerId} = useParams();
    const [customer, setCustomer] = useState();
    const [tab, setTab] = useState(0);

    useEffect(() => {
        fetch("http://localhost:3001/customers/" + customerId)
            .then(res => res.json())
            .then(data => setCustomer(data[0]))
            .catch(err => alert(translate("operation_unsuccessful")));
    }, []);

    if (customer === undefined)
        return <NoPage/>

    return (
        <div className="center container">
            <h1>{translate("user_info")}: {customer.name}</h1>
            <strong>{translate("e-mail")}:</strong>{customer.email}<br/>
            <Link to={"/emp/edit_customer/" + customerId}>{translate("edit_info")}</Link><br/><br/>
            <button onClick={() => navigate("purchases")}>{translate("user_purchases")}</button>
            <button onClick={() => navigate("offers")}>{translate("user_offers")}</button><br/>
            <Outlet/>
        </div>
    );
}

export default CustomerDetails;