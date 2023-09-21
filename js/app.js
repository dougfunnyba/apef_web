$(document).ready(function () {

    //Formatando datepicker pesquisa por data
    $("#search_date_scheduling").datepicker(
        {
            dateFormat: 'dd/mm/yy',
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        }
    );

    //Formatando datepicker
    $("#date_scheduling").datepicker(
        {
            dateFormat: 'dd/mm/yy',
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            minDate: new Date()
        }
    );

    /**
     * Função para carregar os médicos na combobox localizada no popup de
     * agendamento
     */
    get_doctors();

    /**
     * Função para carregar os procedimentos na combobox localizada no popup
     * de agendamento
     */
    get_aesthetic_procedures();

    /**
     * Função responsável por carregar a tabela de agendamentos
     * que esta localizada na tela do app
     */
    load_table_scheduling();
    
});

 /**
 * Chamada ajax para realizar um agendamento
 * Realiza um submit no formulário, serializando os campos 
 */
$("#add-scheduling").submit(function (e) {
    e.preventDefault();
    //Endereço root da API
    let url = 'http://127.0.0.1:5000';
    $.ajax({
        url: url+"/scheduling",
        method: 'POST',
        cache: false,
        data: $(this).serialize(),
        success: function (){
            resetInputFields()
            load_table_scheduling();
            alert("Agendamento realizado com sucesso!")
        },
        error: function(){
            alert("Não foi possível realizar o agendamento, tente mais tarde!")
        }
    });
});

 /**
 * Função usada no botão limpar da pesquisa
 * essa função alem de limpar o campo data da pesquisa ela realiza
 * uma busca por todos os agendamentos atravez da chamada da função
 * load_table_scheduling()
 */
$("#btn-search-clear").on('click', function(){
    $('#search_date_scheduling').val("");
    load_table_scheduling();
});

 /**
 * Função para pesquisar um agendamento pela data
 */
$("#btn-search-date").on('click', function(){
    let url = 'http://127.0.0.1:5000';
    let date_scheduling = $('#search_date_scheduling').val()
    //caso o campo de pesquisa data esteja vazio, faz uma conslta por 
    //todos os agendamentos cadastrados 
    if (date_scheduling == ""){
        load_table_scheduling();
    }else{
        $.ajax({
            method: "GET",
            dataType: 'json',
            url: url + "/schedulings_by_date?date_scheduling=" + date_scheduling,
            success: function(data){
                if (data.schedulings.length > 0){
                    let info = data.schedulings;
                    let columns = "";
                    for (let i = 0; i < info.length; i++) {
                        columns += "<tr>";
                        columns += "<td>" + info[i].patient_name + "</td>";
                        columns += "<td>" + info[i].doctor + "</td>";
                        columns += "<td>" + info[i].aesthetic_procedure + "</td>";
                        columns += "<td class='content-center'>" + info[i].date_scheduling + "</td>";
                        columns += "<td class='content-center'>" + info[i].hour_scheduling + "</td>";
                        columns += "<td class='content-center'><button class='btn btn-danger btn-sm delete' data-id='"+ info[i].id +"'>Deletar</button></td>";
                        columns += "</tr>";
                    }
                    $("#table-agendamentos tbody").empty();
                    $("#table-agendamentos tbody").append(columns);
                }else{
                    alert("Nenhum agendamento encontrado para a data: " + date_scheduling);
                    $("#table-agendamentos tbody").empty();
                }
            },
            error: function (ex) {
                if(ex.status == 0){
                    alert("Verifique o status da API.");
                }
            }
        });
    }
});

 /**
 * Função para deletar um agendamento
 */
$("#table-agendamentos").on('click','.delete', function(){
    //fazendo um teste de confirmação para exclusão do agendamento
    let result = confirm("Deseja realmente excluir o agendamento?");
    if (result == true) {
        let url = 'http://127.0.0.1:5000';
        let id = $(this).attr("data-id");
        $.ajax({
            method: "DELETE",
            url: url + "/scheduling?id=" + id,
            success: function(data){
                load_table_scheduling();
                alert(data.mesage);
            },
            error(){
                alert("Não foi possivel realizar a operação. ");
            }
        });
    }
 });

 /**
 * Função para limpar os campos do fomulário após o agendamento ser realizado
 */
function resetInputFields(){
    //Percorre todos os campos do formulário e reseta cada um dos campos
    $("#add-scheduling").each(function(){
        this.reset();
    });
}

/**
 * Função contendo chamada ajax para preenchimento da combobox de 
 * médicos esteticistas
 * Não recebe parametros
 * Retorna a lista de médicos esteticistas cadastrados no banco de dados
 * Popula a lista de médicos esteticistas 
 */
function get_doctors(){
    let url = 'http://127.0.0.1:5000';
    $.ajax({
        type: "GET",
        url: url+"/doctors",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (obj) {
            if (obj != null) {
                let data = obj.doctors;
                let selectbox = $('#doctor_id');
                selectbox.find('option').remove();
                selectbox.append('<option value="">Selecione</option>');
                $.each(data, function (i, d) {
                    selectbox.append('<option value="' + d.id+ '">' + d.name + '</option>');
                });
            }
        }
    });
}

/**
 * Função contendo chamada ajax para preenchimento da combobox 
 * de procedimentos
 * Não recebe parametros
 * Retorna a lista de procedimentos cadastrados no banco de dados
 * Popula a lista de procedimentos 
 */
function get_aesthetic_procedures(){
    let url = 'http://127.0.0.1:5000';
    $.ajax({
        type: "GET",
        url: url+"/aesthetic_procedures",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (obj) {
            if (obj != null) {
                let data = obj.aesthetic_procedures;
                let selectbox = $('#aesthetic_procedure_id');
                selectbox.find('option').remove();
                selectbox.append('<option value="">Selecione</option>');
                $.each(data, function (i, d) {
                    selectbox.append('<option value="' + d.id+ '">' + d.name + '</option>');
                });
            }
        }
    });
}

 /**
 * Função para carregar tabela de agendamentos
 */
function load_table_scheduling(){
    let url = 'http://127.0.0.1:5000';
    $.ajax({
        type: "GET",
        url: url + "/schedulings",
        dataType: 'json',
        success: function (data) {
            let info = data.schedulings;
            let columns = "";
            for (let i = 0; i < info.length; i++) {
                columns += "<tr>";
                columns += "<td>" + info[i].patient_name + "</td>";
                columns += "<td>" + info[i].doctor + "</td>";
                columns += "<td>" + info[i].aesthetic_procedure + "</td>";
                columns += "<td class='content-center'>" + info[i].date_scheduling + "</td>";
                columns += "<td class='content-center'>" + info[i].hour_scheduling + "</td>";
                columns += "<td class='content-center'><button class='btn btn-danger btn-sm delete' data-id='"+ info[i].id +"'>Deletar</button></td>";
                columns += "</tr>";
            }
            $("#table-agendamentos tbody").empty();
            $("#table-agendamentos tbody").append(columns);
        },
        error: function (ex) {
            if(ex.status == 0){
                alert("Verifique o status da API.");
            }
        }
    });
}