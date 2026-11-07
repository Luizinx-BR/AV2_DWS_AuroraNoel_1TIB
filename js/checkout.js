// O QR é ilustrativo. Este projeto não processa nem verifica pagamentos.
const checkout = document.getElementById("checkout");
const celebracao = document.getElementById("celebracao");
let pararCelebracao;
finalizarCompraBotao.addEventListener("click", () => {
    if (!sacola.length) return;
    const resumo = document.getElementById("checkout-itens");
    resumo.replaceChildren(
        ...sacola.map((item) => {
            const p = produtos.find((p) => p.id === item.id);
            const li = document.createElement("li");
            li.textContent = `${item.quantidade} × ${p.nome} — ${formatarPreco(p.preco * item.quantidade)}`;
            return li;
        }),
    );
    const centavos = sacola.reduce(
        (total, item) =>
            total +
            Math.round(produtos.find((p) => p.id === item.id).preco * 100) * item.quantidade,
        0,
    );
    document.getElementById("checkout-total").textContent = formatarPreco(centavos / 100);
    fecharSacola();
    checkout.showModal();
});
document.getElementById("fechar-checkout").addEventListener("click", () => checkout.close());
document.getElementById("confirmar-pedido").addEventListener("click", () => {
    if (!sacola.length) return;
    checkout.close();
    sacola = [];
    salvarSacola();
    atualizarSacola();
    celebracao.showModal();
    pararCelebracao = iniciarFogos("fogos-celebracao");
    document.getElementById("continuar-comprando").focus();
});
document.getElementById("continuar-comprando").addEventListener("click", () => celebracao.close());
celebracao.addEventListener("close", () => {
    pararCelebracao?.();
    abrirSacolaBotao.focus();
});
// Mantém o foco na sacola enquanto ela está aberta.
painelSacola.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const ativos = [...painelSacola.querySelectorAll("button:not(:disabled),a[href],input")];
    const primeiro = ativos[0],
        ultimo = ativos.at(-1);
    if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
    }
});
