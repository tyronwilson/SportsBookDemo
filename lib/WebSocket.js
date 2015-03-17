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
var _295=function(key){
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name===key){
var v=tags[i].content;
return v;
}
}
};
var _29a=function(_29b){
var _29c=[];
for(var i=0;i<_29b.length;i++){
_29c.push(_29b[i]);
}
return _29c;
};
var _29e=function(_29f,_2a0){
var _2a1=[];
for(var i=0;i<_29f.length;i++){
var elt=_29f[i];
if(_2a0(elt)){
_2a1.push(_29f[i]);
}
}
return _2a1;
};
var _2a4=function(_2a5,_2a6){
for(var i=0;i<_2a5.length;i++){
if(_2a5[i]==_2a6){
return i;
}
}
return -1;
};
var _2a8=function(s){
var a=[];
for(var i=0;i<s.length;i++){
a.push(s.charCodeAt(i)&255);
}
var buf=new ByteBuffer(a);
var v=_2ae(buf,Charset.UTF8);
return v;
};
var _2af=function(_2b0){
var buf=new Uint8Array(_2b0);
var a=[];
for(var i=0;i<buf.length;i++){
a.push(buf[i]);
}
var buf=new ByteBuffer(a);
var s=_2ae(buf,Charset.UTF8);
return s;
};
var _2b5=function(_2b6){
var buf=new Uint8Array(_2b6);
var a=[];
for(var i=0;i<buf.length;i++){
a.push(buf[i]);
}
return new ByteBuffer(a);
};
var _2ba=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _2bc="\n";
var _2bd=function(buf){
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(n);
switch(chr){
case _2ba:
a.push(_2ba);
a.push(_2ba);
break;
case NULL:
a.push(_2ba);
a.push("0");
break;
case _2bc:
a.push(_2ba);
a.push("n");
break;
default:
a.push(chr);
}
}
var v=a.join("");
return v;
};
var _2c3=function(buf,_2c5){
if(_2c5){
return _2bd(buf);
}else{
var _2c6=buf.array;
var _2c7=(buf.position==0&&buf.limit==_2c6.length)?_2c6:buf.getBytes(buf.remaining());
var _2c8=!(XMLHttpRequest.prototype.sendAsBinary);
for(var i=_2c7.length-1;i>=0;i--){
var _2ca=_2c7[i];
if(_2ca==0&&_2c8){
_2c7[i]=256;
}else{
if(_2ca<0){
_2c7[i]=_2ca&255;
}
}
}
var _2cb=0;
var _2cc=[];
do{
var _2cd=Math.min(_2c7.length-_2cb,10000);
partOfBytes=_2c7.slice(_2cb,_2cb+_2cd);
_2cb+=_2cd;
_2cc.push(String.fromCharCode.apply(null,partOfBytes));
}while(_2cb<_2c7.length);
var _2ce=_2cc.join("");
if(_2c7===_2c6){
for(var i=_2c7.length-1;i>=0;i--){
var _2ca=_2c7[i];
if(_2ca==256){
_2c7[i]=0;
}
}
}
return _2ce;
}
};
var _2ae=function(buf,cs){
var _2d1=buf.position;
var _2d2=buf.limit;
var _2d3=buf.array;
while(_2d1<_2d2){
_2d1++;
}
try{
buf.limit=_2d1;
return cs.decode(buf);
}
finally{
if(_2d1!=_2d2){
buf.limit=_2d2;
buf.position=_2d1+1;
}
}
};
var _2d4=window.WebSocket;
var _2d5=(function(){
var _2d6=function(){
this.parent;
this._listener;
this.code=1005;
this.reason="";
};
var _2d7=(browser=="safari"&&typeof (_2d4.CLOSING)=="undefined");
var _2d8=_2d6.prototype;
_2d8.connect=function(_2d9,_2da){
if(typeof (_2d4)==="undefined"){
doError(this);
return;
}
if(_2d9.indexOf("javascript:")==0){
_2d9=_2d9.substr("javascript:".length);
}
var _2db=_2d9.indexOf("?");
if(_2db!=-1){
if(!/[\?&]\.kl=Y/.test(_2d9.substring(_2db))){
_2d9+="&.kl=Y";
}
}else{
_2d9+="?.kl=Y";
}
this._sendQueue=[];
try{
if(_2da){
this._requestedProtocol=_2da;
this._delegate=new _2d4(_2d9,_2da);
}else{
this._delegate=new _2d4(_2d9);
}
this._delegate.binaryType="arraybuffer";
}
catch(e){
doError(this);
return;
}
bindHandlers(this);
};
_2d8.onerror=function(){
};
_2d8.onmessage=function(){
};
_2d8.onopen=function(){
};
_2d8.onclose=function(){
};
_2d8.close=function(code,_2dd){
if(code){
if(_2d7){
doCloseDraft76Compat(this,code,_2dd);
}else{
this._delegate.close(code,_2dd);
}
}else{
this._delegate.close();
}
};
function doCloseDraft76Compat(_2de,code,_2e0){
_2de.code=code|1005;
_2de.reason=_2e0|"";
_2de._delegate.close();
};
_2d8.send=function(_2e1){
doSend(this,_2e1);
return;
};
_2d8.setListener=function(_2e2){
this._listener=_2e2;
};
_2d8.setIdleTimeout=function(_2e3){
this.lastMessageTimestamp=new Date().getTime();
this.idleTimeout=_2e3;
startIdleTimer(this,_2e3);
return;
};
function doSend(_2e4,_2e5){
if(typeof (_2e5)=="string"){
_2e4._delegate.send(_2e5);
}else{
if(_2e5.byteLength||_2e5.size){
_2e4._delegate.send(_2e5);
}else{
if(_2e5.constructor==ByteBuffer){
_2e4._delegate.send(_2e5.getArrayBuffer(_2e5.remaining()));
}else{
throw new Error("Cannot call send() with that type");
}
}
}
};
function doError(_2e6,e){
setTimeout(function(){
_2e6._listener.connectionFailed(_2e6.parent);
},0);
};
function encodeMessageData(_2e8,e){
var buf;
if(typeof e.data.byteLength!=="undefined"){
buf=_2b5(e.data);
}else{
buf=ByteBuffer.allocate(e.data.length);
if(_2e8.parent._isBinary&&_2e8.parent._balanced>1){
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
function messageHandler(_2ec,e){
_2ec.lastMessageTimestamp=new Date().getTime();
if(typeof (e.data)==="string"){
_2ec._listener.textMessageReceived(_2ec.parent,e.data);
}else{
_2ec._listener.binaryMessageReceived(_2ec.parent,e.data);
}
};
function closeHandler(_2ee,e){
unbindHandlers(_2ee);
if(_2d7){
_2ee._listener.connectionClosed(_2ee.parent,true,_2ee.code,_2ee.reason);
}else{
_2ee._listener.connectionClosed(_2ee.parent,e.wasClean,e.code,e.reason);
}
};
function errorHandler(_2f0,e){
_2f0._listener.connectionError(_2f0.parent,e);
};
function openHandler(_2f2,e){
if(_2d7){
_2f2._delegate.protocol=_2f2._requestedProtocol;
}
_2f2._listener.connectionOpened(_2f2.parent,_2f2._delegate.protocol);
};
function bindHandlers(_2f4){
var _2f5=_2f4._delegate;
_2f5.onopen=function(e){
openHandler(_2f4,e);
};
_2f5.onmessage=function(e){
messageHandler(_2f4,e);
};
_2f5.onclose=function(e){
closeHandler(_2f4,e);
};
_2f5.onerror=function(e){
errorHandler(_2f4,e);
};
_2f4.readyState=function(){
return _2f5.readyState;
};
};
function unbindHandlers(_2fa){
var _2fb=_2fa._delegate;
_2fb.onmessage=undefined;
_2fb.onclose=undefined;
_2fb.onopen=undefined;
_2fb.onerror=undefined;
_2fa.readyState=WebSocket.CLOSED;
};
function startIdleTimer(_2fc,_2fd){
stopIdleTimer(_2fc);
_2fc.idleTimer=setTimeout(function(){
idleTimerHandler(_2fc);
},_2fd);
};
function idleTimerHandler(_2fe){
var _2ff=new Date().getTime();
var _300=_2ff-_2fe.lastMessageTimestamp;
var _301=_2fe.idleTimeout;
if(_300>_301){
try{
var _302=_2fe._delegate;
if(_302){
unbindHandlers(_2fe);
_302.close();
}
}
finally{
_2fe._listener.connectionClosed(_2fe.parent,false,1006,"");
}
}else{
startIdleTimer(_2fe,_301-_300);
}
};
function stopIdleTimer(_303){
if(_303.idleTimer!=null){
clearTimeout(_303.idleTimer);
_303.IdleTimer=null;
}
};
return _2d6;
})();
var _304=(function(){
var _305=function(){
this.parent;
this._listener;
};
var _306=_305.prototype;
_306.connect=function(_307,_308){
this.URL=_307;
try{
_309(this,_307,_308);
}
catch(e){
doError(this,e);
}
this.constructor=_305;
};
_306.setListener=function(_30a){
this._listener=_30a;
};
_305._flashBridge={};
_305._flashBridge.readyWaitQueue=[];
_305._flashBridge.failWaitQueue=[];
_305._flashBridge.flashHasLoaded=false;
_305._flashBridge.flashHasFailed=false;
_306.URL="";
_306.readyState=0;
_306.bufferedAmount=0;
_306.connectionOpened=function(_30b,_30c){
var _30c=_30c.split("\n");
for(var i=0;i<_30c.length;i++){
var _30e=_30c[i].split(":");
_30b.responseHeaders[_30e[0]]=_30e[1];
}
this._listener.connectionOpened(_30b,"");
};
_306.connectionClosed=function(_30f,_310,code,_312){
this._listener.connectionClosed(_30f,_310,code,_312);
};
_306.connectionFailed=function(_313){
this._listener.connectionFailed(_313);
};
_306.binaryMessageReceived=function(_314,data){
this._listener.binaryMessageReceived(_314,data);
};
_306.textMessageReceived=function(_316,s){
this._listener.textMessageReceived(_316,s);
};
_306.redirected=function(_318,_319){
this._listener.redirected(_318,_319);
};
_306.authenticationRequested=function(_31a,_31b,_31c){
this._listener.authenticationRequested(_31a,_31b,_31c);
};
_306.send=function(data){
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
throw new Error("data is null");
}
if(typeof (data)=="string"){
_305._flashBridge.sendText(this._instanceId,data);
}else{
if(data.constructor==ByteBuffer){
var _31e;
var a=[];
while(data.remaining()){
a.push(String.fromCharCode(data.get()));
}
var _31e=a.join("");
_305._flashBridge.sendByteString(this._instanceId,_31e);
}else{
if(data.byteLength){
var _31e;
var a=[];
var _320=new DataView(data);
for(var i=0;i<data.byteLength;i++){
a.push(String.fromCharCode(_320.getUint8(i)));
}
var _31e=a.join("");
_305._flashBridge.sendByteString(this._instanceId,_31e);
}else{
if(data.size){
var _322=this;
var cb=function(_324){
_305._flashBridge.sendByteString(_322._instanceId,_324);
};
BlobUtils.asBinaryString(cb,data);
return;
}else{
throw new Error("Invalid type");
}
}
}
}
_325(this);
return true;
break;
case 2:
return false;
break;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_306.close=function(code,_327){
switch(this.readyState){
case 0:
case 1:
_305._flashBridge.disconnect(this._instanceId,code,_327);
break;
}
};
_306.disconnect=_306.close;
var _325=function(_328){
_328.bufferedAmount=_305._flashBridge.getBufferedAmount(_328._instanceId);
if(_328.bufferedAmount!=0){
setTimeout(function(){
_325(_328);
},1000);
}
};
var _309=function(_329,_32a,_32b){
var _32c=function(key,_32e){
_32e[key]=_329;
_329._instanceId=key;
};
var _32f=function(){
doError(_329);
};
var _330=[];
if(_329.parent.requestHeaders&&_329.parent.requestHeaders.length>0){
for(var i=0;i<_329.parent.requestHeaders.length;i++){
_330.push(_329.parent.requestHeaders[i].label+":"+_329.parent.requestHeaders[i].value);
}
}
_305._flashBridge.registerWebSocketEmulated(_32a,_330.join("\n"),_32c,_32f);
};
function doError(_332,e){
setTimeout(function(){
_332._listener.connectionFailed(_332.parent);
},0);
};
return _305;
})();
var _334=(function(){
var _335=function(){
this.parent;
this._listener;
};
var _336=_335.prototype;
_336.connect=function(_337,_338){
this.URL=_337;
try{
_339(this,_337,_338);
}
catch(e){
doError(this,e);
}
this.constructor=_335;
};
_336.setListener=function(_33a){
this._listener=_33a;
};
_304._flashBridge={};
_304._flashBridge.readyWaitQueue=[];
_304._flashBridge.failWaitQueue=[];
_304._flashBridge.flashHasLoaded=false;
_304._flashBridge.flashHasFailed=false;
_336.URL="";
_336.readyState=0;
_336.bufferedAmount=0;
_336.connectionOpened=function(_33b,_33c){
var _33c=_33c.split("\n");
for(var i=0;i<_33c.length;i++){
var _33e=_33c[i].split(":");
_33b.responseHeaders[_33e[0]]=_33e[1];
}
this._listener.connectionOpened(_33b,"");
};
_336.connectionClosed=function(_33f,_340,code,_342){
this._listener.connectionClosed(_33f,_340,code,_342);
};
_336.connectionFailed=function(_343){
this._listener.connectionFailed(_343);
};
_336.binaryMessageReceived=function(_344,data){
this._listener.binaryMessageReceived(_344,data);
};
_336.textMessageReceived=function(_346,s){
this._listener.textMessageReceived(_346,s);
};
_336.redirected=function(_348,_349){
this._listener.redirected(_348,_349);
};
_336.authenticationRequested=function(_34a,_34b,_34c){
this._listener.authenticationRequested(_34a,_34b,_34c);
};
_336.send=function(data){
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
throw new Error("data is null");
}
if(typeof (data)=="string"){
_304._flashBridge.sendText(this._instanceId,data);
}else{
if(typeof (data.array)=="object"){
var _34e;
var a=[];
var b;
while(data.remaining()){
b=data.get();
a.push(String.fromCharCode(b));
}
var _34e=a.join("");
_304._flashBridge.sendByteString(this._instanceId,_34e);
return;
}else{
throw new Error("Invalid type");
}
}
_351(this);
return true;
break;
case 2:
return false;
break;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_336.close=function(code,_353){
switch(this.readyState){
case 1:
case 2:
_304._flashBridge.disconnect(this._instanceId,code,_353);
break;
}
};
_336.disconnect=_336.close;
var _351=function(_354){
_354.bufferedAmount=_304._flashBridge.getBufferedAmount(_354._instanceId);
if(_354.bufferedAmount!=0){
setTimeout(function(){
_351(_354);
},1000);
}
};
var _339=function(_355,_356,_357){
var _358=function(key,_35a){
_35a[key]=_355;
_355._instanceId=key;
};
var _35b=function(){
doError(_355);
};
var _35c=[];
if(_355.parent.requestHeaders&&_355.parent.requestHeaders.length>0){
for(var i=0;i<_355.parent.requestHeaders.length;i++){
_35c.push(_355.parent.requestHeaders[i].label+":"+_355.parent.requestHeaders[i].value);
}
}
_304._flashBridge.registerWebSocketRtmp(_356,_35c.join("\n"),_358,_35b);
};
function doError(_35e,e){
setTimeout(function(){
_35e._listener.connectionFailed(_35e.parent);
},0);
};
return _335;
})();
(function(){
var _360={};
_304._flashBridge.registerWebSocketEmulated=function(_361,_362,_363,_364){
var _365=function(){
var key=_304._flashBridge.doRegisterWebSocketEmulated(_361,_362);
_363(key,_360);
};
if(_304._flashBridge.flashHasLoaded){
if(_304._flashBridge.flashHasFailed){
_364();
}else{
_365();
}
}else{
this.readyWaitQueue.push(_365);
this.failWaitQueue.push(_364);
}
};
_304._flashBridge.doRegisterWebSocketEmulated=function(_367,_368){
var key=_304._flashBridge.elt.registerWebSocketEmulated(_367,_368);
return key;
};
_304._flashBridge.registerWebSocketRtmp=function(_36a,_36b,_36c,_36d){
var _36e=function(){
var key=_304._flashBridge.doRegisterWebSocketRtmp(_36a,_36b);
_36c(key,_360);
};
if(_304._flashBridge.flashHasLoaded){
if(_304._flashBridge.flashHasFailed){
_36d();
}else{
_36e();
}
}else{
this.readyWaitQueue.push(_36e);
this.failWaitQueue.push(_36d);
}
};
_304._flashBridge.doRegisterWebSocketRtmp=function(_370,_371){
var key=_304._flashBridge.elt.registerWebSocketRtmp(_370,_371);
return key;
};
_304._flashBridge.onready=function(){
var _373=_304._flashBridge.readyWaitQueue;
for(var i=0;i<_373.length;i++){
var _375=_373[i];
_375();
}
};
_304._flashBridge.onfail=function(){
var _376=_304._flashBridge.failWaitQueue;
for(var i=0;i<_376.length;i++){
var _378=_376[i];
_378();
}
};
_304._flashBridge.connectionOpened=function(key,_37a){
_360[key].readyState=1;
_360[key].connectionOpened(_360[key].parent,_37a);
_37b();
};
_304._flashBridge.connectionClosed=function(key,_37d,code,_37f){
_360[key].readyState=2;
_360[key].connectionClosed(_360[key].parent,_37d,code,_37f);
};
_304._flashBridge.connectionFailed=function(key){
_360[key].connectionFailed(_360[key].parent);
};
_304._flashBridge.binaryMessageReceived=function(key,data){
var _383=_360[key];
if(_383.readyState==1){
var buf=ByteBuffer.allocate(data.length);
for(var i=0;i<data.length;i++){
buf.put(data[i]);
}
buf.flip();
_383.binaryMessageReceived(_383.parent,buf);
}
};
_304._flashBridge.textMessageReceived=function(key,data){
var _388=_360[key];
if(_388.readyState==1){
_388.textMessageReceived(_388.parent,unescape(data));
}
};
_304._flashBridge.redirected=function(key,_38a){
var _38b=_360[key];
_38b.redirected(_38b.parent,_38a);
};
_304._flashBridge.authenticationRequested=function(key,_38d,_38e){
var _38f=_360[key];
_38f.authenticationRequested(_38f.parent,_38d,_38e);
};
var _37b=function(){
if(browser==="firefox"){
var e=document.createElement("iframe");
e.style.display="none";
document.body.appendChild(e);
document.body.removeChild(e);
}
};
_304._flashBridge.sendText=function(key,_392){
this.elt.processTextMessage(key,escape(_392));
setTimeout(_37b,200);
};
_304._flashBridge.sendByteString=function(key,_394){
this.elt.processBinaryMessage(key,escape(_394));
setTimeout(_37b,200);
};
_304._flashBridge.disconnect=function(key,code,_397){
this.elt.processClose(key,code,_397);
};
_304._flashBridge.getBufferedAmount=function(key){
var v=this.elt.getBufferedAmount(key);
return v;
};
})();
(function(){
var _39a=function(_39b){
var self=this;
var _39d=3000;
var ID="Loader";
var ie=false;
var _3a0=-1;
self.elt=null;
var _3a1=function(){
var exp=new RegExp(".*"+_39b+".*.js$");
var _3a3=document.getElementsByTagName("script");
for(var i=0;i<_3a3.length;i++){
if(_3a3[i].src){
var name=(_3a3[i].src).match(exp);
if(name){
name=name.pop();
var _3a6=name.split("/");
_3a6.pop();
if(_3a6.length>0){
return _3a6.join("/")+"/";
}else{
return "";
}
}
}
}
};
var _3a7=_3a1();
var _3a8=_3a7+"Loader.swf";
self.loader=function(){
var _3a9="flash";
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name==="kaazing:upgrade"){
_3a9=tags[i].content;
}
}
if(_3a9!="flash"||!_3ac([9,0,115])){
_3ad();
}else{
_3a0=setTimeout(_3ad,_39d);
_3ae();
}
};
self.clearFlashTimer=function(){
clearTimeout(_3a0);
_3a0="cleared";
setTimeout(function(){
_3af(self.elt.handshake(_39b));
},0);
};
var _3af=function(_3b0){
if(_3b0){
_304._flashBridge.flashHasLoaded=true;
_304._flashBridge.elt=self.elt;
_304._flashBridge.onready();
}else{
_3ad();
}
window.___Loader=undefined;
};
var _3ad=function(){
_304._flashBridge.flashHasLoaded=true;
_304._flashBridge.flashHasFailed=true;
_304._flashBridge.onfail();
};
var _3b1=function(){
var _3b2=null;
if(typeof (ActiveXObject)!="undefined"){
try{
ie=true;
var swf=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
var _3b4=swf.GetVariable("$version");
var _3b5=_3b4.split(" ")[1].split(",");
_3b2=[];
for(var i=0;i<_3b5.length;i++){
_3b2[i]=parseInt(_3b5[i]);
}
}
catch(e){
ie=false;
}
}
if(typeof navigator.plugins!="undefined"){
if(typeof navigator.plugins["Shockwave Flash"]!="undefined"){
var _3b4=navigator.plugins["Shockwave Flash"].description;
_3b4=_3b4.replace(/\s*r/g,".");
var _3b5=_3b4.split(" ")[2].split(".");
_3b2=[];
for(var i=0;i<_3b5.length;i++){
_3b2[i]=parseInt(_3b5[i]);
}
}
}
var _3b7=navigator.userAgent;
if(_3b2!==null&&_3b2[0]===10&&_3b2[1]===0&&_3b7.indexOf("Windows NT 6.0")!==-1){
_3b2=null;
}
if(_3b7.indexOf("MSIE 6.0")==-1&&_3b7.indexOf("MSIE 7.0")==-1){
if(_3b7.indexOf("MSIE 8.0")>0||_3b7.indexOf("MSIE 9.0")>0){
if(typeof (XDomainRequest)!=="undefined"){
_3b2=null;
}
}else{
_3b2=null;
}
}
return _3b2;
};
var _3ac=function(_3b8){
var _3b9=_3b1();
if(_3b9==null){
return false;
}
for(var i=0;i<Math.max(_3b9.length,_3b8.length);i++){
var _3bb=_3b9[i]-_3b8[i];
if(_3bb!=0){
return (_3bb>0)?true:false;
}
}
return true;
};
var _3ae=function(){
if(ie){
var elt=document.createElement("div");
document.body.appendChild(elt);
elt.outerHTML="<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" height=\"0\" width=\"0\" id=\""+ID+"\"><param name=\"movie\" value=\""+_3a8+"\"></param></object>";
self.elt=document.getElementById(ID);
}else{
var elt=document.createElement("object");
elt.setAttribute("type","application/x-shockwave-flash");
elt.setAttribute("width",0);
elt.setAttribute("height",0);
elt.setAttribute("id",ID);
elt.setAttribute("data",_3a8);
document.body.appendChild(elt);
self.elt=elt;
}
};
self.attachToOnload=function(_3bd){
if(window.addEventListener){
window.addEventListener("load",_3bd,true);
}else{
if(window.attachEvent){
window.attachEvent("onload",_3bd);
}else{
onload=_3bd;
}
}
};
if(document.readyState==="complete"){
self.loader();
}else{
self.attachToOnload(self.loader);
}
};
var _3be=(function(){
var _3bf=function(_3c0){
this.HOST=new _3bf(0);
this.USERINFO=new _3bf(1);
this.PORT=new _3bf(2);
this.PATH=new _3bf(3);
this.ordinal=_3c0;
};
return _3bf;
})();
var _3c1=(function(){
var _3c2=function(){
};
_3c2.getRealm=function(_3c3){
var _3c4=_3c3.authenticationParameters;
if(_3c4==null){
return null;
}
var _3c5=/realm=(\"(.*)\")/i;
var _3c6=_3c5.exec(_3c4);
return (_3c6!=null&&_3c6.length>=3)?_3c6[2]:null;
};
return _3c2;
})();
function Dictionary(){
this.Keys=new Array();
};
var _3c7=(function(){
var _3c8=function(_3c9){
this.weakKeys=_3c9;
this.elements=[];
this.dictionary=new Dictionary();
};
var _3ca=_3c8.prototype;
_3ca.getlength=function(){
return this.elements.length;
};
_3ca.getItemAt=function(_3cb){
return this.dictionary[this.elements[_3cb]];
};
_3ca.get=function(key){
var _3cd=this.dictionary[key];
if(_3cd==undefined){
_3cd=null;
}
return _3cd;
};
_3ca.remove=function(key){
for(var i=0;i<this.elements.length;i++){
var _3d0=(this.weakKeys&&(this.elements[i]==key));
var _3d1=(!this.weakKeys&&(this.elements[i]===key));
if(_3d0||_3d1){
this.elements.remove(i);
this.dictionary[this.elements[i]]=undefined;
break;
}
}
};
_3ca.put=function(key,_3d3){
this.remove(key);
this.elements.push(key);
this.dictionary[key]=_3d3;
};
_3ca.isEmpty=function(){
return this.length==0;
};
_3ca.containsKey=function(key){
for(var i=0;i<this.elements.length;i++){
var _3d6=(this.weakKeys&&(this.elements[i]==key));
var _3d7=(!this.weakKeys&&(this.elements[i]===key));
if(_3d6||_3d7){
return true;
}
}
return false;
};
_3ca.keySet=function(){
return this.elements;
};
_3ca.getvalues=function(){
var _3d8=[];
for(var i=0;i<this.elements.length;i++){
_3d8.push(this.dictionary[this.elements[i]]);
}
return _3d8;
};
return _3c8;
})();
var Node=(function(){
var Node=function(){
this.name="";
this.kind="";
this.values=[];
this.children=new _3c7();
};
var _3dc=Node.prototype;
_3dc.getWildcardChar=function(){
return "*";
};
_3dc.addChild=function(name,kind){
if(name==null||name.length==0){
throw new ArgumentError("A node may not have a null name.");
}
var _3df=Node.createNode(name,this,kind);
this.children.put(name,_3df);
return _3df;
};
_3dc.hasChild=function(name,kind){
return null!=this.getChild(name)&&kind==this.getChild(name).kind;
};
_3dc.getChild=function(name){
return this.children.get(name);
};
_3dc.getDistanceFromRoot=function(){
var _3e3=0;
var _3e4=this;
while(!_3e4.isRootNode()){
_3e3++;
_3e4=_3e4.parent;
}
return _3e3;
};
_3dc.appendValues=function(){
if(this.isRootNode()){
throw new ArgumentError("Cannot set a values on the root node.");
}
if(this.values!=null){
for(var k=0;k<arguments.length;k++){
var _3e6=arguments[k];
this.values.push(_3e6);
}
}
};
_3dc.removeValue=function(_3e7){
if(this.isRootNode()){
return;
}
for(var i=0;i<this.values.length;i++){
if(this.values[i]==_3e7){
this.values.splice(i,1);
}
}
};
_3dc.getValues=function(){
return this.values;
};
_3dc.hasValues=function(){
return this.values!=null&&this.values.length>0;
};
_3dc.isRootNode=function(){
return this.parent==null;
};
_3dc.hasChildren=function(){
return this.children!=null&&this.children.getlength()>0;
};
_3dc.isWildcard=function(){
return this.name!=null&&this.name==this.getWildcardChar();
};
_3dc.hasWildcardChild=function(){
return this.hasChildren()&&this.children.containsKey(this.getWildcardChar());
};
_3dc.getFullyQualifiedName=function(){
var b=new String();
var name=[];
var _3eb=this;
while(!_3eb.isRootNode()){
name.push(_3eb.name);
_3eb=_3eb.parent;
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
_3dc.getChildrenAsList=function(){
return this.children.getvalues();
};
_3dc.findBestMatchingNode=function(_3ed,_3ee){
var _3ef=this.findAllMatchingNodes(_3ed,_3ee);
var _3f0=null;
var _3f1=0;
for(var i=0;i<_3ef.length;i++){
var node=_3ef[i];
if(node.getDistanceFromRoot()>_3f1){
_3f1=node.getDistanceFromRoot();
_3f0=node;
}
}
return _3f0;
};
_3dc.findAllMatchingNodes=function(_3f4,_3f5){
var _3f6=[];
var _3f7=this.getChildrenAsList();
for(var i=0;i<_3f7.length;i++){
var node=_3f7[i];
var _3fa=node.matches(_3f4,_3f5);
if(_3fa<0){
continue;
}
if(_3fa>=_3f4.length){
do{
if(node.hasValues()){
_3f6.push(node);
}
if(node.hasWildcardChild()){
var _3fb=node.getChild(this.getWildcardChar());
if(_3fb.kind!=this.kind){
node=null;
}else{
node=_3fb;
}
}else{
node=null;
}
}while(node!=null);
}else{
var _3fc=node.findAllMatchingNodes(_3f4,_3fa);
for(var j=0;j<_3fc.length;j++){
_3f6.push(_3fc[j]);
}
}
}
return _3f6;
};
_3dc.matches=function(_3fe,_3ff){
if(_3ff<0||_3ff>=_3fe.length){
return -1;
}
if(this.matchesToken(_3fe[_3ff])){
return _3ff+1;
}
if(!this.isWildcard()){
return -1;
}else{
if(this.kind!=_3fe[_3ff].kind){
return -1;
}
do{
_3ff++;
}while(_3ff<_3fe.length&&this.kind==_3fe[_3ff].kind);
return _3ff;
}
};
_3dc.matchesToken=function(_400){
return this.name==_400.name&&this.kind==_400.kind;
};
Node.createNode=function(name,_402,kind){
var node=new Node();
node.name=name;
node.parent=_402;
node.kind=kind;
return node;
};
return Node;
})();
var _405=(function(){
var _406=function(name,kind){
this.kind=kind;
this.name=name;
};
return _406;
})();
window.Oid=(function(){
var Oid=function(data){
this.rep=data;
};
var _40b=Oid.prototype;
_40b.asArray=function(){
return this.rep;
};
_40b.asString=function(){
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
var _40f=(function(){
var _410=function(){
};
_410.create=function(_411,_412,_413){
var _414=_411+":"+_412;
var _415=[];
for(var i=0;i<_414.length;++i){
_415.push(_414.charCodeAt(i));
}
var _417="Basic "+Base64.encode(_415);
return new ChallengeResponse(_417,_413);
};
return _410;
})();
function InternalDefaultChallengeHandler(){
this.canHandle=function(_418){
return false;
};
this.handle=function(_419,_41a){
_41a(null);
};
};
window.PasswordAuthentication=(function(){
function PasswordAuthentication(_41b,_41c){
this.username=_41b;
this.password=_41c;
};
PasswordAuthentication.prototype.clear=function(){
this.username=null;
this.password=null;
};
return PasswordAuthentication;
})();
window.ChallengeRequest=(function(){
var _41d=function(_41e,_41f){
if(_41e==null){
throw new Error("location is not defined.");
}
if(_41f==null){
return;
}
var _420="Application ";
if(_41f.indexOf(_420)==0){
_41f=_41f.substring(_420.length);
}
this.location=_41e;
this.authenticationParameters=null;
var _421=_41f.indexOf(" ");
if(_421==-1){
this.authenticationScheme=_41f;
}else{
this.authenticationScheme=_41f.substring(0,_421);
if(_41f.length>_421+1){
this.authenticationParameters=_41f.substring(_421+1);
}
}
};
return _41d;
})();
window.ChallengeResponse=(function(){
var _422=function(_423,_424){
this.credentials=_423;
this.nextChallengeHandler=_424;
};
var _425=_422.prototype;
_425.clearCredentials=function(){
if(this.credentials!=null){
this.credentials=null;
}
};
return _422;
})();
window.BasicChallengeHandler=(function(){
var _426=function(){
this.loginHandler=undefined;
this.loginHandlersByRealm={};
};
var _427=_426.prototype;
_427.setRealmLoginHandler=function(_428,_429){
if(_428==null){
throw new ArgumentError("null realm");
}
if(_429==null){
throw new ArgumentError("null loginHandler");
}
this.loginHandlersByRealm[_428]=_429;
return this;
};
_427.canHandle=function(_42a){
return _42a!=null&&"Basic"==_42a.authenticationScheme;
};
_427.handle=function(_42b,_42c){
if(_42b.location!=null){
var _42d=this.loginHandler;
var _42e=_3c1.getRealm(_42b);
if(_42e!=null&&this.loginHandlersByRealm[_42e]!=null){
_42d=this.loginHandlersByRealm[_42e];
}
var _42f=this;
if(_42d!=null){
_42d(function(_430){
if(_430!=null&&_430.username!=null){
_42c(_40f.create(_430.username,_430.password,_42f));
}else{
_42c(null);
}
});
return;
}
}
_42c(null);
};
_427.loginHandler=function(_431){
_431(null);
};
return _426;
})();
window.DispatchChallengeHandler=(function(){
var _432=function(){
this.rootNode=new Node();
var _433="^(.*)://(.*)";
this.SCHEME_URI_PATTERN=new RegExp(_433);
};
function delChallengeHandlerAtLocation(_434,_435,_436){
var _437=tokenize(_435);
var _438=_434;
for(var i=0;i<_437.length;i++){
var _43a=_437[i];
if(!_438.hasChild(_43a.name,_43a.kind)){
return;
}else{
_438=_438.getChild(_43a.name);
}
}
_438.removeValue(_436);
};
function addChallengeHandlerAtLocation(_43b,_43c,_43d){
var _43e=tokenize(_43c);
var _43f=_43b;
for(var i=0;i<_43e.length;i++){
var _441=_43e[i];
if(!_43f.hasChild(_441.name,_441.kind)){
_43f=_43f.addChild(_441.name,_441.kind);
}else{
_43f=_43f.getChild(_441.name);
}
}
_43f.appendValues(_43d);
};
function lookupByLocation(_442,_443){
var _444=new Array();
if(_443!=null){
var _445=findBestMatchingNode(_442,_443);
if(_445!=null){
return _445.values;
}
}
return _444;
};
function lookupByRequest(_446,_447){
var _448=null;
var _449=_447.location;
if(_449!=null){
var _44a=findBestMatchingNode(_446,_449);
if(_44a!=null){
var _44b=_44a.getValues();
if(_44b!=null){
for(var i=0;i<_44b.length;i++){
var _44d=_44b[i];
if(_44d.canHandle(_447)){
_448=_44d;
break;
}
}
}
}
}
return _448;
};
function findBestMatchingNode(_44e,_44f){
var _450=tokenize(_44f);
var _451=0;
return _44e.findBestMatchingNode(_450,_451);
};
function tokenize(uri){
var _453=new Array();
if(uri==null||uri.length==0){
return _453;
}
var _454=new RegExp("^(([^:/?#]+):(//))?([^/?#]*)?([^?#]*)(\\?([^#]*))?(#(.*))?");
var _455=_454.exec(uri);
if(_455==null){
return _453;
}
var _456=_455[2]||"http";
var _457=_455[4];
var path=_455[5];
var _459=null;
var _45a=null;
var _45b=null;
var _45c=null;
if(_457!=null){
var host=_457;
var _45e=host.indexOf("@");
if(_45e>=0){
_45a=host.substring(0,_45e);
host=host.substring(_45e+1);
var _45f=_45a.indexOf(":");
if(_45f>=0){
_45b=_45a.substring(0,_45f);
_45c=_45a.substring(_45f+1);
}
}
var _460=host.indexOf(":");
if(_460>=0){
_459=host.substring(_460+1);
host=host.substring(0,_460);
}
}else{
throw new ArgumentError("Hostname is required.");
}
var _461=host.split(/\./);
_461.reverse();
for(var k=0;k<_461.length;k++){
_453.push(new _405(_461[k],_3be.HOST));
}
if(_459!=null){
_453.push(new _405(_459,_3be.PORT));
}else{
if(getDefaultPort(_456)>0){
_453.push(new _405(getDefaultPort(_456).toString(),_3be.PORT));
}
}
if(_45a!=null){
if(_45b!=null){
_453.push(new _405(_45b,_3be.USERINFO));
}
if(_45c!=null){
_453.push(new _405(_45c,_3be.USERINFO));
}
if(_45b==null&&_45c==null){
_453.push(new _405(_45a,_3be.USERINFO));
}
}
if(isNotBlank(path)){
if(path.charAt(0)=="/"){
path=path.substring(1);
}
if(isNotBlank(path)){
var _463=path.split("/");
for(var p=0;p<_463.length;p++){
var _465=_463[p];
_453.push(new _405(_465,_3be.PATH));
}
}
}
return _453;
};
function getDefaultPort(_466){
if(defaultPortsByScheme[_466.toLowerCase()]!=null){
return defaultPortsByScheme[_466];
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
var _468=_432.prototype;
_468.clear=function(){
this.rootNode=new Node();
};
_468.canHandle=function(_469){
return lookupByRequest(this.rootNode,_469)!=null;
};
_468.handle=function(_46a,_46b){
var _46c=lookupByRequest(this.rootNode,_46a);
if(_46c==null){
return null;
}
return _46c.handle(_46a,_46b);
};
_468.register=function(_46d,_46e){
if(_46d==null||_46d.length==0){
throw new Error("Must specify a location to handle challenges upon.");
}
if(_46e==null){
throw new Error("Must specify a handler to handle challenges.");
}
addChallengeHandlerAtLocation(this.rootNode,_46d,_46e);
return this;
};
_468.unregister=function(_46f,_470){
if(_46f==null||_46f.length==0){
throw new Error("Must specify a location to un-register challenge handlers upon.");
}
if(_470==null){
throw new Error("Must specify a handler to un-register.");
}
delChallengeHandlerAtLocation(this.rootNode,_46f,_470);
return this;
};
return _432;
})();
window.NegotiableChallengeHandler=(function(){
var _471=function(){
this.candidateChallengeHandlers=new Array();
};
var _472=function(_473){
var oids=new Array();
for(var i=0;i<_473.length;i++){
oids.push(Oid.create(_473[i]).asArray());
}
var _476=GssUtils.sizeOfSpnegoInitialContextTokenWithOids(null,oids);
var _477=ByteBuffer.allocate(_476);
_477.skip(_476);
GssUtils.encodeSpnegoInitialContextTokenWithOids(null,oids,_477);
return ByteArrayUtils.arrayToByteArray(Base64Util.encodeBuffer(_477));
};
var _478=_471.prototype;
_478.register=function(_479){
if(_479==null){
throw new Error("handler is null");
}
for(var i=0;i<this.candidateChallengeHandlers.length;i++){
if(_479===this.candidateChallengeHandlers[i]){
return this;
}
}
this.candidateChallengeHandlers.push(_479);
return this;
};
_478.canHandle=function(_47b){
return _47b!=null&&_47b.authenticationScheme=="Negotiate"&&_47b.authenticationParameters==null;
};
_478.handle=function(_47c,_47d){
if(_47c==null){
throw Error(new ArgumentError("challengeRequest is null"));
}
var _47e=new _3c7();
for(var i=0;i<this.candidateChallengeHandlers.length;i++){
var _480=this.candidateChallengeHandlers[i];
if(_480.canHandle(_47c)){
try{
var _481=_480.getSupportedOids();
for(var j=0;j<_481.length;j++){
var oid=new Oid(_481[j]).asString();
if(!_47e.containsKey(oid)){
_47e.put(oid,_480);
}
}
}
catch(e){
}
}
}
if(_47e.isEmpty()){
_47d(null);
return;
}
};
return _471;
})();
window.NegotiableChallengeHandler=(function(){
var _484=function(){
this.loginHandler=undefined;
};
_484.prototype.getSupportedOids=function(){
return new Array();
};
return _484;
})();
window.NegotiableChallengeHandler=(function(){
var _485=function(){
this.loginHandler=undefined;
};
_485.prototype.getSupportedOids=function(){
return new Array();
};
return _485;
})();
var _486={};
(function(){
var _487={8364:128,129:129,8218:130,402:131,8222:132,8230:133,8224:134,8225:135,710:136,8240:137,352:138,8249:139,338:140,141:141,381:142,143:143,144:144,8216:145,8217:146,8220:147,8221:148,8226:149,8211:150,8212:151,732:152,8482:153,353:154,8250:155,339:156,157:157,382:158,376:159};
var _488={128:8364,129:129,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,141:141,142:381,143:143,144:144,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,157:157,158:382,159:376};
_486.toCharCode=function(n){
if(n<128||(n>159&&n<256)){
return n;
}else{
var _48a=_488[n];
if(typeof (_48a)=="undefined"){
throw new Error("Windows1252.toCharCode could not find: "+n);
}
return _48a;
}
};
_486.fromCharCode=function(code){
if(code<256){
return code;
}else{
var _48c=_487[code];
if(typeof (_48c)=="undefined"){
throw new Error("Windows1252.fromCharCode could not find: "+code);
}
return _48c;
}
};
var _48d=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _48f="\n";
var _490=function(s){
var a=[];
for(var i=0;i<s.length;i++){
var code=_486.fromCharCode(s.charCodeAt(i));
if(code==127){
i++;
if(i==s.length){
a.hasRemainder=true;
break;
}
var _495=_486.fromCharCode(s.charCodeAt(i));
switch(_495){
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
throw new Error("Escaping format error");
}
}else{
a.push(code);
}
}
return a;
};
var _496=function(buf){
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(_486.toCharCode(n));
switch(chr){
case _48d:
a.push(_48d);
a.push(_48d);
break;
case NULL:
a.push(_48d);
a.push("0");
break;
case _48f:
a.push(_48d);
a.push("n");
break;
default:
a.push(chr);
}
}
return a.join("");
};
_486.toArray=function(s,_49c){
if(_49c){
return _490(s);
}else{
var a=[];
for(var i=0;i<s.length;i++){
a.push(_486.fromCharCode(s.charCodeAt(i)));
}
return a;
}
};
_486.toByteString=function(buf,_4a0){
if(_4a0){
return _496(buf);
}else{
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
a.push(String.fromCharCode(_486.toCharCode(n)));
}
return a.join("");
}
};
})();
function CloseEvent(_4a3,_4a4,_4a5,_4a6){
this.reason=_4a6;
this.code=_4a5;
this.wasClean=_4a4;
this.type="close";
this.bubbles=true;
this.cancelable=true;
this.target=_4a3;
};
function MessageEvent(_4a7,_4a8,_4a9){
return {target:_4a7,data:_4a8,origin:_4a9,bubbles:true,cancelable:true,type:"message",lastEventId:""};
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
var _4ab=function(_4ac,_4ad){
var _4ae=_4ad||{};
if(window.WebKitBlobBuilder){
var _4af=new window.WebKitBlobBuilder();
for(var i=0;i<_4ac.length;i++){
var part=_4ac[i];
if(_4ae.endings){
_4af.append(part,_4ae.endings);
}else{
_4af.append(part);
}
}
var blob;
if(_4ae.type){
blob=_4af.getBlob(type);
}else{
blob=_4af.getBlob();
}
blob.slice=blob.webkitSlice||blob.slice;
return blob;
}else{
if(window.MozBlobBuilder){
var _4af=new window.MozBlobBuilder();
for(var i=0;i<_4ac.length;i++){
var part=_4ac[i];
if(_4ae.endings){
_4af.append(part,_4ae.endings);
}else{
_4af.append(part);
}
}
var blob;
if(_4ae.type){
blob=_4af.getBlob(type);
}else{
blob=_4af.getBlob();
}
blob.slice=blob.mozSlice||blob.slice;
return blob;
}else{
var _4b3=[];
for(var i=0;i<_4ac.length;i++){
var part=_4ac[i];
if(typeof part==="string"){
var b=BlobUtils.fromString(part,_4ae.endings);
_4b3.push(b);
}else{
if(part.byteLength){
var _4b5=new Uint8Array(part);
for(var i=0;i<part.byteLength;i++){
_4b3.push(_4b5[i]);
}
}else{
if(part.length){
_4b3.push(part);
}else{
if(part._array){
_4b3.push(part._array);
}else{
throw new Error("invalid type in Blob constructor");
}
}
}
}
}
var blob=concatMemoryBlobs(_4b3);
blob.type=_4ae.type;
return blob;
}
}
};
function MemoryBlob(_4b6,_4b7){
return {_array:_4b6,size:_4b6.length,type:_4b7||"",slice:function(_4b8,end,_4ba){
var a=this._array.slice(_4b8,end);
return MemoryBlob(a,_4ba);
},toString:function(){
return "MemoryBlob: "+_4b6.toString();
}};
};
function concatMemoryBlobs(_4bc){
var a=Array.prototype.concat.apply([],_4bc);
return new MemoryBlob(a);
};
window.Blob=_4ab;
})();
(function(_4be){
_4be.BlobUtils={};
BlobUtils.asString=function asString(blob,_4c0,end){
if(blob._array){
}else{
if(FileReader){
var _4c2=new FileReader();
_4c2.readAsText(blob);
_4c2.onload=function(){
cb(_4c2.result);
};
_4c2.onerror=function(e){
console.log(e,_4c2);
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
var _4c6=new FileReader();
_4c6.readAsArrayBuffer(blob);
_4c6.onload=function(){
var _4c7=new DataView(_4c6.result);
var a=[];
for(var i=0;i<_4c6.result.byteLength;i++){
a.push(_4c7.getUint8(i));
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
var _4cc=blob._array;
var a=[];
for(var i=0;i<_4cc.length;i++){
a.push(String.fromCharCode(_4cc[i]));
}
setTimeout(function(){
cb(a.join(""));
},0);
}else{
if(FileReader){
var _4cf=new FileReader();
if(_4cf.readAsBinaryString){
_4cf.readAsBinaryString(blob);
_4cf.onload=function(){
cb(_4cf.result);
};
}else{
_4cf.readAsArrayBuffer(blob);
_4cf.onload=function(){
var _4d0=new DataView(_4cf.result);
var a=[];
for(var i=0;i<_4cf.result.byteLength;i++){
a.push(String.fromCharCode(_4d0.getUint8(i)));
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
var _4d4=[];
for(var i=0;i<s.length;i++){
_4d4.push(s.charCodeAt(i));
}
return BlobUtils.fromNumberArray(_4d4);
};
BlobUtils.fromNumberArray=function fromNumberArray(a){
if(typeof (Uint8Array)!=="undefined"){
return new Blob([new Uint8Array(a)]);
}else{
return new Blob([a]);
}
};
BlobUtils.fromString=function fromString(s,_4d8){
if(_4d8&&_4d8==="native"){
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
var _4db=function(){
this._queue=[];
this._count=0;
this.completion;
};
_4db.prototype.enqueue=function(cb){
var _4dd=this;
var _4de={};
_4de.cb=cb;
_4de.id=this._count++;
this._queue.push(_4de);
var func=function(){
_4dd.processQueue(_4de.id,cb,arguments);
};
return func;
};
_4db.prototype.processQueue=function(id,cb,args){
for(var i=0;i<this._queue.length;i++){
if(this._queue[i].id==id){
this._queue[i].args=args;
break;
}
}
while(this._queue.length&&this._queue[0].args!==undefined){
var _4e4=this._queue.shift();
_4e4.cb.apply(null,_4e4.args);
}
};
var _4e5=(function(){
var _4e6=function(_4e7,_4e8){
this.label=_4e7;
this.value=_4e8;
};
return _4e6;
})();
var _4e9=(function(){
var _4ea=function(_4eb){
var uri=new URI(_4eb);
if(isValidScheme(uri.scheme)){
this._uri=uri;
}else{
throw new Error("HttpURI - invalid scheme: "+_4eb);
}
};
function isValidScheme(_4ed){
return "http"==_4ed||"https"==_4ed;
};
var _4ee=_4ea.prototype;
_4ee.getURI=function(){
return this._uri;
};
_4ee.duplicate=function(uri){
try{
return new _4ea(uri);
}
catch(e){
throw e;
}
return null;
};
_4ee.isSecure=function(){
return ("https"==this._uri.scheme);
};
_4ee.toString=function(){
return this._uri.toString();
};
_4ea.replaceScheme=function(_4f0,_4f1){
var uri=URI.replaceProtocol(_4f0,_4f1);
return new _4ea(uri);
};
return _4ea;
})();
var _4f3=(function(){
var _4f4=function(_4f5){
var uri=new URI(_4f5);
if(isValidScheme(uri.scheme)){
this._uri=uri;
if(uri.port==undefined){
this._uri=new URI(_4f4.addDefaultPort(_4f5));
}
}else{
throw new Error("WSURI - invalid scheme: "+_4f5);
}
};
function isValidScheme(_4f7){
return "ws"==_4f7||"wss"==_4f7;
};
function duplicate(uri){
try{
return new _4f4(uri);
}
catch(e){
throw e;
}
return null;
};
var _4f9=_4f4.prototype;
_4f9.getAuthority=function(){
return this._uri.authority;
};
_4f9.isSecure=function(){
return "wss"==this._uri.scheme;
};
_4f9.getHttpEquivalentScheme=function(){
return this.isSecure()?"https":"http";
};
_4f9.toString=function(){
return this._uri.toString();
};
var _4fa=80;
var _4fb=443;
_4f4.setDefaultPort=function(uri){
if(uri.port==0){
if(uri.scheme=="ws"){
uri.port=_4fa;
}else{
if(uri.scheme=="wss"){
uri.port=_4fb;
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
_4f4.addDefaultPort=function(_4fd){
var uri=new URI(_4fd);
if(uri.port==undefined){
_4f4.setDefaultPort(uri);
}
return uri.toString();
};
_4f4.replaceScheme=function(_4ff,_500){
var uri=URI.replaceProtocol(_4ff,_500);
return new _4f4(uri);
};
return _4f4;
})();
var _502=(function(){
var _503={};
_503["ws"]="ws";
_503["wss"]="wss";
_503["javascript:wse"]="ws";
_503["javascript:wse+ssl"]="wss";
_503["javascript:ws"]="ws";
_503["javascript:wss"]="wss";
_503["flash:wsr"]="ws";
_503["flash:wsr+ssl"]="wss";
_503["flash:wse"]="ws";
_503["flash:wse+ssl"]="wss";
var _504=function(_505){
var _506=getProtocol(_505);
if(isValidScheme(_506)){
this._uri=new URI(URI.replaceProtocol(_505,_503[_506]));
this._compositeScheme=_506;
this._location=_505;
}else{
throw new SyntaxError("WSCompositeURI - invalid composite scheme: "+getProtocol(_505));
}
};
function getProtocol(_507){
var indx=_507.indexOf("://");
if(indx>0){
return _507.substr(0,indx);
}else{
return "";
}
};
function isValidScheme(_509){
return _503[_509]!=null;
};
function duplicate(uri){
try{
return new _504(uri);
}
catch(e){
throw e;
}
return null;
};
var _50b=_504.prototype;
_50b.isSecure=function(){
var _50c=this._uri.scheme;
return "wss"==_503[_50c];
};
_50b.getWSEquivalent=function(){
try{
var _50d=_503[this._compositeScheme];
return _4f3.replaceScheme(this._location,_50d);
}
catch(e){
throw e;
}
return null;
};
_50b.getPlatformPrefix=function(){
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
_50b.toString=function(){
return this._location;
};
return _504;
})();
var _50e=(function(){
var _50f=function(){
this._parent=null;
this._challengeResponse=new ChallengeResponse(null,null);
};
_50f.prototype.toString=function(){
return "[Channel]";
};
return _50f;
})();
var _510=(function(){
var _511=function(_512,_513,_514){
_50e.apply(this,arguments);
this._location=_512;
this._protocol=_513;
this._extensions=[];
this._controlFrames={};
this._controlFramesBinary={};
this._escapeSequences={};
this._handshakePayload="";
this._isEscape=false;
this._bufferedAmount=0;
};
var _515=_511.prototype=new _50e();
_515.getBufferedAmount=function(){
return this._bufferedAmount;
};
_515.toString=function(){
return "[WebSocketChannel "+_location+" "+_protocol!=null?_protocol:"-"+"]";
};
return _511;
})();
var _516=(function(){
var _517=function(){
this._nextHandler;
this._listener;
};
var _518=_517.prototype;
_518.processConnect=function(_519,_51a,_51b){
this._nextHandler.processConnect(_519,_51a,_51b);
};
_518.processAuthorize=function(_51c,_51d){
this._nextHandler.processAuthorize(_51c,_51d);
};
_518.processTextMessage=function(_51e,text){
this._nextHandler.processTextMessage(_51e,text);
};
_518.processBinaryMessage=function(_520,_521){
this._nextHandler.processBinaryMessage(_520,_521);
};
_518.processClose=function(_522,code,_524){
this._nextHandler.processClose(_522,code,_524);
};
_518.setIdleTimeout=function(_525,_526){
this._nextHandler.setIdleTimeout(_525,_526);
};
_518.setListener=function(_527){
this._listener=_527;
};
_518.setNextHandler=function(_528){
this._nextHandler=_528;
};
return _517;
})();
var _529=function(_52a){
this.connectionOpened=function(_52b,_52c){
_52a._listener.connectionOpened(_52b,_52c);
};
this.textMessageReceived=function(_52d,s){
_52a._listener.textMessageReceived(_52d,s);
};
this.binaryMessageReceived=function(_52f,obj){
_52a._listener.binaryMessageReceived(_52f,obj);
};
this.connectionClosed=function(_531,_532,code,_534){
_52a._listener.connectionClosed(_531,_532,code,_534);
};
this.connectionError=function(_535,e){
_52a._listener.connectionError(_535,e);
};
this.connectionFailed=function(_537){
_52a._listener.connectionFailed(_537);
};
this.authenticationRequested=function(_538,_539,_53a){
_52a._listener.authenticationRequested(_538,_539,_53a);
};
this.redirected=function(_53b,_53c){
_52a._listener.redirected(_53b,_53c);
};
this.onBufferedAmountChange=function(_53d,n){
_52a._listener.onBufferedAmountChange(_53d,n);
};
};
var _53f=(function(){
var _540=function(){
var _541="";
var _542="";
};
_540.KAAZING_EXTENDED_HANDSHAKE="x-kaazing-handshake";
_540.KAAZING_SEC_EXTENSION_REVALIDATE="x-kaazing-http-revalidate";
_540.HEADER_SEC_EXTENSIONS="X-WebSocket-Extensions";
_540.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT="x-kaazing-idle-timeout";
_540.KAAZING_SEC_EXTENSION_PING_PONG="x-kaazing-ping-pong";
return _540;
})();
var _543=(function(){
var _544=function(_545,_546){
_510.apply(this,arguments);
this.requestHeaders=[];
this.responseHeaders={};
this.readyState=WebSocket.CONNECTING;
this.authenticationReceived=false;
this.wasCleanClose=false;
this.closeCode=1006;
this.closeReason="";
};
return _544;
})();
var _547=(function(){
var _548=function(){
};
var _549=_548.prototype;
_549.createChannel=function(_54a,_54b,_54c){
var _54d=new _543(_54a,_54b,_54c);
return _54d;
};
return _548;
})();
var _54e=(function(){
var _54f=function(){
};
var _550=_54f.prototype;
_550.createChannel=function(_551,_552){
var _553=new _543(_551,_552);
return _553;
};
return _54f;
})();
var _554=(function(){
var _555=function(_556,_557){
this._location=_556.getWSEquivalent();
this._protocol=_557;
this._webSocket;
this._compositeScheme=_556._compositeScheme;
this._connectionStrategies=[];
this._selectedChannel;
this.readyState=0;
this._closing=false;
this._negotiatedExtensions={};
this._compositeScheme=_556._compositeScheme;
};
var _558=_555.prototype=new _510();
_558.getReadyState=function(){
return this.readyState;
};
_558.getWebSocket=function(){
return this._webSocket;
};
_558.getCompositeScheme=function(){
return this._compositeScheme;
};
_558.getNextStrategy=function(){
if(this._connectionStrategies.length<=0){
return null;
}else{
return this._connectionStrategies.shift();
}
};
return _555;
})();
var _559=(function(){
var _55a=function(){
};
var _55b=function(_55c,_55d){
var _55e=0;
for(var i=_55d;i<_55d+4;i++){
_55e=(_55e<<8)+_55c.getAt(i);
}
return _55e;
};
var _560=function(_561){
if(_561.byteLength>3){
var _562=new DataView(_561);
return _562.getInt32(0);
}
return 0;
};
var _563=function(_564){
var _565=0;
for(var i=0;i<4;i++){
_565=(_565<<8)+_564.charCodeAt(i);
}
return _565;
};
var ping=[9,0];
var pong=[10,0];
var _569={};
var _56a=function(_56b){
if(typeof _569.escape==="undefined"){
var _56c=[];
var i=4;
do{
_56c[--i]=_56b&(255);
_56b=_56b>>8;
}while(i);
_569.escape=String.fromCharCode.apply(null,_56c.concat(pong));
}
return _569.escape;
};
var _56e=function(_56f,_570,_571,_572){
if(_53f.KAAZING_SEC_EXTENSION_REVALIDATE==_570._controlFrames[_572]){
var url=_571.substr(5);
if(_570._redirectUri!=null){
if(typeof (_570._redirectUri)=="string"){
var _574=new URI(_570._redirectUri);
url=_574.scheme+"://"+_574.authority+url;
}else{
url=_570._redirectUri.getHttpEquivalentScheme()+"://"+_570._redirectUri.getAuthority()+url;
}
}else{
url=_570._location.getHttpEquivalentScheme()+"://"+_570._location.getAuthority()+url;
}
_56f._listener.authenticationRequested(_570,url,_53f.KAAZING_SEC_EXTENSION_REVALIDATE);
}else{
if(_53f.KAAZING_SEC_EXTENSION_PING_PONG==_570._controlFrames[_572]){
if(_571.charCodeAt(4)==ping[0]){
var pong=_56a(_572);
_56f._nextHandler.processTextMessage(_570,pong);
}
}
}
};
var _576=_55a.prototype=new _516();
_576.handleConnectionOpened=function(_577,_578){
var _579=_577.responseHeaders;
if(_579[_53f.HEADER_SEC_EXTENSIONS]!=null){
var _57a=_579[_53f.HEADER_SEC_EXTENSIONS];
if(_57a!=null&&_57a.length>0){
var _57b=_57a.split(",");
for(var j=0;j<_57b.length;j++){
var tmp=_57b[j].split(";");
var ext=tmp[0].replace(/^\s+|\s+$/g,"");
var _57f=new WebSocketExtension(ext);
_57f.enabled=true;
_57f.negotiated=true;
if(tmp.length>1){
var _580=tmp[1].replace(/^\s+|\s+$/g,"");
if(_580.length==8){
try{
var _581=parseInt(_580,16);
_577._controlFrames[_581]=ext;
if(_53f.KAAZING_SEC_EXTENSION_REVALIDATE===ext){
_577._controlFramesBinary[_581]=ext;
}
_57f.escape=_580;
}
catch(e){
}
}
}
_577.parent._negotiatedExtensions[ext]=_57f;
}
}
}
this._listener.connectionOpened(_577,_578);
};
_576.handleTextMessageReceived=function(_582,_583){
if(_582._isEscape){
_582._isEscape=false;
this._listener.textMessageReceived(_582,_583);
return;
}
if(_583==null||_583.length<4){
this._listener.textMessageReceived(_582,_583);
return;
}
var _584=_563(_583);
if(_582._controlFrames[_584]!=null){
if(_583.length==4){
_582._isEscape=true;
return;
}else{
_56e(this,_582,_583,_584);
}
}else{
this._listener.textMessageReceived(_582,_583);
}
};
_576.handleMessageReceived=function(_585,_586){
if(_585._isEscape){
_585._isEscape=false;
this._listener.binaryMessageReceived(_585,_586);
return;
}
if(typeof (_586.byteLength)!="undefined"){
var _587=_560(_586);
if(_585._controlFramesBinary[_587]!=null){
if(_586.byteLength==4){
_585._isEscape=true;
return;
}else{
_56e(this,_585,String.fromCharCode.apply(null,new Uint8Array(_586,0)),_587);
}
}else{
this._listener.binaryMessageReceived(_585,_586);
}
}else{
if(_586.constructor==ByteBuffer){
if(_586==null||_586.limit<4){
this._listener.binaryMessageReceived(_585,_586);
return;
}
var _587=_55b(_586,_586.position);
if(_585._controlFramesBinary[_587]!=null){
if(_586.limit==4){
_585._isEscape=true;
return;
}else{
_56e(this,_585,_586.getString(Charset.UTF8),_587);
}
}else{
this._listener.binaryMessageReceived(_585,_586);
}
}
}
};
_576.processTextMessage=function(_588,_589){
if(_589.length>=4){
var _58a=_563(_589);
if(_588._escapeSequences[_58a]!=null){
var _58b=_589.slice(0,4);
this._nextHandler.processTextMessage(_588,_58b);
}
}
this._nextHandler.processTextMessage(_588,_589);
};
_576.setNextHandler=function(_58c){
var _58d=this;
this._nextHandler=_58c;
var _58e=new _529(this);
_58e.connectionOpened=function(_58f,_590){
_58d.handleConnectionOpened(_58f,_590);
};
_58e.textMessageReceived=function(_591,buf){
_58d.handleTextMessageReceived(_591,buf);
};
_58e.binaryMessageReceived=function(_593,buf){
_58d.handleMessageReceived(_593,buf);
};
_58c.setListener(_58e);
};
_576.setListener=function(_595){
this._listener=_595;
};
return _55a;
})();
var _596=(function(){
var _597=function(_598){
this.channel=_598;
};
var _599=_597.prototype;
_599.connect=function(_59a){
var _59b=this;
var _59c=new XMLHttpRequest0();
_59c.withCredentials=true;
_59c.open("GET",_59a+"&.krn="+Math.random(),true);
if(_59b.channel._challengeResponse!=null&&_59b.channel._challengeResponse.credentials!=null){
_59c.setRequestHeader("Authorization",_59b.channel._challengeResponse.credentials);
this.clearAuthenticationData(_59b.channel);
}
_59c.onreadystatechange=function(){
switch(_59c.readyState){
case 2:
if(_59c.status==403){
_59c.abort();
}
break;
case 4:
if(_59c.status==401){
_59b.handle401(_59b.channel,_59a,_59c.getResponseHeader("WWW-Authenticate"));
return;
}
break;
}
};
_59c.send(null);
};
_599.clearAuthenticationData=function(_59d){
if(_59d._challengeResponse!=null){
_59d._challengeResponse.clearCredentials();
}
};
_599.handle401=function(_59e,_59f,_5a0){
var _5a1=this;
var _5a2=_59f;
if(_5a2.indexOf("/;a/")>0){
_5a2=_5a2.substring(0,_5a2.indexOf("/;a/"));
}else{
if(_5a2.indexOf("/;ae/")>0){
_5a2=_5a2.substring(0,_5a2.indexOf("/;ae/"));
}else{
if(_5a2.indexOf("/;ar/")>0){
_5a2=_5a2.substring(0,_5a2.indexOf("/;ar/"));
}
}
}
var _5a3=new ChallengeRequest(_5a2,_5a0);
var _5a4;
if(this.channel._challengeResponse.nextChallengeHandler!=null){
_5a4=this.channel._challengeResponse.nextChallengeHandler;
}else{
_5a4=_59e.challengeHandler;
}
if(_5a4!=null&&_5a4.canHandle(_5a3)){
_5a4.handle(_5a3,function(_5a5){
try{
if(_5a5!=null&&_5a5.credentials!=null){
_5a1.channel._challengeResponse=_5a5;
_5a1.connect(_59f);
}
}
catch(e){
}
});
}
};
return _597;
})();
var _5a6=(function(){
var _5a7=function(){
};
var _5a8=_5a7.prototype=new _516();
_5a8.processConnect=function(_5a9,uri,_5ab){
if(_5a9.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
if(_5a9._delegate==null){
var _5ac=new _2d5();
_5ac.parent=_5a9;
_5a9._delegate=_5ac;
_5ad(_5ac,this);
}
_5a9._delegate.connect(uri.toString(),_5ab);
};
_5a8.processTextMessage=function(_5ae,text){
if(_5ae._delegate.readyState()==WebSocket.OPEN){
_5ae._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_5a8.processBinaryMessage=function(_5b0,obj){
if(_5b0._delegate.readyState()==WebSocket.OPEN){
_5b0._delegate.send(obj);
}else{
throw new Error("WebSocket is already closed");
}
};
_5a8.processClose=function(_5b2,code,_5b4){
try{
_5b2._delegate.close(code,_5b4);
}
catch(e){
}
};
_5a8.setIdleTimeout=function(_5b5,_5b6){
try{
_5b5._delegate.setIdleTimeout(_5b6);
}
catch(e){
}
};
var _5ad=function(_5b7,_5b8){
var _5b9=new _529(_5b8);
_5b7.setListener(_5b9);
};
return _5a7;
})();
var _5ba=(function(){
var _5bb=function(){
};
var _5bc=function(_5bd,_5be,_5bf){
_5be._redirecting=true;
_5be._redirectUri=_5bf;
_5bd._nextHandler.processClose(_5be);
};
var _5c0=_5bb.prototype=new _516();
_5c0.processConnect=function(_5c1,uri,_5c3){
_5c1._balanced=0;
this._nextHandler.processConnect(_5c1,uri,_5c3);
};
_5c0.handleConnectionClosed=function(_5c4,_5c5,code,_5c7){
if(_5c4._redirecting==true){
_5c4._redirecting=false;
_5c4._redirected=true;
_5c4.handshakePayload="";
var _5c8=[_53f.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_5c4._protocol.length;i++){
_5c8.push(_5c4._protocol[i]);
}
this.processConnect(_5c4,_5c4._redirectUri,_5c8);
}else{
this._listener.connectionClosed(_5c4,_5c5,code,_5c7);
}
};
_5c0.handleMessageReceived=function(_5ca,obj){
if(_5ca._balanced>1){
this._listener.binaryMessageReceived(_5ca,obj);
return;
}
var _5cc=_2af(obj);
if(_5cc.charCodeAt(0)==61695){
if(_5cc.match("N$")){
_5ca._balanced++;
if(_5ca._balanced==1){
this._listener.connectionOpened(_5ca,_53f.KAAZING_EXTENDED_HANDSHAKE);
}else{
this._listener.connectionOpened(_5ca,_5ca._acceptedProtocol||"");
}
}else{
if(_5cc.indexOf("R")==1){
var _5cd=new _4f3(_5cc.substring(2));
_5bc(this,_5ca,_5cd);
}else{
}
}
return;
}else{
this._listener.binaryMessageReceived(_5ca,obj);
}
};
_5c0.setNextHandler=function(_5ce){
this._nextHandler=_5ce;
var _5cf=new _529(this);
var _5d0=this;
_5cf.connectionOpened=function(_5d1,_5d2){
if(_53f.KAAZING_EXTENDED_HANDSHAKE!=_5d2){
_5d1._balanced=2;
_5d0._listener.connectionOpened(_5d1,_5d2);
}
};
_5cf.textMessageReceived=function(_5d3,_5d4){
if(_5d3._balanced>1){
_5d0._listener.textMessageReceived(_5d3,_5d4);
return;
}
if(_5d4.charCodeAt(0)==61695){
if(_5d4.match("N$")){
_5d3._balanced++;
if(_5d3._balanced==1){
_5d0._listener.connectionOpened(_5d3,_53f.KAAZING_EXTENDED_HANDSHAKE);
}else{
_5d0._listener.connectionOpened(_5d3,"");
}
}else{
if(_5d4.indexOf("R")==1){
var _5d5=new _4f3(_5d4.substring(2));
_5bc(_5d0,_5d3,_5d5);
}else{
}
}
return;
}else{
_5d0._listener.textMessageReceived(_5d3,_5d4);
}
};
_5cf.binaryMessageReceived=function(_5d6,obj){
_5d0.handleMessageReceived(_5d6,obj);
};
_5cf.connectionClosed=function(_5d8,_5d9,code,_5db){
_5d0.handleConnectionClosed(_5d8,_5d9,code,_5db);
};
_5ce.setListener(_5cf);
};
_5c0.setListener=function(_5dc){
this._listener=_5dc;
};
return _5bb;
})();
var _5dd=(function(){
var _5de="Sec-WebSocket-Protocol";
var _5df="Sec-WebSocket-Extensions";
var _5e0="Authorization";
var _5e1="WWW-Authenticate";
var _5e2="Set-Cookie";
var _5e3="GET";
var _5e4="HTTP/1.1";
var _5e5=":";
var _5e6=" ";
var _5e7="\r\n";
var _5e8=function(){
};
var _5e9=function(_5ea,_5eb){
var _5ec=new XMLHttpRequest0();
var path=_5ea._location.getHttpEquivalentScheme()+"://"+_5ea._location.getAuthority()+(_5ea._location._uri.path||"");
path=path.replace(/[\/]?$/,"/;api/set-cookies");
_5ec.open("POST",path,true);
_5ec.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_5ec.send(_5eb);
};
var _5ee=function(_5ef,_5f0,_5f1){
var _5f2=[];
var _5f3=[];
_5f2.push("WebSocket-Protocol");
_5f3.push("");
_5f2.push(_5de);
_5f3.push(_5f0._protocol.join(","));
var _5f4=[_53f.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT,_53f.KAAZING_SEC_EXTENSION_PING_PONG];
var ext=_5f0._extensions;
if(ext.length>0){
_5f4.push(ext);
}
_5f2.push(_5df);
_5f3.push(_5f4.join(","));
_5f2.push(_5e0);
_5f3.push(_5f1);
var _5f6=_5f7(_5f0._location,_5f2,_5f3);
_5ef._nextHandler.processTextMessage(_5f0,_5f6);
};
var _5f7=function(_5f8,_5f9,_5fa){
var _5fb=[];
_5fb.push(_5e3);
_5fb.push(_5e6);
var path=[];
if(_5f8._uri.path!=undefined){
path.push(_5f8._uri.path);
}
if(_5f8._uri.query!=undefined){
path.push("?");
path.push(_5f8._uri.query);
}
_5fb.push(path.join(""));
_5fb.push(_5e6);
_5fb.push(_5e4);
_5fb.push(_5e7);
for(var i=0;i<_5f9.length;i++){
var _5fe=_5f9[i];
var _5ff=_5fa[i];
if(_5fe!=null&&_5ff!=null){
_5fb.push(_5fe);
_5fb.push(_5e5);
_5fb.push(_5e6);
_5fb.push(_5ff);
_5fb.push(_5e7);
}
}
_5fb.push(_5e7);
var _600=_5fb.join("");
return _600;
};
var _601=function(_602,_603,s){
if(s.length>0){
_603.handshakePayload+=s;
return;
}
var _605=_603.handshakePayload.split("\n");
_603.handshakePayload="";
var _606="";
for(var i=_605.length-1;i>=0;i--){
if(_605[i].indexOf("HTTP/1.1")==0){
var temp=_605[i].split(" ");
_606=temp[1];
break;
}
}
if("101"==_606){
var _609=[];
var _60a="";
for(var i=0;i<_605.length;i++){
var line=_605[i];
if(line!=null&&line.indexOf(_5df)==0){
_609.push(line.substring(_5df.length+2));
}else{
if(line!=null&&line.indexOf(_5de)==0){
_60a=line.substring(_5de.length+2);
}else{
if(line!=null&&line.indexOf(_5e2)==0){
_5e9(_603,line.substring(_5e2.length+2));
}
}
}
}
_603._acceptedProtocol=_60a;
if(_609.length>0){
var _60c=[];
var _60d=_609.join(", ").split(", ");
for(var j=0;j<_60d.length;j++){
var tmp=_60d[j].split(";");
var ext=tmp[0].replace(/^\s+|\s+$/g,"");
var _611=new WebSocketExtension(ext);
if(_53f.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT===ext){
var _612=tmp[1].match(/\d+/)[0];
if(_612>0){
_602._nextHandler.setIdleTimeout(_603,_612);
}
continue;
}else{
if(_53f.KAAZING_SEC_EXTENSION_PING_PONG===ext){
try{
var _613=tmp[1].replace(/^\s+|\s+$/g,"");
var _614=parseInt(_613,16);
_603._controlFrames[_614]=ext;
_603._escapeSequences[_614]=ext;
continue;
}
catch(e){
throw new Error("failed to parse escape key for x-kaazing-ping-pong extension");
}
}else{
if(tmp.length>1){
var _613=tmp[1].replace(/^\s+|\s+$/g,"");
if(_613.length==8){
try{
var _614=parseInt(_613,16);
_603._controlFrames[_614]=ext;
if(_53f.KAAZING_SEC_EXTENSION_REVALIDATE===ext){
_603._controlFramesBinary[_614]=ext;
}
_611.escape=_613;
}
catch(e){
}
}
}
}
}
_611.enabled=true;
_611.negotiated=true;
_60c.push(_60d[j]);
}
if(_60c.length>0){
_603.parent._negotiatedExtensions[ext]=_60c.join(",");
}
}
return;
}else{
if("401"==_606){
_603.handshakestatus=2;
var _615="";
for(var i=0;i<_605.length;i++){
if(_605[i].indexOf(_5e1)==0){
_615=_605[i].substring(_5e1.length+2);
break;
}
}
_602._listener.authenticationRequested(_603,_603._location.toString(),_615);
}else{
_602._listener.connectionFailed(_603);
}
}
};
var _616=function(_617,_618){
try{
_618.handshakestatus=3;
_617._nextHandler.processClose(_618);
}
finally{
_617._listener.connectionFailed(_618);
}
};
var _619=_5e8.prototype=new _516();
_619.processConnect=function(_61a,uri,_61c){
_61a.handshakePayload="";
var _61d=[_53f.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_61c.length;i++){
_61d.push(_61c[i]);
}
this._nextHandler.processConnect(_61a,uri,_61d);
_61a.handshakestatus=0;
var _61f=this;
setTimeout(function(){
if(_61a.handshakestatus==0){
_616(_61f,_61a);
}
},5000);
};
_619.processAuthorize=function(_620,_621){
_5ee(this,_620,_621);
};
_619.handleConnectionOpened=function(_622,_623){
if(_53f.KAAZING_EXTENDED_HANDSHAKE==_623){
_5ee(this,_622,null);
_622.handshakestatus=1;
var _624=this;
setTimeout(function(){
if(_622.handshakestatus<2){
_616(_624,_622);
}
},5000);
}else{
_622.handshakestatus=2;
this._listener.connectionOpened(_622,_623);
}
};
_619.handleMessageReceived=function(_625,_626){
if(_625.readyState==WebSocket.OPEN){
_625._isEscape=false;
this._listener.textMessageReceived(_625,_626);
}else{
_601(this,_625,_626);
}
};
_619.handleBinaryMessageReceived=function(_627,_628){
if(_627.readyState==WebSocket.OPEN){
_627._isEscape=false;
this._listener.binaryMessageReceived(_627,_628);
}else{
_601(this,_627,String.fromCharCode.apply(null,new Uint8Array(_628)));
}
};
_619.setNextHandler=function(_629){
this._nextHandler=_629;
var _62a=this;
var _62b=new _529(this);
_62b.connectionOpened=function(_62c,_62d){
_62a.handleConnectionOpened(_62c,_62d);
};
_62b.textMessageReceived=function(_62e,buf){
_62a.handleMessageReceived(_62e,buf);
};
_62b.binaryMessageReceived=function(_630,buf){
_62a.handleBinaryMessageReceived(_630,buf);
};
_62b.connectionClosed=function(_632,_633,code,_635){
if(_632.handshakestatus<3){
_632.handshakestatus=3;
}
_62a._listener.connectionClosed(_632,_633,code,_635);
};
_62b.connectionFailed=function(_636){
if(_636.handshakestatus<3){
_636.handshakestatus=3;
}
_62a._listener.connectionFailed(_636);
};
_629.setListener(_62b);
};
_619.setListener=function(_637){
this._listener=_637;
};
return _5e8;
})();
var _638=(function(){
var _639=function(){
};
var _63a=_639.prototype=new _516();
_63a.handleClearAuthenticationData=function(_63b){
if(_63b._challengeResponse!=null){
_63b._challengeResponse.clearCredentials();
}
};
_63a.handleRemoveAuthenticationData=function(_63c){
this.handleClearAuthenticationData(_63c);
_63c._challengeResponse=new ChallengeResponse(null,null);
};
_63a.doError=function(_63d){
this._nextHandler.processClose(_63d);
this.handleClearAuthenticationData(_63d);
this._listener.connectionFailed(_63d);
};
_63a.handle401=function(_63e,_63f,_640){
var _641=this;
var _642=_63e._location;
if(_63e.redirectUri!=null){
_642=_63e._redirectUri;
}
if(_53f.KAAZING_SEC_EXTENSION_REVALIDATE==_640){
var ch=new _543(_642,_63e._protocol,_63e._isBinary);
ch.challengeHandler=_63e.parent.challengeHandler;
var _644=new _596(ch);
_644.connect(_63f);
}else{
var _645=new ChallengeRequest(_642.toString(),_640);
var _646;
if(_63e._challengeResponse.nextChallengeHandler!=null){
_646=_63e._challengeResponse.nextChallengeHandler;
}else{
_646=_63e.parent.challengeHandler;
}
if(_646!=null&&_646.canHandle(_645)){
_646.handle(_645,function(_647){
try{
if(_647==null||_647.credentials==null){
_641.doError(_63e);
}else{
_63e._challengeResponse=_647;
_641._nextHandler.processAuthorize(_63e,_647.credentials);
}
}
catch(e){
_641.doError(_63e);
}
});
}else{
this.doError(_63e);
}
}
};
_63a.handleAuthenticate=function(_648,_649,_64a){
_648.authenticationReceived=true;
this.handle401(_648,_649,_64a);
};
_63a.setNextHandler=function(_64b){
this._nextHandler=_64b;
var _64c=this;
var _64d=new _529(this);
_64d.authenticationRequested=function(_64e,_64f,_650){
_64c.handleAuthenticate(_64e,_64f,_650);
};
_64b.setListener(_64d);
};
_63a.setListener=function(_651){
this._listener=_651;
};
return _639;
})();
var _652=(function(){
var _653=function(){
};
var _654=_653.prototype=new _516();
_654.processConnect=function(_655,uri,_657){
this._nextHandler.processConnect(_655,uri,_657);
};
_654.processBinaryMessage=function(_658,data){
if(data.constructor==ByteBuffer){
var _65a=data.array.slice(data.position,data.limit);
this._nextHandler.processTextMessage(_658,Charset.UTF8.encodeByteArray(_65a));
}else{
if(data.byteLength){
this._nextHandler.processTextMessage(_658,Charset.UTF8.encodeArrayBuffer(data));
}else{
if(data.size){
var _65b=this;
var cb=function(_65d){
_65b._nextHandler.processBinaryMessage(_658,Charset.UTF8.encodeByteArray(_65d));
};
BlobUtils.asNumberArray(cb,data);
}else{
throw new Error("Invalid type for send");
}
}
}
};
_654.setNextHandler=function(_65e){
this._nextHandler=_65e;
var _65f=this;
var _660=new _529(this);
_660.textMessageReceived=function(_661,text){
_65f._listener.binaryMessageReceived(_661,ByteBuffer.wrap(Charset.UTF8.toByteArray(text)));
};
_660.binaryMessageReceived=function(_663,buf){
throw new Error("draft76 won't receive binary frame");
};
_65e.setListener(_660);
};
_654.setListener=function(_665){
this._listener=_665;
};
return _653;
})();
var _666=(function(){
var _667=function(){
var _668=new _638();
return _668;
};
var _669=function(){
var _66a=new _5dd();
return _66a;
};
var _66b=function(){
var _66c=new _559();
return _66c;
};
var _66d=function(){
var _66e=new _5ba();
return _66e;
};
var _66f=function(){
var _670=new _5a6();
return _670;
};
var _671=function(){
var _672=new _652();
return _672;
};
var _673=(browser=="safari"&&typeof (WebSocket.CLOSING)=="undefined");
var _674=_667();
var _675=_669();
var _676=_66b();
var _677=_66d();
var _678=_66f();
var _679=_671();
var _67a=function(){
if(_673){
this.setNextHandler(_679);
_679.setNextHandler(_674);
}else{
this.setNextHandler(_674);
}
_674.setNextHandler(_675);
_675.setNextHandler(_676);
_676.setNextHandler(_677);
_677.setNextHandler(_678);
};
var _67b=function(_67c,_67d){
};
var _67e=_67a.prototype=new _516();
_67e.setNextHandler=function(_67f){
this._nextHandler=_67f;
var _680=new _529(this);
_67f.setListener(_680);
};
_67e.setListener=function(_681){
this._listener=_681;
};
return _67a;
})();
var _682=(function(){
var _683=512*1024;
var _684=1;
var _685=function(_686){
this.retry=3000;
if(_686.indexOf("/;e/dtem/")>0){
this.requiresEscaping=true;
}
var _687=new URI(_686);
var _688={"http":80,"https":443};
if(_687.port==undefined){
_687.port=_688[_687.scheme];
_687.authority=_687.host+":"+_687.port;
}
this.origin=_687.scheme+"://"+_687.authority;
this.location=_686;
this.activeXhr=null;
this.reconnectTimer=null;
this.idleTimer=null;
this.idleTimeout=null;
this.lastMessageTimestamp=null;
this.buf=new ByteBuffer();
var _689=this;
setTimeout(function(){
connect(_689,true);
_689.activeXhr=_689.mostRecentXhr;
startProxyDetectionTimer(_689,_689.mostRecentXhr);
},0);
};
var _68a=_685.prototype;
var _68b=0;
var _68c=255;
var _68d=1;
var _68e=128;
var _68f=129;
var _690=127;
var _691=137;
var _692=3000;
_68a.readyState=0;
function connect(_693,_694){
if(_693.reconnectTimer!==null){
_693.reconnectTimer=null;
}
stopIdleTimer(_693);
var _695=new URI(_693.location);
var _696=[];
switch(browser){
case "ie":
_696.push(".kns=1");
_696.push(".kf=200&.kp=2048");
break;
case "safari":
_696.push(".kp=256");
break;
case "firefox":
_696.push(".kp=1025");
break;
case "android":
_696.push(".kp=4096");
_696.push(".kbp=4096");
break;
}
if(browser=="android"||browser.ios){
_696.push(".kkt=20");
}
_696.push(".kc=text/plain;charset=windows-1252");
_696.push(".kb=4096");
_696.push(".kid="+String(Math.random()).substring(2));
if(_696.length>0){
if(_695.query===undefined){
_695.query=_696.join("&");
}else{
_695.query+="&"+_696.join("&");
}
}
var xhr=new XMLHttpRequest0();
xhr.id=_684++;
xhr.position=0;
xhr.opened=false;
xhr.reconnect=false;
xhr.requestClosing=false;
xhr.onreadystatechange=function(){
if(xhr.readyState==3){
if(_693.idleTimer==null){
var _698=xhr.getResponseHeader("X-Idle-Timeout");
if(_698){
var _699=parseInt(_698);
if(_699>0){
_699=_699*1000;
_693.idleTimeout=_699;
_693.lastMessageTimestamp=new Date().getTime();
startIdleTimer(_693,_699);
}
}
}
}
};
xhr.onprogress=function(){
if(xhr==_693.activeXhr&&_693.readyState!=2){
_process(_693);
}
};
xhr.onload=function(){
if(xhr==_693.activeXhr&&_693.readyState!=2){
_process(_693);
xhr.onerror=function(){
};
xhr.ontimeout=function(){
};
xhr.onreadystatechange=function(){
};
if(!xhr.reconnect){
doError(_693);
}else{
if(xhr.requestClosing){
doClose(_693);
}else{
if(_693.activeXhr==_693.mostRecentXhr){
connect(_693);
_693.activeXhr=_693.mostRecentXhr;
startProxyDetectionTimer(_693,_693.activeXhr);
}else{
var _69a=_693.mostRecentXhr;
_693.activeXhr=_69a;
switch(_69a.readyState){
case 1:
case 2:
startProxyDetectionTimer(_693,_69a);
break;
case 3:
_process(_693);
break;
case 4:
_693.activeXhr.onload();
break;
default:
}
}
}
}
}
};
xhr.ontimeout=function(){
doError(_693);
};
xhr.onerror=function(){
doError(_693);
};
xhr.open("GET",_695.toString(),true);
xhr.send("");
_693.mostRecentXhr=xhr;
};
function startProxyDetectionTimer(_69b,xhr){
if(_69b.location.indexOf("&.ki=p")==-1){
setTimeout(function(){
if(xhr&&xhr.readyState<3&&_69b.readyState<2){
_69b.location+="&.ki=p";
connect(_69b,false);
}
},_692);
}
};
_68a.disconnect=function(){
if(this.readyState!==2){
_disconnect(this);
}
};
function _disconnect(_69d){
if(_69d.reconnectTimer!==null){
clearTimeout(_69d.reconnectTimer);
_69d.reconnectTimer=null;
}
stopIdleTimer(_69d);
if(_69d.mostRecentXhr!==null){
_69d.mostRecentXhr.onprogress=function(){
};
_69d.mostRecentXhr.onload=function(){
};
_69d.mostRecentXhr.onerror=function(){
};
_69d.mostRecentXhr.abort();
}
if(_69d.activeXhr!=_69d.mostRecentXhr&&_69d.activeXhr!==null){
_69d.activeXhr.onprogress=function(){
};
_69d.activeXhr.onload=function(){
};
_69d.activeXhr.onerror=function(){
};
_69d.activeXhr.abort();
}
_69d.lineQueue=[];
_69d.lastEventId=null;
_69d.location=null;
_69d.readyState=2;
};
function _process(_69e){
_69e.lastMessageTimestamp=new Date().getTime();
var xhr=_69e.activeXhr;
var _6a0=xhr.responseText;
if(_6a0.length>=_683){
if(_69e.activeXhr==_69e.mostRecentXhr){
connect(_69e,false);
}
}
var _6a1=_6a0.slice(xhr.position);
xhr.position=_6a0.length;
var buf=_69e.buf;
var _6a3=_486.toArray(_6a1,_69e.requiresEscaping);
if(_6a3.hasRemainder){
xhr.position--;
}
buf.position=buf.limit;
buf.putBytes(_6a3);
buf.position=0;
buf.mark();
parse:
while(true){
if(!buf.hasRemaining()){
break;
}
var type=buf.getUnsigned();
switch(type&128){
case _68b:
var _6a5=buf.indexOf(_68c);
if(_6a5==-1){
break parse;
}
var _6a6=buf.array.slice(buf.position,_6a5);
var data=new ByteBuffer(_6a6);
var _6a8=_6a5-buf.position;
buf.skip(_6a8+1);
buf.mark();
if(type==_68d){
handleCommandFrame(_69e,data);
}else{
dispatchText(_69e,data.getString(Charset.UTF8));
}
break;
case _68e:
case _68f:
var _6a9=0;
var _6aa=false;
while(buf.hasRemaining()){
var b=buf.getUnsigned();
_6a9=_6a9<<7;
_6a9|=(b&127);
if((b&128)!=128){
_6aa=true;
break;
}
}
if(!_6aa){
break parse;
}
if(buf.remaining()<_6a9){
break parse;
}
var _6ac=buf.array.slice(buf.position,buf.position+_6a9);
var _6ad=new ByteBuffer(_6ac);
buf.skip(_6a9);
buf.mark();
if(type==_68e){
dispatchBytes(_69e,_6ad);
}else{
if(type==_691){
dispatchPingReceived(_69e);
}else{
dispatchText(_69e,_6ad.getString(Charset.UTF8));
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
function handleCommandFrame(_6ae,data){
while(data.remaining()){
var _6b0=String.fromCharCode(data.getUnsigned());
switch(_6b0){
case "0":
break;
case "1":
_6ae.activeXhr.reconnect=true;
break;
case "2":
_6ae.activeXhr.requestClosing=true;
break;
default:
throw new Error("Protocol decode error. Unknown command: "+_6b0);
}
}
};
function dispatchBytes(_6b1,buf){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=_6b1.lastEventId;
e.data=buf;
e.decoder=_2a8;
e.origin=_6b1.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_6b1.onmessage)==="function"){
_6b1.onmessage(e);
}
};
function dispatchText(_6b4,data){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=_6b4.lastEventId;
e.text=data;
e.origin=_6b4.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_6b4.onmessage)==="function"){
_6b4.onmessage(e);
}
};
function dispatchPingReceived(_6b7){
if(typeof (_6b7.onping)==="function"){
_6b7.onping();
}
};
function doClose(_6b8){
doError(_6b8);
};
function doError(_6b9){
if(_6b9.readyState!=2){
_6b9.disconnect();
fireError(_6b9);
}
};
function fireError(_6ba){
var e=document.createEvent("Events");
e.initEvent("error",true,true);
if(typeof (_6ba.onerror)==="function"){
_6ba.onerror(e);
}
};
function startIdleTimer(_6bc,_6bd){
stopIdleTimer(_6bc);
_6bc.idleTimer=setTimeout(function(){
idleTimerHandler(_6bc);
},_6bd);
};
function idleTimerHandler(_6be){
var _6bf=new Date().getTime();
var _6c0=_6bf-_6be.lastMessageTimestamp;
var _6c1=_6be.idleTimeout;
if(_6c0>_6c1){
doError(_6be);
}else{
startIdleTimer(_6be,_6c1-_6c0);
}
};
function stopIdleTimer(_6c2){
if(_6c2.idleTimer!=null){
clearTimeout(_6c2.idleTimer);
_6c2.IdleTimer=null;
}
};
return _685;
})();
var _6c3=(function(){
var _6c4=function(){
this.parent;
this._listener;
this.closeCode=1005;
this.closeReason="";
};
var _6c5=_6c4.prototype;
_6c5.connect=function(_6c6,_6c7){
this.URL=_6c6.replace("ws","http");
this.protocol=_6c7;
this._prepareQueue=new _4db();
this._sendQueue=[];
_6c8(this);
};
_6c5.readyState=0;
_6c5.bufferedAmount=0;
_6c5.URL="";
_6c5.onopen=function(){
};
_6c5.onerror=function(){
};
_6c5.onmessage=function(_6c9){
};
_6c5.onclose=function(){
};
var _6ca=128;
var _6cb=129;
var _6cc=0;
var _6cd=255;
var _6ce=1;
var _6cf=138;
var _6d0=[_6ce,48,49,_6cd];
var _6d1=[_6ce,48,50,_6cd];
var _6d2=function(buf,_6d4){
var _6d5=0;
var _6d6=0;
do{
_6d6<<=8;
_6d6|=(_6d4&127);
_6d4>>=7;
_6d5++;
}while(_6d4>0);
do{
var _6d7=_6d6&255;
_6d6>>=8;
if(_6d5!=1){
_6d7|=128;
}
buf.put(_6d7);
}while(--_6d5>0);
};
_6c5.send=function(data){
var _6d9=this;
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
case 1:
if(data===null){
throw new Error("data is null");
}
var buf=new ByteBuffer();
if(typeof data=="string"){
var _6db=new ByteBuffer();
_6db.putString(data,Charset.UTF8);
buf.put(_6cb);
_6d2(buf,_6db.position);
buf.putBytes(_6db.array);
}else{
if(data.constructor==ByteBuffer){
buf.put(_6ca);
_6d2(buf,data.remaining());
buf.putBuffer(data);
}else{
if(data.byteLength){
buf.put(_6ca);
_6d2(buf,data.byteLength);
buf.putByteArray(data);
}else{
if(data.size){
var cb=this._prepareQueue.enqueue(function(_6dd){
var b=new ByteBuffer();
b.put(_6ca);
_6d2(b,_6dd.length);
b.putBytes(_6dd);
b.flip();
doSend(_6d9,b);
});
BlobUtils.asNumberArray(cb,data);
return true;
}else{
throw new Error("Invalid type for send");
}
}
}
}
buf.flip();
this._prepareQueue.enqueue(function(_6df){
doSend(_6d9,buf);
})();
return true;
case 2:
return false;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_6c5.close=function(code,_6e1){
switch(this.readyState){
case 0:
_6e2(this);
break;
case 1:
if(code!=null&&code!=0){
this.closeCode=code;
this.closeReason=_6e1;
}
doSend(this,new ByteBuffer(_6d1));
break;
}
};
_6c5.setListener=function(_6e3){
this._listener=_6e3;
};
function openUpstream(_6e4){
if(_6e4.readyState!=1){
return;
}
if(_6e4.idleTimer){
clearTimeout(_6e4.idleTimer);
}
var xdr=new XMLHttpRequest0();
xdr.onreadystatechange=function(){
if(xdr.readyState==4){
switch(xdr.status){
case 200:
setTimeout(function(){
doFlush(_6e4);
},0);
break;
}
}
};
xdr.onload=function(){
openUpstream(_6e4);
};
xdr.open("POST",_6e4._upstream+"&.krn="+Math.random(),true);
_6e4.upstreamXHR=xdr;
_6e4.idleTimer=setTimeout(function(){
if(_6e4.upstreamXHR!=null){
_6e4.upstreamXHR.abort();
}
openUpstream(_6e4);
},30000);
};
function doSend(_6e6,buf){
_6e6.bufferedAmount+=buf.remaining();
_6e6._sendQueue.push(buf);
_6e8(_6e6);
if(!_6e6._writeSuspended){
doFlush(_6e6);
}
};
function doFlush(_6e9){
var _6ea=_6e9._sendQueue;
var _6eb=_6ea.length;
_6e9._writeSuspended=(_6eb>0);
if(_6eb>0){
if(_6e9.useXDR){
var out=new ByteBuffer();
while(_6ea.length){
out.putBuffer(_6ea.shift());
}
out.putBytes(_6d0);
out.flip();
_6e9.upstreamXHR.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_6e9.upstreamXHR.send(_2c3(out,_6e9.requiresEscaping));
}else{
var xhr=new XMLHttpRequest0();
xhr.open("POST",_6e9._upstream+"&.krn="+Math.random(),true);
xhr.onreadystatechange=function(){
if(xhr.readyState==4){
switch(xhr.status){
case 200:
setTimeout(function(){
doFlush(_6e9);
},0);
break;
default:
_6e2(_6e9);
break;
}
}
};
var out=new ByteBuffer();
while(_6ea.length){
out.putBuffer(_6ea.shift());
}
out.putBytes(_6d0);
out.flip();
if(browser=="firefox"){
if(xhr.sendAsBinary){
xhr.setRequestHeader("Content-Type","application/octet-stream");
xhr.sendAsBinary(_2c3(out));
}else{
xhr.send(_2c3(out));
}
}else{
xhr.setRequestHeader("Content-Type","text/plain; charset=utf-8");
xhr.send(_2c3(out,_6e9.requiresEscaping));
}
}
}
_6e9.bufferedAmount=0;
_6e8(_6e9);
};
var _6c8=function(_6ee){
var url=new URI(_6ee.URL);
url.scheme=url.scheme.replace("ws","http");
locationURI=new URI((browser=="ie")?document.URL:location.href);
if(browser=="ie"&&typeof (XDomainRequest)!=="undefined"&&url.scheme===locationURI.scheme){
_6ee.useXDR=true;
}
switch(browser){
case "opera":
_6ee.requiresEscaping=true;
break;
case "ie":
if(!_6ee.useXDR){
_6ee.requiresEscaping=true;
}else{
if((typeof (Object.defineProperties)==="undefined")&&(navigator.userAgent.indexOf("MSIE 8")>0)){
_6ee.requiresEscaping=true;
}else{
_6ee.requiresEscaping=false;
}
}
break;
default:
_6ee.requiresEscaping=false;
break;
}
var _6f0=_6ee.requiresEscaping?"/;e/ctem":"/;e/ctm";
url.path=url.path.replace(/[\/]?$/,_6f0);
var _6f1=url.toString();
var _6f2=_6f1.indexOf("?");
if(_6f2==-1){
_6f1+="?";
}else{
_6f1+="&";
}
_6f1+=".kn="+String(Math.random()).substring(2);
var _6f3=new XMLHttpRequest0();
var _6f4=false;
_6f3.withCredentials=true;
_6f3.open("GET",_6f1,true);
_6f3.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_6f3.setRequestHeader("X-WebSocket-Version","wseb-1.0");
_6f3.setRequestHeader("X-Accept-Commands","ping");
if(_6ee.protocol.length){
var _6f5=_6ee.protocol.join(",");
_6f3.setRequestHeader("X-WebSocket-Protocol",_6f5);
}
for(var i=0;i<_6ee.parent.requestHeaders.length;i++){
var _6f7=_6ee.parent.requestHeaders[i];
_6f3.setRequestHeader(_6f7.label,_6f7.value);
}
_6f3.onreadystatechange=function(){
switch(_6f3.readyState){
case 2:
if(_6f3.status==403){
doError(_6ee);
}else{
timer=setTimeout(function(){
if(!_6f4){
doError(_6ee);
}
},5000);
}
break;
case 4:
_6f4=true;
if(_6f3.status==401){
_6ee._listener.authenticationRequested(_6ee.parent,_6f3._location,_6f3.getResponseHeader("WWW-Authenticate"));
return;
}
if(_6ee.readyState<1){
if(_6f3.status==201){
var _6f8=_6f3.responseText.split("\n");
_6ee._upstream=_6f8[0];
var _6f9=_6f8[1];
_6ee._downstream=new _682(_6f9);
var _6fa=_6f9.substring(0,_6f9.indexOf("/;e/"));
if(_6fa!=_6ee.parent._location.toString().replace("ws","http")){
_6ee.parent._redirectUri=_6fa;
}
_6fb(_6ee,_6ee._downstream);
_6ee.parent.responseHeaders=_6f3.getAllResponseHeaders();
_6fc(_6ee);
}else{
doError(_6ee);
}
}
break;
}
};
_6f3.send(null);
};
var _6fc=function(_6fd){
_6fd.readyState=1;
var _6fe=_6fd.parent;
_6fe._acceptedProtocol=_6fe.responseHeaders["X-WebSocket-Protocol"]||"";
if(_6fd.useXDR){
this.upstreamXHR=null;
openUpstream(_6fd);
}
_6fd._listener.connectionOpened(_6fd.parent,_6fe._acceptedProtocol);
};
function doError(_6ff){
if(_6ff.readyState<2){
_6ff.readyState=2;
if(_6ff.idleTimer){
clearTimeout(_6ff.idleTimer);
}
if(_6ff.upstreamXHR!=null){
_6ff.upstreamXHR.abort();
}
if(_6ff.onerror!=null){
_6ff._listener.connectionFailed(_6ff.parent);
}
}
};
var _6e2=function(_700,_701,code,_703){
switch(_700.readyState){
case 2:
break;
case 0:
case 1:
_700.readyState=WebSocket.CLOSED;
if(_700.idleTimer){
clearTimeout(_700.idleTimer);
}
if(_700.upstreamXHR!=null){
_700.upstreamXHR.abort();
}
if(typeof _701==="undefined"){
_700._listener.connectionClosed(_700.parent,true,1005,"");
}else{
_700._listener.connectionClosed(_700.parent,_701,code,_703);
}
break;
default:
}
};
var _6e8=function(_704){
};
var _705=function(_706,_707){
if(_707.text){
_706._listener.textMessageReceived(_706.parent,_707.text);
}else{
if(_707.data){
_706._listener.binaryMessageReceived(_706.parent,_707.data);
}
}
};
var _708=function(_709){
var _70a=ByteBuffer.allocate(2);
_70a.put(_6cf);
_70a.put(0);
_70a.flip();
doSend(_709,_70a);
};
var _6fb=function(_70b,_70c){
_70c.onmessage=function(_70d){
switch(_70d.type){
case "message":
if(_70b.readyState==1){
_705(_70b,_70d);
}
break;
}
};
_70c.onping=function(){
if(_70b.readyState==1){
_708(_70b);
}
};
_70c.onerror=function(){
try{
_70c.disconnect();
}
finally{
_6e2(_70b,true,_70b.closeCode,_70b.closeReason);
}
};
_70c.onclose=function(_70e){
try{
_70c.disconnect();
}
finally{
_6e2(_70b,true,this.closeCode,this.closeReason);
}
};
};
return _6c4;
})();
var _70f=(function(){
var _710=function(){
};
var _711=_710.prototype=new _516();
_711.processConnect=function(_712,uri,_714){
if(_712.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
var _715=!!window.MockWseTransport?new MockWseTransport():new _6c3();
_715.parent=_712;
_712._delegate=_715;
_716(_715,this);
_715.connect(uri.toString(),_714);
};
_711.processTextMessage=function(_717,text){
if(_717.readyState==WebSocket.OPEN){
_717._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_711.processBinaryMessage=function(_719,obj){
if(_719.readyState==WebSocket.OPEN){
_719._delegate.send(obj);
}else{
throw new Error("WebSocket is already closed");
}
};
_711.processClose=function(_71b,code,_71d){
try{
_71b._delegate.close(code,_71d);
}
catch(e){
listener.connectionClosed(_71b);
}
};
var _716=function(_71e,_71f){
var _720=new _529(_71f);
_71e.setListener(_720);
};
return _710;
})();
var _721=(function(){
var _722=function(){
};
var _723=_722.prototype=new _516();
_723.handleClearAuthenticationData=function(_724){
if(_724._challengeResponse!=null){
_724._challengeResponse.clearCredentials();
}
};
_723.handleRemoveAuthenticationData=function(_725){
this.handleClearAuthenticationData(_725);
_725._challengeResponse=new ChallengeResponse(null,null);
};
_723.handle401=function(_726,_727,_728){
var _729=this;
if(_53f.KAAZING_SEC_EXTENSION_REVALIDATE==_728){
var _72a=new _596(_726);
_726.challengeHandler=_726.parent.challengeHandler;
_72a.connect(_727);
}else{
var _72b=_727;
if(_72b.indexOf("/;e/")>0){
_72b=_72b.substring(0,_72b.indexOf("/;e/"));
}
var _72c=new _4f3(_72b.replace("http","ws"));
var _72d=new ChallengeRequest(_72b,_728);
var _72e;
if(_726._challengeResponse.nextChallengeHandler!=null){
_72e=_726._challengeResponse.nextChallengeHandler;
}else{
_72e=_726.parent.challengeHandler;
}
if(_72e!=null&&_72e.canHandle(_72d)){
_72e.handle(_72d,function(_72f){
try{
if(_72f==null||_72f.credentials==null){
_729.handleClearAuthenticationData(_726);
_729._listener.connectionFailed(_726);
}else{
_726._challengeResponse=_72f;
_729.processConnect(_726,_72c,_726._protocol);
}
}
catch(e){
_729.handleClearAuthenticationData(_726);
_729._listener.connectionFailed(_726);
}
});
}else{
this.handleClearAuthenticationData(_726);
this._listener.connectionFailed(_726);
}
}
};
_723.processConnect=function(_730,_731,_732){
if(_730._challengeResponse!=null&&_730._challengeResponse.credentials!=null){
var _733=_730._challengeResponse.credentials.toString();
for(var i=_730.requestHeaders.length-1;i>=0;i--){
if(_730.requestHeaders[i].label==="Authorization"){
_730.requestHeaders.splice(i,1);
}
}
var _735=new _4e5("Authorization",_733);
for(var i=_730.requestHeaders.length-1;i>=0;i--){
if(_730.requestHeaders[i].label==="Authorization"){
_730.requestHeaders.splice(i,1);
}
}
_730.requestHeaders.push(_735);
this.handleClearAuthenticationData(_730);
}
this._nextHandler.processConnect(_730,_731,_732);
};
_723.handleAuthenticate=function(_736,_737,_738){
_736.authenticationReceived=true;
this.handle401(_736,_737,_738);
};
_723.setNextHandler=function(_739){
this._nextHandler=_739;
var _73a=new _529(this);
var _73b=this;
_73a.authenticationRequested=function(_73c,_73d,_73e){
_73b.handleAuthenticate(_73c,_73d,_73e);
};
_739.setListener(_73a);
};
_723.setListener=function(_73f){
this._listener=_73f;
};
return _722;
})();
var _740=(function(){
var _741=new _721();
var _742=new _559();
var _743=new _70f();
var _744=function(){
this.setNextHandler(_741);
_741.setNextHandler(_742);
_742.setNextHandler(_743);
};
var _745=_744.prototype=new _516();
_745.processConnect=function(_746,_747,_748){
var _749=[];
for(var i=0;i<_748.length;i++){
_749.push(_748[i]);
}
var _74b=_746._extensions;
if(_74b.length>0){
_746.requestHeaders.push(new _4e5(_53f.HEADER_SEC_EXTENSIONS,_74b.join(";")));
}
this._nextHandler.processConnect(_746,_747,_749);
};
_745.setNextHandler=function(_74c){
this._nextHandler=_74c;
var _74d=this;
var _74e=new _529(this);
_74e.commandMessageReceived=function(_74f,_750){
if(_750=="CloseCommandMessage"&&_74f.readyState==1){
}
_74d._listener.commandMessageReceived(_74f,_750);
};
_74c.setListener(_74e);
};
_745.setListener=function(_751){
this._listener=_751;
};
return _744;
})();
var _752=(function(){
var _753=function(){
};
var _754=_753.prototype=new _516();
_754.processConnect=function(_755,uri,_757){
if(_755.readyState==2){
throw new Error("WebSocket is already closed");
}
var _758=new _304();
_758.parent=_755;
_755._delegate=_758;
_759(_758,this);
_758.connect(uri.toString(),_757);
};
_754.processTextMessage=function(_75a,text){
if(_75a.readyState==1){
_75a._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_754.processBinaryMessage=function(_75c,_75d){
if(_75c.readyState==1){
_75c._delegate.send(_75d);
}else{
throw new Error("WebSocket is already closed");
}
};
_754.processClose=function(_75e,code,_760){
_75e._delegate.close(code,_760);
};
var _759=function(_761,_762){
var _763=new _529(_762);
_761.setListener(_763);
_763.redirected=function(_764,_765){
_764._redirectUri=_765;
};
};
return _753;
})();
var _766=(function(){
var _767=function(){
var _768=new _721();
return _768;
};
var _769=function(){
var _76a=new _559();
return _76a;
};
var _76b=function(){
var _76c=new _752();
return _76c;
};
var _76d=_767();
var _76e=_769();
var _76f=_76b();
var _770=function(){
this.setNextHandler(_76d);
_76d.setNextHandler(_76e);
_76e.setNextHandler(_76f);
};
var _771=_770.prototype=new _516();
_771.processConnect=function(_772,_773,_774){
var _775=[_53f.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_774.length;i++){
_775.push(_774[i]);
}
var _777=_772._extensions;
if(_777.length>0){
_772.requestHeaders.push(new _4e5(_53f.HEADER_SEC_EXTENSIONS,_777.join(";")));
}
this._nextHandler.processConnect(_772,_773,_775);
};
_771.setNextHandler=function(_778){
this._nextHandler=_778;
var _779=new _529(this);
_778.setListener(_779);
};
_771.setListener=function(_77a){
this._listener=_77a;
};
return _770;
})();
var _77b=(function(){
var _77c;
var _77d=function(){
_77c=this;
};
var _77e=_77d.prototype=new _516();
_77e.processConnect=function(_77f,uri,_781){
if(_77f.readyState==2){
throw new Error("WebSocket is already closed");
}
var _782=new _334();
_782.parent=_77f;
_77f._delegate=_782;
_783(_782,this);
_782.connect(uri.toString(),_781);
};
_77e.processTextMessage=function(_784,text){
if(_784.readyState==1){
_784._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_77e.processBinaryMessage=function(_786,_787){
if(_786.readyState==1){
_786._delegate.send(_787);
}else{
throw new Error("WebSocket is already closed");
}
};
_77e.processClose=function(_788,code,_78a){
_788._delegate.close(code,_78a);
};
var _783=function(_78b,_78c){
var _78d=new _529(_78c);
_78d.redirected=function(_78e,_78f){
_78e._redirectUri=_78f;
};
_78b.setListener(_78d);
};
return _77d;
})();
var _790=(function(){
var _791=function(){
var _792=new _721();
return _792;
};
var _793=function(){
var _794=new _559();
return _794;
};
var _795=function(){
var _796=new _77b();
return _796;
};
var _797=_791();
var _798=_793();
var _799=_795();
var _79a=function(){
this.setNextHandler(_797);
_797.setNextHandler(_798);
_798.setNextHandler(_799);
};
var _79b=function(_79c,_79d){
};
var _79e=_79a.prototype=new _516();
_79e.setNextHandler=function(_79f){
this._nextHandler=_79f;
var _7a0=new _529(this);
_79f.setListener(_7a0);
};
_79e.setListener=function(_7a1){
this._listener=_7a1;
};
return _79a;
})();
var _7a2=(function(){
var _7a3=function(){
};
var _7a4=_7a3.prototype=new _516();
_7a4.processConnect=function(_7a5,uri,_7a7){
if(_7a5.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
this._nextHandler.processConnect(_7a5,uri,_7a7);
};
_7a4.handleConnectionOpened=function(_7a8,_7a9){
var _7aa=_7a8;
if(_7aa.readyState==WebSocket.CONNECTING){
_7aa.readyState=WebSocket.OPEN;
this._listener.connectionOpened(_7a8,_7a9);
}
};
_7a4.handleMessageReceived=function(_7ab,_7ac){
if(_7ab.readyState!=WebSocket.OPEN){
return;
}
this._listener.textMessageReceived(_7ab,_7ac);
};
_7a4.handleBinaryMessageReceived=function(_7ad,_7ae){
if(_7ad.readyState!=WebSocket.OPEN){
return;
}
this._listener.binaryMessageReceived(_7ad,_7ae);
};
_7a4.handleConnectionClosed=function(_7af,_7b0,code,_7b2){
var _7b3=_7af;
if(_7b3.readyState!=WebSocket.CLOSED){
_7b3.readyState=WebSocket.CLOSED;
this._listener.connectionClosed(_7af,_7b0,code,_7b2);
}
};
_7a4.handleConnectionFailed=function(_7b4){
if(_7b4.readyState!=WebSocket.CLOSED){
_7b4.readyState=WebSocket.CLOSED;
this._listener.connectionFailed(_7b4);
}
};
_7a4.handleConnectionError=function(_7b5,e){
this._listener.connectionError(_7b5,e);
};
_7a4.setNextHandler=function(_7b7){
this._nextHandler=_7b7;
var _7b8={};
var _7b9=this;
_7b8.connectionOpened=function(_7ba,_7bb){
_7b9.handleConnectionOpened(_7ba,_7bb);
};
_7b8.redirected=function(_7bc,_7bd){
throw new Error("invalid event received");
};
_7b8.authenticationRequested=function(_7be,_7bf,_7c0){
throw new Error("invalid event received");
};
_7b8.textMessageReceived=function(_7c1,buf){
_7b9.handleMessageReceived(_7c1,buf);
};
_7b8.binaryMessageReceived=function(_7c3,buf){
_7b9.handleBinaryMessageReceived(_7c3,buf);
};
_7b8.connectionClosed=function(_7c5,_7c6,code,_7c8){
_7b9.handleConnectionClosed(_7c5,_7c6,code,_7c8);
};
_7b8.connectionFailed=function(_7c9){
_7b9.handleConnectionFailed(_7c9);
};
_7b8.connectionError=function(_7ca,e){
_7b9.handleConnectionError(_7ca,e);
};
_7b7.setListener(_7b8);
};
_7a4.setListener=function(_7cc){
this._listener=_7cc;
};
return _7a3;
})();
var _7cd=(function(){
var _7ce=function(_7cf,_7d0,_7d1){
this._nativeEquivalent=_7cf;
this._handler=_7d0;
this._channelFactory=_7d1;
};
return _7ce;
})();
var _7d2=(function(){
var _7d3="javascript:ws";
var _7d4="javascript:wss";
var _7d5="javascript:wse";
var _7d6="javascript:wse+ssl";
var _7d7="flash:wse";
var _7d8="flash:wse+ssl";
var _7d9="flash:wsr";
var _7da="flash:wsr+ssl";
var _7db={};
var _7dc={};
var _7dd=new _54e();
var _7de=new _547();
var _7df=true;
var _7e0={};
if(Object.defineProperty){
try{
Object.defineProperty(_7e0,"prop",{get:function(){
return true;
}});
_7df=false;
}
catch(e){
}
}
var _7e1=function(){
this._handlerListener=createListener(this);
this._nativeHandler=createNativeHandler(this);
this._emulatedHandler=createEmulatedHandler(this);
this._emulatedFlashHandler=createFlashEmulatedHandler(this);
this._rtmpFlashHandler=createFlashRtmpHandler(this);
pickStrategies();
_7db[_7d3]=new _7cd("ws",this._nativeHandler,_7dd);
_7db[_7d4]=new _7cd("wss",this._nativeHandler,_7dd);
_7db[_7d5]=new _7cd("ws",this._emulatedHandler,_7de);
_7db[_7d6]=new _7cd("wss",this._emulatedHandler,_7de);
_7db[_7d7]=new _7cd("ws",this._emulatedFlashHandler,_7de);
_7db[_7d8]=new _7cd("wss",this._emulatedFlashHandler,_7de);
_7db[_7d9]=new _7cd("ws",this._rtmpFlashHandler,_7de);
_7db[_7da]=new _7cd("wss",this._rtmpFlashHandler,_7de);
};
function isIE6orIE7(){
if(browser!="ie"){
return false;
}
var _7e2=navigator.appVersion;
return (_7e2.indexOf("MSIE 6.0")>=0||_7e2.indexOf("MSIE 7.0")>=0);
};
function isXdrDisabledonIE8IE9(){
if(browser!="ie"){
return false;
}
var _7e3=navigator.appVersion;
return ((_7e3.indexOf("MSIE 8.0")>=0||_7e3.indexOf("MSIE 9.0")>=0)&&typeof (XDomainRequest)==="undefined");
};
function pickStrategies(){
if(isIE6orIE7()||isXdrDisabledonIE8IE9()){
_7dc["ws"]=new Array(_7d3,_7d7,_7d5);
_7dc["wss"]=new Array(_7d4,_7d8,_7d6);
}else{
_7dc["ws"]=new Array(_7d3,_7d5);
_7dc["wss"]=new Array(_7d4,_7d6);
}
};
function createListener(_7e4){
var _7e5={};
_7e5.connectionOpened=function(_7e6,_7e7){
_7e4.handleConnectionOpened(_7e6,_7e7);
};
_7e5.binaryMessageReceived=function(_7e8,buf){
_7e4.handleMessageReceived(_7e8,buf);
};
_7e5.textMessageReceived=function(_7ea,text){
var _7ec=_7ea.parent;
_7ec._webSocketChannelListener.handleMessage(_7ec._webSocket,text);
};
_7e5.connectionClosed=function(_7ed,_7ee,code,_7f0){
_7e4.handleConnectionClosed(_7ed,_7ee,code,_7f0);
};
_7e5.connectionFailed=function(_7f1){
_7e4.handleConnectionFailed(_7f1);
};
_7e5.connectionError=function(_7f2,e){
_7e4.handleConnectionError(_7f2,e);
};
_7e5.authenticationRequested=function(_7f4,_7f5,_7f6){
};
_7e5.redirected=function(_7f7,_7f8){
};
_7e5.onBufferedAmountChange=function(_7f9,n){
_7e4.handleBufferedAmountChange(_7f9,n);
};
return _7e5;
};
function createNativeHandler(_7fb){
var _7fc=new _7a2();
var _7fd=new _666();
_7fc.setListener(_7fb._handlerListener);
_7fc.setNextHandler(_7fd);
return _7fc;
};
function createEmulatedHandler(_7fe){
var _7ff=new _7a2();
var _800=new _740();
_7ff.setListener(_7fe._handlerListener);
_7ff.setNextHandler(_800);
return _7ff;
};
function createFlashEmulatedHandler(_801){
var _802=new _7a2();
var _803=new _766();
_802.setListener(_801._handlerListener);
_802.setNextHandler(_803);
return _802;
};
function createFlashRtmpHandler(_804){
var _805=new _7a2();
var _806=new _790();
_805.setListener(_804._handlerListener);
_805.setNextHandler(_806);
return _805;
};
var _807=function(_808,_809){
var _80a=_7db[_809];
var _80b=_80a._channelFactory;
var _80c=_808._location;
var _80d=_80b.createChannel(_80c,_808._protocol);
_808._selectedChannel=_80d;
_80d.parent=_808;
_80d._extensions=_808._extensions;
_80d._handler=_80a._handler;
_80d._handler.processConnect(_808._selectedChannel,_80c,_808._protocol);
};
var _80e=_7e1.prototype;
_80e.fallbackNext=function(_80f){
var _810=_80f.getNextStrategy();
if(_810==null){
this.doClose(_80f,false,1006,"");
}else{
_807(_80f,_810);
}
};
_80e.doOpen=function(_811,_812){
if(_811.readyState===WebSocket.CONNECTING){
_811.readyState=WebSocket.OPEN;
if(_7df){
_811._webSocket.readyState=WebSocket.OPEN;
}
_811._webSocketChannelListener.handleOpen(_811._webSocket,_812);
}
};
_80e.doClose=function(_813,_814,code,_816){
if(_813.readyState===WebSocket.CONNECTING||_813.readyState===WebSocket.OPEN||_813.readyState===WebSocket.CLOSING){
_813.readyState=WebSocket.CLOSED;
if(_7df){
_813._webSocket.readyState=WebSocket.CLOSED;
}
_813._webSocketChannelListener.handleClose(_813._webSocket,_814,code,_816);
}
};
_80e.doBufferedAmountChange=function(_817,n){
_817._webSocketChannelListener.handleBufferdAmountChange(_817._webSocket,n);
};
_80e.processConnect=function(_819,_81a,_81b){
var _81c=_819;
if(_81c.readyState===WebSocket.OPEN){
throw new Error("Attempt to reconnect an existing open WebSocket to a different location");
}
var _81d=_81c._compositeScheme;
if(_81d!="ws"&&_81d!="wss"){
var _81e=_7db[_81d];
if(_81e==null){
throw new Error("Invalid connection scheme: "+_81d);
}
_81c._connectionStrategies.push(_81d);
}else{
var _81f=_7dc[_81d];
if(_81f!=null){
for(var i=0;i<_81f.length;i++){
_81c._connectionStrategies.push(_81f[i]);
}
}else{
throw new Error("Invalid connection scheme: "+_81d);
}
}
this.fallbackNext(_81c);
};
_80e.processTextMessage=function(_821,_822){
var _823=_821;
if(_823.readyState!=WebSocket.OPEN){
throw new Error("Attempt to post message on unopened or closed web socket");
}
var _824=_823._selectedChannel;
_824._handler.processTextMessage(_824,_822);
};
_80e.processBinaryMessage=function(_825,_826){
var _827=_825;
if(_827.readyState!=WebSocket.OPEN){
throw new Error("Attempt to post message on unopened or closed web socket");
}
var _828=_827._selectedChannel;
_828._handler.processBinaryMessage(_828,_826);
};
_80e.processClose=function(_829,code,_82b){
var _82c=_829;
if(typeof code!="undefined"){
if(code!=1000&&(code<3000||code>4999)){
var _82d=Error("code must equal to 1000 or in range 3000 to 4999");
_82d.name="InvalidAccessError";
throw _82d;
}
}
if(typeof _82b!="undefined"&&_82b.length>0){
var buf=new ByteBuffer();
buf.putString(_82b,Charset.UTF8);
buf.flip();
if(buf.remaining()>123){
throw new SyntaxError("SyntaxError: reason is longer than 123 bytes");
}
}
if(_829.readyState===WebSocket.CONNECTING||_829.readyState===WebSocket.OPEN){
_829.readyState=WebSocket.CLOSING;
if(_7df){
_829._webSocket.readyState=WebSocket.CLOSING;
}
var _82f=_82c._selectedChannel;
_82f._handler.processClose(_82f,code,_82b);
}
};
_80e.setListener=function(_830){
this._listener=_830;
};
_80e.handleConnectionOpened=function(_831,_832){
var _833=_831.parent;
this.doOpen(_833,_832);
};
_80e.handleMessageReceived=function(_834,obj){
var _836=_834.parent;
switch(_836.readyState){
case WebSocket.OPEN:
if(_836._webSocket.binaryType==="blob"&&obj.constructor==ByteBuffer){
obj=obj.getBlob(obj.remaining());
}else{
if(_836._webSocket.binaryType==="arraybuffer"&&obj.constructor==ByteBuffer){
obj=obj.getArrayBuffer(obj.remaining());
}else{
if(_836._webSocket.binaryType==="blob"&&obj.byteLength){
obj=new Blob([new Uint8Array(obj)]);
}else{
if(_836._webSocket.binaryType==="bytebuffer"&&obj.byteLength){
var u=new Uint8Array(obj);
var _838=[];
for(var i=0;i<u.byteLength;i++){
_838.push(u[i]);
}
obj=new ByteBuffer(_838);
}else{
if(_836._webSocket.binaryType==="bytebuffer"&&obj.size){
var cb=function(_83b){
var b=new ByteBuffer();
b.putBytes(_83b);
b.flip();
_836._webSocketChannelListener.handleMessage(_836._webSocket,b);
};
BlobUtils.asNumberArray(cb,data);
return;
}
}
}
}
}
_836._webSocketChannelListener.handleMessage(_836._webSocket,obj);
break;
case WebSocket.CONNECTING:
case WebSocket.CLOSING:
case WebSocket.CLOSED:
break;
default:
throw new Error("Socket has invalid readyState: "+$this.readyState);
}
};
_80e.handleConnectionClosed=function(_83d,_83e,code,_840){
var _841=_83d.parent;
if(_841.readyState===WebSocket.CONNECTING&&!_83d.authenticationReceived){
this.fallbackNext(_841);
}else{
this.doClose(_841,_83e,code,_840);
}
};
_80e.handleConnectionFailed=function(_842){
var _843=_842.parent;
if(_843.readyState===WebSocket.CONNECTING&&!_842.authenticationReceived){
this.fallbackNext(_843);
}else{
this.doClose(_843,false,1006,"");
}
};
_80e.handleConnectionError=function(_844,e){
var _846=_844.parent;
_846._webSocketChannelListener.handleError(_846._webSocket,e);
};
return _7e1;
})();
(function(){
var _847=new _7d2();
window.WebSocket=(function(){
var _848={};
var _849=function(url,_84b,_84c){
this.url=url;
this.protocol=_84b;
this.extensions=_84c||[];
this._queue=[];
this._origin="";
this._eventListeners={};
setProperties(this);
_84d(this,this.url,this.protocol,this.extensions);
};
var _84e=function(s){
if(s.length==0){
return false;
}
var _850="()<>@,;:\\<>/[]?={}\t \n";
for(var i=0;i<s.length;i++){
var c=s.substr(i,1);
if(_850.indexOf(c)!=-1){
return false;
}
var code=s.charCodeAt(i);
if(code<33||code>126){
return false;
}
}
return true;
};
var _854=function(_855){
if(typeof (_855)==="undefined"){
return true;
}else{
if(typeof (_855)==="string"){
return _84e(_855);
}else{
for(var i=0;i<_855.length;i++){
if(!_84e(_855[i])){
return false;
}
}
return true;
}
}
};
var _84d=function(_857,_858,_859,_85a){
if(!_854(_859)){
throw new Error("SyntaxError: invalid protocol: "+_859);
}
var uri=new _502(_858);
if(!uri.isSecure()&&document.location.protocol==="https:"){
throw new Error("SecurityException: non-secure connection attempted from secure origin");
}
var _85c=[];
if(typeof (_859)!="undefined"){
if(typeof _859=="string"&&_859.length){
_85c=[_859];
}else{
if(_859.length){
_85c=_859;
}
}
}
_857._channel=new _554(uri,_85c);
_857._channel._webSocket=_857;
_857._channel._webSocketChannelListener=_848;
_857._channel._extensions=_85a;
_847.processConnect(_857._channel,uri.getWSEquivalent());
};
function setProperties(_85d){
_85d.onmessage=null;
_85d.onopen=null;
_85d.onclose=null;
_85d.onerror=null;
if(Object.defineProperty){
try{
Object.defineProperty(_85d,"readyState",{get:function(){
if(_85d._channel){
return _85d._channel.readyState;
}else{
return _849.CLOSED;
}
},set:function(){
throw new Error("Cannot set read only property readyState");
}});
var _85e="blob";
Object.defineProperty(_85d,"binaryType",{enumerable:true,configurable:true,get:function(){
return _85e;
},set:function(val){
if(val==="blob"||val==="arraybuffer"||val==="bytebuffer"){
_85e=val;
}else{
throw new SyntaxError("Invalid binaryType. Valid values are 'blob', 'arraybuffer' and 'bytebuffer'");
}
}});
Object.defineProperty(_85d,"bufferedAmount",{get:function(){
return _85d._channel.getBufferedAmount();
},set:function(){
throw new Error("Cannot set read only property bufferedAmount");
}});
}
catch(ex){
_85d.readyState=_849.CONNECTING;
_85d.binaryType="blob";
_85d.bufferedAmount=0;
}
}else{
_85d.readyState=_849.CONNECTING;
_85d.binaryType="blob";
_85d.bufferedAmount=0;
}
};
var _860=_849.prototype;
_860.send=function(data){
switch(this.readyState){
case 0:
throw new Error("Attempt to send message on unopened or closed WebSocket");
case 1:
if(typeof (data)==="string"){
_847.processTextMessage(this._channel,data);
}else{
_847.processBinaryMessage(this._channel,data);
}
break;
case 2:
case 3:
break;
default:
throw new Error("Illegal state error");
}
};
_860.close=function(code,_863){
switch(this.readyState){
case 0:
case 1:
_847.processClose(this._channel,code,_863);
break;
case 2:
case 3:
break;
default:
throw new Error("Illegal state error");
}
};
var _864=function(_865,data){
var _867=new MessageEvent(_865,data,_865._origin);
_865.dispatchEvent(_867);
};
var _868=function(_869){
var _86a=new Date().getTime();
var _86b=_86a+50;
while(_869._queue.length>0){
if(new Date().getTime()>_86b){
setTimeout(function(){
_868(_869);
},0);
return;
}
var buf=_869._queue.shift();
var ok=false;
try{
_864(_869,buf);
ok=true;
}
finally{
if(!ok){
if(_869._queue.length==0){
_869._delivering=false;
}else{
setTimeout(function(){
_868(_869);
},0);
}
}
}
}
_869._delivering=false;
};
var _86e=function(_86f,_870,code,_872){
delete _86f._channel;
setTimeout(function(){
var _873=new CloseEvent(_86f,_870,code,_872);
_86f.dispatchEvent(_873);
},0);
};
_848.handleOpen=function(_874,_875){
_874.protocol=_875;
var _876={type:"open",bubbles:true,cancelable:true,target:_874};
_874.dispatchEvent(_876);
};
_848.handleMessage=function(_877,obj){
if(!Object.defineProperty&&!(typeof (obj)==="string")){
var _879=_877.binaryType;
if(!(_879==="blob"||_879==="arraybuffer"||_879==="bytebuffer")){
var _87a={type:"error",bubbles:true,cancelable:true,target:_877,message:"Invalid binaryType. Valid values are 'blob', 'arraybuffer' and 'bytebuffer'"};
_877.dispatchEvent(_87a);
return;
}
}
_877._queue.push(obj);
if(!_877._delivering){
_877._delivering=true;
_868(_877);
}
};
_848.handleClose=function(_87b,_87c,code,_87e){
_86e(_87b,_87c,code,_87e);
};
_848.handleError=function(_87f,_880){
setTimeout(function(){
_87f.dispatchEvent(_880);
},0);
};
_848.handleBufferdAmountChange=function(_881,n){
_881.bufferedAmount=n;
};
_860.addEventListener=function(type,_884,_885){
this._eventListeners[type]=this._eventListeners[type]||[];
this._eventListeners[type].push(_884);
};
_860.removeEventListener=function(type,_887,_888){
var _889=this._eventListeners[type];
if(_889){
for(var i=0;i<_889.length;i++){
if(_889[i]==_887){
_889.splice(i,1);
return;
}
}
}
};
_860.dispatchEvent=function(e){
var type=e.type;
if(!type){
throw new Error("Cannot dispatch invalid event "+e);
}
try{
var _88d=this["on"+type];
if(typeof _88d==="function"){
_88d(e);
}
}
catch(e){
}
var _88e=this._eventListeners[type];
if(_88e){
for(var i=0;i<_88e.length;i++){
try{
_88e[i](e);
}
catch(e2){
}
}
}
};
_849.CONNECTING=_860.CONNECTING=0;
_849.OPEN=_860.OPEN=1;
_849.CLOSING=_860.CLOSING=2;
_849.CLOSED=_860.CLOSED=3;
return _849;
})();
window.WebSocket.__impls__={};
window.WebSocket.__impls__["flash:wse"]=_304;
}());
(function(){
window.WebSocketExtension=(function(){
var _890=function(name){
this.name=name;
this.parameters={};
this.enabled=false;
this.negotiated=false;
};
var _892=_890.prototype;
_892.getParameter=function(_893){
return this.parameters[_893];
};
_892.setParameter=function(_894,_895){
this.parameters[_894]=_895;
};
_892.getParameters=function(){
var arr=[];
for(var name in this.parameters){
if(this.parameters.hasOwnProperty(name)){
arr.push(name);
}
}
return arr;
};
_892.parse=function(str){
var arr=str.split(";");
if(arr[0]!=this.name){
throw new Error("Error: name not match");
}
this.parameters={};
for(var i=1;i<arr.length;i++){
var _89b=arr[i].indexOf("=");
this.parameters[arr[i].subString(0,_89b)]=arr[i].substring(_89b+1);
}
};
_892.toString=function(){
var arr=[this.name];
for(var p in this.parameters){
if(this.parameters.hasOwnProperty(p)){
arr.push(p.name+"="+this.parameters[p]);
}
}
return arr.join(";");
};
return _890;
})();
})();
(function(){
window.WebSocketRevalidateExtension=(function(){
var _89e=function(){
};
var _89f=_89e.prototype=new WebSocketExtension(_53f.KAAZING_SEC_EXTENSION_REVALIDATE);
return _89e;
})();
})();
(function(){
window.WebSocketFactory=(function(){
var _8a0=function(){
this.extensions={};
var _8a1=new WebSocketRevalidateExtension();
this.extensions[_8a1.name]=_8a1;
};
var _8a2=_8a0.prototype;
_8a2.getExtension=function(name){
return this.extensions[name];
};
_8a2.setExtension=function(_8a4){
this.extensions[_8a4.name]=_8a4;
};
_8a2.setChallengeHandler=function(_8a5){
this.challengeHandler=_8a5;
var _8a6=this.extensions[_53f.KAAZING_SEC_EXTENSION_REVALIDATE];
_8a6.enabled=(_8a5!=null);
};
_8a2.getChallengeHandler=function(){
return this.challengeHandler;
};
_8a2.createWebSocket=function(url,_8a8){
var ext=[];
for(var key in this.extensions){
if(this.extensions.hasOwnProperty(key)&&this.extensions[key].enabled){
ext.push(this.extensions[key].toString());
}
}
var ws=new WebSocket(url,_8a8,ext);
if(typeof (this.challengeHandler)!="undefined"){
ws._channel.challengeHandler=this.challengeHandler;
}
return ws;
};
return _8a0;
})();
})();
window.___Loader=new _39a(_269);
})();
})();
