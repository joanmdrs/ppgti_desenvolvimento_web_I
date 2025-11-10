import { Item } from "../model/Item.js";

var baseUrl = "https://ppgti-dev-web-i-atividade-03-default-rtdb.firebaseio.com/"

export class ItemService {
    
    async fetchItems(){
        let fetchUrl = baseUrl + "items.json";

        const itemsList = [];

        try {
            let response = await fetch(fetchUrl);

            if (!response.ok){
                throw new Error("Resposta de rede não foi ok");
            }

            let items = await response.json();

            if (items){
                for (let key in items){
                    const item = new Item({
                        id: key,
                        titulo: items[key].titulo,
                        descricao: items[key].descricao,
                        categoria: items[key].categoria,
                        imagem: items[key].imagem,
                        plataforma: items[key].plataforma,
                        perfil: items[key].perfil

                    });
                    itemsList.push(item);
                }
            }
            return itemsList
        } catch (error) {
            console.log(error);
            throw new Error("Falha ao tentar buscar os dados de items: ", error)
        }
    }

    async addItem(itemData){
        let addUrl = baseUrl + "items.json";

        try {
            let response = await fetch(addUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(itemData),

            });

            return response
        } catch (error) {
            throw new Error("Erro ao tentar salvar o item: " + error)
        }
    }

    async removeItem(idItem) {
        const deleteUrl = `${baseUrl}items/${idItem}.json`;

        try {
            const response = await fetch(deleteUrl, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir o item: ${response.statusText}`);
            }

            return response;
        } catch (error) {
            console.error("Erro ao tentar excluir o item:", error);
            throw error;
        }
    }


    async updateItem(idItem, updatedData) {
        const updateUrl = `${baseUrl}items/${idItem}.json`;

        try {
            const response = await fetch(updateUrl, {
                method: "PATCH", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            });

            return response
        } catch (error) {
            console.error("Erro ao tentar atualizar o item:", error);
            throw error;
        }
    }
    
}
