/* Sacola da página de detalhes. Usa o mesmo armazenamento do catálogo. */
const abrirSacolaBotao = document.getElementById('abrir-sacola');
const fecharSacolaBotao = document.getElementById('fechar-sacola');
const finalizarCompraBotao = document.getElementById('finalizar-compra');
const esvaziarSacolaBotao = document.getElementById('esvaziar-sacola');
const painelSacola = document.getElementById('painel-sacola');
const fundoSacola = document.getElementById('fundo-sacola');
const itensSacola = document.getElementById('itens-sacola');
const contadorSacola = document.getElementById('contador-sacola');
const totalSacola = document.getElementById('total-sacola');
const formatarPreco = valor => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
function carregarSacola() {
    try {
        const itens = JSON.parse(localStorage.getItem('auroraNoelSacola') || '[]');
        return Array.isArray(itens) ? itens.filter(i => produtos.some(p => p.id === i.id) && Number.isInteger(i.quantidade) && i.quantidade > 0) : [];
    } catch { return []; }
}
let sacola = carregarSacola();
function salvarSacola() {
    try { localStorage.setItem('auroraNoelSacola', JSON.stringify(sacola)); }
    catch { /* O site continua funcionando sem persistência de armazenamento. */ }
}
function atualizarSacola() {
    itensSacola.replaceChildren();
    if (!sacola.length) {
        const vazio = document.createElement('p');
        vazio.className = 'sacola-vazia';
        vazio.textContent = '🎁 Sua sacola está vazia!';
        itensSacola.appendChild(vazio);
    }
    let quantidade = 0, total = 0;
    for (const item of sacola) {
        const produto = produtos.find(p => p.id === item.id);
        if (!produto) continue;
        quantidade += item.quantidade;
        total += produto.preco * item.quantidade;
        const linha = document.createElement('div'); linha.className = 'sacola-item';
        const foto = document.createElement('img'); foto.src = produto.imagem; foto.alt = produto.nome;
        const info = document.createElement('div'); info.className = 'sacola-item-info';
        const nome = document.createElement('h3'); nome.textContent = produto.nome;
        const preco = document.createElement('p'); preco.textContent = formatarPreco(produto.preco);
        const controles = document.createElement('div'); controles.className = 'sacola-controles';
        const menos = document.createElement('button'); menos.textContent = '−'; menos.type = 'button'; menos.setAttribute('aria-label', 'Diminuir ' + produto.nome);
        const conta = document.createElement('span'); conta.textContent = String(item.quantidade);
        const mais = document.createElement('button'); mais.textContent = '+'; mais.type = 'button'; mais.setAttribute('aria-label', 'Aumentar ' + produto.nome);
        const remover = document.createElement('button'); remover.textContent = 'Remover'; remover.type = 'button'; remover.className = 'sacola-remover';
        function alterar(diferenca) {
            item.quantidade += diferenca;
            if (item.quantidade <= 0) sacola = sacola.filter(i => i !== item);
            salvarSacola(); atualizarSacola();
        }
        menos.addEventListener('click', () => alterar(-1));
        mais.addEventListener('click', () => alterar(1));
        remover.addEventListener('click', () => alterar(-item.quantidade));
        controles.append(menos, conta, mais, remover);
        info.append(nome, preco, controles); linha.append(foto, info); itensSacola.appendChild(linha);
    }
    contadorSacola.textContent = String(quantidade);
    totalSacola.textContent = formatarPreco(total);
    finalizarCompraBotao.disabled = !sacola.length;
    esvaziarSacolaBotao.disabled = !sacola.length;
}
function abrirSacola() {
    sacola = carregarSacola(); atualizarSacola();
    fundoSacola.hidden = false; painelSacola.hidden = false;
    document.body.classList.add('sacola-aberta');
    abrirSacolaBotao.setAttribute('aria-expanded', 'true');
    fecharSacolaBotao.focus();
}
function fecharSacola() {
    fundoSacola.hidden = true; painelSacola.hidden = true;
    document.body.classList.remove('sacola-aberta');
    abrirSacolaBotao.setAttribute('aria-expanded', 'false');
    abrirSacolaBotao.focus();
}
abrirSacolaBotao.addEventListener('click', abrirSacola);
fecharSacolaBotao.addEventListener('click', fecharSacola);
fundoSacola.addEventListener('click', fecharSacola);
esvaziarSacolaBotao.addEventListener('click', () => {
    if (!sacola.length || !confirm('Deseja esvaziar sua sacola?')) return;
    sacola = []; salvarSacola(); atualizarSacola();
});
document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && !painelSacola.hidden) fecharSacola();
});
// O botão de adicionar é criado dinamicamente pelo detalhe-produto.js.
document.addEventListener('click', evento => {
    if (evento.target.closest('#adicionar-detalhe')) {
        queueMicrotask(() => { sacola = carregarSacola(); atualizarSacola(); });
    }
});
atualizarSacola();
