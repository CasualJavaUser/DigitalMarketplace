import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getDiscountedPrice, getPrice} from "../../Utils";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";

const ProductDetails = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const {offerId} = useParams();
    const [product, setProduct] = useState({});

    useEffect(() => {
        fetch("http://localhost:3001/offers/" + offerId)
            .then(res => res.json())
            .then(data => setProduct(data[0]))
            .catch(err => alert(translate("connection_error")));
    }, []);

    if (product.id === null)
        return <NoPage/>

    const buy = async () => {
        const promise = fetch("http://localhost:3001/available_keys/" + offerId)
            .then(res => res.json())
            .then(data => data)
            .catch(err => alert(translate("connection_error")));

        const keys = await promise;
        if (keys.length <= 0) {
            alert(translate("product_unavailable"));
            return;
        }

        props.setKeyCode(keys[0].code);
        const date = new Date().toISOString().split('.')[0].split('T');
        fetch("http://localhost:3001/purchases/", {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                key: keys[0].code,
                buyer_id: props.user.id,
                date: date[0],
                time: date[1],
                purchase_price: product.price_usd * (1 - product.discount)
            })
        })
            .catch(err => alert(translate("operation_unsuccessful")));
        navigate("/thankyou");
    }

    return (
        <div className="center container two-columns">
            <img src={product.image_url} alt="box art" className="large-product-img"/>
            <div id="product-details">
                <h1>{product.title}</h1><br/>
                <strong>{translate("developer")}: </strong>{product.developer}<br/>
                <strong>{translate("publisher")}: </strong>{product.publisher}<br/>
                <strong>{translate("release_date")}: </strong>{product.release_date}<br/><br/>
                <h3>{translate("seller_info")}</h3>
                <strong>{translate("name")}: </strong>{product.seller}<br/>
                <strong>{translate("e-mail")}: </strong>{product.seller_email}<br/><br/>
                { product.discount <= 0 ? <></> :
                    <>
                        <h3 className="old-price">{getPrice(product.price_usd, props.currency)}</h3>
                        <h3 className="new-price">-{product.discount * 100}%</h3>
                    </>
                }
                <h2 className="new-price">{getDiscountedPrice(product.price_usd, props.currency, product.discount)}</h2><br/>
                <button onClick={() => props.user.id === undefined ? navigate("/login") : buy()} disabled={product.available_keys <= 0}>{translate("buy")}</button><br/>
                {product.available_keys <= 0 ? translate("sold!") : translate("available_keys") + product.available_keys}
            </div>
        </div>
    );
}

export default ProductDetails;