import React, {useState, useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import {getPrice} from "../../Utils";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";

const OfferDetails = (props) => {
    const [translate, i18n] = useTranslation("global");
    const {offerId} = useParams();
    const [offer, setOffer] = useState();

    useEffect(() => {
        fetch("http://localhost:3001/offers/" + offerId)
            .then(res => res.json())
            .then(data => setOffer(data[0]))
            .catch(err => alert(translate("operation unsuccessful")));
    }, []);

    if(offer === undefined || offer.id === null)
        return <NoPage/>

    return (
        <div className="center container">
            <h1>{translate("offer_details")}</h1>
            <strong>{translate("title")}:</strong>{offer.title}<br/>
            <strong>{translate("seller")}:</strong><Link to={"/emp/users/" + offer.seller_id + "/"}>{offer.seller}</Link><br/>
            <strong>{translate("developer")}:</strong>{offer.developer}<br/>
            <strong>{translate("publisher")}:</strong>{offer.publisher}<br/>
            <strong>{translate("release_date")}:</strong>{offer.release_date}<br/>
            <strong>{translate("base_price")}:</strong>{getPrice(offer.price_usd, props.currency)}<br/>
            <strong>{translate("discount")}: </strong>{(offer.discount * 100) + "%"}<br/>
            <strong>{translate("image")}:</strong><br/>
            <img src={offer.image_url} alt="portal2" className="large-product-img"/><br/>
            <Link to={"/emp/edit_offer/" + offer.id}>{translate("edit_info")}</Link><br/>
        </div>
    );
}

export default OfferDetails;