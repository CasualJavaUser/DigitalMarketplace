import {useEffect, useState} from "react";
import {getPrice} from "../../Utils";
import {Link} from "react-router-dom";
import {PurchaseSortOptions, sortPurchases} from "../PurchaseSortOptions";
import {useTranslation} from "react-i18next";

const PurchaseHistory = (props) => {
    const [translate, i18n] = useTranslation("global");
    const [purchases, setPurchases] = useState([]);
    const [sortOpt, setSortOpt] = useState(0);

    useEffect(() => {
        fetch("http://localhost:3001/user_purchases/" + props.user.id)
            .then(res => res.json())
            .then(data => setPurchases(data.sort((p1, p2) => sortPurchases(p1, p2, sortOpt))));
    }, [sortOpt]);

    const purchaseList = purchases.map((purchase) => {
        return (
            <tbody key={purchase.key}>
            <tr>
                <td>{purchase.title}</td>
                <td className="monospace">{purchase.key}</td>
                <td>{getPrice(purchase.purchase_price, props.currency)}</td>
                <td>{purchase.date + " " + purchase.time}</td>
                <td><Link to={"/" + purchase.offer_id}>{translate("offer_page")}</Link></td>
            </tr>
            </tbody>
        );
    })

    return (
        <>
            <h3>{translate("user_purchases")}</h3>
            <PurchaseSortOptions setSortOpt={setSortOpt}/>
            <table>
                <thead>
                <tr>
                    <th>{translate("title")}</th>
                    <th>{translate("key")}</th>
                    <th>{translate("price")}</th>
                    <th>{translate("purchase_time")}</th>
                    <th>{translate("url")}</th>
                </tr>
                </thead>
                {purchaseList}
            </table>
        </>
    )
}

export default PurchaseHistory;