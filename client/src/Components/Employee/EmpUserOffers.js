import React, {useEffect, useState} from "react";
import {getPrice} from "../../Utils";
import {Link, useParams} from "react-router-dom";
import {OfferSortOptions, sortOffers} from "../OfferSortOptions";
import {useTranslation} from "react-i18next";

const EmpUserOffers = (props) => {
    const [translate, i18n] = useTranslation("global");
    const {customerId} = useParams();
    const [offers, setOffers] = useState([]);
    const [sortOpt, serSortOpt] = useState(0);

    useEffect(() => {
        fetch("http://localhost:3001/user_offers/" + customerId)
            .then(res => res.json())
            .then(data => setOffers(data.sort((p1,p2) => sortOffers(p1,p2,sortOpt))));
    });

    const deleteOffer = (offerId) => {
        if (window.confirm(translate("offer_delete_confirm")) === true) {
            fetch("http://localhost:3001/offers/" + offerId, {method: "DELETE"})
                .catch(err => alert(translate("operation_unsuccessful")));
        }
    }

    const offerList = offers.map((offer) => {
        return (
            <tbody key={offer.id}>
            <tr>
                <td>{offer.id}</td>
                <td>{offer.title}</td>
                <td>{getPrice(offer.price_usd, props.currency)}</td>
                <td>{offer.discount * 100}%</td>
                <td><Link to={"/emp/offers/" + offer.id}>{translate("details")}</Link></td>
                <td><Link to={"/emp/edit_offer/" + offer.id}>{translate("edit")}</Link></td>
                <td><a onClick={() => deleteOffer(offer.id)} className="underlined">{translate("delete")}</a></td>
            </tr>
            </tbody>
        );
    });

    return (
        <>
            <h3>{translate("user_offers")}</h3>
            <OfferSortOptions setSortOpt={serSortOpt}/>
            <table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>{translate("title")}</th>
                    <th>{translate("base_price")}</th>
                    <th>{translate("discount")}</th>
                    <th>{translate("details")}</th>
                    <th>{translate("edit")}</th>
                    <th>{translate("delete")}</th>
                </tr>
                </thead>
                {offerList}
            </table>
        </>
    )
}

export default EmpUserOffers;