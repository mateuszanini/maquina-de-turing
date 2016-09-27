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
    var read;
    var write;
    var move;
    
    this.from = 0;
    this.to = 0;
    this.read = null;
    this.write = null;
    this.move = 0;
}

function mensagem(mensagem, status){
    $("#mensagem").html('<div class="alert alert-' + status + ' alert-dismissible">' + 
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>'+
                            mensagem +
                        '</div>'); 
}

function preencheInfo() {
    
    //TRANSIÇÕES
    for(var i = 0; i < transicoes.length; i++){
        var mov = transicoes[i].move;
        if(mov == -1){
            mov = "L";
        }
        if(mov == 0){
            mov = "S";
        }
        if(mov == 1){
            mov = "R";
        }
        
        $("#info-transicoes").append(
            '<p>(' + transicoes[i].from +
            ' x ' + transicoes[i].read +
            ') &rArr; (' + transicoes[i].to +
            ' x ' + transicoes[i].write +
            ' x ' + mov +
            ')</p>'
            );
    }
    
    //ESTADOS
    for(i = 0; i < estados.length; i++){
        var inicial = estados[i].estadoInicial;
        if(inicial){
            inicial = " &rArr; <strong>Inicial</strong> ";
        }else{
            inicial = "";
        }
        
        var final = estados[i].estadoFinal;
        if(final){
            final = " &rArr; <strong>Final</strong> ";
        }else{
            final = "";
        }
        
        $("#info-estados").append(
            '<p>' + estados[i].id +
            ' &rArr; ' + estados[i].nome + inicial + final);
    }
    
    //ALFABETO MAQUINA
    var uniqueAlfabeto = {};
    var distinctAlfabeto = [];
    transicoes.forEach(function (x) {
      if (!uniqueAlfabeto[x.read]) {
        distinctAlfabeto.push(x.read);
        uniqueAlfabeto[x.read] = true;
      }
    });
    $("#info-alfabeto-maquina").append('<p>' +
            distinctAlfabeto + '</p>');
            
    //ALFABETO FITA
    var uniqueFita = {};
    var distinctFita = [];
    transicoes.forEach(function (x) {
      if (!uniqueFita[x.write]) {
        distinctFita.push(x.write);
        uniqueFita[x.write] = true;
      }
    });
    $("#info-alfabeto-fita").append('<p>' +
            distinctFita + '</p>');
    
    
}

var estados = new Array();
var transicoes = new Array();

$(function() {

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
});

function calculaTuring(){
    
    $("#debug").html("");
    
    var input = $("#input-fita").val();                      
    
    input = input.split("");
    input.push("*");
    
    var cabecote = 0;
    
    var estadoAtual = 0;
    
    for(var i = 0; i < estados.length; i++){
        if(estados[i].estadoInicial === true){
            estadoAtual = parseInt(estados[i].id);
        }
    }
    
    while(cabecote < input.length){
        
        var valido = false;
        
        var debug = '<a href="#" class="list-group-item">';
        
        debug += 'Input: ' + input + '<br>';
        debug += 'Cabeçote: ' + cabecote + '<br>';
        debug += 'Estado atual: ' + estadoAtual + '<br>';
        
        for(var i = 0; i < transicoes.length; i++){
            if(parseInt(transicoes[i].from) === parseInt(estadoAtual)){
                /*console.log(transicoes[i]);
                console.log(estadoAtual);*/
                if(String(transicoes[i].read) === String(input[cabecote])){
                    
                    debug += 'Lido na fita: ' + input[cabecote] + '<br>';
                    
                    //input.splice(cabecote, 1, transicoes[i].write);
                    input[cabecote] = transicoes[i].write;
                    
                    debug += 'Escreve na fita: ' + input[cabecote] + '<br>';
                    debug += 'Movimento: ' + transicoes[i].move + '<br>';
                    
                    cabecote += parseInt(transicoes[i].move);
                    estadoAtual = parseInt(transicoes[i].to);
                    
                    valido = true;
                    break;
                }
            }
        }
        if(valido === false){
            //console.log("Transição não encontrada");
            break;
        }
        debug += '</a>';
        $("#debug").append(debug);
        
    }
    
    console.log(input);
    
    input.pop();
    
    if(estados[estadoAtual].estadoFinal){
        console.log("Palavra Válida");
        mensagem("Palavra Válida! Valor final da fita: " + input, "success");
    }else{
        console.log("Palavra Inválida");
        mensagem("Palavra Inválida! Valor final da fita: " + input, "danger");
    }
}