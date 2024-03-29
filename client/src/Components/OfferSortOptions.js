import {useTranslation} from "react-i18next";

const OfferSortOptions = ({setSortOpt}) => {
    const [translate, i18n] = useTranslation("global");
    return (
        <select onChange={e => setSortOpt(parseInt(e.target.value))}>
            <option value={0}>{translate("newest_first")}</option>
            <option value={1}>{translate("alphabetically")}</option>
            <option value={2}>{translate("discount_descending")}</option>
            <option value={3}>{translate("price_ascending")}</option>
            <option value={4}>{translate("price_descending")}</option>
        </select>
    );
}

const sortOffers = (p1, p2, opt) => {
    switch (parseInt(opt)) {
        case 1: return p1.title.localeCompare(p2.title);
        case 2: return p2.discount -  p1.discount;
        case 3: return p1.price_usd * (1 - p1.discount) - p2.price_usd * (1 - p2.discount);
        case 4: return p2.price_usd * (1 - p2.discount) - p1.price_usd * (1 - p1.discount);
        default: return parseInt(p2.id) - parseInt(p1.id);
    }
}

export {OfferSortOptions, sortOffers};