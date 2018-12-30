angular.module('AMO').component('amoBibleInstance', {
  templateUrl: "/components/amoBibleReader/amoBibleInstance.html",
	controllerAs: '$ctrl',
	bindings: {
		parent: '<'
	},
	controller: ['$scope', '$element', '$window', '$q', '$http', 'amoBibleInstanceManager', 'amoModal', 'instanceStateProvider', 'BIBLEMATRIX', 'amoReaderModel',
    function ($scope, $element, $window, $q, $http, amoBibleInstanceManager, amoModal, instanceStateProvider, BIBLEMATRIX, amoReaderModel) {
			var $ctrl = this;
			var instanceState = instanceStateProvider.generateNewState();
			var tabManager = amoBibleInstanceManager.createTabManager("navigation");
			$ctrl.navigationQuery = "";
			$ctrl.toggleBook = toggleBook;
			$ctrl.getPrevBook = getPrevBook;
			$ctrl.getNextBook = getNextBook;
			$ctrl.collapseBooks = collapseBooks;
			$ctrl.visitPlace = visitPlace;
			$ctrl.handeleVerseManipulation = handeleVerseManipulation;
			$ctrl.removeInstance = removeInstance;
			$ctrl.switchToBook = switchToBook;
			$ctrl.glideInHistory = glideInHistory;
			$ctrl.openFullScreen = openFullScreen;
			$ctrl.switchToTab = function switchToTab (tab) { tabManager.setTab(tab); };
			$ctrl.navigate = function (route) { navigate(route); };
			$ctrl.runSearch = function (event, searchParam) { runSearch(event, searchParam); }
			$ctrl.actionWithResultItem = function (event, resultReference) { actionWithResultItem(event, resultReference); }
			$ctrl.displayResults = function (state){
				$ctrl.showResults = state;
			}
			$ctrl.currentTabIs = function (tab) {
				return tabManager.checkTab(tab) === tab;
			}
			$ctrl.closeBook = function (book) {
				book.open = false;
			}
			$scope.$on("appeal:process-end", function () {
				$ctrl.inProcess = false;
			});
			$element.on("click", selectText);
			$scope.$on("$destroy", function () {
				$scope.$emit("appeal:add-bookmark", $ctrl.reference);
			});
			$ctrl.referenceRegex = /^(ru|ua|en){1}(:\w{2,})?(:\d+)?(:\d+((-\d+)?|(,\d+)*)?)?$/gim;
			$ctrl.history = [];
			$ctrl.inProcess = false;
			$ctrl.showResults = false;
			$ctrl.booksToSearchIn = {option: "selected"};
			$ctrl.searchParam = "";
			$ctrl.searchResultsLimit = 24;
			$ctrl.verseActions = [
				{
					text: 'Открыть в новом окне',
					callback: openNewWindow
				},
				{
					text: 'Поделиться',
					callback: shareReference
				},
			  {
					text:"Сохранить", 
					callback: function () {
						$ctrl.parent.displayLinksMaster($ctrl.candidate)
					},
					disabled: false
			  }
			];
			function shareReference () {
				navigate($ctrl.candidate);
				$ctrl.switchToTab('share');
			} 
			/*
			  ,
			  {
				text:"Копировать ссылку", 
				callback: cb,
				disabled: false
			  },
			  {
				text:"Копировать текст", 
				callback: cb,
				disabled: false
			  },
			  {
				text:"Найти похожие стихи", 
				callback: cb,
				disabled: false
			  }
			*/
			function openNewWindow () {
				$scope.$emit("appeal:add-instance", $ctrl.candidate);
			}
			$ctrl.setCandidate = setCandidate;
			function setCandidate (ref) {
				$ctrl.candidate = ref;
			}
			$ctrl.$onInit = function () {
				init("ru");
			};
			$ctrl.switchToTab("navigation");
			function init (lang, reference) {
				instanceState.setLang(lang);
				$ctrl.lang = lang;
				$http.get('/components/amoBibleReader/amoReader_' + lang + '.json').then(function (response) {
					$ctrl.books = response.data.map(function (book) {
						book.open = false;
						book.checked = false;
            book.lang = lang;
            book.state = false;
            book.chapters = [];
						return book;
					});
					setTimeout(function () {
						navigate(reference || getInitialReference());
					}, 0);
				});
			}

			function openFullScreen (ref) {
				var id = instanceState.parseReference(ref).copy().book,
				  data = { book: getBookModelById(id), reference: $ctrl.reference };

				amoModal.open({component: 'amo-full-screen', parent: $element[0], data: data});
			}
			function discardIrrelevantHistory () {
				$ctrl.history.forEach(function (histItem, index) {
					if (histItem.isCurrent) {
						$ctrl.history = $ctrl.history.slice(index, $ctrl.history.length);
						return;
					}
				});
			}
			function glideInHistory (dest) {
				if (typeof dest === "object") {
					$ctrl.history.forEach(function (dst) {
						if (dst.isCurrent) { dst.isCurrent = false; }
					});
					dest.isCurrent = true;
					_fitToTheRef(dest.ref);
					return;
				}
				var shiftDirect = dest,
					destination;

				if (($ctrl.history[0].isCurrent && (shiftDirect === 1)) || ($ctrl.history[$ctrl.history.length - 1].isCurrent && !shiftDirect)) {
					return;
				}
				for (var i = 0, l = $ctrl.history.length; i < l; i++) {
					if ($ctrl.history[i].isCurrent) {
						$ctrl.history[i].isCurrent = false;
						destination = $ctrl.history[i - shiftDirect];
						i = l;
					}
				}
				destination.isCurrent = true;
				_fitToTheRef(destination.ref);
			} 
			function runSearch (event, searchParam) {
				if (event.which && event.which !== 13 && event.type !== "click" || !searchParam) { return; }
				var numOfPromices = 0;
				$ctrl.searchResultsLimit = 24;
				$ctrl.searchParam = searchParam;
				$ctrl.inProcess = true;
				$ctrl.searchResults = [];
				$ctrl.books.forEach(function (book, index) {
					if (index + 1 === $ctrl.books.length && !numOfPromices) {
						$ctrl.inProcess = false;
					}
					if($ctrl.booksToSearchIn.option === "selected" && !book.checked && !book.open) {
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
								$ctrl.inProcess = false;
							}
						});
					}
				});
				$ctrl.showResults = true;
			};
			function actionWithResultItem (event, resultReference) {
				if (event.which == 2 || event.button == 4) {
					event.preventDefault();
					$scope.$emit("appeal:add-instance", resultReference);
					return;
				 }
				 if (event.altKey) {
					$scope.$emit("appeal:add-instance", resultReference);
				 }
				navigate(resultReference);
				$ctrl.displayResults(false);
			}
			function pushIfAnyData (chank) {
				if (chank && chank.length) {
					$ctrl.searchResults = $ctrl.searchResults.concat(chank);
				}
			}
			function switchToBook (link) {
				navigate(link);
			}
			function selectText(e) {
				if (e.target.classList.contains('verse')) {
					angular.element(e.target).toggleClass("spotlight");
				}
			}
			function handeleVerseManipulation(event, ref) {
				var reference = $ctrl.lang.toLowerCase() + ":" + ref;
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
					$scope.$emit("appeal:add-instance", reference);
				}
			}
			function removeInstance() {
				$scope.$emit("appeal:remove-instance", $element);
				$scope.$destroy();
			}
			function getInitialReference () {
				if ($element[0].attributes.reference) {
					return $element[0].attributes.reference.value;
				} else if ($window.location.hash) {
					return $window.location.hash.replace("#", "");
				} else {
					var lastBookmark = amoBibleInstanceManager.remindLastState();
					return lastBookmark ? lastBookmark : "ru:matt:1";
				}
			}
			function navigate (route) {
				var relevantRef = $ctrl.reference,
					routeParams = (typeof route === "string") ?
					  instanceState.parseReference(route).copy() :
						instanceState.extendWith(route).copy(),
					newReference = instanceState.getReference();

				try {
					_fitToTheRef(routeParams);
				} catch (error) {
					console.error("Navigation failed to navigate reference: " + $ctrl.reference, error);
					instanceState.parseReference(relevantRef);
					_fitToTheRef(relevantRef);

					return;
				}
				$ctrl.reference = newReference;
				var lastPlace = $ctrl.history[0];
				if (lastPlace && !lastPlace.isCurrent) {
					discardIrrelevantHistory();
				}
				if ($ctrl.history[0]) {
					$ctrl.history[0].isCurrent = false;
				}
				$ctrl.history.unshift({ref: newReference, timeStamp: new Date().valueOf(), isCurrent: true});
			}
			function _fitToTheRef (routeParams) {
				var route;
				
				if (typeof routeParams === "string") {
					route = instanceState.parseReference(routeParams).copy();
				} else {
					route = instanceState.extendWith(routeParams).copy();
				}
				if (Object.keys(route).indexOf("book") > -1) {
					$ctrl.reference = instanceState.setBook(route.book).getReference();
					$ctrl.state = {book: getBookModelById(route.book)};
				}
				if (Object.keys(route).indexOf("chapter") > -1) {
					$ctrl.reference = instanceState.setChapter(route.chapter).getReference();
					var freshChapterNum = route.chapter > 0 ? route.chapter - 1 : 0,
						map = new Array(BIBLEMATRIX()[instanceState.copy().book][freshChapterNum]).fill(true);
					map.forEach(function (item, index){
						map[index] = index + 1;
					});
					$ctrl.state.chapterMap = map;
					$ctrl.state.chapterIndex = freshChapterNum;
				}
				if (Object.keys(route).indexOf("verse") > -1) {
					$ctrl.reference = instanceState.setVerse(route.verse).getReference();
					$ctrl.state.verseIndex = route.verse.toString().split(/(-|,)/i)[0] - 1; // this string is needed for navigation agents
				}
				if (!$ctrl.state.book.chapters.length) {
					loadBookData(route.book).then(function (response) {
						$ctrl.state.book.chapters = response.data;
						$ctrl.reference = instanceState.getReference();
						$ctrl.state.book.open = true;
						setTimeout(function () {
							visitPlace($ctrl.reference);
						}, 0);
					});
				} else {
					$ctrl.state.book.open = true;
					setTimeout(function () {
						visitPlace($ctrl.reference);
					}, 0);
				}
			}
			function collapseBooks () {
				this.books.forEach(function (book) {
					book.open = false;
				});
			}
			function getPrevBook (reference) {
				var books = $ctrl.books;
				var prevBook;
				books.forEach(function (book, index) {
					if (book.id === instanceState.parseReference(reference).copy().book){
						prevBook = books[(index || 1) - 1];
					}
				});
				return prevBook;
			}
			function getNextBook (reference) {
				var books = $ctrl.books;
				var nextBook;
				books.forEach(function (book, index) {
					if (book.id === instanceState.parseReference(reference).copy().book){
						nextBook = books[(index < 65 ? index : 64) + 1];
					}
				});
				return nextBook;
			}
			function toggleBook (target) {
				var book;
				
				if (target.alias){
					book = target;
				} else {
					book = getBookModelById(target)
				}
				if (!book.open) {
					navigate({book: book.id, chapter: 0, verse: 0});
				} else {
					book.open = false;
				}
			}
			function loadBookData (target) {
				var book, deferred = $q.defer();
					
				if (target.alias){
					book = target;
				} else {
					book = getBookModelById(target)
				}
				if (!book.chapters.length) {
					amoBibleInstanceManager.loadBookModel(book).then(function (response) {
						book.chapters = response.data;
						return deferred.resolve(response);
					}, function (reason) {
						return deferred.reject(reason);
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
						$element[0].querySelector("#" + bookSelector + chapterSelector + " .verse:nth-child(" + versesList[i] + ")").classList.add('spotlight');
					}
				}
				goToDOMelement(targetSelector);
			}
			function getBookModelById (id) {
				if ($ctrl.books.find) {
					return $ctrl.books.find(function (b) {  
						return b.id === id;
					});
				} else {
					for (var i = 0, l = $ctrl.books.length; i < l; i++) {
						if ($ctrl.books[i].id === id) {
							return $ctrl.books[i];
						}
					}
				}
			}
			function goToDOMelement (selector) {
				$element[0].querySelector(selector).scrollIntoView();
			}
		}]
	});
