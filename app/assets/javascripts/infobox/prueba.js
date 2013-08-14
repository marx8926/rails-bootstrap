var markerLocalidad = [];
var markerDirecciones = [];
var infoArrWindow = [];
var infoArrWindowTemp = [];
var vInfoWindow = '';
var idle = false;
var map = null;

function start(){
    initMapa();   
}

function initMapa() {
	var latlng = new google.maps.LatLng(-8.097944,-79.03704479999999);
	var myOptions = {
		zoom: 14,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    map = new google.maps.Map(document.getElementById("mapa"), myOptions);
    google.maps.event.addListener(map, 'idle', function(){
    	if(idle==true)
        	cargarPA();
    });         
}

function cargarPA(){
    
    idle = true;
    
    var arrayPA=new Array();
    
    var boundsMap = map.getBounds(),      
    ne = boundsMap.getNorthEast(),
    sw = boundsMap.getSouthWest();

    if(map.getZoom()>13){
    	
    	var datos = getGlobalJSON("data");
    	//console.log(datos);
    	console.log('NE: '+ ne.lat() +' ' +ne.lng());
    	console.log('SW: '+ sw.lat() +' ' +sw.lng());
    	for(var k=0; k<datos.length;k++){
    		if(datos[k].latitud < ne.lat() && datos[k].latitud > sw.lat() && datos[k].longitud < ne.lng() && datos[k].longitud > sw.lng()){
    			//console.log(datos[k].latitud);
    			arrayPA.push(datos[k]);
    		}
    	}
    	console.log('Array length:' +arrayPA.length);
    	//console.log('Array 0:' +arrayPA[0].latitud);
    	if(arrayPA.length>0){
    		for(var i=0;i<arrayPA.length;i++){
    			icon = new google.maps.MarkerImage("https://dl.dropboxusercontent.com/u/67744385/home-2.png", new google.maps.Size(35,56),null,null);
    			ptosMarker(arrayPA[i], icon);
    		}
    	}
    	
    } else{
        
        while(markerDirecciones[0]){
        	markerDirecciones.pop().setMap(null);
        }
        
        while(infoArrWindowTemp[0]){
            infoArrWindowTemp.pop();
        }
        
    }
            
}

function ptosMarker(data, icon1){
    
    var latlng = new google.maps.LatLng(data.latitud, data.longitud),
    marker=new google.maps.Marker({
        position: latlng, 
        map: map,
        icon : icon1,
        title : 'Célula Nro ' + data.id + ' de la Red ' + data.id_red,
        zIndex: 1
    }); 
        
    markerDirecciones.push(marker);
    
    vInfoWindow = new InfoBox({
        disableAutoPan: false,
        maxWidth: 330,
        pixelOffset: new google.maps.Size(-140, -150),
        zIndex: 2,
        boxStyle: {
            opacity: 1,
            width: "250px"
        },
        closeBoxMargin: "10px 0px 2px -20px",
        closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
        infoBoxClearance: new google.maps.Size(1, 1)
    });
    
    vInfoWindow.setContent(createHTML(data));
    
    infoArrWindowTemp.push(vInfoWindow);
        
    google.maps.event.addListener(marker, 'click', function() {
           
        if(infoArrWindow.length>0){
            infoArrWindow.shift().close();
        }
                                    
        vInfoWindow.setContent(createHTML(data));
        vInfoWindow.open(map, marker);  
        map.panTo(latlng);
                             
        infoArrWindow.push(vInfoWindow);
            
    });
        
}

function createHTML(data){
    
    var wrap_contenedor;
    
    wrap_contenedor =  "<div id='wrap_infobox'>";
    wrap_contenedor += "<div id='content_infobox' class='infobox_celula'>";
    wrap_contenedor += "<div id='infobox_data'>";
    wrap_contenedor += "<p class='tit_infobox'><strong>Célula "+ data.id +' de la Red '+ data.id_red +"</strong></p>"; 
    wrap_contenedor += "<p>Teléfono: "+ data.telefono +"</p>";
    wrap_contenedor += "</div>";
    wrap_contenedor += "</div>";
    wrap_contenedor += "</div>";
    
    return wrap_contenedor;   
}

function buscarDireccion(ubigeo){
	if($('#departamento_lista').val()=='-1' || $('#departamento_lista').val()=='null' || $('#provincia_lista').val()=='-1' || $('#provincia_lista').val()=='null' || $('#distrito_lista').val()=='-1' || $('#distrito_lista').val()=='null'){
		alert('Debes marcar todos los campos de Ubicación para realizar una búsqueda');
		return;
	}
	if(ubigeo != null){
		posMarkerLocalidad(ubigeo.lat, ubigeo.long); 
                    
    }else {
    	alert('Ubicación no disponible');
    }
            
}
        
     
function posMarkerLocalidad(lat, lng){
    
    while(markerLocalidad[0]){
        markerLocalidad.pop().setMap(null);
    }
        
    map.setZoom(16);
    map.panTo(new google.maps.LatLng(lat, lng));
    
    var marker=new google.maps.Marker({
        title: 'Mi Direccion actual',
        icon : new google.maps.MarkerImage("https://dl.dropboxusercontent.com/u/67744385/male-2.png", new google.maps.Size(35,56),null,null),
        position: new google.maps.LatLng(lat, lng), 
        map: map
    });
    
    cargarPA();
    
    markerLocalidad.push(marker);
}

function setGlobalJSON(variable, json) {
	localStorage.setItem(variable, JSON.stringify(json));
}
function getGlobalJSON(variable) {
   return JSON.parse(localStorage.getItem(variable));
}
