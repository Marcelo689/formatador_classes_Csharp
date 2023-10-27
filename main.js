function copiaAposFormatado(){
    saida.select();
    document.execCommand('copy');
    exibeMensagemCentralizada();
    document.getSelection().empty();
}

function exibeMensagemCentralizada(){
    var corpo = document.getElementsByTagName('body')[0];

    var div = document.createElement("div");
    div.className = "container-mensagem";
    div.textContent = "Copiado para clipboard!!";
    corpo.appendChild(div)

    setTimeout(function(){
        div.remove();
    }, 700)

}