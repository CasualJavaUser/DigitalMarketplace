import {useTranslation} from "react-i18next";

const SearchBar = ({setSearched}) => {
    const [translate, i18n] = useTranslation("global");
    return (
        <input type={"text"} placeholder={translate("search")} onChange={e => setSearched(e.target.value)}/>
    );
}

export default SearchBar;