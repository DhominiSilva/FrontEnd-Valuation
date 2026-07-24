let quantidadeAnos = 3;

// Controla se o usuário alterou manualmente as taxas de crescimento
const crescimentoAlterado = {
    2027: false,
    2028: false,
    2029: false,
    2030: false,
    perpetuo: false
};

// Atalho para definir o valor de um input (evitando que eu escreva document.get... varias vezes)
const definirValor = (id, valor) => {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.value = valor;
    }
};

// Verifica se todos os campos têm valores numéricos válidos
function camposValidos() {
    const campos = [
        'payout', 'taxa-desconto', 'ex-tesouraria', 'patrimonio-liquido', 
        'preco-acao', 'll-2025', 'll-2026', 'crescimento-2026', 
        'crescimento-2027', 'crescimento-2028', 'crescimento-perpetuo'
    ];
    return campos.every(id => !isNaN(limparFormatacao(id)));
}

// FORMATADORES DE DADOS
//----------------------

// Adiciona os pontos (.), melhorando a leitura visual 1.000.000
function numeroFormatado(valor) {
    if (!isFinite(valor) || isNaN(valor)) return "0";
    return new Intl.NumberFormat('pt-BR', { 
        style: 'decimal', 
        maximumFractionDigits: 0 
    }).format(valor);
}

// Formata para moeda R$ 3.000,00
function numeroMoeda(valor) {
    if (!isFinite(valor) || isNaN(valor)) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL', 
        minimumFractionDigits: 2 
    }).format(valor);
}

// Formata para porcentagem 50%
function numeroPorcentagem(valor) {
    if (!isFinite(valor) || isNaN(valor)) return "0,00%";
    return new Intl.NumberFormat('pt-BR', { 
        style: 'percent', 
        minimumFractionDigits: 2 
    }).format(valor / 100);
}

// remove formatações visuais para cálculos matemáticos
function limparFormatacao(id) {
    const elemento = document.getElementById(id);
    if (!elemento) return 0;

    let valor = elemento.value.toString();
    if (!valor) return 0;

    valor = valor.replace(/[R$%\s]/g, '');

    if (valor.includes('.') && valor.includes(',')) {
        valor = valor.replace(/\./g, '');
    } else if (valor.includes(',')) {
        valor = valor.replace(',', '.');
    } else if (valor.includes('.')) {
        const partes = valor.split('.');
        if (partes.length > 2 || partes[partes.length - 1].length === 3) {
            valor = valor.replace(/\./g, '');
        }
    }
    
    valor = valor.replace(',', '.');
    return parseFloat(valor) || 0;
}

// Formatações disparadas em eventos onblur/onfocus
function formatarMoeda(id) { definirValor(id, numeroMoeda(limparFormatacao(id))); }
function formatarPorcentagem(id) { definirValor(id, numeroPorcentagem(limparFormatacao(id))); }
function formatarValor(id) { definirValor(id, numeroFormatado(limparFormatacao(id))); }

// Limpa o input quando o usuario clica em cima
function limparCampo(id) {
    const valor = limparFormatacao(id);
    definirValor(id, valor === 0 ? "" : valor.toString().replace('.', ','));
}

// CÁLCULO DO VALUATION
// -------------------------------------

function calcular() {
    if (!camposValidos()) return;

    // Premissas que o usuario informa
    const payout = limparFormatacao('payout');
    const taxaDesconto = limparFormatacao('taxa-desconto');
    const tesouraria = limparFormatacao('ex-tesouraria');
    const patrimonioLiquido = limparFormatacao('patrimonio-liquido');
    const precoAcao = limparFormatacao('preco-acao');
    const ll2025 = limparFormatacao('ll-2025');
    const ll2026 = limparFormatacao('ll-2026');

    // Calculo do ROE e Crescimento Esperado
    const roe = (ll2025 / patrimonioLiquido) * 100;
    definirValor('roe', numeroPorcentagem(roe));

    const crescimentoEsperado = (roe / 100) * (1 - (payout / 100)) * 100;
    definirValor('crescimento-esperado', numeroPorcentagem(crescimentoEsperado));

    // Projeção 2026
    const vpl2026 = ll2026 / Math.pow(1 + (taxaDesconto / 100), 1);
    definirValor('vpl-2026', numeroMoeda(vpl2026));

    const crescimento2026 = ((ll2026 - ll2025) / ll2025) * 100;
    definirValor('crescimento-2026', numeroPorcentagem(crescimento2026));

    // Projeção dos Anos Seguintes
    const anosProjetados = quantidadeAnos === 3 ? [2027, 2028] : [2027, 2028, 2029, 2030];
    let llAnterior = ll2026;
    let somaVpl = vpl2026;

    anosProjetados.forEach((ano, posicao) => {
        const expoenteTempo = posicao + 2;

        // Se o usuario alterar o valor, faz os calculos a partir deste número
        if (!crescimentoAlterado[ano]) {
            definirValor(`crescimento-${ano}`, numeroPorcentagem(crescimentoEsperado));
        }

        const crescimento = limparFormatacao(`crescimento-${ano}`);
        const llAno = llAnterior * (1 + (crescimento / 100));
        definirValor(`ll-${ano}`, numeroMoeda(llAno));

        const vplAno = llAno / Math.pow(1 + (taxaDesconto / 100), expoenteTempo);
        definirValor(`vpl-${ano}`, numeroMoeda(vplAno));

        llAnterior = llAno; 
        somaVpl += vplAno;
    });

    // Cálculo do Perpétuo
    // Se o usuario alterar o valor, faça os calculos a partir deste número
    if (!crescimentoAlterado['perpetuo']) {
        definirValor('crescimento-perpetuo', numeroPorcentagem(3));
    }
    const crescimentoPerpetuo = limparFormatacao('crescimento-perpetuo');
    const llPerpetuo = llAnterior * (1 + (crescimentoPerpetuo / 100)) / ((taxaDesconto / 100) - (crescimentoPerpetuo / 100));
    definirValor('ll-perpetuo', numeroMoeda(llPerpetuo));

    const expoentePerpetuo = quantidadeAnos === 3 ? 4 : 6;
    const vplPerpetuo = llPerpetuo / Math.pow(1 + (taxaDesconto / 100), expoentePerpetuo);
    definirValor('vpl-perpetuo', numeroMoeda(vplPerpetuo));

    somaVpl += vplPerpetuo;

    // Atualização cards
    const precoTeto = somaVpl / tesouraria;
    const margemSeguranca = ((precoTeto - precoAcao) / precoAcao) * 100;

    definirValor('card-preco-acao', numeroMoeda(precoAcao));
    definirValor('card-market-cap', numeroMoeda(somaVpl));
    definirValor('card-preco-por-acao', numeroMoeda(precoTeto));
    definirValor('card-margem-seguranca', numeroPorcentagem(margemSeguranca));
}

// EVENT LISTENERS
// -------------------------------

// Monitoramento de alterações manuais nas taxas de crescimento
const mapeamentoInputs = {
    'crescimento-2027': 2027,
    'crescimento-2028': 2028,
    'crescimento-2029': 2029,
    'crescimento-2030': 2030,
    'crescimento-perpetuo': 'perpetuo'
};

// Altera os valores de crescimento esperado de false para true
for (let idDoCampo in mapeamentoInputs) {
    let elemento = document.getElementById(idDoCampo);

    if (elemento) {
        elemento.oninput = function() {
            let anoCorrespondente = mapeamentoInputs[idDoCampo]; 
            
            // Marca esse ano específico como alterado pelo usuário
            crescimentoAlterado[anoCorrespondente] = true; 
            
            // Recalcula o Valuation
            calcular();                        
        };
    }
}

// Projeção de 5 Anos
document.querySelector('.projecao-5').addEventListener('click', () => {
    if (document.getElementById('ll-2030')) return;

    const anosExtras = `
        <tr>
            <td>2029</td>
            <td data-label="Lucro líquido">
                <div class="campo-input">
                    <input type="text" id="ll-2029" disabled oninput="calcular()" onblur="formatarMoeda('ll-2029')">
                </div>
            </td>
            <td data-label="Crescimento">
                <div class="campo-input-crescimento editavel">
                    <input type="text" id="crescimento-2029" onfocus="limparCampo('crescimento-2029')" oninput="calcular()" onblur="formatarPorcentagem('crescimento-2029')">
                </div>
            </td>
            <td data-label="VPL">
                <input type="text" id="vpl-2029" disabled oninput="calcular()" onblur="formatarMoeda('vpl-2029')">
            </td>
        </tr>
        <tr>
            <td>2030</td>
            <td data-label="Lucro líquido">
                <div class="campo-input">
                    <input type="text" id="ll-2030" disabled oninput="calcular()" onblur="formatarMoeda('ll-2030')">
                </div>
            </td>
            <td data-label="Crescimento">
                <div class="campo-input-crescimento editavel">
                    <input type="text" id="crescimento-2030" onfocus="limparCampo('crescimento-2030')" oninput="calcular()" onblur="formatarPorcentagem('crescimento-2030')">
                </div>
            </td>
            <td data-label="VPL">
                <input type="text" id="vpl-2030" disabled oninput="calcular()" onblur="formatarMoeda('vpl-2030')">
            </td>
        </tr>
    `;

    // Procura o elemento perpetuo na tabela
    const elementoLinhaPerpetuo = document.getElementById('perpetuo')

    // Se a linha do perpétuo existir na tela:
    if (elementoLinhaPerpetuo) {
        elementoLinhaPerpetuo.insertAdjacentHTML('beforebegin', anosExtras);
    }

    // Uma lista com os novos anos que acabaram de ser criados
    const novosAnosInjetados = [2029, 2030];

    // Configurando o ouvinte de digitação para cada um desses novos anos
    novosAnosInjetados.forEach(function(anoFuturo) {
        const campoDeInput = document.getElementById(`crescimento-${anoFuturo}`);

        // Só configura se o campo realmente foi encontrado no HTML
        if (campoDeInput) {
            campoDeInput.oninput = function() {
                crescimentoAlterado[anoFuturo] = true;
                calcular();
            };
        }
    });

    quantidadeAnos = 5;
    calcular();

    document.querySelector('.projecao-3').classList.remove('active');
    document.querySelector('.projecao-5').classList.add('active');
});

// Projeção de 3 anos
document.querySelector('.projecao-3').addEventListener('click', () => {
    quantidadeAnos = 3;

    // Removendo os campos 2029 e 2030
    const camposRemover = ['ll-2029', 'll-2030'];
    camposRemover.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.closest('tr').remove();
    });
    
    crescimentoAlterado[2029] = false;
    crescimentoAlterado[2030] = false;
    calcular();

    document.querySelector('.projecao-5').classList.remove('active');
    document.querySelector('.projecao-3').classList.add('active');
});

// Configuração Inicial ao carregar a página
window.onload = function() {
    definirValor('payout', numeroPorcentagem(0));
    definirValor('taxa-desconto', numeroPorcentagem(0));
    definirValor('roe', numeroPorcentagem(0));
    definirValor('crescimento-esperado', numeroPorcentagem(0));
    definirValor('ex-tesouraria', numeroFormatado(0));
    definirValor('patrimonio-liquido', numeroMoeda(0));
    definirValor('preco-acao', numeroMoeda(0));
    definirValor('ll-2025', numeroMoeda(0));
    definirValor('ll-2026', numeroMoeda(0));
    definirValor('crescimento-2026', numeroPorcentagem(0));
    definirValor('crescimento-2027', numeroPorcentagem(0));
    definirValor('crescimento-2028', numeroPorcentagem(0));
    definirValor('crescimento-perpetuo', numeroPorcentagem(3));

    calcular();
};

function reset() {
    location.reload();
}
