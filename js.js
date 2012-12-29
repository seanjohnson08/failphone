function $(a){return document.getElementById(a);}
function debug(a){$('debug').innerHTML=a;}
var failphone=new function(){
    var me=this
    me.drawArea={
        create:function(cvs){
            me.cvs=cvs
            cvs.height='260';cvs.width='260';
            cvs.ctx=cvs.getContext("2d")
            cvs.normalizeCoords=function(e){
                if(e.preventDefault) e.preventDefault();
                e.returnValue=false
                return {x:e.clientX-cvs.offsetLeft,y:e.clientY-cvs.offsetTop}
            }
            cvs.ctx.pixelMatches=function(id,x1,y1,color) {
             var idx=(x1+y1*cvs.width)*4
             return id.data[idx]==color[0]&&id.data[idx+1]==color[1]&&id.data[idx+2]==color[2]&&id.data[idx+3]==color[3];
            }
            cvs.ctx.saveState=function(){
             if(!cvs.saveStates) cvs.saveStates=[]
             cvs.saveStates.push(cvs.toDataURL())
             while(cvs.saveStates.length>5) cvs.saveStates.shift()
            }
            cvs.ctx.restoreState=function(){
                cvs.ctx.clearRect(0,0,cvs.width,cvs.height)
                var img=new Image;
                img.onload=function(){
                    cvs.ctx.drawImage(this,0,0)
                }
                img.src=cvs.saveStates.pop()
            }
            cvs.ctx.fill=function(x,y,color){
                var id=cvs.ctx.getImageData(0,0,cvs.width,cvs.height),
                    oy=y,idx=(x+y*cvs.width)*4,q=[[x,y]],i,om=0,limit=0,colorat=[id.data[idx],id.data[idx+1],id.data[idx+2],id.data[idx+3]]
                if(colorat[0]==color[0]&&colorat[1]==color[1]&&colorat[2]==color[2]) return
                //move to the top of the column
                while(q.length) {
                    var cr=false,cl=false,marker=0
                    limit++
                    if(limit>1000) break;
                x=q[0][0];y=q[0][1];
                q.shift()
                while(y>0&&cvs.ctx.pixelMatches(id,x,y-1,colorat)) y--
                while(y<cvs.height&&cvs.ctx.pixelMatches(id,x,y+1,colorat)||!marker++) {
                 if(x<cvs.width-1) {if(cvs.ctx.pixelMatches(id,x+1,y,colorat)) {
                  if(!cr) q.push([x+1,y]);cr=true;
                 } else {cr=false;}}
                 if(x>0) {if(cvs.ctx.pixelMatches(id,x-1,y,colorat)) {
                  if(!cl)q.push([x-1,y]);cl=true;
                 } else {cl=false;}}
                 idx=(x+y*cvs.width)*4
                 id.data[idx]=color[0];id.data[idx+1]=color[1];id.data[idx+2]=color[2];
                 id.data[idx+3]=255
                 y++
                }
                 cvs.ctx.putImageData(id,0,0)
                }
            }
            cvs.onmousedown=function(e){
                this.ctx.saveState()
                e=this.normalizeCoords(e||event)
                if(this.tool=='fill') {
                    this.ctx.fill(e.x,e.y,getRGB(cvs.drawColor))
                    return
                }
                this.drawing=true
                if(this.tool=='eraser') {
                    this.ctx.lineWidth='10'
                } else {
                    this.ctx.strokeStyle=this.drawColor
                    this.ctx.lineWidth='1'
                }
                this.ctx.moveTo(e.x,e.y)
                this.ctx.beginPath()
                document.onmouseup=function(){
                    cvs.drawing=false;
                    document.onmouseup=function(){}
                }
            }
            cvs.onmousemove=function(e){
                e=cvs.normalizeCoords(e||window.event)
                if(this.drawing) {
                    this.ctx.lineTo(e.x,e.y)
                    this.ctx.stroke()
                }
            }
            cvs.tools=function(){
                var tools=document.createElement('div')
                tools.className='tools'
                tools.setTool=function(tool){
                    cvs.tool=tool
                    var divs=this.getElementsByTagName('div')
                    for(var x=0;x<divs.length;x++) {
                        if(divs[x].className.match('tool')) {
                            if(divs[x].className.match(tool)) {
                                if(!divs[x].className.match('selected')) divs[x].className+=' selected';
                            } else divs[x].className=divs[x].className.replace(' selected','')
                        }
                    }
                }
                tools.setColor=function(color){
                    cvs.drawColor=color
                    var divs=this.getElementsByTagName('div')
                    for(var x=0;x<divs.length;x++) {
                        if(divs[x].className.match('color')) divs[x].className='color'+(divs[x].style.backgroundColor==color?' selected':'')
                    }
                }
                var colors=['#000',   '#FFF'   ,'#880015','#b97a57','#ff7f27','#ffc90e','#22b14c','#b5e61d','#3f48cc','#7092be',
                            '#7f7f7f','#c3c3c3','#ed1c24','#ffaec9','#fff200','#efe4b0','#00a2e8','#99d9ea','#a349a4','#c8bfe7']
                for(var x=0;x<colors.length;x++) {
                    var color=document.createElement('div')
                    color.style.background=colors[x]
                    color.className='color'
                    color.onclick=function(){tools.setColor(this.style.backgroundColor);}
                    tools.appendChild(color)
                }
                
                var eraser=document.createElement('div')
                eraser.onclick=function(){tools.setTool('eraser');}
                eraser.className='tool eraser'
                
                var brush=document.createElement('div')
                brush.onclick=function(){tools.setTool('brush');}
                brush.className='tool brush'
                
                var fill=document.createElement('div')
                fill.onclick=function(){tools.setTool('fill');}
                fill.className='tool fill'
                
                var undo=document.createElement('div')
                undo.onclick=function(){cvs.ctx.restoreState();}
                undo.className='tool undo'
                
                tools.appendChild(eraser)
                tools.appendChild(brush)
                tools.appendChild(fill)
                tools.appendChild(undo)
                tools.style.position='absolute'
                tools.style.top=cvs.offsetTop+'px'
                tools.style.left=cvs.clientWidth+cvs.offsetLeft+'px'
                tools.setTool('brush')
                document.body.appendChild(tools)
            }()
        }
    }
    me.save=function(gameid){
        var rqst=new XMLHttpRequest
        rqst.open('POST','submit.php')
        rqst.setRequestHeader("Content-type","application/x-www-form-urlencoded")
        rqst.onreadystatechange=function(){
            if(rqst.readyState==4) document.location.reload()
        }
        rqst.send('data='+encodeURIComponent(this.cvs.toDataURL())+'&game='+gameid)
    }
    
}
function getRGB(color){
 if(color.match(/rgb\( *(\d+), *(\d+), *(\d+)\)/)) return [RegExp.$1,RegExp.$2,RegExp.$3]
 else return [0,0,0]
}
failphone.drawArea.create($('draw'))

function touchHandler(event)
{

    var touches = event.changedTouches,
        first = touches[0],
        type = "";

         switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; event.preventDefault();break;        
        case "touchend":   type="mouseup"; break;
        default: return;
    }

             //initMouseEvent(type, canBubble, cancelable, view, clickCount,
    //           screenX, screenY, clientX, clientY, ctrlKey,
    //           altKey, shiftKey, metaKey, button, relatedTarget);
    
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
                              first.screenX, first.screenY,
                              first.clientX, first.clientY, false,
                              false, false, false, 0/*left*/, null);

                                                                                 first.target.dispatchEvent(simulatedEvent);
}

function init()
{
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}

init()

window.onorientationchange=function(){if(window.orientation!=0) alert("This app is unusable in landscape mode, please turn it straight up!");}