webpackJsonp([1],{"/Gyt":function(t,e){},"5W1q":function(t,e){},"5h6Y":function(t,e){},"7zck":function(t,e){},G1c0:function(t,e){},NHnr:function(t,e,a){"use strict";function n(t){a("Zn8a")}function s(t){a("/Gyt")}function i(t,e,a,n){var s=new jt({displayControlsDefault:!1,controls:{line_string:!0,trash:!0}});t.addControl(s),t.on("draw.create",function(){var t=s.getAll(),a=vt()(t);e.push(a),C.$emit("click-plots",e);o(t.features[0].geometry,"bathymetry_jetski",20,"2011-08-02","2011-09-02",a)})}function o(t,e,a,n,s,i){var o={polyline:t,dataset:e,begin_date:n,end_date:s,scale:a};new Headers;return console.log(e,vt()(o)),fetch("http://hydro-engine.appspot.com/get_raster_profile",{method:"POST",body:vt()(o),mode:"cors",headers:{"Content-Type":"application/json"}}).then(function(t){return t.json()}).then(function(t){return r(t,o,i),t})}function r(t,e,a){var n=document.getElementById("plot_"+a);n.innerHTML="";var s=Bokeh.Plotting,i=(e.begin_date,e.end_date,new Bokeh.GeoJSONDataSource({geojson:vt()(t)})),o=new s.figure({title:e.dataset,tools:"pan,crosshair,wheel_zoom,box_zoom,reset,save",width:400,height:200,background_fill_color:"#F2F2F7"}),r=new Bokeh.Line({x:{field:"distance"},y:{field:"b1_mean"},line_color:"#666699",line_width:2});o.add_glyph(r,i);var l=new Bokeh.Document;l.add_root(o),Bokeh.embed.add_document_standalone(l,n)}function l(t,e){c({dataset:"bathymetry_jetski",begin_date:"2011-08-01",end_date:"2011-09-01",step:30,interval:30,unit:"day"},t,e)}function c(t,e,a){return fetch("http://hydro-engine.appspot.com/get_image_urls",{method:"POST",body:vt()(t),mode:"cors",headers:{"Content-Type":"application/json"}}).then(function(t){return t.json()}).then(function(t){return d(t,e,a),t})}function d(t,e,a){var n={name:"Jetski",active:!1,icon:"landscape",data:[],type:"group"};_.each(t,function(t){var a=t.mapid,s=t.token,i=u(a,s),o={id:a,name:"jetski",type:"raster",active:!0,layout:{visibility:"visible"},source:{type:"raster",tiles:[i],tileSize:256}};e.addLayer(o),n.data.push(o)}),a.push(n),C.$emit("select-layers",a)}function u(t,e){var a=["https://earthengine.googleapis.com/map",t,"{z}","{x}","{y}"].join("/");return a+="?token="+e}function p(t,e){m({dataset:"bathymetry_lidar",begin_date:"2010-08-01",end_date:"2012-09-01",step:30,interval:30,unit:"day"},t,e)}function m(t,e,a){return fetch("http://hydro-engine.appspot.com/get_image_urls",{method:"POST",body:vt()(t),mode:"cors",headers:{"Content-Type":"application/json"}}).then(function(t){return t.json()}).then(function(t){return f(t,e,a),t})}function f(t,e,a){var n={name:"Lidar",active:!1,icon:"fa-plane",data:[],type:"group"};_.each(t,function(t){var a=t.mapid,s=t.token,i=h(a,s),o={id:a,name:"lidar",type:"raster",active:!0,layout:{visibility:"visible"},source:{type:"raster",tiles:[i],tileSize:256},paint:{}};e.addLayer(o),n.data.push(o)}),a.push(n),C.$emit("select-layers",a)}function h(t,e){var a=["https://earthengine.googleapis.com/map",t,"{z}","{x}","{y}"].join("/");return a+="?token="+e}function v(t,e){var a={id:"aeolian-layer",active:!0,visibility:"visible",name:"Aeolian",type:"circle",cursor:"pointer",icon:"grain",source:{type:"geojson",data:"/static/aeolian_data.geojson"},paint:{"circle-radius":{base:1.75,stops:[[12,2],[22,180]]},"circle-color":["match",["get","deploymentName"],"dn1","#fbb03b","dn2","#223b53","dn3","#e55e5e","dn4","#3bb2d0","dn5","#956a37","dn6","#8a5f2c","dn7","#815726","dn8","#724c20","dn9","#66451f","dn10","#2f1b02","dn11","#201503","dn67","#453c09","#ccc"]}};t.addLayer(a),e.push(a),C.$emit("select-layers",e)}function y(t,e){var a=t[0].unix(),n=t[1].unix(),s=["all",[">=","tStart",a],["<=","tEnd",n]];e.setFilter("aeolian-layer",s)}function g(t,e){var a=t.properties.deploymentName,n=t.properties.location_ID,s=it.a.unix(parseFloat(t.properties.timeEnd)),i=it.a.unix(parseFloat(t.properties.timeStart));fetch("https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/aeolian/aeolian_data_"+a+".json").then(function(t){return t.json()}).then(function(o){n=n,a=a,o=o,s=s.format("L"),i=i.format("L"),j(n,a,o,s,i,t,e)}).catch(function(t){console.warn(t)})}function j(t,e,a,n,s,i,o){if(null==a)return console.log("No timeseries defined"),-1;var r=document.getElementById(o);r.innerHTML="";var l=Bokeh.Plotting,c=a[e],d=$()(c),u=c[d[0]],p=u.length,m=[];_.each(u.slice(0,p),function(t){m.push(new Date(t))});for(var f=new l.figure({title:"Deployment: "+e+" Location: "+t+"\n Start deployment: "+s+" End deployment: "+n,tools:"pan,crosshair,wheel_zoom,box_zoom,reset,save",width:1e3,height:350,x_axis_type:"datetime",x_axis_label:"Time",y_axis_label:"Number of particles [-]",background_fill_color:"#F2F2F7"}),h=c[t],v=$()(h),y=["#666699","#66ff66","#ff6666"],g=0;g<v.length;g++){var j=function(t,e,a){return x[e]>0},b="height "+h[v[g]].height.toString()+" m",x=c[t][v[g]].particle_counts;x=x.slice(0,p);var w=m.filter(j),k=x.filter(j),D=new Bokeh.ColumnDataSource({data:{x:w,y:k}});f.line({field:"x"},{field:"y"},{source:D,legend:b,line_color:y[g],line_width:2})}f._legend.location="top_left";var z=new Bokeh.Document;z.add_root(f),Bokeh.embed.add_document_standalone(z,r)}function b(t,e){var a={active:!1,name:"Drifters",icon:"explore",id:"drifter-layer",visibility:"visible",type:"line",source:{type:"geojson",data:"https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/drifters/drifters.geojson"},paint:{"line-color":["get","color"],"line-width":{base:4,stops:[[12,2],[22,180]]}}};t.addLayer(a),e.push(a),C.$emit("select-layers",e)}function x(t,e){var a=t[0].unix(),n=t[1].unix(),s=["all",[">=","tStart",a],["<=","tEnd",n]];e.setFilter("drifter-layer",s)}function w(t,e){fetch("static/wind_data.json").then(function(t){return t.json()}).then(function(a){D(a,e,t),z(a)})}function k(t){fetch("https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/meteo/meteo_data_test1.json").then(function(t){return t.json()}).then(function(e){F("WindSpeed_Avg",document.getElementById(t[0]),e),F("RelHumidity_Avg",document.getElementById(t[1]),e)}).catch(function(t){console.warn(t)})}function D(t,e,a){var n=t.lat,s=t.lon,i={name:"Meteo",active:!1,visibility:"none",id:"meteo-layer",type:"raster",icon:"filter_drama",css:"",range:"",source:{type:"canvas",animate:!0,canvas:"windsock-canvas",coordinates:[[s-.003,n+.003],[s+.003,n+.003],[s+.003,n-.003],[s-.003,n-.003]]},paint:{}};a.addLayer(i),e.push(i),C.$emit("select-layers",e)}function z(t){function e(){var n=t.direc,s=t.aspeed[a],i=document.getElementById("windsock-canvas").getContext("2d"),o=100;i.clearRect(0,0,200,200),i.shadowColor="#333",i.shadowBlur=10,i.shadowOffsetX=5,i.shadowOffsetY=5,i.beginPath(),i.arc(o,o,10,0,2*Math.PI),i.fillStyle="black",i.fill(),i.closePath(),i.beginPath(),i.moveTo(80,80),i.lineTo(o,o),i.lineTo(120,80),i.stroke(),i.closePath();var r=[[0,80,70,40,10,"red"],[2,80,60,40,10,"white"],[4,80,50,40,10,"red"],[6,80,40,40,10,"white"],[8,80,30,40,10,"red"]],l=_.filter(r,function(t){var e=t[0];return s>e});_.each(l,function(t){i.beginPath(),i.fillStyle=t[5],i.rect(t[1],t[2],t[3],t[4]),i.fill(),i.closePath()}),i.translate(100,100),i.rotate(-(180-n[a-1])*(2*Math.PI/360)),i.rotate((180-n[a])*(2*Math.PI/360)),i.translate(-100,-100),a+=1;new Date(t.time[a]);requestAnimationFrame(e)}var a=0;e()}function F(t,e,a){var n=Bokeh.Plotting,s=a[t].slice(0,1e5);s=_.map(s,function(t){return-999==t?NaN:t});var i=[];_.each(a.time.slice(0,1e5),function(t){i.push(new Date(t))});var o=new Bokeh.ColumnDataSource({data:{x:i,y:s}}),r={};r.RelHumidity_Avg="Relative Humidity [%]",r.WindSpeed_Avg="Wind speed 44 m above surface [m/s]";var l=new n.figure({title:a[t].title,tools:"pan,crosshair,wheel_zoom,box_zoom,reset,save",width:1e3,height:350,x_axis_type:"datetime",x_axis_label:"Time",y_axis_label:r[t],background_fill_color:"#F2F2F7"});l.line({field:"x"},{field:"y"},{source:o,legend:t,line_color:"#666699",line_width:2});l._legend.location="top_left";var c=new Bokeh.Document;c.add_root(l),Bokeh.embed.add_document_standalone(c,e)}function M(t,e){var a={name:"Sediment distribution",active:!1,visibility:"None",icon:"grain",id:"measurements",type:"circle",source:{type:"geojson",data:"static/sediment_data.geojson"},range:"0  400",css:"height: 10px;       width: 80%;       margin-left: 10%;       text-align: justify;       padding-top: 10px;       background: linear-gradient(to right,       hsla(0, 100%, 50%, 0.5),       rgba(255, 255, 0, 0.5));",paint:{"circle-color":{base:1,type:"exponential",property:"D50",stops:[[0,"hsla(0, 100%, 50%, 0.5)"],[400,"rgba(255, 255, 0, 0.5)"]],default:"hsl(0, 0%, 0%)"},"circle-stroke-width":.5}};t.addLayer(a),e.push(a),C.$emit("select-layers",e),C.$emit("add-legend","test")}function P(t){a("G1c0")}Object.defineProperty(e,"__esModule",{value:!0});var B=a("7+uW"),E=a("3EgV"),S=a.n(E),L=a("fZjL"),$=a.n(L),C=new B.a,O=(a("uTBe"),a("M4fF")),q=a.n(O),T={name:"layer-control",props:{layers:{type:Array,required:!0},map:{type:Object}},data:function(){return{}},mounted:function(){console.log("mounted layer-control",this)},watch:{layers:{handler:function(t){this.toggleLayers()},deep:!0}},methods:{toggleLayers:function(){var t=this;console.log("toggling with map",this,this.map,this.layers),q.a.isNil(this.map)||q.a.each(this.layers,function(e){var a="none";e.active&&(a="visible"),"group"===e.type?q.a.each(e.data,function(e){t.map.setLayoutProperty(e.id,"visibility",a)}):t.map.setLayoutProperty(e.id,"visibility",a)})}}},I=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"layer-control"},t._l(t.layers,function(e){return a("v-list",{key:e.id,attrs:{dense:"","pt-0":""}},[a("v-list-tile",[a("v-list-tile-action",[a("v-switch",{model:{value:e.active,callback:function(a){t.$set(e,"active",a)},expression:"layer.active"}})],1),t._v(" "),a("v-list-tile-title",[t._v(t._s(e.name))]),t._v(" "),a("v-list-tile-action",[a("v-icon",[t._v(t._s(e.icon))])],1)],1),t._v(" "),a("v-list-tile",[a("div",{staticClass:"bar",style:e.css}),t._v(" "),a("div",{staticClass:"bartext"},[t._v(t._s(e.range)+" "),a("span")])])],1)}))},N=[],R={render:I,staticRenderFns:N},A=R,H=a("VU/8"),U=H(T,A,!1,null,null,null),V=U.exports,Y=a("d7EF"),W=a.n(Y),X={name:"morphology-canvas",data:function(){return{baseUrl:"https://s3-eu-west-1.amazonaws.com/deltares-opendata/zandmotor/morphology/jetski",meta:null,map:null}},mounted:function(){var t=this;fetch(this.baseUrl+"/meta.json").then(function(t){return t.json()}).then(function(e){t.meta=e,B.a.nextTick(function(){q.a.each(t.meta,function(e,a){var n="#morphology-"+a,s=t.$el.querySelector(n),i=s.children,o=W()(i,3),r=o[0],l=o[1],c=o[2];e.width=500,e.height=625,e.video=r,e.source=l,e.dest=c,e.ctxSrc=l.getContext("2d"),e.ctxDest=c.getContext("2d"),e.id="morphology-canvas-"+a;var d={name:"Jetski-"+a,active:!1,visibility:"none",id:e.id,type:"raster",icon:"filter_drama",source:{type:"canvas",animate:!0,canvas:e.id,coordinates:[[e.extent[0],e.extent[1]],[e.extent[2],e.extent[1]],[e.extent[2],e.extent[3]],[e.extent[0],e.extent[3]]]},paint:{}};e.layer=d,console.log("layer",d),t.publishLayers()}),t.animate()})})},methods:{deferredMountedTo:function(t){this.map=t,this.publishLayers()},animate:function(){requestAnimationFrame(this.animate),q.a.each(this.meta,function(t){t.ctxSrc.drawImage(t.video,0,0,t.width,2*t.height);for(var e=t.width*t.height,a=t.ctxSrc.getImageData(0,0,t.width,2*t.height),n=0;n<e;n++){var s=(a.data[4*n+0],a.data[4*n+1],a.data[4*n+2],a.data[4*n+4*e]>100?0:255);a.data[4*n+3]=s}t.ctxDest.putImageData(a,0,0)})},publishLayers:function(){var t=this;null!=this.map&&q.a.each(this.meta,function(e){t.map.addLayer(e.layer),C.$emit("add-layer",e.layer)})}}},G=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"hidden"},t._l(t.meta,function(e,n){return a("div",{attrs:{id:"morphology-"+n}},[a("video",{staticClass:"hidden",attrs:{width:500,height:1250,src:t.baseUrl+"/"+e.mp4,autoplay:"",loop:"",crossorigin:"anonymous"}}),t._v(" "),a("canvas",{staticClass:"source hidden",attrs:{width:500,height:1250}}),t._v(" "),a("canvas",{staticClass:"dest",attrs:{width:500,height:625,id:"morphology-canvas-"+n}})])}))},J=[],Z={render:G,staticRenderFns:J},K=Z,Q=a("VU/8"),tt=n,et=Q(X,K,!1,tt,"data-v-e38d90c0",null),at=(et.exports,a("7t+N")),nt=a.n(at),st=a("PJh5"),it=a.n(st),ot=(a("w+/p"),a("5W1q"),{name:"time-slider",props:{extent:{type:Array,default:function(){var t=it()();return[it()("20110301","YYYYMMDD"),t]}}},data:function(){return{configDialog:!1,startDateMenu:!1,endDateMenu:!1,startDate:this.extent[0].format("Y-MM-DD"),endDate:this.extent[1].format("Y-MM-DD"),loopDuration:20,maxFps:10,last:null,loop:!0,state:"paused",slider:null}},mounted:function(){var t=this;B.a.nextTick(function(){var e=t.$el.querySelector("input.slider");nt()(e).ionRangeSlider({type:"double",drag_interval:!0,min:0,max:1,step:.001,grid:!1,hide_min_max:!0,onFinish:function(e){t.$emit("time-extent-update",t.currentExtent)},onUpdate:function(e){t.$emit("time-extent-update",t.currentExtent)},prettify:function(e){return t.dateFormat(e)}}),t.slider=nt()(e).data("ionRangeSlider"),t.step()})},watch:{extent:function(t){this.slider.dragging||this.slider.update({from:0,to:1})}},methods:{pause:function(){this.state="paused"},play:function(){this.last=performance.now(),this.state="playing"},step:function(t){if(requestAnimationFrame(this.step),!this.last)return void(this.last=t);if("playing"===this.state){var e=(t-this.last)/1e3;if(!(e<1/this.maxFps)){var a=e/this.loopDuration,n={from:q.a.clamp(this.slider.result.from+a,0,1),to:q.a.clamp(this.slider.result.to+a,0,1)};if(1==n.to){if(!this.loop)return;n.to=n.to-n.from,n.from=0}this.slider.update(n),this.last=t}}},dateByFraction:function(t){var e=it()(this.startDate),a=it()(this.endDate),n=a.diff(e);return e.clone().add(n*t,"ms")},dateFormat:function(t){return this.dateByFraction(t).format("Y-MM-DD")},deferredMountedTo:function(t){}},computed:{currentTime:function(){return this.dateByFraction(this.slider.result.to)},currentExtent:function(){return[this.dateByFraction(this.slider.result.from),this.dateByFraction(this.slider.result.to)]},allowedDates:function(){return{min:this.extent[0].format("Y-MM-DD"),max:this.extent[1].format("Y-MM-DD")}}}}),rt=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-toolbar",{staticClass:"time-slider",attrs:{color:"white",floating:"",dense:"",role:"slider"}},[a("div",{staticClass:"time-slider-wrapper"},[a("input",{staticClass:"slider",attrs:{type:"text",name:"slider",value:""}})]),t._v(" "),a("v-btn-toggle",{attrs:{mandatory:""},model:{value:t.state,callback:function(e){t.state=e},expression:"state"}},[a("v-btn",{attrs:{value:"playing",flat:""},on:{click:function(e){e.stopPropagation(),t.play(e)}}},[a("v-icon",[t._v("fa-play")])],1),t._v(" "),a("v-btn",{attrs:{value:"paused",flat:""},on:{click:function(e){e.stopPropagation(),t.pause(e)}}},[a("v-icon",[t._v("fa-pause")])],1)],1),t._v(" "),a("v-btn-toggle",{model:{value:t.loop,callback:function(e){t.loop=e},expression:"loop"}},[a("v-btn",{attrs:{value:!0,flat:""}},[a("v-icon",[t._v("fa-repeat")])],1)],1),t._v(" "),a("v-btn",{attrs:{icon:"",flat:""},on:{click:function(e){e.stopPropagation(),t.configDialog=!0}}},[a("v-icon",[t._v("fa-gear")])],1),t._v(" "),a("v-dialog",{attrs:{"max-width":"500px"},model:{value:t.configDialog,callback:function(e){t.configDialog=e},expression:"configDialog"}},[a("v-card",[a("v-card-text",[a("v-menu",{ref:"startDateMenu",attrs:{lazy:"","close-on-content-click":!1,transition:"scale-transition","offset-y":"","full-width":"","return-value":t.startDate},on:{"update:returnValue":function(e){t.startDate=e}},model:{value:t.startDateMenu,callback:function(e){t.startDateMenu=e},expression:"startDateMenu"}},[a("v-text-field",{attrs:{slot:"activator",label:"Picker in menu","prepend-icon":"event",readonly:""},slot:"activator",model:{value:t.startDate,callback:function(e){t.startDate=e},expression:"startDate"}}),t._v(" "),a("v-date-picker",{attrs:{"allowed-dates":t.allowedDates,"no-title":"",scrollable:""},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.save,s=e.cancel;return[a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{flat:"",color:"primary"},on:{click:s}},[t._v("Cancel")]),t._v(" "),a("v-btn",{attrs:{flat:"",color:"primary"},on:{click:n}},[t._v("OK")])],1)]}}]),model:{value:t.startDate,callback:function(e){t.startDate=e},expression:"startDate"}})],1),t._v(" "),a("v-menu",{ref:"endDateMenu",attrs:{lazy:"","close-on-content-click":!1,transition:"scale-transition","offset-y":"","full-width":"","return-value":t.endDate},on:{"update:returnValue":function(e){t.endDate=e}},model:{value:t.endDateMenu,callback:function(e){t.endDateMenu=e},expression:"endDateMenu"}},[a("v-text-field",{attrs:{slot:"activator",label:"Picker in menu","prepend-icon":"event",readonly:""},slot:"activator",model:{value:t.endDate,callback:function(e){t.endDate=e},expression:"endDate"}}),t._v(" "),a("v-date-picker",{attrs:{"allowed-dates":t.allowedDates,"no-title":"",scrollable:""},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.save,s=e.cancel;return[a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{flat:"",color:"primary"},on:{click:s}},[t._v("Cancel")]),t._v(" "),a("v-btn",{attrs:{flat:"",color:"primary"},on:{click:n}},[t._v("OK")])],1)]}}]),model:{value:t.endDate,callback:function(e){t.endDate=e},expression:"endDate"}})],1)],1),t._v(" "),a("v-card-actions",[a("v-btn",{attrs:{flat:"",color:"primary"},on:{click:function(e){e.stopPropagation(),t.configDialog=!1}}},[t._v("Close")])],1)],1)],1)],1)},lt=[],ct={render:rt,staticRenderFns:lt},dt=ct,ut=a("VU/8"),pt=s,mt=ut(ot,dt,!1,pt,null,null),ft=mt.exports,ht=a("mvHQ"),vt=a.n(ht),yt=a("5BM0"),gt=a.n(yt),jt=a("uZ0T");a("5h6Y");B.a.use(gt.a);var _t=(a("1e2d"),{name:"app",data:function(){return{map:null,drawer:!1,fixed:!1,showSettings:!1,items:[{icon:"bubble_chart",title:"Inspire"}],layers:[],jsondata:"None",msg:"",timeExtent:null,plots:[]}},mounted:function(){var t=this;C.$on("select-layers",function(e){B.a.set(t,"layers",e)}),C.$on("add-layer",function(e){t.layers.push(e)}),C.$on("click-plots",function(e){B.a.set(t,"plots",e)}),C.$on("map-loaded",function(e){B.a.set(t,"map",e.target)}),this.$refs.timeslider.$on("time-extent-update",function(e){t.timeExtent=e;for(var a=[],n=0;n<t.layers.length;n++)t.layers[n].active&&a.push(t.layers[n].id);a.indexOf("drifter-layer")>-1&&x(t.timeExtent,t.$refs.map.map),a.indexOf("aeolian-layer")>-1&&y(t.timeExtent,t.$refs.map.map);for(var s=$()(Bokeh.index),i=1e3*t.timeExtent[0].unix(),o=1e3*t.timeExtent[1].unix(),n=0;n<s.length;n++)Bokeh.index[s[n]].model.x_range.set({start:i,end:o})}),this.$refs.map.$on("mb-load",function(e){C.$emit("map-loaded",e),i(t.$refs.map.map,t.plots,"bathymetry_jetski",t.layers),w(t.$refs.map.map,t.layers),M(t.$refs.map.map,t.layers),v(t.$refs.map.map,t.layers),b(t.$refs.map.map,t.layers),l(t.$refs.map.map,t.layers),p(t.$refs.map.map,t.layers),t.map.on("mousemove",function(e){t.$refs.map.map.getCanvas().style.cursor="",void 0!==t.map.queryRenderedFeatures(e.point)[0]&&(t.$refs.map.map.getCanvas().style.cursor="pointer")}),t.map.on("click",function(e){var a=e.lngLat.lng,n=e.lngLat.lat;if("visible"===t.map.getLayer("meteo-layer").visibility){var s=t.layers.find(function(t){return"meteo-layer"===t.id}),i=s.source.coordinates[0][0],o=s.source.coordinates[1][0],r=s.source.coordinates[2][1],l=s.source.coordinates[0][1];if(a<=o&&n<=l&&a>=i&&n>=r){var c=[],d=["Barometer_Avg","WindSpeed_Avg","RelHumidity_Avg"];_.each(d,function(e){t.plots.push(e),c.push("plot_"+e),C.$emit("click-plots",t.plots)}),k(c)}}var u=t.map.queryRenderedFeatures(e.point);_.each(u,function(e){if("Morphology"==e.layer.id){var a=e.properties.id;t.plots.push(a),C.$emit("click-plots",t.plots)}else if("aeolian-layer"==e.layer.id){var a="Particle_"+e.properties.location_ID;t.plots.push(a),C.$emit("click-plots",t.plots),g(e,"plot_"+a)}})})})},methods:{removePlot:function(t){var e=this.plots.indexOf(t);this.plots.splice(e,1),C.$emit("click-plots",this.plots)}},components:{"layer-control":V,"time-slider":ft}}),bt=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-app",[a("v-navigation-drawer",{attrs:{fixed:"",app:""},model:{value:t.drawer,callback:function(e){t.drawer=e},expression:"drawer"}},[a("v-toolbar",{attrs:{flat:""}},[a("v-list",[a("v-list-tile",[a("v-list-tile-title",{staticClass:"title"},[t._v("\n            Layers\n          ")])],1)],1)],1),t._v(" "),a("layer-control",{attrs:{layers:t.layers,map:t.map}})],1),t._v(" "),a("v-toolbar",{attrs:{light:"",app:"","clipped-left":"",fixed:""}},[a("v-toolbar-title",{staticClass:"ml-0 pl-3"},[a("v-toolbar-side-icon",{on:{click:function(e){e.stopPropagation(),t.drawer=!t.drawer}}}),t._v("\n      Zandmotor data\n    ")],1),t._v(" "),a("v-spacer"),t._v(" "),a("v-btn",{attrs:{icon:"",large:""}},[a("v-avatar",{attrs:{size:"32px",tile:""}},[a("img",{attrs:{src:"http://www.dezandmotor.nl/assets/images/logo-de-zandmotor.png",alt:"Logo"}})])],1)],1),t._v(" "),a("v-content",[a("v-container",{attrs:{fluid:"","fill-height":""}},[a("v-layout",{attrs:{fluid:"",row:"",wrap:"","justify-space-between":""}},[a("v-flex",{attrs:{sm12:"","mb-2":""}},[a("v-card",{attrs:{id:"map"}},[a("v-card-text",[a("v-mapbox",{ref:"map",attrs:{"access-token":"pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA","map-style":"mapbox://styles/mapbox/satellite-streets-v10",center:[4.186,52.05],zoom:13.16,pitch:5,bearing:-0,"min-zoom":5,id:"map"}},[a("canvas",{attrs:{id:"windsock-canvas",width:"200",height:"200"}}),t._v(" "),a("time-slider",{ref:"timeslider"})],1)],1)],1)],1),t._v(" "),t._l(t.plots,function(e){return a("v-card",{key:e,staticClass:"mb-1 mr-1",attrs:{id:"card_"+e}},[a("v-card-actions",[a("v-btn",{attrs:{flat:"",icon:""},on:{click:function(a){t.removePlot(e,a)}}},[a("v-icon",[t._v("close")])],1)],1),t._v(" "),a("v-card-text",[a("div",{staticClass:"plot-container bk-root",attrs:{id:"plot_"+e}})])],1)})],2)],1)],1)],1)},xt=[],wt={render:bt,staticRenderFns:xt},kt=wt,Dt=a("VU/8"),zt=P,Ft=Dt(_t,kt,!1,zt,null,null),Mt=Ft.exports;a("7zck");B.a.use(gt.a),B.a.use(S.a),B.a.config.productionTip=!1,new B.a({el:"#app",template:"<App/>",components:{App:Mt}})},Zn8a:function(t,e){},uTBe:function(t,e){},uslO:function(t,e,a){function n(t){return a(s(t))}function s(t){var e=i[t];if(!(e+1))throw new Error("Cannot find module '"+t+"'.");return e}var i={"./af":"3CJN","./af.js":"3CJN","./ar":"3MVc","./ar-dz":"tkWw","./ar-dz.js":"tkWw","./ar-kw":"j8cJ","./ar-kw.js":"j8cJ","./ar-ly":"wPpW","./ar-ly.js":"wPpW","./ar-ma":"dURR","./ar-ma.js":"dURR","./ar-sa":"7OnE","./ar-sa.js":"7OnE","./ar-tn":"BEem","./ar-tn.js":"BEem","./ar.js":"3MVc","./az":"eHwN","./az.js":"eHwN","./be":"3hfc","./be.js":"3hfc","./bg":"lOED","./bg.js":"lOED","./bm":"hng5","./bm.js":"hng5","./bn":"aM0x","./bn.js":"aM0x","./bo":"w2Hs","./bo.js":"w2Hs","./br":"OSsP","./br.js":"OSsP","./bs":"aqvp","./bs.js":"aqvp","./ca":"wIgY","./ca.js":"wIgY","./cs":"ssxj","./cs.js":"ssxj","./cv":"N3vo","./cv.js":"N3vo","./cy":"ZFGz","./cy.js":"ZFGz","./da":"YBA/","./da.js":"YBA/","./de":"DOkx","./de-at":"8v14","./de-at.js":"8v14","./de-ch":"Frex","./de-ch.js":"Frex","./de.js":"DOkx","./dv":"rIuo","./dv.js":"rIuo","./el":"CFqe","./el.js":"CFqe","./en-au":"Sjoy","./en-au.js":"Sjoy","./en-ca":"Tqun","./en-ca.js":"Tqun","./en-gb":"hPuz","./en-gb.js":"hPuz","./en-ie":"ALEw","./en-ie.js":"ALEw","./en-nz":"dyB6","./en-nz.js":"dyB6","./eo":"Nd3h","./eo.js":"Nd3h","./es":"LT9G","./es-do":"7MHZ","./es-do.js":"7MHZ","./es-us":"INcR","./es-us.js":"INcR","./es.js":"LT9G","./et":"XlWM","./et.js":"XlWM","./eu":"sqLM","./eu.js":"sqLM","./fa":"2pmY","./fa.js":"2pmY","./fi":"nS2h","./fi.js":"nS2h","./fo":"OVPi","./fo.js":"OVPi","./fr":"tzHd","./fr-ca":"bXQP","./fr-ca.js":"bXQP","./fr-ch":"VK9h","./fr-ch.js":"VK9h","./fr.js":"tzHd","./fy":"g7KF","./fy.js":"g7KF","./gd":"nLOz","./gd.js":"nLOz","./gl":"FuaP","./gl.js":"FuaP","./gom-latn":"+27R","./gom-latn.js":"+27R","./gu":"rtsW","./gu.js":"rtsW","./he":"Nzt2","./he.js":"Nzt2","./hi":"ETHv","./hi.js":"ETHv","./hr":"V4qH","./hr.js":"V4qH","./hu":"xne+","./hu.js":"xne+","./hy-am":"GrS7","./hy-am.js":"GrS7","./id":"yRTJ","./id.js":"yRTJ","./is":"upln","./is.js":"upln","./it":"FKXc","./it.js":"FKXc","./ja":"ORgI","./ja.js":"ORgI","./jv":"JwiF","./jv.js":"JwiF","./ka":"RnJI","./ka.js":"RnJI","./kk":"j+vx","./kk.js":"j+vx","./km":"5j66","./km.js":"5j66","./kn":"gEQe","./kn.js":"gEQe","./ko":"eBB/","./ko.js":"eBB/","./ky":"6cf8","./ky.js":"6cf8","./lb":"z3hR","./lb.js":"z3hR","./lo":"nE8X","./lo.js":"nE8X","./lt":"/6P1","./lt.js":"/6P1","./lv":"jxEH","./lv.js":"jxEH","./me":"svD2","./me.js":"svD2","./mi":"gEU3","./mi.js":"gEU3","./mk":"Ab7C","./mk.js":"Ab7C","./ml":"oo1B","./ml.js":"oo1B","./mr":"5vPg","./mr.js":"5vPg","./ms":"ooba","./ms-my":"G++c","./ms-my.js":"G++c","./ms.js":"ooba","./mt":"oCzW","./mt.js":"oCzW","./my":"F+2e","./my.js":"F+2e","./nb":"FlzV","./nb.js":"FlzV","./ne":"/mhn","./ne.js":"/mhn","./nl":"3K28","./nl-be":"Bp2f","./nl-be.js":"Bp2f","./nl.js":"3K28","./nn":"C7av","./nn.js":"C7av","./pa-in":"pfs9","./pa-in.js":"pfs9","./pl":"7LV+","./pl.js":"7LV+","./pt":"ZoSI","./pt-br":"AoDM","./pt-br.js":"AoDM","./pt.js":"ZoSI","./ro":"wT5f","./ro.js":"wT5f","./ru":"ulq9","./ru.js":"ulq9","./sd":"fW1y","./sd.js":"fW1y","./se":"5Omq","./se.js":"5Omq","./si":"Lgqo","./si.js":"Lgqo","./sk":"OUMt","./sk.js":"OUMt","./sl":"2s1U","./sl.js":"2s1U","./sq":"V0td","./sq.js":"V0td","./sr":"f4W3","./sr-cyrl":"c1x4","./sr-cyrl.js":"c1x4","./sr.js":"f4W3","./ss":"7Q8x","./ss.js":"7Q8x","./sv":"Fpqq","./sv.js":"Fpqq","./sw":"DSXN","./sw.js":"DSXN","./ta":"+7/x","./ta.js":"+7/x","./te":"Nlnz","./te.js":"Nlnz","./tet":"gUgh","./tet.js":"gUgh","./th":"XzD+","./th.js":"XzD+","./tl-ph":"3LKG","./tl-ph.js":"3LKG","./tlh":"m7yE","./tlh.js":"m7yE","./tr":"k+5o","./tr.js":"k+5o","./tzl":"iNtv","./tzl.js":"iNtv","./tzm":"FRPF","./tzm-latn":"krPU","./tzm-latn.js":"krPU","./tzm.js":"FRPF","./uk":"ntHu","./uk.js":"ntHu","./ur":"uSe8","./ur.js":"uSe8","./uz":"XU1s","./uz-latn":"/bsm","./uz-latn.js":"/bsm","./uz.js":"XU1s","./vi":"0X8Q","./vi.js":"0X8Q","./x-pseudo":"e/KL","./x-pseudo.js":"e/KL","./yo":"YXlc","./yo.js":"YXlc","./zh-cn":"Vz2w","./zh-cn.js":"Vz2w","./zh-hk":"ZUyn","./zh-hk.js":"ZUyn","./zh-tw":"BbgG","./zh-tw.js":"BbgG"};n.keys=function(){return Object.keys(i)},n.resolve=s,t.exports=n,n.id="uslO"}},["NHnr"]);
//# sourceMappingURL=app.41692325fe67f3ddaef8.js.map