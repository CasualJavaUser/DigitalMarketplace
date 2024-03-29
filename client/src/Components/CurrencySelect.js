const CurrencySelect = (props) => {
    return (
        <select defaultValue={"pln"} onChange={e => props.setCurrency(e.target.value)}>
            <option value="pln">PLN</option>
            <option value="usd">USD</option>
            <option value="jpy">JPY</option>
        </select>
    );
}

export default CurrencySelect;