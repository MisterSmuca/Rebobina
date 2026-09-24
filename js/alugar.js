const CHAVE_USUARIO = "rebobinaUsuario";
const CHAVE_ALUGUEIS = "rebobinaAlugueis";

// ---------- Utilitários ----------
const $ = (id) => document.getElementById(id);
const ler = (chave) => JSON.parse(localStorage.getItem(chave));
const salvar = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));
const modal = (id) => bootstrap.Modal.getOrCreateInstance($(id));

// ---------- Modais ----------
const campos = [
    { name: "nome", type: "text", placeholder: "Nome" },
    { name: "email", type: "email", placeholder: "E-mail" },
    { name: "telefone", type: "tel", placeholder: "Telefone" },
];

const inputs = campos
    .map((c) => `<input class="form-control mb-3" required
        name="${c.name}" type="${c.type}" placeholder="${c.placeholder}">`)
    .join("");

const criarModal = (id, titulo, corpo, botao) => `
    <div class="modal fade" id="${id}">
        <div class="modal-dialog">
            <form class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">${titulo}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">${corpo}</div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-dark">${botao}</button>
                </div>

            </form>
        </div>
    </div>`;

const modalSucesso = `
    <div class="modal fade" id="modalSucesso">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content text-center p-4">
                <div class="display-1">📼</div>
                <h5 class="fw-bold mt-2">Compra realizada!</h5>
                <p class="text-muted mb-4" id="itemSucesso"></p>
                <button type="button" class="btn btn-dark rounded-pill px-4"
                    data-bs-dismiss="modal">
                    Fechar
                </button>
            </div>
        </div>
    </div>`;

document.body.insertAdjacentHTML("beforeend",
    criarModal("modalCadastro", "Cadastro",
        `<p id="itemCadastro"></p>${inputs}`, "Cadastrar") +
    criarModal("modalAluguel", "Confirmar Compra",
        `<p id="saudacao"></p><strong id="itemAluguel"></strong>`, "Confirmar") +
    modalSucesso
);

// ---------- Fluxo de compra ----------
function abrirCadastro(item) {
    $("itemCadastro").textContent = `Para comprar "${item.titulo}", faça seu cadastro.`;

    $("modalCadastro").querySelector("form").onsubmit = (e) => {
        e.preventDefault();

        salvar(CHAVE_USUARIO, Object.fromEntries(new FormData(e.target)));
        modal("modalCadastro").hide();
        abrirConfirmacao(item);
    };

    modal("modalCadastro").show();
}

function abrirConfirmacao(item) {
    $("saudacao").textContent = `Olá, ${ler(CHAVE_USUARIO).nome}!`;
    $("itemAluguel").textContent = `${item.titulo} - ${item.preco}`;

    $("modalAluguel").querySelector("form").onsubmit = (e) => {
        e.preventDefault();

        salvar(CHAVE_ALUGUEIS, [...(ler(CHAVE_ALUGUEIS) ?? []), item]);

        // Só mostra o sucesso depois que o modal de confirmação terminar de fechar
        $("modalAluguel").addEventListener("hidden.bs.modal", () => {
            $("itemSucesso").textContent = item.titulo;
            modal("modalSucesso").show();
        }, { once: true });

        modal("modalAluguel").hide();
    };

    modal("modalAluguel").show();
}

const comprar = (item) =>
    ler(CHAVE_USUARIO) ? abrirConfirmacao(item) : abrirCadastro(item);

// ---------- Botões Comprar ----------
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".card button").forEach((botao) => {
        botao.onclick = () => {
            const card = botao.closest(".card");

            comprar({
                titulo: card.querySelector("h3").textContent,
                preco: card.querySelector(".preco").textContent,
            });
        };
    });
});