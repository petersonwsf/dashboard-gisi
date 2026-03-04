export const maskCurrency = ( value: string ) => {
    return value
        .replace(/\D/g, "")
        .replace(/(\d)(\d{2})$/, "$1,$2")
        .replace(/(?=(\d{3})+(\D))\B/g, ".")
        .replace(/^(\d)/, "R$ $1");
}

export const unmaskCurrency = ( value: string ) => {
    return Number(value.replace(/\D/g, "")) / 100;
}