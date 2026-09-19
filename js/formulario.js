const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", function (event) {

    event.preventDefault();

    // Captura os valores dos campos
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const idade = document.getElementById("idade").value;
    const telefone = document.getElementById("telefone").value;
    const cidade = document.getElementById("cidade").value;
    const genero = document.getElementById("genero").value;
    const mensagem = document.getElementById("mensagem").value;

    // Verifica qual opção dos anos 80 foi selecionada
    const anos80Selecionado = document.querySelector(
        'input[name="anos80"]:checked'
    );

    // Validação dos campos
    if (
        nome === "" ||
        email === "" ||
        idade === "" ||
        telefone === "" ||
        cidade === "" ||
        genero === "" ||
        !anos80Selecionado ||
        mensagem === ""
    ) {
        alert("PREENCHA TODOS OS CAMPOS!");
        return;
    }

    // Organiza os dados do formulário
    const dadosFormulario = {
        nome: nome,
        email: email,
        idade: idade,
        telefone: telefone,
        cidade: cidade,
        genero: genero,
        anos80: anos80Selecionado.value,
        mensagem: mensagem
    };

    // Salva os dados no navegador
    localStorage.setItem(
        "dadosFormulario",
        JSON.stringify(dadosFormulario)
    );

    // Vai para o recibo
    window.location.href = "recibo.html";
});

