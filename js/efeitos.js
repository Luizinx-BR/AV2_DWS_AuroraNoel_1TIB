/* Estado explícito das animações. Ativas por padrão; o visitante pode pausá-las. */
(() => {
  let ativos = true;
  try { ativos = localStorage.getItem('auroraNoelAnimacoes') !== 'desligadas'; } catch (_) {}
  const atualizarClasse = () => {
    document.documentElement.classList.toggle('efeitos-ativos', ativos);
    document.documentElement.classList.toggle('efeitos-pausados', !ativos);
  };
  const estado = {
    get ativos() { return ativos; },
    definir(valor) {
      ativos = Boolean(valor);
      atualizarClasse();
      try { localStorage.setItem('auroraNoelAnimacoes', ativos ? 'ligadas' : 'desligadas'); } catch (_) {}
      window.dispatchEvent(new Event('aurora:efeitos'));
      if (document.readyState !== 'loading') atualizarBotao();
    }
  };
  window.AuroraEfeitos = estado;
  atualizarClasse();
  function atualizarBotao() {
    const botao = document.getElementById('controle-efeitos');
    if (!botao) return;
    botao.textContent = ativos ? '✨ Efeitos: ligados' : '▶ Ativar animações';
    botao.title = ativos ? 'Clique para pausar neve, fogos e animações' : 'Clique para ativar neve, fogos e parallax';
    botao.setAttribute('aria-pressed', String(ativos));
  }
  function iniciarControle() {
    if (document.getElementById('controle-efeitos')) return;
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.id = 'controle-efeitos';
    botao.className = 'controle-efeitos';
    botao.addEventListener('click', () => estado.definir(!ativos));
    document.body.appendChild(botao);
    atualizarBotao();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciarControle, { once:true });
  else iniciarControle();
})();
