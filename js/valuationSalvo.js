const ui = {

    async renderizarDados(){

        const tbody = document.getElementById("tbody-tabela");
        tbody.innerHTML = ""; // Limpa o conteúdo da tabela antes de adicionar os novos dados
        try{
            const dados = await api.listar();
            if(!dados || dados.length === 0){
                const tr = document.createElement("tr");
                tr.innerHTML = '<td colspan="7" class="mensagem-vazia">Nenhum preço salvo ainda!</td>';
                tbody.appendChild(tr);
                return;
            }            
            dados.forEach(dado => {
                const upside = (dado.precoTeto - dado.precoAcao) / dado.precoAcao * 100;
                const classeUpside = upside >= 0 ? "upside-positivo" : "upside-negativo";

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${dado.ticker}</td>
                    <td> <input type="text" class="editavel" value="${formatarNumeros(dado.precoAcao)}"> </td>
                    <td>${formatarNumeros(dado.precoTeto)}</td>
                    <td>${dado.anosProjetados}</td>
                    <td> <input type="text" class="upside ${classeUpside}" value="${formatarNumeros(upside)}%" disabled> </td>
                    <td>${formatarData(dado.data)}</td>
                `;
                tbody.appendChild(tr);
            });
        }
        catch(error){
            throw error;
        }

    }
    

};

function formatarNumeros(valor, casas = 2) {
    const fator = Math.pow(10, casas);
    const truncado = Math.trunc(valor * fator) / fator;
    return truncado.toFixed(casas).replace('.', ',');
}

function formatarData(data){
    const [ano, mes, dia] = data.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
}

ui.renderizarDados(); // Chama a funçao para renderizar os dados