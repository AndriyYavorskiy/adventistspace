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
	$chunks = spliti('\|', $readParam);

	list($targetLang, $targetBook, $targetChapter, $targetVerse) = split(':', $chunks[0]);
	$targetBookContent = file_get_contents("scriptures/Bible_ru/" . $booksMap[$targetBook] . ".json");
	$targetBookContentJson = json_decode($targetBookContent, true);
	$targetLink = $chunks[0];
	$targetMultipleVerses = strpos($targetVerse, ',') || strpos($targetVerse, '-');
	$targetVersePart = $targetVerse ? $targetMultipleVerses ? " стихи $targetVerse" : " стих $targetVerse" : "";
	$targetChapterPart = $targetChapter ? " глава $targetChapter" : "";
	$targetDescription = $books[$targetBook] ? $books[$targetBook] . $targetChapterPart . $targetVersePart : $readParam;

/*for ($i = 0; $i < count($chunks); $i++) {
	list($lang, $book, $chapter, $verse) = split(':', $chunks[$i]);

	$multipleVerses = strpos($verse, ',') || strpos($verse, '-');
	$versePart = $verse ? $multipleVerses ? " стихи $verse" : " стих $verse" : "";

	$chapterPart = $chapter ? " глава $chapter" : "";
	$description = $books[$book] ? "<br />\n $books[$book]" . $chapterPart . $versePart : $readParam;
	echo $description;
}*/
?>
<html lang='ru' ng-app='AMO'>
	<head>
		<title>Библия для верующих | <?php echo $targetDescription ? $targetDescription : 'изучайте с комфортом!'; ?>
		</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="keywords" content="Бог, читать библию онлайн, кто ниписал библию, библия, церковь, вера, евангелие">
		<meta name="twitter:image" content="http://adventamo.com/images/learn.jpg">
		<meta property="og:title" content="<?php
			echo $targetBookContentJson && $targetChapter && $targetVerse ? $targetBookContentJson[$targetChapter - 1][$targetVerse - 1] : "Adventamo - инструмент для голубокого изучения Библии" ?>" />
		<meta name="description" content="<?php
			echo $targetDescription ? $targetDescription : 'Изучайте Библию удобно, ищите в Библии, сохраняйте стихи, делитесь с другими!'; ?>" id="og-title">
		<meta property="og:type" content="book" />
		<meta property="og:url" content="http://adventamo.com/<?php echo $readParam ? "?read=" . $readParam : ''  ?>" />
		<meta property="og:image" content="http://adventamo.com/images/learn.jpg" />

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
		<script src="libs/angular-translate.min.js"></script>
		<script src="https://cdn.rawgit.com/angular-translate/bower-angular-translate-loader-static-files/2.18.1/angular-translate-loader-static-files.js"></script>
		<script src="scripts/angular-translate.js"></script>
		<script src="index.js"></script>
		<script src='scripts/amoMainCtrl.js'></script>
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
	</head>
	<body ng-controller="amoMain as mainCtrl" amo-theme="xalkidon" amo-device="desktop">
		<amo-theme></amo-theme>
		<amo-change-lang-trigger></amo-change-lang-trigger>
		<amo-links-for-main-page></amo-links-for-main-page>
		<div class="amo-search-for-main-page">
			<div class="container">
				<div class="row">
					<amo-search class="col-sm-12 col-md-10 col-lg-6"></amo-search>
				</div>
			</div>
		</div>
		<main>
			<div class="desktop module" amo-desktop>
				<div class='slide column'>
					<div class='message'>
						<h1 style="max-width: 960px;">
							<?php echo $targetBookContentJson ? $targetBookContentJson[$targetChapter - 1][$targetVerse - 1] : "Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий, верующий в Него, не погиб, но имел жизнь вечную."; ?>
            </h1>
						<p class='source' amo-reader-link="<?php echo $targetLink ? $targetLink : 'ru:john:3:16'; ?>" auto-text></p>
						<div style="text-align: center; margin-top: 32px;">
              <!--button class="btn l empty drop-shadow">Читать о Библии</button-->
							<button class="btn l solid drop-shadow" amo-reader-link>Читать Библию</button>
						</div>
					</div>
				</div>
				<div class='slide field absolute'></div>
			</div>
			<div class="module">
				<div class='container'>
					<div class="row" style="margin-top: 36px;">
						<div class="col-lg-12 statement">
							Библия состоит из множества книг и написана многими авторами, но все они руководились Богом.  
							Это книга с притчами, но большая ее часть это реальные истории и пророчества. Библия дана человеку чтобы учиться мудрсти и расти духовно.
						</div>
					</div>
					<div class='columns row'>
						<div class='column col-lg-3 col-md-4 col-sm-6 col-xs-12'>
							<p class="verse-text">
								7 Главное — мудрость: приобретай мудрость, и всем имением твоим приобретай разум. 
							</p>
							<p class='autor' amo-reader-link="ru:prov:4:7">Соломон | Притчи 4:7</p>
							<p class="verse-text">
								Вникай в себя и в учение; занимайся сим постоянно: ибо, так поступая, и себя спасешь и слушающих тебя
							</p>
							<p class='autor' amo-reader-link="ru:tim1:4:16" auto-text></p>
						</div>
						<div class="column col-lg-3 col-md-4 col-sm-6 col-xs-12">
							<p class="verse-text"> Исследуйте Писания, ибо вы думаете чрез них иметь жизнь вечную; а они свидетельствуют о Мне</p>
							<p class='autor' amo-reader-link="ru:john:5:39" auto-text></p>
						</div>
						<div class="column col-lg-3 col-md-4 col-sm-6 col-xs-12">
							<p class="verse-text">Ибо никогда пророчество не было произносимо по воле человеческой, но изрекали его святые Божии человеки, будучи движимы Духом Святым.</p>
							<p class='autor' amo-reader-link="ru:pet2:1:21" auto-text></p>
						</div>
						<div class="column col-lg-3 col-md-4 col-sm-6 col-xs-12">
							<p class="verse-text">Кто приносит в жертву хвалу, тот чтит Меня, и кто наблюдает за путем своим, тому явлю Я спасение Божие".</p>
							<p class='autor' amo-reader-link="ru:ps:49:24" auto-text></p>
						</div>
						<div class='column col-lg-3 col-md-12 col-sm-6 col-xs-12'>
							<p class="verse-text">
								Слово Христово да вселяется в вас обильно, со всякою премудростью; научайте и вразумляйте друг друга псалмами, славословием и духовными песнями, во благодати воспевая в сердцах ваших Господу.. 
							</p>
							<p class='autor' amo-reader-link="ru:col:3:16">Слова апостола Павла | Послание Колоссянам глава 3 стих 16</p>
						</div>
					</div>
				</div>
			</div>
			<div class='module'>
				<div class='slide column'>
					<div class='message'>
						<h1>Положитесь на Господа</h1>
						<section>
							<p class="verse-text">	
								Ибо только Я знаю намерения, какие имею о вас, говорит Господь, намерения во благо, а не на зло, чтобы дать вам будущность и надежду.
							</p>
						</section>
						<p class='source' amo-reader-link="ru:jer:29:11" auto-text></p>
					</div>
				</div>
				<div class='slide trust mt-400px absolute'></div>
				<div class="container">
					<div class='columns row'>
						<div class='column col-lg-4 col-md-4 col-sm-6'>
							<p class="verse-text">4 Уповай на Господа и делай добро; живи на земле и храни истину.</p>
							<p class="verse-text">5 Утешайся Господом, и Он исполнит желания сердца твоего.</p>
							<p class="verse-text">6 Предай Господу путь твой и уповай на Него, и Он совершит,</p>
							<p class="verse-text">7 и выведет, как свет, правду твою и справедливость твою, как полдень.</p>
							<p class="verse-text">8 Покорись Господу и надейся на Него. Не ревнуй успевающему в пути своем, человеку лукавствующему.</p>
							<p class='autor' amo-reader-link="ru:ps:36:4-8" auto-text></p>
						</div>
						<div class='column col-lg-4 col-md-4 col-sm-6'>
							<p class="verse-text">5 Надейся на Господа всем сердцем твоим, и не полагайся на разум твой.</p>
							<p class="verse-text">6 Во всех путях твоих познавай Его, и Он направит стези твои.</p>
							<p class='autor' amo-reader-link="ru:prov:3:5,6" auto-text></p>
						</div>
						<div class='column col-lg-4 col-md-4 col-sm-6'>
							<p class="verse-text">6 Итак смиритесь под крепкую руку Божию, да вознесет вас в свое время.</p>
							<p class="verse-text">7 Все заботы ваши возложите на Него, ибо Он печется о вас.</p>
							<p class='autor' amo-reader-link="ru:pet1:5:6,7" auto-text></p>
						</div>
					</div>
				</div>
			</div>
			<div class='module'>
				<div class='slide column'>
					<div class='message'>
						<h1>Закон Божий актуален и не был изменен</h1>
						<section>
							<p class="verse-text">	
								Не думайте, что Я пришел нарушить закон или пророков: не нарушить пришел Я, но исполнить.
							</p>
							<p class="verse-text">
								Ибо истинно говорю вам: доколе не прейдет небо и земля, ни одна иота или ни одна черта не прейдет из закона, пока не исполнится все</p>
						</section>
						<p class='source' amo-reader-link="ru:matt:5:17-18">Иисус Христос | Евангелие от Матфея 5:17</p>
					</div>
				</div>
				<div class='slide law mt-400px absolute'></div>
				<div class="container">
					<div class='columns row'>
						<div class='column col-lg-3 col-md-4 col-sm-6'>
							<p class="verse-text">
								2 Что мы любим детей Божиих, узнаём из того, когда любим Бога и соблюдаем заповеди Его.
							</p>
							<p class="verse-text">
								3 Ибо это есть любовь к Богу, чтобы мы соблюдали заповеди Его; и заповеди Его нетяжки.
							</p>
							<p class='autor' amo-reader-link="ru:john1:5:2,3" auto-text></p>
						</div>
						<div class='column col-lg-3 col-md-4 col-sm-6'>
							<p class="verse-text">
								6 Любовь же состоит в том, чтобы мы поступали по заповедям Его.
							</p>
							<p class='autor' amo-reader-link="ru:john2:1:6" auto-text></p>
							<p class="verse-text">
								2 Кто говорит: «я познал Его», но заповедей Его не соблюдает, тот лжец, и нет в нем истины;	
							</p>
							<p class='autor' amo-reader-link="ru:john1:2:4" auto-text></p>
						</div>
						<div class='column col-lg-3 col-md-4 col-sm-6'>
							<p class="verse-text">3 А что мы познали Его, узнаем из того, что соблюдаем Его заповеди</p>
							<p class='autor' amo-reader-link="ru:john1:2:3" auto-text></p>
							<p class="verse-text">...Если же хочешь войти в жизнь вечную, соблюди заповеди</p>
							<p class='autor' amo-reader-link="ru:matt:19:17" auto-text></p>
						</div>
						<div class='column col-lg-3 col-md-12 col-sm-6'>
							<p class="verse-text">
								...соблюсти заповедь чисто и неукоризненно, даже до явления Господа нашего Иисуса Христа
							</p>
							<p class='autor' amo-reader-link="ru:tim1:6:14" auto-text></p>

							<p class="verse-text">Итак, мы уничтожаем закон верою? Никак; но закон утверждаем.</p>
							<p class='autor' amo-reader-link="ru:rom:3:31" auto-text></p>
						</div>
					</div>
				</div>
			</div>
			<div class='module'>
				<div class='slide column'>
					<div class='message'>
						<h1>Иисус Христос - Бог</h1>
						<section>
							<p class="verse-text">
								И беспрекословно - великая благочестия тайна: Бог явился во плоти, оправдал Себя в Духе, показал Себя Ангелам, проповедан в народах, принят верою в мире, вознесся во славе.
							</p>
						</section>
						<p class='source' amo-reader-link="ru:tim1:3:16" auto-text></p>
					</div>
				</div>
				<div class='slide mediator mt-400px absolute'></div>
					<div class="container">
						<div class='columns row'>
							<div class='column col-lg-4 col-md-4 col-sm-6'>
								<p class="verse-text">5 И сказал Сидящий на престоле: се, творю все новое. И говорит мне: напиши, ибо слова сии истинны и верны.
								</p>
								<p class="verse-text">6 И сказал мне: совершилось! Я есмь Альфа и Омега, начало и конец; жаждущему дам даром от источника воды живой.
								</p>
								<p class="verse-text">7 Побеждающий наследует все, и буду ему Богом, и он будет Мне сыном.
								</p>
								<p class='autor' amo-reader-link="ru:rev:21:5-7" auto-text></p>
							</div>
							<div class='column col-lg-4 col-md-4 col-sm-6'>
								<p class="verse-text">8 А о Сыне: "Престол Твой Боже, в век века; жезл царствия Твоего - жезл правоты.</p>
								<p class="verse-text">9 Ты возлюбил правду и возненавидел беззакония; посему помазав Тебя, Боже, Бог твой елеем радости более соучастников твоих"
								</p>
								<p class='autor' amo-reader-link="ru:heb:1:8" auto-text>Послание к Евреям глава 1 стихи 8 и 9</p>
							</div>
							<div class="column col-lg-4 col-md-4 col-sm-6">
								<p class="verse-text">Иисус сказал ему: столько времени Я с вами, и ты не знаешь Меня, Филипп? Видевший Меня видел Отца; как же ты говоришь: покажи нам Отца?</p>
								<p class='autor' amo-reader-link="ru:john:14:9" auto-text></p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class='page-footer'>
				<div class="container">
					<div class='columns row'>
						<div class='column col-lg-4 col-md-4 col-sm-6 col-xs-12'>
							<p class="verse-text">Блаженны нищие духом, ибо их есть Царство Небесное.</p>
							<p class="verse-text">Блаженны плачущие, ибо они утешатся.</p>
							<p class="verse-text">Блаженны кроткие, ибо они наследуют землю.</p>
							<p class="verse-text">Блаженны алчущие и жаждущие правды, ибо они насытятся.</p>
							<p class="verse-text">Блаженны милостивые, ибо они помилованы будут.</p>
							<p class="verse-text">Блаженны чистые сердцем, ибо они Бога узрят.</p>
							<p class="verse-text">Блаженны миротворцы, ибо они будут наречены сынами Божиими.</p>
							<p class="verse-text">Блаженны изгнанные за правду, ибо их есть Царство Небесное.</p>
							<p class="verse-text">Блаженны вы, когда будут поносить вас и гнать и всячески неправедно злословить за Меня.</p>
							<p class='autor' amo-reader-link="ru:matt:5:3-11" auto-text></p>
							<p class="verse-text">тем, которые постоянством в добром деле ищут славы, чести и бессмертия, жизнь вечную</p>
							<p class='autor' amo-reader-link="ru:rom:2:7" auto-text></p>
						</div>
						<div class='column col-lg-4 col-md-4 col-sm-6'>
							<p class="verse-text">шесть дней делайте дела, а день седьмой должен быть у вас святым, суббота покоя Господу: всякий, кто будет делать в нее дело, предан будет смерти</p>
							<p class='autor' amo-reader-link="ru:ex:35:2" auto-text></p>
							<p class="verse-text">И благословил Бог седьмой день, и освятил его, ибо в оный почил от всех дел Своих, которые Бог творил и созидал.</p>
							<p class='autor' amo-reader-link="ru:gen:2:3" auto-text></p>
							<p class="verse-text">и пусть хранят сыны Израилевы субботу, празднуя субботу в роды свои, как завет вечный;</p>
							<p class="verse-text">это - знамение между Мною и сынами Израилевыми навеки, потому что в шесть дней сотворил Господь небо и землю, а в день седьмой почил и покоился.</p>
							<p class='autor' amo-reader-link="ru:ex:31:16,17" auto-text></p>
						</div>
						<div class='column col-lg-4 col-md-4 col-sm-6'>
							<p class="verse-text">И сказал Бог: сотворим человека по образу Нашему и по подобию Нашему, и да владычествуют они над рыбами морскими, и над птицами небесными, и над зверями, и над скотом, и над всею землею, и над всеми гадами, пресмыкающимися по земле</p>
							<p class='autor' amo-reader-link="ru:gen:1:26" auto-text></p>
							<p class="verse-text">Ибо в вас должны быть те же чувствования, какие и во Христе Иисусе:</p>
							<p class="verse-text">Он, будучи образом Божиим, не почитал хищением быть равным Богу;</p>
							<p class='autor' amo-reader-link="ru:phil:2:5,6" auto-text></p>
						</div>
					</div>
				</div>
			</div>
			<amo-change-lang-trigger></amo-change-lang-trigger>
		</main>
		<amo-toolbar></amo-toolbar>
		<script src='scripts/amoFullScreen.js'></script>
	</body>
</html>