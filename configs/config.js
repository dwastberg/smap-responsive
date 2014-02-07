
var config = {
		
		ws: {
			"localhost": {
				proxy: "http://localhost/cgi-bin/proxy.py?url="
			},
			"xyz.malmo.se": {
				proxy: "http://xyz.malmo.se/myproxy/proxy.py?url="
			},
			"91.123.201.52": {
				proxy: "http://91.123.201.52/cgi-bin/proxy.py?url="
			}
		},
		
		ol: [
	    	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://geoserver.smap.se/geoserver/wms",
	    		 options: {
	    			 layerId: "gangstig",
	    			 displayName: "Gångstig",
	    			 layers: 'sandboxws:regisln',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: "<h3>${_displayName}</h3><p>Beläggning: ${belaggning}</p><p>${shape_leng}</p>"
	    		 }
		     },
		     {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://geoserver.smap.se/geoserver/wms",
	    		 options: {
	    			 layerId: "gangstig2",
	    			 displayName: "Gångstig2",
	    			 layers: 'sandboxws:regisln',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: "<h3>${_displayName}</h3><p>Beläggning: ${belaggning}</p><p>${shape_leng}</p>"
	    		 }
		     },
		     {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://geoserver.smap.se/geoserver/wms",
	    		 options: {
	    			 layerId: "cykelvag",
	    			 displayName: "Cykelväg",
	    			 layers: 'malmows:GK_CYKELVAG_L',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: "<h3>${_displayName}</h3><p>Typ: ${typ}</p><p>Geom: ${geom}</p>"
	    		 }
		     },
		     {
				  init: "L.GeoJSON.WFS2",
				  url: "http://geoserver.smap.se/geoserver/wfs",
				  options: {
					  layerId: "malmows_ulf_stadsdel",
					  displayName: "Stadsdel Malmö",
					  featureType: "malmows:ulf_stadsdel",
					  attribution: "Malmö stads WFS",
					  inputCrs: "EPSG:3008",
					  reverseAxis: true,
					  selectable: true,
					  popup: 'The FID: ${fid}'
			  		}
		     }
//		     ,
//		     {
//				  init: "L.GeoJSON.WFS2",
//				  url: "http://geoserver.smap.se/geoserver/wfs",
//				  options: {
//					  layerId: "intressepunkter",
//					  displayName: "Intressepunkter",
//					  featureType: "sandboxws:regispt",
//					  attribution: "Malmö stads WFS",
//					  inputCrs: "EPSG:3008",
//					  reverseAxis: true,
//					  popup: '<h1>${namn}</h1><p>En popup med en bild</p><img style="width:200px;max-height:200px;" src="${picture}"></img>',
//					  bigPopup: {
//						  headerHtml: "${namn}",
//						  srcVideo: '<video controls="controls" autoplay width="240" height="135">' +
//				        	   			'<source src="http://geoserver.smap.se/~cleber/regis1330/video/video_061.m4v" type="video/mp4" />' +
//				        	   			'<source src="http://geoserver.smap.se/~cleber/regis1330/video/video_061.webm" type="video/webm" />' +
//				        	   			'<source src="http://geoserver.smap.se/~cleber/regis1330/video/video_061.ogg" type="video/ogg" />' +
//			        	   			'</video>',
//			        	   	srcImage: '${pictures}',
//			        	   	srcAudio: '${video}'
//			        }
//		  		}
//		     }
		     ],
		     
		bl: [
  	 	{
			init: "L.TileLayer",
			url: "http://{s}.tile.cloudmade.com/f02f33a9158a425199542d3493b9189d/998/256/{z}/{x}/{y}.png",
			options: {
				layerId: "osm",
				displayName: "OSM",
			}
		},
		{
			init: "L.TileLayer.WMS",
			url: 'http://geoserver.smap.se/geoserver/gwc/service/wms',  // gwc/service/
			options: {
				layerId: "wms",
				displayName: "WMS",
				layers: "malmows:MALMO_SMA_DELOMR_P_3857_TEST2",
				format: 'image/png',
				subdomains: ["xyz"],
				transparent: true,
				minZoom: 1,
				maxZoom: 18,
				tiled: true
			}
		}
//	    {
//			init: "L.TileLayer",
//			url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//			options: {
//				layerId: "osm",
//				displayName: "OSM",
//				attribution: '<span>© OpenStreetMap contributors</span>&nbsp;|&nbsp;<span>Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"></span>',
//				maxZoom: 18
//			}
//		}
		],
		
		plugins: [
		           {
		        	   init: "L.Control.Scale",
		        	   options: {
		        		   imperial: false
		        	   }
		           },
		           {
		        	   init: "L.Control.LayerSwitcher",
		        	   options: {}
		           },
		           {
		        	   init: "L.Control.Geolocate",
		        	   options: {}
		           },
		           {
		        	   init: "L.Control.SelectWMS",
		        	   options: {
		        		   buffer: 5
		        	   }
		           }
       ]
		
		
};

// Set proxy for WFS
L.GeoJSON.WFS2.proxy = config.ws[document.domain].proxy;

// Set proxy for SelectWMS
L.Control.SelectWMS.proxy = config.ws[document.domain].proxy;