const caixaImagem = document.getElementById("lightbox");
const imagemAmpliada = document.getElementById("imagem-ampliada");
const legendaAmpliada = document.getElementById("legenda-ampliada");
const botaoFecharImagem = document.querySelector(".fechar-lightbox");

document.querySelectorAll(".imagem-ampliar").forEach((item) => {
    if (item.matches("img")) {
        item.tabIndex = 0;
        item.setAttribute("role", "button");
        item.setAttribute("aria-label", `Ampliar: ${item.alt}`);
        item.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                item.click();
            }
        });
    }
    item.addEventListener("click", (evento) => {
        const origem =
            item.dataset.imagem ||
            (item.matches("img") ? item.src : item.querySelector("img")?.src);
        if (!origem || !caixaImagem) return;
        imagemAmpliada.src = origem;
        imagemAmpliada.alt =
            item.dataset.legenda ||
            (item.matches("img") ? item.alt : item.querySelector("img")?.alt) ||
            "Imagem natalina ampliada";
        legendaAmpliada.textContent = item.dataset.legenda || imagemAmpliada.alt;
        caixaImagem.showModal();
    });
});

botaoFecharImagem?.addEventListener("click", () => caixaImagem.close());
caixaImagem?.addEventListener("click", (evento) => {
    if (evento.target === caixaImagem) caixaImagem.close();
});
