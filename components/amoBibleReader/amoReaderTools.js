
angular.module('AMO').service("instanceStateProvider", function () {
	var StateStorage = function () {
		var self = this,
			state = {};
			
		self.setLang = function (lang) {
			if (lang) {
				state.lang = lang;
			}
			
			return self;
		}
		self.setBook = function (bookId) {
			if (bookId) {
				state.book = bookId;
			}
			
			return self;
		}
		self.setChapter = function (chapter) {
			if (chapter || chapter === 0) {
				state.chapter = chapter;
			}
			
			return self;
		}
		self.setVerse = function (verse) {
			if (verse || verse === 0) {
				state.verse = verse;
			}
			
			return self;
		}
		self.copy = function () {
			return angular.copy(state);
		}
		self.parseReference = function (reference) {
			var parts = reference.split(":");

			self.setLang(parts[0]);
			self.setBook(parts[1]);
			self.setChapter(parts[2]);
			self.setVerse(parts[3]);
			if (!parts[2]) {
				delete state.chapter;
				delete state.verse;
			}
			if (!parts[3]) {
				delete state.verse;
			}

			return self;
		}
		self.getReference = function () {
			return assembleReference();
		}
		self.extendWith = function (form) {
			self.setLang(form.lang);
			self.setBook(form.book);
			self.setChapter(form.chapter);
			self.setVerse(form.verse);

			return self;
		}
		function assembleReference () {
			var book = state.book ? ":" + state.book : "",
				chapter = state.chapter ? ":" + state.chapter : "",
				verse = state.verse ? ":" + state.verse : "";
				if (verse && !chapter) {chapter = ":1"}
				if (chapter && !book) {book = ":matt"}
			return state.lang + book + chapter + verse;
		}
	}
	this.generateNewState = function () {
		return new StateStorage();
	}
});

angular.module('AMO').factory("amoBibleInstanceManager", function ($http, BIBLEMATRIX, amoReaderModel, $sce) {
	var manager = {};

	manager.remindLastState = function () {
		return JSON.parse(localStorage.getItem("BibleReaderLastState")) || [];
	}
	manager.rememberLastBookmark = function (bookmark) {
		if (isValidReference(bookmark)) {
			localStorage.setItem("BibleReference", bookmark);
		}
	}
	manager.addToLastBookmarks = function (bookmark) {
		var readerState = JSON.parse(localStorage.getItem("BibleReaderLastState")) || [];
		if (isValidReference(bookmark)) {
			readerState.push(bookmark);
			localStorage.setItem("BibleReaderLastState", JSON.stringify(readerState));
		}
	}
	manager.clearLastBookmarks = function () {
		localStorage.removeItem("BibleReaderLastState");
	}
	manager.isValidReference = isValidReference;
	manager.loadBookModel = loadBookModel;
	manager.findDestinations = findDestinations;
	manager.executeSearchInBook = executeSearchInBook;
	manager.createTabManager = createTabManager;
	manager.decodeVersesList = decodeVersesList;
	
	return manager;
	
	function decodeVersesList (bits) {
		var list = [bits], artefacts;

		if (bits.indexOf(",") >= 0) {
			list = bits.split(",");
		}
		if (bits.indexOf("-") >= 0) {
			list  = [];
			artefacts = bits.split("-");
			for (var i = parseInt(artefacts[0]), c = parseInt(artefacts[1]); i <= c; i++) {
				list.push(i);
			}
		}

		return list;
	}
	function findDestinations(params, language) {
		var results = [],
			searchParam = (params.query || '').trim().toLowerCase(),
			lang = language || 'ru',
			martix = BIBLEMATRIX(lang);
		amoReaderModel(lang).forEach(function (bookModel) {
			var matchesByQuery = bookModel.name.toLowerCase().indexOf(searchParam) >= 0
				|| bookModel.alias.toLowerCase().indexOf(searchParam) >= 0 || (bookModel.id.toLowerCase().indexOf(searchParam) >= 0) ,
				hasChapter, hasVerse,
				destination = lang + ":" + bookModel.id;

			if (matchesByQuery) {
				hasChapter = params.chapter && params.chapter <= martix[bookModel.id].length;
				destination = hasChapter ? (destination += ':' + params.chapter) : destination;

				hasVerse = params.verse && params.verse <= martix[bookModel.id][params.chapter - 1];
				destination = (hasChapter && hasVerse) ? (destination += ':' + params.verse) : destination;

				results.push(destination);
			}
		});
		return results;
	}
	function isValidReference (bookmark) {
		if (!bookmark) {
			// console.warn("Reference argument is: " + bookmark + ".");
			return false;
		};
		var bookRegex = /^(ru|ua|en){1}(:\w{2,})?(:\d+)?(:\d+((-\d+)?|(,\d+)*)?)?$/gim,
		byREGEX = bookmark.match(bookRegex),
		byMATRIX = true, chapterNum, bookId, verseNum;
		if (byREGEX) {
			var parts = bookmark.split(":");
			bookId = parts[1];
			chapterNum = (+parts[2]) - 1;
			verseNum = parts[3] ? parts[3].split(parts[3].match(/\W/i)).sort(function(a,b){return a < b})[0] : undefined;
			if (bookId && !(BIBLEMATRIX()[bookId].length)) {
				byMATRIX = false;
				// console.warn(bookmark + " - Incorrect book id.");
			}
			if (chapterNum && !(BIBLEMATRIX()[bookId].length >= chapterNum && chapterNum >= 0)) {
				byMATRIX = false;
				// console.warn(bookmark + " - Incorrect chapter number.")
			}
			if (verseNum && !(BIBLEMATRIX()[bookId][chapterNum] >= verseNum)) {
				byMATRIX = false;
				// console.warn(bookmark + " - Incorrect book number.");
			}
		}
		
		return byREGEX && byMATRIX;
	}
	function loadBookModel (book) {
		return $http.get("/scriptures/Bible_ru/" + book.alias + ".json");
	}
	function executeSearchInBook(book, searchParam) {
		var param = searchParam.toLowerCase(), foundInBook = [],
			words = param.replace(/(,|-|\.)/gim, "").split(" "),
			lettersRegex = /[а-я]/i;
			
		(book.chapters || []).forEach(function (chapter, chapterIndex) {

			chapter.forEach(_scanVerse);
			function _scanVerse (verse, verseIndex) {
				var fullMatchIndex = verse.toLowerCase().indexOf(param),
					rate = 0,
					coordenates = [];
					
				if (words.length > 1) {
					if (fullMatchIndex >= 0) {
						rate += words.length * 3;
						coordenates.push([fullMatchIndex, fullMatchIndex + param.length]);
					} else {
						words.forEach(_registerWordMatch);
					}
				} else {
					_registerWordMatch(words[0]);
				}
				function _registerWordMatch (word) {
					var allMatchesCoordenates = _detectSubStr(verse, word);
					if (allMatchesCoordenates.length > 0) {
						rate++;
						allMatchesCoordenates.forEach(function (pair) {
							rate += _getMatchPurityBonus(verse, pair[0], word);
							coordenates.push(pair);
						});
					}
				}
				
				if (rate) {
					if (coordenates.length > 1) {
						coordenates.sort(function (a, b) {
							return a[0] > b[0];
						});
						rate += _getProximityBonus(verse, coordenates);
					}
					foundInBook.push({
						rate: rate,
						coordenates: coordenates,
						scripture: $sce.trustAsHtml(wrapMatches(verse, coordenates)),
						reference: book.lang + ":" + book.id + ":" + (chapterIndex + 1) + ":" + (verseIndex + 1),
						book: book.name,
						chapter: chapterIndex + 1, 
						verse: verseIndex + 1});						
				}
			}
			
		});
			
		return foundInBook.length ? foundInBook : null;
	}
	function splitSearchResults (results, rigidity) {
		
	}
	function _detectSubStr (text, subStr) {
		var match, matches = [], regexp = new RegExp(subStr, "gim");
	
		while ((match = regexp.exec(text)) != null) {
			  matches.push([match.index, match.index + subStr.length]);
		}
	
		return matches;
	}
	function _getProximityBonus (text, coords) {
		var grunt = 0,
			regex = /[а-я]/i;
		
		coords.forEach(function (coord, index) {
			if (!coords[index + 1]) {return;}
			var stringBetween = text.substring(coord[1], coords[index + 1][0]);
			if (stringBetween.match(/^(,?\s+[а-я]{1,4}\s+|,\s+|\s+-\s+|\s+)$/i || stringBetween.length < 4)) {
				grunt += 2;
			}
		});
		
		return grunt;
	}
	function _getMatchPurityBonus (text, index, string) {
		var bonus = 0,
			regex = /[а-я]/i,
			charBefore = text.charAt(index - 1),
			charAfter = text.charAt(index + string.length);
		
			bonus += regex.test(charBefore) ? 0 : 0.75;
			bonus += regex.test(charAfter) ? 0 : 0.25;
		
		return bonus;
	}
	function wrapMatches (text, coords) {
		var finalText = "",
		checkPoint = 0;
		
		coords.forEach(function (pair) {
			finalText += text.substring(checkPoint, pair[0]);
			finalText += "<span class='match'>" + text.substring(pair[0], pair[1]) + "</span>";
			checkPoint = pair[1];
		});
		finalText += text.substring(checkPoint, text.length);
		
		return finalText;
	}
	function createTabManager (tab) {
		return new TabManager(tab);
	}
	function TabManager (tab) {
		var currentTab = tab || "";
		this.setTab = function (tab) {
			currentTab = tab;
		}
		this.checkTab = function () {
			return currentTab;
		}
	}
});
angular.module('AMO').constant("amoReaderModel", function (lang) {
	return {
		ru: [{"name":"Бытие","alias":"Быт","id":"gen","open":false,"chapters":[]},
			{"name":"Исход","alias":"Исх","id":"ex","open":false,"chapters":[]},
			{"name":"Левит","alias":"Лев","id":"lev","open":false,"chapters":[]},
			{"name":"Числа","alias":"Чис","id":"num","open":false,"chapters":[]},
			{"name":"Второзаконие","alias":"Вт","id":"deut","open":false,"chapters":[]},
			{"name":"Книга Иисуса Навина","alias":"Нав","id":"josh","open":false,"chapters":[]},
			{"name":"Книга Судей Израилевых","alias":"Суд","id":"judg","open":false,"chapters":[]},
			{"name":"Книга Руфь","alias":"Руфь","id":"ruth","open":false,"chapters":[]},
			{"name":"Первая книга Царств","alias":"Цар1","id":"sam1","open":false,"chapters":[]},
			{"name":"Вторая книга Царств","alias":"Цар2","id":"sam2","open":false,"chapters":[]},
			{"name":"Третья книга Царств","alias":"Цар3","id":"kings1","open":false,"chapters":[]},
			{"name":"Четвертая книга Царств","alias":"Цар4","id":"kings2","open":false,"chapters":[]},
			{"name":"Первая книга Паралипоменон","alias":"Пар1","id":"chron1","open":false,"chapters":[]},
			{"name":"Вторая книга Паралипоменон","alias":"Пар2","id":"chron2","open":false,"chapters":[]},
			{"name":"Книга Ездры","alias":"Езд","id":"ezra","open":false,"chapters":[]},
			{"name":"Неемия","alias":"Неем","id":"neh","open":false,"chapters":[]},
			{"name":"Книга Есфирь","alias":"Есф","id":"est","open":false,"chapters":[]},
			{"name":"Книга Иова","alias":"Иов","id":"job","open":false,"chapters":[]},
			{"name":"Псалтырь","alias":"Пс","id":"ps","open":false,"chapters":[]},
			{"name":"Притчи Соломона","alias":"Пр","id":"prov","open":false,"chapters":[]},
			{"name":"Книга Екклесиаста","alias":"Ек","id":"eccles","open":false,"chapters":[]},
			{"name":"Песни Песней","alias":"Песн","id":"song","open":false,"chapters":[]},
			{"name":"Книга пророка Исаии","alias":"Ис","id":"isa","open":false,"chapters":[]},
			{"name":"Книга пророка Иеремии","alias":"Иер","id":"jer","open":false,"chapters":[]},
			{"name":"Плач Иеремии","alias":"Пл.Иер","id":"lam","open":false,"chapters":[]},
			{"name":"Книга пророка Иезекииля","alias":"Иез","id":"ezek","open":false,"chapters":[]},
			{"name":"Книга пророка Даниила","alias":"Дан","id":"dan","open":false,"chapters":[]},
			{"name":"Книга пророка Осии","alias":"Ос","id":"hos","open":false,"chapters":[]},
			{"name":"Книга пророка Иоиля","alias":"Иоиль","id":"joel","open":false,"chapters":[]},
			{"name":"Книга пророка Амоса","alias":"Ам","id":"amos","open":false,"chapters":[]},
			{"name":"Книга пророка Авдия","alias":"Авд","id":"obad","open":false,"chapters":[]},
			{"name":"Книга пророка Ионы","alias":"Иона","id":"jonah","open":false,"chapters":[]},
			{"name":"Книга пророка Михея","alias":"Мих","id":"mic","open":false,"chapters":[]},
			{"name":"Книга пророка Наума","alias":"Наум","id":"nah","open":false,"chapters":[]},
			{"name":"Книга пророка Аввакума","alias":"Авв","id":"hab","open":false,"chapters":[]},
			{"name":"Книга пророка Софонии","alias":"Соф","id":"zeph","open":false,"chapters":[]},
			{"name":"Книга пророка Аггея","alias":"Агг","id":"hag","open":false,"chapters":[]},
			{"name":"Книга пророка Захарии","alias":"Зах","id":"zech","open":false,"chapters":[]},
			{"name":"Книга пророка Малахии","alias":"Мал","id":"mal","open":false,"chapters":[]},
			{"name":"Евангелие от Матфея","alias":"Мф","id":"matt","open":false,"chapters":[]},
			{"name":"Евангелие от Марка","alias":"Мк","id":"mark","open":false,"chapters":[]},
			{"name":"Евангелие от Луки","alias":"Лк","id":"luke","open":false,"chapters":[]},
			{"name":"Евангелие от Иоанна","alias":"Ин","id":"john","open":false,"chapters":[]},
			{"name":"Деяния","alias":"Деян","id":"acts","open":false,"chapters":[]},
			{"name":"Послание Иакова","alias":"Иак","id":"james","open":false,"chapters":[]},
			{"name":"Первое послание Петра","alias":"Пет1","id":"pet1","open":false,"chapters":[]},
			{"name":"Второе послание Петра","alias":"Пет2","id":"pet2","open":false,"chapters":[]},
			{"name":"Первое послание Иоанна","alias":"Ин1","id":"john1","open":false,"chapters":[]},
			{"name":"Второе послание Иоанна","alias":"Ин2","id":"john2","open":false,"chapters":[]},
			{"name":"Третье послание Иоанна","alias":"Ин3","id":"john3","open":false,"chapters":[]},
			{"name":"Послание Иуды","alias":"Иуд","id":"jude","open":false,"chapters":[]},
			{"name":"Послание к Римлянам","alias":"Рим","id":"rom","open":false,"chapters":[]},
			{"name":"Первое послание к Коринфянам","alias":"Кор1","id":"cor1","open":false,"chapters":[]},
			{"name":"Второе послание к Коринфянам","alias":"Кор2","id":"cor2","open":false,"chapters":[]},
			{"name":"Послание к Галатам","alias":"Гал","id":"gal","open":false,"chapters":[]},
			{"name":"Послание к Ефесянам","alias":"Еф","id":"eph","open":false,"chapters":[]},
			{"name":"Послание к Филлиппийцам","alias":"Флп","id":"phil","open":false,"chapters":[]},
			{"name":"Послание к Колоссянам","alias":"Кол","id":"col","open":false,"chapters":[]},
			{"name":"Первое послание к Фессалоникийцам","alias":"Фес1","id":"thess1","open":false,"chapters":[]},
			{"name":"Второе послание к Фессалоникийцам","alias":"Фес2","id":"thess2","open":false,"chapters":[]},
			{"name":"Первое послание к Тимофею","alias":"Тим1","id":"tim1","open":false,"chapters":[]},
			{"name":"Второе послание к Тимофею","alias":"Тим2","id":"tim2","open":false,"chapters":[]},
			{"name":"Послание к Титу","alias":"Тит","id":"titus","open":false,"chapters":[]},
			{"name":"Послание к Филимону","alias":"Флм","id":"philem","open":false,"chapters":[]},
			{"name":"Послание к Евреям","alias":"Евр","id":"heb","open":false,"chapters":[]},
			{"name":"Откровение Иоанна Богослова","alias":"Отк","id":"rev","open":false,"chapters":[]}
		]
	}[lang]
});
angular.module('AMO').filter("BibleReference", function (amoReaderModel, amoVocab, $window) {
	return function (reference){
		var artefacts = reference.split(":"),
			lang = artefacts[0],
			bookId = artefacts[1],
			chapter = artefacts[2] ? (" " + amoVocab(getLang())["chapter"] + " " + artefacts[2]) : "",
			verse = artefacts[3] ? (" " + amoVocab(getLang())[artefacts[3].search(/(,|-)/gim) >= 0 ? "verses" : "verse"] + " " + artefacts[3]) : "",
			bookName = amoReaderModel(lang).find(function (x) {
				return x.id === bookId;
			}).name;
		return bookName + chapter + verse;
	};
	function getLang () {
		return $window.localStorage.getItem('amo-lang') || 'en';
	}
});
angular.module('AMO').constant("amoVocab", function (lang){
	return {
		ru: {
			chapter: "глава",
			chapters: "главы",
			verse: "стих",
			verses: "стихи"
		},
		en: {
			chapter: "chapter",
			chapters: "chpters",
			verse: "verse",
			verses: "verses"
		},
		ua: {
			chapter: "розділ",
			chapters: "розділи",
			verse: "вірш",
			verses: "вірші"
		},
		it: {
			chapter: "sezioni",
			chapters: "sezione",
			verse: "versetto",
			verses: "versi"
		},
		pl: {
			chapter: "sekcja",
			chapters: "sekcje",
			verse: "werset",
			verses: "wersety"
		}
	}[lang]
});

angular.module('AMO').constant("BIBLEMATRIX", function () {
	return {"gen":[31,25,24,26,32,22,24,21,29,32,32,20,17,23,20,16,27,33,37,18,34,24,20,67,34,35,45,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,33,31,22,33,26],
			"ex":[22,25,22,31,23,30,24,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,34,23,35,35,38,29,31,43,38],
			"lev":[17,16,17,35,19,30,38,36,24,20,47,8,59,56,32,34,16,30,37,27,24,33,43,23,55,46,34],
			"num":[51,34,51,49,31,27,89,26,23,36,35,15,34,44,40,50,13,32,22,29,35,41,30,25,18,65,23,31,33,17,53,42,56,29,34,13],
			"ruth":[22,23,18,22],
			"deut":[46,37,29,49,33,25,26,20,28,22,32,32,18,29,23,22,20,22,21,20,23,30,23,22,18,19,26,67,29,20,30,51,29,12],
			"josh":[18,24,17,24,16,26,26,35,27,43,22,24,33,15,63,10,18,28,51,9,45,34,16,36],
			"judg":[36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],
			"sam1":[28,36,21,22,12,22,17,22,27,27,15,25,23,52,35,23,58,30,24,43,15,23,28,23,44,25,12,25,11,31,13],
			"ezra":[11,70,13,24,17,17,28,36,15,44],
			"est":[22,23,15,17,14,14,10,17,32,3],
			"song":[16,17,11,16,16,12,14,14],
			"lam":[22,22,66,22,22],
			"neh":[11,20,32,23,19,19,73,18,38,39,36,47,31],
			"eccles":[18,26,22,17,19,12,29,17,18,20,10,14],
			"sam2":[27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25],
			"chron1":[54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30],
			"job":[22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,35,27,26,17],
			"kings1":[53,46,28,34,18,38,50,66,28,29,43,33,34,31,34,34,24,46,23,43,29,53],
			"kings2":[18,25,24,44,27,33,20,29,37,36,21,21,25,29,38,20,39,37,37,21,26,20,37,20,30],
			"prov":[33,22,35,29,23,35,27,36,18,32,31,28,26,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31],
			"chron2":[17,17,16,22,14,42,22,18,31,19,23,16,22,15,19,14,18,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23],
			"isa":[31,22,25,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,23],
			"ps":[6,13,9,9,13,11,18,10,39,8,9,6,8,6,12,16,51,15,10,14,32,7,11,23,13,15,10,12,13,25,12,22,23,29,13,41,23,14,18,14,12,5,27,18,12,10,15,21,24,21,11,7,9,24,14,12,12,18,14,9,13,12,11,14,20,8,36,37,6,24,21,29,24,11,13,21,73,14,20,17,9,19,12,15,17,7,19,53,16,17,16,6,24,12,14,13,9,9,6,9,28,23,35,44,49,44,14,32,8,11,11,10,27,9,11,3,29,177,8,9,10,5,9,6,7,5,7,9,9,4,19,4,4,22,27,10,9,25,14,11,8,13,16,22,11,12,10,15,10,7],
			"jer":[19,37,26,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,21,13,30,5,28,7,47,39,46,64,34],
			"joel":[20,32,21],
			"amos":[15,16,15,13,27,14,17,14,15],
			"obad":[21],
			"jonah":[16,11,10,11],
			"mic":[16,13,12,13,15,16,20],
			"nah":[15,13,19],
			"hos":[11,23,5,19,15,11,16,14,17,15,12,14,15,10],
			"hab":[17,20,19],
			"zeph":[18,15,20],
			"hag":[15,23],
			"mal":[14,17,18,6],
			"dan":[21,49,33,34,31,28,28,27,27,21,45,13],
			"zech":[21,13,10,14,11,15,14,23,17,12,17,14,9,21],
			"mark":[45,63,42,43,56,37,38,49,52,33,44,37,72,47,20],
			"matt":[25,22,17,25,48,33,28,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,45,75,66,20],
			"ezek":[28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,48,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35],
			"james":[27,26,18,17,20],
			"pet1":[25,25,22,19,14],
			"pet2":[21,22,18],
			"john1":[10,29,23,8,7],
			"john2":[13],
			"john3":[15],
			"jude":[25],
			"gal":[24,21,29,31,26,18],
			"eph":[23,22,21,32,33,24],
			"phil":[30,30,21,22],
			"cor2":[24,17,18,18,21,18,16,24,15,18,31,21,13],
			"john":[50,25,36,53,47,70,53,59,41,41,57,50,37,31,27,33,26,40,42,31,25],
			"rom":[32,29,31,25,21,23,25,38,33,21,36,21,14,26,33,24],
			"cor1":[31,16,23,20,13,20,40,13,27,33,34,31,13,40,58,24],
			"luke":[80,52,38,44,39,49,50,56,62,42,54,58,35,35,32,31,37,43,48,47,38,70,56,53],
			"acts":[20,44,26,37,42,15,60,40,43,47,30,25,52,28,40,40,34,28,40,38,40,30,35,27,27,32,44,31],
			"col":[16,21,19,14],
			"thess1":[10,20,13,18,28],
			"thess2":[12,16,18],
			"tim1":[20,15,16,16,25,21],
			"tim2":[18,26,17,22],
			"titus":[16,15,15],
			"philem":[24],
			"heb":[14,18,19,16,15,20,27,13,27,38,40,29,25],
			"rev":[20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21]};
});
