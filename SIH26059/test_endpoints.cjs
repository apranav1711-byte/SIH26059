const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/ui.js','utf8'),handlers={},elements={};
const state={scenario:{start:[4,18],goal:[39,11],land:Array.from({length:30},()=>Array(44).fill(false))},result:{},mapMode:'region',plotBox:{x:35,y:72,w:440,h:300},view:{zoom:2,x:12,y:-8},placing:null,pointer:null,dragged:false,cursor:[0,0],draws:0,runs:0,
 $:id=>elements[id]??(elements[id]={}),stop(){},toast(){},dirty(){},updateInputs(){},drawMap(){state.draws++},calculate(){state.runs++},inspectCell(){},setMapMode(){},
 mapCanvas:{style:{},getBoundingClientRect:()=>({left:10,top:20,width:600,height:510}),setPointerCapture(){},addEventListener:(name,fn)=>handlers[name]=fn}};
vm.createContext(state);
vm.runInContext(source.slice(source.indexOf('function cellFrom('),source.indexOf('function inspectCell('))+source.slice(source.indexOf('function validEndpoint('),source.indexOf("mapCanvas.addEventListener('wheel'")),state);
function event([x,y]){const b=state.mapCanvas.getBoundingClientRect(),v=state.view,p=state.plotBox;return {button:0,pointerId:1,clientX:b.left+(p.x+x/43*p.w-b.width/2)*v.zoom+b.width/2+v.x,clientY:b.top+(p.y+y/29*p.h-b.height/2)*v.zoom+b.height/2+v.y}}
for(const [key,to] of [['start',[7,16]],['goal',[36,9]]]){const pan={...state.view};handlers.pointerdown(event(state.scenario[key]));handlers.pointermove(event(to));assert.deepEqual(Array.from(state.scenario[key]),to,'marker previews while dragging');handlers.pointerup(event(to));assert.deepEqual(Array.from(state.scenario[key]),to);assert.deepEqual(state.view,pan,'dragging marker must not pan')}
assert.equal(state.runs,2,'one calculation per release');
const original=Array.from(state.scenario.start);state.scenario.land[2][2]=true;handlers.pointerdown(event(original));handlers.pointermove(event([2,2]));handlers.pointerup(event([2,2]));assert.deepEqual(Array.from(state.scenario.start),original);assert.equal(state.runs,2,'invalid drop must not calculate');
handlers.pointerdown(event(original));handlers.pointermove(event([8,8]));handlers.pointercancel();assert.deepEqual(Array.from(state.scenario.start),original,'cancel restores marker');
state.placing='goal';state.placeOrInspect([30,10]);assert.deepEqual(Array.from(state.scenario.goal),[30,10]);assert.equal(state.placing,null);
assert.equal(state.applyEndpoints([-1,0],[30,10]),false);assert.equal(state.applyEndpoints([2,2],[30,10]),false);
assert.equal(state.applyEndpoints([5,5],[20,10]),true);
// Exercise the real calculation queue with a pending response.
state.loading=true;state.calculateQueued=false;
vm.runInContext(source.slice(source.indexOf('async function calculate('),source.indexOf('function refresh(')),state);
state.calculate();assert.equal(state.calculateQueued,true,'an edit during a run must queue another calculation');
console.log('Endpoint drag, click, coordinate validation, cancellation, zoom/pan and calculation queue checks passed.');
