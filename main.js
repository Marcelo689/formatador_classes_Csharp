function copiaAposFormatado(){
    saida.select();
    //saida.setSelectionrange(0, 99999);
    document.execCommand('copy');
    saida.focus();
    exibeMensagemCentralizada();
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