const categorias = [
    {
        nome: "FILMES",
        icone: "🎬",
        mensagem: "Prepare a pipoca e escolha uma boa sessão!",
        link: "../html/filme.html"
    },
    {
        nome: "SÉRIES",
        icone: "📺",
        mensagem: "Que tal começar uma série e maratonar?",
        link: "../html/serie.html"
    },
    {
        nome: "JOGOS",
        icone: "🕹️",
        mensagem: "Hora de voltar aos clássicos dos videogames!",
        link: "../html/jogos.html"
    },
    {
        nome: "MÚSICAS",
        icone: "🎵",
        mensagem: "Coloque os fones e deixe a nostalgia tocar!",
        link: "../html/musica.html"
    }
];

const botao = document.getElementById("botaoEscolher");
const resultado = document.getElementById("resultadoEscolha");

botao.addEventListener("click", function () {

    // Impede clicar várias vezes durante a animação
    botao.disabled = true;

    // Mostra a animação de rebobinando
    resultado.innerHTML = `
        <div class="icone-escolha rebobinando">📼</div>

        <h3>
            REBOBINANDO...
        </h3>

        <p>
            Procurando a fita perfeita para você...
        </p>

        <div class="barra-rebobinando">
            <div class="progresso-rebobinando"></div>
        </div>

        <small class="texto-rebobinando">
            ◀◀◀ AGUARDE...
        </small>
    `;

    resultado.classList.add("ativo");

    // Aguarda a animação antes de revelar o resultado
    setTimeout(function () {

        const indice = Math.floor(Math.random() * categorias.length);
        const categoria = categorias[indice];

        resultado.innerHTML = `
            <div class="icone-escolha resultado-icone">
                ${categoria.icone}
            </div>

            <span class="badge rounded-pill text-bg-dark px-3 py-2">
                📼 FITA ENCONTRADA
            </span>

            <h3 class="mt-3">
                O destino escolheu ${categoria.nome}!
            </h3>

            <p>
                ${categoria.mensagem}
            </p>

            <a href="${categoria.link}"
                class="btn btn-dark rounded-pill px-4 botao-categoria">
                ${categoria.icone} Ver ${categoria.nome.toLowerCase()}
            </a>
        `;

        resultado.classList.remove("ativo");

        botao.disabled = false;

    }, 2500);

});