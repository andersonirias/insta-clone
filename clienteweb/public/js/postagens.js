$(document).ready(function(){
		  
  function carrega_postagens(){				
		  
    var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://localhost:9090/api");

	xhr.onload = function(){
				
	  if(xhr.status === 200){
				  
        var data = $.parseJSON(xhr.responseText);
							
	    for(i = 0; i < data.length; i++){

		  $('#container_timeline').append(
		    '<div class="publicacao">'+
			  '<span class="titulo">' + 
			    data[i].titulo + 
			  '</span>' +
			  '<center><img class="img-responsive" src="http://localhost:9090/imagens/'+data[i].url_imagem+'" /></center>'+
			  '<div class="comentarios" id="comentarios_'+data[i]._id+'"></div>'+
		    '</div>'
		  );

	    }

	  }
			  
    }

    xhr.send();					
	
  }

  carrega_postagens();
  
  $('#btn_incluir').click(function(){
	  
    $('#container_timeline').hide();
	$('#container_form').show();
	
  });

  $('#btn-cancelar-publicacao').click(function(){
	  
    $('#container_timeline').show();
	$('#container_form').hide();
	return false;
	
  });

  $('#btn-publicar').click(function(){

    var formData = new FormData();

	var arquivo = document.getElementById("arquivo").files[0];
	var titulo = document.getElementById("titulo").value;

	formData.append("arquivo", arquivo);
	formData.append("titulo", titulo);

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function(){
		
	  if(xhr.readyState == 4){
		  
	    var resposta = JSON.parse(xhr.responseText);
        document.getElementById('mensagem').innerHTML = resposta.status;
		$("#myModal").modal("show");
		
      }

    }
	
	xhr.open("POST", "http://localhost:9090/api");
	xhr.send(formData);

   });

});
