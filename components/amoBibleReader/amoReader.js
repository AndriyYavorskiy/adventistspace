console.log('http://adventamo.com/#ru:ezek:20:19');
angular.module('AMO').component('amoReader', {
	template: `
		<div class="readers-wrapper">
			<button class="btn m blank close-modal" ng-click="reader.closeModal()">✖</button>
			<div class="books-wrapper">
				<div class="reader-toolbar"></div>
			</div>
		</div>
	`,
	bindings: {
		closeModal: '<',
		data: '<'
	},
	controllerAs: 'reader',
	controller: ['$scope', '$element', '$compile', '$window', 'amoBibleInstanceManager', '$rootScope',
	  function ($scope, $element, $compile, $window, amoBibleInstanceManager) {
			var reader = this;
			this.addInstance = addInstance;
			this.$onInit = function () {
				init();
			}
			$scope.$on('appeal:add-bookmark', function (event, ref) {
				amoBibleInstanceManager.addToLastBookmarks(ref);
			});
			$scope.$on('appeal:add-instance', function (event, ref) {
				addInstance(ref);
			});
			$scope.$on('appeal:remove-instance', function (event, node) {
				var readersParent = node[0].parentNode;
				node.remove();
				if (!readersParent.querySelector('.book-wrapper')) {
					reader.closeModal();
					$scope.$destroy();
				}
			});
			$scope.$on('$destroy', function () {
				amoBibleInstanceManager.clearLastBookmarks();
			});
			function init () {
				var state = getLastState();
				if (state instanceof Array) {
					state.forEach(function (ref) {
						addInstance(ref);
					});	
				} else {
					addInstance(state);
				}
			}
			function addInstance (reference) {
				var template = angular.element("<div amo-bible-instance='" + reference + "' class='book-wrapper'></div>");

				angular.element($element[0].querySelector(".books-wrapper")).append(template[0]);
				$compile(template)($scope.$new());
			}
			function getLastState () {
				if (reader.data && reader.data.reference) {
					return reader.data.reference;
				} else if ($window.location.hash) {
					return $window.location.hash.replace("#", "");
				} else {
					var lastBookmark = amoBibleInstanceManager.remindLastState();
					return lastBookmark.length ? lastBookmark : "ru:matt:1";
				}
			}
	  }
	]
});

angular.module('AMO').directive('amoBibleInstance', function ($window,
											$q, $http,
											amoBibleInstanceManager,
											amoModal,
											instanceStateProvider,
											BIBLEMATRIX){
		var ob = {};
		ob.templateUrl = "/components/amoBibleReader/amoBibleInstance.html";
		ob.restrict = "EA";
		ob.link = function (scope, element, attrs) {
			var instanceState = instanceStateProvider.generateNewState(),
				tabManager = amoBibleInstanceManager.createTabManager("navigation");
			
			scope.bibleBook = "";
			scope.toggleBook = toggleBook;
			scope.getPrevBook = getPrevBook;
			scope.getNextBook = getNextBook;
			scope.collapseBooks = collapseBooks;
			scope.visitPlace = visitPlace;
			scope.handeleVerseManipulation = handeleVerseManipulation;
			scope.removeInstance = removeInstance;
			scope.switchToBook = switchToBook;
			scope.glideInHistory = glideInHistory;
			scope.openFullScreen = openFullScreen;
			scope.switchToTab = function switchToTab (tab) { tabManager.setTab(tab); };
			scope.navigate = function (route) { navigate(route); };
			scope.runSearch = function (event, searchParam) { runSearch(event, searchParam); }
			scope.actionWithResultItem = function (event, resultReference) { actionWithResultItem(event, resultReference); }
			scope.displayResults = function (state){
				scope.showResults = state;
			}
			scope.currentTabIs = function (tab) {
				return tabManager.checkTab(tab) === tab;
			}
			scope.closeBook = function (book) {
				book.open = false;
			}
			scope.$on("appeal:process-end", function () {
				scope.inProcess = false;
			});
			element.on("click", selectText);
			scope.$on("$destroy", function () {
				scope.$emit("appeal:add-bookmark", scope.reference);
			});
			scope.referenceRegex = /^(ru|ua|en){1}(:\w{2,})?(:\d+)?(:\d+((-\d+)?|(,\d+)*)?)?$/gim;
			scope.history = [];
			scope.inProcess = false;
			scope.showResults = false;
			scope.booksToSearchIn = {option: "selected"};
			scope.searchParam = "";
			scope.searchResultsLimit = 24;
			scope.verseActions = [
				{
					text: "Відкрити у новиму вікні",
					callback: openNewWindow
				},
				{
					text: "Поділитися",
					callback: shareReference
				}
			];
			function shareReference () {
				navigate(scope.candidate);
				scope.switchToTab('share');
			} 
			/*
			  ,
			  {
				text:"Зберегти", 
				callback: saveRef,
				disabled: false
			  },
			  {
				text:"Копіювати посилання", 
				callback: saveRef,
				disabled: false
			  },
			  {
				text:"Копіювати текст", 
				callback: saveRef,
				disabled: false
			  },
			  {
				text:"Закрити книгу", 
				callback: saveRef,
				disabled: false
			  },
			  {
				text:"Копіювати текст", 
				callback: saveRef,
				disabled: false
			  }
			*/
			function openNewWindow () {
				scope.$emit("appeal:add-instance", scope.candidate);
			}
			function saveRef () {}
			scope.setCandidate = setCandidate;
			function setCandidate (ref) {
				scope.candidate = ref;
			}
			init("ru");
			scope.switchToTab("navigation");
			function init (lang, reference) {
				instanceState.setLang(lang);
				scope.lang = lang;
				$http.get('/components/amoBibleReader/amoReader_' + lang + '.json').then(function (response) {
					var initialModel = response.data.map(function (book) {
						book.open = false;
						book.checked = false;
						book.lang = lang;
						return book;
					});
					
					scope.books = response.data;
					setTimeout(function () {
						var ref = scope.reference;

						navigate(reference || getInitialReference());
					}, 0);
					/*ids = ["Gen","Ex","Lev","Num","Deut","Josh","Judg","Ruth","Sam1","Sam2","Kings1","Kings2","Chron1","Chron2","Ezra","Neh","Est","Job","Ps","Prov","Eccles","Song","Isa","Jer","Lam","Ezek","Dan","Hos","Joel","Amos","Obad","Jonah","Mic","Nah","Hab","Zeph","Hag","Zech","Mal","Matt","Mark","Luke","John","Acts","Rom","Cor1","Cor2","Gal","Eph","Phil","Col","Thess1","Thess2","Tim1","Tim2","Titus","Philem","Heb","James","Pet1","Pet2","John1","John2","John3","Jude","Rev"];
					idsRu = ["Gen","Ex","Lev","Num","Deut","Josh","Judg","Ruth","Sam1","Sam2","Kings1","Kings2","Chron1","Chron2","Ezra","Neh","Est","Job","Ps","Prov","Eccles","Song","Isa","Jer","Lam","Ezek","Dan","Hos","Joel","Amos","Obad","Jonah","Mic","Nah","Hab","Zeph","Hag","Zech","Mal","Matt","Mark","Luke","John","Acts","James","Pet1","Pet2","John1","John2","John3","Jude","Rom","Cor1","Cor2","Gal","Eph","Phil","Col","Thess1","Thess2","Tim1","Tim2","Titus","Philem","Heb","Rev"];
					var blank = angular.copy(scope.books.map(function (book, index) {
						book.open = false;
						book.chapters = [];
						book.id = idsRu[index].toLowerCase();
						return book;
					})), bl = JSON.stringify(blank), x = 66;
					while (bl.indexOf("},{") && x > 0) {
						bl = bl.replace("},{", "},\n{");
						x--;
						console.log('-');
					}
					console.table(bl);*/
				});
			}

			function openFullScreen (ref) {
				var id = instanceState.parseReference(ref).copy().book,
				  data = { book: getBookModelById(id), reference: scope.reference };

				amoModal.open({component: 'amo-full-screen', parent: element[0], data: data});
			}
			/*function PREPAREMATRIX() {
				var idsRu = ["Gen","Ex","Lev","Num","Deut","Josh","Judg","Ruth","Sam1","Sam2","Kings1","Kings2","Chron1","Chron2","Ezra","Neh","Est","Job","Ps","Prov","Eccles","Song","Isa","Jer","Lam","Ezek","Dan","Hos","Joel","Amos","Obad","Jonah","Mic","Nah","Hab","Zeph","Hag","Zech","Mal","Matt","Mark","Luke","John","Acts","James","Pet1","Pet2","John1","John2","John3","Jude","Rom","Cor1","Cor2","Gal","Eph","Phil","Col","Thess1","Thess2","Tim1","Tim2","Titus","Philem","Heb","Rev"];
				var blank = {};
				scope.books.forEach(function (book, index) {
					var bookId = idsRu[index].toLowerCase(),
						bookAlias = book.alias;
					//blank[bookId] = [];
					$http.get("/scriptures/Bible_ru/" + bookAlias + ".json").then(function (response) {
						var matrix = [], id = bookId;
						response.data.forEach(function (chapter, index) {
							matrix[index] = chapter.length;
						});
						blank[id] = matrix;
						//console.log(blank);
					});
				});
				setTimeout(function () {
					var bl = JSON.stringify(blank), x = 66;
					while (bl.indexOf("},{") && x > 0) {
						bl = bl.replace("],\"", "],\n\"");
						x--;
						console.log('-');
					}
					console.table(bl);
				}, 1000);
			}*/
			function discardIrrelevantHistory () {
				scope.history.forEach(function (histItem, index) {
					if (histItem.isCurrent) {
						scope.history = scope.history.slice(index, scope.history.length);
						return;
					}
				});
			}
			function glideInHistory (dest) {
				if (typeof dest === "object") {
					var destIndex = scope.history.indexOf(dest);

					scope.history.forEach(function (dst) {
						if (dst.isCurrent) { dst.isCurrent = false; }
					});
					dest.isCurrent = true;
					_fitToTheRef(dest.ref);
					return;
				}
				var shiftDirect = dest,
					destination;

				if ((scope.history[0].isCurrent && (shiftDirect === 1)) || (scope.history[scope.history.length - 1].isCurrent && !shiftDirect)) {
					return;
				}
				for (var i = 0, l = scope.history.length; i < l; i++) {
					if (scope.history[i].isCurrent) {
						scope.history[i].isCurrent = false;
						destination = scope.history[i - shiftDirect];
						i = l;
					}
				}
				destination.isCurrent = true;
				_fitToTheRef(destination.ref);
			} 
			function runSearch (event, searchParam) {
				if (event.which && event.which !== 13 && event.type !== "click" || !searchParam) { return; }
				var reports = 1, numOfPromices = 0;
				scope.searchResultsLimit = 24;
				scope.searchParam = searchParam;
				scope.inProcess = true;
				scope.searchResults = [];
				scope.books.forEach(function (book, index) {
					if (index + 1 === scope.books.length && !numOfPromices) {
						scope.inProcess = false;
					}
					if(scope.booksToSearchIn.option === "selected" && !book.checked && !book.open) {
						return;
					}
					if (book.chapters.length) {
						pushIfAnyData(amoBibleInstanceManager.executeSearchInBook(book, searchParam));
					} else {
						numOfPromices++;
						amoBibleInstanceManager.loadBookModel(book).then(function (response) {
							numOfPromices--;
							book.chapters = response.data;
							pushIfAnyData(amoBibleInstanceManager.executeSearchInBook(book, searchParam));
							if (!numOfPromices) {
								scope.inProcess = false;
							}
						});
					}
				});
				scope.showResults = true;
			};
			function actionWithResultItem (event, resultReference) {
				if (event.which == 2 || event.button == 4) {
					event.preventDefault();
					scope.$emit("appeal:add-instance", resultReference);
					return;
				 }
				 if (event.altKey) {
					scope.$emit("appeal:add-instance", resultReference);
				 }
				navigate(resultReference);
				scope.displayResults(false);
			}
			function pushIfAnyData (chank) {
				if (chank && chank.length) {
					scope.searchResults = scope.searchResults.concat(chank);
				}
			}
			function switchToBook (book) {
				navigate({book: book.id, chapter: 0, verse: 0});
				scope.bibleBook = book.name;
			}
			function selectText(e) {
				if (e.target.classList.contains('verse')) {
					angular.element(e.target).toggleClass("spotlight");
				}
			}
			function handeleVerseManipulation(event, ref) {
				var reference = scope.lang.toLowerCase() + ":" + ref;
				if (event.which == 2 || event.button == 4) {
				   event.preventDefault();
				   notifyReader();
				}
				if (event.altKey) {
					notifyReader();
				}
				if (event.ctrlKey) {
					navigate(reference);
				}
				function notifyReader() {
					scope.$emit("appeal:add-instance", reference);
				}
			}
			function removeInstance() {
				scope.$emit("appeal:remove-instance", element);
				scope.$destroy();
			}
			function getInitialReference () {
				if (attrs.amoBibleInstance) {
					return attrs.amoBibleInstance;
				} else if ($window.location.hash) {
					return $window.location.hash.replace("#", "");
				} else {
					var lastBookmark = amoBibleInstanceManager.remindLastState();
					return lastBookmark ? lastBookmark : "ru:matt:1";
				}
			}
			function navigate (route) {
				var relevantRef = scope.reference,
					routeParams = (typeof route === "string") ?
								  instanceState.parseReference(route).copy() :
								  instanceState.extendWith(route).copy(),
					newReference = instanceState.getReference();

				try {
					_fitToTheRef(routeParams);
				} catch (error) {
					console.error("Navigation failed to navigate reference: " + scope.reference, error);
					instanceState.parseReference(relevantRef);
					_fitToTheRef(relevantRef);

					return;
				}
				scope.reference = newReference;
				var lastPlace = scope.history[0];
				if (lastPlace && !lastPlace.isCurrent) {
					discardIrrelevantHistory();
				}
				if (scope.history[0]) {
					scope.history[0].isCurrent = false;
				}
				scope.history.unshift({ref: newReference, timeStamp: new Date().valueOf(), isCurrent: true});
			}
			function _fitToTheRef (routeParams) {
				var route;
				
				if (typeof routeParams === "string") {
					route = instanceState.parseReference(routeParams).copy();
				} else {
					route = instanceState.extendWith(routeParams).copy();
				}
				if (Object.keys(route).indexOf("book") > -1) {
					scope.reference = instanceState.setBook(route.book).getReference();
					scope.state = {book: getBookModelById(route.book)};
				}
				if (Object.keys(route).indexOf("chapter") > -1) {
					scope.reference = instanceState.setChapter(route.chapter).getReference();
					var freshChapterNum = route.chapter > 0 ? route.chapter - 1 : 0,
						map = new Array(BIBLEMATRIX()[instanceState.copy().book][freshChapterNum]).fill(true);
					map.forEach(function (item, index){
						map[index] = index + 1;
					});
					scope.state.chapterMap = map;
					scope.state.chapterIndex = freshChapterNum;
				}
				if (Object.keys(route).indexOf("verse") > -1) {
					scope.reference = instanceState.setVerse(route.verse).getReference();
					scope.state.verseIndex = route.verse.toString().split(/(-|,)/i)[0] - 1; // this string is needed for navigation agents
				}
				if (!scope.state.book.chapters.length) {
					loadBookData(route.book).then(function (response) {
						scope.state.book.chapters = response.data;
						scope.reference = instanceState.getReference();
						scope.state.book.open = true;
						setTimeout(function () {
							visitPlace(scope.reference);
						}, 0);
					});
				} else {
					scope.state.book.open = true;
					setTimeout(function () {
						visitPlace(scope.reference);
					}, 0);
				}
			}
			function collapseBooks () {
				this.books.forEach(function (book) {
					book.open = false;
				});
			}
			function getPrevBook (reference) {
				var prevBook;
				scope.books.forEach(function (book, index) {
					if (book.id === scope.state.book.id){
						prevBook = scope.books[(index || 1) - 1];
					}
				});
				return prevBook;
			}
			function getNextBook (reference) {
				var nextBook;
				scope.books.forEach(function (book, index) {
					if (book.id === scope.state.book.id){
						nextBook = scope.books[(index < 65 ? index : 64) + 1];
					}
				});
				return nextBook;
			}
			function toggleBook (target) {
				var book, stateCopy;
				
				if (target.alias){
					book = target;
				} else {
					book = getBookModelById(target)
				}
				if (!book.open) {
					navigate({book: book.id, chapter: 0, verse: 0});
				} else {
					book.open = false;
					/*stateCopy = instanceState.copy();
					visitPlace(stateCopy.lang + ":" + stateCopy.book);*/
				}
			}
			function loadBookData (target) {
				var book, promise = {then: function (f) {f({data: book.chapters})}}, 
					deferred = $q.defer();
					
				if (target.alias){
					book = target;
				} else {
					book = getBookModelById(target)
				}
				if (!book.chapters.length) {
					promise = amoBibleInstanceManager.loadBookModel(book).then(function (response) {
						book.chapters = response.data;
						return deferred.resolve(response);
					}, function (reason) {
						return deferred.reject;
					});
				}
				return deferred.promise;
			}
			function visitPlace(ref) {
				if (!ref) {
					console.warn("No reference passed to visit!");
					return;}
				if (!amoBibleInstanceManager.isValidReference(ref)) {
					throw new Error("Incorrect reference:" + ref + ".");
					return;
				}
				var hashParts = ref.replace("#").split(":"),
					lang = hashParts[0], versesList = [],
					bookSelector = hashParts.length >= 2 ? hashParts[1] : "",
					chapterSelector = hashParts.length >= 3 ? " .chapter:nth-child(" + parseInt(hashParts[2], 10) + ")" : "",
					verseSelector = hashParts.length === 4 ? " .verse:nth-child(" + hashParts[3].split(/(-|,)/i)[0] + ")" : "",
					targetSelector = "#" + bookSelector + chapterSelector + verseSelector;
				if (verseSelector) {
					versesList = amoBibleInstanceManager.decodeVersesList(hashParts[3])
					for (var i = 0, l = versesList.length; i < l; i++) {
						element[0].querySelector("#" + bookSelector + chapterSelector + " .verse:nth-child(" + versesList[i] + ")").classList.add('spotlight');
					}
				}
				goToDOMelement(targetSelector);
			}
			function getBookModelById (id) {
				if (scope.books.find) {
					return scope.books.find(function (b) {  
						return b.id === id;
					});
				} else {
					for (var i = 0, l = scope.books.length; i < l; i++) {
						if (scope.books[i].id === id) {
							return scope.books[i];
						}
					}
				}
			}
			function goToDOMelement (selector) {
				element[0].querySelector(selector).scrollIntoView();
			}
		}
		return ob;
	});
