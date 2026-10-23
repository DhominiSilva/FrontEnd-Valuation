document.querySelector(".salvar-preco").addEventListener("click", async () => {
    const dados = {
        payoutMedio: limparFormatacao('payout'),
        taxaDesconto: limparFormatacao('taxa-desconto'),
        roe: limparFormatacao('roe'),
        crescimentoEsperado: limparFormatacao('crescimento-esperado'),
        exTesouraria: limparFormatacao('ex-tesouraria'),
        patrimonioLiquido: limparFormatacao('patrimonio-liquido'),
        precoAcao: limparFormatacao('preco-acao'),
        ll2025: limparFormatacao('ll-2025'),
        ll2026: limparFormatacao('ll-2026'),
        crescimento2027: limparFormatacao('crescimento-2027'),
        crescimento2028: limparFormatacao('crescimento-2028'),
        crescimento2029: limparFormatacao('crescimento-2029'),
        crescimento2030: limparFormatacao('crescimento-2030'),
        crescimentoPerp: limparFormatacao('crescimento-perpetuo'),
        precoTeto: limparFormatacao('card-preco-por-acao'),
        anotacoes: document.getElementById('texto-anotacoes').value
    };
    try{
        const resultado = await api.save(dados);
        console.log("Salvo:", resultado);
    }catch(error){
        console.error("Falha ao salvar:", error);
    }
});
