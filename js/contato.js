const formularioContato = document.getElementById("form-contato");
const avisoContato = document.getElementById("mensagem-form");
formularioContato.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const assunto = document.getElementById("assunto").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();
    avisoContato.className = "";
    if (!nome || !email || !assunto || !mensagem) {
        avisoContato.textContent = "Preencha todos os campos para continuar.";
        avisoContato.className = "erro";
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        avisoContato.textContent = "Confira o endereço de e-mail.";
        avisoContato.className = "erro";
        return;
    }
    const texto = `Nome: ${nome}\nE-mail: ${email}\nAssunto: ${assunto}\n\n${mensagem}`;
    let saida = document.getElementById("contato-texto");
    if (!saida) {
        saida = document.createElement("textarea");
        saida.id = "contato-texto";
        saida.className = "contato-copia";
        saida.readOnly = true;
        saida.setAttribute("aria-label", "Mensagem pronta para copiar");
        formularioContato.appendChild(saida);
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "botao-banner";
        botao.textContent = "Copiar mensagem";
        botao.addEventListener("click", async () => {
            saida.select();
            try {
                await navigator.clipboard.writeText(saida.value);
                avisoContato.textContent =
                    "Mensagem copiada. Você pode colá-la no canal de contato da equipe.";
            } catch (_) {
                avisoContato.textContent = "Texto selecionado. Use Ctrl+C para copiar.";
            }
        });
        formularioContato.appendChild(botao);
    }
    saida.value = texto;
    avisoContato.textContent = "Sua mensagem está pronta para copiar. Ela ainda não foi enviada.";
    avisoContato.className = "sucesso";
});
