 /**
 * Chamada ajax para realizar o cadastro de um procedimento
 * Realiza um submit no formulário, serializando os campos 
 */
 $("#add-procedure").submit(function (e) {
    e.preventDefault();
    //Endereço root da API
    let url = 'http://127.0.0.1:5000';
    $.ajax({
        url: url+"/aesthetic_procedure",
        method: 'POST',
        cache: false,
        data: $(this).serialize(),
        success: function (){
            resetInputFields()
            get_aesthetic_procedures();
            alert("Procedimento cadastrado com sucesso!")
        },
        error: function(){
            alert("Não foi possível realizar o cadastro, tente mais tarde!")
        }
    });
});

 
 /**
 * Função para limpar os campos do fomulário
 */
function resetInputFields(){
    //Percorre todos os campos do formulário e reseta cada um dos campos
    $("#add-procedure").each(function(){
        this.reset();
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