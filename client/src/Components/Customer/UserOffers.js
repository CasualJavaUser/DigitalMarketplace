import {useEffect, useState} from "react";
import {getPrice} from "../../Utils";
import {Link} from "react-router-dom";
import {OfferSortOptions, sortOffers} from "../OfferSortOptions";
import {useTranslation} from "react-i18next";

const UserOffers = (props) => {
    const [offers, setOffers] = useState([]);
    const [translate, i18n] = useTranslation("global");
    const [sortOpt, setSortOpt] = useState(0);

    useEffect(() => {
        fetch("http://localhost:3001/user_offers/" + props.user.id)
            .then(res => res.json())
            .then(data => setOffers(data.sort((p1, p2) => sortOffers(p1, p2, sortOpt))));
    });

    const offerList = offers.map((offer) => {
        return (
            <tbody key={offer.id}>
            <tr>
                <td>{offer.title}</td>
                <td>{getPrice(offer.price_usd, props.currency)}</td>
                <td>{offer.discount * 100}%</td>
                <td><Link to={"/" + offer.id}>{translate("offer_page")}</Link></td>
                <td><Link to={"/edit_offer/" + offer.id}>{translate("edit")}</Link></td>
                <td><a onClick={() => deleteOffer(offer.id)} className="underlined">{translate("delete")}</a></td>
            </tr>
            </tbody>
        );
    });

    const deleteOffer = (offerId) => {
        if (window.confirm(translate("offer_delete_confirm")) === true) {
            fetch("http://localhost:3001/offers/" + offerId, {method: "DELETE"})
                .catch(err => alert(translate("operation_unsuccessful")));
        }
    }

    return (
        <>
            <h3>{translate("user_offers")}</h3>
            <Link to={"/edit_offer/new"}>{translate("add_new_offer")}</Link><br/>
            <OfferSortOptions setSortOpt={setSortOpt}/>
            <table>
                <thead>
                <tr>
                    <th>{translate("title")}</th>
                    <th>{translate("base_price")}</th>
                    <th>{translate("discount")}</th>
                    <th>{translate("url")}</th>
                    <th>{translate("edit")}</th>
                    <th>{translate("delete")}</th>
                </tr>
                </thead>
                {offerList}
            </table>
        </>
    )
}

export default UserOffers;