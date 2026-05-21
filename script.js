// ============================================================
// DADOS MUSICAIS
// ============================================================
const NOTAS = [];
const naturais = [
  { nota: ['Do'],  cifra: ['C'],  hz: 261.63 },
  { nota: ['Re'],  cifra: ['D'],  hz: 293.66 },
  { nota: ['Mi'],  cifra: ['E'],  hz: 329.63 },
  { nota: ['Fa'],  cifra: ['F'],  hz: 349.23 },
  { nota: ['Sol'], cifra: ['G'],  hz: 392.00 },
  { nota: ['La'],  cifra: ['A'],  hz: 440.00 },
  { nota: ['Si'],  cifra: ['B'],  hz: 493.88 }
];
const acidentes = [
  { nota: ['Do♯','Re♭'],  cifra: ['C♯','D♭'], hz: 277.18 },
  { nota: ['Re♯','Mi♭'],  cifra: ['D♯','E♭'], hz: 311.13 },
  { nota: ['Fa♯','Sol♭'], cifra: ['F♯','G♭'], hz: 369.99 },
  { nota: ['Sol♯','La♭'], cifra: ['G♯','A♭'], hz: 415.30 },
  { nota: ['La♯','Si♭'],  cifra: ['A♯','B♭'], hz: 466.16 }
];
const enarmonicos = [
  { nota:'Si♯',   cifra:'B♯',   hz:261.63 }, { nota:'Fa♭',   cifra:'F♭',   hz:329.63 },
  { nota:'Mi♯',   cifra:'E♯',   hz:349.23 }, { nota:'Do♭',   cifra:'C♭',   hz:493.88 },
  { nota:'Do♯♯',  cifra:'C♯♯',  hz:293.66 }, { nota:'Re♯♯',  cifra:'D♯♯',  hz:329.63 },
  { nota:'Mi♯♯',  cifra:'E♯♯',  hz:369.99 }, { nota:'Fa♯♯',  cifra:'F♯♯',  hz:392.00 },
  { nota:'Sol♯♯', cifra:'G♯♯',  hz:440.00 }, { nota:'La♯♯',  cifra:'A♯♯',  hz:493.88 },
  { nota:'Si♯♯',  cifra:'B♯♯',  hz:277.18 }, { nota:'Do♭♭',  cifra:'C♭♭',  hz:466.16 },
  { nota:'Re♭♭',  cifra:'D♭♭',  hz:261.63 }, { nota:'Mi♭♭',  cifra:'E♭♭',  hz:293.66 },
  { nota:'Fa♭♭',  cifra:'F♭♭',  hz:311.13 }, { nota:'Sol♭♭', cifra:'G♭♭',  hz:349.23 },
  { nota:'La♭♭',  cifra:'A♭♭',  hz:392.00 }, { nota:'Si♭♭',  cifra:'B♭♭',  hz:440.00 }
];
NOTAS.push(...[...naturais,...acidentes].sort((a,b)=>a.hz-b.hz));
enarmonicos.forEach(e=>{ const t=NOTAS.find(n=>n.hz===e.hz); t&&(t.nota.push(e.nota),t.cifra.push(e.cifra)); });

// ============================================================
// ESCALAS / ACORDES
// ============================================================
const ST=1,T=2,TST=3;
const ESCALAS={
  maior:[T,T,ST,T,T,T,ST], menor:[T,ST,T,T,ST,T,T],
  menorHarmonica:[T,ST,T,T,ST,TST,ST], menorMelodica:[T,ST,T,T,T,T,ST]
};
const ACORDES={ triade:[1,3,5], tetrade:[1,3,5,7], tetrade_e_nona:[1,3,5,7,9] };

function gerarEscala(tonica,molde){
  let pos=NOTAS.findIndex(i=>i.nota.includes(tonica));
  const esc=[NOTAS[pos]];
  for(const p of molde){pos=(pos+p)%NOTAS.length;esc.push(NOTAS[pos]);}
  return esc;
}
function gerarCifra(notas){
  const idx0=NOTAS.findIndex(i=>i.nota.includes(notas[0]));
  const ivs=notas.map(n=>(NOTAS.findIndex(i=>i.nota.includes(n))-idx0+12)%12);
  const cb=NOTAS[idx0].cifra[NOTAS[idx0].nota.indexOf(notas[0])];
  const tri={maior:ivs.includes(4)&&ivs.includes(7),menor:ivs.includes(3)&&ivs.includes(7),
    dim:ivs.includes(3)&&ivs.includes(6),aum:ivs.includes(4)&&ivs.includes(8)};
  let s='';
  if(tri.menor)s='m'; if(tri.dim)s='dim'; if(tri.aum)s='5+';
  if(ivs.includes(11))s+='7M';
  else if(ivs.includes(10)){s=tri.dim?'m7(♭5)':s+'7';}
  else if(ivs.includes(9)&&tri.dim)s='dim7';
  if(ivs.includes(2))s+='(9)';
  else if(ivs.includes(1))s+='(♭9)';
  return `${cb}${s}`;
}
function extrairAcorde(esc,molde,grau=1){
  const notas=molde.map(g=>esc[(grau-1+g-1)%7]);
  const numRomano = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][grau - 1];
  return `<b>Acorde: ${gerarCifra(notas).padEnd(8,'')}</b> <br /> Notas: [${notas.join(', ')}] <br />${numRomano}° grau do Campo Harmônico `;
}
function gerarCampoHarmonico(esc){
  return Array.from({length:7},(_,i)=>{
    const g=i+1;
    return `Grau ${g}:\nTríade  : ${extrairAcorde(esc,ACORDES.triade,g)}\nTétrade : ${extrairAcorde(esc,ACORDES.tetrade,g)}\nTétrade9: ${extrairAcorde(esc,ACORDES.tetrade_e_nona,g)}\n`;
  });
}
function leitorDeNotasCorretas(escalaBruta){
  const nomesBase=escalaBruta[0].nota.slice(0,2);
  const escalasCorretas=[];
  for(const nome of nomesBase){
    let indBase=naturais.findIndex(n=>nome.startsWith(n.nota[0]));
    const nomeada=escalaBruta.map(som=>{
      const baseEsp=naturais[indBase].nota[0];
      const correto=som.nota.find(n=>n.startsWith(baseEsp));
      indBase=(indBase+1)%naturais.length;
      return correto||som.nota[0];
    });
    escalasCorretas.push(nomeada);
    if(!nome.includes('♯')&&!nome.includes('♭'))break;
  }
  escalasCorretas.sort((a,b)=>{
    const da=a.some(n=>n&&n.includes('♯♯')),db=b.some(n=>n&&n.includes('♯♯'));
    return da&&!db?1:!da&&db?-1:0;
  });
  return escalasCorretas;
}

const NOMES_INTERVALOS_TEORICOS = {
  1: "Tônica",
  2: "Segunda", 
  3: "Terça",
  4: "Quarta",
  5: "Quinta",
  6: "Sexta",
  7: "Sétima",
  9: "Nona"
};

// ============================================================
// CRIAR OS ELEMENTOS DE TEXTO DOS DISCOS (Escala, Acordes, Intervalos)
// ============================================================
const wheelNotes=document.getElementById('wheel-notes');
for(let i=0;i<12;i++){
  const a=(i*30-90)*(Math.PI/180);
  const t=document.createElementNS('http://www.w3.org/2000/svg','text');
  t.setAttribute('x',120+75*Math.cos(a)); t.setAttribute('y',120+75*Math.sin(a));
  t.setAttribute('id',`note-text-${i}`); wheelNotes.appendChild(t);
}

const intervalNotes=document.getElementById('interval-notes');
const intervalRangeCircles=document.getElementById('interval-range-circles');
for(let i=0;i<12;i++){
  const a=(i*30-90)*(Math.PI/180);
  
  const t=document.createElementNS('http://www.w3.org/2000/svg','text');
  t.setAttribute('x',120+75*Math.cos(a)); t.setAttribute('y',120+75*Math.sin(a));
  t.setAttribute('id',`interval-text-${i}`); intervalNotes.appendChild(t);
  
  const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
  c.setAttribute('cx',120+75*Math.cos(a)); c.setAttribute('cy',120+75*Math.sin(a));
  c.setAttribute('r',14); c.setAttribute('fill','#128c7e');
  c.setAttribute('opacity','0'); c.style.transition='opacity 0.3s ease';
  c.setAttribute('id',`interval-range-${i}`);
  intervalRangeCircles.appendChild(c);
}

const chordNotes=document.getElementById('chord-notes');
for(let i=0;i<12;i++){ 
  // Cria o círculo de borda primeiro (para ficar atrás do texto)
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  bg.setAttribute('id', `chord-bg-${i}`);
  bg.setAttribute('fill', 'none'); 
  bg.setAttribute('stroke', 'black'); // Contorno preto
  bg.setAttribute('stroke-width', '2'); // Espessura da borda
  bg.setAttribute('opacity', '0'); // Começa invisível
  bg.style.transition = 'all 0.4s ease';
  chordNotes.appendChild(bg);

  // Depois o texto
  const t=document.createElementNS('http://www.w3.org/2000/svg','text');
  t.setAttribute('id',`chord-text-${i}`); 
  t.style.transition = 'all 0.4s ease';
  chordNotes.appendChild(t);
}

// ============================================================
// ATUALIZAR DISCO 12 NOTAS (ESCALA)
// ============================================================
function atualizarDiscoVisual(indiceTonica,molde,notasNomeadas){
  const mh=document.getElementById('mask-holes'); mh.innerHTML='';
  let sem=0; const pos=[0];
  for(let i=0;i<molde.length-1;i++){sem+=molde[i];pos.push(sem);}
  pos.forEach(p=>{
    const a=(p*30-90)*(Math.PI/180);
    const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',120+75*Math.cos(a)); c.setAttribute('cy',120+75*Math.sin(a));
    c.setAttribute('r',16); c.setAttribute('fill','black'); mh.appendChild(c);
  });
  const arr=NOTAS.map(n=>n.nota[0]);
  let posAbs=indiceTonica;
  for(let i=0;i<7;i++){arr[posAbs%12]=notasNomeadas[i];posAbs+=molde[i];}
  for(let i=0;i<12;i++) document.getElementById(`note-text-${i}`).textContent=arr[i];
  document.getElementById('rotating-disc').style.transform=`rotate(${indiceTonica*30}deg)`;
}

// ============================================================
// ATUALIZAR DISCO DE ACORDES (7 ou 12 Notas)
// ============================================================
const sliderGrau=document.getElementById('grauSlider');
const selectAcorde=document.getElementById('acordeSelect');
const labelGrau=document.getElementById('grauLabel');
const divAcordeVis=document.getElementById('resultadoAcordeVisual');

function atualizarDiscoAcordes(notasDaEscala) {
  const grau = parseInt(sliderGrau.value);
  const tipoAcorde = selectAcorde.value;
  const view12 = document.getElementById('chordViewSwitch').checked;
  
  labelGrau.innerText = `${grau} (${['I','II','III','IV','V','VI','VII'][grau-1]})`;

  // Geometria conforme visualização
  const cx = view12 ? 120 : 90;
  const cy = view12 ? 120 : 90;
  const r_text = view12 ? 75 : 55;
  const r_disc = view12 ? 107 : 75;
  const r_hole = view12 ? 16 : 15;

  const svg = document.getElementById('chord-wheel');
  svg.setAttribute('width', view12 ? '240' : '180');
  svg.setAttribute('height', view12 ? '240' : '180');
  svg.setAttribute('viewBox', view12 ? '0 0 240 240' : '0 0 180 180');

  document.getElementById('chord-hole-bg').setAttribute('cx', cx);
  document.getElementById('chord-hole-bg').setAttribute('cy', cy);
  document.getElementById('chord-hole-bg').setAttribute('r', view12 ? 120 : 90);

  const discGroup = document.getElementById('chord-rotating-disc');
  discGroup.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1), transform-origin 0.4s ease';
  discGroup.style.transformOrigin = `${cx}px ${cy}px`;
  
  const discShapes = discGroup.children;
  discShapes[0].setAttribute('cx', cx); discShapes[0].setAttribute('cy', cy); discShapes[0].setAttribute('r', r_disc);
  discShapes[1].setAttribute('cx', cx); discShapes[1].setAttribute('cy', view12 ? 45 : 35); // ponteiro superior
  discShapes[2].setAttribute('cx', cx); discShapes[2].setAttribute('cy', cy); // pino central

  const intervalosSelecionados = ACORDES[tipoAcorde];
  const notasDoAcorde = intervalosSelecionados.map(g => notasDaEscala[(grau - 1 + g - 1) % 7]);
  
  const rootNota = notasDoAcorde[0];
  const rootIndexAbs = NOTAS.findIndex(n => n.nota.includes(rootNota));

  const scaleRootNota = notasDaEscala[0];
  const scaleRootIndexAbs = NOTAS.findIndex(n => n.nota.includes(scaleRootNota));

  // 1. Atualizar textos e círculos de borda
  if (!view12) {
      for(let i=0; i<12; i++) {
          const t = document.getElementById(`chord-text-${i}`);
          const bg = document.getElementById(`chord-bg-${i}`);
          
          if (i < 7) {
              const a = (i*(360/7)-90)*(Math.PI/180);
              const posX = cx + r_text * Math.cos(a);
              const posY = cy + r_text * Math.sin(a);
              
              t.setAttribute('x', posX);
              t.setAttribute('y', posY);
              t.textContent = notasDaEscala[i];
              t.setAttribute('fill', '#444');
              t.setAttribute('opacity', '1');
              
              bg.setAttribute('cx', posX);
              bg.setAttribute('cy', posY);
              bg.setAttribute('r', r_hole);
              bg.setAttribute('opacity', '0'); // Esconde contorno na view de 7
          } else {
              t.setAttribute('opacity', '0'); 
              bg.setAttribute('opacity', '0'); 
          }
      }
  } else {
      for(let i=0; i<12; i++) {
          const absIdx = (scaleRootIndexAbs + i) % 12;
          const noteObj = NOTAS[absIdx];
          const inScaleName = noteObj.nota.find(n => notasDaEscala.includes(n));
          const noteName = inScaleName || noteObj.nota[0];

          const t = document.getElementById(`chord-text-${i}`);
          const bg = document.getElementById(`chord-bg-${i}`);
          
          const a = (i*(360/12)-90)*(Math.PI/180);
          const posX = cx + r_text * Math.cos(a);
          const posY = cy + r_text * Math.sin(a);
          
          t.setAttribute('x', posX);
          t.setAttribute('y', posY);
          t.textContent = noteName;
          
          bg.setAttribute('cx', posX);
          bg.setAttribute('cy', posY);
          bg.setAttribute('r', r_hole);
          
          if (notasDaEscala.includes(noteName)) {
              t.setAttribute('opacity', '1');
              t.setAttribute('fill', '#1a3a37');
              bg.setAttribute('opacity', '0.3'); // Exibe a borda preta em 10% nas notas da escala
          } else {
              t.setAttribute('opacity', '0.5'); 
              t.setAttribute('fill', '#666');
              bg.setAttribute('opacity', '0'); // Esconde contorno das notas fora
          }
      }
  }

  // 2. Atualizar furos da máscara (Janelinhas Animadas)
  const cm = document.getElementById('chord-mask-holes');
  const existingCircles = Array.from(cm.querySelectorAll('circle'));
  const needed = intervalosSelecionados.length;

  while (existingCircles.length < needed) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      cm.appendChild(c);
      existingCircles.push(c);
  }
  while (existingCircles.length > needed) {
      const c = existingCircles.pop();
      c.remove();
  }
  
  if (!view12) {
      intervalosSelecionados.forEach((g, i) => {
          const idx = (g - 1) % 7;
          const a = (idx * (360 / 7) - 90) * (Math.PI / 180);
          const c = existingCircles[i];
          c.setAttribute('cx', cx + r_text * Math.cos(a));
          c.setAttribute('cy', cy + r_text * Math.sin(a));
          c.setAttribute('r', r_hole);
          c.setAttribute('fill', 'black');
      });
      document.getElementById('chord-rotating-disc').style.transform = `rotate(${(grau - 1) * (360 / 7)}deg)`;
  } else {
      intervalosSelecionados.forEach((g, i) => {
          const currentChordNote = notasDoAcorde[i];
          const noteAbsIdx = NOTAS.findIndex(n => n.nota.includes(currentChordNote));
          
          const semitonesFromChordRoot = (noteAbsIdx - rootIndexAbs + 12) % 12;
          const a = (semitonesFromChordRoot * (360 / 12) - 90) * (Math.PI / 180);
          
          const c = existingCircles[i];
          c.setAttribute('cx', cx + r_text * Math.cos(a));
          c.setAttribute('cy', cy + r_text * Math.sin(a));
          c.setAttribute('r', r_hole);
          c.setAttribute('fill', 'black');
      });
      
      const semitonesFromScaleRoot = (rootIndexAbs - scaleRootIndexAbs + 12) % 12;
      const rotationDeg = semitonesFromScaleRoot * 30;
      document.getElementById('chord-rotating-disc').style.transform = `rotate(${rotationDeg}deg)`;
  }

  // Textos complementares
  document.getElementById('lbl-12notas').style.opacity = view12 ? '1' : '0.5';

  const idxTonicaAbsLocal = NOTAS.findIndex(n => n.nota.includes(rootNota));

  const nomesExplicativos = notasDoAcorde.map((nota, i) => {
    const grauRelativo = intervalosSelecionados[i];
    if (grauRelativo === 1) return "Tônica";
    const idxNotaAbs = NOTAS.findIndex(n => n.nota.includes(nota));
    const semitons = (idxNotaAbs - idxTonicaAbsLocal + 12) % 12;

    let qualidade = "";
    if (grauRelativo === 3) qualidade = (semitons === 3) ? " Menor" : " Maior";
    if (grauRelativo === 5) qualidade = (semitons === 6) ? " Diminuta" : (semitons === 8 ? " Aumentada" : " Justa");
    if (grauRelativo === 7) qualidade = (semitons === 10) ? " Menor" : " Maior";
    if (grauRelativo === 9) qualidade = (semitons === 1) ? " Menor" : (semitons === 2 ? " Maior" : " Aumentada");
    return `${NOMES_INTERVALOS_TEORICOS[grauRelativo]}${qualidade}`;
  });

  const labelSelect = selectAcorde.options[selectAcorde.selectedIndex].text;
  document.getElementById('intervalos-detalhe').innerHTML = `
    <strong>${labelSelect}</strong> = Intervalos: ${intervalosSelecionados.join(', ')}<br>
    <span style="color: #555;">(${nomesExplicativos.join(', ')})</span>
  `;

  divAcordeVis.innerHTML = extrairAcorde(notasDaEscala, ACORDES[tipoAcorde], grau);
}

// ============================================================
// NOVO DISCO INTERVALOS
// ============================================================
const reguaSlider=document.getElementById('reguaSlider');
const reguaLabel=document.getElementById('reguaLabel');
const nomesIntervalos=[
  "Uníssono","2ª menor (1ST)","2ª maior (1T)",
  "3ª menor (1T e 1ST)","3ª maior (2T)","4ª justa (2T e 1ST)",
  "5ª dim / 4ª aum (3T)","5ª justa (3T e 1ST)","6ª menor (4T)",
  "6ª maior (4T e 1ST)","7ª menor (5T)","7ª maior (5T e 1ST)","Oitava (6T)"
];

function inicializarRegua(){

  const indice=parseInt(document.getElementById('notaSlider').value);
  const tonica=NOTAS[indice].nota[0];
  const molde=ESCALAS[document.getElementById('escalaSelect').value];
  const notas=leitorDeNotasCorretas(gerarEscala(tonica,molde))[0];

  for(let i=0;i<12;i++){

    const texto = NOTAS[i].nota[0];

    const textEl = document.getElementById(`interval-text-${i}`);

    textEl.textContent = texto;

    const ang=(i*30-90)*(Math.PI/180);

    const x=120+75*Math.cos(ang);
    const y=120+75*Math.sin(ang);

    textEl.setAttribute('x',x);
    textEl.setAttribute('y',y);

    const rot = indice * 30;

    textEl.style.transition =
      'transform 2s cubic-bezier(0.4,0,0.2,1)';

    textEl.setAttribute(
      'transform',
      `rotate(${rot} ${x} ${y})`
    );

  }

const grupoIntervalos = document.getElementById('interval-notes');

grupoIntervalos.style.transition =
  'transform 2s cubic-bezier(0.4,0,0.2,1)';

grupoIntervalos.setAttribute(
  'transform',
  `rotate(${-indice * 30} 120 120)`
);

  atualizarJanelaIntervalo();
}

function atualizarJanelaIntervalo() {
  const v = parseInt(reguaSlider.value);
  reguaLabel.textContent = nomesIntervalos[v];
  
  document.getElementById('interval-mask-rotator').style.transform = `rotate(${v * 30}deg)`;
  document.getElementById('interval-window-group').style.transform = `rotate(${v * 30}deg)`;

  for(let i=0; i<12; i++){
    const c = document.getElementById(`interval-range-${i}`);
    if (v > 0 && i > 0 && i < v) {
      c.setAttribute('opacity', '0.25'); 
    } else {
      c.setAttribute('opacity', '0'); 
    }
  }
  
  updateSliderFill(reguaSlider, v, 12);
}

reguaSlider.addEventListener('input', atualizarJanelaIntervalo);

// ============================================================
// SEMICÍRCULO — RODA DE ACIDENTES
// ============================================================
const KEY_CX = 200, KEY_CY = 210, KEY_R = 185, KEY_R_NOTE = 150;
const noteGroups = [];

function criarTextosNoDisco() {
  const g = document.getElementById('key-disc-notes');
  g.innerHTML = '';
  noteGroups.length = 0;

  const notasCompleta = [
    ['Do', 'Si♯', 'Re♭♭'],
    ['Do♯', 'Re♭', 'Si♯♯'],
    ['Re', 'Do♯♯', 'Mi♭♭'],
    ['Re♯', 'Mi♭', 'Fa♭♭'],
    ['Mi', 'Re♯♯', 'Fa♭'],
    ['Fa', 'Mi♯', 'Sol♭♭'],
    ['Fa♯', 'Sol♭', 'Mi♯♯'],
    ['Sol', 'Fa♯♯', 'La♭♭'],
    ['Sol♯', 'La♭'],
    ['La', 'Sol♯♯', 'Si♭♭'],
    ['La♯', 'Si♭', 'Do♭♭'],
    ['Si', 'La♯♯', 'Do♭']
  ];

  for (let i = 0; i < 12; i++) {
    const angMath = 90 - i * (360 / 12);
    const rad = angMath * Math.PI / 180;

    const x = KEY_CX + KEY_R_NOTE * Math.cos(rad);
    const y = KEY_CY - KEY_R_NOTE * Math.sin(rad);

    const grupo = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    grupo.setAttribute('id', `key-note-${i}`);
    grupo.style.transition = 'transform 2s cubic-bezier(0.4, 0, 0.2, 1)';
    grupo.style.transformOrigin = `${x}px ${y}px`;

    const groupObj = { baseY: y, elements: [] };

    notasCompleta[i].forEach((nome) => {
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', x);
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('dominant-baseline', 'central');
      t.style.transition = 'all 2s ease';
      t.textContent = nome;
      grupo.appendChild(t);
      groupObj.elements.push({ name: nome, el: t });
    });

    noteGroups.push(groupObj);
    g.appendChild(grupo);
  }
}
criarTextosNoDisco();

let keyDiscRotDeg = 0;

function atualizarDiscoClave(indice) {

  const indicesNaturais = [0, 2, 4, 5, 7, 9, 11];

  const naturalMaisProxima = indicesNaturais.reduce((prev, curr) => {
    return Math.abs(curr - indice) < Math.abs(prev - indice)
      ? curr
      : prev;
  });

  keyDiscRotDeg = -naturalMaisProxima * 30;

  document.getElementById('key-disc-group').style.transform =
    `rotate(${keyDiscRotDeg}deg)`;

  for (let i = 0; i < 12; i++) {
    const t = document.getElementById(`key-note-${i}`);
    if (t) t.style.transform = `rotate(${-keyDiscRotDeg}deg)`;
  }

  const tonica = NOTAS[indice].nota[0];

  let targetNatural = tonica.replace('♯', '').replace('♭', '');

  let targetSharp = targetNatural + '♯';
  let targetFlat  = targetNatural + '♭';

  if (targetSharp === 'Mi♯') targetSharp = 'Fa';
  if (targetSharp === 'Si♯') targetSharp = 'Do';

  if (targetFlat === 'Fa♭') targetFlat = 'Mi';
  if (targetFlat === 'Do♭') targetFlat = 'Si';

  const targets = [
    tonica,
    targetNatural,
    targetSharp,
    targetFlat
  ];

  const idxLeft = (naturalMaisProxima + 11) % 12;
  const idxRight = (naturalMaisProxima + 1) % 12;
  
  let hideBemol = false;
  let hideSustenido = false;

  noteGroups.forEach((group, groupIndex) => {

    const targetIndex = group.elements.findIndex(item =>
      targets.includes(item.name)
    );

    let orderedElements = [...group.elements];

    if (targetIndex !== -1) {
      const [targetItem] = orderedElements.splice(targetIndex, 1);
      orderedElements.unshift(targetItem);

      const isNatural = !targetItem.name.includes('♯') && !targetItem.name.includes('♭');
      
      if (groupIndex === idxLeft && isNatural) hideBemol = true;
      if (groupIndex === idxRight && isNatural) hideSustenido = true;
    }

    orderedElements.forEach((item, idx) => {

      const newY =
        group.baseY +
        (idx * 10) -
        ((orderedElements.length - 1) * 5);

      item.el.setAttribute('y', newY);

      const isHighlight =
        idx === 0 &&
        targetIndex !== -1;

      item.el.setAttribute(
        'fill',
        isHighlight ? '#075e54' : '#999'
      );

      item.el.setAttribute(
        'font-weight',
        isHighlight ? '900' : '500'
      );

      item.el.setAttribute(
        'font-size',
        isHighlight ? '12.5' : '10.5'
      );
    });

  });

  document.getElementById('label-bemol').style.opacity = hideBemol ? '0' : '1';
  document.getElementById('label-sustenido').style.opacity = hideSustenido ? '0' : '1';
}



// ============================================================
// UTILITÁRIO: fill slider
// ============================================================
function updateSliderFill(slider,val,max){
  const pct=`${(val/max)*100}%`;
  slider.style.setProperty('--val',pct);
  slider.style.background=`linear-gradient(to right,#128c7e 0%,#128c7e ${pct},#d0cdc8 ${pct})`;
}

// ============================================================
// INTERFACE PRINCIPAL
// ============================================================
const slider=document.getElementById('notaSlider');
const labelTonica=document.getElementById('notaLabel');
const labelTonica2=document.getElementById('notaLabel2');
const selectEscala=document.getElementById('escalaSelect');
const divEscala=document.getElementById('resultadoEscala');

function atualizarVisualIntervalos(molde){
  const c=document.getElementById('container-intervalos');c.innerHTML='';
  molde.forEach(v=>{const s=document.createElement('span');s.textContent=v===1?'ST':v===2?'T':'T+ST';c.appendChild(s);});
}

function processarTudo(){
  const indice=parseInt(slider.value);
  const tonica=NOTAS[indice].nota[0];
  const molde=ESCALAS[selectEscala.value];
  const escalas=leitorDeNotasCorretas(gerarEscala(tonica,molde));

  const notaCorreta=escalas[0][0];
  const notaObj=NOTAS[indice];
  const idxNome=notaObj.nota.indexOf(notaCorreta);
  const cifraCorr=idxNome!==-1?notaObj.cifra[idxNome]:notaObj.cifra[0];

  labelTonica.innerText=`${notaCorreta}`;
  labelTonica2.innerText=`${cifraCorr}`;

  const tagsEnarmonicas = notaObj.nota.map((nome, i) => {
    if (nome === notaCorreta) return null; 
    const cifra = notaObj.cifra[i] || notaObj.cifra[0];
    return `<div class="tag-enarmonica">${nome} <span class="tag-cifra">${cifra}</span></div>`;
  }).filter(Boolean);

  const containerInfo = document.getElementById('nota-info-extra');
  if (tagsEnarmonicas.length > 0) {
    containerInfo.style.display = 'flex';
    containerInfo.innerHTML = `
      <div class="info-extra-title">Notas que representam o mesmo som</div>
      <div class="info-extra-tags">${tagsEnarmonicas.join('')}</div>
    `;
  } else {
    containerInfo.style.display = 'none';
  }

  
  atualizarDiscoVisual(indice,molde,escalas[0]);
const escalaPrincipal = escalas[0]?.join(' ') || 'N/A';
const escalaCorrespondente = escalas[1]?.join(' ') || 'N/A';
const selectDaEscala = document.getElementById('escalaSelect');
const escalaSelecionadaTexto = selectDaEscala.options[selectDaEscala.selectedIndex].text;

divEscala.innerHTML = `
  <div style="display:flex;flex-direction:column;gap:0px;">
    <small>${escalaSelecionadaTexto}</small>
      <div style="
        font-size:14px;
        color:#1a3a37;
        font-weight:700;
        text-align:center;
      ">${escalaPrincipal}</div>

      <div style="
      margin-top: 16px;
        font-size:10px;
        text-transform:uppercase;
        letter-spacing:.08em;
        color:#888;
        font-weight:700;
        text-align:center;
      ">Escala Correspondente</div>

      <div style="
        font-size:13px;
        color:#666;
        text-align:center;
      ">${escalaCorrespondente}</div>

  </div>
`;

  atualizarVisualIntervalos(molde);
  atualizarDiscoAcordes(escalas[0].slice(0,7));
  atualizarDiscoClave(indice); 
  
  inicializarRegua();
  updateSliderFill(slider,indice,11);
}

slider.addEventListener('input',processarTudo);
selectEscala.addEventListener('change',processarTudo);
sliderGrau.addEventListener('input',processarTudo);
selectAcorde.addEventListener('change',processarTudo);
document.getElementById('chordViewSwitch').addEventListener('change', processarTudo);

updateSliderFill(sliderGrau,0,6);
updateSliderFill(document.getElementById('reguaSlider'),0,12);
processarTudo();