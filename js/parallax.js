/* Parallax com profundidade: aldeia dos Smurfs e árvores em planos independentes. */
(() => {
    const cena=document.querySelector('.cena-percurso');
    if (!cena) return;
    const quadro=cena.querySelector('.cena-fixa');
    const fundo=cena.querySelector('.cena-montanhas');
    const arvores=cena.querySelector('.cena-pinheiros');
    const titulo=cena.querySelector('.cena-titulo');
    const dica=cena.querySelector('.cena-dica');
    if (!quadro || !fundo || !arvores) return;
    let agendado=false, mx=0,my=0;
    const limite=(v,a,b)=>Math.min(b,Math.max(a,v));
    function renderizar() {
        agendado=false;
        const ativado=window.AuroraEfeitos?.ativos !== false;
        const tamanho=Math.max(1,cena.offsetHeight-quadro.offsetHeight);
        const progresso=ativado?limite(-cena.getBoundingClientRect().top/tamanho,0,1):0;
        // O fundo se aproxima, e os pinheiros passam em outro ritmo.
        fundo.style.transform=`translate3d(${mx*-22}px,${-progresso*135+my*-14}px,0) scale(${1.04+progresso*.14})`;
        arvores.style.transform=`translate3d(${mx*30}px,${30-progresso*175+my*18}px,0) scale(${1.05+progresso*.1})`;
        if(titulo){titulo.style.transform=`translate3d(-50%,${-progresso*120}px,0)`;titulo.style.opacity=String(1-progresso*.75);}
        if(dica)dica.style.opacity=String(Math.max(0,1-progresso*5));
    }
    function agendar(){if(!agendado){agendado=true;requestAnimationFrame(renderizar);}}
    cena.addEventListener('pointermove',e=>{
        if(e.pointerType==='touch' || window.AuroraEfeitos?.ativos===false)return;
        const r=quadro.getBoundingClientRect();
        mx=limite((e.clientX-r.left)/Math.max(r.width,1)*2-1,-1,1);
        my=limite((e.clientY-r.top)/Math.max(r.height,1)*2-1,-1,1);
        agendar();
    },{passive:true});
    cena.addEventListener('pointerleave',()=>{mx=0;my=0;agendar();});
    addEventListener('scroll',agendar,{passive:true});
    addEventListener('resize',agendar,{passive:true});
    addEventListener('aurora:efeitos',agendar);
    renderizar();
})();
