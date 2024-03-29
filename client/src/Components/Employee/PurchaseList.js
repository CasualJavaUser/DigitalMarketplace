import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import SearchBar from "../SearchBar";
import {useTranslation} from "react-i18next";

const PurchaseList = () => {
    const [translate, i18n] = useTranslation("global");
    const [purchases, setPurchases] = useState([]);
    const [searched, setSearched] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/purchases")
            .then(res => res.json())
            .then(data => {
                setPurchases(data
                    .filter(p => p.title.includes(searched) || p.key.includes(searched))
                )
            })
            .catch(err => alert(translate("opearation_unsuccessful")));
    }, [searched, purchases]);

    const deletePurchase = (purchaseId) => {
        if (window.confirm(translate("purchase_delete_confirm")) === true) {
            fetch("http://localhost:3001/purchases/" + purchaseId, {method: "DELETE"})
                .catch(err => alert(translate("operation_unsuccessful")));
        }
    }

    const purchaseList = purchases.map(purchase => {
        return (
            <tbody key={purchase.id}>
            <tr>
                <td>{purchase.id}</td>
                <td className="monospace">{purchase.key}</td>
                <td><Link to={"/emp/customers/" + purchase.buyer_id}>{purchase.buyer}</Link></td>
                <td><Link to={"/emp/customers/" + purchase.seller_id}>{purchase.seller}</Link></td>
                <td>{purchase.title}</td>
                <td>{purchase.date + " " + purchase.time}</td>
                <td><Link to={purchase.id + "/"}>{translate("details")}</Link></td>
                <td><Link to={"/emp/edit_purchase/" + purchase.id}>{translate("edit")}</Link></td>
                <td><a onClick={() => deletePurchase(purchase.id)} className="underlined">{translate("delete")}</a></td>
            </tr>
            </tbody>
        )
    })

    return (
        <div className="center container">
            <h1>{translate("Purchases")}</h1>
            <SearchBar setSearched={setSearched}/><br/>
            <Link to={"/emp/edit_purchase/new"}>{translate("add_purchase")}</Link><br/>
            <table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>{translate("key")}</th>
                    <th>{translate("buyer")}</th>
                    <th>{translate("seller")}</th>
                    <th>{translate("title")}</th>
                    <th>{translate("purchase_time")}</th>
                    <th>{translate("details")}</th>
                    <th>{translate("edit")}</th>
                    <th>{translate("delete")}</th>
                </tr>
                </thead>
                {purchaseList}
            </table>
        </div>
    );
}

export default PurchaseList;