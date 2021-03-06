// JavaScript Document
(function (win){
  var doc 		= win.document,
  		html 		= doc.documentElement,
  		option 	= html.getAttribute('data-use-rem');
 
  if( option === null ){
     return;
  }
  
  // defaut baseWidth : 640px；
  var baseWidth = parseInt(option).toString() === 'NaN' ? 640 : parseInt(option);
  var grids = baseWidth / 100;
  var clientWidth = html.clientWidth || 320;
  // set rem first
  html.style.fontSize = parseFloat(clientWidth / grids) + 'px';
  
  // create testDom
  var testDom = document.createElement('div');
  var testDomWidth = 0;
  var adjustRatio = 0;
  testDom.style.cssText = 'height:0;width:1rem;';
  doc.body.appendChild(testDom);

  var calcTestDom = function(){
    testDomWidth = testDom.offsetWidth;
    if( testDomWidth !== Math.round(clientWidth / grids) ){
      adjustRatio = clientWidth/grids/testDomWidth;
      var reCalcRem = clientWidth*adjustRatio / grids;
      html.style.fontSize = reCalcRem + 'px';
    } else{
      doc.body.removeChild(testDom);
    }
  };

  // detect if rem calc is working directly
  // if not , recalc and set the rem value
  setTimeout(calcTestDom, 20);

  var reCalc = function(){
    var newCW = html.clientWidth;
    if ( newCW === clientWidth ){
      return;
    }
    clientWidth = newCW;
    html.style.fontSize = newCW*(adjustRatio?adjustRatio:1) / grids + 'px';
    // if( testDom ) setTimeout(calcTestDom, 20);
  };

  // Abort if browser does not support addEventListener
  if (!doc.addEventListener){
    return;
  }

  var resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';

  win.addEventListener(resizeEvt, reCalc, false);
  // detect clientWidth is changed ?
  doc.addEventListener('DOMContentLoaded', reCalc, false);
  window.document.body.setAttribute('dpr',window.devicePixelRatio)
 
})(window);

function id(obj) {
    return document.getElementById(obj);
}

function classEnt(obj,cName) {
    return obj.getElementsByClassName(cName);
}

function tag(obj,tName) {
    return obj.getElementsByTagName(tName);
}

function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}
function bind(obj, ev, fn) { 
    if (obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}

function removeEvent(obj, ev, fn) { 
    if (obj.removeEventListener) {
        obj.removeEventListener(ev, fn, false);
    } else {
        obj.detachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}

function addClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}

function removeClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}

fnHome();

function fnHome(){
	var oHome = id('home');
	//bind(oHome,'transitionend',end);
	bind(oHome,'animationend',end);
	//bind(oHome,'webkitTransitionEnd',end);
	bind(oHome,'webkitAnimationEnd',end);
	
	function end(){
		setTimeout(function(){
			closePage(oHome);
			var oScore = id('score');
			openPage(oScore);
			fnScore();
		},3000);
	}
}

function fnScore(){
	var oScore = id('score');
	var oTabPic = classEnt(oScore,'tab_pic')[0];
	var oTimer = 0,tNum = 0, arrEvent={};
	openPage(oScore);
	
	tab();
	if(!oScore.Fn){
		star();
		bind(window,'resize',tab);
		oScore.Fn = true;
	}
	
	function tab(){
		if(oTimer){
			clearInterval(oTimer);
		}
		var oTabNav = classEnt(oScore,'tab_nav')[0];
		var doc = document.documentElement;
		var aLi = oTabPic.children;
		var aNav = oTabNav.children;
		var startX=0, nowX=0, iX=0, maxW = 0;
		maxW = Math.round(parseFloat(document.documentElement.style.fontSize) * 6.5);
		maxW = doc.offsetWidth > maxW ? aLi[0].offsetWidth : maxW;
		translate();
		auto();
		arrEvent = {'touchstart':start, 'touchmove':move, 'touchend':end};
		bind(oTabPic,'touchstart',arrEvent['touchstart']);
		bind(oTabPic,'touchmove',arrEvent['touchmove']);
		bind(oTabPic,'touchend',arrEvent['touchend']);
		
		function auto(){
			oTimer = setInterval(function(){
				tNum++;
				tNum = tNum%aLi.length;
				translate();
			},2000);
			//console.log(oTimer);
		}
		
		function translate(){
			iX = tNum%aLi.length * -maxW;
			oTabPic.style.WebkitTransition = oTabPic.style.transition = "1s";
			oTabPic.style.WebkitTransform = oTabPic.style.transform = "translateX("+iX+"px)";
			for(var i=0;i<aNav.length;i++){
				removeClass(aNav[i],'active');	
			}
			addClass(aNav[tNum%aLi.length],'active');
		}
		
		function start(ev){
			startX = ev.changedTouches[0].pageX;
			//console.log(oTimer);
			clearInterval(oTimer);
			oTabPic.style.WebkitTransition = oTabPic.style.transition = 'none';
		}
		
		function move(ev){
			nowX = ev.changedTouches[0].pageX - startX;
			oTabPic.style.WebkitTransform = oTabPic.style.transform = "translateX("+(nowX +iX)+"px)";
		}
		
		function end(ev){
			tNum= (nowX +iX) / maxW;
			tNum=-Math.round(tNum);
			if(tNum<0)
			{
				tNum=aLi.length-1;
			}
			if(tNum>aLi.length-1)
			{
				tNum=0;
			}
			translate();
			auto();
		}
	}
	
	function star(){
		var oList = classEnt(oScore,'scoreList')[0];
		
		var aStar = classEnt(oList,'star');
		for(var i=0;i<aStar.length;i++){
			fn(aStar[i]);
			
			function fn(oLi){
				var aA = tag(oLi,'a');
				for(var j=0;j<aA.length;j++){
					aA[j].index = j;	
					bind(aA[j],'touchend',starEnd);
					
					function starEnd(){
						for(var i=0;i<aA.length;i++){
							if(i <= this.index){
								addClass(aA[i],'active');	
							}	else {
								removeClass(aA[i], 'active');	
							}
						}
						oLi.dataset['star'] = this.index;
					}	
				}
			}
		}
	}	
	
	var btn = classEnt(oScore,'btn')[0];
	bind(btn,'touchstart',subScore);
	
	function subScore(){
		var oMask = id('mask');
		var oList = classEnt(oScore,'scoreList')[0];
		var aScore = oList.querySelectorAll('[data-star]');
		var oTag = oScore.querySelector(':checked');
		var info = classEnt(oScore,'info')[0];
		var btn = classEnt(oScore,'btn')[0];
		
		if(aScore.length < 3){
			info.innerHTML = "清给景区评分";
			addClass(info,'infoS');
			setTimeout(function(){
				removeClass(info,'infoS');
			},1000)
		}else if(!oTag){
			info.innerHTML = "清给景区添加标签";
			addClass(info,'infoS');
			setTimeout(function(){
				removeClass(info,'infoS');
			},1000)
		}else{
			//跳转第三页
			
			openPage(oMask);
			setTimeout(function(){
				oScore.style.WebkitFilter = oScore.style.filter = 'blur(5px)';
				oMask.style.opacity = 1;
			},20);
			
			setTimeout(function(){
				oScore.style.WebkitFilter = oScore.style.filter = 'none';
				closePage(oScore);
				closePage(oMask);
				//清理事件缓存
				console.log(oTimer);
				clearInterval(oTimer);
				oTimer = '';
				for(var attr in arrEvent){
					removeEvent(oTabPic,attr,arrEvent[attr]);	
				}
				arrEvent='';
				document.documentElement.scrollTop = document.body.scrollTop = 0;
				removeEvent(btn,'touchstart',subScore);
				//清理事件缓存 end
				fnNews();
			},2000);
		}
	}
}

function fnNews(){
	var oNews = id('news');
	var info = classEnt(oNews,'info')[0];
	var aFile = oNews.querySelectorAll('[type=file]');
	
	openPage(oNews);
	if(!fnNews.Fn){
		for(var i=0;i<aFile.length;i++){
			bind(aFile[i],'change',file);
		}
		fnNews.Fn = true;
	}
	
	function file(){
		var oFile = this.files[0];	
		if(oFile.type.indexOf(this.dataset['file']) != -1){
			closePage(oNews);
			this.value="";
			fnNewsScore(this.dataset['type']);
		}else{
			info.innerHTML = "请上传"+this.dataset['type'];
			addClass(info,'infoS');
		}
		setTimeout(function(){
			removeClass(info,'infoS');
		},1500)
	}
}

function fnNewsScore(name){
	var oNScore = id('newsScore');
	var oH = tag(oNScore,'h2')[0];
	var sBtn = classEnt(oNScore,'btn')[0];
	var aLabel = tag(oNScore,'label');
	var oCheck = oNScore.querySelector(':checked');
	var aInput = classEnt(oNScore,'nInput');
	var onOff = false;
	
	if(oCheck){
		oCheck.checked = false;	
		for(var i=0;i<aInput.length;i++){
			aInput[i].value = '';
		}
		removeClass(sBtn,'sub');
	}
	
	oH.innerHTML = "给"+name+"添加标签";
	openPage(oNScore);
	
	for(var i=0;i<aLabel.length;i++){
		bind(aLabel[i],'touchend',fnEnd);
	}
	
	bind(sBtn,'touchend',fnLoad);
	
	function fnEnd(){
		addClass(sBtn,'sub');
		onOff = true;
	}
	
	function fnLoad(){
		if(onOff){
			closePage(oNScore);
			fnSucceed();
			onOff = '';
		}
	}
}

function fnSucceed(){
	var oSu = id('succeed');
	var oBtn = classEnt(oSu,'btn')[0];
	
	openPage(oSu);
	
	bind(oBtn,'touchend',fnBtn);
	function fnBtn(){
		closePage(oSu);
		/*var oScore = id('score');
		openPage(oScore);*/
		fnScore();
	}
}

function openPage(obj){
	document.documentElement.scrollTop = document.body.scrollTop = 0;
	addClass(obj,'pageShow');
	setTimeout(function(){
		obj.style.opacity = 1;
	},20);
}


function closePage(obj){
	removeClass(obj,'pageShow');	
	setTimeout(function(){
		obj.style.opacity = 0;
	},20);
}












