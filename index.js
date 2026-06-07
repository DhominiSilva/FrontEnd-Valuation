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

// estou verificando se os campos de entrada são válidos, para evitar que fique aparecendo NaN nos campos automáticos, caso o usuário deixe algum campo vazio ou com um valor inválido, a função camposValidos() retorna false e os campos automáticos ficam com o valor 0
function camposValidos() {
    const campos = [
        'payout', 'taxa-desconto', 'ex-tesouraria', 'patrimonio-liquido', 
        'preco-acao', 'll-2025', 'll-2026', 'crescimento-2026', 
        'crescimento-2027', 'crescimento-2028', 'crescimento-perpetuo'
    ];
    return campos.every(id => !isNaN(limparFormatacao(id)))
}

// assim que o usuario carregar a página, todos inputs começam com o valor 0
window.onload = function() {
    calcular() // chama calcular para já preencher os campos automáticos com 0
    document.getElementById('payout').value = 0
    document.getElementById('taxa-desconto').value = 0
    document.getElementById('ex-tesouraria').value = 0
    document.getElementById('patrimonio-liquido').value = 0
    document.getElementById('preco-acao').value = 0
    document.getElementById('ll-2025').value = 0
    document.getElementById('ll-2026').value = 0
    document.getElementById('crescimento-2026').value = 0
    document.getElementById('crescimento-2027').value = 0
    document.getElementById('crescimento-2028').value = 0
    document.getElementById('crescimento-perpetuo').value = 3
    document.getElementById('roe').value = 0
    document.getElementById('crescimento-esperado').value = 0
}

// Funções auxiliares para formatação de moeda e porcentagem, limpeza de formatação e facilitar o cálculo dos valores
function valorParaMoeda(valor) {

    // isFinite verifica se o número é válido (barra NaN e Infinity)
    if (!isFinite(valor) || isNaN(valor)) {
        return "R$ 0,00";
    }

    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL', 
        minimumFractionDigits: 2 
    }).format(valor);

}

function valorParaPorcentagem(valor) {

    if (!isFinite(valor) || isNaN(valor)) {
        return "0,00%";
    }

    return new Intl.NumberFormat('pt-BR', { 
        style: 'percent', 
        minimumFractionDigits: 2 
    }).format(valor / 100);

}

// funções são chamadas no evento onblur dos inputs para limpar a formatação quando o usuário clicar no input para editar o valor
function formatarMoeda(id) {

    const valorNumerico = limparFormatacao(id); 
    document.getElementById(id).value = valorParaMoeda(valorNumerico);

}

function formatarPorcentagem(id) {

    const valorNumerico = limparFormatacao(id);
    document.getElementById(id).value = valorParaPorcentagem(valorNumerico);

}

function formatarValor(id) {

    const valorNumerico = limparFormatacao(id);
    const valorFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'decimal',
        maximumFractionDigits: 0
    }).format(valorNumerico);
    document.getElementById(id).value = valorFormatado;

}

// essa função é chamada no evento onfocus dos inputs, para limpar a formatação e deixar apenas o valor numérico, facilitando a edição pelo usuário, e também é usada para pegar o valor numérico dos inputs para os cálculos
function limparFormatacao(id) {

    let valor = document.getElementById(id).value.toString();
    if (!valor) return 0;

    // Remove R$, % e espaços em branco
    valor = valor.replace(/[R$%\s]/g, '');

    // Se o valor tem ponto E vírgula (ex: 1.200,50), tiramos o ponto de milhar
    if (valor.includes('.') && valor.includes(',')) {
        valor = valor.replace(/\./g, '');
    }
    
    // Troca a vírgula decimal por ponto para o JavaScript conseguir calcular
    valor = valor.replace(',', '.');

    return parseFloat(valor) || 0;

}

function limparCampo(id) {

    const valor = limparFormatacao(id);
    // Devolve o número pro input trocando o ponto por vírgula, para facilitar a edição em PT-BR
    document.getElementById(id).value = valor.toString().replace('.', ',');

}

function calcular(){

    if (!camposValidos) return;

    // Calcular o ROE (Return on Equity)
    const patrimonioLiquido = limparFormatacao('patrimonio-liquido'); // estou pegando o id do input do patrimônio líquido e armazenando na variável patrimonioLiquido
    const ll2025 = limparFormatacao('ll-2025'); // estou pegando o id do input do lucro líquido de 2025 e armazenando na variável ll2025
    const roe = (ll2025 / patrimonioLiquido) * 100;
    document.getElementById('roe').value = roe.toFixed(2); // estou pegando o id do input do ROE e atribuindo o valor do ROE calculado, formatado com 2 casas decimais, resultado aparece automaticamente no input do ROE

    // Calcular Taxa de Crescimento
    const payout = limparFormatacao('payout'); // estou pegando o id do input do payout e armazenando na variável payout
    const crescimentoEsperado = (roe / 100) * (1 - (payout / 100)) * 100;
    document.getElementById('crescimento-esperado').value = valorParaPorcentagem(crescimentoEsperado); // estou pegando o id do input da taxa de crescimento e atribuindo o valor da taxa de crescimento calculada, formatado com 2 casas decimais, resultado aparece automaticamente no input da taxa de crescimento

    // Calcular 2026
        // Calcular ll2026
    const ll2026 = limparFormatacao('ll-2026'); // estou pegando o id do input do lucro líquido de 2026 e armazenando na variável ll2026
    const taxaDesconto = limparFormatacao('taxa-desconto'); // estou pegando o id do input da taxa de desconto e armazenando na variável taxaDesconto
        // Calcular VPL de 2026
    const vpl2026 = ll2026 / Math.pow(1 + (taxaDesconto / 100), 1); // estou calculando o VPL de 2026
    document.getElementById('vpl-2026').value = valorParaMoeda(vpl2026); // estou pegando o id do input do VPL de 2026 e atribuindo o valor do VPL calculado, formatado com 2 casas decimais, resultado aparece automaticamente no input do VPL de 2026
        // Calcular taxa de crescimento de 2026 comparado a 2025
    const crescimento2026 = (ll2026 - ll2025) / ll2025 * 100; // estou calculando a taxa de crescimento de 2026 em relação a 2025
    document.getElementById('crescimento-2026').value = valorParaPorcentagem(crescimento2026); // estou pegando o id do input da taxa de crescimento de 2026 e atribuindo o valor da taxa de crescimento calculada, formatado com 2 casas decimais, resultado aparece automaticamente no input da taxa de crescimento de 2026

    // Calcular 2027
        // Calcular ll2027
    if (!crescimentoAlterado[2027]) {
        document.getElementById('crescimento-2027').value = valorParaPorcentagem(crescimentoEsperado); // se a taxa de crescimento de 2027 não tiver sido alterada pelo usuário, atribui o valor da taxa de crescimento esperada ao input da taxa de crescimento de 2027
    }
    const crescimento2027 = limparFormatacao('crescimento-2027'); // estou pegando o id do input da taxa de crescimento de 2027 e armazenando na variável crescimento2027
    const ll2027 = ll2026 * (1 + (crescimento2027 / 100)); // estou calculando o lucro líquido de 2027 com base no lucro líquido de 2026 e na taxa de crescimento esperada
    document.getElementById('ll-2027').value = valorParaMoeda(ll2027); // estou pegando o id do input do lucro líquido de 2027 e atribuindo o valor do lucro líquido calculado, formatado com 2 casas decimais, resultado aparece automaticamente no input do lucro líquido de 2027

        // Calcular VPL de 2027
    const vpl2027 = ll2027 / Math.pow(1 + (taxaDesconto / 100), 2); // estou calculando o VPL de 2027
    document.getElementById('vpl-2027').value = valorParaMoeda(vpl2027); // estou pegando o id do input do VPL de 2027 e atribuindo o valor do VPL calculado, formatado com 2 casas decimais, resultado aparece automaticamente no input do VPL de 2027

    // Calcular 2028
        // Calcular ll2028
    if (!crescimentoAlterado[2028]) {
        document.getElementById('crescimento-2028').value = valorParaPorcentagem(crescimentoEsperado); 
    }
    const crescimento2028 = limparFormatacao('crescimento-2028');
    const ll2028 = ll2027 * (1 + (crescimento2028 / 100));
    document.getElementById('ll-2028').value = valorParaMoeda(ll2028); 

        // Calcular VPL de 2028
    const vpl2028 = ll2028 / Math.pow(1 + (taxaDesconto / 100), 3);
    document.getElementById('vpl-2028').value = valorParaMoeda(vpl2028); 

    // Calcular perpétuo
        // Calcular ll perpétuo
    if (!crescimentoAlterado['perpetuo']) {
        document.getElementById('crescimento-perpetuo').value = 3.00;
    }
    const crescimentoPerpetuo = limparFormatacao('crescimento-perpetuo');
    const llPerpetuo = ll2028 * (1 + (crescimentoPerpetuo / 100)) / ((taxaDesconto / 100) - (crescimentoPerpetuo / 100));
    document.getElementById('ll-perpetuo').value = valorParaMoeda(llPerpetuo);

        // Calcular VPL perpétuo
    const vplPerpetuo = llPerpetuo / Math.pow(1 + (taxaDesconto / 100), 4); // CONSERTAR ESSE VALOR PARA DEIXAR 3% PADRAO E SE O USUARIO QUISER ALTERAR, FIQUE A VONTADE
    document.getElementById('vpl-perpetuo').value = valorParaMoeda(vplPerpetuo);



    // Market Cap
    const marketCap = vpl2026 + vpl2027 + vpl2028 + vplPerpetuo;
    document.getElementById('market-cap').value = valorParaMoeda(marketCap);


    // Preço teto
    const tesouraria = limparFormatacao('ex-tesouraria');
    const precoTeto = (vpl2026 + vpl2027 + vpl2028 + vplPerpetuo) / tesouraria;
    document.getElementById('preco-por-acao').value = valorParaMoeda(precoTeto);

    // Margem de segurança
    const precoAcao = limparFormatacao('preco-acao');
    const margemSeguranca = (precoTeto - precoAcao) / precoAcao * 100;
    document.getElementById('margem-seguranca').value = valorParaPorcentagem(margemSeguranca);

}
