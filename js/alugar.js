const CHAVE_USUARIO = "rebobinaUsuario";
const CHAVE_ALUGUEIS = "rebobinaAlugueis";

// ---------- Utilitários ----------
const $ = (id) => document.getElementById(id);

const ler = (chave) => {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : null;
};

const salvar = (chave, valor) =>
    localStorage.setItem(chave, JSON.stringify(valor));

const modal = (id) =>
    bootstrap.Modal.getOrCreateInstance($(id));


// ---------- Identificar categoria pela página ----------
function identificarCategoria() {

    const pagina = window.location.pathname.toLowerCase();

    if (pagina.includes("musica")) {
        return "musica";
    }

    if (pagina.includes("filme")) {
        return "filme";
    }

    if (pagina.includes("serie")) {
        return "serie";
    }

    if (pagina.includes("jogo")) {
        return "jogo";
    }

    return "";
}


// ---------- Campos do cadastro ----------
const campos = [
    {
        name: "nome",
        type: "text",
        placeholder: "Nome"
    },
    {
        name: "email",
        type: "email",
        placeholder: "E-mail"
    },
    {
        name: "telefone",
        type: "tel",
        placeholder: "Telefone"
    }
];

const inputs = campos
    .map((c) => `
        <input
            class="form-control mb-3"
            required
            name="${c.name}"
            type="${c.type}"
            placeholder="${c.placeholder}">
    `)
    .join("");


// ---------- Criar Modal ----------
const criarModal = (id, titulo, corpo, botao) => `
    <div class="modal fade" id="${id}">
        <div class="modal-dialog">

            <form class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">${titulo}</h5>

                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal">
                    </button>
                </div>

                <div class="modal-body">
                    ${corpo}
                </div>

                <div class="modal-footer">

                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal">
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        class="btn btn-dark">
                        ${botao}
                    </button>

                </div>

            </form>

        </div>
    </div>
`;


// ---------- Modal de sucesso ----------
const modalSucesso = `
    <div class="modal fade" id="modalSucesso">

        <div class="modal-dialog modal-dialog-centered modal-sm">

            <div class="modal-content text-center p-4">

                <div class="display-1">📼</div>

                <h5 class="fw-bold mt-2">
                    Compra realizada!
                </h5>

                <p
                    class="text-muted mb-4"
                    id="itemSucesso">
                </p>

                <button
                    type="button"
                    class="btn btn-dark rounded-pill px-4"
                    data-bs-dismiss="modal">
                    Fechar
                </button>

            </div>

        </div>

    </div>
`;


// ---------- Inserir os modais no HTML ----------
document.body.insertAdjacentHTML(
    "beforeend",

    criarModal(
        "modalCadastro",
        "Cadastro",

        `
            <p id="itemCadastro"></p>

            ${inputs}
        `,

        "Cadastrar"
    )

    +

  criarModal(
    "modalAluguel",
    "Confirmar Compra",

    `
        <p id="saudacao"></p>

        <strong id="itemAluguel"></strong>

        <hr>

        <p class="fw-bold mb-2">
            Qual mídia gostaria de comprar?
        </p>

        <div id="opcoesMidia">

            <!-- Fita K-7 -->
            <div class="form-check mb-2">
                <input
                    class="form-check-input"
                    type="checkbox"
                    name="midia"
                    value="Fita K-7"
                    id="k7">

                <label
                    class="form-check-label"
                    for="k7">
                    📼 Fita K-7
                </label>
            </div>


            <!-- DVD -->
            <div class="form-check mb-2">
                <input
                    class="form-check-input"
                    type="checkbox"
                    name="midia"
                    value="DVD"
                    id="dvd">

                <label
                    class="form-check-label"
                    for="dvd">
                    📀 DVD
                </label>
            </div>


            <!-- Fita VHS -->
            <div class="form-check mb-2">
                <input
                    class="form-check-input"
                    type="checkbox"
                    name="midia"
                    value="Fita VHS"
                    id="vhs">

                <label
                    class="form-check-label"
                    for="vhs">
                    📼 Fita VHS
                </label>
            </div>


            <!-- Vinil: somente para música -->
            <div
                class="form-check mb-2"
                id="opcaoVinil">

                <input
                    class="form-check-input"
                    type="checkbox"
                    name="midia"
                    value="Vinil"
                    id="vinil">

                <label
                    class="form-check-label"
                    for="vinil">
                    💿 Vinil
                </label>
            </div>

        </div>

        <small class="text-muted">
            Selecione uma opção.
        </small>
    `,

    "Confirmar"
)

    +

    modalSucesso
);


// ---------- Abrir cadastro ----------
function abrirCadastro(item) {

    $("itemCadastro").textContent =
        `Para comprar "${item.titulo}", faça seu cadastro.`;


    $("modalCadastro")
        .querySelector("form")
        .onsubmit = (e) => {

            e.preventDefault();

            salvar(
                CHAVE_USUARIO,
                Object.fromEntries(
                    new FormData(e.target)
                )
            );

            modal("modalCadastro").hide();

            abrirConfirmacao(item);
        };


    modal("modalCadastro").show();
}


// ---------- Abrir confirmação ----------
function abrirConfirmacao(item) {

    $("saudacao").textContent =
        `Olá, ${ler(CHAVE_USUARIO).nome}!`;

    $("itemAluguel").textContent =
        `${item.titulo} - ${item.preco}`;


    // ---------- Mostrar Vinil somente em música ----------
    const opcaoVinil = $("opcaoVinil");

    if (item.categoria === "musica") {

        opcaoVinil.style.display = "block";

    } else {

        opcaoVinil.style.display = "none";

        $("vinil").checked = false;
    }


    // ---------- Limpar opções anteriores ----------
    document
        .querySelectorAll('input[name="midia"]')
        .forEach((checkbox) => {
            checkbox.checked = false;
        });


    // ---------- Permitir apenas uma mídia ----------
    document
        .querySelectorAll('input[name="midia"]')
        .forEach((checkbox) => {

            checkbox.onchange = () => {

                if (checkbox.checked) {

                    document
                        .querySelectorAll(
                            'input[name="midia"]'
                        )
                        .forEach((outro) => {

                            if (outro !== checkbox) {
                                outro.checked = false;
                            }

                        });

                }

            };

        });


    // ---------- Confirmar compra ----------
    $("modalAluguel")
        .querySelector("form")
        .onsubmit = (e) => {

            e.preventDefault();


            const checkboxSelecionado =
                document.querySelector(
                    'input[name="midia"]:checked'
                );


            // Não permite continuar sem escolher
            if (!checkboxSelecionado) {

                alert(
                    "Selecione a mídia que deseja comprar."
                );

                return;
            }


            const midia =
                checkboxSelecionado.value;


            // ---------- Dados da compra ----------
            const compra = {

                titulo: item.titulo,

                preco: item.preco,

                categoria: item.categoria,

                midia: midia

            };


            // ---------- Salvar compra ----------
            salvar(
                CHAVE_ALUGUEIS,

                [
                    ...(ler(CHAVE_ALUGUEIS) ?? []),

                    compra
                ]
            );


            // ---------- Mostrar sucesso ----------
            $("modalAluguel")
                .addEventListener(
                    "hidden.bs.modal",

                    () => {

                        $("itemSucesso").textContent =
                            `${item.titulo} - ${midia}`;

                        modal("modalSucesso").show();

                    },

                    { once: true }
                );


            modal("modalAluguel").hide();
        };


    modal("modalAluguel").show();
}


// ---------- Verificar se usuário já está cadastrado ----------
const comprar = (item) =>

    ler(CHAVE_USUARIO)

        ? abrirConfirmacao(item)

        : abrirCadastro(item);


// ---------- Botões Comprar ----------
document.addEventListener(
    "DOMContentLoaded",

    () => {

        const categoriaPagina =
            identificarCategoria();


        document
            .querySelectorAll(".card button")
            .forEach((botao) => {

                botao.onclick = () => {

                    const card =
                        botao.closest(".card");


                    const titulo =
                        card
                            .querySelector("h3")
                            .textContent;


                    const preco =
                        card
                            .querySelector(".preco")
                            .textContent;


                    comprar({

                        titulo: titulo,

                        preco: preco,

                        categoria: categoriaPagina

                    });

                };

            });

    }
);