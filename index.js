let crescimentoAlterado = {2027: false,2028: false,perpetuo: false}; // estou criando um objeto para armazenar o estado de alteração das taxas de crescimento de 2027, 2028 e perpétuo

document.getElementById('crescimento-2027').oninput = function() {
    crescimentoAlterado[2027] = true
    calcular(); // estou chamando a função calcular() toda vez que o usuário alterar o valor da taxa de crescimento de 2027, para que os valores sejam recalculados automaticamente
}
    
document.getElementById('crescimento-2028').oninput = function() {
    crescimentoAlterado[2028] = true
    calcular(); 
}

document.getElementById('crescimento-perpetuo').oninput = function() {
    crescimentoAlterado['perpetuo'] = true
    calcular();
}

function calcular(){
    // Calcular o ROE (Return on Equity)
    const patrimonioLiquido = document.getElementById('patrimonio-liquido').value; // estou pegando o id do input do patrimônio líquido e armazenando na variável patrimonioLiquido
    const ll2025 = document.getElementById('ll-2025').value; // estou pegando o id do input do lucro líquido de 2025 e armazenando na variável ll2025
    const roe = (ll2025 / patrimonioLiquido) * 100;
    document.getElementById('roe').value = roe.toFixed(2); // estou pegando o id do input do ROE e atribuindo o valor do ROE calculado, formatado com 2 casas decimais, resultado aparece automaticamente no input do ROE

    // Calcular Taxa de Crescimento
    const payout = document.getElementById('payout').value; // estou pegando o id do input do payout e armazenando na variável payout
    const crescimentoEsperado = (roe / 100) * (1 - (payout / 100)) * 100;
    document.getElementById('crescimento-esperado').value = crescimentoEsperado.toFixed(2); // estou pegando o id do input da taxa de crescimento e atribuindo o valor da taxa de crescimento calculada, formatado com 2 casas decimais, resultado aparece automaticamente no input da taxa de crescimento

    // Calcular 2026
        // Calcular ll2026
    const ll2026 = document.getElementById('ll-2026').value; // estou pegando o id do input do lucro líquido de 2026 e armazenando na variável ll2026
    const taxaDesconto = document.getElementById('taxa-desconto').value; // estou pegando o id do input da taxa de desconto e armazenando na variável taxaDesconto
        // Calcular VPL de 2026
    const vpl2026 = ll2026 / Math.pow(1 + (taxaDesconto / 100), 1); // estou calculando o VPL de 2026
    document.getElementById('vpl-2026').value = vpl2026.toFixed(2); // estou pegando o id do input do VPL de 2026 e atribuindo o valor do VPL calculado, formatado com 2 casas decimais, resultado aparece automaticamente no input do VPL de 2026
        // Calcular taxa de crescimento de 2026 comparado a 2025
    const crescimento2026 = (ll2026 - ll2025) / ll2025 * 100; // estou calculando a taxa de crescimento de 2026 em relação a 2025
    document.getElementById('crescimento-2026').value = crescimento2026.toFixed(2); // estou pegando o id do input da taxa de crescimento de 2026 e atribuindo o valor da taxa de crescimento calculada, formatado com 2 casas decimais, resultado aparece automaticamente no input da taxa de crescimento de 2026

    // Calcular 2027
        // Calcular ll2027
    if (!crescimentoAlterado[2027]) {
        document.getElementById('crescimento-2027').value = crescimentoEsperado.toFixed(2); // se a taxa de crescimento de 2027 não tiver sido alterada pelo usuário, atribui o valor da taxa de crescimento esperada ao input da taxa de crescimento de 2027
    }
    const crescimento2027 = document.getElementById('crescimento-2027').value; // estou pegando o id do input da taxa de crescimento de 2027 e armazenando na variável crescimento2027
    const ll2027 = ll2026 * (1 + (crescimento2027 / 100)); // estou calculando o lucro líquido de 2027 com base no lucro líquido de 2026 e na taxa de crescimento esperada
    document.getElementById('ll-2027').value = ll2027.toFixed(2); // estou pegando o id do input do lucro líquido de 2027 e atribuindo o valor do lucro líquido calculado, formatado com 2 casas decimais, resultado aparece automaticamente no input do lucro líquido de 2027

        // Calcular VPL de 2027
    const vpl2027 = ll2027 / Math.pow(1 + (taxaDesconto / 100), 2); // estou calculando o VPL de 2027
    document.getElementById('vpl-2027').value = vpl2027.toFixed(2); // estou pegando o id do input do VPL de 2027 e atribuindo o valor do VPL calculado, formatado com 2 casas decimais, resultado aparece automaticamente no input do VPL de 2027

    // Calcular 2028
        // Calcular ll2028
    if (!crescimentoAlterado[2028]) {
        document.getElementById('crescimento-2028').value = crescimentoEsperado.toFixed(2); 
    }
    const crescimento2028 = document.getElementById('crescimento-2028').value;
    const ll2028 = ll2027 * (1 + (crescimento2028 / 100));
    document.getElementById('ll-2028').value = ll2028.toFixed(2); 

        // Calcular VPL de 2028
    const vpl2028 = ll2028 / Math.pow(1 + (taxaDesconto / 100), 3);
    document.getElementById('vpl-2028').value = vpl2028.toFixed(2); 

    // Calcular perpétuo
        // Calcular ll perpétuo
    if (!crescimentoAlterado['perpetuo']) {
        document.getElementById('crescimento-perpetuo').value = 3.00;
    }
    const crescimentoPerpetuo = document.getElementById('crescimento-perpetuo').value;
    const llPerpetuo = ll2028 * (1 + (crescimentoPerpetuo / 100)) / ((taxaDesconto / 100) - (crescimentoPerpetuo / 100));
    document.getElementById('ll-perpetuo').value = llPerpetuo.toFixed(2);

        // Calcular VPL perpétuo
    const vplPerpetuo = llPerpetuo / Math.pow(1 + (taxaDesconto / 100), 4); // CONSERTAR ESSE VALOR PARA DEIXAR 3% PADRAO E SE O USUARIO QUISER ALTERAR, FIQUE A VONTADE
    document.getElementById('vpl-perpetuo').value = vplPerpetuo.toFixed(2);



    // Market Cap
    const marketCap = vpl2026 + vpl2027 + vpl2028 + vplPerpetuo;
    document.getElementById('market-cap').value = marketCap.toFixed(2);


    // Preço teto
    const tesouraria = document.getElementById('ex-tesouraria').value;
    const precoTeto = (vpl2026 + vpl2027 + vpl2028 + vplPerpetuo) / tesouraria;
    document.getElementById('preco-por-acao').value = precoTeto.toFixed(2);

    // Margem de segurança
    const precoAcao = document.getElementById('preco-acao').value;
    const margemSeguranca = (precoTeto - precoAcao) / precoAcao * 100;
    document.getElementById('margem-seguranca').value = margemSeguranca.toFixed(2);

}
