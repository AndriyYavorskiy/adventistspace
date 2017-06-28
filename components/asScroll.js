angular.module('AS')
	.directive('mobyScroll', function ($window){
		var object = {};
		object.restrict = 'E';
		object.scope = '@';
		object.link = function (scope, el, attrs) {
			var scrollHeight, offsetLeft, offsetTop, topSpread, maxTop, step,
			parent = angular.element($window.document.body),
			canvas = angular.element($window.document.getElementsByTagName('main')[0]);
			boot();
			
			parent.css('overflow', 'hidden');
			el.bind('mousedown', onmousedown);
			angular.element($window).bind("resize", boot);
			function boot() {
				scrollHeight = $window.innerHeight * ($window.innerHeight / $window.document.body.offsetHeight);
				offsetLeft = el[0].offsetLeft;
				offsetTop = el[0].offsetTop;
				maxTop = $window.innerHeight - scrollHeight;
				step = $window.document.body.offsetHeight / 100;
				el.css('height', scrollHeight + 'px');
				console.log(canvas[0].clientHeight);
				el.css('transform', 'translate3d(0, ' + (getSpaceOnTopOf(canvas) / (canvas[0].clientHeight - $window.innerHeight) * maxTop) + 'px, 0');
			}
			function onmousedown(e){
				e.preventDefault();
				offsetTop = el[0].style.transform.split('px, ')[1] || 0,
				topSpread = e.clientY - offsetTop;
				el.parent().bind('mousemove', onmousemove);
				el.parent().bind('mouseup', function (){
					onmouseup();
				});
			}
			function onmouseup(){
				angular.element($window.document.body).unbind('mousemove', onmousemove);
			}
			function onmousemove(e){
				e.preventDefault();
				targetY = e.clientY - topSpread;
				var top = targetY <= maxTop ? e.clientY - topSpread : maxTop;
					top = top >= 0 ? top : 0;
					//progress = parseInt(top / maxTop * 100);
					progress = 0 -(canvas[0].clientHeight - $window.innerHeight) * (top / maxTop);
					canvas.css('transform', 'translate3d(0, ' + progress + 'px, 0)');
				
				if (e.ctrlKey){
					el.css('transform', 'translate3d(' + (e.clientX - $window.innerWidth) + 'px, ' + top + 'px, 0)');
				} else {
					el.css('transform', 'translate3d(0,' + top + 'px,0)');
				}
			}
			 
			$window.addEventListener('wheel', function (e){
				var top = el[0].offsetTop,
				progress = 0 - (canvas[0].clientHeight - $window.innerHeight) * (top / maxTop),
				plus = el.offsetTop;
				if (e.wheelDelta < 0){
					el[0].offsetTop < window.innerHeight - el[0].clientHeight ? el.css('top', el[0].offsetTop + step + 'px') : el.css('top', window.innerHeight - el[0].clientHeight + 'px');
				} else {
					el[0].offsetTop > 4 ? el.css('top', el[0].offsetTop - step + 'px') : el.css('top', 0 + 'px');
				}
				canvas.css('transform', 'translate3d(0,' + progress + 'px,0)');
			});
			function getSpaceOnTopOf (elem) {
				return Math.abs(parseFloat(elem.css("transform").split(", ")[1]));
			}
		}
		return object;
	});