import createItemCard from "./components/CardComponent.js";
import { ItemService } from "./service/ItemService.js";


var itemService = new ItemService();

const itemsList = document.getElementById("section-grid-items");
const addItemForm = document.getElementById("form-add-item");
const buttonAddItem = document.getElementById("button-add-item");
let allItems = [];

document.addEventListener("DOMContentLoaded", listItems);

addItemForm.addEventListener("submit", submitItem);

buttonAddItem.addEventListener("click", () => {
    addItemForm.dataset.mode = "add";
    addItemForm.dataset.id = "";
    addItemForm.reset();

    const modalTitle = document.querySelector("#modal-form-add-item .modal-title");
    modalTitle.textContent = "Novo Jogo";
})

document.getElementById("year").textContent = new Date().getFullYear();

async function listItems() {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "block";
    
    try {
        const items = await itemService.fetchItems();

        if (items){
            allItems = items;
            renderItems(items);
            renderCategories(allItems);
        }
    } catch (error) {
        console.log("Falha ao tentar listar os items da coleção: ", error)
    } finally {
        if (spinner) spinner.style.display = "none";
    }
}

async function submitItem(event) {
    event.preventDefault(); 

    const formData = new FormData(addItemForm);
    const itemData = {
        titulo: formData.get("campo-titulo"),
        descricao: formData.get("campo-descricao"),
        categoria: formData.get("campo-categoria"),
        imagem: formData.get("campo-imagem") || "https://placehold.co/100", 
        plataforma: formData.get("campo-plataforma"),
        perfil: formData.get("campo-perfil-jogo"),
    };

    let mode = this.dataset.mode;
    let itemId = this.dataset.id;

    const modalElement = document.getElementById("modal-form-add-item");
    const modal = bootstrap.Modal.getInstance(modalElement);

    if(mode === "edit"){

        try {
            const resUpd = await itemService.updateItem(itemId, itemData);

            if (resUpd.ok){
                await listItems();
                modal.hide();
                addItemForm.reset();
                showToast("Jogo atualizado com sucesso!", "info"); 
            }
        } catch (error) {
            console.error("Falha ao tentar atualizar o item:", error);
        }

    } else {

        try {
            const resAdd = await itemService.addItem(itemData);

            if (resAdd.ok){
                await listItems();
                modal.hide();
                addItemForm.reset();
                showToast("Jogo adicionado com sucesso!", "success");
            }
        } catch (error) {
            console.log("Falha ao tentar inserir um item na coleção: ", error)
        }
    }  
}


function renderItems(items){
    itemsList.innerHTML = "";
    items.forEach(item => {
        const itemCard = createItemCard(item, listItems);
        itemsList.appendChild(itemCard)
    });
}

function renderCategories(items) {
    const categoriasUnicas = [...new Set(items.map(item => item.categoria || "Sem Categoria"))];
    const listaCategorias = document.getElementById("lista-categorias");

    listaCategorias.innerHTML = `
        <li><a class="dropdown-item active" href="#" data-categoria="todas">Todas</a></li>
    `;

    categoriasUnicas.forEach(cat => {
        const li = document.createElement("li");
        li.innerHTML = `<a class="dropdown-item" href="#" data-categoria="${cat}">${cat}</a>`;
        listaCategorias.appendChild(li);
    });

    const categoriaLinks = listaCategorias.querySelectorAll(".dropdown-item");
    categoriaLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const categoriaSelecionada = link.getAttribute("data-categoria");

            categoriaLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            filtrarPorCategoria(categoriaSelecionada);
        });
    });
}


function filtrarPorCategoria(categoria) {
    let filtrados = [];

    if (categoria === "todas") {
        filtrados = allItems;
    } else {
        filtrados = allItems.filter(item => item.categoria === categoria);
    }

    renderItems(filtrados);
}



function showToast(message, type = "primary") {
    const toastEl = document.getElementById("main-toast");
    const toastBody = document.getElementById("main-toast-body");

    toastEl.className = `toast align-items-center text-bg-${type} border-0`;

    toastBody.textContent = message;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

window.showToast = showToast;

