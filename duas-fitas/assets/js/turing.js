/*global $*/
/*global setCharAt*/

var simboloVazio = "*";

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
            
            estados = [];
            transicoes = [];
            
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
            
             $(xml).find('transition').each(function() {
                var tmpTransicao = new Transicao();
                
                tmpTransicao.from = $(this).find("from").text();
                tmpTransicao.to = $(this).find("to").text();
                
                $(this).find("read").each(function() {
					if ($(this).attr("tape") === '1') {
						tmpTransicao.read1 = $(this).text();
						if(tmpTransicao.read1 == ""){
						    tmpTransicao.read1 = simboloVazio;
						}
					}
					if ($(this).attr("tape") === '2') {
						tmpTransicao.read2 = $(this).text();
						if(tmpTransicao.read2 == ""){
						    tmpTransicao.read2 = simboloVazio;
						}
					}
				});
				
				$(this).find("write").each(function() {
					if ($(this).attr("tape") === '1') {
						tmpTransicao.write1 = $(this).text();
						if(tmpTransicao.write1 == ""){
						    tmpTransicao.write1 = simboloVazio;
						}
					}
					if ($(this).attr("tape") === '2') {
						tmpTransicao.write2 = $(this).text();
						if(tmpTransicao.write2 == ""){
						    tmpTransicao.write2 = simboloVazio;
						}
					}
				});
				
				var mov1;
				var mov2;
				
				$(this).find("move").each(function() {
					if ($(this).attr("tape") === '1') {
					    mov1 = $(this).text();
					}
					if ($(this).attr("tape") === '2') {
						mov2 = $(this).text();
					}
				});
				
                if(mov1 == "L") mov1 = -1;
                if(mov1 == "S") mov1 = 0;
                if(mov1 == "R") mov1 = 1;
                
                if(mov2 == "L") mov2 = -1;
                if(mov2 == "S") mov2 = 0;
                if(mov2 == "R") mov2 = 1;
                
                tmpTransicao.move1 = mov1;
                tmpTransicao.move2 = mov2;
                transicoes.push(tmpTransicao);
                
                //preencheInfo();
                
            });
            
            console.log(estados);
            console.log(transicoes);
            
        }else{
            mensagem("Arquivo inválido!", "danger");
        }
    };
    
    fileReader.onerror = function(){
        mensagem("Erro ao ler o arquivo!", "danger");
    };
    
    fileReader.readAsText(arquivo, "UTF-8");
}