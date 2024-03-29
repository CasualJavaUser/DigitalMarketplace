import React, {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Warning from "../Warning";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";
import {validatePrice} from "../../Utils";

const PurchaseEdit = () => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const {purchaseId} = useParams();
    const [purchase, setPurchase] = useState({id: "", date: "", time: ""});
    const [keys, setKeys] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [warning, setWarning] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/customers")
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => alert(translate("operation_unsuccessful")));
        fetch("http://localhost:3001/available_keys")
            .then(res => res.json())
            .then(data => setKeys(data))
            .catch(err => {});
        if (purchaseId !== 'new') {
            fetch("http://localhost:3001/purchases/" + purchaseId)
                .then(res => res.json())
                .then(data => {
                    setPurchase(data[0]);
                })
                .catch(err => alert());
        }
    }, []);

    if (purchase.id === null)
        return <NoPage/>

    const userOptions = customers.map((user) => {
        if (purchaseId !== 'new' && user.id === purchase.buyer_id)
            return <option key={user.id} value={user.id} selected>{user.name}</option>;
        else
            return <option key={user.id} value={user.id}>{user.name}</option>;
    });

    let keyOptions = keys.map((key) => {
            return <option key={key.code} value={key.code}>{key.code}</option>;
    });

    if (purchaseId !== 'new') {
        keyOptions = [...keyOptions, (<option key={purchase.key} value={purchase.key} selected>{purchase.key}</option>)]
    }

    const acceptChanges = async (purchaseId) => {
        if (purchase.key === '' || purchase.key === undefined) {
            setWarning(translate("choose_key"))
            return;
        }
        if (purchase.buyer_id === '' || purchase.buyer_id === undefined) {
            setWarning(translate("choose_seller"))
            return;
        }
        if (purchase.date === '') {
            setWarning(translate("enter_date"))
            return;
        }
        if (purchase.time === '') {
            setWarning(translate("enter_time"))
            return;
        }
        if (!validatePrice(purchase.purchase_price)) {
            setWarning(translate("incorrect price"))
            return;
        }

        if (purchaseId === 'new') {
            fetch("http://localhost:3001/purchases", {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(purchase)
            })
                .catch(err => alert(translate("operation_unsuccessful")));
        } else {
            fetch("http://localhost:3001/purchases/" + purchaseId, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(purchase)
            })
                .catch(err => alert(translate("operation_unsuccessful")));
        }

        exit(purchaseId);
    }

    const exit = (purchaseId) => {
        if (purchaseId === 'new')
            navigate("/emp/purchases");
        else
            navigate("/emp/purchases/" + purchaseId);
    }

    const discount = purchase.discount == null ? null : purchase.discount * 100;

    return (
        <div className="center container">
            <h1>{purchaseId === 'new' ? translate("add_purchase") : translate("edit_purchase")}</h1>
            <div className="form">
                <label>klucz</label><br/>
                <select className="monospace" onChange={e => purchase.key = e.target.value}>
                    <option value="">{translate("choose_key")}</option>
                    {keyOptions}
                </select><br/>

                <label>{translate("buyer")}</label><br/>
                <select onChange={e => {
                    purchase.buyer_id = e.target.value
                }}>
                    <option value="">{translate("choose_buyer")}</option>
                    {userOptions}
                </select><br/>

                <label>{translate("purchase_date")}</label><br/>
                <input type="date" defaultValue={purchase.date} id="title-input" onChange={e => purchase.date = e.target.value}/><br/>
                <label>{translate("purchase_time")} [UTC]</label><br/>
                <input type="time" defaultValue={purchase.time} id="title-input" onChange={e => purchase.time = e.target.value}/><br/>
                <label>{translate("cost")} [USD]</label><br/>
                <input type="number" defaultValue={purchase.purchase_price} id="developer-input" onChange={e => purchase.purchase_price = e.target.value}/><br/>

                <button onClick={() => acceptChanges(purchaseId)}>{translate("accept")}</button>
                <button onClick={() => exit(purchaseId)}>{translate("cancel")}</button>
                <Warning message={warning}/>
            </div>
        </div>
    );
}

export default PurchaseEdit;