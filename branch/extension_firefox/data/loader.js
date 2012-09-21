function injectJs(srcFile) {
    var scr = document.createElement('script');
    scr.src = srcFile;
    document.getElementsByTagName('head')[0].appendChild(scr);
}
try{
injectJs("out.js");
}catch(e){
alert(e);
}
