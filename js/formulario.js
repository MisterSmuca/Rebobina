document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formulario");
    if (!form) return;

    // Desliga a validação padrão do navegador para usar a nossa
    form.noValidate = true;

    const campos = ["nome", "email", "idade", "telefone", "cidade", "mensagem"]
        .map((id) => document.getElementById(id));

    // ---------- REGRAS DE VALIDAÇÃO (retorna "" se estiver ok) ----------
    const regras = {
        nome: (v) => (v.trim().length < 3 ? "Digite seu nome completo." : ""),

        email: (v) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Digite um e-mail válido.",

        idade: (v) => {
            const n = Number(v);
            return Number.isInteger(n) && n >= 1 && n <= 120
                ? ""
                : "Digite uma idade entre 1 e 120.";
        },

        telefone: (v) => {
            const digitos = v.replace(/\D/g, "");
            return digitos.length === 10 || digitos.length === 11
                ? ""
                : "Digite um telefone com DDD.";
        },

        cidade: (v) => (v.trim().length < 2 ? "Digite sua cidade." : ""),

        mensagem: (v) =>
            v.trim().length < 5 ? "Escreva uma mensagem com pelo menos 5 caracteres." : "",
    };

    // ---------- MOSTRAR / LIMPAR ERROS (classes do Bootstrap) ----------
    function mostrarErro(input, mensagem) {
        input.classList.add("is-invalid");

        let aviso = input.parentElement.querySelector(".invalid-feedback");
        if (!aviso) {
            aviso = document.createElement("div");
            aviso.className = "invalid-feedback";
            input.insertAdjacentElement("afterend", aviso);
        }
        aviso.textContent = mensagem;
    }

    function limparErro(input) {
        input.classList.remove("is-invalid");
        const aviso = input.parentElement.querySelector(".invalid-feedback");
        if (aviso) aviso.remove();
    }

    function validarCampo(input) {
        const mensagem = regras[input.id](input.value);
        if (mensagem) {
            mostrarErro(input, mensagem);
            return false;
        }
        limparErro(input);
        return true;
    }

    // ---------- MÁSCARA DO TELEFONE: (00) 00000-0000 ----------
    const telefone = document.getElementById("telefone");
    telefone.addEventListener("input", () => {
        let d = telefone.value.replace(/\D/g, "").slice(0, 11);

        if (d.length > 10) d = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
        else if (d.length > 6) d = `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
        else if (d.length > 2) d = `(${d.slice(0, 2)}) ${d.slice(2)}`;
        else if (d.length > 0) d = `(${d}`;

        telefone.value = d;
    });

    // Tira o erro assim que a pessoa começa a corrigir o campo
    campos.forEach((input) => {
        input.addEventListener("input", () => {
            if (input.classList.contains("is-invalid")) limparErro(input);
        });
    });

    // ---------- MENSAGEM DE SUCESSO ----------
    function removerSucesso() {
        const antigo = form.querySelector(".alert-sucesso");
        if (antigo) antigo.remove();
    }

    function mostrarSucesso(nome) {
        removerSucesso();

        const aviso = document.createElement("div");
        aviso.className = "alert alert-success alert-sucesso mt-3";
        aviso.setAttribute("role", "alert");
        aviso.textContent = `Mensagem enviada com sucesso! Obrigado, ${nome}.`;
        form.appendChild(aviso);

        setTimeout(() => aviso.remove(), 5000);
    }

    // ---------- ENVIAR ----------
    form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        removerSucesso();

        // valida todos (sem parar no primeiro erro) e guarda o primeiro inválido
        let primeiroInvalido = null;
        campos.forEach((input) => {
            if (!validarCampo(input) && !primeiroInvalido) primeiroInvalido = input;
        });

        if (primeiroInvalido) {
            primeiroInvalido.focus();
            return;
        }

        const dados = Object.fromEntries(new FormData(form).entries());
        console.log("Dados do formulário:", dados); // aqui você poderia enviar para uma API

        form.reset();
        mostrarSucesso(dados.nome.trim().split(" ")[0]);
    });

    // ---------- LIMPAR ----------
    form.addEventListener("reset", () => {
        campos.forEach(limparErro);
        removerSucesso();
    });
});