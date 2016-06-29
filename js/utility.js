//数组内json数据排序:  key : 数据排序的依据, str :  '>' 顺序 , '<' 倒序 , 无参数 随机
function jsonSort(array, key, str) {
	var val = null;
	var len = array.length;
	var index = 0;
	
	for(var i=0;i<len;i++){
		if(!str){
			index = Math.round(Math.random()*(len-1));
			val = array[i];
			array[i] = array[index];
			array[index] = val;
		}else{
			for(var j=i+1;j<len;j++){
				if(str === '>' && array[i][key] > array[j][key]){
					val = array[i];
					array[i] = array[j];
					array[j] = val;
				}else if(str === '<' && array[i][key] < array[j][key]){
					val = array[i];
					array[i] = array[j];
					array[j] = val;
				}
			}
		}
	} 
	return array;
}

//obj到页面,的 top 和 left 的绝对距离
function getPos(obj) {
		var pos = {'left':0, 'top':0};
		while (obj) {
			pos.left += obj.offsetLeft;
			pos.top += obj.offsetTop;
			obj = obj.offsetParent;
		}
		return pos;
}

//抖动函数: obj抖动的对象; attr  'top' 上下抖动 , 'left' 左右抖动;  
//				   dir,抖动的幅度; endFn 回调函数
function shake ( obj, attr, dir, endFn ) {
	if(obj.site){
		obj.style.top = obj.site;	
	}
	obj.site = getStyle(obj, attr);			// site保存原位置,开始时验证,解决隐患
	var pos = parseInt(obj.site);			// 有隐患的	
	var arr = [];			// 20, -20, 18, -18 ..... 0
	var num = 0;
	var timer = null;
		
	for ( var i=dir; i>0; i-=2 ) {
		arr.push( i, -i );
	}
	arr.push(0);
		
	clearInterval( obj.shake );
	obj.shake = setInterval(function (){
		obj.style[attr] = pos + arr[num] + 'px';
		num++;
		if ( num === arr.length ) {
			clearInterval( obj.shake );
			endFn && endFn(obj);
		}
	}, 50);
}

//弹性运动 : @obj移动对象
//              @attr : 'top/left' -上下/左右移动
//	                      因为弹性运动回弹时,计算attr会出现负值,
//                       所以, width/height/fontSize等不能负值的属性就不适合操作了
//				 @target移动的目标;endFn 回调函数
function elasticMove(obj, attr, target, endFn){
	clearInterval( obj.timer );
	
	obj.timer = setInterval(function(){
		var oAttr = parseInt(getStyle(obj, attr));
		//取上一次的弹性运动速度,没有就=0
		var speed = obj.eSpeed ? obj.eSpeed : 0;  
		//计算当次弹性运动的速度
		speed += (target - oAttr)/4; 
		//给弹性运动增加摩擦力 [损耗]
		speed *= 0.7;
		
		oAttr += speed;
		
		//保存这次的弹性运动速度
		obj.eSpeed = speed;
		
		//console.log(oAttr - target);
		
		obj.style[attr] =oAttr + 'px';
		
		//当差值小于1px时, 关闭定时器
		if(Math.abs(oAttr - target) < 1 ){
			obj.style[attr] = target + 'px';
			obj.eSpeed = 0;
			clearInterval( obj.timer );
			endFn && endFn(obj);	
		}
	},30);
}


//重力运动
function gravityMove(obj, speedX, speedY){
		obj.gTimer = setInterval(function(){
			
			speedY += 3;  //重力
			
			var t = obj.offsetTop + speedY;
			var l = obj.offsetLeft + speedX;
			
			if(t >= (document.documentElement.clientHeight - obj.offsetHeight)){
				speedY *= -0.8;
				speedX *= 0.8;
				t  = document.documentElement.clientHeight - obj.offsetHeight;
			}else if(t <= 0){
				speedY *= -1;
				t = 0;
			}
			
			if(l >= (document.documentElement.clientWidth - obj.offsetWidth)){
				speedX *= -0.8;	
				speedY *= 0.8;
				l = document.documentElement.clientWidth - obj.offsetWidth;
			}else if(l <= 0){
				speedX *= -0.8;
				speedY *= 0.8;
				l = 0;
			}
			
			speedY = Math.abs(speedY) < 1 ? 0 : speedY;
			speedX = Math.abs(speedX) < 1 ? 0 : speedX;
			
			if(speedY==0 && speedX==0 && t== document.documentElement.clientHeight - obj.offsetHeight){
				clearInterval(obj.gTimer);
			}
			
			obj.style.top = t + 'px';
			obj.style.left = l + 'px';
			
		},25);	
	}


//缓冲移动: obj移动的对象; 
//              attr : 'top/left' -上下/左右移动 ,'width/height' - 长/高,''度; 
//                       'fontSize' -元素内的字体大小; 'borderWidth' - 元素边框大小
//						  'opacity' - 透明度 等等 
//	                      [为了兼容ie8,需要在obj样式手动添加opacity:x]
//				 target移动的目标;endFn 回调函数
function bufferMove( obj, attr, target,  endFn ) {
	clearInterval( obj.timer );
	obj.timer = setInterval(function () {
		var oAttr;
		if(attr == 'opacity'){
			//尽可能不要使用小数
			oAttr = parseInt(parseFloat(getStyle( obj, attr )) * 100);
		}else{
			oAttr = parseInt(getStyle( obj, attr ));	
		}
		var speed = (target - oAttr) / 10;

		speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
		oAttr += speed;
		
		if(attr == 'opacity'){
			obj.style.filter = 'alpha(opacity:'+oAttr+')';
			obj.style.opacity = oAttr / 100;
		}else{
			obj.style[attr] = oAttr + 'px';
		}
		
		if ( oAttr == target ) {
			clearInterval( obj.timer );
			endFn && endFn(obj);
		}
		
	}, 30);
}

//缓冲移动2: 多属性同时操作版
//				obj移动的对象; 
//				json : {属性:值, 属性2:值2 ...} 
//              属性 : 'top/left' -上下/左右移动 ,'width/height' - 长/高,''度; 
//                       'fontSize' -元素内的字体大小; 'borderWidth' - 元素边框大小
//						  'opacity' - 透明度 等等 
//	                      [为了兼容ie8,需要在obj样式手动添加opacity:x]
//				 值  : 移动的目标;  
//				endFn 回调函数
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

//移动函数: obj移动的对象; 
//              attr : 'top' 上下移动 , 'left' 左右移动,'width'长宽,'height'高度;  
//				 dir,移动的步长; target移动的幅度; endFn 回调函数
function doMove ( obj, attr, dir, target, endFn ) {
	dir = parseInt(getStyle( obj, attr )) < target ? dir : -dir;
	clearInterval( obj.timer );
	obj.timer = setInterval(function () {
		var speed = parseInt(getStyle( obj, attr )) + dir;			// 移动至的位置
		
		
		//两种判断方式
		//1.判断 移动至的位置 是否超出 目标位置
		if ( speed > target && dir > 0 ||  speed < target && dir < 0  ) {
			speed = target;
		}
		
		//2.判断 移动至位置 与 目标位置 之间的 绝对距离是否小于 dir[步长]
		//if ( Math.abs(speed - target) < dir ) {
		//	speed = target;
		//}
		
		obj.style[attr] = speed + 'px';
		if ( Math.abs(speed - target) < 5 ) {
			obj.style[attr] = target + 'px';
			clearInterval( obj.timer );
			endFn && endFn(obj);
		}
	}, 30);
}

//获取obj的属性值,兼容浏览器
function getStyle ( obj, attr ) { 
	return obj.currentStyle?obj.currentStyle[attr] : getComputedStyle( obj )[attr]; 
}


//数组去重
function uniq(arr){
	var re = [];
	for(var i=0;i<arr.length;i++){
		if(re.indexOf(arr[i]) == -1){
			re.push(arr[i]);	
		}
	}
	return re;
}

//绑定事件函数
function bindFn(obj,fnName,fn){
	obj.fnList = obj.fnList || {};
	obj.fnList[fnName] = function(){
		 fn.call(obj);	
	};
	
	if(obj.attachEvent){
		obj.attachEvent('on'+fnName,	obj.fnList[fnName]);
	}else{
		obj.addEventListener(fnName, obj.fnList[fnName], false);
	}
}

//删除事件函数
function removeFn(obj,fnName){
	if(obj.fnList[fnName]){
		if(obj.detachEvent){
			obj.detachEvent('on'+fnName, obj.fnList[fnName]);
		}	else {
			obj.removeEventListener(fnName,obj.fnList[fnName],false);	
		}
	}
}

//cookie写入
//time: 为0时cookie时效为当前进程
function setCookie(key,value,time){
	if(time == 0){
		document.cookie = key + '=' +encodeURI(value);
	}else{
		var date = new Date();
		date.setDate(date.getDate()+time);
		document.cookie = key + '=' +encodeURI(value) + ';expires=' + date.toGMTString();
	}
}

//cookie读取
function getCookie(key){
	var aCk = document.cookie.split('; ');
	for(var i=0;i<aCk.length;i++){
		var cks = aCk[i].split('=');
		if(cks[0] == key) return decodeURI(cks[1]);	
	}
}

//cookie删除
function removeCookie(key){
	setCookie(key,'',-1);
}

//返回x到y之间的随机整数
function getRandomInt(x,y){
	return Math.round(Math.random()*(y-x) + x);
}

//ajax获取数据
//rm: get/post; url:接口地址; data:参数; callback:请求成功后回调函数
function ajax(rm, url, data, callback){
		var xhr;
		if(window.XMLHttpRequest){
			xhr = new XMLHttpRequest();
		}else{
			xhr = new new ActiveXObject('Microsoft.XMLHTTP');
		}
		
		if(rm === 'get'){
			if(data){
				url += '?' + data + '&' + new Date().getTime();	
			}
			xhr.open('get',url,true);
			xhr.send();
		}else{
			xhr.open('post',url,true);
			xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
			xhr.send(data);
		}
		
		
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if ( xhr.status == 200 ) {
					callback && callback(xhr.responseText );
				}else{
					alert('出错了,Err：' + xhr.status);
				}
			}
		}
	}