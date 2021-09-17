export const formatarValorUSA = (valor) => {
    return valor.replace(/\./g, '').replace(',', '.')
}

export const formatarValorBR = (valor, decimais = 2) => {

    return parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: decimais, maximumFractionDigits: decimais })

}