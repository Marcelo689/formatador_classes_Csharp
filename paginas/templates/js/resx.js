    var classe = document.getElementById("entrada");
    
    function AdicionarEspacos(propriedade){
        var saida = "";
    
        for (let index = 0; index < propriedade.length; index++) {
    
            var letra = propriedade[index];
            var letraEhMaiuscula = letra == letra.toUpperCase();
            if(letraEhMaiuscula){
               saida += " "; 
            }
            saida += letra;
        }
    
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

    function ehPropriedadePercentual(propriedadeComEspacos){
        return propriedadeComEspacos.indexOf("Percentual") != -1;
    }

    function formatarPercentualResx(propriedadeComEspacos){
        return propriedadeComEspacos.replace("Percentual", "%");
    }

    function formataLinhaResx(propriedade){
        var listaPalavrasLabelIgnorados = ["Codigo" , "Id"];
        var propriedadeComEspacos = AdicionarEspacos(propriedade);
    
        if(seListaContemMatch(propriedadeComEspacos, listaPalavrasLabelIgnorados))
            return "";

        var propriedadeEmArray = propriedadeComEspacos.split(" ");
        var listaPalavrasIgnoradas = ["id", "viewmodel", "view", "model", "Codigo"];
    
        if(contemUmItemDaListaNaListaProcurada(listaPalavrasIgnoradas, propriedadeEmArray)){
    
            for (let i = 0; i < propriedadeEmArray.length; i++) {
                var propriedade = propriedadeEmArray[i].toLowerCase();
    
                var contemPalavra = listaPalavrasIgnoradas.includes(propriedade);
                var indicePalavra = listaPalavrasIgnoradas.indexOf(propriedade);
                
                if(contemPalavra){
                    var palavraEncontrada = listaPalavrasIgnoradas[indicePalavra];
                    var removidoPalavraIndesejada = propriedade.replace(palavraEncontrada, ""); 
    
                    propriedadeEmArray[i] = removidoPalavraIndesejada;
                }
                
            }
        }

        if(ehPropriedadeComposta(propriedadeComEspacos)){
            propriedadeComEspacos =  normalizaNomePropriedade(propriedadeComEspacos);
        }
        
        if(ehPropriedadePercentual(propriedadeComEspacos)){
            propriedadeComEspacos = formatarPercentualResx(propriedadeComEspacos);
        }

        return `label${propriedade}	${propriedadeComEspacos}	
    `;
    }
    
    function leiaCaracteres(classe){
        var resourcesNames = [];
    
        var listaPalavrasExcluidas = ["id", "class", "codigo"];
    
        var linhas = classe.split("\n");

        var dados = getNamespace(classe);
        dados.PreencheCamposDefault();

        var labelTitle = formataLinhaResx(dados.ControllerName);
        labelTitle = labelTitle.replace(dados.ControllerName, "Title");
        resourcesNames.push(labelTitle);
        
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
            
            var lista = leiaCaracteres(entradaString);
            lista.forEach(item => {
                saida.innerHTML += item + "\n";
            });
            copiaAposFormatado();
        }
    }
    