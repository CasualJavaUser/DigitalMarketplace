import {useTranslation} from "react-i18next";

const PurchaseSortOptions = ({setSortOpt}) => {
    const [translate, i18n] = useTranslation("global");
    return (
        <select onChange={e => setSortOpt(parseInt(e.target.value))}>
            <option value={0}>{translate("alphabetically")}</option>
            <option value={1}>{translate("price_descending")}</option>
            <option value={2}>{translate("price_ascending")}</option>
            <option value={3}>{translate("newest_first")}</option>
            <option value={4}>{translate("oldest_first")}</option>
        </select>
    );
}

const sortPurchases = (p1, p2, opt) => {
    switch (opt) {
        case 1: return p2.purchase_price - p1.purchase_price;
        case 2: return p1.purchase_price - p2.purchase_price;
        case 3: return Date.parse(p2.purchase_time) - Date.parse(p1.purchase_time);
        case 4: return Date.parse(p1.purchase_time) - Date.parse(p2.purchase_time);
        default: return p1.title.localeCompare(p2.title);
    }
}

export {PurchaseSortOptions, sortPurchases};