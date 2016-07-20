// JavaScript Document
//导航栏
var oNav = document.getElementById('nav');
var aLi = oNav.getElementsByTagName('li');
//搜索栏,登录栏
var aText = document.getElementsByClassName('text');
//选项卡,展示列表(BBS论坛)
var oCity = document.getElementsByClassName('city')[0];
var oMenu = document.getElementsByClassName('menu')[0];
var aOpNav = document.getElementsByClassName('op_nav');
var aOpCon = document.getElementsByClassName('op_con');
var aLisNav = document.getElementsByClassName('lis_nav');
var oBbsLis = document.getElementsByClassName('bbs_lis')[0];

var oSearch = document.getElementById('search');
var oList = oSearch.getElementsByClassName('list')[0];
var aSeaLi = oList.getElementsByTagName('li');
var oSUp = oSearch.getElementsByClassName('btn_up')[0];
var oSDown = oSearch.getElementsByClassName('btn_down')[0];
var s_index = 0, s_max = aSeaLi.length, s_timer = '';


var oRImg = document.getElementById('recom_img');
var oMin = document.getElementsByClassName('page_min')[0];
var aMImg = oMin.getElementsByTagName('img');
var m_index = 0, m_max = aMImg.length, m_timer = '';

var oHot = document.getElementsByClassName('web_hot')[0];
var aHotImg = oHot.getElementsByTagName('img');
var oHCover = oHot.getElementsByClassName('hot_cover')[0];

for(var i=1;i<aHotImg.length;i++){
	aHotImg[i].onmouseover = function(){
		oHCover.style.width = this.width + 'px';
		oHCover.style.height = this.height-10 + 'px';
		oHCover.style.top = this.offsetTop + 'px';
		oHCover.style.left = this.offsetLeft + 'px';
	}
}

//加载导航栏
for(var i=0;i<aLi.length;i++){
	(function(i){
		aLi[i].style.backgroundPosition	= "-"+(66*i)+"px 0";
		aLi[i].onmouseover = function(){
			aLi[i].style.backgroundPosition	= "-"+(66*i)+"px -70px";
		}
		aLi[i].onmouseout = function(){
			aLi[i].style.backgroundPosition	= "-"+(66*i)+"px 0";
		}
	})(i);
}


/*输入栏空值-默认值切换*/
for(i=0;i<aText.length;i++){
	aText[i].value2 = aText[i].value;
	
	aText[i].onfocus = function(){
		if(this.value2 == this.value){
			this.value = '';
		}
	}	
	
	aText[i].onblur = function(){
		if(this.value.replace(/\s+/,'') == ''){
			this.value = this.value2;	
		}	
	}
}

/*update轮播*/
s_index++;
s_timer = setInterval(carousel1,2000);

oSUp.onclick = function(){
	clearInterval(s_timer);
	s_index-=2;
	carousel1();
	s_timer = setInterval(carousel1,2000);
}

oSDown.onclick = function(){
	clearInterval(s_timer);
	carousel1();
	s_timer = setInterval(carousel1,2000);
}

function carousel1(){
	if(s_index >= s_max){
			s_index = 0;
	}else if( s_index < 0){
			s_index = s_max-1;
	}
	elasticMove(oList,'top',-s_index*30);
	s_index++;
}
/*update轮播 end*/

/*recom轮播*/
m_index++;
m_timer = setInterval(carousel2,3000);

for(var i=0;i<m_max;i++){
	aMImg[i].index = i;
	aMImg[i].onclick = function(){
		clearInterval(m_timer);
		m_index = this.index;
		carousel2();
		m_timer = setInterval(carousel2,3000);
	}	
}

function carousel2(){
	bufferMove2(oRImg,{opacity:0},function(){
		oRImg.src = aMImg[m_index].src;
		bufferMove2(oRImg,{opacity:100},function(){
			m_index++;
			if(m_index >= m_max){
				m_index = 0;	
			}else if(m_index < 0){
				m_index = m_max-1;
			}	
		});
	});
	
	for(var i=0;i<m_max;i++){
		aMImg[i].parentNode.className = '';
	}
	aMImg[m_index].parentNode.className = 'active';
}

/*recom轮播 end*/



var Dom = {
	toggle : function(obj, nName, cName,subNode){
		var fnName = arguments[4] == undefined ? 'click' : arguments[4];
		addEvent(obj, fnName,function(ev){
			var ev = ev || window.event || this.ev;
			var target = ev.target || ev.srcElement;
			var arr = obj.getElementsByTagName(nName);
			var reg = new RegExp(cName);
			var name = '', aSub = [];
						
			nName = nName.toUpperCase();
			if(nName == "LI"){
				while(target.nodeName !=  "LI"){
					if(target.nodeName == obj.nodeName){
						return;	
					}
					target = target.parentNode;
				}
			}
						
			
			if(target.nodeName == nName){
				
				for(var i=0;i<arr.length;i++){
					name = arr[i].className;
					arr[i].index = i;
					if(/active/g.test(name)){
						arr[i].className = name.replace(/active/g,cName);
					}
					if(subNode){
						subNode[i].style.display = 'none';
					}
				}
			
				
				var name = target.className;
				if(name == ""){
					target.className = "active";
				}else if(name.search(reg) == -1){
					target.className += " active";
				}else if(reg.test(name)){
					target.className = name.replace(reg,"active");	
				}
				if(subNode){
					subNode[target.index].style.display = 'block';
				}
			}
		});
	}
};

/*绑定事件*/
Dom.toggle(oCity,'a','',null);
Dom.toggle(oMenu,'li','gradient',null);

for(var i=0;i<aOpNav.length;i++){
	var aPage = aOpCon[i].getElementsByClassName('page');
	Dom.toggle(aOpNav[i],'li','gradient',aPage);
}

for(var i=0;i<aLisNav.length;i++){
	var dom = aLisNav[i].getElementsByTagName('ul')[0];
	var aLis2 = aLisNav[i].parentNode.getElementsByClassName('lis2');
	if(aLis2.length == 0){
		aLis2 = aLisNav[i].parentNode.getElementsByClassName('lis');
	}
	
	Dom.toggle(dom,'li','gradient', aLis2, 'mouseover');
}
Dom.toggle(oBbsLis,'li','gradient',null, 'mouseover');

/*绑定事件 end*/


//添加事件
function addEvent(obj,fnName,fn){
	if(obj.attachEvent){
		obj.attachEvent('on'+fnName,function(ev){
			var ev = ev || window.event;
			if(fn.call(obj) == false){
				ev.cancelBubble = true;
				return false;
			}	
		});	
	}else{
		obj.addEventListener(fnName,function(ev){
				var ev = ev || window.event;
				obj.ev = ev;
				if(fn.call(obj) == false){
					ev.cancelBubble = true;
					ev.preventDefault();
				}
			},false);	
	}
}

function elasticMove(obj, attr, target, endFn){
	clearInterval( obj.timer );
	
	obj.timer = setInterval(function(){
		var oAttr = parseInt(getStyle(obj, attr));
		//取上一次的弹性运动速度,没有就=0
		var speed = obj.eSpeed ? obj.eSpeed : 0;  
		//计算当次弹性运动的速度
		speed += (target - oAttr)/4; 
		//给弹性运动增加摩擦力 [损耗]
		speed *= 0.8;
		
		oAttr += speed;
		
		//保存这次的弹性运动速度
		obj.eSpeed = speed;
		
		obj.style[attr] =oAttr + 'px';
	//	console.log(obj.style[attr]);
		
		//当差值小于1px时, 关闭定时器
		if(Math.abs(oAttr - target) < 0.5 ){
			obj.style[attr] = target + 'px';
			obj.eSpeed = 0;
			clearInterval( obj.timer );
			endFn && endFn(obj);	
		}
	},50);
}

function bufferMove2( obj, json, endFn ) {
	clearInterval( obj.timer );
	obj.timer = setInterval(function () {
		var onOff = true;
		for(var attr in json){
			var oAttr = 0;
			if(attr == 'opacity'){
				//尽可能不要使用小数
				oAttr = parseInt(parseFloat(getStyle( obj, attr )) * 100);
			}else{
				oAttr = parseInt(getStyle( obj, attr ));	
			}
			
			if(oAttr != json[attr] ){
				onOff = false;
			}else{
				continue;	
			}
						
			var speed = (json[attr] - oAttr) / 10;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			oAttr += speed;
			
			if(attr == 'opacity'){
				obj.style.filter = 'alpha(opacity:'+ oAttr+')';
				obj.style.opacity = oAttr / 100;
			}else{
				obj.style[attr] = oAttr + 'px';
			}
			
		}
			
		if (onOff ) {
			clearInterval( obj.timer );
			endFn && endFn(obj);
		}
	}, 30);
}

function getStyle ( obj, attr ) { 
	return obj.currentStyle?obj.currentStyle[attr] :getComputedStyle( obj )[attr]; 
}

//兼容getElementsByClassName
/*function getClass(obj,tagName,cName){
	if(obj.getElementsByClassName){
		return obj.getElementsByClassName(cName);
	}else{
		var nodes = document.getElementsByTagName(tagName);
		var res = []; 
		var reg = new RegExp(cName);
		for(var i = 0; i < nodes.length; i++) { 
			if(reg.test(nodes[i].className)){
				res.push(nodes[i]);	
			}
		}
		return res;
	}
}*/