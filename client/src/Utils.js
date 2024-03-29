export const getExchangeRate = (currency) => {
    switch (currency) {
        case 'pln': return 3.9746;
        case 'jpy': return 144.80373;
        default: return 1;
    }
}

export const getPrice = (price, currency) => {
    if (currency === undefined)
        currency = 'pln'
    return price == null ? null : (price * getExchangeRate(currency)).toFixed(2) + " " + currency.toUpperCase();
}
export const getDiscountedPrice = (price, currency, discount) => {
    if (currency === undefined)
        currency = 'pln'
    return price == null ? null : (price * getExchangeRate(currency) * (1 - (discount || 0))).toFixed(2) + " " + currency.toUpperCase();
}

export const validateEmail = (email) => {
    return email !== undefined && String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const validatePassword = (password) => password !== undefined && password.length >= 5;

export const validateName = (name) => name !== undefined && name.length >= 3;

export const validatePrice = (price) => !isNaN(parseInt(price)) && parseInt(price) >= 0