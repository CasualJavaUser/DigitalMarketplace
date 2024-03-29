import React, {useState, useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import {getPrice} from "../../Utils";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";

const PurchaseDetails = (props) => {
    const [translate, i18n] = useTranslation("global");
    const {purchaseId} = useParams();
    const [purchase, setPurchase] = useState();

    useEffect(() => {
        fetch("http://localhost:3001/purchases/" + purchaseId)
            .then(res => res.json())
            .then(data => setPurchase(data[0]))
            .catch(err => alert(translate("operation_unsuccessful")));
    }, []);

    if(purchase === undefined)
        return <NoPage/>

    return (
        <div className="center container">
            <h1>{translate("purchase_details")}</h1>
            <strong>{translate("key")}:</strong><Link to={"/emp/keys/" + purchase.key}>{purchase.key}</Link><br/>
            <strong>{translate("buyer")}:</strong><Link to={"/emp/customers/" + purchase.buyer_id + "/"}>{purchase.buyer}</Link><br/>
            <strong>{translate("seller")}:</strong><Link to={"/emp/customers/" + purchase.seller_id + "/"}>{purchase.seller}</Link><br/>
            <strong>{translate("title")}:</strong><Link to={"/emp/offers/" + purchase.offer_id}>{purchase.title}</Link><br/>
            <strong>{translate("purchase_time")}:</strong>{purchase.date + " " + purchase.time + " UTC"}<br/>
            <strong>{translate("cost")}:</strong>{getPrice(purchase.purchase_price, props.currency)}<br/><br/>
            <Link to={"/emp/edit_purchase/" + purchase.id}>{translate("edit_info")}</Link><br/>
        </div>
    );
}

export default PurchaseDetails;