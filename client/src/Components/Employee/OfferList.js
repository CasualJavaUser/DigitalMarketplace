import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {getDiscountedPrice, getPrice} from "../../Utils";
import SearchBar from "../SearchBar";
import {useTranslation} from "react-i18next";

const OfferList = (props) => {
    const [offers, setOffers] = useState([]);
    const [translate, i18n] = useTranslation("global");
    const [searched, setSearched] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/offers")
            .then(res => res.json())
            .then(data => {
                setOffers(data
                    .filter(o => o.seller.includes(searched) || o.title.includes(searched) || o.id+''===searched)
                )
            })
            .catch(err => alert(translate("operation_unsuccessful")));
    }, [searched, offers]);

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
                <th>{offer.id}</th>
                <td><Link to={"/emp/customers/" + offer.seller_id}>{offer.seller}</Link></td>
                <td>{offer.title}</td>
                <td>{getDiscountedPrice(offer.price_usd, props.currency, offer.discount)}</td>
                <td>{offer.key_count}</td>
                <td><Link to={offer.id + "/"}>{translate("details")}</Link></td>
                <td><Link to={"/emp/edit_offer/" + offer.id}>{translate("edit")}</Link></td>
                <td><a onClick={() => deleteOffer(offer.id)} className="underlined">{translate("delete")}</a></td>
            </tr>
            </tbody>
        );
    });

    return (
        <div className="center container">
            <h1>{translate("offers")}</h1>
            <SearchBar setSearched={setSearched}/><br/>
            <Link to="/emp/edit_offer/new">{translate("add_offer")}</Link><br/>
            <table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>{translate("seller")}</th>
                    <th>{translate("title")}</th>
                    <th>{translate("price")}</th>
                    <th>{translate("key_count")}</th>
                    <th>{translate("details")}</th>
                    <th>{translate("edit")}</th>
                    <th>{translate("delete")}</th>
                </tr>
                </thead>
                {offerList}
            </table>
        </div>
    );
};

export default OfferList;