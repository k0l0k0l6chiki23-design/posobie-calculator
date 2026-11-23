const WHATSAPP_NUMBER='79283295566';
const MAX_CONTACT_URL='https://max.ru/u/f9LHodD0cOIr099tbW7LC7aCeRBYJbT6iTcerRTzFBQJ-Ks2AD9zy7hty4A';
// Актуализация утверждённых ПМ на 2027 год (20.11.2026); ПМ-2026 не изменяются.
const APPROVED_PM_2027_20261120 = {
  "г. Москва": [
    26432,
    22845,
    30184
  ],
  "Забайкальский край": [
    23666,
    22956,
    25796
  ],
  "Еврейская автономная область": [
    25284,
    24525,
    27560
  ],
  "Приморский край": [
    24070,
    23348,
    26236
  ],
  "Новгородская область": [
    19822,
    19227,
    21606
  ],
  "Мурманская область": [
    27462,
    26638,
    29934
  ],
  "Республика Карелия — Северная часть": [
    23799,
    23085,
    25941
  ],
  "Республика Карелия — Другие территории": [
    22227,
    21560,
    24227
  ],
  "Кемеровская область": [
    18407,
    17855,
    20064
  ],
  "Тверская область": [
    19822,
    19228,
    21606
  ],
  "Липецкая область": [
    16788,
    16284,
    18299
  ],
  "Кировская область": [
    18002,
    17462,
    19622
  ],
  "Республика Бурятия": [
    22047,
    21386,
    24031
  ],
  "Тюменская область": [
    20227,
    19620,
    22047
  ],
  "Республика Саха (Якутия) — Зона I": [
    35735,
    34664,
    38952
  ],
  "Запорожская область": [
    19620,
    19031,
    21386
  ],
  "Республика Алтай": [
    19216,
    18640,
    20945
  ],
  "Республика Калмыкия": [
    19822,
    19227,
    21606
  ],
  "Тульская область": [
    20227,
    19620,
    22047
  ],
  "Архангельская область — Зона II": [
    26396,
    25604,
    28772
  ],
  "Архангельская область — Зона VI": [
    22712,
    22031,
    24756
  ],
  "Кабардино-Балкарская Республика": [
    21643,
    20994,
    23591
  ],
  "Республика Адыгея": [
    17395,
    16873,
    18961
  ],
  "Республика Ингушетия": [
    19013,
    18443,
    20724
  ],
  "Ненецкий автономный округ": [
    33172,
    33371,
    36157
  ],
  "Смоленская область": [
    20025,
    19424,
    21827
  ],
  "Магаданская область": [
    35195,
    34139,
    38363
  ],
  "Республика Татарстан": [
    17193,
    16677,
    18740
  ],
  "Чукотский автономный округ": [
    52792,
    51208,
    57543
  ]
};
// Камчатка: полный опубликованный прогноз 2027, НЕ утверждённое постановление на 23.11.2026.
const KAMCHATKA_PM_2027_PRELIMINARY = {"Камчатский край": [35600, 34532, 38804]};
// ПМ-2027 по проекту постановления, одобренному правительством края 17.11.2026.
// До публикации подписанного акта отличаем этот источник от окончательно утверждённых данных.
const KRASNOYARSK_PM_2027_PROJECT_20261120 = {
  "Красноярский край — Район Северо-Енисейский, город Норильск": [
    31612,
    30663,
    34458
  ],
  "Красноярский край — Район Туруханский": [
    41134,
    39899,
    44837
  ],
  "Красноярский край — Район Таймырский Долгано-Ненецкий, кроме сельского поселения Хатанги": [
    34089,
    33066,
    37157
  ],
  "Красноярский край — Сельское поселение Хатанга": [
    56734,
    55031,
    61841
  ],
  "Красноярский край — Район Эвенкийский": [
    34677,
    33636,
    37799
  ],
  "Красноярский край — Город Енисейск": [
    29657,
    28767,
    32326
  ],
  "Красноярский край — Район Енисейский": [
    31534,
    30587,
    34372
  ],
  "Красноярский край — Город Лесосибирск": [
    24778,
    24034,
    27008
  ],
  "Красноярский край — Район Богучанский": [
    31015,
    30084,
    33807
  ],
  "Красноярский край — Район Кежемский": [
    29372,
    28490,
    32016
  ],
  "Красноярский край — Район Мотыгинский": [
    30272,
    29363,
    32997
  ],
  "Красноярский край — Другие территории": [
    21246,
    20609,
    23159
  ]
};
function recalcApprovedPm2027(row, pm, status='approved') {
 const [d, c, w] = pm, k = row.children;
 let totals;
 if (/^adult[123]$/.test(row.family_type)) {
  const n = Number(row.family_type.slice(-1)), base = (n + k) * d * 12;
  totals = [base - c * k * 9, base - c * k * 6, base];
 } else if (row.family_type === 'preg' || row.family_type === 'preg_husband') {
  const n = row.family_type === 'preg' ? 1 : 2;
  if (k === 0) totals = [d * 12 * n - w * 6, d * 12 * n - w * 4, d * 12 * n];
  else {
   const base = w * 8 + c * k * 12 + (row.family_type === 'preg' ? (k >= 4 ? d * 12 : 0) : d * 12);
   totals = [base - w * 6 - c * k * 9, base - w * 4 - c * k * 6, base];
  }
 } else return;
 Object.assign(row, {threshold_100:totals[0], threshold_75:totals[1], threshold_50:totals[2],
  pm_dush:d, pm_child_100:c, pm_work_100:w, pm_status:status});
}
for (const row of REGION_ROWS) {
 if (row.year === 2027 && Object.prototype.hasOwnProperty.call(APPROVED_PM_2027_20261120, row.region)) {
  recalcApprovedPm2027(row, APPROVED_PM_2027_20261120[row.region]);
 }
}
for (const row of REGION_ROWS) {
 if (row.year === 2027 && Object.prototype.hasOwnProperty.call(KRASNOYARSK_PM_2027_PROJECT_20261120, row.region)) {
  recalcApprovedPm2027(row, KRASNOYARSK_PM_2027_PROJECT_20261120[row.region], 'project_approved');
 }
}

for (const row of REGION_ROWS) {
 if (row.year === 2027 && Object.prototype.hasOwnProperty.call(KAMCHATKA_PM_2027_PRELIMINARY, row.region)) {
  recalcApprovedPm2027(row, KAMCHATKA_PM_2027_PRELIMINARY[row.region], 'preliminary');
 }
}

const $=id=>document.getElementById(id);
const regions=[...new Set(REGION_ROWS.map(r=>r.region))].sort((a,b)=>a.localeCompare(b,'ru'));
const krRegions=regions.filter(r=>r.startsWith('Красноярский край — '));
const krBase='Красноярский край';
const krLabels={
 'Красноярский край — Район Северо-Енисейский, город Норильск':'Норильск, Северо-Енисейский округ',
 'Красноярский край — Район Туруханский':'Туруханский муниципальный округ',
 'Красноярский край — Район Таймырский Долгано-Ненецкий, кроме сельского поселения Хатанги':'Таймырский Долгано-Ненецкий округ (кроме отдельных посёлков Хатанги)',
 'Красноярский край — Сельское поселение Хатанга':'Хатанга и отдельные посёлки Таймыра',
 'Красноярский край — Район Эвенкийский':'Эвенкийский муниципальный округ',
 'Красноярский край — Город Енисейск':'Город Енисейск',
 'Красноярский край — Район Енисейский':'Енисейский муниципальный округ',
 'Красноярский край — Город Лесосибирск':'Город Лесосибирск',
 'Красноярский край — Район Богучанский':'Богучанский муниципальный округ',
 'Красноярский край — Район Кежемский':'Кежемский муниципальный округ',
 'Красноярский край — Район Мотыгинский':'Мотыгинский муниципальный округ',
 'Красноярский край — Другие территории':'Остальные территории Красноярского края'
};
// Keep the original data keys for calculations; expose just one krai option in the primary picker.
const publicRegions=[...regions.filter(r=>!r.startsWith('Красноярский край — ') && r!==krBase),...(krRegions.length?[krBase]:[])].sort((a,b)=>a.localeCompare(b,'ru'));
for(const region of publicRegions){
 const option=document.createElement('option');option.value=region;$('regions').append(option);
 const mobileOption=document.createElement('option');mobileOption.value=region;mobileOption.textContent=region;$('region-mobile').append(mobileOption);
}
for(const name of krRegions){const option=document.createElement('option');option.value=name;option.textContent=krLabels[name]||name.split('— ').slice(1).join('— ');$('krasnoyarsk-territory').append(option);}
const normalizeRegion=s=>s.toLocaleLowerCase('ru').replace(/ё/g,'е').replace(/[—–-]/g,' ').replace(/[^а-я0-9]+/g,' ').trim().replace(/\\s+/g,' ');
function resolveRegion(input){
 const query=normalizeRegion(input);
 if(!query)return null;
 const exact=publicRegions.find(r=>normalizeRegion(r)===query);
 if(exact)return exact;
 const matches=publicRegions.filter(r=>{
  const full=normalizeRegion(r);
  const withoutRepublic=full.replace(/^республика /,'');
  return full.includes(query)||withoutRepublic.includes(query);
 });
 return matches.length===1?matches[0]:null;
}
function updateKrasnoyarskChoice(){
 const selected=window.matchMedia('(max-width:720px)').matches?$('region-mobile').value:resolveRegion($('region').value);
 const active=selected===krBase;
 $('krasnoyarsk-choice').hidden=!active;
 $('krasnoyarsk-territory').disabled=!active;
 $('krasnoyarsk-territory').required=active;
 if(!active)$('krasnoyarsk-territory').value='';
}
$('region').addEventListener('input',updateKrasnoyarskChoice);
$('region').addEventListener('change',()=>{const resolved=resolveRegion($('region').value);if(resolved){$('region').value=resolved;$('region-mobile').value=resolved;}updateKrasnoyarskChoice();});
$('region-mobile').addEventListener('change',()=>{$('region').value=$('region-mobile').value;updateKrasnoyarskChoice();});
const money=value=>value===null?'нет данных':new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0}).format(value);
function add(parent,tag,text,cls){const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;parent.append(el);return el;}
$('form').addEventListener('input',()=>{$('guide').hidden=true;$('services').hidden=true;$('result').replaceChildren();add($('result'),'h2','Ваш результат');add($('result'),'p','Параметры изменились. Нажмите «Получить расчёт» заново.','hint');});
$('form').addEventListener('submit',event=>{
 event.preventDefault();
 const mobile=window.matchMedia('(max-width:720px)').matches;
 const primary=mobile?$('region-mobile').value:resolveRegion($('region').value);
 const selected=primary===krBase?$('krasnoyarsk-territory').value:primary;
 const a={year:Number($('year').value),region:selected||'',adults:Number($('adults').value),teen:Number($('teen').value),student:Number($('student').value),children:Number($('children').value),pregnant:$('pregnant').checked};
 const result=$('result');result.replaceChildren();const heading=add(result,'h2',`Расчёт дохода · ${a.year}`);
 if(!selected){add(result,'p',primary===krBase?'Выберите город или район Красноярского края.':'Выберите регион из списка. На телефоне нажмите на поле «Регион» и прокрутите список.','notice');result.focus();return;}
 $('region').value=primary;$('region-mobile').value=primary;
 const answer=calculate(REGION_ROWS,a);$('guide').hidden=true;$('services').hidden=true;
 if(answer.error){add(result,'p',answer.error,'notice');}else{
 const approved=a.year===2026||answer.row.pm_status==='approved';
 const project=a.year===2027&&answer.row.pm_status==='project_approved';
 heading.textContent=(approved||project)?`Расчёт дохода на ${a.year} год`:`Предварительный расчёт · ${a.year}`;
 if(approved&&a.year===2027)add(result,'p','По утверждённому прожиточному минимуму','hint');
 if(project)add(result,'p','По проекту постановления Красноярского края, одобренному 17.11.2026. Подписанный акт пока не подтверждён.','hint');
 add(result,'p',`${a.region} · взрослых с детьми 17+: ${a.adults+a.teen+a.student} · детей до 17: ${a.children}`);
 add(result,'p','Максимальный общий доход семьи за год:','hint');
 for(const [percent,key] of [[100,'threshold_100'],[75,'threshold_75'],[50,'threshold_50']]){const item=add(result,'div','','item');add(item,'div',`Для выплаты ${percent}% прожиточного минимума`);add(item,'div',money(answer.row[key]),'amount');}
 add(result,'p',`ПМ на душу населения: ${money(answer.row.pm_dush)}. На ребёнка: ${money(answer.row.pm_child_100)}.`,'hint');
 if(answer.note)add(result,'p',answer.note,'notice');$('guide').hidden=false;$('services').hidden=false;
 }
 if(/^https:\/\/max\.ru\//.test(MAX_CONTACT_URL)){const link=add(result,'a','Написать в MAX','button secondary');link.href=MAX_CONTACT_URL;link.target='_blank';link.rel='noopener noreferrer';}
 if(/^\d{10,15}$/.test(WHATSAPP_NUMBER)){const link=add(result,'a','Обсудить расчёт в WhatsApp','button');link.href=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Здравствуйте! Хочу консультацию по единому пособию.')}`;link.target='_blank';link.rel='noopener noreferrer';}
 result.focus();
});

const SERVICES = [
 {label:'Консультация', action:'Записаться на консультацию', price:3000, description:'Разберём вашу ситуацию, доходы и возможные причины отказа.'},
 {label:'Детальный расчёт', action:'Заказать детальный расчёт', price:3000, description:'Индивидуальный расчёт с учётом доходов, имущества и правил назначения пособия.'},
 {label:'Полное сопровождение', action:'Заказать полное сопровождение', price:7000, description:'Помощь с документами и заявлением на всём пути до решения.'},
 {label:'Обжалование отказа', action:'Заказать обжалование отказа', price:3000, description:'Разберём причину отказа и подготовим обращение.'},
];
for (const service of SERVICES) {
 const card=add($('service-list'),'article','','service');
 add(card,'h3',`${service.action} (${service.price} ₽)`);
 add(card,'p',service.description,'hint');
 const message=`Здравствуйте! Хочу заказать услугу «${service.label}» (${service.price} ₽). Подскажите, пожалуйста, как оформить и когда можно начать.`;
 const actions=add(card,'div','','service-actions');
 const max=add(actions,'a','MAX','button secondary');max.href=MAX_CONTACT_URL;max.target='_blank';max.rel='noopener noreferrer';max.setAttribute('aria-label',`${service.label}: написать в MAX`);
 const wa=add(actions,'a','WhatsApp','button');wa.href=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;wa.target='_blank';wa.rel='noopener noreferrer';wa.setAttribute('aria-label',`${service.label}: написать в WhatsApp`);
 const details=add(card,'details','');add(details,'summary','Текст обращения');
 const field=add(details,'textarea','');field.value=message;field.readOnly=true;field.setAttribute('aria-label',`Текст обращения: ${service.label}`);
 const copy=add(card,'button','Скопировать текст для MAX','copy');copy.type='button';
 const status=add(card,'p','','status');status.setAttribute('role','status');
 async function copyMessage(){
  try {await navigator.clipboard.writeText(message);status.textContent='Текст скопирован. Вставьте его в чат MAX и отправьте.';}
  catch {details.open=true;field.focus();field.select();status.textContent='Выделен текст обращения. Скопируйте его и вставьте в чат MAX.';}
 }
 copy.addEventListener('click',copyMessage);
 max.addEventListener('click',copyMessage);
}
