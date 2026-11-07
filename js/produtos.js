/* ==========================================
   AURORA NOEL - PRODUTOS E SACOLA
========================================== */

/* 1. CATÁLOGO DOS 60 PRODUTOS (js/dados-produtos.js) */

/* 2. ELEMENTOS DO HTML */

const listaProdutos = document.getElementById("lista-produtos");
const pesquisaProdutos = document.getElementById("pesquisa-produtos");
const filtroCategoria = document.getElementById("filtro-categoria");
const ordenarProdutos = document.getElementById("ordenar-produtos");
const totalProdutos = document.getElementById("total-produtos");
const limparFiltros = document.getElementById("limpar-filtros");
const semResultados = document.getElementById("sem-resultados");
const reiniciarBusca = document.getElementById("reiniciar-busca");
const botoesCategoria = document.querySelectorAll(".catalogo-categoria");

const abrirSacolaBotao = document.getElementById("abrir-sacola");
const fecharSacolaBotao = document.getElementById("fechar-sacola");
const painelSacola = document.getElementById("painel-sacola");
const fundoSacola = document.getElementById("fundo-sacola");
const itensSacola = document.getElementById("itens-sacola");
const totalSacola = document.getElementById("total-sacola");
const contadorSacola = document.getElementById("contador-sacola");
const esvaziarSacolaBotao = document.getElementById("esvaziar-sacola");
const finalizarCompraBotao = document.getElementById("finalizar-compra");

/* 3. PREÇOS */

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

/* 4. SALVAR E RECUPERAR SACOLA */

const CHAVE_SACOLA = "auroraNoelSacola";

function carregarSacola() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_SACOLA) || "[]");

        if (!Array.isArray(dados)) return [];

        return dados.filter(
            (item) =>
                produtos.some((produto) => produto.id === item.id) &&
                Number.isInteger(item.quantidade) &&
                item.quantidade > 0,
        );
    } catch (erro) {
        return [];
    }
}

let sacola = carregarSacola();

function salvarSacola() {
    try {
        localStorage.setItem(CHAVE_SACOLA, JSON.stringify(sacola));
    } catch (erro) {
        console.warn("Não foi possível salvar a sacola.", erro);
    }
}

/* 5. ABRIR E FECHAR SACOLA */

function abrirSacola() {
    painelSacola.hidden = false;
    fundoSacola.hidden = false;

    document.body.classList.add("sacola-aberta");
    abrirSacolaBotao.setAttribute("aria-expanded", "true");

    fecharSacolaBotao.focus();
}

function fecharSacola() {
    painelSacola.hidden = true;
    fundoSacola.hidden = true;

    document.body.classList.remove("sacola-aberta");
    abrirSacolaBotao.setAttribute("aria-expanded", "false");

    abrirSacolaBotao.focus();
}

/* 6. ADICIONAR PRODUTO */

function adicionarSacola(produto, botao, quantidade = 1) {
    const itemExistente = sacola.find((item) => item.id === produto.id);

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        sacola.push({
            id: produto.id,
            quantidade,
        });
    }

    salvarSacola();
    atualizarSacola();

    botao.textContent = "✓ Adicionado!";
    botao.disabled = true;

    setTimeout(() => {
        if (botao.isConnected) {
            botao.textContent = "🛍️ Adicionar à sacola";
            botao.disabled = false;
        }
    }, 900);
}

/* 7. ALTERAR QUANTIDADE */

function alterarQuantidade(id, diferenca) {
    const item = sacola.find((item) => item.id === id);

    if (!item) return;

    item.quantidade += diferenca;

    if (item.quantidade <= 0) {
        sacola = sacola.filter((item) => item.id !== id);
    }

    salvarSacola();
    atualizarSacola();
}

/* 8. REMOVER PRODUTO */

function removerProduto(id) {
    sacola = sacola.filter((item) => item.id !== id);

    salvarSacola();
    atualizarSacola();
}

/* 9. ATUALIZAR SACOLA */

function atualizarSacola() {
    itensSacola.replaceChildren();

    let total = 0;
    let quantidadeTotal = 0;

    if (sacola.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.className = "sacola-vazia";
        mensagem.textContent = "🎁 Sua sacola está vazia!";
        itensSacola.appendChild(mensagem);
    }

    sacola.forEach((item) => {
        const produto = produtos.find((p) => p.id === item.id);

        if (!produto) return;

        total += produto.preco * item.quantidade;
        quantidadeTotal += item.quantidade;

        const linha = document.createElement("div");
        linha.className = "sacola-item";

        const imagem = document.createElement("img");
        imagem.src = produto.imagem;
        imagem.alt = produto.nome;
        imagem.onerror = function () {
            imagem.onerror = null;
            imagem.src = "img/logo.webp";
        };

        const informacoes = document.createElement("div");
        informacoes.className = "sacola-item-info";

        const nome = document.createElement("h3");
        nome.textContent = produto.nome;

        const preco = document.createElement("p");
        preco.textContent = formatarPreco(produto.preco);

        const controles = document.createElement("div");
        controles.className = "sacola-controles";

        const diminuir = document.createElement("button");
        diminuir.type = "button";
        diminuir.textContent = "−";
        diminuir.setAttribute("aria-label", "Diminuir " + produto.nome);
        diminuir.addEventListener("click", () => {
            alterarQuantidade(produto.id, -1);
        });

        const quantidade = document.createElement("span");
        quantidade.textContent = item.quantidade;

        const aumentar = document.createElement("button");
        aumentar.type = "button";
        aumentar.textContent = "+";
        aumentar.setAttribute("aria-label", "Aumentar " + produto.nome);
        aumentar.addEventListener("click", () => {
            alterarQuantidade(produto.id, 1);
        });

        const remover = document.createElement("button");
        remover.type = "button";
        remover.className = "sacola-remover";
        remover.textContent = "Remover";
        remover.addEventListener("click", () => {
            removerProduto(produto.id);
        });

        controles.append(diminuir, quantidade, aumentar, remover);
        informacoes.append(nome, preco, controles);
        linha.append(imagem, informacoes);

        itensSacola.appendChild(linha);
    });

    totalSacola.textContent = formatarPreco(total);
    contadorSacola.textContent = quantidadeTotal;

    finalizarCompraBotao.disabled = sacola.length === 0;
    esvaziarSacolaBotao.disabled = sacola.length === 0;
}

/* 10. CRIAR CARD */

function criarCard(produto) {
    const card = document.createElement("article");
    card.className = "produto-card";

    const imagem = document.createElement("img");
    imagem.src = produto.imagem;
    imagem.alt = produto.nome;
    imagem.loading = "lazy";

    imagem.onerror = function () {
        imagem.onerror = null;
        imagem.src = "img/logo.webp";
    };

    const linkImagem=document.createElement("a");
    linkImagem.href=`produto.html?id=${produto.id}`;
    linkImagem.setAttribute("aria-label", `Ver detalhes de ${produto.nome}`);
    linkImagem.appendChild(imagem);card.appendChild(linkImagem);

    if (produto.oferta) {
        const etiqueta = document.createElement("span");
        etiqueta.className = "produto-oferta";
        etiqueta.textContent = `−${produto.desconto}% OFERTA`;
        card.appendChild(etiqueta);
    }

    const info = document.createElement("div");
    info.className = "produto-info";

    const nome = document.createElement("h3");
    nome.textContent = produto.nome;

    const descricao = document.createElement("p");
    descricao.textContent = produto.descricao;

    const preco = document.createElement("strong");
    preco.className = "produto-preco";
    preco.textContent = formatarPreco(produto.preco);

    const botao = document.createElement("button");
    botao.className = "produto-botao";
    botao.type = "button";
    botao.textContent = "🛍️ Adicionar à sacola";

    botao.addEventListener("click", () => adicionarSacola(produto, botao));

    info.append(nome, descricao);
    if (produto.oferta) {
        const anterior = document.createElement("del");
        anterior.textContent = formatarPreco(produto.precoOriginal);
        anterior.className = "preco-anterior";
        info.appendChild(anterior);
    }
    const detalhes=document.createElement("a");
    detalhes.href=`produto.html?id=${produto.id}`;detalhes.textContent="Ver detalhes →";
    detalhes.className="produto-detalhes-link";
    info.append(preco, detalhes, botao);
    card.appendChild(info);

    return card;
}

/* 11. FILTROS E ORDENAÇÃO */

function obterProdutosFiltrados() {
    const pesquisa = pesquisaProdutos.value.trim().toLocaleLowerCase("pt-BR");

    const categoria = filtroCategoria.value;
    const ordenacao = ordenarProdutos.value;

    let resultado = produtos.filter((produto) => {
        const texto = (produto.nome + " " + produto.descricao).toLocaleLowerCase("pt-BR");

        const correspondePesquisa = texto.includes(pesquisa);

        const correspondeCategoria = categoria === "todos" || produto.categoria === categoria;

        return correspondePesquisa && correspondeCategoria;
    });

    resultado = [...resultado];

    if (ordenacao === "menor-preco") {
        resultado.sort((a, b) => a.preco - b.preco);
    } else if (ordenacao === "maior-preco") {
        resultado.sort((a, b) => b.preco - a.preco);
    } else if (ordenacao === "nome-az") {
        resultado.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    } else if (ordenacao === "nome-za") {
        resultado.sort((a, b) => b.nome.localeCompare(a.nome, "pt-BR"));
    }

    return resultado;
}

/* 12. MOSTRAR PRODUTOS */

function mostrarProdutos() {
    const resultado = obterProdutosFiltrados();

    listaProdutos.replaceChildren();

    const fragmento = document.createDocumentFragment();

    resultado.forEach((produto) => {
        fragmento.appendChild(criarCard(produto));
    });

    listaProdutos.appendChild(fragmento);

    totalProdutos.textContent = `${resultado.length} produto(s) encontrado(s)`;

    semResultados.hidden = resultado.length !== 0;
}

/* 13. SINCRONIZAR CATEGORIAS */

function atualizarBotoesCategoria() {
    botoesCategoria.forEach((botao) => {
        const ativo = botao.dataset.categoria === filtroCategoria.value;

        botao.classList.toggle("ativo", ativo);
        botao.setAttribute("aria-pressed", String(ativo));
    });
}

botoesCategoria.forEach((botao) => {
    botao.addEventListener("click", () => {
        filtroCategoria.value = botao.dataset.categoria;
        atualizarBotoesCategoria();
        mostrarProdutos();

        document.getElementById("catalogo-produtos").scrollIntoView({ behavior: "smooth" });
    });
});

/* 14. EVENTOS DOS FILTROS */

pesquisaProdutos.addEventListener("input", mostrarProdutos);

filtroCategoria.addEventListener("change", () => {
    atualizarBotoesCategoria();
    mostrarProdutos();
});

ordenarProdutos.addEventListener("change", mostrarProdutos);

function restaurarFiltros() {
    pesquisaProdutos.value = "";
    filtroCategoria.value = "todos";
    ordenarProdutos.value = "padrao";

    atualizarBotoesCategoria();
    mostrarProdutos();
}

limparFiltros.addEventListener("click", restaurarFiltros);
reiniciarBusca.addEventListener("click", restaurarFiltros);

/* 15. EVENTOS DA SACOLA */

abrirSacolaBotao.addEventListener("click", abrirSacola);
fecharSacolaBotao.addEventListener("click", fecharSacola);
fundoSacola.addEventListener("click", fecharSacola);

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !painelSacola.hidden) {
        fecharSacola();
    }
});

esvaziarSacolaBotao.addEventListener("click", () => {
    if (sacola.length === 0) return;

    if (confirm("Deseja esvaziar sua sacola?")) {
        sacola = [];
        salvarSacola();
        atualizarSacola();
    }
});

/* 16. INICIAR */

const produtoDaURL = produtos.find(
    (p) => p.id === Number(new URLSearchParams(location.search).get("produto")),
);
if (produtoDaURL) {
    pesquisaProdutos.value = produtoDaURL.nome;
    filtroCategoria.value = "todos";
}
atualizarBotoesCategoria();
mostrarProdutos();
atualizarSacola();

console.log("Aurora Noel:", produtos.length, "produtos cadastrados.");
