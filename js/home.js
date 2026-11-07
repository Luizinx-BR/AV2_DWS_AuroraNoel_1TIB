// Slideshow e parallax da página inicial.
const slidesHome = [...document.querySelectorAll(".slide-home")];
const indicadorSlide = document.getElementById("indicador-slide");
let slideAtual = 0;

function mostrarSlide(indice) {
    if (!slidesHome.length) return;
    slidesHome[slideAtual].classList.remove("ativo");
    slidesHome[slideAtual].setAttribute("aria-hidden", "true");
    slideAtual = (indice + slidesHome.length) % slidesHome.length;
    slidesHome[slideAtual].classList.add("ativo");
    slidesHome[slideAtual].setAttribute("aria-hidden", "false");
    indicadorSlide.textContent = `${slideAtual + 1} / ${slidesHome.length}`;
}

document
    .getElementById("anterior-slide")
    ?.addEventListener("click", () => mostrarSlide(slideAtual - 1));
document
    .getElementById("proximo-slide")
    ?.addEventListener("click", () => mostrarSlide(slideAtual + 1));
if (slidesHome.length) window.setInterval(() => mostrarSlide(slideAtual + 1), 6500);

// A imagem do banner acompanha a rolagem de forma sutil, sem mexer no conteúdo original.
const imagemParallax = document.querySelector(".banner-imagem");
if (imagemParallax) {
    let quadroPendente = false;
    window.addEventListener(
        "scroll",
        () => {
            if (quadroPendente || window.AuroraEfeitos?.ativos === false) return;
            quadroPendente = true;
            window.requestAnimationFrame(() => {
                imagemParallax.style.translate = `0 ${Math.min(window.scrollY * 0.035, 38)}px`;
                quadroPendente = false;
            });
        },
        { passive: true },
    );
}
