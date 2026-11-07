/* Animações que respondem à rolagem (inclusive ao voltar para cima). */
(() => {
    const ativo=()=>window.AuroraEfeitos?.ativos !== false;
    const barra=document.createElement('div');
    barra.className='progresso-leitura';barra.setAttribute('aria-hidden','true');document.body.appendChild(barra);
    const topo=document.createElement('button');
    topo.className='voltar-topo-rolagem';topo.type='button';topo.textContent='↑';topo.hidden=true;
    topo.setAttribute('aria-label','Voltar ao início da página');document.body.appendChild(topo);
    topo.addEventListener('click',()=>scrollTo({top:0,behavior:ativo()?'smooth':'instant'}));
    let treno=null;
    if(document.body.classList.contains('pagina-index')) {
        treno=document.createElement('div');treno.className='treno-rolagem aurora-guia-rolagem';treno.hidden=true;
        treno.setAttribute('aria-hidden','true');
        treno.innerHTML=`<div class="treno-balanco aurora-guia">
            <span class="aurora-guia-trilha"></span>
            <span class="aurora-guia-faixa aurora-guia-faixa-1"></span>
            <span class="aurora-guia-faixa aurora-guia-faixa-2"></span>
            <span class="aurora-guia-corpo"><span class="aurora-guia-nucleo"></span></span>
            <span class="aurora-guia-brilho aurora-guia-brilho-1"></span>
            <span class="aurora-guia-brilho aurora-guia-brilho-2"></span>
            <span class="aurora-guia-brilho aurora-guia-brilho-3"></span>
        </div>`;
        document.body.appendChild(treno);
    }
    let quadro=false;
    function atualizar() {
        quadro=false;
        const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
        const f=Math.max(0,Math.min(1,scrollY/max));
        barra.style.transform=`scaleX(${f})`;
        topo.hidden=scrollY<500;
        if(treno){treno.hidden=!ativo() || scrollY<110;
            if(!treno.hidden)treno.style.transform=`translate3d(0,${108+f*Math.max(100,innerHeight-275)}px,0) rotate(${Math.sin(f*10)*4}deg)`;}
    }
    const agendar=()=>{if(!quadro){quadro=true;requestAnimationFrame(atualizar);}};
    addEventListener('scroll',agendar,{passive:true});addEventListener('resize',agendar,{passive:true});
    const seletores=['.produto-card','.vitrine-card','.card-produto','.card','.dex-item','.categoria-card',
        '.diferencial-card','.catalogo-categoria','.contador .tempo','.slideshow-home-cabecalho',
        '.slideshow-home-janela','.sobre-bloco','.contato-card','.sobre-convite','.doceria-detalhes',
        'main h2','main h3','main > section > p','main form','.detalhe-info','.detalhe-compra',
        '.detalhe-grade > div','main > section > img','main > article','.rodape-coluna'].join(',');
    const registrados=new WeakSet();
    const observador=('IntersectionObserver' in window)?new IntersectionObserver(entradas=>{
        for(const e of entradas){
            if(!ativo()) { e.target.classList.add('entrada-concluida'); continue; }
            if(e.isIntersecting) e.target.classList.add('entrada-concluida');
            else if(e.boundingClientRect.top > innerHeight*1.08 || e.boundingClientRect.bottom < -140) e.target.classList.remove('entrada-concluida');
        }
    },{threshold:0.12,rootMargin:'0px 0px -8% 0px'}):null;
    function preparar(){
        document.querySelectorAll(seletores).forEach(el=>{
            if(registrados.has(el) || el.closest('.cena-percurso') || el.closest('[hidden]'))return;
            // O card inteiro entra na tela; títulos internos não podem animar sozinhos.
            // Eles ficavam com opacity:0 e fora da área de observação, ocultando nomes.
            if(el.matches('h3') && el.closest('.categoria-card,.produto-card,.vitrine-card,.card-produto,.diferencial-card,.catalogo-categoria,.card,.dex-item'))return;
            if(!el.getBoundingClientRect().height)return;
            registrados.add(el);
            const card=el.matches('.produto-card,.vitrine-card,.card-produto,.card,.dex-item,.categoria-card,.diferencial-card,.catalogo-categoria,.tempo');
            const pai=el.parentElement;
            const i=pai?Array.prototype.indexOf.call(pai.children,el):0;
            const direcao=(i%2===0)?-1:1;
            el.style.setProperty('--entrada-atraso',`${(i%4)*95}ms`);
            el.style.setProperty('--entrada-x',card?`${direcao*34}px`:`${direcao*18}px`);
            el.style.setProperty('--entrada-y',card?'30px':'22px');
            el.style.setProperty('--entrada-rot',card?`${direcao*.7}deg`:`${direcao*.22}deg`);
            el.style.setProperty('--entrada-escala',card?'.975':'.992');
            el.style.setProperty('--entrada-raio',card?'16px':'0px');
            el.style.setProperty('--entrada-blur',card?'0px':'0px');
            el.classList.add(card?'entrada-card':'entrada-suave');
            if(!ativo())el.classList.add('entrada-concluida');
            if(observador)observador.observe(el);else el.classList.add('entrada-concluida');
        });
    }
    preparar();
    const principal=document.querySelector('main');
    if(principal && 'MutationObserver' in window) {
        new MutationObserver(()=>{preparar();agendar();}).observe(principal,{childList:true,subtree:true});
    }
    addEventListener('aurora:efeitos',()=>{
        if(!ativo())document.querySelectorAll('.entrada-card,.entrada-suave').forEach(el=>el.classList.add('entrada-concluida'));
        else if(observador)document.querySelectorAll('.entrada-card,.entrada-suave').forEach(el=>{
            const r=el.getBoundingClientRect();el.classList.toggle('entrada-concluida',r.bottom>0 && r.top<innerHeight);
        });
        agendar();
    });
    atualizar();
})();
