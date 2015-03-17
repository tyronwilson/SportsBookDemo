/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

var browser=null;
if(typeof (ActiveXObject)!="undefined"){
if(navigator.userAgent.indexOf("MSIE 10")!=-1){
browser="chrome";
}else{
browser="ie";
}
}else{
if(navigator.userAgent.indexOf("Trident/7")!=-1&&navigator.userAgent.indexOf("rv:11")!=-1){
browser="chrome";
}else{
if(Object.prototype.toString.call(window.opera)=="[object Opera]"){
browser="opera";
}else{
if(navigator.vendor.indexOf("Apple")!=-1){
browser="safari";
if(navigator.userAgent.indexOf("iPad")!=-1||navigator.userAgent.indexOf("iPhone")!=-1){
browser.ios=true;
}
}else{
if(navigator.vendor.indexOf("Google")!=-1){
if(navigator.userAgent.indexOf("Android")!=-1){
browser="android";
}else{
browser="chrome";
}
}else{
if(navigator.product=="Gecko"&&window.find&&!navigator.savePreferences){
browser="firefox";
}else{
throw new Error("couldn't detect browser");
}
}
}
}
}
}
switch(browser){
case "ie":
(function(){
if(document.createEvent===undefined){
var _1=function(){
};
_1.prototype.initEvent=function(_2,_3,_4){
this.type=_2;
this.bubbles=_3;
this.cancelable=_4;
};
document.createEvent=function(_5){
if(_5!="Events"){
throw new Error("Unsupported event name: "+_5);
}
return new _1();
};
}
document._w_3_c_d_o_m_e_v_e_n_t_s_createElement=document.createElement;
document.createElement=function(_6){
var _7=this._w_3_c_d_o_m_e_v_e_n_t_s_createElement(_6);
if(_7.addEventListener===undefined){
var _8={};
_7.addEventListener=function(_9,_a,_b){
_7.attachEvent("on"+_9,_a);
return addEventListener(_8,_9,_a,_b);
};
_7.removeEventListener=function(_c,_d,_e){
return removeEventListener(_8,_c,_d,_e);
};
_7.dispatchEvent=function(_f){
return dispatchEvent(_8,_f);
};
}
return _7;
};
if(window.addEventListener===undefined){
var _10=document.createElement("div");
var _11=(typeof (postMessage)==="undefined");
window.addEventListener=function(_12,_13,_14){
if(_11&&_12=="message"){
_10.addEventListener(_12,_13,_14);
}else{
window.attachEvent("on"+_12,_13);
}
};
window.removeEventListener=function(_15,_16,_17){
if(_11&&_15=="message"){
_10.removeEventListener(_15,_16,_17);
}else{
window.detachEvent("on"+_15,_16);
}
};
window.dispatchEvent=function(_18){
if(_11&&_18.type=="message"){
_10.dispatchEvent(_18);
}else{
window.fireEvent("on"+_18.type,_18);
}
};
}
function addEventListener(_19,_1a,_1b,_1c){
if(_1c){
throw new Error("Not implemented");
}
var _1d=_19[_1a]||{};
_19[_1a]=_1d;
_1d[_1b]=_1b;
};
function removeEventListener(_1e,_1f,_20,_21){
if(_21){
throw new Error("Not implemented");
}
var _22=_1e[_1f]||{};
delete _22[_20];
};
function dispatchEvent(_23,_24){
var _25=_24.type;
var _26=_23[_25]||{};
for(var key in _26){
if(_26.hasOwnProperty(key)&&typeof (_26[key])=="function"){
try{
_26[key](_24);
}
catch(e){
}
}
}
};
})();
break;
case "chrome":
case "android":
case "safari":
if(typeof (window.postMessage)==="undefined"&&typeof (window.dispatchEvent)==="undefined"&&typeof (document.dispatchEvent)==="function"){
window.dispatchEvent=function(_28){
document.dispatchEvent(_28);
};
var addEventListener0=window.addEventListener;
window.addEventListener=function(_29,_2a,_2b){
if(_29==="message"){
document.addEventListener(_29,_2a,_2b);
}else{
addEventListener0.call(window,_29,_2a,_2b);
}
};
var removeEventListener0=window.removeEventListener;
window.removeEventListener=function(_2c,_2d,_2e){
if(_2c==="message"){
document.removeEventListener(_2c,_2d,_2e);
}else{
removeEventListener0.call(window,_2c,_2d,_2e);
}
};
}
break;
case "opera":
var addEventListener0=window.addEventListener;
window.addEventListener=function(_2f,_30,_31){
var _32=_30;
if(_2f==="message"){
_32=function(_33){
if(_33.origin===undefined&&_33.uri!==undefined){
var uri=new URI(_33.uri);
delete uri.path;
delete uri.query;
delete uri.fragment;
_33.origin=uri.toString();
}
return _30(_33);
};
_30._$=_32;
}
addEventListener0.call(window,_2f,_32,_31);
};
var removeEventListener0=window.removeEventListener;
window.removeEventListener=function(_35,_36,_37){
var _38=_36;
if(_35==="message"){
_38=_36._$;
}
removeEventListener0.call(window,_35,_38,_37);
};
break;
}
function URI(str){
str=str||"";
var _3a=0;
var _3b=str.indexOf("://");
if(_3b!=-1){
this.scheme=str.slice(0,_3b);
_3a=_3b+3;
var _3c=str.indexOf("/",_3a);
if(_3c==-1){
_3c=str.length;
str+="/";
}
var _3d=str.slice(_3a,_3c);
this.authority=_3d;
_3a=_3c;
this.host=_3d;
var _3e=_3d.indexOf(":");
if(_3e!=-1){
this.host=_3d.slice(0,_3e);
this.port=parseInt(_3d.slice(_3e+1),10);
if(isNaN(this.port)){
throw new Error("Invalid URI syntax");
}
}
}
var _3f=str.indexOf("?",_3a);
if(_3f!=-1){
this.path=str.slice(_3a,_3f);
_3a=_3f+1;
}
var _40=str.indexOf("#",_3a);
if(_40!=-1){
if(_3f!=-1){
this.query=str.slice(_3a,_40);
}else{
this.path=str.slice(_3a,_40);
}
_3a=_40+1;
this.fragment=str.slice(_3a);
}else{
if(_3f!=-1){
this.query=str.slice(_3a);
}else{
this.path=str.slice(_3a);
}
}
};
(function(){
var _41=URI.prototype;
_41.toString=function(){
var sb=[];
var _43=this.scheme;
if(_43!==undefined){
sb.push(_43);
sb.push("://");
sb.push(this.host);
var _44=this.port;
if(_44!==undefined){
sb.push(":");
sb.push(_44.toString());
}
}
if(this.path!==undefined){
sb.push(this.path);
}
if(this.query!==undefined){
sb.push("?");
sb.push(this.query);
}
if(this.fragment!==undefined){
sb.push("#");
sb.push(this.fragment);
}
return sb.join("");
};
var _45={"http":80,"ws":80,"https":443,"wss":443};
URI.replaceProtocol=function(_46,_47){
var _48=_46.indexOf("://");
if(_48>0){
return _47+_46.substr(_48);
}else{
return "";
}
};
})();
(function(){
Base64={};
Base64.encode=function(_49){
var _4a=[];
var _4b;
var _4c;
var _4d;
while(_49.length){
switch(_49.length){
case 1:
_4b=_49.shift();
_4a.push(_4e[(_4b>>2)&63]);
_4a.push(_4e[((_4b<<4)&48)]);
_4a.push("=");
_4a.push("=");
break;
case 2:
_4b=_49.shift();
_4c=_49.shift();
_4a.push(_4e[(_4b>>2)&63]);
_4a.push(_4e[((_4b<<4)&48)|((_4c>>4)&15)]);
_4a.push(_4e[(_4c<<2)&60]);
_4a.push("=");
break;
default:
_4b=_49.shift();
_4c=_49.shift();
_4d=_49.shift();
_4a.push(_4e[(_4b>>2)&63]);
_4a.push(_4e[((_4b<<4)&48)|((_4c>>4)&15)]);
_4a.push(_4e[((_4c<<2)&60)|((_4d>>6)&3)]);
_4a.push(_4e[_4d&63]);
break;
}
}
return _4a.join("");
};
Base64.decode=function(_4f){
if(_4f.length===0){
return [];
}
if(_4f.length%4!==0){
throw new Error("Invalid base64 string (must be quads)");
}
var _50=[];
for(var i=0;i<_4f.length;i+=4){
var _52=_4f.charAt(i);
var _53=_4f.charAt(i+1);
var _54=_4f.charAt(i+2);
var _55=_4f.charAt(i+3);
var _56=_57[_52];
var _58=_57[_53];
var _59=_57[_54];
var _5a=_57[_55];
_50.push(((_56<<2)&252)|((_58>>4)&3));
if(_54!="="){
_50.push(((_58<<4)&240)|((_59>>2)&15));
if(_55!="="){
_50.push(((_59<<6)&192)|(_5a&63));
}
}
}
return _50;
};
var _4e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
var _57={"=":0};
for(var i=0;i<_4e.length;i++){
_57[_4e[i]]=i;
}
if(typeof (window.btoa)==="undefined"){
window.btoa=function(s){
var _5d=s.split("");
for(var i=0;i<_5d.length;i++){
_5d[i]=(_5d[i]).charCodeAt();
}
return Base64.encode(_5d);
};
window.atob=function(_5f){
var _60=Base64.decode(_5f);
for(var i=0;i<_60.length;i++){
_60[i]=String.fromCharCode(_60[i]);
}
return _60.join("");
};
}
})();
var postMessage0=(function(){
var _62=new URI((browser=="ie")?document.URL:location.href);
var _63={"http":80,"https":443};
if(_62.port==null){
_62.port=_63[_62.scheme];
_62.authority=_62.host+":"+_62.port;
}
var _64=_62.scheme+"://"+_62.authority;
var _65="/.kr";
if(typeof (postMessage)!=="undefined"){
return function(_66,_67,_68){
if(typeof (_67)!="string"){
throw new Error("Unsupported type. Messages must be strings");
}
if(_68==="null"){
_68="*";
}
switch(browser){
case "ie":
case "opera":
case "firefox":
setTimeout(function(){
_66.postMessage(_67,_68);
},0);
break;
default:
_66.postMessage(_67,_68);
break;
}
};
}else{
function MessagePipe(_69){
this.sourceToken=toPaddedHex(Math.floor(Math.random()*(Math.pow(2,32)-1)),8);
this.iframe=_69;
this.bridged=false;
this.lastWrite=0;
this.lastRead=0;
this.lastReadIndex=2;
this.lastSyn=0;
this.lastAck=0;
this.queue=[];
this.escapedFragments=[];
};
var _6a=MessagePipe.prototype;
_6a.attach=function(_6b,_6c,_6d,_6e,_6f,_70){
this.target=_6b;
this.targetOrigin=_6c;
this.targetToken=_6d;
this.reader=_6e;
this.writer=_6f;
this.writerURL=_70;
try{
this._lastHash=_6e.location.hash;
this.poll=pollLocationHash;
}
catch(permissionDenied){
this._lastDocumentURL=_6e.document.URL;
this.poll=pollDocumentURL;
}
if(_6b==parent){
dequeue(this,true);
}
};
_6a.detach=function(){
this.poll=function(){
};
delete this.target;
delete this.targetOrigin;
delete this.reader;
delete this.lastFragment;
delete this.writer;
delete this.writerURL;
};
_6a.poll=function(){
};
function pollLocationHash(){
var _71=this.reader.location.hash;
if(this._lastHash!=_71){
process(this,_71.substring(1));
this._lastHash=_71;
}
};
function pollDocumentURL(){
var _72=this.reader.document.URL;
if(this._lastDocumentURL!=_72){
var _73=_72.indexOf("#");
if(_73!=-1){
process(this,_72.substring(_73+1));
this._lastDocumentURL=_72;
}
}
};
_6a.post=function(_74,_75,_76){
bridgeIfNecessary(this,_74);
var _77=1000;
var _78=escape(_75);
var _79=[];
while(_78.length>_77){
var _7a=_78.substring(0,_77);
_78=_78.substring(_77);
_79.push(_7a);
}
_79.push(_78);
this.queue.push([_76,_79]);
if(this.writer!=null&&this.lastAck>=this.lastSyn){
dequeue(this,false);
}
};
function bridgeIfNecessary(_7b,_7c){
if(_7b.lastWrite<1&&!_7b.bridged){
if(_7c.parent==window){
var src=_7b.iframe.src;
var _7e=src.split("#");
var _7f=null;
var _80=document.getElementsByTagName("meta");
for(var i=0;i<_80.length;i++){
if(_80[i].name=="kaazing:resources"){
alert("kaazing:resources is no longer supported. Please refer to the Administrator's Guide section entitled \"Configuring a Web Server to Integrate with Kaazing Gateway\"");
}
}
var _82=_64;
var _83=_82.toString()+_65+"?.kr=xsp&.kv=10.05";
if(_7f){
var _84=new URI(_82.toString());
var _7e=_7f.split(":");
_84.host=_7e.shift();
if(_7e.length){
_84.port=_7e.shift();
}
_83=_84.toString()+_65+"?.kr=xsp&.kv=10.05";
}
for(var i=0;i<_80.length;i++){
if(_80[i].name=="kaazing:postMessageBridgeURL"){
var _85=_80[i].content;
var _86=new URI(_85);
var _87=new URI(location.toString());
if(!_86.authority){
_86.host=_87.host;
_86.port=_87.port;
_86.scheme=_87.scheme;
if(_85.indexOf("/")!=0){
var _88=_87.path.split("/");
_88.pop();
_88.push(_85);
_86.path=_88.join("/");
}
}
postMessage0.BridgeURL=_86.toString();
}
}
if(postMessage0.BridgeURL){
_83=postMessage0.BridgeURL;
}
var _89=["I",_82,_7b.sourceToken,escape(_83)];
if(_7e.length>1){
var _8a=_7e[1];
_89.push(escape(_8a));
}
_7e[1]=_89.join("!");
setTimeout(function(){
_7c.location.replace(_7e.join("#"));
},200);
_7b.bridged=true;
}
}
};
function flush(_8b,_8c){
var _8d=_8b.writerURL+"#"+_8c;
_8b.writer.location.replace(_8d);
};
function fromHex(_8e){
return parseInt(_8e,16);
};
function toPaddedHex(_8f,_90){
var hex=_8f.toString(16);
var _92=[];
_90-=hex.length;
while(_90-->0){
_92.push("0");
}
_92.push(hex);
return _92.join("");
};
function dequeue(_93,_94){
var _95=_93.queue;
var _96=_93.lastRead;
if((_95.length>0||_94)&&_93.lastSyn>_93.lastAck){
var _97=_93.lastFrames;
var _98=_93.lastReadIndex;
if(fromHex(_97[_98])!=_96){
_97[_98]=toPaddedHex(_96,8);
flush(_93,_97.join(""));
}
}else{
if(_95.length>0){
var _99=_95.shift();
var _9a=_99[0];
if(_9a=="*"||_9a==_93.targetOrigin){
_93.lastWrite++;
var _9b=_99[1];
var _9c=_9b.shift();
var _9d=3;
var _97=[_93.targetToken,toPaddedHex(_93.lastWrite,8),toPaddedHex(_96,8),"F",toPaddedHex(_9c.length,4),_9c];
var _98=2;
if(_9b.length>0){
_97[_9d]="f";
_93.queue.unshift(_99);
}
if(_93.resendAck){
var _9e=[_93.targetToken,toPaddedHex(_93.lastWrite-1,8),toPaddedHex(_96,8),"a"];
_97=_9e.concat(_97);
_98+=_9e.length;
}
flush(_93,_97.join(""));
_93.lastFrames=_97;
_93.lastReadIndex=_98;
_93.lastSyn=_93.lastWrite;
_93.resendAck=false;
}
}else{
if(_94){
_93.lastWrite++;
var _97=[_93.targetToken,toPaddedHex(_93.lastWrite,8),toPaddedHex(_96,8),"a"];
var _98=2;
if(_93.resendAck){
var _9e=[_93.targetToken,toPaddedHex(_93.lastWrite-1,8),toPaddedHex(_96,8),"a"];
_97=_9e.concat(_97);
_98+=_9e.length;
}
flush(_93,_97.join(""));
_93.lastFrames=_97;
_93.lastReadIndex=_98;
_93.resendAck=true;
}
}
}
};
function process(_9f,_a0){
var _a1=_a0.substring(0,8);
var _a2=fromHex(_a0.substring(8,16));
var _a3=fromHex(_a0.substring(16,24));
var _a4=_a0.charAt(24);
if(_a1!=_9f.sourceToken){
throw new Error("postMessage emulation tampering detected");
}
var _a5=_9f.lastRead;
var _a6=_a5+1;
if(_a2==_a6){
_9f.lastRead=_a6;
}
if(_a2==_a6||_a2==_a5){
_9f.lastAck=_a3;
}
if(_a2==_a6||(_a2==_a5&&_a4=="a")){
switch(_a4){
case "f":
var _a7=_a0.substr(29,fromHex(_a0.substring(25,29)));
_9f.escapedFragments.push(_a7);
dequeue(_9f,true);
break;
case "F":
var _a8=_a0.substr(29,fromHex(_a0.substring(25,29)));
if(_9f.escapedFragments!==undefined){
_9f.escapedFragments.push(_a8);
_a8=_9f.escapedFragments.join("");
_9f.escapedFragments=[];
}
var _a9=unescape(_a8);
dispatch(_a9,_9f.target,_9f.targetOrigin);
dequeue(_9f,true);
break;
case "a":
if(_a0.length>25){
process(_9f,_a0.substring(25));
}else{
dequeue(_9f,false);
}
break;
default:
throw new Error("unknown postMessage emulation payload type: "+_a4);
}
}
};
function dispatch(_aa,_ab,_ac){
var _ad=document.createEvent("Events");
_ad.initEvent("message",false,true);
_ad.data=_aa;
_ad.origin=_ac;
_ad.source=_ab;
dispatchEvent(_ad);
};
var _ae={};
var _af=[];
function pollReaders(){
for(var i=0,len=_af.length;i<len;i++){
var _b2=_af[i];
_b2.poll();
}
setTimeout(pollReaders,20);
};
function findMessagePipe(_b3){
if(_b3==parent){
return _ae["parent"];
}else{
if(_b3.parent==window){
var _b4=document.getElementsByTagName("iframe");
for(var i=0;i<_b4.length;i++){
var _b6=_b4[i];
if(_b3==_b6.contentWindow){
return supplyIFrameMessagePipe(_b6);
}
}
}else{
throw new Error("Generic peer postMessage not yet implemented");
}
}
};
function supplyIFrameMessagePipe(_b7){
var _b8=_b7._name;
if(_b8===undefined){
_b8="iframe$"+String(Math.random()).substring(2);
_b7._name=_b8;
}
var _b9=_ae[_b8];
if(_b9===undefined){
_b9=new MessagePipe(_b7);
_ae[_b8]=_b9;
}
return _b9;
};
function postMessage0(_ba,_bb,_bc){
if(typeof (_bb)!="string"){
throw new Error("Unsupported type. Messages must be strings");
}
if(_ba==window){
if(_bc=="*"||_bc==_64){
dispatch(_bb,window,_64);
}
}else{
var _bd=findMessagePipe(_ba);
_bd.post(_ba,_bb,_bc);
}
};
postMessage0.attach=function(_be,_bf,_c0,_c1,_c2,_c3){
var _c4=findMessagePipe(_be);
_c4.attach(_be,_bf,_c0,_c1,_c2,_c3);
_af.push(_c4);
};
var _c5=function(_c6){
var _c7=new URI((browser=="ie")?document.URL:location.href);
var _c8;
var _c9={"http":80,"https":443};
if(_c7.port==null){
_c7.port=_c9[_c7.scheme];
_c7.authority=_c7.host+":"+_c7.port;
}
var _ca=unescape(_c7.fragment||"");
if(_ca.length>0){
var _cb=_ca.split(",");
var _cc=_cb.shift();
var _cd=_cb.shift();
var _ce=_cb.shift();
var _cf=_c7.scheme+"://"+document.domain+":"+_c7.port;
var _d0=_c7.scheme+"://"+_c7.authority;
var _d1=_cc+"/.kr?.kr=xsc&.kv=10.05";
var _d2=document.location.toString().split("#")[0];
var _d3=_d1+"#"+escape([_cf,_cd,escape(_d2)].join(","));
if(typeof (ActiveXObject)!="undefined"){
_c8=new ActiveXObject("htmlfile");
_c8.open();
try{
_c8.parentWindow.opener=window;
}
catch(domainError){
if(_c6){
_c8.domain=_c6;
}
_c8.parentWindow.opener=window;
}
_c8.write("<html>");
_c8.write("<body>");
if(_c6){
_c8.write("<script>CollectGarbage();document.domain='"+_c6+"';</"+"script>");
}
_c8.write("<iframe src=\""+_d1+"\"></iframe>");
_c8.write("</body>");
_c8.write("</html>");
_c8.close();
var _d4=_c8.body.lastChild;
var _d5=_c8.parentWindow;
var _d6=parent;
var _d7=_d6.parent.postMessage0;
if(typeof (_d7)!="undefined"){
_d4.onload=function(){
var _d8=_d4.contentWindow;
_d8.location.replace(_d3);
_d7.attach(_d6,_cc,_ce,_d5,_d8,_d1);
};
}
}else{
var _d4=document.createElement("iframe");
_d4.src=_d3;
document.body.appendChild(_d4);
var _d5=window;
var _d9=_d4.contentWindow;
var _d6=parent;
var _d7=_d6.parent.postMessage0;
if(typeof (_d7)!="undefined"){
_d7.attach(_d6,_cc,_ce,_d5,_d9,_d1);
}
}
}
window.onunload=function(){
try{
var _da=window.parent.parent.postMessage0;
if(typeof (_da)!="undefined"){
_da.detach(_d6);
}
}
catch(permissionDenied){
}
if(typeof (_c8)!=="undefined"){
_c8.parentWindow.opener=null;
_c8.open();
_c8.close();
_c8=null;
CollectGarbage();
}
};
};
postMessage0.__init__=function(_db,_dc){
var _dd=_c5.toString();
_db.URI=URI;
_db.browser=browser;
if(!_dc){
_dc="";
}
_db.setTimeout("("+_dd+")('"+_dc+"')",0);
};
postMessage0.bridgeURL=false;
postMessage0.detach=function(_de){
var _df=findMessagePipe(_de);
for(var i=0;i<_af.length;i++){
if(_af[i]==_df){
_af.splice(i,1);
}
}
_df.detach();
};
if(window!=top){
_ae["parent"]=new MessagePipe();
function initializeAsTargetIfNecessary(){
var _e1=new URI((browser=="ie")?document.URL:location.href);
var _e2=_e1.fragment||"";
if(document.body!=null&&_e2.length>0&&_e2.charAt(0)=="I"){
var _e3=unescape(_e2);
var _e4=_e3.split("!");
if(_e4.shift()=="I"){
var _e5=_e4.shift();
var _e6=_e4.shift();
var _e7=unescape(_e4.shift());
var _e8=_64;
if(_e5==_e8){
try{
parent.location.hash;
}
catch(permissionDenied){
document.domain=document.domain;
}
}
var _e9=_e4.shift()||"";
switch(browser){
case "firefox":
location.replace([location.href.split("#")[0],_e9].join("#"));
break;
default:
location.hash=_e9;
break;
}
var _ea=findMessagePipe(parent);
_ea.targetToken=_e6;
var _eb=_ea.sourceToken;
var _ec=_e7+"#"+escape([_e8,_e6,_eb].join(","));
var _ed;
_ed=document.createElement("iframe");
_ed.src=_ec;
_ed.style.position="absolute";
_ed.style.left="-10px";
_ed.style.top="10px";
_ed.style.visibility="hidden";
_ed.style.width="0px";
_ed.style.height="0px";
document.body.appendChild(_ed);
return;
}
}
setTimeout(initializeAsTargetIfNecessary,20);
};
initializeAsTargetIfNecessary();
}
var _ee=document.getElementsByTagName("meta");
for(var i=0;i<_ee.length;i++){
if(_ee[i].name==="kaazing:postMessage"){
if("immediate"==_ee[i].content){
var _f0=function(){
var _f1=document.getElementsByTagName("iframe");
for(var i=0;i<_f1.length;i++){
var _f3=_f1[i];
if(_f3.style["KaaPostMessage"]=="immediate"){
_f3.style["KaaPostMessage"]="none";
var _f4=supplyIFrameMessagePipe(_f3);
bridgeIfNecessary(_f4,_f3.contentWindow);
}
}
setTimeout(_f0,20);
};
setTimeout(_f0,20);
}
break;
}
}
for(var i=0;i<_ee.length;i++){
if(_ee[i].name==="kaazing:postMessagePrefix"){
var _f5=_ee[i].content;
if(_f5!=null&&_f5.length>0){
if(_f5.charAt(0)!="/"){
_f5="/"+_f5;
}
_65=_f5;
}
}
}
setTimeout(pollReaders,20);
return postMessage0;
}
})();
var XDRHttpDirect=(function(){
var id=0;
function XDRHttpDirect(_f7){
this.outer=_f7;
};
var _f8=XDRHttpDirect.prototype;
_f8.open=function(_f9,_fa){
var _fb=this;
var xhr=this.outer;
xhr.responseText="";
var _fd=2;
var _fe=0;
var _ff=0;
this._method=_f9;
this._location=_fa;
if(_fa.indexOf("?")==-1){
_fa+="?.kac=ex&.kct=application/x-message-http";
}else{
_fa+="&.kac=ex&.kct=application/x-message-http";
}
this.location=_fa;
var xdr=this.xdr=new XDomainRequest();
var _101=function(e){
try{
var _103=xdr.responseText;
if(_fd<=2){
var _104=_103.indexOf("\r\n\r\n");
if(_104==-1){
return;
}
var _105=_103.indexOf("\r\n");
var _106=_103.substring(0,_105);
var _107=_106.match(/HTTP\/1\.\d\s(\d+)\s([^\r\n]+)/);
xhr.status=parseInt(_107[1]);
xhr.statusText=_107[2];
var _108=_105+2;
_ff=_104+4;
var _109=_103.substring(_108,_104).split("\r\n");
xhr._responseHeaders={};
for(var i=0;i<_109.length;i++){
var _10b=_109[i].split(":");
xhr._responseHeaders[_10b[0].replace(/^\s+|\s+$/g,"")]=_10b[1].replace(/^\s+|\s+$/g,"");
}
_fe=_ff;
_fd=xhr.readyState=3;
if(typeof (_fb.onreadystatechange)=="function"){
_fb.onreadystatechange(xhr);
}
}
var _10c=xdr.responseText.length;
if(_10c>_fe){
xhr.responseText=_103.slice(_ff);
_fe=_10c;
if(typeof (_fb.onprogress)=="function"){
_fb.onprogress(xhr);
}
}else{
}
}
catch(e1){
_fb.onload(xhr);
}
};
xdr.onprogress=_101;
xdr.onerror=function(e){
xhr.readyState=0;
if(typeof (xhr.onerror)=="function"){
xhr.onerror(xhr);
}
};
xdr.onload=function(e){
if(_fd<=3){
_101(e);
}
reayState=xhr.readyState=4;
if(typeof (xhr.onreadystatechange)=="function"){
xhr.onreadystatechange(xhr);
}
if(typeof (xhr.onload)=="function"){
xhr.onload(xhr);
}
};
xdr.open("POST",_fa);
};
_f8.send=function(_10f){
var _110=this._method+" "+this.location.substring(this.location.indexOf("/",9),this.location.indexOf("&.kct"))+" HTTP/1.1\r\n";
for(var i=0;i<this.outer._requestHeaders.length;i++){
_110+=this.outer._requestHeaders[i][0]+": "+this.outer._requestHeaders[i][1]+"\r\n";
}
var _112=_10f||"";
if(_112.length>0||this._method.toUpperCase()==="POST"){
var len=0;
for(var i=0;i<_112.length;i++){
len++;
if(_112.charCodeAt(i)>=128){
len++;
}
}
_110+="Content-Length: "+len+"\r\n";
}
_110+="\r\n";
_110+=_112;
this.xdr.send(_110);
};
_f8.abort=function(){
this.xdr.abort();
};
return XDRHttpDirect;
})();
var XMLHttpBridge=(function(){
var _114=new URI((browser=="ie")?document.URL:location.href);
var _115={"http":80,"https":443};
if(_114.port==null){
_114.port=_115[_114.scheme];
_114.authority=_114.host+":"+_114.port;
}
var _116={};
var _117={};
var _118=0;
function XMLHttpBridge(_119){
this.outer=_119;
};
var _11a=XMLHttpBridge.prototype;
_11a.open=function(_11b,_11c){
var id=register(this);
var pipe=supplyPipe(this,_11c);
pipe.attach(id);
this._pipe=pipe;
this._method=_11b;
this._location=_11c;
this.outer.readyState=1;
this.outer.status=0;
this.outer.statusText="";
this.outer.responseText="";
var _11f=this;
setTimeout(function(){
_11f.outer.readyState=1;
onreadystatechange(_11f);
},0);
};
_11a.send=function(_120){
doSend(this,_120);
};
_11a.abort=function(){
var pipe=this._pipe;
if(pipe!==undefined){
pipe.post(["a",this._id].join(""));
pipe.detach(this._id);
}
};
function onreadystatechange(_122){
if(typeof (_122.onreadystatechange)!=="undefined"){
_122.onreadystatechange(_122.outer);
}
switch(_122.outer.readyState){
case 3:
if(typeof (_122.onprogress)!=="undefined"){
_122.onprogress(_122.outer);
}
break;
case 4:
if(_122.outer.status<100||_122.outer.status>=500){
if(typeof (_122.onerror)!=="undefined"){
_122.onerror(_122.outer);
}
}else{
if(typeof (_122.onprogress)!=="undefined"){
_122.onprogress(_122.outer);
}
if(typeof (_122.onload)!=="undefined"){
_122.onload(_122.outer);
}
}
break;
}
};
function fromHex(_123){
return parseInt(_123,16);
};
function toPaddedHex(_124,_125){
var hex=_124.toString(16);
var _127=[];
_125-=hex.length;
while(_125-->0){
_127.push("0");
}
_127.push(hex);
return _127.join("");
};
function register(_128){
var id=toPaddedHex(_118++,8);
_117[id]=_128;
_128._id=id;
return id;
};
function doSend(_12a,_12b){
if(typeof (_12b)!=="string"){
_12b="";
}
var _12c=_12a._method.substring(0,10);
var _12d=_12a._location;
var _12e=_12a.outer._requestHeaders;
var _12f=toPaddedHex(_12a.outer.timeout,4);
var _130=(_12a.outer.onprogress!==undefined)?"t":"f";
var _131=["s",_12a._id,_12c.length,_12c,toPaddedHex(_12d.length,4),_12d,toPaddedHex(_12e.length,4)];
for(var i=0;i<_12e.length;i++){
var _133=_12e[i];
_131.push(toPaddedHex(_133[0].length,4));
_131.push(_133[0]);
_131.push(toPaddedHex(_133[1].length,4));
_131.push(_133[1]);
}
_131.push(toPaddedHex(_12b.length,8),_12b,toPaddedHex(_12f,4),_130);
_12a._pipe.post(_131.join(""));
};
function supplyPipe(_134,_135){
var uri=new URI(_135);
var _137=(uri.scheme!=null&&uri.authority!=null);
var _138=_137?uri.scheme:_114.scheme;
var _139=_137?uri.authority:_114.authority;
if(_139!=null&&uri.port==null){
_139=uri.host+":"+_115[_138];
}
var _13a=_138+"://"+_139;
var pipe=_116[_13a];
if(pipe!==undefined){
if(!("iframe" in pipe&&"contentWindow" in pipe.iframe&&typeof pipe.iframe.contentWindow=="object")){
pipe=_116[_13a]=undefined;
}
}
if(pipe===undefined){
var _13c=document.createElement("iframe");
_13c.style.position="absolute";
_13c.style.left="-10px";
_13c.style.top="10px";
_13c.style.visibility="hidden";
_13c.style.width="0px";
_13c.style.height="0px";
var _13d=new URI(_13a);
_13d.query=".kr=xs";
_13d.path="/";
_13c.src=_13d.toString();
function post(_13e){
this.buffer.push(_13e);
};
function attach(id){
var _140=this.attached[id];
if(_140===undefined){
_140={};
this.attached[id]=_140;
}
if(_140.timerID!==undefined){
clearTimeout(_140.timerID);
delete _140.timerID;
}
};
function detach(id){
var _142=this.attached[id];
if(_142!==undefined&&_142.timerID===undefined){
var _143=this;
_142.timerID=setTimeout(function(){
delete _143.attached[id];
var xhr=_117[id];
if(xhr._pipe==pipe){
delete _117[id];
delete xhr._id;
delete xhr._pipe;
}
postMessage0(pipe.iframe.contentWindow,["d",id].join(""),pipe.targetOrigin);
},0);
}
};
pipe={"targetOrigin":_13a,"iframe":_13c,"buffer":[],"post":post,"attach":attach,"detach":detach,"attached":{count:0}};
_116[_13a]=pipe;
function sendInitWhenReady(){
var _145=_13c.contentWindow;
if(!_145){
setTimeout(sendInitWhenReady,20);
}else{
postMessage0(_145,"I",_13a);
}
};
pipe.handshakeID=setTimeout(function(){
_116[_13a]=undefined;
pipe.post=function(_146){
_134.readyState=4;
_134.status=0;
onreadystatechange(_134);
};
if(pipe.buffer.length>0){
pipe.post();
}
},30000);
document.body.appendChild(_13c);
if(typeof (postMessage)==="undefined"){
sendInitWhenReady();
}
}
return pipe;
};
function onmessage(_147){
var _148=_147.origin;
var _149={"http":":80","https":":443"};
var _14a=_148.split(":");
if(_14a.length===2){
_148+=_149[_14a[0]];
}
var pipe=_116[_148];
if(pipe!==undefined&&pipe.iframe!==undefined&&_147.source==pipe.iframe.contentWindow){
if(_147.data=="I"){
clearTimeout(pipe.handshakeID);
var _14c;
while((_14c=pipe.buffer.shift())!==undefined){
postMessage0(pipe.iframe.contentWindow,_14c,pipe.targetOrigin);
}
pipe.post=function(_14d){
postMessage0(pipe.iframe.contentWindow,_14d,pipe.targetOrigin);
};
}else{
var _14c=_147.data;
if(_14c.length>=9){
var _14e=0;
var type=_14c.substring(_14e,_14e+=1);
var id=_14c.substring(_14e,_14e+=8);
var _151=_117[id];
if(_151!==undefined){
switch(type){
case "r":
var _152={};
var _153=fromHex(_14c.substring(_14e,_14e+=2));
for(var i=0;i<_153;i++){
var _155=fromHex(_14c.substring(_14e,_14e+=4));
var _156=_14c.substring(_14e,_14e+=_155);
var _157=fromHex(_14c.substring(_14e,_14e+=4));
var _158=_14c.substring(_14e,_14e+=_157);
_152[_156]=_158;
}
var _159=fromHex(_14c.substring(_14e,_14e+=4));
var _15a=fromHex(_14c.substring(_14e,_14e+=2));
var _15b=_14c.substring(_14e,_14e+=_15a);
switch(_159){
case 301:
case 302:
case 307:
var _15c=_152["Location"];
var id=register(_151);
var pipe=supplyPipe(_151,_15c);
pipe.attach(id);
_151._pipe=pipe;
_151._method="GET";
_151._location=_15c;
_151._redirect=true;
break;
case 403:
_151.outer.status=_159;
onreadystatechange(_151);
break;
default:
_151.outer._responseHeaders=_152;
_151.outer.status=_159;
_151.outer.statusText=_15b;
break;
}
break;
case "p":
var _15d=parseInt(_14c.substring(_14e,_14e+=1));
if(_151._id===id){
_151.outer.readyState=_15d;
var _15e=fromHex(_14c.substring(_14e,_14e+=8));
var _15f=_14c.substring(_14e,_14e+=_15e);
if(_15f.length>0){
_151.outer.responseText+=_15f;
}
onreadystatechange(_151);
}else{
if(_151._redirect){
_151._redirect=false;
doSend(_151,"");
}
}
if(_15d==4){
pipe.detach(id);
}
break;
case "e":
if(_151._id===id){
_151.outer.status=0;
_151.outer.statusText="";
_151.outer.readyState=4;
onreadystatechange(_151);
}
pipe.detach(id);
break;
case "t":
if(_151._id===id){
_151.outer.status=0;
_151.outer.statusText="";
_151.outer.readyState=4;
if(typeof (_151.ontimeout)!=="undefined"){
_151.ontimeout();
}
}
pipe.detach(id);
break;
}
}
}
}
}else{
}
};
window.addEventListener("message",onmessage,false);
return XMLHttpBridge;
})();
var XMLHttpRequest0=(function(){
var _160=new URI((browser=="ie")?document.URL:location.href);
var _161={"http":80,"https":443};
if(_160.port==null){
_160.port=_161[_160.scheme];
_160.authority=_160.host+":"+_160.port;
}
function onreadystatechange(_162){
if(typeof (_162.onreadystatechange)!=="undefined"){
_162.onreadystatechange();
}
};
function onprogress(_163){
if(typeof (_163.onprogress)!=="undefined"){
_163.onprogress();
}
};
function onerror(_164){
if(typeof (_164.onerror)!=="undefined"){
_164.onerror();
}
};
function onload(_165){
if(typeof (_165.onload)!=="undefined"){
_165.onload();
}
};
function XMLHttpRequest0(){
this._requestHeaders=[];
this.responseHeaders={};
this.withCredentials=false;
};
var _166=XMLHttpRequest0.prototype;
_166.readyState=0;
_166.responseText="";
_166.status=0;
_166.statusText="";
_166.timeout=0;
_166.onreadystatechange;
_166.onerror;
_166.onload;
_166.onprogress;
_166.open=function(_167,_168,_169){
if(!_169){
throw new Error("Asynchronous is required for cross-origin XMLHttpRequest emulation");
}
switch(this.readyState){
case 0:
case 4:
break;
default:
throw new Error("Invalid ready state");
}
var _16a=this;
this._method=_167;
this._location=_168;
this.readyState=1;
this.status=0;
this.statusText="";
this.responseText="";
var xhr;
var _16c=new URI(_168);
if(_16c.port==null){
_16c.port=_161[_16c.scheme];
_16c.authority=_16c.host+":"+_16c.port;
}
if(browser=="ie"&&typeof (XDomainRequest)!=="undefined"&&_16c.scheme==_160.scheme&&!this.withCredentials){
xhr=new XDRHttpDirect(this);
}else{
if(_16c.scheme==_160.scheme&&_16c.authority==_160.authority){
try{
xhr=new XMLHttpBridge(this);
}
catch(e){
xhr=new XMLHttpBridge(this);
}
}else{
xhr=new XMLHttpBridge(this);
}
}
xhr.onload=onload;
xhr.onprogress=onprogress;
xhr.onreadystatechange=onreadystatechange;
xhr.onerror=onerror;
xhr.open(_167,_168);
this.xhr=xhr;
setTimeout(function(){
if(_16a.readyState>1){
return;
}
if(_16a.readyState<1){
_16a.readyState=1;
}
onreadystatechange(_16a);
},0);
};
_166.setRequestHeader=function(_16d,_16e){
if(this.readyState!==1){
throw new Error("Invalid ready state");
}
this._requestHeaders.push([_16d,_16e]);
};
_166.send=function(_16f){
if(this.readyState!==1){
throw new Error("Invalid ready state");
}
var _170=this;
setTimeout(function(){
if(_170.readyState>2){
return;
}
if(_170.readyState<2){
_170.readyState=2;
}
onreadystatechange(_170);
},0);
this.xhr.send(_16f);
};
_166.abort=function(){
this.xhr.abort();
};
_166.getResponseHeader=function(_171){
if(this.status==0){
throw new Error("Invalid ready state");
}
var _172=this._responseHeaders;
return _172[_171];
};
_166.getAllResponseHeaders=function(){
if(this.status==0){
throw new Error("Invalid ready state");
}
return this._responseHeaders;
};
return XMLHttpRequest0;
})();
ByteOrder=function(){
};
(function(){
var _173=ByteOrder.prototype;
_173.toString=function(){
throw new Error("Abstract");
};
var _174=function(v){
return (v&255);
};
var _176=function(_177){
return (_177&128)?(_177|-256):_177;
};
var _178=function(v){
return [((v>>8)&255),(v&255)];
};
var _17a=function(_17b,_17c){
return (_176(_17b)<<8)|(_17c&255);
};
var _17d=function(_17e,_17f){
return ((_17e&255)<<8)|(_17f&255);
};
var _180=function(_181,_182,_183){
return ((_181&255)<<16)|((_182&255)<<8)|(_183&255);
};
var _184=function(v){
return [((v>>16)&255),((v>>8)&255),(v&255)];
};
var _186=function(_187,_188,_189){
return ((_187&255)<<16)|((_188&255)<<8)|(_189&255);
};
var _18a=function(v){
return [((v>>24)&255),((v>>16)&255),((v>>8)&255),(v&255)];
};
var _18c=function(_18d,_18e,_18f,_190){
return (_176(_18d)<<24)|((_18e&255)<<16)|((_18f&255)<<8)|(_190&255);
};
var _191=function(_192,_193,_194,_195){
var _196=_17d(_192,_193);
var _197=_17d(_194,_195);
return (_196*65536+_197);
};
ByteOrder.BIG_ENDIAN=(function(){
var _198=function(){
};
_198.prototype=new ByteOrder();
var _199=_198.prototype;
_199._toUnsignedByte=_174;
_199._toByte=_176;
_199._fromShort=_178;
_199._toShort=_17a;
_199._toUnsignedShort=_17d;
_199._toUnsignedMediumInt=_180;
_199._fromMediumInt=_184;
_199._toMediumInt=_186;
_199._fromInt=_18a;
_199._toInt=_18c;
_199._toUnsignedInt=_191;
_199.toString=function(){
return "<ByteOrder.BIG_ENDIAN>";
};
return new _198();
})();
ByteOrder.LITTLE_ENDIAN=(function(){
var _19a=function(){
};
_19a.prototype=new ByteOrder();
var _19b=_19a.prototype;
_19b._toByte=_176;
_19b._toUnsignedByte=_174;
_19b._fromShort=function(v){
return _178(v).reverse();
};
_19b._toShort=function(_19d,_19e){
return _17a(_19e,_19d);
};
_19b._toUnsignedShort=function(_19f,_1a0){
return _17d(_1a0,_19f);
};
_19b._toUnsignedMediumInt=function(_1a1,_1a2,_1a3){
return _180(_1a3,_1a2,_1a1);
};
_19b._fromMediumInt=function(v){
return _184(v).reverse();
};
_19b._toMediumInt=function(_1a5,_1a6,_1a7,_1a8,_1a9,_1aa){
return _186(_1aa,_1a9,_1a8,_1a7,_1a6,_1a5);
};
_19b._fromInt=function(v){
return _18a(v).reverse();
};
_19b._toInt=function(_1ac,_1ad,_1ae,_1af){
return _18c(_1af,_1ae,_1ad,_1ac);
};
_19b._toUnsignedInt=function(_1b0,_1b1,_1b2,_1b3){
return _191(_1b3,_1b2,_1b1,_1b0);
};
_19b.toString=function(){
return "<ByteOrder.LITTLE_ENDIAN>";
};
return new _19a();
})();
})();
function ByteBuffer(_1b4){
this.array=_1b4||[];
this._mark=-1;
this.limit=this.capacity=this.array.length;
this.order=ByteOrder.BIG_ENDIAN;
};
(function(){
ByteBuffer.allocate=function(_1b5){
var buf=new ByteBuffer();
buf.capacity=_1b5;
buf.limit=_1b5;
return buf;
};
ByteBuffer.wrap=function(_1b7){
return new ByteBuffer(_1b7);
};
var _1b8=ByteBuffer.prototype;
_1b8.autoExpand=true;
_1b8.capacity=0;
_1b8.position=0;
_1b8.limit=0;
_1b8.order=ByteOrder.BIG_ENDIAN;
_1b8.array=[];
_1b8.mark=function(){
this._mark=this.position;
return this;
};
_1b8.reset=function(){
var m=this._mark;
if(m<0){
throw new Error("Invalid mark");
}
this.position=m;
return this;
};
_1b8.compact=function(){
this.array.splice(0,this.position);
this.limit-=this.position;
this.position=0;
return this;
};
_1b8.duplicate=function(){
var buf=new ByteBuffer(this.array);
buf.position=this.position;
buf.limit=this.limit;
buf.capacity=this.capacity;
return buf;
};
_1b8.fill=function(size){
_autoExpand(this,size);
while(size-->0){
this.put(0);
}
return this;
};
_1b8.fillWith=function(b,size){
_autoExpand(this,size);
while(size-->0){
this.put(b);
}
return this;
};
_1b8.indexOf=function(b){
var _1bf=this.limit;
var _1c0=this.array;
for(var i=this.position;i<_1bf;i++){
if(_1c0[i]==b){
return i;
}
}
return -1;
};
_1b8.put=function(v){
_autoExpand(this,1);
this.array[this.position++]=v&255;
return this;
};
_1b8.putAt=function(_1c3,v){
_checkForWriteAt(this,_1c3,1);
this.array[_1c3]=v&255;
return this;
};
_1b8.putUnsigned=function(v){
_autoExpand(this,1);
this.array[this.position++]=v&255;
return this;
};
_1b8.putUnsignedAt=function(_1c6,v){
_checkForWriteAt(this,_1c6,1);
this.array[_1c6]=v&255;
return this;
};
_1b8.putShort=function(v){
_autoExpand(this,2);
_putBytesInternal(this,this.position,this.order._fromShort(v));
this.position+=2;
return this;
};
_1b8.putShortAt=function(_1c9,v){
_checkForWriteAt(this,_1c9,2);
_putBytesInternal(this,_1c9,this.order._fromShort(v));
return this;
};
_1b8.putUnsignedShort=function(v){
_autoExpand(this,2);
_putBytesInternal(this,this.position,this.order._fromShort(v&65535));
this.position+=2;
return this;
};
_1b8.putUnsignedShortAt=function(_1cc,v){
_checkForWriteAt(this,_1cc,2);
_putBytesInternal(this,_1cc,this.order._fromShort(v&65535));
return this;
};
_1b8.putMediumInt=function(v){
_autoExpand(this,3);
this.putMediumIntAt(this.position,v);
this.position+=3;
return this;
};
_1b8.putMediumIntAt=function(_1cf,v){
this.putBytesAt(_1cf,this.order._fromMediumInt(v));
return this;
};
_1b8.putInt=function(v){
_autoExpand(this,4);
_putBytesInternal(this,this.position,this.order._fromInt(v));
this.position+=4;
return this;
};
_1b8.putIntAt=function(_1d2,v){
_checkForWriteAt(this,_1d2,4);
_putBytesInternal(this,_1d2,this.order._fromInt(v));
return this;
};
_1b8.putUnsignedInt=function(v){
_autoExpand(this,4);
this.putUnsignedIntAt(this.position,v&4294967295);
this.position+=4;
return this;
};
_1b8.putUnsignedIntAt=function(_1d5,v){
_checkForWriteAt(this,_1d5,4);
this.putIntAt(_1d5,v&4294967295);
return this;
};
_1b8.putString=function(v,cs){
cs.encode(v,this);
return this;
};
_1b8.putPrefixedString=function(_1d9,v,cs){
if(typeof (cs)==="undefined"||typeof (cs.encode)==="undefined"){
throw new Error("ByteBuffer.putPrefixedString: character set parameter missing");
}
if(_1d9===0){
return this;
}
_autoExpand(this,_1d9);
var len=v.length;
switch(_1d9){
case 1:
this.put(len);
break;
case 2:
this.putShort(len);
break;
case 4:
this.putInt(len);
break;
}
cs.encode(v,this);
return this;
};
function _putBytesInternal(_1dd,_1de,v){
var _1e0=_1dd.array;
for(var i=0;i<v.length;i++){
_1e0[i+_1de]=v[i]&255;
}
};
_1b8.putBytes=function(v){
_autoExpand(this,v.length);
_putBytesInternal(this,this.position,v);
this.position+=v.length;
return this;
};
_1b8.putBytesAt=function(_1e3,v){
_checkForWriteAt(this,_1e3,v.length);
_putBytesInternal(this,_1e3,v);
return this;
};
_1b8.putByteArray=function(v){
_autoExpand(this,v.byteLength);
var u=new Uint8Array(v);
for(var i=0;i<u.byteLength;i++){
this.putAt(this.position+i,u[i]&255);
}
this.position+=v.byteLength;
return this;
};
_1b8.putBuffer=function(v){
var len=v.remaining();
_autoExpand(this,len);
var _1ea=v.array;
var _1eb=v.position;
var _1ec=this.position;
for(var i=0;i<len;i++){
this.array[i+_1ec]=_1ea[i+_1eb];
}
this.position+=len;
return this;
};
_1b8.putBufferAt=function(_1ee,v){
var len=v.remaining();
_autoExpand(this,len);
var _1f1=v.array;
var _1f2=v.position;
var _1f3=this.position;
for(var i=0;i<len;i++){
this.array[i+_1f3]=_1f1[i+_1f2];
}
return this;
};
_1b8.get=function(){
_checkForRead(this,1);
return this.order._toByte(this.array[this.position++]);
};
_1b8.getAt=function(_1f5){
_checkForReadAt(this,_1f5,1);
return this.order._toByte(this.array[_1f5]);
};
_1b8.getUnsigned=function(){
_checkForRead(this,1);
var val=this.order._toUnsignedByte(this.array[this.position++]);
return val;
};
_1b8.getUnsignedAt=function(_1f7){
_checkForReadAt(this,_1f7,1);
return this.order._toUnsignedByte(this.array[_1f7]);
};
_1b8.getBytes=function(size){
_checkForRead(this,size);
var _1f9=new Array();
for(var i=0;i<size;i++){
_1f9.push(this.order._toByte(this.array[i+this.position]));
}
this.position+=size;
return _1f9;
};
_1b8.getBytesAt=function(_1fb,size){
_checkForReadAt(this,_1fb,size);
var _1fd=new Array();
var _1fe=this.array;
for(var i=0;i<size;i++){
_1fd.push(_1fe[i+_1fb]);
}
return _1fd;
};
_1b8.getBlob=function(size){
var _201=this.array.slice(this.position,size);
this.position+=size;
return BlobUtils.fromNumberArray(_201);
};
_1b8.getBlobAt=function(_202,size){
var _204=this.getBytesAt(_202,size);
return BlobUtils.fromNumberArray(_204);
};
_1b8.getArrayBuffer=function(size){
var u=new Uint8Array(size);
u.set(this.array.slice(this.position,size));
this.position+=size;
return u.buffer;
};
_1b8.getShort=function(){
_checkForRead(this,2);
var val=this.getShortAt(this.position);
this.position+=2;
return val;
};
_1b8.getShortAt=function(_208){
_checkForReadAt(this,_208,2);
var _209=this.array;
return this.order._toShort(_209[_208++],_209[_208++]);
};
_1b8.getUnsignedShort=function(){
_checkForRead(this,2);
var val=this.getUnsignedShortAt(this.position);
this.position+=2;
return val;
};
_1b8.getUnsignedShortAt=function(_20b){
_checkForReadAt(this,_20b,2);
var _20c=this.array;
return this.order._toUnsignedShort(_20c[_20b++],_20c[_20b++]);
};
_1b8.getUnsignedMediumInt=function(){
var _20d=this.array;
return this.order._toUnsignedMediumInt(_20d[this.position++],_20d[this.position++],_20d[this.position++]);
};
_1b8.getMediumInt=function(){
var val=this.getMediumIntAt(this.position);
this.position+=3;
return val;
};
_1b8.getMediumIntAt=function(i){
var _210=this.array;
return this.order._toMediumInt(_210[i++],_210[i++],_210[i++]);
};
_1b8.getInt=function(){
_checkForRead(this,4);
var val=this.getIntAt(this.position);
this.position+=4;
return val;
};
_1b8.getIntAt=function(_212){
_checkForReadAt(this,_212,4);
var _213=this.array;
return this.order._toInt(_213[_212++],_213[_212++],_213[_212++],_213[_212++]);
};
_1b8.getUnsignedInt=function(){
_checkForRead(this,4);
var val=this.getUnsignedIntAt(this.position);
this.position+=4;
return val;
};
_1b8.getUnsignedIntAt=function(_215){
_checkForReadAt(this,_215,4);
var _216=this.array;
return this.order._toUnsignedInt(_216[_215++],_216[_215++],_216[_215++],_216[_215++]);
return val;
};
_1b8.getPrefixedString=function(_217,cs){
var len=0;
switch(_217||2){
case 1:
len=this.getUnsigned();
break;
case 2:
len=this.getUnsignedShort();
break;
case 4:
len=this.getInt();
break;
}
if(len===0){
return "";
}
var _21a=this.limit;
try{
this.limit=this.position+len;
return cs.decode(this);
}
finally{
this.limit=_21a;
}
};
_1b8.getString=function(cs){
try{
return cs.decode(this);
}
finally{
this.position=this.limit;
}
};
_1b8.slice=function(){
return new ByteBuffer(this.array.slice(this.position,this.limit));
};
_1b8.flip=function(){
this.limit=this.position;
this.position=0;
this._mark=-1;
return this;
};
_1b8.rewind=function(){
this.position=0;
this._mark=-1;
return this;
};
_1b8.clear=function(){
this.position=0;
this.limit=this.capacity;
this._mark=-1;
return this;
};
_1b8.remaining=function(){
return (this.limit-this.position);
};
_1b8.hasRemaining=function(){
return (this.limit>this.position);
};
_1b8.skip=function(size){
this.position+=size;
return this;
};
_1b8.getHexDump=function(){
var _21d=this.array;
var pos=this.position;
var _21f=this.limit;
if(pos==_21f){
return "empty";
}
var _220=[];
for(var i=pos;i<_21f;i++){
var hex=(_21d[i]||0).toString(16);
if(hex.length==1){
hex="0"+hex;
}
_220.push(hex);
}
return _220.join(" ");
};
_1b8.toString=_1b8.getHexDump;
_1b8.expand=function(_223){
return this.expandAt(this.position,_223);
};
_1b8.expandAt=function(i,_225){
var end=i+_225;
if(end>this.capacity){
this.capacity=end;
}
if(end>this.limit){
this.limit=end;
}
return this;
};
function _autoExpand(_227,_228){
if(_227.autoExpand){
_227.expand(_228);
}
return _227;
};
function _checkForRead(_229,_22a){
var end=_229.position+_22a;
if(end>_229.limit){
throw new Error("Buffer underflow");
}
return _229;
};
function _checkForReadAt(_22c,_22d,_22e){
var end=_22d+_22e;
if(_22d<0||end>_22c.limit){
throw new Error("Index out of bounds");
}
return _22c;
};
function _checkForWriteAt(_230,_231,_232){
var end=_231+_232;
if(_231<0||end>_230.limit){
throw new Error("Index out of bounds");
}
return _230;
};
})();
function Charset(){
};
(function(){
var _234=Charset.prototype;
_234.decode=function(buf){
};
_234.encode=function(str,buf){
};
Charset.UTF8=(function(){
function UTF8(){
};
UTF8.prototype=new Charset();
var _238=UTF8.prototype;
_238.decode=function(buf){
var _23a=buf.remaining();
var _23b=_23a<10000;
var _23c=[];
var _23d=buf.array;
var _23e=buf.position;
var _23f=_23e+_23a;
var _240,_241,_242,_243;
for(var i=_23e;i<_23f;i++){
_240=(_23d[i]&255);
var _245=charByteCount(_240);
var _246=_23f-i;
if(_246<_245){
break;
}
var _247=null;
switch(_245){
case 1:
_247=_240;
break;
case 2:
i++;
_241=(_23d[i]&255);
_247=((_240&31)<<6)|(_241&63);
break;
case 3:
i++;
_241=(_23d[i]&255);
i++;
_242=(_23d[i]&255);
_247=((_240&15)<<12)|((_241&63)<<6)|(_242&63);
break;
case 4:
i++;
_241=(_23d[i]&255);
i++;
_242=(_23d[i]&255);
i++;
_243=(_23d[i]&255);
_247=((_240&7)<<18)|((_241&63)<<12)|((_242&63)<<6)|(_243&63);
break;
}
if(_23b){
_23c.push(_247);
}else{
_23c.push(String.fromCharCode(_247));
}
}
if(_23b){
return String.fromCharCode.apply(null,_23c);
}else{
return _23c.join("");
}
};
_238.encode=function(str,buf){
var _24a=buf.position;
var mark=_24a;
var _24c=buf.array;
for(var i=0;i<str.length;i++){
var _24e=str.charCodeAt(i);
if(_24e<128){
_24c[_24a++]=_24e;
}else{
if(_24e<2048){
_24c[_24a++]=(_24e>>6)|192;
_24c[_24a++]=(_24e&63)|128;
}else{
if(_24e<65536){
_24c[_24a++]=(_24e>>12)|224;
_24c[_24a++]=((_24e>>6)&63)|128;
_24c[_24a++]=(_24e&63)|128;
}else{
if(_24e<1114112){
_24c[_24a++]=(_24e>>18)|240;
_24c[_24a++]=((_24e>>12)&63)|128;
_24c[_24a++]=((_24e>>6)&63)|128;
_24c[_24a++]=(_24e&63)|128;
}else{
throw new Error("Invalid UTF-8 string");
}
}
}
}
}
buf.position=_24a;
buf.expandAt(_24a,_24a-mark);
};
_238.encodeAsByteArray=function(str){
var _250=new Array();
for(var i=0;i<str.length;i++){
var _252=str.charCodeAt(i);
if(_252<128){
_250.push(_252);
}else{
if(_252<2048){
_250.push((_252>>6)|192);
_250.push((_252&63)|128);
}else{
if(_252<65536){
_250.push((_252>>12)|224);
_250.push(((_252>>6)&63)|128);
_250.push((_252&63)|128);
}else{
if(_252<1114112){
_250.push((_252>>18)|240);
_250.push(((_252>>12)&63)|128);
_250.push(((_252>>6)&63)|128);
_250.push((_252&63)|128);
}else{
throw new Error("Invalid UTF-8 string");
}
}
}
}
}
return _250;
};
_238.encodeByteArray=function(_253){
var _254=_253.length;
var _255=[];
for(var i=0;i<_254;i++){
var _257=_253[i];
if(_257<128){
_255.push(_257);
}else{
if(_257<2048){
_255.push((_257>>6)|192);
_255.push((_257&63)|128);
}else{
if(_257<65536){
_255.push((_257>>12)|224);
_255.push(((_257>>6)&63)|128);
_255.push((_257&63)|128);
}else{
if(_257<1114112){
_255.push((_257>>18)|240);
_255.push(((_257>>12)&63)|128);
_255.push(((_257>>6)&63)|128);
_255.push((_257&63)|128);
}else{
throw new Error("Invalid UTF-8 string");
}
}
}
}
}
return String.fromCharCode.apply(null,_255);
};
_238.encodeArrayBuffer=function(_258){
var buf=new Uint8Array(_258);
var _25a=buf.length;
var _25b=[];
for(var i=0;i<_25a;i++){
var _25d=buf[i];
if(_25d<128){
_25b.push(_25d);
}else{
if(_25d<2048){
_25b.push((_25d>>6)|192);
_25b.push((_25d&63)|128);
}else{
if(_25d<65536){
_25b.push((_25d>>12)|224);
_25b.push(((_25d>>6)&63)|128);
_25b.push((_25d&63)|128);
}else{
if(_25d<1114112){
_25b.push((_25d>>18)|240);
_25b.push(((_25d>>12)&63)|128);
_25b.push(((_25d>>6)&63)|128);
_25b.push((_25d&63)|128);
}else{
throw new Error("Invalid UTF-8 string");
}
}
}
}
}
return String.fromCharCode.apply(null,_25b);
};
_238.toByteArray=function(str){
var _25f=[];
var _260,_261,_262,_263;
var _264=str.length;
for(var i=0;i<_264;i++){
_260=(str.charCodeAt(i)&255);
var _266=charByteCount(_260);
var _267=null;
if(_266+i>_264){
break;
}
switch(_266){
case 1:
_267=_260;
break;
case 2:
i++;
_261=(str.charCodeAt(i)&255);
_267=((_260&31)<<6)|(_261&63);
break;
case 3:
i++;
_261=(str.charCodeAt(i)&255);
i++;
_262=(str.charCodeAt(i)&255);
_267=((_260&15)<<12)|((_261&63)<<6)|(_262&63);
break;
case 4:
i++;
_261=(str.charCodeAt(i)&255);
i++;
_262=(str.charCodeAt(i)&255);
i++;
_263=(str.charCodeAt(i)&255);
_267=((_260&7)<<18)|((_261&63)<<12)|((_262&63)<<6)|(_263&63);
break;
}
_25f.push(_267&255);
}
return _25f;
};
function charByteCount(b){
if((b&128)===0){
return 1;
}
if((b&32)===0){
return 2;
}
if((b&16)===0){
return 3;
}
if((b&8)===0){
return 4;
}
throw new Error("Invalid UTF-8 bytes");
};
return new UTF8();
})();
})();
(function(){
var _269="WebSocket";
var _26a=function(name){
this._name=name;
this._level=_26a.Level.INFO;
};
(function(){
_26a.Level={OFF:8,SEVERE:7,WARNING:6,INFO:5,CONFIG:4,FINE:3,FINER:2,FINEST:1,ALL:0};
var _26c;
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name==="kaazing:logging"){
_26c=tags[i].content;
break;
}
}
_26a._logConf={};
if(_26c){
var _26f=_26c.split(",");
for(var i=0;i<_26f.length;i++){
var _270=_26f[i].split("=");
_26a._logConf[_270[0]]=_270[1];
}
}
var _271={};
_26a.getLogger=function(name){
var _273=_271[name];
if(_273===undefined){
_273=new _26a(name);
_271[name]=_273;
}
return _273;
};
var _274=_26a.prototype;
_274.setLevel=function(_275){
if(_275&&_275>=_26a.Level.ALL&&_275<=_26a.Level.OFF){
this._level=_275;
}
};
_274.isLoggable=function(_276){
for(var _277 in _26a._logConf){
if(_26a._logConf.hasOwnProperty(_277)){
if(this._name.match(_277)){
var _278=_26a._logConf[_277];
if(_278){
return (_26a.Level[_278]<=_276);
}
}
}
}
return (this._level<=_276);
};
var noop=function(){
};
var _27a={};
_27a[_26a.Level.OFF]=noop;
_27a[_26a.Level.SEVERE]=(window.console)?(console.error||console.log||noop):noop;
_27a[_26a.Level.WARNING]=(window.console)?(console.warn||console.log||noop):noop;
_27a[_26a.Level.INFO]=(window.console)?(console.info||console.log||noop):noop;
_27a[_26a.Level.CONFIG]=(window.console)?(console.info||console.log||noop):noop;
_27a[_26a.Level.FINE]=(window.console)?(console.debug||console.log||noop):noop;
_27a[_26a.Level.FINER]=(window.console)?(console.debug||console.log||noop):noop;
_27a[_26a.Level.FINEST]=(window.console)?(console.debug||console.log||noop):noop;
_27a[_26a.Level.ALL]=(window.console)?(console.log||noop):noop;
_274.config=function(_27b,_27c){
this.log(_26a.Level.CONFIG,_27b,_27c);
};
_274.entering=function(_27d,name,_27f){
if(this.isLoggable(_26a.Level.FINER)){
if(browser=="chrome"||browser=="safari"){
_27d=console;
}
var _280=_27a[_26a.Level.FINER];
if(_27f){
if(typeof (_280)=="object"){
_280("ENTRY "+name,_27f);
}else{
_280.call(_27d,"ENTRY "+name,_27f);
}
}else{
if(typeof (_280)=="object"){
_280("ENTRY "+name);
}else{
_280.call(_27d,"ENTRY "+name);
}
}
}
};
_274.exiting=function(_281,name,_283){
if(this.isLoggable(_26a.Level.FINER)){
var _284=_27a[_26a.Level.FINER];
if(browser=="chrome"||browser=="safari"){
_281=console;
}
if(_283){
if(typeof (_284)=="object"){
_284("RETURN "+name,_283);
}else{
_284.call(_281,"RETURN "+name,_283);
}
}else{
if(typeof (_284)=="object"){
_284("RETURN "+name);
}else{
_284.call(_281,"RETURN "+name);
}
}
}
};
_274.fine=function(_285,_286){
this.log(_26a.Level.FINE,_285,_286);
};
_274.finer=function(_287,_288){
this.log(_26a.Level.FINER,_287,_288);
};
_274.finest=function(_289,_28a){
this.log(_26a.Level.FINEST,_289,_28a);
};
_274.info=function(_28b,_28c){
this.log(_26a.Level.INFO,_28b,_28c);
};
_274.log=function(_28d,_28e,_28f){
if(this.isLoggable(_28d)){
var _290=_27a[_28d];
if(browser=="chrome"||browser=="safari"){
_28e=console;
}
if(typeof (_290)=="object"){
_290(_28f);
}else{
_290.call(_28e,_28f);
}
}
};
_274.severe=function(_291,_292){
this.log(_26a.Level.SEVERE,_291,_292);
};
_274.warning=function(_293,_294){
this.log(_26a.Level.WARNING,_293,_294);
};
})();
var ULOG=_26a.getLogger("com.kaazing.gateway.client.loader.Utils");
var _296=function(key){
ULOG.entering(this,"Utils.getMetaValue",key);
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name===key){
var v=tags[i].content;
ULOG.exiting(this,"Utils.getMetaValue",v);
return v;
}
}
ULOG.exiting(this,"Utils.getMetaValue");
};
var _29b=function(_29c){
ULOG.entering(this,"Utils.arrayCopy",_29c);
var _29d=[];
for(var i=0;i<_29c.length;i++){
_29d.push(_29c[i]);
}
return _29d;
};
var _29f=function(_2a0,_2a1){
ULOG.entering(this,"Utils.arrayFilter",{"array":_2a0,"callback":_2a1});
var _2a2=[];
for(var i=0;i<_2a0.length;i++){
var elt=_2a0[i];
if(_2a1(elt)){
_2a2.push(_2a0[i]);
}
}
return _2a2;
};
var _2a5=function(_2a6,_2a7){
ULOG.entering(this,"Utils.indexOf",{"array":_2a6,"searchElement":_2a7});
for(var i=0;i<_2a6.length;i++){
if(_2a6[i]==_2a7){
ULOG.exiting(this,"Utils.indexOf",i);
return i;
}
}
ULOG.exiting(this,"Utils.indexOf",-1);
return -1;
};
var _2a9=function(s){
ULOG.entering(this,"Utils.decodeByteString",s);
var a=[];
for(var i=0;i<s.length;i++){
a.push(s.charCodeAt(i)&255);
}
var buf=new ByteBuffer(a);
var v=_2af(buf,Charset.UTF8);
ULOG.exiting(this,"Utils.decodeByteString",v);
return v;
};
var _2b0=function(_2b1){
ULOG.entering(this,"Utils.decodeArrayBuffer",_2b1);
var buf=new Uint8Array(_2b1);
var a=[];
for(var i=0;i<buf.length;i++){
a.push(buf[i]);
}
var buf=new ByteBuffer(a);
var s=_2af(buf,Charset.UTF8);
ULOG.exiting(this,"Utils.decodeArrayBuffer",s);
return s;
};
var _2b6=function(_2b7){
ULOG.entering(this,"Utils.decodeArrayBuffer2ByteBuffer");
var buf=new Uint8Array(_2b7);
var a=[];
for(var i=0;i<buf.length;i++){
a.push(buf[i]);
}
ULOG.exiting(this,"Utils.decodeArrayBuffer2ByteBuffer");
return new ByteBuffer(a);
};
var _2bb=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _2bd="\n";
var _2be=function(buf){
ULOG.entering(this,"Utils.encodeEscapedByte",buf);
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(n);
switch(chr){
case _2bb:
a.push(_2bb);
a.push(_2bb);
break;
case NULL:
a.push(_2bb);
a.push("0");
break;
case _2bd:
a.push(_2bb);
a.push("n");
break;
default:
a.push(chr);
}
}
var v=a.join("");
ULOG.exiting(this,"Utils.encodeEscapedBytes",v);
return v;
};
var _2c4=function(buf,_2c6){
ULOG.entering(this,"Utils.encodeByteString",{"buf":buf,"requiresEscaping":_2c6});
if(_2c6){
return _2be(buf);
}else{
var _2c7=buf.array;
var _2c8=(buf.position==0&&buf.limit==_2c7.length)?_2c7:buf.getBytes(buf.remaining());
var _2c9=!(XMLHttpRequest.prototype.sendAsBinary);
for(var i=_2c8.length-1;i>=0;i--){
var _2cb=_2c8[i];
if(_2cb==0&&_2c9){
_2c8[i]=256;
}else{
if(_2cb<0){
_2c8[i]=_2cb&255;
}
}
}
var _2cc=0;
var _2cd=[];
do{
var _2ce=Math.min(_2c8.length-_2cc,10000);
partOfBytes=_2c8.slice(_2cc,_2cc+_2ce);
_2cc+=_2ce;
_2cd.push(String.fromCharCode.apply(null,partOfBytes));
}while(_2cc<_2c8.length);
var _2cf=_2cd.join("");
if(_2c8===_2c7){
for(var i=_2c8.length-1;i>=0;i--){
var _2cb=_2c8[i];
if(_2cb==256){
_2c8[i]=0;
}
}
}
ULOG.exiting(this,"Utils.encodeByteString",_2cf);
return _2cf;
}
};
var _2af=function(buf,cs){
var _2d2=buf.position;
var _2d3=buf.limit;
var _2d4=buf.array;
while(_2d2<_2d3){
_2d2++;
}
try{
buf.limit=_2d2;
return cs.decode(buf);
}
finally{
if(_2d2!=_2d3){
buf.limit=_2d3;
buf.position=_2d2+1;
}
}
};
var _2d5=window.WebSocket;
var _2d6=(function(){
var _2d7=_26a.getLogger("WebSocketNativeProxy");
var _2d8=function(){
this.parent;
this._listener;
this.code=1005;
this.reason="";
};
var _2d9=(browser=="safari"&&typeof (_2d5.CLOSING)=="undefined");
var _2da=_2d8.prototype;
_2da.connect=function(_2db,_2dc){
_2d7.entering(this,"WebSocketNativeProxy.<init>",{"location":_2db,"protocol":_2dc});
if(typeof (_2d5)==="undefined"){
doError(this);
return;
}
if(_2db.indexOf("javascript:")==0){
_2db=_2db.substr("javascript:".length);
}
var _2dd=_2db.indexOf("?");
if(_2dd!=-1){
if(!/[\?&]\.kl=Y/.test(_2db.substring(_2dd))){
_2db+="&.kl=Y";
}
}else{
_2db+="?.kl=Y";
}
this._sendQueue=[];
try{
if(_2dc){
this._requestedProtocol=_2dc;
this._delegate=new _2d5(_2db,_2dc);
}else{
this._delegate=new _2d5(_2db);
}
this._delegate.binaryType="arraybuffer";
}
catch(e){
_2d7.severe(this,"WebSocketNativeProxy.<init> "+e);
doError(this);
return;
}
bindHandlers(this);
};
_2da.onerror=function(){
};
_2da.onmessage=function(){
};
_2da.onopen=function(){
};
_2da.onclose=function(){
};
_2da.close=function(code,_2df){
_2d7.entering(this,"WebSocketNativeProxy.close");
if(code){
if(_2d9){
doCloseDraft76Compat(this,code,_2df);
}else{
this._delegate.close(code,_2df);
}
}else{
this._delegate.close();
}
};
function doCloseDraft76Compat(_2e0,code,_2e2){
_2e0.code=code|1005;
_2e0.reason=_2e2|"";
_2e0._delegate.close();
};
_2da.send=function(_2e3){
_2d7.entering(this,"WebSocketNativeProxy.send",_2e3);
doSend(this,_2e3);
return;
};
_2da.setListener=function(_2e4){
this._listener=_2e4;
};
_2da.setIdleTimeout=function(_2e5){
_2d7.entering(this,"WebSocketNativeProxy.setIdleTimeout",_2e5);
this.lastMessageTimestamp=new Date().getTime();
this.idleTimeout=_2e5;
startIdleTimer(this,_2e5);
return;
};
function doSend(_2e6,_2e7){
_2d7.entering(this,"WebSocketNativeProxy.doSend",_2e7);
if(typeof (_2e7)=="string"){
_2e6._delegate.send(_2e7);
}else{
if(_2e7.byteLength||_2e7.size){
_2e6._delegate.send(_2e7);
}else{
if(_2e7.constructor==ByteBuffer){
_2e6._delegate.send(_2e7.getArrayBuffer(_2e7.remaining()));
}else{
_2d7.severe(this,"WebSocketNativeProxy.doSend called with unkown type "+typeof (_2e7));
throw new Error("Cannot call send() with that type");
}
}
}
};
function doError(_2e8,e){
_2d7.entering(this,"WebSocketNativeProxy.doError",e);
setTimeout(function(){
_2e8._listener.connectionFailed(_2e8.parent);
},0);
};
function encodeMessageData(_2ea,e){
var buf;
if(typeof e.data.byteLength!=="undefined"){
buf=_2b6(e.data);
}else{
buf=ByteBuffer.allocate(e.data.length);
if(_2ea.parent._isBinary&&_2ea.parent._balanced>1){
for(var i=0;i<e.data.length;i++){
buf.put(e.data.charCodeAt(i));
}
}else{
buf.putString(e.data,Charset.UTF8);
}
buf.flip();
}
return buf;
};
function messageHandler(_2ee,e){
_2d7.entering(this,"WebSocketNativeProxy.messageHandler",e);
_2ee.lastMessageTimestamp=new Date().getTime();
if(typeof (e.data)==="string"){
_2ee._listener.textMessageReceived(_2ee.parent,e.data);
}else{
_2ee._listener.binaryMessageReceived(_2ee.parent,e.data);
}
};
function closeHandler(_2f0,e){
_2d7.entering(this,"WebSocketNativeProxy.closeHandler",e);
unbindHandlers(_2f0);
if(_2d9){
_2f0._listener.connectionClosed(_2f0.parent,true,_2f0.code,_2f0.reason);
}else{
_2f0._listener.connectionClosed(_2f0.parent,e.wasClean,e.code,e.reason);
}
};
function errorHandler(_2f2,e){
_2d7.entering(this,"WebSocketNativeProxy.errorHandler",e);
_2f2._listener.connectionError(_2f2.parent,e);
};
function openHandler(_2f4,e){
_2d7.entering(this,"WebSocketNativeProxy.openHandler",e);
if(_2d9){
_2f4._delegate.protocol=_2f4._requestedProtocol;
}
_2f4._listener.connectionOpened(_2f4.parent,_2f4._delegate.protocol);
};
function bindHandlers(_2f6){
_2d7.entering(this,"WebSocketNativeProxy.bindHandlers");
var _2f7=_2f6._delegate;
_2f7.onopen=function(e){
openHandler(_2f6,e);
};
_2f7.onmessage=function(e){
messageHandler(_2f6,e);
};
_2f7.onclose=function(e){
closeHandler(_2f6,e);
};
_2f7.onerror=function(e){
errorHandler(_2f6,e);
};
_2f6.readyState=function(){
return _2f7.readyState;
};
};
function unbindHandlers(_2fc){
_2d7.entering(this,"WebSocketNativeProxy.unbindHandlers");
var _2fd=_2fc._delegate;
_2fd.onmessage=undefined;
_2fd.onclose=undefined;
_2fd.onopen=undefined;
_2fd.onerror=undefined;
_2fc.readyState=WebSocket.CLOSED;
};
function startIdleTimer(_2fe,_2ff){
stopIdleTimer(_2fe);
_2fe.idleTimer=setTimeout(function(){
idleTimerHandler(_2fe);
},_2ff);
};
function idleTimerHandler(_300){
var _301=new Date().getTime();
var _302=_301-_300.lastMessageTimestamp;
var _303=_300.idleTimeout;
if(_302>_303){
try{
var _304=_300._delegate;
if(_304){
unbindHandlers(_300);
_304.close();
}
}
finally{
_300._listener.connectionClosed(_300.parent,false,1006,"");
}
}else{
startIdleTimer(_300,_303-_302);
}
};
function stopIdleTimer(_305){
if(_305.idleTimer!=null){
clearTimeout(_305.idleTimer);
_305.IdleTimer=null;
}
};
return _2d8;
})();
var _306=(function(){
var _307=_26a.getLogger("WebSocketEmulatedFlashProxy");
var _308=function(){
this.parent;
this._listener;
};
var _309=_308.prototype;
_309.connect=function(_30a,_30b){
_307.entering(this,"WebSocketEmulatedFlashProxy.<init>",_30a);
this.URL=_30a;
try{
_30c(this,_30a,_30b);
}
catch(e){
_307.severe(this,"WebSocketEmulatedFlashProxy.<init> "+e);
doError(this,e);
}
this.constructor=_308;
_307.exiting(this,"WebSocketEmulatedFlashProxy.<init>");
};
_309.setListener=function(_30d){
this._listener=_30d;
};
_308._flashBridge={};
_308._flashBridge.readyWaitQueue=[];
_308._flashBridge.failWaitQueue=[];
_308._flashBridge.flashHasLoaded=false;
_308._flashBridge.flashHasFailed=false;
_309.URL="";
_309.readyState=0;
_309.bufferedAmount=0;
_309.connectionOpened=function(_30e,_30f){
var _30f=_30f.split("\n");
for(var i=0;i<_30f.length;i++){
var _311=_30f[i].split(":");
_30e.responseHeaders[_311[0]]=_311[1];
}
this._listener.connectionOpened(_30e,"");
};
_309.connectionClosed=function(_312,_313,code,_315){
this._listener.connectionClosed(_312,_313,code,_315);
};
_309.connectionFailed=function(_316){
this._listener.connectionFailed(_316);
};
_309.binaryMessageReceived=function(_317,data){
this._listener.binaryMessageReceived(_317,data);
};
_309.textMessageReceived=function(_319,s){
this._listener.textMessageReceived(_319,s);
};
_309.redirected=function(_31b,_31c){
this._listener.redirected(_31b,_31c);
};
_309.authenticationRequested=function(_31d,_31e,_31f){
this._listener.authenticationRequested(_31d,_31e,_31f);
};
_309.send=function(data){
_307.entering(this,"WebSocketEmulatedFlashProxy.send",data);
switch(this.readyState){
case 0:
_307.severe(this,"WebSocketEmulatedFlashProxy.send: readyState is 0");
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
_307.severe(this,"WebSocketEmulatedFlashProxy.send: Data is null");
throw new Error("data is null");
}
if(typeof (data)=="string"){
_308._flashBridge.sendText(this._instanceId,data);
}else{
if(data.constructor==ByteBuffer){
var _321;
var a=[];
while(data.remaining()){
a.push(String.fromCharCode(data.get()));
}
var _321=a.join("");
_308._flashBridge.sendByteString(this._instanceId,_321);
}else{
if(data.byteLength){
var _321;
var a=[];
var _323=new DataView(data);
for(var i=0;i<data.byteLength;i++){
a.push(String.fromCharCode(_323.getUint8(i)));
}
var _321=a.join("");
_308._flashBridge.sendByteString(this._instanceId,_321);
}else{
if(data.size){
var _325=this;
var cb=function(_327){
_308._flashBridge.sendByteString(_325._instanceId,_327);
};
BlobUtils.asBinaryString(cb,data);
return;
}else{
_307.severe(this,"WebSocketEmulatedFlashProxy.send: Data is on invalid type "+typeof (data));
throw new Error("Invalid type");
}
}
}
}
_328(this);
return true;
break;
case 2:
return false;
break;
default:
_307.severe(this,"WebSocketEmulatedFlashProxy.send: Invalid readyState "+this.readyState);
throw new Error("INVALID_STATE_ERR");
}
};
_309.close=function(code,_32a){
_307.entering(this,"WebSocketEmulatedFlashProxy.close");
switch(this.readyState){
case 0:
case 1:
_308._flashBridge.disconnect(this._instanceId,code,_32a);
break;
}
};
_309.disconnect=_309.close;
var _328=function(_32b){
_307.entering(this,"WebSocketEmulatedFlashProxy.updateBufferedAmount");
_32b.bufferedAmount=_308._flashBridge.getBufferedAmount(_32b._instanceId);
if(_32b.bufferedAmount!=0){
setTimeout(function(){
_328(_32b);
},1000);
}
};
var _30c=function(_32c,_32d,_32e){
_307.entering(this,"WebSocketEmulatedFlashProxy.registerWebSocket",_32d);
var _32f=function(key,_331){
_331[key]=_32c;
_32c._instanceId=key;
};
var _332=function(){
doError(_32c);
};
var _333=[];
if(_32c.parent.requestHeaders&&_32c.parent.requestHeaders.length>0){
for(var i=0;i<_32c.parent.requestHeaders.length;i++){
_333.push(_32c.parent.requestHeaders[i].label+":"+_32c.parent.requestHeaders[i].value);
}
}
_308._flashBridge.registerWebSocketEmulated(_32d,_333.join("\n"),_32f,_332);
};
function doError(_335,e){
_307.entering(this,"WebSocketEmulatedFlashProxy.doError",e);
setTimeout(function(){
_335._listener.connectionFailed(_335.parent);
},0);
};
return _308;
})();
var _337=(function(){
var _338=_26a.getLogger("WebSocketRtmpFlashProxy");
var _339=function(){
this.parent;
this._listener;
};
var _33a=_339.prototype;
_33a.connect=function(_33b,_33c){
_338.entering(this,"WebSocketRtmpFlashProxy.<init>",_33b);
this.URL=_33b;
try{
_33d(this,_33b,_33c);
}
catch(e){
_338.severe(this,"WebSocketRtmpFlashProxy.<init> "+e);
doError(this,e);
}
this.constructor=_339;
_338.exiting(this,"WebSocketRtmpFlashProxy.<init>");
};
_33a.setListener=function(_33e){
this._listener=_33e;
};
_306._flashBridge={};
_306._flashBridge.readyWaitQueue=[];
_306._flashBridge.failWaitQueue=[];
_306._flashBridge.flashHasLoaded=false;
_306._flashBridge.flashHasFailed=false;
_33a.URL="";
_33a.readyState=0;
_33a.bufferedAmount=0;
_33a.connectionOpened=function(_33f,_340){
var _340=_340.split("\n");
for(var i=0;i<_340.length;i++){
var _342=_340[i].split(":");
_33f.responseHeaders[_342[0]]=_342[1];
}
this._listener.connectionOpened(_33f,"");
};
_33a.connectionClosed=function(_343,_344,code,_346){
this._listener.connectionClosed(_343,_344,code,_346);
};
_33a.connectionFailed=function(_347){
this._listener.connectionFailed(_347);
};
_33a.binaryMessageReceived=function(_348,data){
this._listener.binaryMessageReceived(_348,data);
};
_33a.textMessageReceived=function(_34a,s){
this._listener.textMessageReceived(_34a,s);
};
_33a.redirected=function(_34c,_34d){
this._listener.redirected(_34c,_34d);
};
_33a.authenticationRequested=function(_34e,_34f,_350){
this._listener.authenticationRequested(_34e,_34f,_350);
};
_33a.send=function(data){
_338.entering(this,"WebSocketRtmpFlashProxy.send",data);
switch(this.readyState){
case 0:
_338.severe(this,"WebSocketRtmpFlashProxy.send: readyState is 0");
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
_338.severe(this,"WebSocketRtmpFlashProxy.send: Data is null");
throw new Error("data is null");
}
if(typeof (data)=="string"){
_306._flashBridge.sendText(this._instanceId,data);
}else{
if(typeof (data.array)=="object"){
var _352;
var a=[];
var b;
while(data.remaining()){
b=data.get();
a.push(String.fromCharCode(b));
}
var _352=a.join("");
_306._flashBridge.sendByteString(this._instanceId,_352);
return;
}else{
_338.severe(this,"WebSocketRtmpFlashProxy.send: Data is on invalid type "+typeof (data));
throw new Error("Invalid type");
}
}
_355(this);
return true;
break;
case 2:
return false;
break;
default:
_338.severe(this,"WebSocketRtmpFlashProxy.send: Invalid readyState "+this.readyState);
throw new Error("INVALID_STATE_ERR");
}
};
_33a.close=function(code,_357){
_338.entering(this,"WebSocketRtmpFlashProxy.close");
switch(this.readyState){
case 1:
case 2:
_306._flashBridge.disconnect(this._instanceId,code,_357);
break;
}
};
_33a.disconnect=_33a.close;
var _355=function(_358){
_338.entering(this,"WebSocketRtmpFlashProxy.updateBufferedAmount");
_358.bufferedAmount=_306._flashBridge.getBufferedAmount(_358._instanceId);
if(_358.bufferedAmount!=0){
setTimeout(function(){
_355(_358);
},1000);
}
};
var _33d=function(_359,_35a,_35b){
_338.entering(this,"WebSocketRtmpFlashProxy.registerWebSocket",_35a);
var _35c=function(key,_35e){
_35e[key]=_359;
_359._instanceId=key;
};
var _35f=function(){
doError(_359);
};
var _360=[];
if(_359.parent.requestHeaders&&_359.parent.requestHeaders.length>0){
for(var i=0;i<_359.parent.requestHeaders.length;i++){
_360.push(_359.parent.requestHeaders[i].label+":"+_359.parent.requestHeaders[i].value);
}
}
_306._flashBridge.registerWebSocketRtmp(_35a,_360.join("\n"),_35c,_35f);
};
function doError(_362,e){
_338.entering(this,"WebSocketRtmpFlashProxy.doError",e);
setTimeout(function(){
_362._listener.connectionFailed(_362.parent);
},0);
};
return _339;
})();
(function(){
var _364=_26a.getLogger("com.kaazing.gateway.client.loader.FlashBridge");
var _365={};
_306._flashBridge.registerWebSocketEmulated=function(_366,_367,_368,_369){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.registerWebSocketEmulated",{"location":_366,"callback":_368,"errback":_369});
var _36a=function(){
var key=_306._flashBridge.doRegisterWebSocketEmulated(_366,_367);
_368(key,_365);
};
if(_306._flashBridge.flashHasLoaded){
if(_306._flashBridge.flashHasFailed){
_369();
}else{
_36a();
}
}else{
this.readyWaitQueue.push(_36a);
this.failWaitQueue.push(_369);
}
_364.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.registerWebSocketEmulated");
};
_306._flashBridge.doRegisterWebSocketEmulated=function(_36c,_36d){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.doRegisterWebSocketEmulated",{"location":_36c,"headers":_36d});
var key=_306._flashBridge.elt.registerWebSocketEmulated(_36c,_36d);
_364.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.doRegisterWebSocketEmulated",key);
return key;
};
_306._flashBridge.registerWebSocketRtmp=function(_36f,_370,_371,_372){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.registerWebSocketRtmp",{"location":_36f,"callback":_371,"errback":_372});
var _373=function(){
var key=_306._flashBridge.doRegisterWebSocketRtmp(_36f,_370);
_371(key,_365);
};
if(_306._flashBridge.flashHasLoaded){
if(_306._flashBridge.flashHasFailed){
_372();
}else{
_373();
}
}else{
this.readyWaitQueue.push(_373);
this.failWaitQueue.push(_372);
}
_364.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.registerWebSocketEmulated");
};
_306._flashBridge.doRegisterWebSocketRtmp=function(_375,_376){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.doRegisterWebSocketRtmp",{"location":_375,"protocol":_376});
var key=_306._flashBridge.elt.registerWebSocketRtmp(_375,_376);
_364.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.doRegisterWebSocketRtmp",key);
return key;
};
_306._flashBridge.onready=function(){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.onready");
var _378=_306._flashBridge.readyWaitQueue;
for(var i=0;i<_378.length;i++){
var _37a=_378[i];
_37a();
}
_364.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.onready");
};
_306._flashBridge.onfail=function(){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.onfail");
var _37b=_306._flashBridge.failWaitQueue;
for(var i=0;i<_37b.length;i++){
var _37d=_37b[i];
_37d();
}
_364.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.onfail");
};
_306._flashBridge.connectionOpened=function(key,_37f){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionOpened",key);
_365[key].readyState=1;
_365[key].connectionOpened(_365[key].parent,_37f);
_380();
_364.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionOpened");
};
_306._flashBridge.connectionClosed=function(key,_382,code,_384){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionClosed",key);
_365[key].readyState=2;
_365[key].connectionClosed(_365[key].parent,_382,code,_384);
_364.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionClosed");
};
_306._flashBridge.connectionFailed=function(key){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionFailed",key);
_365[key].connectionFailed(_365[key].parent);
_364.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionFailed");
};
_306._flashBridge.binaryMessageReceived=function(key,data){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.binaryMessageReceived",{"key":key,"data":data});
var _388=_365[key];
if(_388.readyState==1){
var buf=ByteBuffer.allocate(data.length);
for(var i=0;i<data.length;i++){
buf.put(data[i]);
}
buf.flip();
_388.binaryMessageReceived(_388.parent,buf);
}
_364.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.binaryMessageReceived");
};
_306._flashBridge.textMessageReceived=function(key,data){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.textMessageReceived",{"key":key,"data":data});
var _38d=_365[key];
if(_38d.readyState==1){
_38d.textMessageReceived(_38d.parent,unescape(data));
}
_364.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.textMessageReceived");
};
_306._flashBridge.redirected=function(key,_38f){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.redirected",{"key":key,"data":_38f});
var _390=_365[key];
_390.redirected(_390.parent,_38f);
_364.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.redirected");
};
_306._flashBridge.authenticationRequested=function(key,_392,_393){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.authenticationRequested",{"key":key,"data":_392});
var _394=_365[key];
_394.authenticationRequested(_394.parent,_392,_393);
_364.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.authenticationRequested");
};
var _380=function(){
_364.entering(this,"WebSocketEmulatedFlashProxy.killLoadingBar");
if(browser==="firefox"){
var e=document.createElement("iframe");
e.style.display="none";
document.body.appendChild(e);
document.body.removeChild(e);
}
};
_306._flashBridge.sendText=function(key,_397){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.sendText",{"key":key,"message":_397});
this.elt.processTextMessage(key,escape(_397));
setTimeout(_380,200);
};
_306._flashBridge.sendByteString=function(key,_399){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.sendByteString",{"key":key,"message":_399});
this.elt.processBinaryMessage(key,escape(_399));
setTimeout(_380,200);
};
_306._flashBridge.disconnect=function(key,code,_39c){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.disconnect",key);
this.elt.processClose(key,code,_39c);
};
_306._flashBridge.getBufferedAmount=function(key){
_364.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.getBufferedAmount",key);
var v=this.elt.getBufferedAmount(key);
_364.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.getBufferedAmount",v);
return v;
};
})();
(function(){
var _39f=function(_3a0){
var self=this;
var _3a2=3000;
var ID="Loader";
var ie=false;
var _3a5=-1;
self.elt=null;
var _3a6=function(){
var exp=new RegExp(".*"+_3a0+".*.js$");
var _3a8=document.getElementsByTagName("script");
for(var i=0;i<_3a8.length;i++){
if(_3a8[i].src){
var name=(_3a8[i].src).match(exp);
if(name){
name=name.pop();
var _3ab=name.split("/");
_3ab.pop();
if(_3ab.length>0){
return _3ab.join("/")+"/";
}else{
return "";
}
}
}
}
};
var _3ac=_3a6();
var _3ad=_3ac+"Loader.swf";
self.loader=function(){
var _3ae="flash";
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name==="kaazing:upgrade"){
_3ae=tags[i].content;
}
}
if(_3ae!="flash"||!_3b1([9,0,115])){
_3b2();
}else{
_3a5=setTimeout(_3b2,_3a2);
_3b3();
}
};
self.clearFlashTimer=function(){
clearTimeout(_3a5);
_3a5="cleared";
setTimeout(function(){
_3b4(self.elt.handshake(_3a0));
},0);
};
var _3b4=function(_3b5){
if(_3b5){
_306._flashBridge.flashHasLoaded=true;
_306._flashBridge.elt=self.elt;
_306._flashBridge.onready();
}else{
_3b2();
}
window.___Loader=undefined;
};
var _3b2=function(){
_306._flashBridge.flashHasLoaded=true;
_306._flashBridge.flashHasFailed=true;
_306._flashBridge.onfail();
};
var _3b6=function(){
var _3b7=null;
if(typeof (ActiveXObject)!="undefined"){
try{
ie=true;
var swf=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
var _3b9=swf.GetVariable("$version");
var _3ba=_3b9.split(" ")[1].split(",");
_3b7=[];
for(var i=0;i<_3ba.length;i++){
_3b7[i]=parseInt(_3ba[i]);
}
}
catch(e){
ie=false;
}
}
if(typeof navigator.plugins!="undefined"){
if(typeof navigator.plugins["Shockwave Flash"]!="undefined"){
var _3b9=navigator.plugins["Shockwave Flash"].description;
_3b9=_3b9.replace(/\s*r/g,".");
var _3ba=_3b9.split(" ")[2].split(".");
_3b7=[];
for(var i=0;i<_3ba.length;i++){
_3b7[i]=parseInt(_3ba[i]);
}
}
}
var _3bc=navigator.userAgent;
if(_3b7!==null&&_3b7[0]===10&&_3b7[1]===0&&_3bc.indexOf("Windows NT 6.0")!==-1){
_3b7=null;
}
if(_3bc.indexOf("MSIE 6.0")==-1&&_3bc.indexOf("MSIE 7.0")==-1){
if(_3bc.indexOf("MSIE 8.0")>0||_3bc.indexOf("MSIE 9.0")>0){
if(typeof (XDomainRequest)!=="undefined"){
_3b7=null;
}
}else{
_3b7=null;
}
}
return _3b7;
};
var _3b1=function(_3bd){
var _3be=_3b6();
if(_3be==null){
return false;
}
for(var i=0;i<Math.max(_3be.length,_3bd.length);i++){
var _3c0=_3be[i]-_3bd[i];
if(_3c0!=0){
return (_3c0>0)?true:false;
}
}
return true;
};
var _3b3=function(){
if(ie){
var elt=document.createElement("div");
document.body.appendChild(elt);
elt.outerHTML="<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" height=\"0\" width=\"0\" id=\""+ID+"\"><param name=\"movie\" value=\""+_3ad+"\"></param></object>";
self.elt=document.getElementById(ID);
}else{
var elt=document.createElement("object");
elt.setAttribute("type","application/x-shockwave-flash");
elt.setAttribute("width",0);
elt.setAttribute("height",0);
elt.setAttribute("id",ID);
elt.setAttribute("data",_3ad);
document.body.appendChild(elt);
self.elt=elt;
}
};
self.attachToOnload=function(_3c2){
if(window.addEventListener){
window.addEventListener("load",_3c2,true);
}else{
if(window.attachEvent){
window.attachEvent("onload",_3c2);
}else{
onload=_3c2;
}
}
};
if(document.readyState==="complete"){
self.loader();
}else{
self.attachToOnload(self.loader);
}
};
var _3c3=(function(){
var _3c4=function(_3c5){
this.HOST=new _3c4(0);
this.USERINFO=new _3c4(1);
this.PORT=new _3c4(2);
this.PATH=new _3c4(3);
this.ordinal=_3c5;
};
return _3c4;
})();
var _3c6=(function(){
var _3c7=function(){
};
_3c7.getRealm=function(_3c8){
var _3c9=_3c8.authenticationParameters;
if(_3c9==null){
return null;
}
var _3ca=/realm=(\"(.*)\")/i;
var _3cb=_3ca.exec(_3c9);
return (_3cb!=null&&_3cb.length>=3)?_3cb[2]:null;
};
return _3c7;
})();
function Dictionary(){
this.Keys=new Array();
};
var _3cc=(function(){
var _3cd=function(_3ce){
this.weakKeys=_3ce;
this.elements=[];
this.dictionary=new Dictionary();
};
var _3cf=_3cd.prototype;
_3cf.getlength=function(){
return this.elements.length;
};
_3cf.getItemAt=function(_3d0){
return this.dictionary[this.elements[_3d0]];
};
_3cf.get=function(key){
var _3d2=this.dictionary[key];
if(_3d2==undefined){
_3d2=null;
}
return _3d2;
};
_3cf.remove=function(key){
for(var i=0;i<this.elements.length;i++){
var _3d5=(this.weakKeys&&(this.elements[i]==key));
var _3d6=(!this.weakKeys&&(this.elements[i]===key));
if(_3d5||_3d6){
this.elements.remove(i);
this.dictionary[this.elements[i]]=undefined;
break;
}
}
};
_3cf.put=function(key,_3d8){
this.remove(key);
this.elements.push(key);
this.dictionary[key]=_3d8;
};
_3cf.isEmpty=function(){
return this.length==0;
};
_3cf.containsKey=function(key){
for(var i=0;i<this.elements.length;i++){
var _3db=(this.weakKeys&&(this.elements[i]==key));
var _3dc=(!this.weakKeys&&(this.elements[i]===key));
if(_3db||_3dc){
return true;
}
}
return false;
};
_3cf.keySet=function(){
return this.elements;
};
_3cf.getvalues=function(){
var _3dd=[];
for(var i=0;i<this.elements.length;i++){
_3dd.push(this.dictionary[this.elements[i]]);
}
return _3dd;
};
return _3cd;
})();
var Node=(function(){
var Node=function(){
this.name="";
this.kind="";
this.values=[];
this.children=new _3cc();
};
var _3e1=Node.prototype;
_3e1.getWildcardChar=function(){
return "*";
};
_3e1.addChild=function(name,kind){
if(name==null||name.length==0){
throw new ArgumentError("A node may not have a null name.");
}
var _3e4=Node.createNode(name,this,kind);
this.children.put(name,_3e4);
return _3e4;
};
_3e1.hasChild=function(name,kind){
return null!=this.getChild(name)&&kind==this.getChild(name).kind;
};
_3e1.getChild=function(name){
return this.children.get(name);
};
_3e1.getDistanceFromRoot=function(){
var _3e8=0;
var _3e9=this;
while(!_3e9.isRootNode()){
_3e8++;
_3e9=_3e9.parent;
}
return _3e8;
};
_3e1.appendValues=function(){
if(this.isRootNode()){
throw new ArgumentError("Cannot set a values on the root node.");
}
if(this.values!=null){
for(var k=0;k<arguments.length;k++){
var _3eb=arguments[k];
this.values.push(_3eb);
}
}
};
_3e1.removeValue=function(_3ec){
if(this.isRootNode()){
return;
}
for(var i=0;i<this.values.length;i++){
if(this.values[i]==_3ec){
this.values.splice(i,1);
}
}
};
_3e1.getValues=function(){
return this.values;
};
_3e1.hasValues=function(){
return this.values!=null&&this.values.length>0;
};
_3e1.isRootNode=function(){
return this.parent==null;
};
_3e1.hasChildren=function(){
return this.children!=null&&this.children.getlength()>0;
};
_3e1.isWildcard=function(){
return this.name!=null&&this.name==this.getWildcardChar();
};
_3e1.hasWildcardChild=function(){
return this.hasChildren()&&this.children.containsKey(this.getWildcardChar());
};
_3e1.getFullyQualifiedName=function(){
var b=new String();
var name=[];
var _3f0=this;
while(!_3f0.isRootNode()){
name.push(_3f0.name);
_3f0=_3f0.parent;
}
name=name.reverse();
for(var k=0;k<name.length;k++){
b+=name[k];
b+=".";
}
if(b.length>=1&&b.charAt(b.length-1)=="."){
b=b.slice(0,b.length-1);
}
return b.toString();
};
_3e1.getChildrenAsList=function(){
return this.children.getvalues();
};
_3e1.findBestMatchingNode=function(_3f2,_3f3){
var _3f4=this.findAllMatchingNodes(_3f2,_3f3);
var _3f5=null;
var _3f6=0;
for(var i=0;i<_3f4.length;i++){
var node=_3f4[i];
if(node.getDistanceFromRoot()>_3f6){
_3f6=node.getDistanceFromRoot();
_3f5=node;
}
}
return _3f5;
};
_3e1.findAllMatchingNodes=function(_3f9,_3fa){
var _3fb=[];
var _3fc=this.getChildrenAsList();
for(var i=0;i<_3fc.length;i++){
var node=_3fc[i];
var _3ff=node.matches(_3f9,_3fa);
if(_3ff<0){
continue;
}
if(_3ff>=_3f9.length){
do{
if(node.hasValues()){
_3fb.push(node);
}
if(node.hasWildcardChild()){
var _400=node.getChild(this.getWildcardChar());
if(_400.kind!=this.kind){
node=null;
}else{
node=_400;
}
}else{
node=null;
}
}while(node!=null);
}else{
var _401=node.findAllMatchingNodes(_3f9,_3ff);
for(var j=0;j<_401.length;j++){
_3fb.push(_401[j]);
}
}
}
return _3fb;
};
_3e1.matches=function(_403,_404){
if(_404<0||_404>=_403.length){
return -1;
}
if(this.matchesToken(_403[_404])){
return _404+1;
}
if(!this.isWildcard()){
return -1;
}else{
if(this.kind!=_403[_404].kind){
return -1;
}
do{
_404++;
}while(_404<_403.length&&this.kind==_403[_404].kind);
return _404;
}
};
_3e1.matchesToken=function(_405){
return this.name==_405.name&&this.kind==_405.kind;
};
Node.createNode=function(name,_407,kind){
var node=new Node();
node.name=name;
node.parent=_407;
node.kind=kind;
return node;
};
return Node;
})();
var _40a=(function(){
var _40b=function(name,kind){
this.kind=kind;
this.name=name;
};
return _40b;
})();
window.Oid=(function(){
var Oid=function(data){
this.rep=data;
};
var _410=Oid.prototype;
_410.asArray=function(){
return this.rep;
};
_410.asString=function(){
var s="";
for(var i=0;i<this.rep.length;i++){
s+=(this.rep[i].toString());
s+=".";
}
if(s.length>0&&s.charAt(s.length-1)=="."){
s=s.slice(0,s.length-1);
}
return s;
};
Oid.create=function(data){
return new Oid(data.split("."));
};
return Oid;
})();
var _414=(function(){
var _415=function(){
};
_415.create=function(_416,_417,_418){
var _419=_416+":"+_417;
var _41a=[];
for(var i=0;i<_419.length;++i){
_41a.push(_419.charCodeAt(i));
}
var _41c="Basic "+Base64.encode(_41a);
return new ChallengeResponse(_41c,_418);
};
return _415;
})();
function InternalDefaultChallengeHandler(){
this.canHandle=function(_41d){
return false;
};
this.handle=function(_41e,_41f){
_41f(null);
};
};
window.PasswordAuthentication=(function(){
function PasswordAuthentication(_420,_421){
this.username=_420;
this.password=_421;
};
PasswordAuthentication.prototype.clear=function(){
this.username=null;
this.password=null;
};
return PasswordAuthentication;
})();
window.ChallengeRequest=(function(){
var _422=function(_423,_424){
if(_423==null){
throw new Error("location is not defined.");
}
if(_424==null){
return;
}
var _425="Application ";
if(_424.indexOf(_425)==0){
_424=_424.substring(_425.length);
}
this.location=_423;
this.authenticationParameters=null;
var _426=_424.indexOf(" ");
if(_426==-1){
this.authenticationScheme=_424;
}else{
this.authenticationScheme=_424.substring(0,_426);
if(_424.length>_426+1){
this.authenticationParameters=_424.substring(_426+1);
}
}
};
return _422;
})();
window.ChallengeResponse=(function(){
var _427=function(_428,_429){
this.credentials=_428;
this.nextChallengeHandler=_429;
};
var _42a=_427.prototype;
_42a.clearCredentials=function(){
if(this.credentials!=null){
this.credentials=null;
}
};
return _427;
})();
window.BasicChallengeHandler=(function(){
var _42b=function(){
this.loginHandler=undefined;
this.loginHandlersByRealm={};
};
var _42c=_42b.prototype;
_42c.setRealmLoginHandler=function(_42d,_42e){
if(_42d==null){
throw new ArgumentError("null realm");
}
if(_42e==null){
throw new ArgumentError("null loginHandler");
}
this.loginHandlersByRealm[_42d]=_42e;
return this;
};
_42c.canHandle=function(_42f){
return _42f!=null&&"Basic"==_42f.authenticationScheme;
};
_42c.handle=function(_430,_431){
if(_430.location!=null){
var _432=this.loginHandler;
var _433=_3c6.getRealm(_430);
if(_433!=null&&this.loginHandlersByRealm[_433]!=null){
_432=this.loginHandlersByRealm[_433];
}
var _434=this;
if(_432!=null){
_432(function(_435){
if(_435!=null&&_435.username!=null){
_431(_414.create(_435.username,_435.password,_434));
}else{
_431(null);
}
});
return;
}
}
_431(null);
};
_42c.loginHandler=function(_436){
_436(null);
};
return _42b;
})();
window.DispatchChallengeHandler=(function(){
var _437=function(){
this.rootNode=new Node();
var _438="^(.*)://(.*)";
this.SCHEME_URI_PATTERN=new RegExp(_438);
};
function delChallengeHandlerAtLocation(_439,_43a,_43b){
var _43c=tokenize(_43a);
var _43d=_439;
for(var i=0;i<_43c.length;i++){
var _43f=_43c[i];
if(!_43d.hasChild(_43f.name,_43f.kind)){
return;
}else{
_43d=_43d.getChild(_43f.name);
}
}
_43d.removeValue(_43b);
};
function addChallengeHandlerAtLocation(_440,_441,_442){
var _443=tokenize(_441);
var _444=_440;
for(var i=0;i<_443.length;i++){
var _446=_443[i];
if(!_444.hasChild(_446.name,_446.kind)){
_444=_444.addChild(_446.name,_446.kind);
}else{
_444=_444.getChild(_446.name);
}
}
_444.appendValues(_442);
};
function lookupByLocation(_447,_448){
var _449=new Array();
if(_448!=null){
var _44a=findBestMatchingNode(_447,_448);
if(_44a!=null){
return _44a.values;
}
}
return _449;
};
function lookupByRequest(_44b,_44c){
var _44d=null;
var _44e=_44c.location;
if(_44e!=null){
var _44f=findBestMatchingNode(_44b,_44e);
if(_44f!=null){
var _450=_44f.getValues();
if(_450!=null){
for(var i=0;i<_450.length;i++){
var _452=_450[i];
if(_452.canHandle(_44c)){
_44d=_452;
break;
}
}
}
}
}
return _44d;
};
function findBestMatchingNode(_453,_454){
var _455=tokenize(_454);
var _456=0;
return _453.findBestMatchingNode(_455,_456);
};
function tokenize(uri){
var _458=new Array();
if(uri==null||uri.length==0){
return _458;
}
var _459=new RegExp("^(([^:/?#]+):(//))?([^/?#]*)?([^?#]*)(\\?([^#]*))?(#(.*))?");
var _45a=_459.exec(uri);
if(_45a==null){
return _458;
}
var _45b=_45a[2]||"http";
var _45c=_45a[4];
var path=_45a[5];
var _45e=null;
var _45f=null;
var _460=null;
var _461=null;
if(_45c!=null){
var host=_45c;
var _463=host.indexOf("@");
if(_463>=0){
_45f=host.substring(0,_463);
host=host.substring(_463+1);
var _464=_45f.indexOf(":");
if(_464>=0){
_460=_45f.substring(0,_464);
_461=_45f.substring(_464+1);
}
}
var _465=host.indexOf(":");
if(_465>=0){
_45e=host.substring(_465+1);
host=host.substring(0,_465);
}
}else{
throw new ArgumentError("Hostname is required.");
}
var _466=host.split(/\./);
_466.reverse();
for(var k=0;k<_466.length;k++){
_458.push(new _40a(_466[k],_3c3.HOST));
}
if(_45e!=null){
_458.push(new _40a(_45e,_3c3.PORT));
}else{
if(getDefaultPort(_45b)>0){
_458.push(new _40a(getDefaultPort(_45b).toString(),_3c3.PORT));
}
}
if(_45f!=null){
if(_460!=null){
_458.push(new _40a(_460,_3c3.USERINFO));
}
if(_461!=null){
_458.push(new _40a(_461,_3c3.USERINFO));
}
if(_460==null&&_461==null){
_458.push(new _40a(_45f,_3c3.USERINFO));
}
}
if(isNotBlank(path)){
if(path.charAt(0)=="/"){
path=path.substring(1);
}
if(isNotBlank(path)){
var _468=path.split("/");
for(var p=0;p<_468.length;p++){
var _46a=_468[p];
_458.push(new _40a(_46a,_3c3.PATH));
}
}
}
return _458;
};
function getDefaultPort(_46b){
if(defaultPortsByScheme[_46b.toLowerCase()]!=null){
return defaultPortsByScheme[_46b];
}else{
return -1;
}
};
function defaultPortsByScheme(){
http=80;
ws=80;
wss=443;
https=443;
};
function isNotBlank(s){
return s!=null&&s.length>0;
};
var _46d=_437.prototype;
_46d.clear=function(){
this.rootNode=new Node();
};
_46d.canHandle=function(_46e){
return lookupByRequest(this.rootNode,_46e)!=null;
};
_46d.handle=function(_46f,_470){
var _471=lookupByRequest(this.rootNode,_46f);
if(_471==null){
return null;
}
return _471.handle(_46f,_470);
};
_46d.register=function(_472,_473){
if(_472==null||_472.length==0){
throw new Error("Must specify a location to handle challenges upon.");
}
if(_473==null){
throw new Error("Must specify a handler to handle challenges.");
}
addChallengeHandlerAtLocation(this.rootNode,_472,_473);
return this;
};
_46d.unregister=function(_474,_475){
if(_474==null||_474.length==0){
throw new Error("Must specify a location to un-register challenge handlers upon.");
}
if(_475==null){
throw new Error("Must specify a handler to un-register.");
}
delChallengeHandlerAtLocation(this.rootNode,_474,_475);
return this;
};
return _437;
})();
window.NegotiableChallengeHandler=(function(){
var _476=function(){
this.candidateChallengeHandlers=new Array();
};
var _477=function(_478){
var oids=new Array();
for(var i=0;i<_478.length;i++){
oids.push(Oid.create(_478[i]).asArray());
}
var _47b=GssUtils.sizeOfSpnegoInitialContextTokenWithOids(null,oids);
var _47c=ByteBuffer.allocate(_47b);
_47c.skip(_47b);
GssUtils.encodeSpnegoInitialContextTokenWithOids(null,oids,_47c);
return ByteArrayUtils.arrayToByteArray(Base64Util.encodeBuffer(_47c));
};
var _47d=_476.prototype;
_47d.register=function(_47e){
if(_47e==null){
throw new Error("handler is null");
}
for(var i=0;i<this.candidateChallengeHandlers.length;i++){
if(_47e===this.candidateChallengeHandlers[i]){
return this;
}
}
this.candidateChallengeHandlers.push(_47e);
return this;
};
_47d.canHandle=function(_480){
return _480!=null&&_480.authenticationScheme=="Negotiate"&&_480.authenticationParameters==null;
};
_47d.handle=function(_481,_482){
if(_481==null){
throw Error(new ArgumentError("challengeRequest is null"));
}
var _483=new _3cc();
for(var i=0;i<this.candidateChallengeHandlers.length;i++){
var _485=this.candidateChallengeHandlers[i];
if(_485.canHandle(_481)){
try{
var _486=_485.getSupportedOids();
for(var j=0;j<_486.length;j++){
var oid=new Oid(_486[j]).asString();
if(!_483.containsKey(oid)){
_483.put(oid,_485);
}
}
}
catch(e){
}
}
}
if(_483.isEmpty()){
_482(null);
return;
}
};
return _476;
})();
window.NegotiableChallengeHandler=(function(){
var _489=function(){
this.loginHandler=undefined;
};
_489.prototype.getSupportedOids=function(){
return new Array();
};
return _489;
})();
window.NegotiableChallengeHandler=(function(){
var _48a=function(){
this.loginHandler=undefined;
};
_48a.prototype.getSupportedOids=function(){
return new Array();
};
return _48a;
})();
var _48b={};
(function(){
var _48c=_26a.getLogger("com.kaazing.gateway.client.html5.Windows1252");
var _48d={8364:128,129:129,8218:130,402:131,8222:132,8230:133,8224:134,8225:135,710:136,8240:137,352:138,8249:139,338:140,141:141,381:142,143:143,144:144,8216:145,8217:146,8220:147,8221:148,8226:149,8211:150,8212:151,732:152,8482:153,353:154,8250:155,339:156,157:157,382:158,376:159};
var _48e={128:8364,129:129,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,141:141,142:381,143:143,144:144,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,157:157,158:382,159:376};
_48b.toCharCode=function(n){
if(n<128||(n>159&&n<256)){
return n;
}else{
var _490=_48e[n];
if(typeof (_490)=="undefined"){
_48c.severe(this,"Windows1252.toCharCode: Error: Could not find "+n);
throw new Error("Windows1252.toCharCode could not find: "+n);
}
return _490;
}
};
_48b.fromCharCode=function(code){
if(code<256){
return code;
}else{
var _492=_48d[code];
if(typeof (_492)=="undefined"){
_48c.severe(this,"Windows1252.fromCharCode: Error: Could not find "+code);
throw new Error("Windows1252.fromCharCode could not find: "+code);
}
return _492;
}
};
var _493=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _495="\n";
var _496=function(s){
_48c.entering(this,"Windows1252.escapedToArray",s);
var a=[];
for(var i=0;i<s.length;i++){
var code=_48b.fromCharCode(s.charCodeAt(i));
if(code==127){
i++;
if(i==s.length){
a.hasRemainder=true;
break;
}
var _49b=_48b.fromCharCode(s.charCodeAt(i));
switch(_49b){
case 127:
a.push(127);
break;
case 48:
a.push(0);
break;
case 110:
a.push(10);
break;
case 114:
a.push(13);
break;
default:
_48c.severe(this,"Windows1252.escapedToArray: Error: Escaping format error");
throw new Error("Escaping format error");
}
}else{
a.push(code);
}
}
return a;
};
var _49c=function(buf){
_48c.entering(this,"Windows1252.toEscapedByteString",buf);
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(_48b.toCharCode(n));
switch(chr){
case _493:
a.push(_493);
a.push(_493);
break;
case NULL:
a.push(_493);
a.push("0");
break;
case _495:
a.push(_493);
a.push("n");
break;
default:
a.push(chr);
}
}
return a.join("");
};
_48b.toArray=function(s,_4a2){
_48c.entering(this,"Windows1252.toArray",{"s":s,"escaped":_4a2});
if(_4a2){
return _496(s);
}else{
var a=[];
for(var i=0;i<s.length;i++){
a.push(_48b.fromCharCode(s.charCodeAt(i)));
}
return a;
}
};
_48b.toByteString=function(buf,_4a6){
_48c.entering(this,"Windows1252.toByteString",{"buf":buf,"escaped":_4a6});
if(_4a6){
return _49c(buf);
}else{
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
a.push(String.fromCharCode(_48b.toCharCode(n)));
}
return a.join("");
}
};
})();
function CloseEvent(_4a9,_4aa,_4ab,_4ac){
this.reason=_4ac;
this.code=_4ab;
this.wasClean=_4aa;
this.type="close";
this.bubbles=true;
this.cancelable=true;
this.target=_4a9;
};
function MessageEvent(_4ad,_4ae,_4af){
return {target:_4ad,data:_4ae,origin:_4af,bubbles:true,cancelable:true,type:"message",lastEventId:""};
};
(function(){
if(typeof (Blob)!=="undefined"){
try{
var temp=new Blob(["Blob"]);
return;
}
catch(e){
}
}
var _4b1=function(_4b2,_4b3){
var _4b4=_4b3||{};
if(window.WebKitBlobBuilder){
var _4b5=new window.WebKitBlobBuilder();
for(var i=0;i<_4b2.length;i++){
var part=_4b2[i];
if(_4b4.endings){
_4b5.append(part,_4b4.endings);
}else{
_4b5.append(part);
}
}
var blob;
if(_4b4.type){
blob=_4b5.getBlob(type);
}else{
blob=_4b5.getBlob();
}
blob.slice=blob.webkitSlice||blob.slice;
return blob;
}else{
if(window.MozBlobBuilder){
var _4b5=new window.MozBlobBuilder();
for(var i=0;i<_4b2.length;i++){
var part=_4b2[i];
if(_4b4.endings){
_4b5.append(part,_4b4.endings);
}else{
_4b5.append(part);
}
}
var blob;
if(_4b4.type){
blob=_4b5.getBlob(type);
}else{
blob=_4b5.getBlob();
}
blob.slice=blob.mozSlice||blob.slice;
return blob;
}else{
var _4b9=[];
for(var i=0;i<_4b2.length;i++){
var part=_4b2[i];
if(typeof part==="string"){
var b=BlobUtils.fromString(part,_4b4.endings);
_4b9.push(b);
}else{
if(part.byteLength){
var _4bb=new Uint8Array(part);
for(var i=0;i<part.byteLength;i++){
_4b9.push(_4bb[i]);
}
}else{
if(part.length){
_4b9.push(part);
}else{
if(part._array){
_4b9.push(part._array);
}else{
throw new Error("invalid type in Blob constructor");
}
}
}
}
}
var blob=concatMemoryBlobs(_4b9);
blob.type=_4b4.type;
return blob;
}
}
};
function MemoryBlob(_4bc,_4bd){
return {_array:_4bc,size:_4bc.length,type:_4bd||"",slice:function(_4be,end,_4c0){
var a=this._array.slice(_4be,end);
return MemoryBlob(a,_4c0);
},toString:function(){
return "MemoryBlob: "+_4bc.toString();
}};
};
function concatMemoryBlobs(_4c2){
var a=Array.prototype.concat.apply([],_4c2);
return new MemoryBlob(a);
};
window.Blob=_4b1;
})();
(function(_4c4){
_4c4.BlobUtils={};
BlobUtils.asString=function asString(blob,_4c6,end){
if(blob._array){
}else{
if(FileReader){
var _4c8=new FileReader();
_4c8.readAsText(blob);
_4c8.onload=function(){
cb(_4c8.result);
};
_4c8.onerror=function(e){
console.log(e,_4c8);
};
}
}
};
BlobUtils.asNumberArray=function asNumberArray(cb,blob){
if(blob._array){
setTimeout(function(){
cb(blob._array);
},0);
}else{
if(FileReader){
var _4cc=new FileReader();
_4cc.readAsArrayBuffer(blob);
_4cc.onload=function(){
var _4cd=new DataView(_4cc.result);
var a=[];
for(var i=0;i<_4cc.result.byteLength;i++){
a.push(_4cd.getUint8(i));
}
cb(a);
};
}else{
throw new Error("Cannot convert Blob to binary string");
}
}
};
BlobUtils.asBinaryString=function asBinaryString(cb,blob){
if(blob._array){
var _4d2=blob._array;
var a=[];
for(var i=0;i<_4d2.length;i++){
a.push(String.fromCharCode(_4d2[i]));
}
setTimeout(function(){
cb(a.join(""));
},0);
}else{
if(FileReader){
var _4d5=new FileReader();
if(_4d5.readAsBinaryString){
_4d5.readAsBinaryString(blob);
_4d5.onload=function(){
cb(_4d5.result);
};
}else{
_4d5.readAsArrayBuffer(blob);
_4d5.onload=function(){
var _4d6=new DataView(_4d5.result);
var a=[];
for(var i=0;i<_4d5.result.byteLength;i++){
a.push(String.fromCharCode(_4d6.getUint8(i)));
}
cb(a.join(""));
};
}
}else{
throw new Error("Cannot convert Blob to binary string");
}
}
};
BlobUtils.fromBinaryString=function fromByteString(s){
var _4da=[];
for(var i=0;i<s.length;i++){
_4da.push(s.charCodeAt(i));
}
return BlobUtils.fromNumberArray(_4da);
};
BlobUtils.fromNumberArray=function fromNumberArray(a){
if(typeof (Uint8Array)!=="undefined"){
return new Blob([new Uint8Array(a)]);
}else{
return new Blob([a]);
}
};
BlobUtils.fromString=function fromString(s,_4de){
if(_4de&&_4de==="native"){
if(navigator.userAgent.indexOf("Windows")!=-1){
s=s.replace("\r\n","\n","g").replace("\n","\r\n","g");
}
}
var buf=new ByteBuffer();
Charset.UTF8.encode(s,buf);
var a=buf.array;
return BlobUtils.fromNumberArray(a);
};
})(window);
var _4e1=function(){
this._queue=[];
this._count=0;
this.completion;
};
_4e1.prototype.enqueue=function(cb){
var _4e3=this;
var _4e4={};
_4e4.cb=cb;
_4e4.id=this._count++;
this._queue.push(_4e4);
var func=function(){
_4e3.processQueue(_4e4.id,cb,arguments);
};
return func;
};
_4e1.prototype.processQueue=function(id,cb,args){
for(var i=0;i<this._queue.length;i++){
if(this._queue[i].id==id){
this._queue[i].args=args;
break;
}
}
while(this._queue.length&&this._queue[0].args!==undefined){
var _4ea=this._queue.shift();
_4ea.cb.apply(null,_4ea.args);
}
};
var _4eb=(function(){
var _4ec=function(_4ed,_4ee){
this.label=_4ed;
this.value=_4ee;
};
return _4ec;
})();
var _4ef=(function(){
var _4f0=function(_4f1){
var uri=new URI(_4f1);
if(isValidScheme(uri.scheme)){
this._uri=uri;
}else{
throw new Error("HttpURI - invalid scheme: "+_4f1);
}
};
function isValidScheme(_4f3){
return "http"==_4f3||"https"==_4f3;
};
var _4f4=_4f0.prototype;
_4f4.getURI=function(){
return this._uri;
};
_4f4.duplicate=function(uri){
try{
return new _4f0(uri);
}
catch(e){
throw e;
}
return null;
};
_4f4.isSecure=function(){
return ("https"==this._uri.scheme);
};
_4f4.toString=function(){
return this._uri.toString();
};
_4f0.replaceScheme=function(_4f6,_4f7){
var uri=URI.replaceProtocol(_4f6,_4f7);
return new _4f0(uri);
};
return _4f0;
})();
var _4f9=(function(){
var _4fa=function(_4fb){
var uri=new URI(_4fb);
if(isValidScheme(uri.scheme)){
this._uri=uri;
if(uri.port==undefined){
this._uri=new URI(_4fa.addDefaultPort(_4fb));
}
}else{
throw new Error("WSURI - invalid scheme: "+_4fb);
}
};
function isValidScheme(_4fd){
return "ws"==_4fd||"wss"==_4fd;
};
function duplicate(uri){
try{
return new _4fa(uri);
}
catch(e){
throw e;
}
return null;
};
var _4ff=_4fa.prototype;
_4ff.getAuthority=function(){
return this._uri.authority;
};
_4ff.isSecure=function(){
return "wss"==this._uri.scheme;
};
_4ff.getHttpEquivalentScheme=function(){
return this.isSecure()?"https":"http";
};
_4ff.toString=function(){
return this._uri.toString();
};
var _500=80;
var _501=443;
_4fa.setDefaultPort=function(uri){
if(uri.port==0){
if(uri.scheme=="ws"){
uri.port=_500;
}else{
if(uri.scheme=="wss"){
uri.port=_501;
}else{
if(uri.scheme=="http"){
uri.port=80;
}else{
if(uri.schemel=="https"){
uri.port=443;
}else{
throw new Error("Unknown protocol: "+uri.scheme);
}
}
}
}
uri.authority=uri.host+":"+uri.port;
}
};
_4fa.addDefaultPort=function(_503){
var uri=new URI(_503);
if(uri.port==undefined){
_4fa.setDefaultPort(uri);
}
return uri.toString();
};
_4fa.replaceScheme=function(_505,_506){
var uri=URI.replaceProtocol(_505,_506);
return new _4fa(uri);
};
return _4fa;
})();
var _508=(function(){
var _509={};
_509["ws"]="ws";
_509["wss"]="wss";
_509["javascript:wse"]="ws";
_509["javascript:wse+ssl"]="wss";
_509["javascript:ws"]="ws";
_509["javascript:wss"]="wss";
_509["flash:wsr"]="ws";
_509["flash:wsr+ssl"]="wss";
_509["flash:wse"]="ws";
_509["flash:wse+ssl"]="wss";
var _50a=function(_50b){
var _50c=getProtocol(_50b);
if(isValidScheme(_50c)){
this._uri=new URI(URI.replaceProtocol(_50b,_509[_50c]));
this._compositeScheme=_50c;
this._location=_50b;
}else{
throw new SyntaxError("WSCompositeURI - invalid composite scheme: "+getProtocol(_50b));
}
};
function getProtocol(_50d){
var indx=_50d.indexOf("://");
if(indx>0){
return _50d.substr(0,indx);
}else{
return "";
}
};
function isValidScheme(_50f){
return _509[_50f]!=null;
};
function duplicate(uri){
try{
return new _50a(uri);
}
catch(e){
throw e;
}
return null;
};
var _511=_50a.prototype;
_511.isSecure=function(){
var _512=this._uri.scheme;
return "wss"==_509[_512];
};
_511.getWSEquivalent=function(){
try{
var _513=_509[this._compositeScheme];
return _4f9.replaceScheme(this._location,_513);
}
catch(e){
throw e;
}
return null;
};
_511.getPlatformPrefix=function(){
if(this._compositeScheme.indexOf("javascript:")===0){
return "javascript";
}else{
if(this._compositeScheme.indexOf("flash:")===0){
return "flash";
}else{
return "";
}
}
};
_511.toString=function(){
return this._location;
};
return _50a;
})();
var _514=(function(){
var _515=function(){
this._parent=null;
this._challengeResponse=new ChallengeResponse(null,null);
};
_515.prototype.toString=function(){
return "[Channel]";
};
return _515;
})();
var _516=(function(){
var _517=function(_518,_519,_51a){
_514.apply(this,arguments);
this._location=_518;
this._protocol=_519;
this._extensions=[];
this._controlFrames={};
this._controlFramesBinary={};
this._escapeSequences={};
this._handshakePayload="";
this._isEscape=false;
this._bufferedAmount=0;
};
var _51b=_517.prototype=new _514();
_51b.getBufferedAmount=function(){
return this._bufferedAmount;
};
_51b.toString=function(){
return "[WebSocketChannel "+_location+" "+_protocol!=null?_protocol:"-"+"]";
};
return _517;
})();
var _51c=(function(){
var _51d=function(){
this._nextHandler;
this._listener;
};
var _51e=_51d.prototype;
_51e.processConnect=function(_51f,_520,_521){
this._nextHandler.processConnect(_51f,_520,_521);
};
_51e.processAuthorize=function(_522,_523){
this._nextHandler.processAuthorize(_522,_523);
};
_51e.processTextMessage=function(_524,text){
this._nextHandler.processTextMessage(_524,text);
};
_51e.processBinaryMessage=function(_526,_527){
this._nextHandler.processBinaryMessage(_526,_527);
};
_51e.processClose=function(_528,code,_52a){
this._nextHandler.processClose(_528,code,_52a);
};
_51e.setIdleTimeout=function(_52b,_52c){
this._nextHandler.setIdleTimeout(_52b,_52c);
};
_51e.setListener=function(_52d){
this._listener=_52d;
};
_51e.setNextHandler=function(_52e){
this._nextHandler=_52e;
};
return _51d;
})();
var _52f=function(_530){
this.connectionOpened=function(_531,_532){
_530._listener.connectionOpened(_531,_532);
};
this.textMessageReceived=function(_533,s){
_530._listener.textMessageReceived(_533,s);
};
this.binaryMessageReceived=function(_535,obj){
_530._listener.binaryMessageReceived(_535,obj);
};
this.connectionClosed=function(_537,_538,code,_53a){
_530._listener.connectionClosed(_537,_538,code,_53a);
};
this.connectionError=function(_53b,e){
_530._listener.connectionError(_53b,e);
};
this.connectionFailed=function(_53d){
_530._listener.connectionFailed(_53d);
};
this.authenticationRequested=function(_53e,_53f,_540){
_530._listener.authenticationRequested(_53e,_53f,_540);
};
this.redirected=function(_541,_542){
_530._listener.redirected(_541,_542);
};
this.onBufferedAmountChange=function(_543,n){
_530._listener.onBufferedAmountChange(_543,n);
};
};
var _545=(function(){
var _546=function(){
var _547="";
var _548="";
};
_546.KAAZING_EXTENDED_HANDSHAKE="x-kaazing-handshake";
_546.KAAZING_SEC_EXTENSION_REVALIDATE="x-kaazing-http-revalidate";
_546.HEADER_SEC_EXTENSIONS="X-WebSocket-Extensions";
_546.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT="x-kaazing-idle-timeout";
_546.KAAZING_SEC_EXTENSION_PING_PONG="x-kaazing-ping-pong";
return _546;
})();
var _549=(function(){
var _54a=function(_54b,_54c){
_516.apply(this,arguments);
this.requestHeaders=[];
this.responseHeaders={};
this.readyState=WebSocket.CONNECTING;
this.authenticationReceived=false;
this.wasCleanClose=false;
this.closeCode=1006;
this.closeReason="";
};
return _54a;
})();
var _54d=(function(){
var _54e=function(){
};
var _54f=_54e.prototype;
_54f.createChannel=function(_550,_551,_552){
var _553=new _549(_550,_551,_552);
return _553;
};
return _54e;
})();
var _554=(function(){
var _555=function(){
};
var _556=_555.prototype;
_556.createChannel=function(_557,_558){
var _559=new _549(_557,_558);
return _559;
};
return _555;
})();
var _55a=(function(){
var _55b=function(_55c,_55d){
this._location=_55c.getWSEquivalent();
this._protocol=_55d;
this._webSocket;
this._compositeScheme=_55c._compositeScheme;
this._connectionStrategies=[];
this._selectedChannel;
this.readyState=0;
this._closing=false;
this._negotiatedExtensions={};
this._compositeScheme=_55c._compositeScheme;
};
var _55e=_55b.prototype=new _516();
_55e.getReadyState=function(){
return this.readyState;
};
_55e.getWebSocket=function(){
return this._webSocket;
};
_55e.getCompositeScheme=function(){
return this._compositeScheme;
};
_55e.getNextStrategy=function(){
if(this._connectionStrategies.length<=0){
return null;
}else{
return this._connectionStrategies.shift();
}
};
return _55b;
})();
var _55f=(function(){
var _560="WebSocketControlFrameHandler";
var LOG=_26a.getLogger(_560);
var _562=function(){
LOG.finest(_560,"<init>");
};
var _563=function(_564,_565){
var _566=0;
for(var i=_565;i<_565+4;i++){
_566=(_566<<8)+_564.getAt(i);
}
return _566;
};
var _568=function(_569){
if(_569.byteLength>3){
var _56a=new DataView(_569);
return _56a.getInt32(0);
}
return 0;
};
var _56b=function(_56c){
var _56d=0;
for(var i=0;i<4;i++){
_56d=(_56d<<8)+_56c.charCodeAt(i);
}
return _56d;
};
var ping=[9,0];
var pong=[10,0];
var _571={};
var _572=function(_573){
if(typeof _571.escape==="undefined"){
var _574=[];
var i=4;
do{
_574[--i]=_573&(255);
_573=_573>>8;
}while(i);
_571.escape=String.fromCharCode.apply(null,_574.concat(pong));
}
return _571.escape;
};
var _576=function(_577,_578,_579,_57a){
if(_545.KAAZING_SEC_EXTENSION_REVALIDATE==_578._controlFrames[_57a]){
var url=_579.substr(5);
if(_578._redirectUri!=null){
if(typeof (_578._redirectUri)=="string"){
var _57c=new URI(_578._redirectUri);
url=_57c.scheme+"://"+_57c.authority+url;
}else{
url=_578._redirectUri.getHttpEquivalentScheme()+"://"+_578._redirectUri.getAuthority()+url;
}
}else{
url=_578._location.getHttpEquivalentScheme()+"://"+_578._location.getAuthority()+url;
}
_577._listener.authenticationRequested(_578,url,_545.KAAZING_SEC_EXTENSION_REVALIDATE);
}else{
if(_545.KAAZING_SEC_EXTENSION_PING_PONG==_578._controlFrames[_57a]){
if(_579.charCodeAt(4)==ping[0]){
var pong=_572(_57a);
_577._nextHandler.processTextMessage(_578,pong);
}
}
}
};
var _57e=_562.prototype=new _51c();
_57e.handleConnectionOpened=function(_57f,_580){
LOG.finest(_560,"handleConnectionOpened");
var _581=_57f.responseHeaders;
if(_581[_545.HEADER_SEC_EXTENSIONS]!=null){
var _582=_581[_545.HEADER_SEC_EXTENSIONS];
if(_582!=null&&_582.length>0){
var _583=_582.split(",");
for(var j=0;j<_583.length;j++){
var tmp=_583[j].split(";");
var ext=tmp[0].replace(/^\s+|\s+$/g,"");
var _587=new WebSocketExtension(ext);
_587.enabled=true;
_587.negotiated=true;
if(tmp.length>1){
var _588=tmp[1].replace(/^\s+|\s+$/g,"");
if(_588.length==8){
try{
var _589=parseInt(_588,16);
_57f._controlFrames[_589]=ext;
if(_545.KAAZING_SEC_EXTENSION_REVALIDATE===ext){
_57f._controlFramesBinary[_589]=ext;
}
_587.escape=_588;
}
catch(e){
LOG.finest(_560,"parse control frame bytes error");
}
}
}
_57f.parent._negotiatedExtensions[ext]=_587;
}
}
}
this._listener.connectionOpened(_57f,_580);
};
_57e.handleTextMessageReceived=function(_58a,_58b){
LOG.finest(_560,"handleMessageReceived",_58b);
if(_58a._isEscape){
_58a._isEscape=false;
this._listener.textMessageReceived(_58a,_58b);
return;
}
if(_58b==null||_58b.length<4){
this._listener.textMessageReceived(_58a,_58b);
return;
}
var _58c=_56b(_58b);
if(_58a._controlFrames[_58c]!=null){
if(_58b.length==4){
_58a._isEscape=true;
return;
}else{
_576(this,_58a,_58b,_58c);
}
}else{
this._listener.textMessageReceived(_58a,_58b);
}
};
_57e.handleMessageReceived=function(_58d,_58e){
LOG.finest(_560,"handleMessageReceived",_58e);
if(_58d._isEscape){
_58d._isEscape=false;
this._listener.binaryMessageReceived(_58d,_58e);
return;
}
if(typeof (_58e.byteLength)!="undefined"){
var _58f=_568(_58e);
if(_58d._controlFramesBinary[_58f]!=null){
if(_58e.byteLength==4){
_58d._isEscape=true;
return;
}else{
_576(this,_58d,String.fromCharCode.apply(null,new Uint8Array(_58e,0)),_58f);
}
}else{
this._listener.binaryMessageReceived(_58d,_58e);
}
}else{
if(_58e.constructor==ByteBuffer){
if(_58e==null||_58e.limit<4){
this._listener.binaryMessageReceived(_58d,_58e);
return;
}
var _58f=_563(_58e,_58e.position);
if(_58d._controlFramesBinary[_58f]!=null){
if(_58e.limit==4){
_58d._isEscape=true;
return;
}else{
_576(this,_58d,_58e.getString(Charset.UTF8),_58f);
}
}else{
this._listener.binaryMessageReceived(_58d,_58e);
}
}
}
};
_57e.processTextMessage=function(_590,_591){
if(_591.length>=4){
var _592=_56b(_591);
if(_590._escapeSequences[_592]!=null){
var _593=_591.slice(0,4);
this._nextHandler.processTextMessage(_590,_593);
}
}
this._nextHandler.processTextMessage(_590,_591);
};
_57e.setNextHandler=function(_594){
var _595=this;
this._nextHandler=_594;
var _596=new _52f(this);
_596.connectionOpened=function(_597,_598){
_595.handleConnectionOpened(_597,_598);
};
_596.textMessageReceived=function(_599,buf){
_595.handleTextMessageReceived(_599,buf);
};
_596.binaryMessageReceived=function(_59b,buf){
_595.handleMessageReceived(_59b,buf);
};
_594.setListener(_596);
};
_57e.setListener=function(_59d){
this._listener=_59d;
};
return _562;
})();
var _59e=(function(){
var LOG=_26a.getLogger("RevalidateHandler");
var _5a0=function(_5a1){
LOG.finest("ENTRY Revalidate.<init>");
this.channel=_5a1;
};
var _5a2=_5a0.prototype;
_5a2.connect=function(_5a3){
LOG.finest("ENTRY Revalidate.connect with {0}",_5a3);
var _5a4=this;
var _5a5=new XMLHttpRequest0();
_5a5.withCredentials=true;
_5a5.open("GET",_5a3+"&.krn="+Math.random(),true);
if(_5a4.channel._challengeResponse!=null&&_5a4.channel._challengeResponse.credentials!=null){
_5a5.setRequestHeader("Authorization",_5a4.channel._challengeResponse.credentials);
this.clearAuthenticationData(_5a4.channel);
}
_5a5.onreadystatechange=function(){
switch(_5a5.readyState){
case 2:
if(_5a5.status==403){
_5a5.abort();
}
break;
case 4:
if(_5a5.status==401){
_5a4.handle401(_5a4.channel,_5a3,_5a5.getResponseHeader("WWW-Authenticate"));
return;
}
break;
}
};
_5a5.send(null);
};
_5a2.clearAuthenticationData=function(_5a6){
if(_5a6._challengeResponse!=null){
_5a6._challengeResponse.clearCredentials();
}
};
_5a2.handle401=function(_5a7,_5a8,_5a9){
var _5aa=this;
var _5ab=_5a8;
if(_5ab.indexOf("/;a/")>0){
_5ab=_5ab.substring(0,_5ab.indexOf("/;a/"));
}else{
if(_5ab.indexOf("/;ae/")>0){
_5ab=_5ab.substring(0,_5ab.indexOf("/;ae/"));
}else{
if(_5ab.indexOf("/;ar/")>0){
_5ab=_5ab.substring(0,_5ab.indexOf("/;ar/"));
}
}
}
var _5ac=new ChallengeRequest(_5ab,_5a9);
var _5ad;
if(this.channel._challengeResponse.nextChallengeHandler!=null){
_5ad=this.channel._challengeResponse.nextChallengeHandler;
}else{
_5ad=_5a7.challengeHandler;
}
if(_5ad!=null&&_5ad.canHandle(_5ac)){
_5ad.handle(_5ac,function(_5ae){
try{
if(_5ae!=null&&_5ae.credentials!=null){
_5aa.channel._challengeResponse=_5ae;
_5aa.connect(_5a8);
}
}
catch(e){
}
});
}
};
return _5a0;
})();
var _5af=(function(){
var _5b0="WebSocketNativeDelegateHandler";
var LOG=_26a.getLogger(_5b0);
var _5b2=function(){
LOG.finest(_5b0,"<init>");
};
var _5b3=_5b2.prototype=new _51c();
_5b3.processConnect=function(_5b4,uri,_5b6){
LOG.finest(_5b0,"connect",_5b4);
if(_5b4.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
if(_5b4._delegate==null){
var _5b7=new _2d6();
_5b7.parent=_5b4;
_5b4._delegate=_5b7;
_5b8(_5b7,this);
}
_5b4._delegate.connect(uri.toString(),_5b6);
};
_5b3.processTextMessage=function(_5b9,text){
LOG.finest(_5b0,"processTextMessage",_5b9);
if(_5b9._delegate.readyState()==WebSocket.OPEN){
_5b9._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_5b3.processBinaryMessage=function(_5bb,obj){
LOG.finest(_5b0,"processBinaryMessage",_5bb);
if(_5bb._delegate.readyState()==WebSocket.OPEN){
_5bb._delegate.send(obj);
}else{
throw new Error("WebSocket is already closed");
}
};
_5b3.processClose=function(_5bd,code,_5bf){
LOG.finest(_5b0,"close",_5bd);
try{
_5bd._delegate.close(code,_5bf);
}
catch(e){
LOG.finest(_5b0,"processClose exception: ",e);
}
};
_5b3.setIdleTimeout=function(_5c0,_5c1){
LOG.finest(_5b0,"idleTimeout",_5c0);
try{
_5c0._delegate.setIdleTimeout(_5c1);
}
catch(e){
LOG.finest(_5b0,"setIdleTimeout exception: ",e);
}
};
var _5b8=function(_5c2,_5c3){
var _5c4=new _52f(_5c3);
_5c2.setListener(_5c4);
};
return _5b2;
})();
var _5c5=(function(){
var _5c6="WebSocketNativeBalancingHandler";
var LOG=_26a.getLogger(_5c6);
var _5c8=function(){
LOG.finest(_5c6,"<init>");
};
var _5c9=function(_5ca,_5cb,_5cc){
_5cb._redirecting=true;
_5cb._redirectUri=_5cc;
_5ca._nextHandler.processClose(_5cb);
};
var _5cd=_5c8.prototype=new _51c();
_5cd.processConnect=function(_5ce,uri,_5d0){
_5ce._balanced=0;
this._nextHandler.processConnect(_5ce,uri,_5d0);
};
_5cd.handleConnectionClosed=function(_5d1,_5d2,code,_5d4){
if(_5d1._redirecting==true){
_5d1._redirecting=false;
_5d1._redirected=true;
_5d1.handshakePayload="";
var _5d5=[_545.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_5d1._protocol.length;i++){
_5d5.push(_5d1._protocol[i]);
}
this.processConnect(_5d1,_5d1._redirectUri,_5d5);
}else{
this._listener.connectionClosed(_5d1,_5d2,code,_5d4);
}
};
_5cd.handleMessageReceived=function(_5d7,obj){
LOG.finest(_5c6,"handleMessageReceived",obj);
if(_5d7._balanced>1){
this._listener.binaryMessageReceived(_5d7,obj);
return;
}
var _5d9=_2b0(obj);
if(_5d9.charCodeAt(0)==61695){
if(_5d9.match("N$")){
_5d7._balanced++;
if(_5d7._balanced==1){
this._listener.connectionOpened(_5d7,_545.KAAZING_EXTENDED_HANDSHAKE);
}else{
this._listener.connectionOpened(_5d7,_5d7._acceptedProtocol||"");
}
}else{
if(_5d9.indexOf("R")==1){
var _5da=new _4f9(_5d9.substring(2));
_5c9(this,_5d7,_5da);
}else{
LOG.warning(_5c6,"Invalidate balancing message: "+target);
}
}
return;
}else{
this._listener.binaryMessageReceived(_5d7,obj);
}
};
_5cd.setNextHandler=function(_5db){
this._nextHandler=_5db;
var _5dc=new _52f(this);
var _5dd=this;
_5dc.connectionOpened=function(_5de,_5df){
if(_545.KAAZING_EXTENDED_HANDSHAKE!=_5df){
_5de._balanced=2;
_5dd._listener.connectionOpened(_5de,_5df);
}
};
_5dc.textMessageReceived=function(_5e0,_5e1){
LOG.finest(_5c6,"textMessageReceived",_5e1);
if(_5e0._balanced>1){
_5dd._listener.textMessageReceived(_5e0,_5e1);
return;
}
if(_5e1.charCodeAt(0)==61695){
if(_5e1.match("N$")){
_5e0._balanced++;
if(_5e0._balanced==1){
_5dd._listener.connectionOpened(_5e0,_545.KAAZING_EXTENDED_HANDSHAKE);
}else{
_5dd._listener.connectionOpened(_5e0,"");
}
}else{
if(_5e1.indexOf("R")==1){
var _5e2=new _4f9(_5e1.substring(2));
_5c9(_5dd,_5e0,_5e2);
}else{
LOG.warning(_5c6,"Invalidate balancing message: "+target);
}
}
return;
}else{
_5dd._listener.textMessageReceived(_5e0,_5e1);
}
};
_5dc.binaryMessageReceived=function(_5e3,obj){
_5dd.handleMessageReceived(_5e3,obj);
};
_5dc.connectionClosed=function(_5e5,_5e6,code,_5e8){
_5dd.handleConnectionClosed(_5e5,_5e6,code,_5e8);
};
_5db.setListener(_5dc);
};
_5cd.setListener=function(_5e9){
this._listener=_5e9;
};
return _5c8;
})();
var _5ea=(function(){
var _5eb="WebSocketNativeHandshakeHandler";
var LOG=_26a.getLogger(_5eb);
var _5ed="Sec-WebSocket-Protocol";
var _5ee="Sec-WebSocket-Extensions";
var _5ef="Authorization";
var _5f0="WWW-Authenticate";
var _5f1="Set-Cookie";
var _5f2="GET";
var _5f3="HTTP/1.1";
var _5f4=":";
var _5f5=" ";
var _5f6="\r\n";
var _5f7=function(){
LOG.finest(_5eb,"<init>");
};
var _5f8=function(_5f9,_5fa){
LOG.finest(_5eb,"sendCookieRequest with {0}",_5fa);
var _5fb=new XMLHttpRequest0();
var path=_5f9._location.getHttpEquivalentScheme()+"://"+_5f9._location.getAuthority()+(_5f9._location._uri.path||"");
path=path.replace(/[\/]?$/,"/;api/set-cookies");
_5fb.open("POST",path,true);
_5fb.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_5fb.send(_5fa);
};
var _5fd=function(_5fe,_5ff,_600){
var _601=[];
var _602=[];
_601.push("WebSocket-Protocol");
_602.push("");
_601.push(_5ed);
_602.push(_5ff._protocol.join(","));
var _603=[_545.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT,_545.KAAZING_SEC_EXTENSION_PING_PONG];
var ext=_5ff._extensions;
if(ext.length>0){
_603.push(ext);
}
_601.push(_5ee);
_602.push(_603.join(","));
_601.push(_5ef);
_602.push(_600);
var _605=_606(_5ff._location,_601,_602);
_5fe._nextHandler.processTextMessage(_5ff,_605);
};
var _606=function(_607,_608,_609){
LOG.entering(_5eb,"encodeGetRequest");
var _60a=[];
_60a.push(_5f2);
_60a.push(_5f5);
var path=[];
if(_607._uri.path!=undefined){
path.push(_607._uri.path);
}
if(_607._uri.query!=undefined){
path.push("?");
path.push(_607._uri.query);
}
_60a.push(path.join(""));
_60a.push(_5f5);
_60a.push(_5f3);
_60a.push(_5f6);
for(var i=0;i<_608.length;i++){
var _60d=_608[i];
var _60e=_609[i];
if(_60d!=null&&_60e!=null){
_60a.push(_60d);
_60a.push(_5f4);
_60a.push(_5f5);
_60a.push(_60e);
_60a.push(_5f6);
}
}
_60a.push(_5f6);
var _60f=_60a.join("");
return _60f;
};
var _610=function(_611,_612,s){
if(s.length>0){
_612.handshakePayload+=s;
return;
}
var _614=_612.handshakePayload.split("\n");
_612.handshakePayload="";
var _615="";
for(var i=_614.length-1;i>=0;i--){
if(_614[i].indexOf("HTTP/1.1")==0){
var temp=_614[i].split(" ");
_615=temp[1];
break;
}
}
if("101"==_615){
var _618=[];
var _619="";
for(var i=0;i<_614.length;i++){
var line=_614[i];
if(line!=null&&line.indexOf(_5ee)==0){
_618.push(line.substring(_5ee.length+2));
}else{
if(line!=null&&line.indexOf(_5ed)==0){
_619=line.substring(_5ed.length+2);
}else{
if(line!=null&&line.indexOf(_5f1)==0){
_5f8(_612,line.substring(_5f1.length+2));
}
}
}
}
_612._acceptedProtocol=_619;
if(_618.length>0){
var _61b=[];
var _61c=_618.join(", ").split(", ");
for(var j=0;j<_61c.length;j++){
var tmp=_61c[j].split(";");
var ext=tmp[0].replace(/^\s+|\s+$/g,"");
var _620=new WebSocketExtension(ext);
if(_545.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT===ext){
var _621=tmp[1].match(/\d+/)[0];
if(_621>0){
_611._nextHandler.setIdleTimeout(_612,_621);
}
continue;
}else{
if(_545.KAAZING_SEC_EXTENSION_PING_PONG===ext){
try{
var _622=tmp[1].replace(/^\s+|\s+$/g,"");
var _623=parseInt(_622,16);
_612._controlFrames[_623]=ext;
_612._escapeSequences[_623]=ext;
continue;
}
catch(e){
throw new Error("failed to parse escape key for x-kaazing-ping-pong extension");
}
}else{
if(tmp.length>1){
var _622=tmp[1].replace(/^\s+|\s+$/g,"");
if(_622.length==8){
try{
var _623=parseInt(_622,16);
_612._controlFrames[_623]=ext;
if(_545.KAAZING_SEC_EXTENSION_REVALIDATE===ext){
_612._controlFramesBinary[_623]=ext;
}
_620.escape=_622;
}
catch(e){
LOG.finest(_5eb,"parse control frame bytes error");
}
}
}
}
}
_620.enabled=true;
_620.negotiated=true;
_61b.push(_61c[j]);
}
if(_61b.length>0){
_612.parent._negotiatedExtensions[ext]=_61b.join(",");
}
}
return;
}else{
if("401"==_615){
_612.handshakestatus=2;
var _624="";
for(var i=0;i<_614.length;i++){
if(_614[i].indexOf(_5f0)==0){
_624=_614[i].substring(_5f0.length+2);
break;
}
}
_611._listener.authenticationRequested(_612,_612._location.toString(),_624);
}else{
_611._listener.connectionFailed(_612);
}
}
};
var _625=function(_626,_627){
try{
_627.handshakestatus=3;
_626._nextHandler.processClose(_627);
}
finally{
_626._listener.connectionFailed(_627);
}
};
var _628=_5f7.prototype=new _51c();
_628.processConnect=function(_629,uri,_62b){
_629.handshakePayload="";
var _62c=[_545.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_62b.length;i++){
_62c.push(_62b[i]);
}
this._nextHandler.processConnect(_629,uri,_62c);
_629.handshakestatus=0;
var _62e=this;
setTimeout(function(){
if(_629.handshakestatus==0){
_625(_62e,_629);
}
},5000);
};
_628.processAuthorize=function(_62f,_630){
_5fd(this,_62f,_630);
};
_628.handleConnectionOpened=function(_631,_632){
LOG.finest(_5eb,"handleConnectionOpened");
if(_545.KAAZING_EXTENDED_HANDSHAKE==_632){
_5fd(this,_631,null);
_631.handshakestatus=1;
var _633=this;
setTimeout(function(){
if(_631.handshakestatus<2){
_625(_633,_631);
}
},5000);
}else{
_631.handshakestatus=2;
this._listener.connectionOpened(_631,_632);
}
};
_628.handleMessageReceived=function(_634,_635){
LOG.finest(_5eb,"handleMessageReceived",_635);
if(_634.readyState==WebSocket.OPEN){
_634._isEscape=false;
this._listener.textMessageReceived(_634,_635);
}else{
_610(this,_634,_635);
}
};
_628.handleBinaryMessageReceived=function(_636,_637){
LOG.finest(_5eb,"handleMessageReceived",_637);
if(_636.readyState==WebSocket.OPEN){
_636._isEscape=false;
this._listener.binaryMessageReceived(_636,_637);
}else{
_610(this,_636,String.fromCharCode.apply(null,new Uint8Array(_637)));
}
};
_628.setNextHandler=function(_638){
this._nextHandler=_638;
var _639=this;
var _63a=new _52f(this);
_63a.connectionOpened=function(_63b,_63c){
_639.handleConnectionOpened(_63b,_63c);
};
_63a.textMessageReceived=function(_63d,buf){
_639.handleMessageReceived(_63d,buf);
};
_63a.binaryMessageReceived=function(_63f,buf){
_639.handleBinaryMessageReceived(_63f,buf);
};
_63a.connectionClosed=function(_641,_642,code,_644){
if(_641.handshakestatus<3){
_641.handshakestatus=3;
}
_639._listener.connectionClosed(_641,_642,code,_644);
};
_63a.connectionFailed=function(_645){
if(_645.handshakestatus<3){
_645.handshakestatus=3;
}
_639._listener.connectionFailed(_645);
};
_638.setListener(_63a);
};
_628.setListener=function(_646){
this._listener=_646;
};
return _5f7;
})();
var _647=(function(){
var _648="WebSocketNativeAuthenticationHandler";
var LOG=_26a.getLogger(_648);
var _64a=function(){
LOG.finest(_648,"<init>");
};
var _64b=_64a.prototype=new _51c();
_64b.handleClearAuthenticationData=function(_64c){
if(_64c._challengeResponse!=null){
_64c._challengeResponse.clearCredentials();
}
};
_64b.handleRemoveAuthenticationData=function(_64d){
this.handleClearAuthenticationData(_64d);
_64d._challengeResponse=new ChallengeResponse(null,null);
};
_64b.doError=function(_64e){
this._nextHandler.processClose(_64e);
this.handleClearAuthenticationData(_64e);
this._listener.connectionFailed(_64e);
};
_64b.handle401=function(_64f,_650,_651){
var _652=this;
var _653=_64f._location;
if(_64f.redirectUri!=null){
_653=_64f._redirectUri;
}
if(_545.KAAZING_SEC_EXTENSION_REVALIDATE==_651){
var ch=new _549(_653,_64f._protocol,_64f._isBinary);
ch.challengeHandler=_64f.parent.challengeHandler;
var _655=new _59e(ch);
_655.connect(_650);
}else{
var _656=new ChallengeRequest(_653.toString(),_651);
var _657;
if(_64f._challengeResponse.nextChallengeHandler!=null){
_657=_64f._challengeResponse.nextChallengeHandler;
}else{
_657=_64f.parent.challengeHandler;
}
if(_657!=null&&_657.canHandle(_656)){
_657.handle(_656,function(_658){
try{
if(_658==null||_658.credentials==null){
_652.doError(_64f);
}else{
_64f._challengeResponse=_658;
_652._nextHandler.processAuthorize(_64f,_658.credentials);
}
}
catch(e){
_652.doError(_64f);
}
});
}else{
this.doError(_64f);
}
}
};
_64b.handleAuthenticate=function(_659,_65a,_65b){
_659.authenticationReceived=true;
this.handle401(_659,_65a,_65b);
};
_64b.setNextHandler=function(_65c){
this._nextHandler=_65c;
var _65d=this;
var _65e=new _52f(this);
_65e.authenticationRequested=function(_65f,_660,_661){
_65d.handleAuthenticate(_65f,_660,_661);
};
_65c.setListener(_65e);
};
_64b.setListener=function(_662){
this._listener=_662;
};
return _64a;
})();
var _663=(function(){
var _664="WebSocketHixie76FrameCodecHandler";
var LOG=_26a.getLogger(_664);
var _666=function(){
LOG.finest(_664,"<init>");
};
var _667=_666.prototype=new _51c();
_667.processConnect=function(_668,uri,_66a){
this._nextHandler.processConnect(_668,uri,_66a);
};
_667.processBinaryMessage=function(_66b,data){
if(data.constructor==ByteBuffer){
var _66d=data.array.slice(data.position,data.limit);
this._nextHandler.processTextMessage(_66b,Charset.UTF8.encodeByteArray(_66d));
}else{
if(data.byteLength){
this._nextHandler.processTextMessage(_66b,Charset.UTF8.encodeArrayBuffer(data));
}else{
if(data.size){
var _66e=this;
var cb=function(_670){
_66e._nextHandler.processBinaryMessage(_66b,Charset.UTF8.encodeByteArray(_670));
};
BlobUtils.asNumberArray(cb,data);
}else{
throw new Error("Invalid type for send");
}
}
}
};
_667.setNextHandler=function(_671){
this._nextHandler=_671;
var _672=this;
var _673=new _52f(this);
_673.textMessageReceived=function(_674,text){
_672._listener.binaryMessageReceived(_674,ByteBuffer.wrap(Charset.UTF8.toByteArray(text)));
};
_673.binaryMessageReceived=function(_676,buf){
throw new Error("draft76 won't receive binary frame");
};
_671.setListener(_673);
};
_667.setListener=function(_678){
this._listener=_678;
};
return _666;
})();
var _679=(function(){
var _67a="WebSocketNativeHandler";
var LOG=_26a.getLogger(_67a);
var _67c=function(){
var _67d=new _647();
return _67d;
};
var _67e=function(){
var _67f=new _5ea();
return _67f;
};
var _680=function(){
var _681=new _55f();
return _681;
};
var _682=function(){
var _683=new _5c5();
return _683;
};
var _684=function(){
var _685=new _5af();
return _685;
};
var _686=function(){
var _687=new _663();
return _687;
};
var _688=(browser=="safari"&&typeof (WebSocket.CLOSING)=="undefined");
var _689=_67c();
var _68a=_67e();
var _68b=_680();
var _68c=_682();
var _68d=_684();
var _68e=_686();
var _68f=function(){
LOG.finest(_67a,"<init>");
if(_688){
this.setNextHandler(_68e);
_68e.setNextHandler(_689);
}else{
this.setNextHandler(_689);
}
_689.setNextHandler(_68a);
_68a.setNextHandler(_68b);
_68b.setNextHandler(_68c);
_68c.setNextHandler(_68d);
};
var _690=function(_691,_692){
LOG.finest(_67a,"<init>");
};
var _693=_68f.prototype=new _51c();
_693.setNextHandler=function(_694){
this._nextHandler=_694;
var _695=new _52f(this);
_694.setListener(_695);
};
_693.setListener=function(_696){
this._listener=_696;
};
return _68f;
})();
var _697=(function(){
var _698=_26a.getLogger("com.kaazing.gateway.client.html5.WebSocketEmulatedProxyDownstream");
var _699=512*1024;
var _69a=1;
var _69b=function(_69c){
_698.entering(this,"WebSocketEmulatedProxyDownstream.<init>",_69c);
this.retry=3000;
if(_69c.indexOf("/;e/dtem/")>0){
this.requiresEscaping=true;
}
var _69d=new URI(_69c);
var _69e={"http":80,"https":443};
if(_69d.port==undefined){
_69d.port=_69e[_69d.scheme];
_69d.authority=_69d.host+":"+_69d.port;
}
this.origin=_69d.scheme+"://"+_69d.authority;
this.location=_69c;
this.activeXhr=null;
this.reconnectTimer=null;
this.idleTimer=null;
this.idleTimeout=null;
this.lastMessageTimestamp=null;
this.buf=new ByteBuffer();
var _69f=this;
setTimeout(function(){
connect(_69f,true);
_69f.activeXhr=_69f.mostRecentXhr;
startProxyDetectionTimer(_69f,_69f.mostRecentXhr);
},0);
_698.exiting(this,"WebSocketEmulatedProxyDownstream.<init>");
};
var _6a0=_69b.prototype;
var _6a1=0;
var _6a2=255;
var _6a3=1;
var _6a4=128;
var _6a5=129;
var _6a6=127;
var _6a7=137;
var _6a8=3000;
_6a0.readyState=0;
function connect(_6a9,_6aa){
_698.entering(this,"WebSocketEmulatedProxyDownstream.connect");
if(_6a9.reconnectTimer!==null){
_6a9.reconnectTimer=null;
}
stopIdleTimer(_6a9);
var _6ab=new URI(_6a9.location);
var _6ac=[];
switch(browser){
case "ie":
_6ac.push(".kns=1");
_6ac.push(".kf=200&.kp=2048");
break;
case "safari":
_6ac.push(".kp=256");
break;
case "firefox":
_6ac.push(".kp=1025");
break;
case "android":
_6ac.push(".kp=4096");
_6ac.push(".kbp=4096");
break;
}
if(browser=="android"||browser.ios){
_6ac.push(".kkt=20");
}
_6ac.push(".kc=text/plain;charset=windows-1252");
_6ac.push(".kb=4096");
_6ac.push(".kid="+String(Math.random()).substring(2));
if(_6ac.length>0){
if(_6ab.query===undefined){
_6ab.query=_6ac.join("&");
}else{
_6ab.query+="&"+_6ac.join("&");
}
}
var xhr=new XMLHttpRequest0();
xhr.id=_69a++;
xhr.position=0;
xhr.opened=false;
xhr.reconnect=false;
xhr.requestClosing=false;
xhr.onreadystatechange=function(){
if(xhr.readyState==3){
if(_6a9.idleTimer==null){
var _6ae=xhr.getResponseHeader("X-Idle-Timeout");
if(_6ae){
var _6af=parseInt(_6ae);
if(_6af>0){
_6af=_6af*1000;
_6a9.idleTimeout=_6af;
_6a9.lastMessageTimestamp=new Date().getTime();
startIdleTimer(_6a9,_6af);
}
}
}
}
};
xhr.onprogress=function(){
if(xhr==_6a9.activeXhr&&_6a9.readyState!=2){
_process(_6a9);
}
};
xhr.onload=function(){
if(xhr==_6a9.activeXhr&&_6a9.readyState!=2){
_process(_6a9);
xhr.onerror=function(){
};
xhr.ontimeout=function(){
};
xhr.onreadystatechange=function(){
};
if(!xhr.reconnect){
doError(_6a9);
}else{
if(xhr.requestClosing){
doClose(_6a9);
}else{
if(_6a9.activeXhr==_6a9.mostRecentXhr){
connect(_6a9);
_6a9.activeXhr=_6a9.mostRecentXhr;
startProxyDetectionTimer(_6a9,_6a9.activeXhr);
}else{
var _6b0=_6a9.mostRecentXhr;
_6a9.activeXhr=_6b0;
switch(_6b0.readyState){
case 1:
case 2:
startProxyDetectionTimer(_6a9,_6b0);
break;
case 3:
_process(_6a9);
break;
case 4:
_6a9.activeXhr.onload();
break;
default:
}
}
}
}
}
};
xhr.ontimeout=function(){
_698.entering(this,"WebSocketEmulatedProxyDownstream.connect.xhr.ontimeout");
doError(_6a9);
};
xhr.onerror=function(){
_698.entering(this,"WebSocketEmulatedProxyDownstream.connect.xhr.onerror");
doError(_6a9);
};
xhr.open("GET",_6ab.toString(),true);
xhr.send("");
_6a9.mostRecentXhr=xhr;
};
function startProxyDetectionTimer(_6b1,xhr){
if(_6b1.location.indexOf("&.ki=p")==-1){
setTimeout(function(){
if(xhr&&xhr.readyState<3&&_6b1.readyState<2){
_6b1.location+="&.ki=p";
connect(_6b1,false);
}
},_6a8);
}
};
_6a0.disconnect=function(){
_698.entering(this,"WebSocketEmulatedProxyDownstream.disconnect");
if(this.readyState!==2){
_disconnect(this);
}
};
function _disconnect(_6b3){
_698.entering(this,"WebSocketEmulatedProxyDownstream._disconnect");
if(_6b3.reconnectTimer!==null){
clearTimeout(_6b3.reconnectTimer);
_6b3.reconnectTimer=null;
}
stopIdleTimer(_6b3);
if(_6b3.mostRecentXhr!==null){
_6b3.mostRecentXhr.onprogress=function(){
};
_6b3.mostRecentXhr.onload=function(){
};
_6b3.mostRecentXhr.onerror=function(){
};
_6b3.mostRecentXhr.abort();
}
if(_6b3.activeXhr!=_6b3.mostRecentXhr&&_6b3.activeXhr!==null){
_6b3.activeXhr.onprogress=function(){
};
_6b3.activeXhr.onload=function(){
};
_6b3.activeXhr.onerror=function(){
};
_6b3.activeXhr.abort();
}
_6b3.lineQueue=[];
_6b3.lastEventId=null;
_6b3.location=null;
_6b3.readyState=2;
};
function _process(_6b4){
_6b4.lastMessageTimestamp=new Date().getTime();
var xhr=_6b4.activeXhr;
var _6b6=xhr.responseText;
if(_6b6.length>=_699){
if(_6b4.activeXhr==_6b4.mostRecentXhr){
connect(_6b4,false);
}
}
var _6b7=_6b6.slice(xhr.position);
xhr.position=_6b6.length;
var buf=_6b4.buf;
var _6b9=_48b.toArray(_6b7,_6b4.requiresEscaping);
if(_6b9.hasRemainder){
xhr.position--;
}
buf.position=buf.limit;
buf.putBytes(_6b9);
buf.position=0;
buf.mark();
parse:
while(true){
if(!buf.hasRemaining()){
break;
}
var type=buf.getUnsigned();
switch(type&128){
case _6a1:
var _6bb=buf.indexOf(_6a2);
if(_6bb==-1){
break parse;
}
var _6bc=buf.array.slice(buf.position,_6bb);
var data=new ByteBuffer(_6bc);
var _6be=_6bb-buf.position;
buf.skip(_6be+1);
buf.mark();
if(type==_6a3){
handleCommandFrame(_6b4,data);
}else{
dispatchText(_6b4,data.getString(Charset.UTF8));
}
break;
case _6a4:
case _6a5:
var _6bf=0;
var _6c0=false;
while(buf.hasRemaining()){
var b=buf.getUnsigned();
_6bf=_6bf<<7;
_6bf|=(b&127);
if((b&128)!=128){
_6c0=true;
break;
}
}
if(!_6c0){
break parse;
}
if(buf.remaining()<_6bf){
break parse;
}
var _6c2=buf.array.slice(buf.position,buf.position+_6bf);
var _6c3=new ByteBuffer(_6c2);
buf.skip(_6bf);
buf.mark();
if(type==_6a4){
dispatchBytes(_6b4,_6c3);
}else{
if(type==_6a7){
dispatchPingReceived(_6b4);
}else{
dispatchText(_6b4,_6c3.getString(Charset.UTF8));
}
}
break;
default:
throw new Error("Emulation protocol error. Unknown frame type: "+type);
}
}
buf.reset();
buf.compact();
};
function handleCommandFrame(_6c4,data){
while(data.remaining()){
var _6c6=String.fromCharCode(data.getUnsigned());
switch(_6c6){
case "0":
break;
case "1":
_6c4.activeXhr.reconnect=true;
break;
case "2":
_6c4.activeXhr.requestClosing=true;
break;
default:
throw new Error("Protocol decode error. Unknown command: "+_6c6);
}
}
};
function dispatchBytes(_6c7,buf){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=_6c7.lastEventId;
e.data=buf;
e.decoder=_2a9;
e.origin=_6c7.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_6c7.onmessage)==="function"){
_6c7.onmessage(e);
}
};
function dispatchText(_6ca,data){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=_6ca.lastEventId;
e.text=data;
e.origin=_6ca.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_6ca.onmessage)==="function"){
_6ca.onmessage(e);
}
};
function dispatchPingReceived(_6cd){
if(typeof (_6cd.onping)==="function"){
_6cd.onping();
}
};
function doClose(_6ce){
doError(_6ce);
};
function doError(_6cf){
if(_6cf.readyState!=2){
_6cf.disconnect();
fireError(_6cf);
}
};
function fireError(_6d0){
var e=document.createEvent("Events");
e.initEvent("error",true,true);
if(typeof (_6d0.onerror)==="function"){
_6d0.onerror(e);
}
};
function startIdleTimer(_6d2,_6d3){
stopIdleTimer(_6d2);
_6d2.idleTimer=setTimeout(function(){
idleTimerHandler(_6d2);
},_6d3);
};
function idleTimerHandler(_6d4){
var _6d5=new Date().getTime();
var _6d6=_6d5-_6d4.lastMessageTimestamp;
var _6d7=_6d4.idleTimeout;
if(_6d6>_6d7){
doError(_6d4);
}else{
startIdleTimer(_6d4,_6d7-_6d6);
}
};
function stopIdleTimer(_6d8){
if(_6d8.idleTimer!=null){
clearTimeout(_6d8.idleTimer);
_6d8.IdleTimer=null;
}
};
return _69b;
})();
var _6d9=(function(){
var _6da=_26a.getLogger("WebSocketEmulatedProxy");
var _6db=function(){
this.parent;
this._listener;
this.closeCode=1005;
this.closeReason="";
};
var _6dc=_6db.prototype;
_6dc.connect=function(_6dd,_6de){
_6da.entering(this,"WebSocketEmulatedProxy.connect",{"location":_6dd,"subprotocol":_6de});
this.URL=_6dd.replace("ws","http");
this.protocol=_6de;
this._prepareQueue=new _4e1();
this._sendQueue=[];
_6df(this);
_6da.exiting(this,"WebSocketEmulatedProxy.<init>");
};
_6dc.readyState=0;
_6dc.bufferedAmount=0;
_6dc.URL="";
_6dc.onopen=function(){
};
_6dc.onerror=function(){
};
_6dc.onmessage=function(_6e0){
};
_6dc.onclose=function(){
};
var _6e1=128;
var _6e2=129;
var _6e3=0;
var _6e4=255;
var _6e5=1;
var _6e6=138;
var _6e7=[_6e5,48,49,_6e4];
var _6e8=[_6e5,48,50,_6e4];
var _6e9=function(buf,_6eb){
_6da.entering(this,"WebSocketEmulatedProxy.encodeLength",{"buf":buf,"length":_6eb});
var _6ec=0;
var _6ed=0;
do{
_6ed<<=8;
_6ed|=(_6eb&127);
_6eb>>=7;
_6ec++;
}while(_6eb>0);
do{
var _6ee=_6ed&255;
_6ed>>=8;
if(_6ec!=1){
_6ee|=128;
}
buf.put(_6ee);
}while(--_6ec>0);
};
_6dc.send=function(data){
var _6f0=this;
_6da.entering(this,"WebSocketEmulatedProxy.send",{"data":data});
switch(this.readyState){
case 0:
_6da.severe(this,"WebSocketEmulatedProxy.send: Error: readyState is 0");
throw new Error("INVALID_STATE_ERR");
case 1:
if(data===null){
_6da.severe(this,"WebSocketEmulatedProxy.send: Error: data is null");
throw new Error("data is null");
}
var buf=new ByteBuffer();
if(typeof data=="string"){
_6da.finest(this,"WebSocketEmulatedProxy.send: Data is string");
var _6f2=new ByteBuffer();
_6f2.putString(data,Charset.UTF8);
buf.put(_6e2);
_6e9(buf,_6f2.position);
buf.putBytes(_6f2.array);
}else{
if(data.constructor==ByteBuffer){
_6da.finest(this,"WebSocketEmulatedProxy.send: Data is ByteBuffer");
buf.put(_6e1);
_6e9(buf,data.remaining());
buf.putBuffer(data);
}else{
if(data.byteLength){
_6da.finest(this,"WebSocketEmulatedProxy.send: Data is ByteArray");
buf.put(_6e1);
_6e9(buf,data.byteLength);
buf.putByteArray(data);
}else{
if(data.size){
_6da.finest(this,"WebSocketEmulatedProxy.send: Data is Blob");
var cb=this._prepareQueue.enqueue(function(_6f4){
var b=new ByteBuffer();
b.put(_6e1);
_6e9(b,_6f4.length);
b.putBytes(_6f4);
b.flip();
doSend(_6f0,b);
});
BlobUtils.asNumberArray(cb,data);
return true;
}else{
_6da.severe(this,"WebSocketEmulatedProxy.send: Error: Invalid type for send");
throw new Error("Invalid type for send");
}
}
}
}
buf.flip();
this._prepareQueue.enqueue(function(_6f6){
doSend(_6f0,buf);
})();
return true;
case 2:
return false;
default:
_6da.severe(this,"WebSocketEmulatedProxy.send: Error: invalid readyState");
throw new Error("INVALID_STATE_ERR");
}
_6da.exiting(this,"WebSocketEmulatedProxy.send");
};
_6dc.close=function(code,_6f8){
_6da.entering(this,"WebSocketEmulatedProxy.close");
switch(this.readyState){
case 0:
_6f9(this);
break;
case 1:
if(code!=null&&code!=0){
this.closeCode=code;
this.closeReason=_6f8;
}
doSend(this,new ByteBuffer(_6e8));
break;
}
};
_6dc.setListener=function(_6fa){
this._listener=_6fa;
};
function openUpstream(_6fb){
if(_6fb.readyState!=1){
return;
}
if(_6fb.idleTimer){
clearTimeout(_6fb.idleTimer);
}
var xdr=new XMLHttpRequest0();
xdr.onreadystatechange=function(){
if(xdr.readyState==4){
switch(xdr.status){
case 200:
setTimeout(function(){
doFlush(_6fb);
},0);
break;
}
}
};
xdr.onload=function(){
openUpstream(_6fb);
};
xdr.open("POST",_6fb._upstream+"&.krn="+Math.random(),true);
_6fb.upstreamXHR=xdr;
_6fb.idleTimer=setTimeout(function(){
if(_6fb.upstreamXHR!=null){
_6fb.upstreamXHR.abort();
}
openUpstream(_6fb);
},30000);
};
function doSend(_6fd,buf){
_6da.entering(this,"WebSocketEmulatedProxy.doSend",buf);
_6fd.bufferedAmount+=buf.remaining();
_6fd._sendQueue.push(buf);
_6ff(_6fd);
if(!_6fd._writeSuspended){
doFlush(_6fd);
}
};
function doFlush(_700){
_6da.entering(this,"WebSocketEmulatedProxy.doFlush");
var _701=_700._sendQueue;
var _702=_701.length;
_700._writeSuspended=(_702>0);
if(_702>0){
if(_700.useXDR){
var out=new ByteBuffer();
while(_701.length){
out.putBuffer(_701.shift());
}
out.putBytes(_6e7);
out.flip();
_700.upstreamXHR.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_700.upstreamXHR.send(_2c4(out,_700.requiresEscaping));
}else{
var xhr=new XMLHttpRequest0();
xhr.open("POST",_700._upstream+"&.krn="+Math.random(),true);
xhr.onreadystatechange=function(){
if(xhr.readyState==4){
_6da.finest(this,"WebSocketEmulatedProxy.doFlush: xhr.status="+xhr.status);
switch(xhr.status){
case 200:
setTimeout(function(){
doFlush(_700);
},0);
break;
default:
_6f9(_700);
break;
}
}
};
var out=new ByteBuffer();
while(_701.length){
out.putBuffer(_701.shift());
}
out.putBytes(_6e7);
out.flip();
if(browser=="firefox"){
if(xhr.sendAsBinary){
_6da.finest(this,"WebSocketEmulatedProxy.doFlush: xhr.sendAsBinary");
xhr.setRequestHeader("Content-Type","application/octet-stream");
xhr.sendAsBinary(_2c4(out));
}else{
xhr.send(_2c4(out));
}
}else{
xhr.setRequestHeader("Content-Type","text/plain; charset=utf-8");
xhr.send(_2c4(out,_700.requiresEscaping));
}
}
}
_700.bufferedAmount=0;
_6ff(_700);
};
var _6df=function(_705){
_6da.entering(this,"WebSocketEmulatedProxy.connect");
var url=new URI(_705.URL);
url.scheme=url.scheme.replace("ws","http");
locationURI=new URI((browser=="ie")?document.URL:location.href);
if(browser=="ie"&&typeof (XDomainRequest)!=="undefined"&&url.scheme===locationURI.scheme){
_705.useXDR=true;
}
switch(browser){
case "opera":
_705.requiresEscaping=true;
break;
case "ie":
if(!_705.useXDR){
_705.requiresEscaping=true;
}else{
if((typeof (Object.defineProperties)==="undefined")&&(navigator.userAgent.indexOf("MSIE 8")>0)){
_705.requiresEscaping=true;
}else{
_705.requiresEscaping=false;
}
}
break;
default:
_705.requiresEscaping=false;
break;
}
var _707=_705.requiresEscaping?"/;e/ctem":"/;e/ctm";
url.path=url.path.replace(/[\/]?$/,_707);
var _708=url.toString();
var _709=_708.indexOf("?");
if(_709==-1){
_708+="?";
}else{
_708+="&";
}
_708+=".kn="+String(Math.random()).substring(2);
_6da.finest(this,"WebSocketEmulatedProxy.connect: Connecting to "+_708);
var _70a=new XMLHttpRequest0();
var _70b=false;
_70a.withCredentials=true;
_70a.open("GET",_708,true);
_70a.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_70a.setRequestHeader("X-WebSocket-Version","wseb-1.0");
_70a.setRequestHeader("X-Accept-Commands","ping");
if(_705.protocol.length){
var _70c=_705.protocol.join(",");
_70a.setRequestHeader("X-WebSocket-Protocol",_70c);
}
for(var i=0;i<_705.parent.requestHeaders.length;i++){
var _70e=_705.parent.requestHeaders[i];
_70a.setRequestHeader(_70e.label,_70e.value);
}
_70a.onreadystatechange=function(){
switch(_70a.readyState){
case 2:
if(_70a.status==403){
doError(_705);
}else{
timer=setTimeout(function(){
if(!_70b){
doError(_705);
}
},5000);
}
break;
case 4:
_70b=true;
if(_70a.status==401){
_705._listener.authenticationRequested(_705.parent,_70a._location,_70a.getResponseHeader("WWW-Authenticate"));
return;
}
if(_705.readyState<1){
if(_70a.status==201){
var _70f=_70a.responseText.split("\n");
_705._upstream=_70f[0];
var _710=_70f[1];
_705._downstream=new _697(_710);
var _711=_710.substring(0,_710.indexOf("/;e/"));
if(_711!=_705.parent._location.toString().replace("ws","http")){
_705.parent._redirectUri=_711;
}
_712(_705,_705._downstream);
_705.parent.responseHeaders=_70a.getAllResponseHeaders();
_713(_705);
}else{
doError(_705);
}
}
break;
}
};
_70a.send(null);
_6da.exiting(this,"WebSocketEmulatedProxy.connect");
};
var _713=function(_714){
_6da.entering(this,"WebSocketEmulatedProxy.doOpen");
_714.readyState=1;
var _715=_714.parent;
_715._acceptedProtocol=_715.responseHeaders["X-WebSocket-Protocol"]||"";
if(_714.useXDR){
this.upstreamXHR=null;
openUpstream(_714);
}
_714._listener.connectionOpened(_714.parent,_715._acceptedProtocol);
};
function doError(_716){
if(_716.readyState<2){
_6da.entering(this,"WebSocketEmulatedProxy.doError");
_716.readyState=2;
if(_716.idleTimer){
clearTimeout(_716.idleTimer);
}
if(_716.upstreamXHR!=null){
_716.upstreamXHR.abort();
}
if(_716.onerror!=null){
_716._listener.connectionFailed(_716.parent);
}
}
};
var _6f9=function(_717,_718,code,_71a){
_6da.entering(this,"WebSocketEmulatedProxy.doClose");
switch(_717.readyState){
case 2:
break;
case 0:
case 1:
_717.readyState=WebSocket.CLOSED;
if(_717.idleTimer){
clearTimeout(_717.idleTimer);
}
if(_717.upstreamXHR!=null){
_717.upstreamXHR.abort();
}
if(typeof _718==="undefined"){
_717._listener.connectionClosed(_717.parent,true,1005,"");
}else{
_717._listener.connectionClosed(_717.parent,_718,code,_71a);
}
break;
default:
}
};
var _6ff=function(_71b){
};
var _71c=function(_71d,_71e){
_6da.finest("WebSocket.handleMessage: A WebSocket frame received on a WebSocket");
if(_71e.text){
_71d._listener.textMessageReceived(_71d.parent,_71e.text);
}else{
if(_71e.data){
_71d._listener.binaryMessageReceived(_71d.parent,_71e.data);
}
}
};
var _71f=function(_720){
var _721=ByteBuffer.allocate(2);
_721.put(_6e6);
_721.put(0);
_721.flip();
doSend(_720,_721);
};
var _712=function(_722,_723){
_6da.entering(this,"WebSocketEmulatedProxy.bindHandlers");
_723.onmessage=function(_724){
switch(_724.type){
case "message":
if(_722.readyState==1){
_71c(_722,_724);
}
break;
}
};
_723.onping=function(){
if(_722.readyState==1){
_71f(_722);
}
};
_723.onerror=function(){
try{
_723.disconnect();
}
finally{
_6f9(_722,true,_722.closeCode,_722.closeReason);
}
};
_723.onclose=function(_725){
try{
_723.disconnect();
}
finally{
_6f9(_722,true,this.closeCode,this.closeReason);
}
};
};
return _6db;
})();
var _726=(function(){
var _727="WebSocketEmulatedDelegateHandler";
var LOG=_26a.getLogger(_727);
var _729=function(){
LOG.finest(_727,"<init>");
};
var _72a=_729.prototype=new _51c();
_72a.processConnect=function(_72b,uri,_72d){
LOG.finest(_727,"connect",_72b);
if(_72b.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
var _72e=!!window.MockWseTransport?new MockWseTransport():new _6d9();
_72e.parent=_72b;
_72b._delegate=_72e;
_72f(_72e,this);
_72e.connect(uri.toString(),_72d);
};
_72a.processTextMessage=function(_730,text){
LOG.finest(_727,"connect",_730);
if(_730.readyState==WebSocket.OPEN){
_730._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_72a.processBinaryMessage=function(_732,obj){
LOG.finest(_727,"processBinaryMessage",_732);
if(_732.readyState==WebSocket.OPEN){
_732._delegate.send(obj);
}else{
throw new Error("WebSocket is already closed");
}
};
_72a.processClose=function(_734,code,_736){
LOG.finest(_727,"close",_734);
try{
_734._delegate.close(code,_736);
}
catch(e){
listener.connectionClosed(_734);
}
};
var _72f=function(_737,_738){
var _739=new _52f(_738);
_737.setListener(_739);
};
return _729;
})();
var _73a=(function(){
var _73b="WebSocketEmulatedAuthenticationHandler";
var LOG=_26a.getLogger(_73b);
var _73d=function(){
LOG.finest(_73b,"<init>");
};
var _73e=_73d.prototype=new _51c();
_73e.handleClearAuthenticationData=function(_73f){
if(_73f._challengeResponse!=null){
_73f._challengeResponse.clearCredentials();
}
};
_73e.handleRemoveAuthenticationData=function(_740){
this.handleClearAuthenticationData(_740);
_740._challengeResponse=new ChallengeResponse(null,null);
};
_73e.handle401=function(_741,_742,_743){
var _744=this;
if(_545.KAAZING_SEC_EXTENSION_REVALIDATE==_743){
var _745=new _59e(_741);
_741.challengeHandler=_741.parent.challengeHandler;
_745.connect(_742);
}else{
var _746=_742;
if(_746.indexOf("/;e/")>0){
_746=_746.substring(0,_746.indexOf("/;e/"));
}
var _747=new _4f9(_746.replace("http","ws"));
var _748=new ChallengeRequest(_746,_743);
var _749;
if(_741._challengeResponse.nextChallengeHandler!=null){
_749=_741._challengeResponse.nextChallengeHandler;
}else{
_749=_741.parent.challengeHandler;
}
if(_749!=null&&_749.canHandle(_748)){
_749.handle(_748,function(_74a){
try{
if(_74a==null||_74a.credentials==null){
_744.handleClearAuthenticationData(_741);
_744._listener.connectionFailed(_741);
}else{
_741._challengeResponse=_74a;
_744.processConnect(_741,_747,_741._protocol);
}
}
catch(e){
_744.handleClearAuthenticationData(_741);
_744._listener.connectionFailed(_741);
}
});
}else{
this.handleClearAuthenticationData(_741);
this._listener.connectionFailed(_741);
}
}
};
_73e.processConnect=function(_74b,_74c,_74d){
if(_74b._challengeResponse!=null&&_74b._challengeResponse.credentials!=null){
var _74e=_74b._challengeResponse.credentials.toString();
for(var i=_74b.requestHeaders.length-1;i>=0;i--){
if(_74b.requestHeaders[i].label==="Authorization"){
_74b.requestHeaders.splice(i,1);
}
}
var _750=new _4eb("Authorization",_74e);
for(var i=_74b.requestHeaders.length-1;i>=0;i--){
if(_74b.requestHeaders[i].label==="Authorization"){
_74b.requestHeaders.splice(i,1);
}
}
_74b.requestHeaders.push(_750);
this.handleClearAuthenticationData(_74b);
}
this._nextHandler.processConnect(_74b,_74c,_74d);
};
_73e.handleAuthenticate=function(_751,_752,_753){
_751.authenticationReceived=true;
this.handle401(_751,_752,_753);
};
_73e.setNextHandler=function(_754){
this._nextHandler=_754;
var _755=new _52f(this);
var _756=this;
_755.authenticationRequested=function(_757,_758,_759){
_756.handleAuthenticate(_757,_758,_759);
};
_754.setListener(_755);
};
_73e.setListener=function(_75a){
this._listener=_75a;
};
return _73d;
})();
var _75b=(function(){
var _75c="WebSocketEmulatedHandler";
var LOG=_26a.getLogger(_75c);
var _75e=new _73a();
var _75f=new _55f();
var _760=new _726();
var _761=function(){
LOG.finest(_75c,"<init>");
this.setNextHandler(_75e);
_75e.setNextHandler(_75f);
_75f.setNextHandler(_760);
};
var _762=_761.prototype=new _51c();
_762.processConnect=function(_763,_764,_765){
var _766=[];
for(var i=0;i<_765.length;i++){
_766.push(_765[i]);
}
var _768=_763._extensions;
if(_768.length>0){
_763.requestHeaders.push(new _4eb(_545.HEADER_SEC_EXTENSIONS,_768.join(";")));
}
this._nextHandler.processConnect(_763,_764,_766);
};
_762.setNextHandler=function(_769){
this._nextHandler=_769;
var _76a=this;
var _76b=new _52f(this);
_76b.commandMessageReceived=function(_76c,_76d){
if(_76d=="CloseCommandMessage"&&_76c.readyState==1){
}
_76a._listener.commandMessageReceived(_76c,_76d);
};
_769.setListener(_76b);
};
_762.setListener=function(_76e){
this._listener=_76e;
};
return _761;
})();
var _76f=(function(){
var _770="WebSocketFlashEmulatedDelegateHandler";
var LOG=_26a.getLogger(_770);
var _772=function(){
LOG.finest(_770,"<init>");
};
var _773=_772.prototype=new _51c();
_773.processConnect=function(_774,uri,_776){
LOG.finest(_770,"connect",_774);
if(_774.readyState==2){
throw new Error("WebSocket is already closed");
}
var _777=new _306();
_777.parent=_774;
_774._delegate=_777;
_778(_777,this);
_777.connect(uri.toString(),_776);
};
_773.processTextMessage=function(_779,text){
LOG.finest(_770,"connect",_779);
if(_779.readyState==1){
_779._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_773.processBinaryMessage=function(_77b,_77c){
LOG.finest(_770,"connect",_77b);
if(_77b.readyState==1){
_77b._delegate.send(_77c);
}else{
throw new Error("WebSocket is already closed");
}
};
_773.processClose=function(_77d,code,_77f){
LOG.finest(_770,"close",_77d);
_77d._delegate.close(code,_77f);
};
var _778=function(_780,_781){
var _782=new _52f(_781);
_780.setListener(_782);
_782.redirected=function(_783,_784){
_783._redirectUri=_784;
};
};
return _772;
})();
var _785=(function(){
var _786="WebSocketFlashEmulatedHandler";
var LOG=_26a.getLogger(_786);
var _788=function(){
var _789=new _73a();
return _789;
};
var _78a=function(){
var _78b=new _55f();
return _78b;
};
var _78c=function(){
var _78d=new _76f();
return _78d;
};
var _78e=_788();
var _78f=_78a();
var _790=_78c();
var _791=function(){
LOG.finest(_786,"<init>");
this.setNextHandler(_78e);
_78e.setNextHandler(_78f);
_78f.setNextHandler(_790);
};
var _792=_791.prototype=new _51c();
_792.processConnect=function(_793,_794,_795){
var _796=[_545.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_795.length;i++){
_796.push(_795[i]);
}
var _798=_793._extensions;
if(_798.length>0){
_793.requestHeaders.push(new _4eb(_545.HEADER_SEC_EXTENSIONS,_798.join(";")));
}
this._nextHandler.processConnect(_793,_794,_796);
};
_792.setNextHandler=function(_799){
this._nextHandler=_799;
var _79a=new _52f(this);
_799.setListener(_79a);
};
_792.setListener=function(_79b){
this._listener=_79b;
};
return _791;
})();
var _79c=(function(){
var _79d="WebSocketFlashRtmpDelegateHandler";
var LOG=_26a.getLogger(_79d);
var _79f;
var _7a0=function(){
LOG.finest(_79d,"<init>");
_79f=this;
};
var _7a1=_7a0.prototype=new _51c();
_7a1.processConnect=function(_7a2,uri,_7a4){
LOG.finest(_79d,"connect",_7a2);
if(_7a2.readyState==2){
throw new Error("WebSocket is already closed");
}
var _7a5=new _337();
_7a5.parent=_7a2;
_7a2._delegate=_7a5;
_7a6(_7a5,this);
_7a5.connect(uri.toString(),_7a4);
};
_7a1.processTextMessage=function(_7a7,text){
LOG.finest(_79d,"connect",_7a7);
if(_7a7.readyState==1){
_7a7._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_7a1.processBinaryMessage=function(_7a9,_7aa){
LOG.finest(_79d,"connect",_7a9);
if(_7a9.readyState==1){
_7a9._delegate.send(_7aa);
}else{
throw new Error("WebSocket is already closed");
}
};
_7a1.processClose=function(_7ab,code,_7ad){
LOG.finest(_79d,"close",_7ab);
_7ab._delegate.close(code,_7ad);
};
var _7a6=function(_7ae,_7af){
var _7b0=new _52f(_7af);
_7b0.redirected=function(_7b1,_7b2){
_7b1._redirectUri=_7b2;
};
_7ae.setListener(_7b0);
};
return _7a0;
})();
var _7b3=(function(){
var _7b4="WebSocketFlashRtmpHandler";
var LOG=_26a.getLogger(_7b4);
var _7b6=function(){
var _7b7=new _73a();
return _7b7;
};
var _7b8=function(){
var _7b9=new _55f();
return _7b9;
};
var _7ba=function(){
var _7bb=new _79c();
return _7bb;
};
var _7bc=_7b6();
var _7bd=_7b8();
var _7be=_7ba();
var _7bf=function(){
LOG.finest(_7b4,"<init>");
this.setNextHandler(_7bc);
_7bc.setNextHandler(_7bd);
_7bd.setNextHandler(_7be);
};
var _7c0=function(_7c1,_7c2){
LOG.finest(_7b4,"<init>");
};
var _7c3=_7bf.prototype=new _51c();
_7c3.setNextHandler=function(_7c4){
this._nextHandler=_7c4;
var _7c5=new _52f(this);
_7c4.setListener(_7c5);
};
_7c3.setListener=function(_7c6){
this._listener=_7c6;
};
return _7bf;
})();
var _7c7=(function(){
var _7c8="WebSocketSelectedHandler";
var _LOG=_26a.getLogger(_7c8);
var _7ca=function(){
_LOG.fine(_7c8,"<init>");
};
var _7cb=_7ca.prototype=new _51c();
_7cb.processConnect=function(_7cc,uri,_7ce){
_LOG.fine(_7c8,"connect",_7cc);
if(_7cc.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
this._nextHandler.processConnect(_7cc,uri,_7ce);
};
_7cb.handleConnectionOpened=function(_7cf,_7d0){
_LOG.fine(_7c8,"handleConnectionOpened");
var _7d1=_7cf;
if(_7d1.readyState==WebSocket.CONNECTING){
_7d1.readyState=WebSocket.OPEN;
this._listener.connectionOpened(_7cf,_7d0);
}
};
_7cb.handleMessageReceived=function(_7d2,_7d3){
_LOG.fine(_7c8,"handleMessageReceived",_7d3);
if(_7d2.readyState!=WebSocket.OPEN){
return;
}
this._listener.textMessageReceived(_7d2,_7d3);
};
_7cb.handleBinaryMessageReceived=function(_7d4,_7d5){
_LOG.fine(_7c8,"handleBinaryMessageReceived",_7d5);
if(_7d4.readyState!=WebSocket.OPEN){
return;
}
this._listener.binaryMessageReceived(_7d4,_7d5);
};
_7cb.handleConnectionClosed=function(_7d6,_7d7,code,_7d9){
_LOG.fine(_7c8,"handleConnectionClosed");
var _7da=_7d6;
if(_7da.readyState!=WebSocket.CLOSED){
_7da.readyState=WebSocket.CLOSED;
this._listener.connectionClosed(_7d6,_7d7,code,_7d9);
}
};
_7cb.handleConnectionFailed=function(_7db){
_LOG.fine(_7c8,"connectionFailed");
if(_7db.readyState!=WebSocket.CLOSED){
_7db.readyState=WebSocket.CLOSED;
this._listener.connectionFailed(_7db);
}
};
_7cb.handleConnectionError=function(_7dc,e){
_LOG.fine(_7c8,"connectionError");
this._listener.connectionError(_7dc,e);
};
_7cb.setNextHandler=function(_7de){
this._nextHandler=_7de;
var _7df={};
var _7e0=this;
_7df.connectionOpened=function(_7e1,_7e2){
_7e0.handleConnectionOpened(_7e1,_7e2);
};
_7df.redirected=function(_7e3,_7e4){
throw new Error("invalid event received");
};
_7df.authenticationRequested=function(_7e5,_7e6,_7e7){
throw new Error("invalid event received");
};
_7df.textMessageReceived=function(_7e8,buf){
_7e0.handleMessageReceived(_7e8,buf);
};
_7df.binaryMessageReceived=function(_7ea,buf){
_7e0.handleBinaryMessageReceived(_7ea,buf);
};
_7df.connectionClosed=function(_7ec,_7ed,code,_7ef){
_7e0.handleConnectionClosed(_7ec,_7ed,code,_7ef);
};
_7df.connectionFailed=function(_7f0){
_7e0.handleConnectionFailed(_7f0);
};
_7df.connectionError=function(_7f1,e){
_7e0.handleConnectionError(_7f1,e);
};
_7de.setListener(_7df);
};
_7cb.setListener=function(_7f3){
this._listener=_7f3;
};
return _7ca;
})();
var _7f4=(function(){
var _7f5=function(_7f6,_7f7,_7f8){
this._nativeEquivalent=_7f6;
this._handler=_7f7;
this._channelFactory=_7f8;
};
return _7f5;
})();
var _7f9=(function(){
var _7fa="WebSocketCompositeHandler";
var _LOG=_26a.getLogger(_7fa);
var _7fc="javascript:ws";
var _7fd="javascript:wss";
var _7fe="javascript:wse";
var _7ff="javascript:wse+ssl";
var _800="flash:wse";
var _801="flash:wse+ssl";
var _802="flash:wsr";
var _803="flash:wsr+ssl";
var _804={};
var _805={};
var _806=new _554();
var _807=new _54d();
var _808=true;
var _809={};
if(Object.defineProperty){
try{
Object.defineProperty(_809,"prop",{get:function(){
return true;
}});
_808=false;
}
catch(e){
}
}
var _80a=function(){
this._handlerListener=createListener(this);
this._nativeHandler=createNativeHandler(this);
this._emulatedHandler=createEmulatedHandler(this);
this._emulatedFlashHandler=createFlashEmulatedHandler(this);
this._rtmpFlashHandler=createFlashRtmpHandler(this);
_LOG.finest(_7fa,"<init>");
pickStrategies();
_804[_7fc]=new _7f4("ws",this._nativeHandler,_806);
_804[_7fd]=new _7f4("wss",this._nativeHandler,_806);
_804[_7fe]=new _7f4("ws",this._emulatedHandler,_807);
_804[_7ff]=new _7f4("wss",this._emulatedHandler,_807);
_804[_800]=new _7f4("ws",this._emulatedFlashHandler,_807);
_804[_801]=new _7f4("wss",this._emulatedFlashHandler,_807);
_804[_802]=new _7f4("ws",this._rtmpFlashHandler,_807);
_804[_803]=new _7f4("wss",this._rtmpFlashHandler,_807);
};
function isIE6orIE7(){
if(browser!="ie"){
return false;
}
var _80b=navigator.appVersion;
return (_80b.indexOf("MSIE 6.0")>=0||_80b.indexOf("MSIE 7.0")>=0);
};
function isXdrDisabledonIE8IE9(){
if(browser!="ie"){
return false;
}
var _80c=navigator.appVersion;
return ((_80c.indexOf("MSIE 8.0")>=0||_80c.indexOf("MSIE 9.0")>=0)&&typeof (XDomainRequest)==="undefined");
};
function pickStrategies(){
if(isIE6orIE7()||isXdrDisabledonIE8IE9()){
_805["ws"]=new Array(_7fc,_800,_7fe);
_805["wss"]=new Array(_7fd,_801,_7ff);
}else{
_805["ws"]=new Array(_7fc,_7fe);
_805["wss"]=new Array(_7fd,_7ff);
}
};
function createListener(_80d){
var _80e={};
_80e.connectionOpened=function(_80f,_810){
_80d.handleConnectionOpened(_80f,_810);
};
_80e.binaryMessageReceived=function(_811,buf){
_80d.handleMessageReceived(_811,buf);
};
_80e.textMessageReceived=function(_813,text){
var _815=_813.parent;
_815._webSocketChannelListener.handleMessage(_815._webSocket,text);
};
_80e.connectionClosed=function(_816,_817,code,_819){
_80d.handleConnectionClosed(_816,_817,code,_819);
};
_80e.connectionFailed=function(_81a){
_80d.handleConnectionFailed(_81a);
};
_80e.connectionError=function(_81b,e){
_80d.handleConnectionError(_81b,e);
};
_80e.authenticationRequested=function(_81d,_81e,_81f){
};
_80e.redirected=function(_820,_821){
};
_80e.onBufferedAmountChange=function(_822,n){
_80d.handleBufferedAmountChange(_822,n);
};
return _80e;
};
function createNativeHandler(_824){
var _825=new _7c7();
var _826=new _679();
_825.setListener(_824._handlerListener);
_825.setNextHandler(_826);
return _825;
};
function createEmulatedHandler(_827){
var _828=new _7c7();
var _829=new _75b();
_828.setListener(_827._handlerListener);
_828.setNextHandler(_829);
return _828;
};
function createFlashEmulatedHandler(_82a){
var _82b=new _7c7();
var _82c=new _785();
_82b.setListener(_82a._handlerListener);
_82b.setNextHandler(_82c);
return _82b;
};
function createFlashRtmpHandler(_82d){
var _82e=new _7c7();
var _82f=new _7b3();
_82e.setListener(_82d._handlerListener);
_82e.setNextHandler(_82f);
return _82e;
};
var _830=function(_831,_832){
var _833=_804[_832];
var _834=_833._channelFactory;
var _835=_831._location;
var _836=_834.createChannel(_835,_831._protocol);
_831._selectedChannel=_836;
_836.parent=_831;
_836._extensions=_831._extensions;
_836._handler=_833._handler;
_836._handler.processConnect(_831._selectedChannel,_835,_831._protocol);
};
var _837=_80a.prototype;
_837.fallbackNext=function(_838){
_LOG.finest(_7fa,"fallbackNext");
var _839=_838.getNextStrategy();
if(_839==null){
this.doClose(_838,false,1006,"");
}else{
_830(_838,_839);
}
};
_837.doOpen=function(_83a,_83b){
if(_83a.readyState===WebSocket.CONNECTING){
_83a.readyState=WebSocket.OPEN;
if(_808){
_83a._webSocket.readyState=WebSocket.OPEN;
}
_83a._webSocketChannelListener.handleOpen(_83a._webSocket,_83b);
}
};
_837.doClose=function(_83c,_83d,code,_83f){
if(_83c.readyState===WebSocket.CONNECTING||_83c.readyState===WebSocket.OPEN||_83c.readyState===WebSocket.CLOSING){
_83c.readyState=WebSocket.CLOSED;
if(_808){
_83c._webSocket.readyState=WebSocket.CLOSED;
}
_83c._webSocketChannelListener.handleClose(_83c._webSocket,_83d,code,_83f);
}
};
_837.doBufferedAmountChange=function(_840,n){
_840._webSocketChannelListener.handleBufferdAmountChange(_840._webSocket,n);
};
_837.processConnect=function(_842,_843,_844){
_LOG.finest(_7fa,"connect",_842);
var _845=_842;
_LOG.finest("Current ready state = "+_845.readyState);
if(_845.readyState===WebSocket.OPEN){
_LOG.fine("Attempt to reconnect an existing open WebSocket to a different location");
throw new Error("Attempt to reconnect an existing open WebSocket to a different location");
}
var _846=_845._compositeScheme;
if(_846!="ws"&&_846!="wss"){
var _847=_804[_846];
if(_847==null){
throw new Error("Invalid connection scheme: "+_846);
}
_LOG.finest("Turning off fallback since the URL is prefixed with java:");
_845._connectionStrategies.push(_846);
}else{
var _848=_805[_846];
if(_848!=null){
for(var i=0;i<_848.length;i++){
_845._connectionStrategies.push(_848[i]);
}
}else{
throw new Error("Invalid connection scheme: "+_846);
}
}
this.fallbackNext(_845);
};
_837.processTextMessage=function(_84a,_84b){
_LOG.finest(_7fa,"send",_84b);
var _84c=_84a;
if(_84c.readyState!=WebSocket.OPEN){
_LOG.fine("Attempt to post message on unopened or closed web socket");
throw new Error("Attempt to post message on unopened or closed web socket");
}
var _84d=_84c._selectedChannel;
_84d._handler.processTextMessage(_84d,_84b);
};
_837.processBinaryMessage=function(_84e,_84f){
_LOG.finest(_7fa,"send",_84f);
var _850=_84e;
if(_850.readyState!=WebSocket.OPEN){
_LOG.fine("Attempt to post message on unopened or closed web socket");
throw new Error("Attempt to post message on unopened or closed web socket");
}
var _851=_850._selectedChannel;
_851._handler.processBinaryMessage(_851,_84f);
};
_837.processClose=function(_852,code,_854){
_LOG.finest(_7fa,"close");
var _855=_852;
if(typeof code!="undefined"){
if(code!=1000&&(code<3000||code>4999)){
var _856=Error("code must equal to 1000 or in range 3000 to 4999");
_856.name="InvalidAccessError";
throw _856;
}
}
if(typeof _854!="undefined"&&_854.length>0){
var buf=new ByteBuffer();
buf.putString(_854,Charset.UTF8);
buf.flip();
if(buf.remaining()>123){
throw new SyntaxError("SyntaxError: reason is longer than 123 bytes");
}
}
if(_852.readyState===WebSocket.CONNECTING||_852.readyState===WebSocket.OPEN){
_852.readyState=WebSocket.CLOSING;
if(_808){
_852._webSocket.readyState=WebSocket.CLOSING;
}
var _858=_855._selectedChannel;
_858._handler.processClose(_858,code,_854);
}
};
_837.setListener=function(_859){
this._listener=_859;
};
_837.handleConnectionOpened=function(_85a,_85b){
var _85c=_85a.parent;
this.doOpen(_85c,_85b);
};
_837.handleMessageReceived=function(_85d,obj){
var _85f=_85d.parent;
switch(_85f.readyState){
case WebSocket.OPEN:
if(_85f._webSocket.binaryType==="blob"&&obj.constructor==ByteBuffer){
obj=obj.getBlob(obj.remaining());
}else{
if(_85f._webSocket.binaryType==="arraybuffer"&&obj.constructor==ByteBuffer){
obj=obj.getArrayBuffer(obj.remaining());
}else{
if(_85f._webSocket.binaryType==="blob"&&obj.byteLength){
obj=new Blob([new Uint8Array(obj)]);
}else{
if(_85f._webSocket.binaryType==="bytebuffer"&&obj.byteLength){
var u=new Uint8Array(obj);
var _861=[];
for(var i=0;i<u.byteLength;i++){
_861.push(u[i]);
}
obj=new ByteBuffer(_861);
}else{
if(_85f._webSocket.binaryType==="bytebuffer"&&obj.size){
var cb=function(_864){
var b=new ByteBuffer();
b.putBytes(_864);
b.flip();
_85f._webSocketChannelListener.handleMessage(_85f._webSocket,b);
};
BlobUtils.asNumberArray(cb,data);
return;
}
}
}
}
}
_85f._webSocketChannelListener.handleMessage(_85f._webSocket,obj);
break;
case WebSocket.CONNECTING:
case WebSocket.CLOSING:
case WebSocket.CLOSED:
break;
default:
throw new Error("Socket has invalid readyState: "+$this.readyState);
}
};
_837.handleConnectionClosed=function(_866,_867,code,_869){
var _86a=_866.parent;
if(_86a.readyState===WebSocket.CONNECTING&&!_866.authenticationReceived){
this.fallbackNext(_86a);
}else{
this.doClose(_86a,_867,code,_869);
}
};
_837.handleConnectionFailed=function(_86b){
var _86c=_86b.parent;
if(_86c.readyState===WebSocket.CONNECTING&&!_86b.authenticationReceived){
this.fallbackNext(_86c);
}else{
this.doClose(_86c,false,1006,"");
}
};
_837.handleConnectionError=function(_86d,e){
var _86f=_86d.parent;
_86f._webSocketChannelListener.handleError(_86f._webSocket,e);
};
return _80a;
})();
(function(){
var _870=new _7f9();
window.WebSocket=(function(){
var _871="WebSocket";
var LOG=_26a.getLogger(_871);
var _873={};
var _874=function(url,_876,_877){
LOG.entering(this,"WebSocket.<init>",{"url":url,"protocol":_876});
this.url=url;
this.protocol=_876;
this.extensions=_877||[];
this._queue=[];
this._origin="";
this._eventListeners={};
setProperties(this);
_878(this,this.url,this.protocol,this.extensions);
};
var _879=function(s){
if(s.length==0){
return false;
}
var _87b="()<>@,;:\\<>/[]?={}\t \n";
for(var i=0;i<s.length;i++){
var c=s.substr(i,1);
if(_87b.indexOf(c)!=-1){
return false;
}
var code=s.charCodeAt(i);
if(code<33||code>126){
return false;
}
}
return true;
};
var _87f=function(_880){
if(typeof (_880)==="undefined"){
return true;
}else{
if(typeof (_880)==="string"){
return _879(_880);
}else{
for(var i=0;i<_880.length;i++){
if(!_879(_880[i])){
return false;
}
}
return true;
}
}
};
var _878=function(_882,_883,_884,_885){
if(!_87f(_884)){
throw new Error("SyntaxError: invalid protocol: "+_884);
}
var uri=new _508(_883);
if(!uri.isSecure()&&document.location.protocol==="https:"){
throw new Error("SecurityException: non-secure connection attempted from secure origin");
}
var _887=[];
if(typeof (_884)!="undefined"){
if(typeof _884=="string"&&_884.length){
_887=[_884];
}else{
if(_884.length){
_887=_884;
}
}
}
_882._channel=new _55a(uri,_887);
_882._channel._webSocket=_882;
_882._channel._webSocketChannelListener=_873;
_882._channel._extensions=_885;
_870.processConnect(_882._channel,uri.getWSEquivalent());
};
function setProperties(_888){
_888.onmessage=null;
_888.onopen=null;
_888.onclose=null;
_888.onerror=null;
if(Object.defineProperty){
try{
Object.defineProperty(_888,"readyState",{get:function(){
if(_888._channel){
return _888._channel.readyState;
}else{
return _874.CLOSED;
}
},set:function(){
throw new Error("Cannot set read only property readyState");
}});
var _889="blob";
Object.defineProperty(_888,"binaryType",{enumerable:true,configurable:true,get:function(){
return _889;
},set:function(val){
if(val==="blob"||val==="arraybuffer"||val==="bytebuffer"){
_889=val;
}else{
throw new SyntaxError("Invalid binaryType. Valid values are 'blob', 'arraybuffer' and 'bytebuffer'");
}
}});
Object.defineProperty(_888,"bufferedAmount",{get:function(){
return _888._channel.getBufferedAmount();
},set:function(){
throw new Error("Cannot set read only property bufferedAmount");
}});
}
catch(ex){
_888.readyState=_874.CONNECTING;
_888.binaryType="blob";
_888.bufferedAmount=0;
}
}else{
_888.readyState=_874.CONNECTING;
_888.binaryType="blob";
_888.bufferedAmount=0;
}
};
var _88b=_874.prototype;
_88b.send=function(data){
switch(this.readyState){
case 0:
LOG.error("WebSocket.send: Error: Attempt to send message on unopened or closed WebSocket");
throw new Error("Attempt to send message on unopened or closed WebSocket");
case 1:
if(typeof (data)==="string"){
_870.processTextMessage(this._channel,data);
}else{
_870.processBinaryMessage(this._channel,data);
}
break;
case 2:
case 3:
break;
default:
LOG.error("WebSocket.send: Illegal state error");
throw new Error("Illegal state error");
}
};
_88b.close=function(code,_88e){
switch(this.readyState){
case 0:
case 1:
_870.processClose(this._channel,code,_88e);
break;
case 2:
case 3:
break;
default:
LOG.error("WebSocket.close: Illegal state error");
throw new Error("Illegal state error");
}
};
var _88f=function(_890,data){
var _892=new MessageEvent(_890,data,_890._origin);
_890.dispatchEvent(_892);
};
var _893=function(_894){
var _895=new Date().getTime();
var _896=_895+50;
while(_894._queue.length>0){
if(new Date().getTime()>_896){
setTimeout(function(){
_893(_894);
},0);
return;
}
var buf=_894._queue.shift();
var ok=false;
try{
_88f(_894,buf);
ok=true;
}
finally{
if(!ok){
if(_894._queue.length==0){
_894._delivering=false;
}else{
setTimeout(function(){
_893(_894);
},0);
}
}
}
}
_894._delivering=false;
};
var _899=function(_89a,_89b,code,_89d){
LOG.entering(_89a,"WebSocket.doClose");
delete _89a._channel;
setTimeout(function(){
var _89e=new CloseEvent(_89a,_89b,code,_89d);
_89a.dispatchEvent(_89e);
},0);
};
_873.handleOpen=function(_89f,_8a0){
_89f.protocol=_8a0;
var _8a1={type:"open",bubbles:true,cancelable:true,target:_89f};
_89f.dispatchEvent(_8a1);
};
_873.handleMessage=function(_8a2,obj){
if(!Object.defineProperty&&!(typeof (obj)==="string")){
var _8a4=_8a2.binaryType;
if(!(_8a4==="blob"||_8a4==="arraybuffer"||_8a4==="bytebuffer")){
var _8a5={type:"error",bubbles:true,cancelable:true,target:_8a2,message:"Invalid binaryType. Valid values are 'blob', 'arraybuffer' and 'bytebuffer'"};
_8a2.dispatchEvent(_8a5);
return;
}
}
_8a2._queue.push(obj);
if(!_8a2._delivering){
_8a2._delivering=true;
_893(_8a2);
}
};
_873.handleClose=function(_8a6,_8a7,code,_8a9){
_899(_8a6,_8a7,code,_8a9);
};
_873.handleError=function(_8aa,_8ab){
LOG.entering(_8aa,"WebSocket.handleError"+_8ab);
setTimeout(function(){
_8aa.dispatchEvent(_8ab);
},0);
};
_873.handleBufferdAmountChange=function(_8ac,n){
_8ac.bufferedAmount=n;
};
_88b.addEventListener=function(type,_8af,_8b0){
this._eventListeners[type]=this._eventListeners[type]||[];
this._eventListeners[type].push(_8af);
};
_88b.removeEventListener=function(type,_8b2,_8b3){
var _8b4=this._eventListeners[type];
if(_8b4){
for(var i=0;i<_8b4.length;i++){
if(_8b4[i]==_8b2){
_8b4.splice(i,1);
return;
}
}
}
};
_88b.dispatchEvent=function(e){
var type=e.type;
if(!type){
throw new Error("Cannot dispatch invalid event "+e);
}
try{
var _8b8=this["on"+type];
if(typeof _8b8==="function"){
_8b8(e);
}
}
catch(e){
LOG.severe(this,type+" event handler: Error thrown from application");
}
var _8b9=this._eventListeners[type];
if(_8b9){
for(var i=0;i<_8b9.length;i++){
try{
_8b9[i](e);
}
catch(e2){
LOG.severe(this,type+" event handler: Error thrown from application");
}
}
}
};
_874.CONNECTING=_88b.CONNECTING=0;
_874.OPEN=_88b.OPEN=1;
_874.CLOSING=_88b.CLOSING=2;
_874.CLOSED=_88b.CLOSED=3;
return _874;
})();
window.WebSocket.__impls__={};
window.WebSocket.__impls__["flash:wse"]=_306;
}());
(function(){
window.WebSocketExtension=(function(){
var _8bb="WebSocketExtension";
var LOG=_26a.getLogger(_8bb);
var _8bd=function(name){
this.name=name;
this.parameters={};
this.enabled=false;
this.negotiated=false;
};
var _8bf=_8bd.prototype;
_8bf.getParameter=function(_8c0){
return this.parameters[_8c0];
};
_8bf.setParameter=function(_8c1,_8c2){
this.parameters[_8c1]=_8c2;
};
_8bf.getParameters=function(){
var arr=[];
for(var name in this.parameters){
if(this.parameters.hasOwnProperty(name)){
arr.push(name);
}
}
return arr;
};
_8bf.parse=function(str){
var arr=str.split(";");
if(arr[0]!=this.name){
throw new Error("Error: name not match");
}
this.parameters={};
for(var i=1;i<arr.length;i++){
var _8c8=arr[i].indexOf("=");
this.parameters[arr[i].subString(0,_8c8)]=arr[i].substring(_8c8+1);
}
};
_8bf.toString=function(){
var arr=[this.name];
for(var p in this.parameters){
if(this.parameters.hasOwnProperty(p)){
arr.push(p.name+"="+this.parameters[p]);
}
}
return arr.join(";");
};
return _8bd;
})();
})();
(function(){
window.WebSocketRevalidateExtension=(function(){
var _8cb=function(){
};
var _8cc=_8cb.prototype=new WebSocketExtension(_545.KAAZING_SEC_EXTENSION_REVALIDATE);
return _8cb;
})();
})();
(function(){
window.WebSocketFactory=(function(){
var _8cd="WebSocketFactory";
var LOG=_26a.getLogger(_8cd);
var _8cf=function(){
this.extensions={};
var _8d0=new WebSocketRevalidateExtension();
this.extensions[_8d0.name]=_8d0;
};
var _8d1=_8cf.prototype;
_8d1.getExtension=function(name){
return this.extensions[name];
};
_8d1.setExtension=function(_8d3){
this.extensions[_8d3.name]=_8d3;
};
_8d1.setChallengeHandler=function(_8d4){
this.challengeHandler=_8d4;
var _8d5=this.extensions[_545.KAAZING_SEC_EXTENSION_REVALIDATE];
_8d5.enabled=(_8d4!=null);
};
_8d1.getChallengeHandler=function(){
return this.challengeHandler;
};
_8d1.createWebSocket=function(url,_8d7){
var ext=[];
for(var key in this.extensions){
if(this.extensions.hasOwnProperty(key)&&this.extensions[key].enabled){
ext.push(this.extensions[key].toString());
}
}
var ws=new WebSocket(url,_8d7,ext);
if(typeof (this.challengeHandler)!="undefined"){
ws._channel.challengeHandler=this.challengeHandler;
}
return ws;
};
return _8cf;
})();
})();
window.___Loader=new _39f(_269);
})();
})();
