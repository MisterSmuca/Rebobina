const dadosSalvos = localStorage.getItem("dadosFormulario");

if (dadosSalvos) {

    const dados = JSON.parse(dadosSalvos);

    document.getElementById("reciboNome").textContent = dados.nome;
    document.getElementById("reciboEmail").textContent = dados.email;
    document.getElementById("reciboIdade").textContent = dados.idade;
    document.getElementById("reciboTelefone").textContent = dados.telefone;
    document.getElementById("reciboCidade").textContent = dados.cidade;
    document.getElementById("reciboGenero").textContent = dados.genero;
    document.getElementById("reciboAnos80").textContent = dados.anos80;
    document.getElementById("reciboMensagem").textContent = dados.mensagem;

} else {

    alert("NENHUM DADO ENCONTRADO!");

    window.location.href = "formulario.html";
}
