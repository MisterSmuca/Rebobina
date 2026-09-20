// Cadastro + aluguel em modais do Bootstrap, sem sair da página.
// Requer o JS do Bootstrap (bootstrap.bundle.min.js) carregado ANTES deste arquivo.
const CHAVE_USUARIO = "rebobinaUsuario";
const CHAVE_ALUGUEIS = "rebobinaAlugueis";

// ---------- ARMAZENAMENTO ----------
function lerJSON(chave) {
    try {
        return JSON.parse(localStorage.getItem(chave));
    } catch {
        return null;
    }
}

function salvarJSON(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
        return true;
    } catch (erro) {
        console.error("Não foi possível salvar:", erro);
        return false;
    }
}

function obterUsuario() {
    return lerJSON(CHAVE_USUARIO);
}

function salvarAluguel(item) {
    const lista = lerJSON(CHAVE_ALUGUEIS) || [];
    lista.push({ ...item, data: new Date().toLocaleString("pt-BR") });
    salvarJSON(CHAVE_ALUGUEIS, lista);
}

// ---------- AVISO NO TOPO ----------
function mostrarAviso(texto, tipo = "success") {
    const aviso = document.createElement("div");
    aviso.className = `alert alert-${tipo} position-fixed top-0 start-50 translate-middle-x mt-3 shadow`;
    aviso.style.zIndex = 2000;
    aviso.setAttribute("role", "alert");
    aviso.textContent = texto;
    document.body.appendChild(aviso);
    setTimeout(() => aviso.remove(), 3500);
}

// ---------- CRIA UM MODAL DO BOOTSTRAP ----------
// Obs.: usamos <div> e não <p> dentro dos modais, porque o seu CSS global de "p"
// aplica sombra e centralização.
function criarModal(id, conteudo) {
    document.getElementById(id)?.remove();

    const el = document.createElement("div");
    el.className = "modal fade";
    el.id = id;
    el.tabIndex = -1;
    el.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">${conteudo}</div>
        </div>`;
    document.body.appendChild(el);

    const modal = new bootstrap.Modal(el);
    el.addEventListener("hidden.bs.modal", () => el.remove());
    return { el, modal };
}

// ---------- MODAL 1: CADASTRO ----------
function abrirCadastro(item) {
    const { el, modal } = criarModal("modalCadastro", `
        <form id="formCadastroModal" novalidate>
            <div class="modal-header">
                <h5 class="modal-title">Cadastro rápido</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3 texto-item"></div>
                <div class="mb-3">
                    <label class="form-label" for="cadNome">Nome completo</label>
                    <input type="text" class="form-control" id="cadNome" placeholder="Digite seu nome">
                </div>
                <div class="mb-3">
                    <label class="form-label" for="cadEmail">E-mail</label>
                    <input type="email" class="form-control" id="cadEmail" placeholder="Digite seu e-mail">
                </div>
                <div class="mb-1">
                    <label class="form-label" for="cadTelefone">Telefone</label>
                    <input type="tel" class="form-control" id="cadTelefone" placeholder="(00) 00000-0000">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-dark">Cadastrar e continuar</button>
            </div>
        </form>`);

    el.querySelector(".texto-item").textContent =
        `Para alugar "${item.titulo}", faça um cadastro rápido.`;

    const form = el.querySelector("#formCadastroModal");
    const nome = el.querySelector("#cadNome");
    const email = el.querySelector("#cadEmail");
    const telefone = el.querySelector("#cadTelefone");
    const campos = [nome, email, telefone];

    // Regras de validação (retorna "" se estiver ok)
    const regras = {
        cadNome: (v) => (v.trim().length < 3 ? "Digite seu nome completo." : ""),
        cadEmail: (v) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Digite um e-mail válido.",
        cadTelefone: (v) => {
            const digitos = v.replace(/\D/g, "");
            return digitos.length === 10 || digitos.length === 11
                ? ""
                : "Digite um telefone com DDD.";
        },
    };

    function mostrarErro(input, texto) {
        input.classList.add("is-invalid");
        let aviso = input.parentElement.querySelector(".invalid-feedback");
        if (!aviso) {
            aviso = document.createElement("div");
            aviso.className = "invalid-feedback";
            input.insertAdjacentElement("afterend", aviso);
        }
        aviso.textContent = texto;
    }

    function limparErro(input) {
        input.classList.remove("is-invalid");
        input.parentElement.querySelector(".invalid-feedback")?.remove();
    }

    function validarCampo(input) {
        const erro = regras[input.id](input.value);
        if (erro) {
            mostrarErro(input, erro);
            return false;
        }
        limparErro(input);
        return true;
    }

    campos.forEach((input) => {
        input.addEventListener("input", () => {
            if (input.classList.contains("is-invalid")) limparErro(input);
        });
    });

    // Máscara do telefone: (00) 00000-0000
    telefone.addEventListener("input", () => {
        let d = telefone.value.replace(/\D/g, "").slice(0, 11);
        if (d.length > 10) d = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
        else if (d.length > 6) d = `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
        else if (d.length > 2) d = `(${d.slice(0, 2)}) ${d.slice(2)}`;
        else if (d.length > 0) d = `(${d}`;
        telefone.value = d;
    });

    // Enviar cadastro
    let cadastrou = false;

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        let primeiroInvalido = null;
        campos.forEach((input) => {
            if (!validarCampo(input) && !primeiroInvalido) primeiroInvalido = input;
        });
        if (primeiroInvalido) {
            primeiroInvalido.focus();
            return;
        }

        const salvou = salvarJSON(CHAVE_USUARIO, {
            nome: nome.value.trim(),
            email: email.value.trim(),
            telefone: telefone.value,
            cadastradoEm: new Date().toLocaleString("pt-BR"),
        });

        if (!salvou) {
            mostrarAviso("Não foi possível salvar o cadastro neste navegador.", "danger");
            return;
        }

        cadastrou = true;
        modal.hide();
    });

    // Quando o modal de cadastro terminar de fechar, abre a confirmação do aluguel
    el.addEventListener("hidden.bs.modal", () => {
        if (cadastrou) abrirConfirmacao(item);
    });

    el.addEventListener("shown.bs.modal", () => nome.focus());
    modal.show();
}

// ---------- MODAL 2: CONFIRMAR ALUGUEL ----------
function abrirConfirmacao(item) {
    const primeiroNome = obterUsuario().nome.split(" ")[0];

    const { el, modal } = criarModal("modalAluguel", `
        <div class="modal-header">
            <h5 class="modal-title">Confirmar aluguel</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
        </div>
        <div class="modal-body">
            <div class="saudacao"></div>
            <div class="fw-bold item"></div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-dark" id="confirmarAluguel">Confirmar</button>
        </div>`);

    // textContent evita injetar HTML com o nome digitado pela pessoa
    el.querySelector(".saudacao").textContent = `Olá, ${primeiroNome}!`;
    el.querySelector(".item").textContent = `${item.titulo} — ${item.preco}`;

    el.querySelector("#confirmarAluguel").addEventListener("click", () => {
        salvarAluguel(item);
        modal.hide();
        mostrarAviso(`"${item.titulo}" alugado com sucesso!`);
    });

    modal.show();
}

// ---------- FLUXO PRINCIPAL ----------
function tentarAlugar(item) {
    if (typeof bootstrap === "undefined") {
        console.error("O JS do Bootstrap precisa ser carregado antes do alugar.js");
        return;
    }
    if (obterUsuario()) abrirConfirmacao(item);
    else abrirCadastro(item);
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".card button").forEach((botao) => {
        botao.addEventListener("click", () => {
            const card = botao.closest(".card");
            tentarAlugar({
                titulo: card.querySelector("h3, h2")?.textContent.trim() ?? "Item",
                preco: card.querySelector(".preco")?.textContent.trim() ?? "",
            });
        });
    });
});