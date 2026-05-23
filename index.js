function calcular(){
    // Calcular o ROE (Return on Equity)
    const patrimonioLiquido = document.getElementById('patrimonio-liquido').value; // estou pegando o id do input do patrimônio líquido e armazenando na variável patrimonioLiquido
    const ll2025 = document.getElementById('ll-2025').value; // estou pegando o id do input do lucro líquido de 2025 e armazenando na variável ll2025
    const roe = (ll2025 / patrimonioLiquido) * 100; // estou calculando o ROE
    document.getElementById('roe').value = roe.toFixed(2); // estou pegando o id do input do ROE e atribuindo o valor do ROE calculado, formatado com 2 casas decimais, resultado aparece automaticamente no input do ROE

    // Calcular Taxa de Crescimento
    const payout = document.getElementById('payout').value; // estou pegando o id do input do payout e armazenando na variável payout
    const crescimentoEsperado = (roe / 100) * (1 - (payout / 100)) * 100;
    document.getElementById('crescimento-esperado').value = crescimentoEsperado.toFixed(2); // estou pegando o id do input da taxa de crescimento e atribuindo o valor da taxa de crescimento calculada, formatado com 2 casas decimais, resultado aparece automaticamente no input da taxa de crescimento
    console.log('crescimento esperado:', crescimentoEsperado.toFixed(2) + '%');
}