/*global $*/
/*global setCharAt*/

//var simboloVazio = '<i class="fa fa-square-o" aria-hidden="true"></i>';
var simboloVazio = '*';
var addPosicao = 3;

function Estado() {

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

window.onload = function() {
    mensagem("Nenhum arquivo carregado até o momento!", "warning");
    $("#calcular").css("pointer-events", "none");
}

function mensagem(mensagem, status) {
    $("#mensagem").html('<div class="alert alert-' + status + ' alert-dismissible">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>' +
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

        if ($(xml).find('type').text() == "turing" && $(xml).find('tapes').text() == "2") {
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

                if ($(this).find("initial")[0]) {
                    tmpEstado.estadoInicial = true;
                }
                if ($(this).find("final")[0]) {
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
                        if (tmpTransicao.read1 == "") {
                            tmpTransicao.read1 = simboloVazio;
                        }
                    }
                    if ($(this).attr("tape") === '2') {
                        tmpTransicao.read2 = $(this).text();
                        if (tmpTransicao.read2 == "") {
                            tmpTransicao.read2 = simboloVazio;
                        }
                    }
                });

                $(this).find("write").each(function() {
                    if ($(this).attr("tape") === '1') {
                        tmpTransicao.write1 = $(this).text();
                        if (tmpTransicao.write1 == "") {
                            tmpTransicao.write1 = simboloVazio;
                        }
                    }
                    if ($(this).attr("tape") === '2') {
                        tmpTransicao.write2 = $(this).text();
                        if (tmpTransicao.write2 == "") {
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

                if (mov1 == "L") mov1 = -1;
                if (mov1 == "S") mov1 = 0;
                if (mov1 == "R") mov1 = 1;

                if (mov2 == "L") mov2 = -1;
                if (mov2 == "S") mov2 = 0;
                if (mov2 == "R") mov2 = 1;

                tmpTransicao.move1 = mov1;
                tmpTransicao.move2 = mov2;
                transicoes.push(tmpTransicao);

            });

            console.log(estados);
            console.log(transicoes);

            preencheInfo();

        }
        else {
            mensagem("Arquivo inválido!", "danger");
        }
    };

    fileReader.onerror = function() {
        mensagem("Erro ao ler o arquivo!", "danger");
    };

    fileReader.readAsText(arquivo, "UTF-8");
}

function preencheInfo() {

    //ALFABETO MAQUINA
    var uniqueAlfabeto = {};
    var distinctAlfabeto = [];
    transicoes.forEach(function(x) {
        if (!uniqueAlfabeto[x.read1]) {
            distinctAlfabeto.push(x.read1);
            uniqueAlfabeto[x.read1] = true;
        }
        if (!uniqueAlfabeto[x.read2]) {
            distinctAlfabeto.push(x.read2);
            uniqueAlfabeto[x.read2] = true;
        }
    });
    $("#info-alfabeto-maquina").html('<p>' +
        distinctAlfabeto + '</p>');

    //ALFABETO FITA
    var uniqueFita = {};
    var distinctFita = [];
    transicoes.forEach(function(x) {
        if (!uniqueFita[x.write1]) {
            distinctFita.push(x.write1);
            uniqueFita[x.write1] = true;
        }
        if (!uniqueFita[x.write2]) {
            distinctFita.push(x.write2);
            uniqueFita[x.write2] = true;
        }
    });
    $("#info-alfabeto-fita").html('<p>' +
        distinctFita + '</p>');

    //ESTADOS
    $("#info-estados").html("");
    for (var i = 0; i < estados.length; i++) {
        var inicial = estados[i].estadoInicial;
        if (inicial) {
            inicial = " &rArr; <strong>Inicial</strong> ";
        }
        else {
            inicial = "";
        }

        var final = estados[i].estadoFinal;
        if (final) {
            final = " &rArr; <strong>Final</strong> ";
        }
        else {
            final = "";
        }

        $("#info-estados").append(
            '<p>' + estados[i].id +
            ' &rArr; ' + estados[i].nome + inicial + final);
    }

    //TRANSIÇÕES
    $("#info-transicoes").html(
        '<div class="col-lg-6">' +
        '<p><strong>Fita 1</strong></p>' +
        '</div>' +
        '<div class="col-lg-6">' +
        '<p><strong>Fita 2</strong></p>' +
        '</div>'
    );
    for (i = 0; i < transicoes.length; i++) {
        var mov1 = transicoes[i].move1;
        if (mov1 == -1) mov1 = "L";
        if (mov1 == 0) mov1 = "S";
        if (mov1 == 1) mov1 = "R";

        var mov2 = transicoes[i].move2;
        if (mov2 == -1) mov2 = "L";
        if (mov2 == 0) mov2 = "S";
        if (mov2 == 1) mov2 = "R";

        $("#info-transicoes").append(
            '<div class="col-lg-6">' +
            '<p>(' + transicoes[i].from +
            ' x ' + transicoes[i].read1 +
            ') &rArr; (' + transicoes[i].to +
            ' x ' + transicoes[i].write1 +
            ' x ' + mov1 +
            ')</p></div>' +
            '<div class="col-lg-6">' +
            '<p>(' + transicoes[i].from +
            ' x ' + transicoes[i].read2 +
            ') &rArr; (' + transicoes[i].to +
            ' x ' + transicoes[i].write2 +
            ' x ' + mov2 +
            ')</p></div>'
        );
    }

}

function calculaTuring() {

    $("#debug").html("");

    var inputFita1 = $("#input-fita-1").val();
    var inputFita2 = $("#input-fita-2").val();

    var input1 = [];
    var input2 = [];

    var cabecote1 = 0;
    var cabecote2 = 0;

    for (var i = 0; i < addPosicao; i++) {
        input1.push(simboloVazio);
        input2.push(simboloVazio);

        cabecote1++;
        cabecote2++;
    }

    inputFita1 = inputFita1.split("");
    inputFita2 = inputFita2.split("");

    for (var i = 0; i < inputFita1.length; i++) {
        input1.push(inputFita1[i]);
    }
    for (var i = 0; i < inputFita2.length; i++) {
        input2.push(inputFita2[i]);
    }

    for (var i = 0; i < inputFita1.length; i++) {
        input2.push(simboloVazio);
    }

    input1.push(simboloVazio);
    input2.push(simboloVazio);



    var estadoAtual = {
        "id": 0,
        "indice": 0
    };
    //var estadoAtual = 0;

    for (var i = 0; i < estados.length; i++) {
        if (estados[i].estadoInicial === true) {
            //estadoAtual = parseInt(estados[i].id);
            estadoAtual.id = parseInt(estados[i].id);
            estadoAtual.indice = i;
        }
    }

    //while(estados[estadoAtual.indice].estadoFinal == false){
    var aux1 = 0;
    var aux2 = 0;
    var final = false;
    
    maquina: {
        while (!final) {

            var valido = false;

            for (var i = 0; i < transicoes.length; i++) {
                if (parseInt(transicoes[i].from) == parseInt(estadoAtual.id)) {
                    if (String(transicoes[i].read1) == String(input1[cabecote1])) {
                        if (String(transicoes[i].read2) == String(input2[cabecote2])) {
                            /*input1 = setCharAt(input1, cabecote1, transicoes[i].write1);
                            input2 = setCharAt(input2, cabecote2, transicoes[i].write2);*/
                            input1[cabecote1] = transicoes[i].write1;
                            input2[cabecote2] = transicoes[i].write2;

                            cabecote1 += parseInt(transicoes[i].move1);
                            cabecote2 += parseInt(transicoes[i].move2);

                            estadoAtual.id = parseInt(transicoes[i].to);
                            for (var j = 0; j < estados.length; j++) {
                                aux1 = 0;
                                if (parseInt(estados[j].id) == parseInt(estadoAtual.id)) {
                                    estadoAtual.indice = j;
                                }
                                else {
                                    aux1++;
                                    if (aux1 > 100) {
                                        break maquina;
                                    }
                                }
                            }

                            valido = true;
                            break;
                        }
                    }
                }
            }
            final = estados[estadoAtual.indice].estadoFinal;
            aux2++;
            if (aux2 >= 100) {
                break maquina;
            }
        }
    }
    
    console.log(input1);
    console.log(input2);
    
    if(final){
        console.log("Palavra Válida");
        mensagem('<p>Palavra Válida!</p><hr/>'+
        '<div class="row">'+
            '<div class="col-lg-6">'+
                '<strong><p>Fita 1</p></strong>'+
                input1 +
            '</div>'+
            '<div class="col-lg-6">'+
                '<strong><p>Fita 2</p></strong>'+
                input2 +
            '</div>'+
        '</div>', 
        'success');
    }else{
        console.log("Palavra Inválida");
        mensagem('<p>Palavra Inválida!</p><hr/>'+
        '<div class="row">'+
            '<div class="col-lg-6">'+
                '<strong><p>Fita 1</p></strong>'+
                input1 +
            '</div>'+
            '<div class="col-lg-6">'+
                '<strong><p>Fita 2</p></strong>'+
                input2 +
            '</div>'+
        '</div>', 
        'danger');
    }

    return;

    while (estados[estadoAtual.indice].estadoFinal === false) {

        var valido = false;

        var debug = '<a href="#" class="list-group-item">';

        debug += 'Input 1: ' + input1 + '<br>';
        debug += 'Cabeçote 1: ' + cabecote1 + '<br>';
        debug += 'Input 2: ' + input2 + '<br>';
        debug += 'Cabeçote 2: ' + cabecote2 + '<br>';
        debug += 'Estado atual: ' + estadoAtual.id + '<br>';

        for (var i = 0; i < transicoes.length; i++) {
            if (parseInt(transicoes[i].from) === parseInt(estadoAtual.id)) {
                if ((String(transicoes[i].read1) === String(input1[cabecote1]) &&
                        (String(transicoes[i].read2) === String(input2[cabecote2])))) {
                    //fita 1
                    debug += 'Lido na fita 1: ' + input1[cabecote1] + '<br>';
                    //input.splice(cabecote, 1, transicoes[i].write);
                    //nput1[cabecote1] = transicoes[i].write1;
                    input1.splice(cabecote1, 1, transicoes[i].write1);

                    debug += 'Escreve na fita 1: ' + input1[cabecote1] + '<br>';
                    debug += 'Movimento 1: ' + transicoes[i].move1 + '<br>';

                    cabecote1 += parseInt(transicoes[i].move1);

                    //fita 2
                    debug += 'Lido na fita 2: ' + input2[cabecote2] + '<br>';
                    //input2[cabecote2] = transicoes[i].write2;
                    input2.splice(cabecote2, 1, transicoes[i].write2);

                    debug += 'Escreve na fita 2: ' + input2[cabecote2] + '<br>';
                    debug += 'Movimento 2: ' + transicoes[i].move2 + '<br>';

                    cabecote2 += parseInt(transicoes[i].move2);

                    //altera o estado atual
                    estadoAtual.id = parseInt(transicoes[i].to);
                    for (var i = 0; i < estados.length; i++) {
                        if (parseInt(estados[i].id) == parseInt(estadoAtual.id)) {
                            estadoAtual.indice = i;
                        }
                        else {
                            console.log("deu ruim");
                        }
                    }

                    valido = true;
                    break;
                }
            }
        }
        if (valido === false) {
            //console.log("Transição não encontrada");
            break;
        }
        debug += '</a>';
        $("#debug").append(debug);

    }

    console.log(input1);
    console.log(input2);

    input1.pop();
    input2.pop();

    if (estados[estadoAtual.indice].estadoFinal) {
        console.log("Palavra Válida");
        mensagem("Palavra Válida! Valor final da fita: " + input1 + " - " + input2, "success");
    }
    else {
        console.log("Palavra Inválida");
        mensagem("Palavra Inválida! Valor final da fita: " + input1 + " - " + input2, "danger");
    }
}