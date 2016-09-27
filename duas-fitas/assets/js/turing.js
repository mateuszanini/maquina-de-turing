/*global $*/

function Estado(){
    
    var id;
    var nome;
    var estadoInicial;
    var estadoFinal;

    this.id = null;
    this.nome = null;
    this.estadoInicial = false;
    this.estadoFinal = false;
    
}

function Transicao() {
    var from;
    var to;
    var read1;
    var write1;
    var move1;
    var read2;
    var write2;
    var move2;
    
    this.from = 0;
    this.to = 0;
    this.read1 = null;
    this.write1 = null;
    this.move1 = 0;
    this.read2 = null;
    this.write2 = null;
    this.move2 = 0;
}

window.onload = function(){
  mensagem("Nenhum arquivo carregado até o momento!", "warning");
  $("#calcular").css("pointer-events", "none");
}

function mensagem(mensagem, status){
    $("#mensagem").html('<div class="alert alert-' + status + ' alert-dismissible">' + 
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>'+
                            mensagem +
                        '</div>'); 
}

var estados = new Array();
var transicoes = new Array();

function carregarArquivo() {
    var arquivo = document.getElementById("input-arquivo").files[0];
    
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) {
        var xml = fileLoadedEvent.target.result;
        
        //console.log(xml);
        
        if($(xml).find('type').text() == "turing" && $(xml).find('tapes').text() == "2"){
            mensagem("Arquivo lido com sucesso!", "success");
            $("#calcular").css("pointer-events", "auto");
            
            $(xml).find('block').each(function() {
               var tmpEstado = new Estado();
                
                var inicial = false;
                var final = false;
                
                tmpEstado.id = $(this).attr("id");
                tmpEstado.nome = $(this).attr("name");
                
                if($(this).find("initial")[0]){
                    tmpEstado.estadoInicial = true;
                }
                if($(this).find("final")[0]){
                    tmpEstado.estadoFinal = true;
                }
                
                estados.push(tmpEstado);
            });
            console.log(estados);
            
        }else{
            mensagem("Arquivo inválido!", "danger");
        }
    };
    
    fileReader.onerror = function(){
        mensagem("Erro ao ler o arquivo!", "danger");
    };
    
    fileReader.readAsText(arquivo, "UTF-8");
}

/*$(function() {

    $.ajax({
        type: 'GET',
        url: 'xml/jflap.jff',
        dataType: 'xml',
        success: function(xml) {
            
            mensagem("Arquivo lido com sucesso!", "success");
            
            $(xml).find('block').each(function() {
                
                //var qtdEstados = estados.length;
                
                var tmpEstado = new Estado();
                
                var inicial = false;
                var final = false;
                
                tmpEstado.id = $(this).attr("id");
                tmpEstado.nome = $(this).attr("name");
                
                if($(this).find("initial").text() == "Inicial"){
                    inicial = true;
                }
                if($(this).find("final").text() == "Final"){
                    final = true;
                }
                
                tmpEstado.estadoInicial = inicial;
                tmpEstado.estadoFinal = final;
                
                estados.push(tmpEstado);
            });
            
            $(xml).find('transition').each(function() {
               
               //var qtdTransicoes = transicoes.length;
               
               var tmpTransicao = new Transicao();
               
               tmpTransicao = new Transicao();
               
               tmpTransicao.from = $(this).find("from").text();
               tmpTransicao.to = $(this).find("to").text();
               tmpTransicao.read = $(this).find("read").text();
               tmpTransicao.write = $(this).find("write").text();
               
               var mov = $(this).find("move").text();
               
               if(mov == "L"){
                   mov = -1;
               }
               if(mov == "S"){
                   mov = 0;
               }
               if(mov == "R"){
                   mov = 1;
               }
               
               tmpTransicao.move = mov;
               
               transicoes.push(tmpTransicao);
                
            });
            
            console.log(estados);
            console.log(transicoes);
            
            preencheInfo();
        }
    });
});*/
