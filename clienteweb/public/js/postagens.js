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

});
