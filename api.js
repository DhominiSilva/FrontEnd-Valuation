const API_BASE_URL = "http://localhost:8080";

const api = {
    async save(dados){
        const resposta =await fetch(`${API_BASE_URL}/v1/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });
        if (!resposta.ok) { throw new Error(`Erro ao salvar os dados ${resposta.status}`); }
        return resposta.status;
    },

    async listar(){
        const resposta =await fetch(`${API_BASE_URL}/v1/save`);
        if (!resposta.ok) { throw new Error(`Erro ao listar os dados ${resposta.status}`); }
        return resposta.json();
    }
}
