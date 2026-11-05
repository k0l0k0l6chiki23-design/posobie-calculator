const WHATSAPP_NUMBER='79283295566';
const MAX_CONTACT_URL='https://max.ru/u/f9LHodD0cOIr099tbW7LC7aCeRBYJbT6iTcerRTzFBQJ-Ks2AD9zy7hty4A';
const $=id=>document.getElementById(id);
const regions=[...new Set(REGION_ROWS.map(r=>r.region))].sort((a,b)=>a.localeCompare(b,'ru'));
for(const region of regions){const el=document.createElement('option');el.value=region;$('regions').append(el);}
const money=value=>value===null?'нет данных':new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0}).format(value);
function add(parent,tag,text,cls){const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;parent.append(el);return el;}
$('form').addEventListener('input',()=>{$('guide').hidden=true;$('services').hidden=true;$('result').replaceChildren();add($('result'),'h2','Ваш результат');add($('result'),'p','Параметры изменились. Нажмите «Получить расчёт» заново.','hint');});
$('form').addEventListener('submit',event=>{
 event.preventDefault();const a={year:Number($('year').value),region:$('region').value.trim(),adults:Number($('adults').value),teen:Number($('teen').value),student:Number($('student').value),children:Number($('children').value),pregnant:$('pregnant').checked};
 const result=$('result');result.replaceChildren();add(result,'h2',a.year===2027?'Предварительный расчёт · 2027':'Ваш расчёт · 2026');
 const answer=calculate(REGION_ROWS,a);$('guide').hidden=true;$('services').hidden=true;
 if(answer.error){add(result,'p',answer.error,'notice');}else{
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
