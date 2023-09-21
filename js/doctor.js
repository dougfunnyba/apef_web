 /**
 * Chamada ajax para realizar o cadastro de um médico
 * Realiza um submit no formulário, serializando os campos 
 */
$("#add-doctor").submit(function (e) {
    e.preventDefault();
    //Endereço root da API
    let url = 'http://127.0.0.1:5000';
    $.ajax({
        url: url+"/doctor",
        method: 'POST',
        cache: false,
        data: $(this).serialize(),
        success: function (){
            reset_input_fields_doctor()
            get_doctors();
            alert("Médico cadastrado com sucesso!")
        },
        error: function(){
            alert("Não foi possível realizar o cadastro, tente mais tarde!")
        }
    });
});

 
 /**
 * Função para limpar os campos do fomulário
 */
function reset_input_fields_doctor(){
    //Percorre todos os campos do formulário e reseta cada um dos campos
    $("#add-doctor").each(function(){
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
