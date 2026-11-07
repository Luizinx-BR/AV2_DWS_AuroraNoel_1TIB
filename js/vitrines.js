// As ofertas e a NoelDex usam os mesmos dados e preços do catálogo.
(() => {
    const dinheiro = (valor) =>
        valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    function card(p) {
        const item = document.createElement("article");
        item.className = "vitrine-card";
        item.innerHTML = `<img src="${p.imagem}" alt="${p.nome}" loading="lazy">${p.oferta ? `<span class="selo-desconto">−${p.desconto}%</span>` : ""}<div class="card-corpo"><h3>${p.nome}</h3><p>${p.descricao}</p>${p.oferta ? `<del>${dinheiro(p.precoOriginal)}</del>` : ""}<span class="preco-atual">${dinheiro(p.preco)}</span><a class="card-link" href="produto.html?id=${p.id}">Escolher este produto →</a></div>`;
        return item;
    }
    const ofertas = produtos.filter((p) => p.oferta);
    const vitrine = document.getElementById("vitrine-promocoes");
    if (vitrine) {
        const filtro = document.getElementById("oferta-categoria");
        const pesquisa = document.getElementById("oferta-pesquisa");
        const ordem = document.getElementById("oferta-ordem");
        const vazio = document.getElementById("ofertas-vazio");
        const render = () => {
            const termo = pesquisa.value.trim().toLocaleLowerCase("pt-BR");
            const lista = ofertas.filter((p) =>
                (filtro.value === "todos" || p.categoria === filtro.value) &&
                (p.nome + " " + p.descricao).toLocaleLowerCase("pt-BR").includes(termo)
            );
            // Ordena os resultados filtrados, sem alterar o cadastro original.
            if (ordem.value === "menor-preco") lista.sort((a, b) => a.preco - b.preco);
            else if (ordem.value === "maior-preco") lista.sort((a, b) => b.preco - a.preco);
            vazio.hidden = lista.length !== 0;
            vitrine.replaceChildren(...lista.map(card));
            document.getElementById("ofertas-total").textContent =
                `${lista.length} ofertas para descobrir`;
        };
        filtro.addEventListener("change", render);
        pesquisa.addEventListener("input", render);
        ordem.addEventListener("change", render);
        document.getElementById("ofertas-limpar").addEventListener("click", () => {
            pesquisa.value = "";
            filtro.value = "todos";
            ordem.value = "padrao";
            render();
            pesquisa.focus();
        });
        render();
    }
    const doces = document.getElementById("vitrine-doces");
    if (doces)
        doces.replaceChildren(...produtos.filter((p) => p.categoria === "confeitaria").map(card));
    const dex = document.getElementById("dex-grid");
    if (dex) {
        document.getElementById("dex-progresso").textContent =
            `${ofertas.length} revelados de ${produtos.length} • coleção de Natal`;
        document.getElementById("dex-barra-preenchida").style.width =
            `${(ofertas.length / produtos.length) * 100}%`;
        const filtro = document.getElementById("so-revelados");
        const render = () => {
            dex.replaceChildren(
                ...produtos
                    .filter((p) => !filtro.checked || p.oferta)
                    .map((p) => {
                        const n = String(p.id).padStart(3, "0");
                        const el = document.createElement(p.oferta ? "a" : "div");
                        el.className = `dex-item ${p.oferta ? "revelado" : "bloqueado"}`;
                        if (p.oferta) {
                            el.href = `produto.html?id=${p.id}`;
                            el.innerHTML = `<small>#${n}</small><img src="${p.imagem}" alt="${p.nome}" loading="lazy"><strong>${p.nome}</strong><em>EM OFERTA · −${p.desconto}%</em>`;
                        } else {
                            el.innerHTML = `<span>${n}</span>`;
                            el.setAttribute("aria-label", `Produto ${n}, ainda não revelado`);
                        }
                        return el;
                    }),
            );
        };
        filtro.addEventListener("change", render);
        render();
    }
})();
