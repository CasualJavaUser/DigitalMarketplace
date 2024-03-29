import React, {useState, useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";

const KeyDetails = () => {
    const [translate, i18n] = useTranslation("global");
    const {keyCode} = useParams();
    const [key, setKey] = useState();

    useEffect(() => {
        fetch("http://localhost:3001/key/" + keyCode)
            .then(res => res.json())
            .then(data => setKey(data[0]))
            .catch(err => alert(translate("operation_unsuccessful")));
    }, []);

    if (key === undefined) {
        return <NoPage/>
    }

    return (
        <div className="center container">
            <div id="product-details">
                <h1>{translate("key_details")}</h1><br/>
                <strong>{translate("key_code")}: </strong><a className="monospace">{key.code}</a><br/>
                <strong>{translate("is_sold")}: </strong>{key.sold ? translate("yes") : translate("no")}<br/>
            </div>
            <Link to={"/emp/offers/" + key.offer_id}>{translate("offer_info")}</Link><br/>
            { key.sold ? <Link to={"/emp/purchases/" + key.code}>{translate("purchase_info")}</Link> : <></> }
        </div>
    );
}

export default KeyDetails;