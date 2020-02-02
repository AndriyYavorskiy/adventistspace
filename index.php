<!doctype html>
<?php
	$booksMap = array ("gen" => "Быт","ex" => "Исх","lev" => "Лев","num" => "Чис","deut" => "Вт","josh" => "Нав",
	"judg" => "Суд","ruth" => "Руфь","sam1" => "Цар1","sam2" => "Цар3","kings1" => "Цар2","kings2" => "Цар4",
	"chron1" => "Пар1","chron2" => "Пар2","ezra" => "Езд","neh" => "Неем","est" => "Есф","job" => "Иов","ps" => "Пс",
	"prov" => "Пр","eccles" => "Ек","song" => "Песн","isa" => "Ис","jer" => "Иер","lam" => "Пл.Иер","ezek" => "Иез",
	"dan" => "Дан","hos" => "Ос","joel" => "Иоиль","amos" => "Ам","obad" => "Авд","jonah" => "Иона","mic" => "Мих",
	"nah" => "Наум","hab" => "Авв","zeph" => "Соф","hag" => "Агг","zech" => "Зах","mal" => "Мал","matt" => "Мф",
	"mark" => "Мк","luke" => "Лк","john" => "Ин","acts" => "Деян","james" => "Иак","pet1" => "Пет1","pet2" => "Пет2",
	"john1" => "Ин1","john2" => "Ин2","john3" => "Ин3","jude" => "Иуд","rom" => "Рим","cor1" => "Кор1","cor2" => "Кор2",
	"gal" => "Гал","eph" => "Еф","phil" => "Флп","col" => "Кол","thess1" => "Фес1","thess2" => "Фес2","tim1" => "Тим1",
	"tim2" => "Тим2","titus" => "Тит","philem" => "Флм","heb" => "Евр","rev" => "Отк");
	$books = array ("gen" => "Бытие","ex" => "Исход","lev" => "Левит","num" => "Числа","deut" => "Второзаконие",
		"josh" => "Книга Иисуса Навина","judg" => "Книга Судей Израилевых","ruth" => "Книга Руфь",
		"sam1" => "Первая книга Царств","sam2" => "Вторая книга Царств","kings1" => "Третья книга Царств",
		"kings2" => "Четвертая книга Царств","chron1" => "Первая книга Паралипоменон","chron2" => "Вторая книга Паралипоменон",
		"ezra" => "Книга Ездры","neh" => "Неемия","est" => "Книга Есфирь","job" => "Книга Иова","ps" => "Псалтырь",
		"prov" => "Притчи Соломона","eccles" => "Книга Екклесиаста","song" => "Песни Песней","isa" => "Книга пророка Исаии",
		"jer" => "Книга пророка Иеремии","lam" => "Плач Иеремии","ezek" => "Книга пророка Иезекииля",
		"dan" => "Книга пророка Даниила","hos" => "Книга пророка Осии","joel" => "Книга пророка Иоиля",
		"amos" => "Книга пророка Амоса","obad" => "Книга пророка Авдия","jonah" => "Книга пророка Ионы",
		"mic" => "Книга пророка Михея","nah" => "Книга пророка Наума","hab" => "Книга пророка Аввакума",
		"zeph" => "Книга пророка Софонии","hag" => "Книга пророка Аггея","zech" => "Книга пророка Захарии",
		"mal" => "Книга пророка Малахии","matt" => "Евангелие от Матфея","mark" => "Евангелие от Марка",
		"luke" => "Евангелие от Луки","john" => "Евангелие от Иоанна","acts" => "Деяния",
		"james" => "Послание Иакова","pet1" => "Первое послание Петра","pet2" => "Второе послание Петра",
		"john1" => "Первое послание Иоанна","john2" => "Второе послание Иоанна","john3" => "Третье послание Иоанна",
		"jude" => "Послание Иуды","rom" => "Послание к Римлянам","cor1" => "Первое послание к Коринфянам",
		"cor2" => "Второе послание к Коринфянам","gal" => "Послание к Галатам","eph" => "Послание к Ефесянам",
		"phil" => "Послание к Филлиппийцам","col" => "Послание к Колоссянам","thess1" => "Первое послание к Фессалоникийцам",
		"thess2" => "Второе послание к Фессалоникийцам","tim1" => "Первое послание к Тимофею",
		"tim2" => "Второе послание к Тимофею","titus" => "Послание к Титу","philem" => "Послание к Филимону",
		"heb" => "Послание к Евреям","rev" => "Откровение Иоанна Богослова"
	);
	$readParam = htmlspecialchars($_GET["read"]);
	$chunks = explode(';', $readParam);

	list($targetLang, $targetBook, $targetChapter, $targetVerse) = explode(':', $chunks[0]);
	$targetBookContent = $targetBook ? file_get_contents("scriptures/Bible_ru/" . $booksMap[$targetBook] . ".json") : '';
	$targetBookContentJson = json_decode($targetBookContent, true);
	$targetLink = $chunks[0];
	$targetMultipleVerses = strpos($targetVerse, ',') || strpos($targetVerse, '-');
	$targetVersePart = $targetVerse ? $targetMultipleVerses ? " стихи $targetVerse" : " стих $targetVerse" : "";
	$targetChapterPart = $targetChapter ? " глава $targetChapter" : "";
	$targetDescription = $books[$targetBook] ? $books[$targetBook] . $targetChapterPart . $targetVersePart : $readParam;
?>
<html lang='ru' ng-app='AMO'>
	<head>
		<title>Библия для верующих | <?php echo $targetDescription ? $targetDescription : 'изучайте с комфортом!'; ?>
		</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="keywords" content="Бог, читать библию онлайн, кто ниписал библию, библия, церковь, вера, евангелие">
		<meta name="twitter:image" content="http://adventamo.com/images/learn.jpg">
		<meta name="content-source" content="<?php echo $targetLink ? $targetLink : 'ru:john:3:16'; ?>">
		<meta name="content-data" content="<?php echo $targetBookContentJson ? $targetBookContentJson[$targetChapter - 1][$targetVerse - 1] : "Свидетельствующий сие говорит: ей, гряду скоро! Аминь. Ей, гряди, Господи Иисусе!"; ?>">
		<meta property="og:title" content="<?php
			echo $targetBookContentJson && $targetChapter && $targetVerse ? $targetBookContentJson[$targetChapter - 1][$targetVerse - 1] : "Adventamo - инструмент для глубокого изучения Библии" ?>" />
		<meta name="description" content="<?php
			echo $targetDescription ? $targetDescription : 'Изучайте Библию удобно, ищите в Библии, сохраняйте стихи, делитесь с другими!'; ?>" id="og-title">
		<meta property="og:type" content="book" />
		<meta property="og:url" content="http://adventamo.com/<?php echo $readParam ? "?read=" . $readParam : ''  ?>" />
		<meta property="og:image" content="http://adventamo.com/images/learn.jpg" />
		<base href="/">
		<link rel="shortcut icon" href="images/Fish3.png" type="image/x-icon">
		<link rel="stylesheet" href="styles/layout.css?v=3">
		<link rel="stylesheet" href="styles/general.css?v=3">
		<link rel="stylesheet" href="styles/components.css?v=3">
		<link rel="stylesheet" href="styles/inputs.css?v=3">
		<link rel="stylesheet" href="components/amoBibleReader/amoReader.css?v=3">
		<link rel='stylesheet' href='styles/bootstrap-grid.css?v=3'>
		<link rel='stylesheet' href='styles/theme.css?v=3'>
		<link rel='stylesheet' href='styles/responsive.css?v=3'>
		<link rel='stylesheet' href='styles/main-page.css?v=3'>
		<link href='http://fonts.googleapis.com/css?family=Philosopher:400,400italic,700,700italic&subset=latin,cyrillic' rel='stylesheet' type='text/css'>
		<script src='scripts/angular.js'></script>
		<script src="scripts/angular-route.js"></script>
		<script src="libs/angular-translate.min.js"></script>
		<script src="https://cdn.rawgit.com/angular-translate/bower-angular-translate-loader-static-files/2.18.1/angular-translate-loader-static-files.js"></script>
		<script src="scripts/angular-translate.js"></script>
		<script src="index.js"></script>
		<script src='scripts/amoMainCtrl.js'></script>
		<script src='pages/home/homePage.js'></script>
		<script src='pages/toLove/toLovePage.js'></script>
		<script src='components/amoToolbar.js'></script>
		<script src='components/amoBibleReader/amoReader.js'></script>
		<script src='components/amoBibleReader/amoReaderInstance.js'></script>
		<script src='components/amoBibleReader/amoReaderTools.js'></script>
		<script src='components/amoModal/amoModal.js'></script>
		<script src='components/amoAutocompleteFor/amoAutocompleteFor.js'></script>
		<script src='components/amoAutocomplete/amoAutocomplete.js'></script>
		<script src='components/amoReaderLink/amoReaderLink.js'></script>
		<script src='components/amoLangSwitcher/amoLangSwitcher.js'></script>
		<script src='components/amoChangeLangTrigger.js'></script>
		<script src='scripts/amoCommon.js'></script>
		<script src='scripts/amoDesktop.js'></script>
		<script src='scripts/amoLinksManager.js'></script>
		<script src='scripts/amoBibleReferenceFilter.js'></script>
		<script src='scripts/rightClickDirective.js'></script>
		<script src='libs/ngclipboard.js'></script>
		<script src='components/amoFullScreen/amoFullScreen.js'></script>
		<script src='components/amoTheme/amoTheme.js'></script>
		<script src='components/amoDevice/amoDevice.js'></script>
		<script src='components/amoLinks/amoLinks.js'></script>
		<script src='components/amoBibleLinks/amoBibleLinks.js'></script>
		<script src='components/amoLinksForMainPage/amoLinksForMainPage.js'></script>
		<script src='components/amoSearch/amoSearch.js'></script>
		<script src='components/navigation/navigation.js'></script>
	</head>
	<body ng-controller="amoMain as mainCtrl" amo-theme="xalkidon" amo-device="desktop">
		<amo-navigation></amo-navigation>
		<amo-theme></amo-theme>
		<amo-change-lang-trigger></amo-change-lang-trigger>
		<amo-links-for-main-page></amo-links-for-main-page>
		<main>
			<ng-view></ng-view>
		</main>
		<amo-toolbar></amo-toolbar>
		<script src='scripts/amoFullScreen.js'></script>
		<script src='components/amoSecondComingModal/amoSecondComingModal.js'></script>
	</body>
</html>