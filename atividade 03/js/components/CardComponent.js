import { ItemService } from "../service/ItemService.js";

const addItemForm = document.getElementById("form-add-item");

var itemService = new ItemService();

function createItemCard(item,  loadItemsFunc) {

    const itemCard = document.createElement("div");
    itemCard.classList.add("card", "shadow-sm", "item-card", "col-md-3");

    const photo = document.createElement("img");
    photo.src = item.imagem;
    photo.alt = item.titulo;

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "d-flex", "flex-column");


    const titulo = document.createElement("h5");
    titulo.textContent = item.titulo;
    titulo.classList.add("card-title");

    const descricao = document.createElement("p");
    descricao.textContent = `Descrição: ${item.descricao}`;
    descricao.classList.add("card-text", "mb-1");

    const categoria = document.createElement("h3");
    categoria.textContent = `Categoria: ${item.categoria}`;
    categoria.classList.add("badge", "text-bg-primary");

    const plataforma = document.createElement("h3");
    plataforma.textContent = `Plataforma: ${item.plataforma}`;
    plataforma.classList.add("badge", "text-bg-primary");

    const perfil = document.createElement("a");
    perfil.href = item.perfil || "#";          
    perfil.innerHTML = `<i class="bi bi-box-arrow-up-right me-1"></i> Link do perfil`;  
    perfil.target = "_blank";                  
    perfil.rel = "noopener noreferrer";      
    perfil.classList.add("card-text", "mb-2", "d-block", "text-primary", "text-decoration-none");


    const divButtons = document.createElement("div");
    divButtons.classList.add("d-flex", "justify-content-end", "gap-2")

    const btnEdit = document.createElement("button");
    btnEdit.innerHTML = '<i class="bi bi-pencil-square me-1"></i>';
    btnEdit.classList.add("btn", "btn-outline-dark", "btn-edit");
    btnEdit.addEventListener("click", function () {
        document.getElementById("campo-titulo").value = item.titulo;
        document.getElementById("campo-descricao").value = item.descricao;
        document.getElementById("campo-imagem").value = item.imagem;
        document.getElementById("campo-categoria").value = item.categoria;
        document.getElementById("campo-plataforma").value = item.plataforma;
        document.getElementById("campo-perfil-jogo").value = item.perfil;
        addItemForm.dataset.mode = "edit";
        addItemForm.dataset.id = item.id;
        const modalTitle = document.querySelector("#modal-form-add-item .modal-title");
        modalTitle.textContent = "Editar Jogo";
        const modal = new bootstrap.Modal(document.getElementById("modal-form-add-item"));
        modal.show();
    });

    const btnRemove = document.createElement("button");
    btnRemove.innerHTML = '<i class="bi bi-trash me-1"></i>'
    btnRemove.classList.add("btn", "btn-outline-dark", "btn-remove");
    btnRemove.addEventListener("click", async function () {
        if (confirm(`Deseja remover o item "${item.titulo}"?`)) {
            try {
                const res = await itemService.removeItem(item.id);
                if (res.ok) {
                    showToast("Jogo removido com sucesso!", "danger");
                    console.log("Item removido e lista atualizada!");
                    if (typeof loadItemsFunc === "function") {
                        await loadItemsFunc();
                    }
                } else {
                    console.error("Falha ao remover item:", res.statusText);
                }
            } catch (error) {
                console.error("Erro ao remover item:", error);
            }
        }
    });

    cardBody.appendChild(titulo);
    cardBody.appendChild(descricao);
    cardBody.appendChild(categoria);
    cardBody.appendChild(plataforma);
    cardBody.appendChild(perfil);

    divButtons.appendChild(btnEdit);
    divButtons.appendChild(btnRemove);

    cardBody.appendChild(divButtons)
    itemCard.appendChild(photo);
    itemCard.appendChild(cardBody);

    itemCard.setAttribute("data-id", `${item.id}`);
    return itemCard;
}

export default createItemCard;