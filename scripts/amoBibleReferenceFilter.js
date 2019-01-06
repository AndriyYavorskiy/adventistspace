angular.module('AMO').filter("BibleReference", function (amoReaderModel, amoVocab, $window) {
  return function (reference, pattern) {
    if (!reference) {return;}
    var artefacts = reference.split(":"),
      lang = artefacts[0],
      bookId = artefacts[1],
      book = amoReaderModel(lang).find(function (x) {
        return x.id === bookId;
      });

    return pattern ? byPattern(pattern, book, artefacts[2], artefacts[3]) : byDefault(book, artefacts);
    };
    function byPattern (pattern, book, chapter, verse) {
      var output = pattern;
        output = output.replace('n', book.alias);
        output = output.replace('N', book.name);
        output = output.replace('c', chapter || '');
        output = output.replace('v', verse || '');
      return output.trim();
    }
    function byDefault (book, artefacts) {
      var chapter = artefacts[2] ? (" " + amoVocab(getLang())["chapter"] + " " + artefacts[2]) : "",
        verse = artefacts[3] ? (" " + amoVocab(getLang())[artefacts[3].search(/(,|-)/gim) >= 0 ? "verses" : "verse"] + " " + artefacts[3]) : "";

      return book.name + chapter + verse;
    }
  function getLang () {
    return $window.localStorage.getItem('amo-lang') || 'en';
  }
});