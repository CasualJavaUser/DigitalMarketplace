import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {getDiscountedPrice, getExchangeRate, getPrice} from "../../Utils";
import {OfferSortOptions, sortOffers} from "../OfferSortOptions";
import {useTranslation} from "react-i18next";

const ProductList = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const [products, setProducts] = useState([]);
    const [sortOpt, setSortOpt] = useState(0);
    const [priceRangeFrom, setPriceRangeFrom] = useState(0);
    const [priceRangeTo, setPriceRangeTo] = useState(1000);
    const [seller, setSeller] = useState("");

    useEffect(() => {
        fetch("http://localhost:3001/offers")
            .then(res => res.json())
            .then(data => {
                setProducts(
                    data.filter(prod => prod.title.toLowerCase().includes(props.searched))
                        .filter(prod => prod.price_usd * getExchangeRate(props.currency) * (1-prod.discount) >= (isNaN(priceRangeTo) ? 0 : priceRangeFrom))
                        .filter(prod => prod.price_usd * getExchangeRate(props.currency) * (1-prod.discount) <= (isNaN(priceRangeTo) ? 1000 : priceRangeTo))
                        .filter(prod => seller.length === 0 ? true : prod.seller.includes(seller))
                        .sort((p1,p2) => sortOffers(p1, p2, sortOpt))
                )
            })
            .catch(err => {
                alert(translate("conection_error"))
                console.log(err);
            });
    }, [props.searched, sortOpt, priceRangeFrom, priceRangeTo, seller]);

    const productList = products.map((product) => {
        return (
            <div className="container product-card" onClick={() => navigate(product.id + "")} key={product.id}>
                <img src={product.image_url} alt="box art" className="product-img"/>
                <h3>{product.title}</h3>
                {getDiscountedPrice(product.price_usd, props.currency, product.discount)}
                {product.discount <= 0 ? "" : " (-" + product.discount*100 + "%)"}
                <br/>
                {product.available_keys > 0 ? "" : translate("sold")}
            </div>
        );
    });

    return (
        <div id="main">
            <div id="options" className="container">
                <label htmlFor="sort_options"><h3>sortuj</h3></label>
                <OfferSortOptions setSortOpt={setSortOpt}/>
                <h3>filtry</h3>
                cena<br/>
                <input type="number" placeholder={translate("from")} onChange={e => setPriceRangeFrom(parseInt(e.target.value))}/>
                <input type="number" placeholder={translate("to")} onChange={e => setPriceRangeTo(parseInt(e.target.value))}/>
                <br/>
                <input type="text" placeholder={translate("seller")} onChange={e => setSeller(e.target.value)}/>
            </div>
            <div id="product-list">
                {productList}
            </div>
        </div>
    );
}

export default ProductList;