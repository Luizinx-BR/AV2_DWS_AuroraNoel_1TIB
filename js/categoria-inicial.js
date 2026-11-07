// Abre o catálogo já na categoria escolhida pelos cards da página inicial.
const categoriaSelecionada = new URLSearchParams(window.location.search).get("categoria");
const seletorCategoria = document.getElementById("filtro-categoria");
if (categoriaSelecionada && seletorCategoria) {
    const opcaoExiste = [...seletorCategoria.options].some(
        (opcao) => opcao.value === categoriaSelecionada,
    );
    if (opcaoExiste) seletorCategoria.value = categoriaSelecionada;
}
