    var classe = document.getElementById("entrada");


    function removePalavrasDaLinha(palavra, listaRemover){
        for (let indice = 0; indice < listaRemover.length; indice++) {
            const element = listaRemover[indice];
            
            const existePalavraInvalida = palavra.indexOf(element) != -1;
            if(existePalavraInvalida){
                palavra = palavra.replace(element, "");
            }
        }

        return palavra;
    }

    function AdicionarEspacos(propriedade){
        var listaPalavrasIgnoradas = ["Codigo",]
    
        var saida = "";
        for (let index = 0; index < propriedade.length; index++) {
    
            var letra = propriedade[index];
            var letraEhMaiuscula = letra == letra.toUpperCase();
            if(letraEhMaiuscula){
               saida += " "; 
            }

            if(listaPalavrasIgnoradas.includes(letra)){
                continue;
            }
            saida += letra;
        }
        
        saida = removePalavrasDaLinha(saida, listaPalavrasIgnoradas);

        return saida;
    }
    
    function contemUmItemDaListaNaListaProcurada(listaProcurada, listaItens){
    
        for (const procurado of listaProcurada) {
            
            for (const item of listaItens) {
                
                if(procurado.toLowerCase() == item.toLowerCase())
                    return procurado;
            }
        }
        return "";
    }
    
    function formataLinhaResx(propriedade){
        var propriedadeComEspacos = AdicionarEspacos(propriedade);
    
        const propriedadeContemEspacos = propriedadeComEspacos.indexOf(" ") != -1;
        
        var propriedadeEmArray = propriedadeComEspacos;
        if(propriedadeContemEspacos){
            propriedadeEmArray = propriedadeComEspacos.split(" ");
        }

        var listaPalavrasIgnoradas = ["id", "viewmodel", "view", "model", "Codigo","Descricao"];
    
        if(contemUmItemDaListaNaListaProcurada(listaPalavrasIgnoradas, propriedadeEmArray)){
    
            for (let i = 0; i < propriedadeEmArray.length; i++) {
                var propriedadeNormalizada = propriedadeEmArray[i];
                var propriedade = propriedadeEmArray[i].toLowerCase();
    
                var contemPalavra = listaPalavrasIgnoradas.includes(propriedadeNormalizada) || listaPalavrasIgnoradas.includes(propriedade);

                var indicePalavra = listaPalavrasIgnoradas.indexOf(propriedade);
                
                if(contemPalavra){
                    var palavraEncontrada = listaPalavrasIgnoradas[indicePalavra];
                    var removidoPalavraIndesejada = propriedade.replace(palavraEncontrada, ""); 
    
                    propriedadeEmArray[i] = removidoPalavraIndesejada;
                }
                
            }
        }
    
        return `label${propriedade}	${propriedadeComEspacos}	
    `;
    }
    
    function leiaCaracteres(classe){
        var resourcesNames = [];
    
        var listaPalavrasIgnoradas = ["Codigo"];
        var listaPalavrasExcluidas = ["id", "class"];
    
        var linhas = classe.split("\n");
        for (let index = 0; index < linhas.length; index++) {
    
            var linha = linhas[index];
    
            var indicePublic = linha.indexOf("public");
            var contemPublic = indicePublic != -1;
    
            if(contemPublic){
    
                var linhaNomeDaClasse = linha.indexOf("class") != -1;
    
                if(linhaNomeDaClasse)
                    continue;
    
                var tipoPropriedade = linha.substr(indicePublic).split(" ")[1];
                var nomePropriedade = linha.substr(indicePublic).split(" ")[2];
    
                if(listaPalavrasExcluidas.includes(nomePropriedade.toLowerCase()))
                    continue;
    
                var resourceLinha = formataLinhaResx(nomePropriedade);
                if(existeMatchNaLista(resourceLinha, listaPalavrasIgnoradas)){
                    continue;
                }
                resourcesNames.push(resourceLinha);
            }
        }
        
        return resourcesNames;
    }
    
    function printar(){
        var entradaString = entrada.value;
        const entradaContemValor =  entradaString != undefined;
        if(entradaContemValor){
            var saida = document.getElementById("saida");
            saida.innerHTML = "";
            var lista = leiaCaracteres(entradaString);
            lista.forEach(item => {
                saida.innerHTML += item + "\n";
            });
            copiaAposFormatado();
        }
    }
    