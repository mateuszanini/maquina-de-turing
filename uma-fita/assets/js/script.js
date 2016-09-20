/*global $*/
/*global setCharAt*/

function criaFita(celulas){
    var tabela = $(".tabela-fita");
    var linha1 = '<tr class="text-center">';
    var linha2 = '<tr class="text-center">';
    var linhaFita = '<tr class="text-center" id="linha-fita">';
    
    for(var i = 0; i < celulas; i++){
        //inicio
        if(i == 0){
            linhaFita += '<td id="fita' + i + '"><i class="fa fa-arrow-left" aria-hidden="true"></i></td>';
        }
        //fim
        if(i == celulas - 1){
            linhaFita += '<td id="fita' + i + '"><i class="fa fa-arrow-right" aria-hidden="true"></i></td>';
        }
        
        //metade
        if(i == (celulas - 1) / 2){
            linha1 += '<td><i class="fa fa-2x fa-arrow-down" aria-hidden="true"></i></td>';
            linha2 += '<td><i class="fa fa-2x fa-arrow-up" aria-hidden="true"></i></td>';
            linhaFita += '<td id="fita' + i + '" class="sucesso"></td>';
        }else{
            linha1 += '<td><i class="fa fa-square" aria-hidden="true"></i></td>';
            linha2 += '<td><i class="fa fa-square" aria-hidden="true"></i></td>';
            if(i != 0 && i != celulas - 1){
                linhaFita += '<td id="fita' + i + '"></td>';
            }
        }
    }
    
    linha1 += '</tr>';
    linha2 += '</tr>';
    linhaFita += '</tr>';
    
    tabela.append(linha1, linhaFita, linha2);
    
}

var estados = new Array();
var alfabeto = new Array();
var alfabetoFita = new Array();
var estadoInicial = null;
var estadoFinal = new Array();

function insereEstado(event){
    
    var tecla = event.keyCode;
    
    if(tecla == 13){
        var estado = $('#input-estado').val();
        estado = estado.toUpperCase();
        var repetido = false;
        
        $('.info-estado').html("");
        
        if(estado.trim() != ""){
            
            for(var i = 0; i < estados.length; i++){
               if(estados[i] == estado){
                    $('.info-estado').html(informacao("Estado <strong>" + estado + "</strong> já cadastrado."));
                    repetido = true;
               }
            }
            
            if(!repetido){
                estados.push(estado);
            }
        }else{
            $('.info-estado').html(informacao("O nome de um Estado não pode estar em branco/vazio."));
        }
        
        $('#input-estado').val('');
        $('#input-estado').focus();
        
        imprimeEstado();
    }
    
    prosseguir();
    
}

function imprimeEstado(){
    
    var str = '<p>' + estados.length + ' estados cadastrados.</p>';
    str += '<ul class="list-inline">';
    
    var optEstado = '';
    var estadosFinais = '';
        
    for(var i = 0; i < estados.length; i++){
        str += '<li class="lista">' + estados[i] + '&nbsp;' + 
        '<a onclick="excluiEstado(' + i + ')" class="btn btn-default btn-xs">' +
        '<i class="fa fa-times-circle" aria-hidden="true"></i></a></li>';
        
        
        
        
        if(estadoInicial != i){
            optEstado += '<option value="' + i + '">' + estados[i] + '</option>';
            estadosFinais += '<label class="col-lg-6">' + 
                            '<input type="checkbox" id="estado-final-'+i+'" name="final[]" value="' + i + '" aria-label=""  onclick="selecionaFinal()">' + estados[i] +
                          '</label>';
        }else{
            optEstado += '<option value="' + i + '" selected>' + estados[i] + '</option>';
            estadosFinais += '<label class="col-lg-6">' + 
                            '<input type="checkbox" id="estado-final-'+i+'" name="final[]" value="' + i + '" aria-label=""   onclick="selecionaFinal()" disabled>' + estados[i] +
                          '</label>';
        }
        
    }
    
    str += '</ul>';
    
    $('#estados-cadastrados').html(str);
    $('#estado-inicial').html(optEstado);
    $('.estados-finais').html(estadosFinais);
    
    mostrarPainel();
    prosseguir();
}

function excluiEstado(pos){

    estados.splice(pos, 1);
    imprimeEstado();
    mostrarPainel();
    prosseguir();
}







function insereAlfabeto(event){
    
    var tecla = event.keyCode;
    
    if(tecla == 13){
        var simbolo = $('#input-alfabeto').val();
        simbolo = simbolo.toUpperCase();
        var repetido = false;
        
        $('.info-alfabeto').html("");
        
        if(simbolo.trim() != ""){
            
            for(var i = 0; i < alfabeto.length; i++){
               if(alfabeto[i] == simbolo){
                    $('.info-alfabeto').html(informacao("Símbolo <strong>" + simbolo + "</strong> já cadastrado."));
                    repetido = true;
               }
            }
            
            if(!repetido){
                alfabeto.push(simbolo);
            }
        }else{
            $('.info-alfabeto').html(informacao("O símbolo não pode ser branco/vazio."));
        }
        
        $('#input-alfabeto').val('');
        $('#input-alfabeto').focus();
        
        imprimeAlfabeto();
    }
    
    prosseguir();
    
}

function imprimeAlfabeto(){
    
    var str = '<p>' + alfabeto.length + ' símbolos no alfabeto</p>';
    str += '<ul class="list-inline">';
        
    for(var i = 0; i < alfabeto.length; i++){
        str += '<li class="lista">' + alfabeto[i] + '&nbsp;' + 
        '<a onclick="excluiAlfabeto(' + i + ')" class="btn btn-default btn-xs">' +
        '<i class="fa fa-times-circle" aria-hidden="true"></i></a></li>';
    }
    
    str += '</ul>';
    
    $('#alfabeto-cadastrado').html(str);
    
    mostrarPainel();
    prosseguir();
}

function excluiAlfabeto(pos){

    alfabeto.splice(pos, 1);
    imprimeAlfabeto();
    mostrarPainel();
    prosseguir();
}





/*var copiado = false;

function copia(){
    alfabetoFita += alfabeto;
    mostrarPainel();
    $('#copia').empty();
    imprimeAlfabetoFita();
    copiado = true;
}*/

function insereAlfabetoFita(event){
    
    var tecla = event.keyCode;
    
    if(tecla == 13){
        var simbolo = $('#input-fita').val();
        simbolo = simbolo.toUpperCase();
        var repetido = false;
        
        $('.info-fita').html("");
        
        if(simbolo.trim() != ""){
            
            for(var i = 0; i < alfabetoFita.length; i++){
               if(alfabetoFita[i] == simbolo){
                    $('.info-fita').html(informacao("Símbolo <strong>" + simbolo + "</strong> já cadastrado."));
                    repetido = true;
               }
            }
            
            if(!repetido){
                alfabetoFita.push(simbolo);
            }
        }else{
            $('.info-fita').html(informacao("O símbolo não pode ser branco/vazio."));
        }
        
        $('#input-fita').val('');
        $('#input-fita').focus();
        
        imprimeAlfabetoFita();
    }
    
    prosseguir();
    
}

function imprimeAlfabetoFita(){
    
    var str = '<p>' + alfabetoFita.length + ' símbolos no alfabeto da fita</p>';
    str += '<ul class="list-inline">';
        
    for(var i = 0; i < alfabetoFita.length; i++){
        str += '<li class="lista">' + alfabetoFita[i] + '&nbsp;' + 
        '<a onclick="excluiAlfabetoFita(' + i + ')" class="btn btn-default btn-xs">' +
        '<i class="fa fa-times-circle" aria-hidden="true"></i></a></li>';
    }
    
    str += '</ul>';
    
    $('#alfabeto-fita-cadastrado').html(str);
    
    mostrarPainel();
    prosseguir();
}

function excluiAlfabetoFita(pos){

    alfabetoFita.splice(pos, 1);
    imprimeAlfabetoFita();
    mostrarPainel();
    prosseguir();

}

function selecionaInicial(){
    estadoInicial = $('#estado-inicial').val();
    imprimeEstado();
    prosseguir();
}

function selecionaFinal(){
    estadoFinal = [];
    for(var i = 0; i < estados.length; i++){
        if($('#estado-final-' + i).prop("checked")){
            estadoFinal.push(estados[i]);
        }
    }
    prosseguir();
}



function prosseguir(){
    if(estados.length > 0 && alfabeto.length > 0 && alfabetoFita.length > 0 && estadoFinal.length > 0 && estadoInicial !== null){
        $("#btn-prosseguir").css("pointer-events", "auto");
        $("#next1").removeClass('btn-default');
        $("#next1").addClass('btn-primary');
    }else{
        $("#btn-prosseguir").css("pointer-events", "none");
        $("#next1").removeClass('btn-primary');
        $("#next1").addClass('btn-default');
    }
}

function next1(){
    imprimeDebug();
    preencheTransicao();
}

function imprimeDebug(){
    
    $("#next1").removeClass('btn-primary');
    $("#next1").addClass('btn-default');
    $("#btn-prosseguir").css("pointer-events", "none");
    
    var informacoes = '';
        
    informacoes += 'Estados: ' + estados + '\n';
    informacoes += 'Estado inicial: ' + estados[estadoInicial] + '\n';
    informacoes += 'Estado final: ' + estadoFinal + '\n';
    informacoes += 'Alfabeto aceito pela máquina: ' + alfabeto + '\n';
    informacoes += 'Alfabeto final da fita: ' + alfabetoFita + '\n\n';
    
    $("#debug").html(informacoes);
}

function preencheTransicao(){
    
    $("#formulario").css("pointer-events", "none");
    
    //estado atual
    var str = ""
    for(var i = 0; i < estados.length; i ++){
        str += '<option value="' + i + '" selected>' + estados[i] + '</option>';
    }
    $("#transicao-estado-atual").html(str);
    //próximo estado
    $("#tansicao-proximo-estado").html(str);
    
    //lido na fita
    str = "";
    str += '<option value="vazio" selected>&epsilon;</option>';
    for(var i = 0; i < alfabeto.length; i ++){
        str += '<option value="' + i + '" selected>' + alfabeto[i] + '</option>';
    }
    $("#transicao-lido-fita").html(str);
    
    //escreve na fita
    str = "";
    str += '<option value="vazio" selected>&epsilon;</option>';
    for(var i = 0; i < alfabetoFita.length; i ++){
        str += '<option value="' + i + '" selected>' + alfabetoFita[i] + '</option>';
    }
    $("#tansicao-escreve-fita").html(str);
    
    //movimento
    str = "";
    str += '<option value="-1" selected>Left</option>';
    str += '<option value="1" selected>Right</option>';
    str += '<option value="0" selected>Stop</option>';
    $("#tansicao-movimento").html(str);
    
    
    //habilita campos
    $("#transicao-estado-atual").prop("disabled", false);
    $("#transicao-lido-fita").prop("disabled", false);
    $("#tansicao-proximo-estado").prop("disabled", false);
    $("#tansicao-escreve-fita").prop("disabled", false);
    $("#tansicao-movimento").prop("disabled", false);
    
    $("#fita-entrada").prop("readonly", false);
    
    $("#adicionar-transicao").addClass("btn-primary");
    $("#adicionar-transicao").css("pointer-events", "inherit");
    
}



function mostrarPainel(){
    /*ESTADOS*/
    if(estados.length == 0){
        $('#panel-estado').css('display', 'none');
        $("#estado-inicial").prop( "disabled", true);
    }else{
        $('#panel-estado').css('display', 'inherit');
        $("#estado-inicial").prop( "disabled", false);
    }
    /*ALFABETO*/
    if(alfabeto.length == 0){
        $('#panel-alfabeto').css('display', 'none');
    }else{
        $('#panel-alfabeto').css('display', 'inherit');
    }
    /*ALFABETO FITA*/
    if(alfabetoFita.length == 0){
        $('#panel-alfabeto-fita').css('display', 'none');
    }else{
        $('#panel-alfabeto-fita').css('display', 'inherit');
    }
    /*MOSTRA BOTAO COPIAR*/
    /*if(copiado == true){
        $('#copia').css('display', 'none');
    }else{
        $('#copia').css('display', 'inherit');
    }*/
}

function informacao(msg){
    var str = '<div class="alert alert-danger alert-dismissible fade in" role="alert">' + 
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' + 
                    '<span aria-hidden="true">×</span>' + 
                    '</button> ' + 
                    msg + 
                '</div>';
                
    return str;
}

window.onload = function() {
    var tamanhoFita = 25;
    criaFita(tamanhoFita);

    $("#estado-inicial").prop( "disabled", true);
    
    $("#transicao-estado-atual").prop("disabled", true);
    $("#transicao-lido-fita").prop("disabled", true);
    $("#tansicao-proximo-estado").prop("disabled", true);
    $("#tansicao-escreve-fita").prop("disabled", true);
    $("#tansicao-movimento").prop("disabled", true);
    
    $("#fita-entrada").prop("readonly", true);
    
    $("#adicionar-transicao").addClass("btn-default");
    $("#adicionar-transicao").css("pointer-events", "none");
    
    $("#calcular").addClass("btn-default");
    $("#calcular").css("pointer-events", "none");
    
}

function Transicao() {
    var estadoAtual;
    var lidoNaFita;
    var proximoEstado;
    var escreveNaFita;
    var movimento;
    
    this.estadoAtual = 0;
    this.lidoNaFita = null;
    this.proximoEstado = 0;
    this.escreveNaFita = null;
    this.movimento = 0;
};

var transicoes = new Array();

function adicionaTransicao(){
    
    var qtd = transicoes.length
    
    transicoes[qtd] = new Transicao();
    
    transicoes[qtd].estadoAtual = $("#transicao-estado-atual").val();
    transicoes[qtd].lidoNaFita = $("#transicao-lido-fita").val();
    transicoes[qtd].proximoEstado = $("#tansicao-proximo-estado").val();
    transicoes[qtd].escreveNaFita = $("#tansicao-escreve-fita").val();
    transicoes[qtd].movimento = $("#tansicao-movimento").val();
    
    var le = transicoes[qtd].lidoNaFita;
    if(le == "vazio"){
        le = "&epsilon;";
    }else{
        le = alfabeto[le];
    }
    
    var escreve = transicoes[qtd].escreveNaFita;
    if(escreve == "vazio"){
        escreve = "&epsilon;";
    }else{
        escreve = alfabetoFita[escreve];
    }
    
    var mov = transicoes[qtd].movimento;
    if(mov == -1){
        mov = "L";
    }
    if(mov == 0){
        mov = "S";
    }
    if(mov == 1){
        mov = "R";
    }
    
    $("#transicoes-adicionadas").append('<li>'+
        '(' + estados[transicoes[qtd].estadoAtual] + 
        ' x ' + le +
        ') &rArr; (' + estados[transicoes[qtd].proximoEstado] +
        ' x ' + escreve +
        ' x ' + mov +
        ')</li>');
        
    $("#debug").append('(' + estados[transicoes[qtd].estadoAtual] + 
        ' x ' + le +
        ') &rArr; (' + estados[transicoes[qtd].proximoEstado] +
        ' x ' + escreve +
        ' x ' + mov +
        ')\n'
        );
    
}

function habilitarCalcula(){
    //console.log($("#fita-entrada").val().length);
    if(transicoes.length > 0 && $("#fita-entrada").val().length > 0){
        $("#calcular").removeClass("btn-default");
        $("#calcular").addClass("btn-success");
        $("#calcular").css("pointer-events", "inherit");
    }else{
        $("#calcular").removeClass("btn-success");
        $("#calcular").addClass("btn-default");
        $("#calcular").css("pointer-events", "none");
    }
}

var entradaFita;
function calcular(){
    //$("#transicao").css("pointer-events", "none");
    
    entradaFita = $("#fita-entrada").val();
    $("#debug").append('\nFita de entrada: ' + entradaFita + '\n\n');
    entradaFita = entradaFita.split("");
    
    calculaTuring();
    
}

function calculaTuring(){
    
    var cabecote = 0;
    var estadoAtual = estadoInicial;
    
    while(cabecote < entradaFita.length){
        
        var valido = false;
        
        for(var i = 0; transicoes.length; i++){
            if(transicoes[i].estadoAtual == estadoAtual){
                if(entradaFita[cabecote] == alfabeto[transicoes[i].lidoNaFita]){
                    /*entradaFita = setCharAt(entradaFita, cabecote, alfabetoFita[transicoes[i].escreveNaFita]);*/
                    entradaFita[cabecote] = alfabetoFita[transicoes[i].escreveNaFita];
                    
                    cabecote += parseInt(transicoes[i].movimento);
                    estadoAtual = parseInt(transicoes[i].proximoEstado);
                    
                    valido = true;
                    break;
                }
            }
        }
        
        if(valido == false){
            alert(valido);
        }
    }
    
    var aceita = false;
    for(var i = 0; i < estadoFinal.length; i++){
        if(estadoFinal[i] == estadoAtual){
            aceita = true;
            break;
        }
    }
    
    alert(aceita);
    
}