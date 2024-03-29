import React, {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Warning from "../Warning";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";
import {validatePrice} from "../../Utils";

const OfferEdit = () => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const {offerId} = useParams();
    const [offer, setOffer] = useState({
        id: '',
        seller_id: '',
        title: '',
        price_usd: '',
        discount: 0,
        image_url: ''
    });
    const [keys, setKeys] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [warning, setWarning] = useState('');
    const [keyWarning, setKeyWarning] = useState('');

    useEffect(() => {
        if (offerId !== 'new') {
            fetch("http://localhost:3001/offers/" + offerId)
                .then(res => res.json())
                .then(data => setOffer(data[0]))
                .catch(err => alert(translate("operation_unsuccessful")));
        }
        fetch("http://localhost:3001/customers")
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => {});
    }, []);

    useEffect(() => {
        if (offerId !== 'new') {

            fetch("http://localhost:3001/keys/" + offerId)
                .then(res => res.json())
                .then(data => setKeys(data))
                .catch(err => {
                });
        }
    }, [keys]);

    if (offer.id === null)
        return <NoPage/>

    const keyList = keys.map((key) => {
        return (
            <tbody key={key.code}>
            <tr>
                <td className="monospace">{key.code}</td>
                <td>{key.sold ? translate("yes") : translate("no")}</td>
                <td><Link to={"/emp/keys/" + key.code}>{translate("details")}</Link></td>
                <td><a onClick={() => deleteKey(key.code)} className="underlined">{translate("delete")}</a></td>
            </tr>
            </tbody>
        );
    });

    const userOptions = customers.map((user) => {
        if (offerId !== 'new' && user.id === offer.seller_id)
            return (<option key={user.id} value={user.id} selected>{user.name}</option>);
        else
            return (<option key={user.id} value={user.id}>{user.name}</option>);
    });

    const addKey = async () => {
        const code = document.getElementById("key-input").value;

        if (code.trim().length === 0) {
            setKeyWarning(translate("enter_key"));
            return;
        }

        const key = await fetch("http://localhost:3001/keys/")
            .then(res => res.json())
            .then(data => data.filter(k => k.code === code))
            .catch(err => alert(translate("operation_unsuccessful")));

        if (key.length !== 0 || keys.filter(k => k.code === code).length !== 0) {
            setKeyWarning(translate("key_exists"));
            return;
        }

        setKeyWarning('');
        document.getElementById("key-input").value = '';

        if (offerId === 'new') {
            setKeys(prev => [...prev, {"code": code, "sold": 0}]);
        } else {
            fetch("http://localhost:3001/keys/", {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    code: code,
                    offerId: offerId
                })
            })
                .catch(err => alert(translate("operation_unsuccessful")));
        }
    }

    const deleteKey = (code) => {
        if (offer.id === 'new') {
            setKeys(keys.filter(key => key.code !== code));
            return;
        }
        fetch("http://localhost:3001/keys/" + code ,{method: 'DELETE',})
            .catch(err => alert(translate("operation_unsuccessful")));
    }

    const acceptChanges = async (offerId) => {
        if (offer.seller_id === '') {
            setWarning(translate("choose_seller"))
            return;
        }
        if (offer.title === undefined || offer.title.length <= 0) {
            setWarning(translate("enter_title"))
            return;
        }
        if (!validatePrice(offer.price_usd)) {
            setWarning(translate("incorrect_price"))
            return;
        }
        if (isNaN(parseInt(offer.discount)) || offer.discount < 0 || offer.discount > 1) {
            setWarning(translate("incorrect_discount"))
            return;
        }
        if (offer.image_url.length <= 0) {
            setWarning(translate("enter_image"))
            return;
        }

        if (offerId === 'new') {
            const promise = fetch("http://localhost:3001/offers", {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(offer)
            })
                .then(res => res.json())
                .then(data => data.insertId)
                .catch(err => alert(translate("operation_unsuccessful")));

            if (keys.length > 0) {
                const insertId = await promise;
                fetch("http://localhost:3001/keys/" + insertId, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({keys: keys.map(key => [key.code, insertId])})
                })
            }

        } else {
            fetch("http://localhost:3001/offers/" + offerId, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(offer)
            })
        }

        exit(offerId);
    }

    const exit = (offerId) => {
        if (offerId === 'new')
            navigate("/emp/offers");
        else
            navigate("/emp/offers/" + offerId);
    }

    const discount = offer.discount == null ? null : offer.discount * 100;

    return (
        <div className="center container two-columns">
            <h1>{offerId === 'new' ? "Dodaj ofertę" : "Edytuj ofertę"}</h1><br/>
            <div className="form">
                <label>{translate("seller")}</label><br/>
                <select onChange={e => offer.seller_id = e.target.value}>
                    <option value="">{translate("choose_seller")}</option>
                    {userOptions}
                </select><br/>
                <label>{translate("title")}</label><br/>
                <input type="text" defaultValue={offer.title} id="title-input" onChange={e => offer.title = e.target.value}/><br/>
                <label>{translate("developer")}</label><br/>
                <input type="text" defaultValue={offer.developer} id="developer-input" onChange={e => offer.developer = e.target.value}/><br/>
                <label>{translate("publisher")}</label><br/>
                <input type="text" defaultValue={offer.publisher} id="publisher-input" onChange={e => offer.publisher = e.target.value}/><br/>
                <label>{translate("release_date")}</label><br/>
                <input type="date" defaultValue={offer.release_date} id="release-date-input" onChange={e => offer.release_date = e.target.value}/><br/>
                <label>{translate("price")} [USD]</label><br/>
                <input type="number" defaultValue={offer.price_usd} id="price-input" onChange={e => offer.price_usd = e.target.value}/><br/>
                <label>{translate("discount")} [%]</label><br/>
                <input type="number" defaultValue={discount} id="discount-input" onChange={e => offer.discount = parseFloat(e.target.value)/100}/><br/>
                <label>{translate("image_url")}</label><br/>
                <input type="text" defaultValue={offer.image_url} id="url-input" onChange={e => {
                    offer.image_url = e.target.value;
                    document.getElementById("box-art").src = e.target.value;
                }}/><br/>

                <img src={offer.image_url} alt="box art" className="large-product-img" id="box-art"/><br/>
                <button onClick={() => acceptChanges(offerId)}>{translate("accept")}</button>
                <button onClick={() => exit(offerId)}>{translate("cancel")}</button>
                <Warning message={warning}/>
            </div>

            <div>
                <h2>{translate("keys")}</h2>
                <table>
                    <thead>
                    <tr>
                        <th>{translate("keys")}</th>
                        <th>{translate("is_sold")}</th>
                        <th>{translate("details")}</th>
                        <th>{translate("delete")}</th>
                    </tr>
                    </thead>
                    {keyList}
                </table>
                <br/>
                <div className="key-input">
                    <input id="key-input" type="text" placeholder="klucz"/>
                    <button onClick={() => addKey()}>{translate("add")}</button>
                    <Warning message={keyWarning}/>
                </div>
            </div>
        </div>
    );
}

export default OfferEdit;