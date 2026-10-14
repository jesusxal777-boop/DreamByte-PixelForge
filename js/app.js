(() => {
'use strict';
const canvas=document.querySelector('#pixel-canvas');
const ctx=canvas.getContext('2d',{willReadFrequently:true});
const colorInput=document.querySelector('#color-input');
const hexInput=document.querySelector('#hex-input');
const sizeSelect=document.querySelector('#canvas-size');
const gridToggle=document.querySelector('#grid-toggle');
const undoButton=document.querySelector('#undo-button');
const redoButton=document.querySelector('#redo-button');
const hint=document.querySelector('#canvas-hint');
const toast=document.querySelector('#toast');
let color=colorInput.value.toUpperCase(),tool='pencil',drawing=false,history=[],historyIndex=-1;
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove('show'),2200)}
function buttons(){undoButton.disabled=historyIndex<=0;redoButton.disabled=historyIndex>=history.length-1}
function snapshot(){history=history.slice(0,historyIndex+1);history.push(ctx.getImageData(0,0,canvas.width,canvas.height));if(history.length>60)history.shift();historyIndex=history.length-1;buttons()}
function restore(index){if(index<0||index>=history.length)return;historyIndex=index;ctx.putImageData(history[index],0,0);buttons()}
function point(e){const r=canvas.getBoundingClientRect();return{x:Math.floor((e.clientX-r.left)/r.width*canvas.width),y:Math.floor((e.clientY-r.top)/r.height*canvas.height)}}
function pixel(x,y){if(x<0||y<0||x>=canvas.width||y>=canvas.height)return;if(tool==='eraser')ctx.clearRect(x,y,1,1);else if(tool==='pencil'){ctx.fillStyle=color;ctx.fillRect(x,y,1,1)}}
function fill(x,y){const im=ctx.getImageData(0,0,canvas.width,canvas.height),d=im.data,w=canvas.width,h=canvas.height,start=(y*w+x)*4,target=[d[start],d[start+1],d[start+2],d[start+3]],rgb=color.match(/[\da-f]{2}/gi).map(v=>parseInt(v,16)),replacement=[rgb[0],rgb[1],rgb[2],255];if(target.every((v,i)=>v===replacement[i]))return;const matches=i=>d[i]===target[0]&&d[i+1]===target[1]&&d[i+2]===target[2]&&d[i+3]===target[3],stack=[[x,y]];while(stack.length){const p=stack.pop(),px=p[0],py=p[1];if(px<0||py<0||px>=w||py>=h)continue;const i=(py*w+px)*4;if(!matches(i))continue;d[i]=replacement[0];d[i+1]=replacement[1];d[i+2]=replacement[2];d[i+3]=255;stack.push([px+1,py],[px-1,py],[px,py+1],[px,py-1])}ctx.putImageData(im,0,0);snapshot()}
function draw(e){const p=point(e);if(tool==='picker'){const d=ctx.getImageData(p.x,p.y,1,1).data;if(d[3]){color='#'+[d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase();colorInput.value=color;hexInput.value=color}return}if(tool==='fill'){fill(p.x,p.y);return}pixel(p.x,p.y)}
document.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>{tool=b.dataset.tool;document.querySelectorAll('[data-tool]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});hint.textContent=({'pencil':'Lápiz seleccionado','eraser':'Borrador seleccionado','fill':'Cubeta seleccionada','picker':'Toca un píxel para copiar su color'})[tool]}));
canvas.addEventListener('pointerdown',e=>{e.preventDefault();if(tool==='picker'||tool==='fill'){draw(e);return}drawing=true;canvas.setPointerCapture(e.pointerId);snapshot();draw(e)});
canvas.addEventListener('pointermove',e=>{if(drawing)draw(e)});function end(){drawing=false}canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
colorInput.addEventListener('input',()=>{color=colorInput.value.toUpperCase();hexInput.value=color});
hexInput.addEventListener('change',()=>{if(/^#[0-9a-fA-F]{6}$/.test(hexInput.value.trim())){color=hexInput.value.trim().toUpperCase();colorInput.value=color}else{hexInput.value=color;notify('Usa un color HEX como #35B9FF')}});
document.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>{color=b.dataset.color;colorInput.value=color;hexInput.value=color}));
gridToggle.addEventListener('change',()=>{canvas.style.outline=gridToggle.checked?'1px solid #24445f':'none';canvas.style.outlineOffset=gridToggle.checked?'0':'0'});
sizeSelect.addEventListener('change',()=>{const size=Number(sizeSelect.value);if(confirm('Cambiar el tamaño y crear un lienzo vacío?')){canvas.width=size;canvas.height=size;ctx.clearRect(0,0,size,size);history=[];historyIndex=-1;snapshot();document.querySelector('#dimensions-label').textContent=size+' × '+size+' px'}else sizeSelect.value=String(canvas.width)});
undoButton.addEventListener('click',()=>restore(historyIndex-1));redoButton.addEventListener('click',()=>restore(historyIndex+1));
document.querySelector('#new-project').addEventListener('click',()=>{if(confirm('Crear un lienzo nuevo? Exporta primero tu dibujo si quieres conservarlo.')){ctx.clearRect(0,0,canvas.width,canvas.height);snapshot();notify('Nuevo lienzo listo')}});
document.querySelector('#export-png').addEventListener('click',()=>{const out=document.createElement('canvas');out.width=canvas.width;out.height=canvas.height;out.getContext('2d').drawImage(canvas,0,0);const a=document.createElement('a');a.download='dreambyte-sprite-'+canvas.width+'x'+canvas.height+'.png';a.href=out.toDataURL('image/png');a.click();notify('PNG exportado')});
document.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea'))return;const k=e.key.toLowerCase();if((e.ctrlKey||e.metaKey)&&k==='z'){e.preventDefault();restore(historyIndex+(e.shiftKey?1:-1))}else if(k==='b')document.querySelector('[data-tool=pencil]').click();else if(k==='e')document.querySelector('[data-tool=eraser]').click();else if(k==='g')document.querySelector('[data-tool=fill]').click();else if(k==='i')document.querySelector('[data-tool=picker]').click()});
snapshot();
})();