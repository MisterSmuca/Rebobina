const CHAVE_USUARIO = "rebobinaUsuario";
const CHAVE_ALUGUEIS = "rebobinaAlugueis";

// Cria os modais
document.body.insertAdjacentHTML("beforeend", `

    <!-- Modal de cadastro -->
    <div class="modal fade" id="modalCadastro">

        <div class="modal-dialog">

            <div class="modal-content">

                <form id="formCadastro">

                    <div class="modal-header">
                        <h5 class="modal-title">Cadastro</h5>

                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal">
                        </button>
                    </div>

                    <div class="modal-body">

                        <p id="itemCadastro"></p>

                        <input
                            type="text"
                            id="nome"
                            class="form-control mb-3"
                            placeholder="Nome">

                        <input
                            type="email"
                            id="email"
                            class="form-control mb-3"
                            placeholder="E-mail">

                        <input
                            type="tel"
                            id="telefone"
                            class="form-control"
                            placeholder="Telefone">

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
                            Cadastrar
                        </button>

                    </div>

                </form>

            </div>

        </div>

    </div>


    <!-- Modal de confirmação -->
    <div class="modal fade" id="modalAluguel">

        <div class="modal-dialog">

            <div class="modal-content">

                <div class="modal-header">

                    <h5 class="modal-title">
                        Confirmar Compra
                    </h5>

                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal">
                    </button>

                </div>

                <div class="modal-body">

                    <p id="saudacao"></p>

                    <strong id="itemAluguel"></strong>

                </div>

                <div class="modal-footer">

                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal">
                        Cancelar
                    </button>

                    <button
                        type="button"
                        class="btn btn-dark"
                        id="confirmarAluguel">
                        Confirmar
                    </button>

                </div>

            </div>

        </div>

    </div>

`);


// Pega o usuário salvo
function obterUsuario() {

    return JSON.parse(
        localStorage.getItem(CHAVE_USUARIO)
    );

}


// Abre o cadastro
function abrirCadastro(item) {

    const modal = new bootstrap.Modal(
        document.getElementById("modalCadastro")
    );

    document.getElementById("itemCadastro").textContent =
        `Para comprar "${item.titulo}", faça seu cadastro.`;

    document.getElementById("formCadastro").onsubmit = function(evento) {

        evento.preventDefault();

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;

        if (nome === "" || email === "" || telefone === "") {

            alert("Preencha todos os campos.");

            return;
        }

        const usuario = {
            nome: nome,
            email: email,
            telefone: telefone
        };

        localStorage.setItem(
            CHAVE_USUARIO,
            JSON.stringify(usuario)
        );

        modal.hide();

        abrirConfirmacao(item);

    };

    modal.show();

}


// Abre a confirmação
function abrirConfirmacao(item) {

    const usuario = obterUsuario();

    const modal = new bootstrap.Modal(
        document.getElementById("modalAluguel")
    );

    document.getElementById("saudacao").textContent =
        `Olá, ${usuario.nome}!`;

    document.getElementById("itemAluguel").textContent =
        `${item.titulo} - ${item.preco}`;

    document.getElementById("confirmarAluguel").onclick = function() {

        let alugueis =
            JSON.parse(localStorage.getItem(CHAVE_ALUGUEIS)) || [];

        alugueis.push(item);

        localStorage.setItem(
            CHAVE_ALUGUEIS,
            JSON.stringify(alugueis)
        );

        modal.hide();

        alert("Compra realizada com sucesso!");

    };

    modal.show();

}


// Verifica se já existe cadastro
function tentarComprar(item) {

    if (obterUsuario()) {

        abrirConfirmacao(item);

    } else {

        abrirCadastro(item);

    }

}


// Botões Comprar
document.addEventListener("DOMContentLoaded", function() {

    const botoes = document.querySelectorAll(".card button");

    botoes.forEach(function(botao) {

        botao.onclick = function() {

            const card = botao.closest(".card");

            const item = {

                titulo: card.querySelector("h3").textContent,

                preco: card.querySelector(".preco").textContent

            };

            tentarComprar(item);

        };

    });

});