(function(root){
function calculate(rows, a) {
 const keys=['adults','teen','student','children'];
 if(![2026,2027].includes(a.year)||!keys.every(k=>Number.isInteger(a[k]))||![1,2].includes(a.adults)||a.teen<0||a.student<0||a.children<0||a.children>9||(!a.children&&!a.pregnant)) return {error:'Проверьте состав семьи: нужен ребёнок до 17 лет или беременность.'};
 const n=a.adults+a.teen+a.student;
 if(n>3)return {error:'Таблица поддерживает максимум трёх взрослых с учётом детей 17+. Обратитесь за индивидуальной консультацией.'};
 const family=a.pregnant&&n===1?'preg':a.pregnant&&n===2?'preg_husband':`adult${n}`;
 const row=rows.find(r=>r.year===a.year&&r.region===a.region&&r.family_type===family&&r.children===a.children);
 if(!row||['threshold_100','threshold_75','threshold_50'].some(k=>row[k]===null))return {error:'Для этого состава семьи готового расчёта нет. Нужна индивидуальная консультация.'};
 return {row,note:a.pregnant&&n===3?'Беременность при трёх взрослых отдельно не рассчитывается: показан расчёт для трёх взрослых.':''};
}
root.calculate=calculate;
if(typeof module!=='undefined') module.exports={calculate};
})(typeof window!=='undefined'?window:globalThis);
