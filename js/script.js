/* Neve animada: permanece em movimento enquanto a aba estiver visível.
   Canvas não bloqueia cliques, com desenho dimensionado ao dispositivo. */
(() => {
    function iniciarNeve() {
        if (document.getElementById("neve-site")) return;
        const tela = document.createElement("canvas");
        tela.id = "neve-site";
        tela.setAttribute("aria-hidden", "true");
        tela.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2147483646;";
        document.body.appendChild(tela);
        const ctx = tela.getContext("2d", { alpha: true });
        if (!ctx) { tela.remove(); return; }

        let largura = 0, altura = 0, flocos = [], quadro = null, anterior = 0;
        function criarFloco(inicial = false) {
            return {
                x: Math.random() * largura,
                y: inicial ? Math.random() * altura : -8 - Math.random() * 60,
                raio: 1.15 + Math.random() * 2.6,
                velocidade: 40 + Math.random() * 65,
                desvio: 6 + Math.random() * 15,
                fase: Math.random() * Math.PI * 2,
                transparencia: 0.47 + Math.random() * 0.48
            };
        }
        function redimensionar() {
            largura = Math.max(1, window.innerWidth);
            altura = Math.max(1, window.innerHeight);
            const escala = Math.min(window.devicePixelRatio || 1, 2);
            tela.width = Math.round(largura * escala);
            tela.height = Math.round(altura * escala);
            ctx.setTransform(escala, 0, 0, escala, 0, 0);
            // Quantidade limitada para não pesar no computador ou celular.
            const quantidade = Math.min(135, Math.max(45, Math.round(largura * altura / 13000)));
            flocos = Array.from({ length: quantidade }, () => criarFloco(true));
            desenhar(0, 0);
        }
        function desenhar(delta, tempo) {
            ctx.clearRect(0, 0, largura, altura);
            ctx.shadowBlur = 0;
            for (const floco of flocos) {
                floco.y += floco.velocidade * delta;
                floco.x += (floco.desvio + Math.sin(tempo / 1050 + floco.fase) * 19) * delta;
                if (floco.y > altura + 8) Object.assign(floco, criarFloco());
                if (floco.x > largura + 8) floco.x = -8;
                if (floco.x < -8) floco.x = largura + 8;
                ctx.beginPath();
                ctx.arc(floco.x, floco.y, floco.raio, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${floco.transparencia})`;
                ctx.fill();
            }
        }
        function animar(agora) {
            // Não acumular saltos grandes quando a aba voltar do segundo plano.
            const delta = anterior ? Math.max(0, Math.min((agora - anterior) / 1000, 0.05)) : 0;
            anterior = agora;
            desenhar(delta, agora);
            quadro = window.requestAnimationFrame(animar);
        }
        function atualizar() {
            if (quadro !== null) window.cancelAnimationFrame(quadro);
            quadro = null;
            anterior = 0;
            // Respeita a preferência de acessibilidade do dispositivo.
            if (!document.hidden && window.AuroraEfeitos?.ativos !== false) quadro = window.requestAnimationFrame(animar);
            else desenhar(0, 0);
        }
        window.addEventListener("resize", () => { redimensionar(); atualizar(); }, { passive: true });
        document.addEventListener("visibilitychange", atualizar);
        window.addEventListener("aurora:efeitos", atualizar);
        window.addEventListener("pagehide", () => {
            if (quadro !== null) window.cancelAnimationFrame(quadro);
            quadro = null;
        });
        window.addEventListener("pageshow", atualizar);
        redimensionar();
        atualizar();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciarNeve, { once: true });
    else iniciarNeve();
})();

/* =========================================
   LUZINHAS NATALINAS ALEATÓRIAS
========================================= */
const cordao = document.querySelector(".cordao-natalino");
const coresNatal = ["#FF3333", "#00BFFF", "#FFE600", "#00FF66", "#FF8C00", "#FF55DD"];

if (cordao) {
    const quantidade = Math.ceil(cordao.offsetWidth / 44);

    for (let i = 0; i < quantidade; i++) {
        const lampada = document.createElement("span");
        const corAleatoria = coresNatal[Math.floor(Math.random() * coresNatal.length)];
        const posicao = i * 44 + 8 + Math.random() * 6;
        const altura = 15 - 13 * Math.cos((posicao / 20) * Math.PI);
        const inclinacao = Math.random() * 70 - 35;
        const atraso = Math.random() * 3;
        const duracao = 1 + Math.random() * 2;

        lampada.classList.add("lampada-natal");
        lampada.style.left = `${posicao}px`;
        lampada.style.top = `${altura}px`;
        lampada.style.setProperty("--cor-luz", corAleatoria);
        lampada.style.setProperty("--inclinacao", `${inclinacao}deg`);
        lampada.style.setProperty("--atraso", `${atraso}s`);
        lampada.style.animationDuration = `${duracao}s`;

        cordao.appendChild(lampada);
    }
}

/* =========================================
   PRODUTOS EM DESTAQUE
========================================= */

const listaDestaques = document.getElementById("lista-destaques");

if (listaDestaques) {
    const produtosDestaque = [2, 21, 44, 11, 31, 49].map((id) => produtos.find((p) => p.id === id));
    produtosDestaque.forEach((produto) => {
        listaDestaques.innerHTML += `
            <article class="produto-card">
                ${produto.oferta ? '<span class="produto-selo">OFERTA</span>' : ""}
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p class="produto-preco">${produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                <a href="produtos.html?produto=${produto.id}#catalogo-produtos" class="produto-botao">Ver produto</a>
            </article>
        `;
    });
}

/* =========================================
   CONTAGEM REGRESSIVA PARA O NATAL
========================================= */
function atualizarContadorNatal() {
    const agora = new Date();
    let anoNatal = agora.getFullYear();
    let natal = new Date(anoNatal, 11, 25, 0, 0, 0);

    if (agora >= natal) {
        anoNatal++;
        natal = new Date(anoNatal, 11, 25, 0, 0, 0);
    }

    const diferenca = natal - agora;
    const valores = {
        dias: Math.floor(diferenca / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diferenca / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((diferenca / (1000 * 60)) % 60),
        segundos: Math.floor((diferenca / 1000) % 60),
    };

    document.querySelectorAll('[data-contador-natal]').forEach((elemento) => {
        const unidade = elemento.getAttribute('data-contador-natal');
        if (!(unidade in valores)) return;
        elemento.textContent = String(valores[unidade]).padStart(2, '0');
    });
}

if (document.querySelector('[data-contador-natal]')) {
    atualizarContadorNatal();
    setInterval(atualizarContadorNatal, 1000);
}

/* =========================================
   FOGOS DE ARTIFÍCIO - AURORA NOEL
========================================= */

function iniciarFogos(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const particulas = [];
    const heroi = id.startsWith('fogos-home-');
    const cores = ['#ffe27c','#ff82aa','#7effe2','#b59bff','#fff9eb'];
    let quadro = null, anterior = 0, ultimoEstouro = 0, visivel = false;
    let largura = 1, altura = 1;
    function ajustar() {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        const w = Math.max(1, canvas.clientWidth), h = Math.max(1, canvas.clientHeight);
        if (Math.round(w*dpr) === canvas.width && Math.round(h*dpr) === canvas.height) return;
        largura = w; altura = h;
        canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function criarEstouro() {
        const esquerda = id.includes('esquerda');
        const x = largura * ((esquerda ? .25 : .12) + Math.random()*.53);
        const y = altura * (.15 + Math.random()*.52);
        const cor = cores[Math.floor(Math.random()*cores.length)];
        const n = heroi ? 64 : 100;
        for (let i=0;i<n;i++) {
            const angulo = (i/n)*Math.PI*2 + Math.random()*.14;
            const rapidez = 35+Math.random()*(heroi ? 90 : 125);
            particulas.push({x,y,vx:Math.cos(angulo)*rapidez,vy:Math.sin(angulo)*rapidez,vida:1,cor,tamanho:1.6+Math.random()*1.8});
        }
    }
    function desenhar(agora) {
        quadro = null;
        if (!visivel || document.hidden || window.AuroraEfeitos?.ativos === false || !canvas.isConnected) return;
        ajustar();
        const dt = anterior ? Math.min(.05,(agora-anterior)/1000) : .016;
        anterior=agora;
        ctx.clearRect(0,0,largura,altura);
        if (!ultimoEstouro || agora-ultimoEstouro> (heroi ? 1300 : 900)) {
            criarEstouro(); ultimoEstouro=agora;
        }
        for (let i=particulas.length-1; i>=0; i--) {
            const p=particulas[i];
            p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=30*dt; p.vida-=dt*(heroi?.65:.50);
            if (p.vida<=0) {particulas.splice(i,1);continue;}
            ctx.globalAlpha=Math.min(1,p.vida*1.6);
            ctx.fillStyle=p.cor;ctx.shadowColor=p.cor;ctx.shadowBlur=10;
            ctx.beginPath();ctx.arc(p.x,p.y,p.tamanho,0,Math.PI*2);ctx.fill();
        }
        ctx.globalAlpha=1;ctx.shadowBlur=0;
        quadro=requestAnimationFrame(desenhar);
    }
    function atualizar() {
        if (quadro !== null) { cancelAnimationFrame(quadro); quadro=null; }
        anterior=0; ultimoEstouro=0;
        if (visivel && !document.hidden && window.AuroraEfeitos?.ativos !== false) quadro=requestAnimationFrame(desenhar);
        else {particulas.length=0;ctx.clearRect(0,0,largura,altura);}
    }
    if ('ResizeObserver' in window) new ResizeObserver(ajustar).observe(canvas);
    addEventListener('resize',ajustar,{passive:true});
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(entradas=>{visivel=entradas[0].isIntersecting;atualizar();},{threshold:0.01}).observe(canvas);
    } else {visivel=true;atualizar();}
    addEventListener('aurora:efeitos',atualizar);
    document.addEventListener('visibilitychange',atualizar);
    addEventListener('pageshow',atualizar);
    ajustar();
}
['fogos-esquerda','fogos-direita','fogos-home-esquerda','fogos-home-direita'].forEach(iniciarFogos);

// Música escolhida no ZIP original, sem substituição do arquivo.
const botaoMusica = document.getElementById("botao-musica");
const musicaNatal = document.getElementById("musica-natal");
if (botaoMusica && musicaNatal) {
    musicaNatal.volume = 0.25;
    musicaNatal.loop = true;
    const atualizarMusica = () => {
        const tocando = !musicaNatal.paused;
        botaoMusica.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4Z"/>${tocando ? '<path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>' : '<path d="m16 9 5 6m0-6-5 6"/>'}</svg>`;
        botaoMusica.setAttribute("aria-pressed", String(tocando));
        botaoMusica.setAttribute(
            "aria-label",
            tocando ? "Pausar música de Natal" : "Continuar música de Natal",
        );
    };
    musicaNatal.addEventListener("loadedmetadata", () => {
        try {
            const tempo = Number(sessionStorage.getItem("auroraNoelTempoMusica"));
            if (Number.isFinite(tempo) && tempo > 0 && tempo < musicaNatal.duration)
                musicaNatal.currentTime = tempo;
        } catch (_) {
            /* A música funciona mesmo sem armazenamento disponível. */
        }
    });
    const salvarTempo = () => {
        try {
            sessionStorage.setItem("auroraNoelTempoMusica", String(musicaNatal.currentTime));
        } catch (_) {}
    };
    musicaNatal.addEventListener("timeupdate", salvarTempo);
    window.addEventListener("pagehide", salvarTempo);
    musicaNatal.addEventListener("play", atualizarMusica);
    musicaNatal.addEventListener("pause", atualizarMusica);
    botaoMusica.addEventListener("click", async () => {
        if (!musicaNatal.paused) musicaNatal.pause();
        else {
            try {
                await musicaNatal.play();
            } catch (_) {
                atualizarMusica();
                botaoMusica.title = "Não foi possível tocar. Clique para tentar novamente.";
            }
        }
    });
    atualizarMusica();
}
