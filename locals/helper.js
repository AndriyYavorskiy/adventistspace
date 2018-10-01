var source = {
  "navigation": "Навігація",
  "search": "Пошук",
  "share": "Поділитися",
  "find": "Знайти",
  "in_selected_books": "в обраних книгах",
  "in_all": "в усіх",
  "results": "результати",
  "show_more": "Показати більше"
};
var tr = 'Nawigacja, wyszukiwanie, udostępnianie, wyszukiwanie, w wybranych książkach, we wszystkich, wyniki, pokaż więcej';

function parse (obj) {
  var values = [];
  Object.keys(obj).forEach(function (key) {
    values.push(obj[key]);
  });
  return values.join(', ');
}
function assemble (str, obj) {
  var ss = {}, it = str.split(', ');

  Object.keys(obj).forEach(function (key, index) {
    ss[key] = it[index];
  });

  return ss;
}

console.log(parse(source));
console.log(JSON.stringify(assemble(tr, source)));




