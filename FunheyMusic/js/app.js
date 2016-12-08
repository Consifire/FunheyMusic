/*
	知识补充：
		1）获取元素
			querySelector(),
			querySelectorAll(),
			nextElementSibling/previousElementSibling
		2）DOMContentLoaded事件
			跟jquery中的document ready是一样的
		3）获取自定义属性值dataset（是一个对象）
			<div data-idx="20" data-guid="12345678981"></div>
			div.dataset.idx,div.dataset.guid
		4）class类名操作:classList（是一个对象）
			<div class="iconfont icon-play"></div>
			div.classList
		5）变量数组
			arr.forEach(function(item,idx){});
		6）事件源对象：触发事件的初始对象
			不管事件冒泡到哪个阶段，事件源对象都不会改变
			获取事件源对象：e.target
		7）tagName：获取元素标签名，返回大写字母
		8）scrollIntoView()：把当前元素滚动到可见区域

 */

/********************************************************
 		通过搜索获取得到播放列表。
 		将成功获取到的歌名以列表形式显示出来，
 		通过关键词搜索得到列表中没首歌对应的hash值
 		通过hash值获得播放地址和歌曲timeLength
 		通过歌手name获取歌手图片
 		通过歌名、hash值、歌曲长度获取歌词
........只需获得歌曲名就可以。
 */
document.addEventListener('DOMContentLoaded',function(){
	//tab三页面切换...高亮显示当前页按钮
	//console.log($('.swiper-slide').height());
	var mySwiper = new Swiper('.swiper-container',{
		speed:100
	});
	$('.tab span').click(function(){
		$(this).addClass('btn_add').siblings().removeClass('btn_add');
		mySwiper.slideTo($(this).index(), 100, false);//切换到第一个slide，速度为0.1秒
	});
	window.addEventListener('touchend',function(){
		var swiperIdx=mySwiper.activeIndex;//当前活动块的索引
		$('.tab span').eq(swiperIdx).addClass('btn_add').siblings().removeClass('btn_add');
	});
	// 获取页面元素
	var ePlayer = document.querySelector('.player');
	ePlayer.style.height=window.innerHeight +'px';

	var eList = ePlayer.querySelector('.list');
	var love=ePlayer.querySelector('.love_list');
	var loveList=$('.love_list');
	var btnPlay = ePlayer.querySelector('#btnPlay');
	var btnPrev = ePlayer.querySelector('#btnPrev');
	var btnNext = ePlayer.querySelector('#btnNext');
	var btnVolume = ePlayer.querySelector('#btnVolume');
	var eTitle = ePlayer.querySelector('h1.title');
	var eProgress = ePlayer.querySelector('progress');
	var eModel = ePlayer.querySelector('.play-model');
	var singer_img=$('#singer_img');
	
	// 获取下一个/上一个元素节点
	// nextElementSibling/previousElementSibling
	var eAlbum = document.querySelector('#singer_img');
	var eTime = eProgress.nextElementSibling;

	//··········//
	var $ollist=$('.list')[0];
	var $search_song=$('#search_song');
	var searchIn=$('#searchIn');
				var $btn1=$('#btn1');
				var $btn2=$('#btn2');
				var $btn3=$('#btn3');
				var $btn4=$('#btn4');
				var zy_url="http://apis.baidu.com/geekery/music/query";
				var dz_url='http://apis.baidu.com/geekery/music/playinfo';
				var xx_url='http://apis.baidu.com/geekery/music/singer';
				var krc_url='http://apis.baidu.com/geekery/music/krc';
			/*	//关键词
				var key_word='十年';
				
				var dz_hash='53df727308694879cfb2bf2c65fdb578';
				//歌手名
				var singer_name='陈奕迅';
				
				//歌曲名
				var song_name='陈奕迅 - 十年 - 钢琴版';
				//歌曲长度
				var song_time=196;
				
				var url;
			*/	
	// 全局变量
	var playlist = [];
	var love_list=[];
	//var playsrc=[];
	//var playimg=[];
	var index = 0;
	var model = 2;//0:单曲播放,1:单曲循环,2:列表播放,3:列表循环,4:随机播放
	var player = new Audio();

	// 1）ajax加载数据,并写入.list
			//封装搜索函数
			function search(){
					key_word=searchIn.val();
					if (key_word!=='') {
						url=zy_url;
						
						//console.log(key_word)
						$.ajax({
							type:"get",
							
							url:url,
							headers:{//不要写错单词！
								apikey:'a0de20180bb8e4c9f6b28867a9c414df'
							},
							dataType:'jsonp',
							data:{
								s:key_word,//必填关键词
								size:10,
								page:1
							},
							success:function(res){
								playlist=[];
								//playsrc=[];
								//playimg=[];
								$ollist.innerHTML='';
								//console.log(res.data.data);
								//歌曲数组
								var song_group=res.data.data;
								//var $ol=$("<ol star='1' type='1'></ol>");
								var $ol=document.createElement('ol');
								$ol.setAttribute('start',1);
								$ol.setAttribute('type',1);
								song_group.forEach(function(item,idx){
									//将歌曲名加入到列表中
									var li = document.createElement('li');
									// li.setAttribute('data-idx',idx);
									li.dataset.idx = idx;
									//console.log(li.dataset.idx)
									li.innerHTML=item.filename;
									//li.appendTo($ol);
									$ol.appendChild(li);
									var obj={
										filename:item.filename,
										hash:item.hash,
										singername:item.singername
									}
									//将对象存入空数组
									playlist.push(obj);
									
								});
								console.log(playlist);
								/*playlist.forEach(function(item){
									//储存播放路径，用来以index即时变换`````````````````````
									url=dz_url;
									$.ajax({
										type:"get",
										url:url,
										headers:{//不要写错单词！
											apikey:'a0de20180bb8e4c9f6b28867a9c414df'
										},
										dataType:'json',
										data:{hash:item.hash},
										success:function(krc){
											//播放地址存进数组
											playsrc.push(krc.data.url);
											//console.log(playsrc)
										}
										
									});	
									//储存歌手图片``````````````````````````````````````
									url=xx_url;
									$.ajax({
										type:"get",
										url:url,
										headers:{//不要写错单词！
											apikey:'a0de20180bb8e4c9f6b28867a9c414df'
										},
										dataType:'json',
										data:{
											name:item.singername
										},
										success:function(img){
											playimg.push(img.data.image);
											//console.log(playimg);
										}
									});
								});*/
								eList.appendChild($ol);
							}
							
						});
					}else{
						alert('请输入要搜索的内容');
					}
			}
	
	//...... 写入页面，初始化播放上一次播放的歌曲
			if(localStorage.getItem('waypoint')){
				eList.innerHTML='';
				if (localStorage.getItem('krc')) {
					$('.krc').empty();
					var krc=JSON.parse(localStorage.getItem('krc'));
					krc.forEach(function(item){
						$('<p/>').html(item).appendTo($('.krc'));
					});
				}
				
				player.src = localStorage.getItem('waypoint');//播放途径
				singer_img.attr('src',localStorage.getItem('image'));//更换歌手图片
				eTitle.innerHTML=localStorage.getItem('title');//标题
				
				
				var $ol=document.createElement('ol');
				$ol.setAttribute('start',1);
				$ol.setAttribute('type',1);
				var li = document.createElement('li');
									
				
				li.innerHTML=localStorage.getItem('title');
				$ol.appendChild(li);
				eList.appendChild($ol);
				key_word=localStorage.getItem('title');
				var obj={
					filename:localStorage.getItem('title'),
					hash:localStorage.getItem('current_hash'),
					singername:localStorage.getItem('current_singer')
				}
				//将对象存入空数组
				playlist.push(obj);
				//bofang();
			}
			
		
			//点击搜索按钮生成结果列表
			$search_song.click(function(){
				mySwiper.slideTo(0, 100, false);//切换到第一个slide，速度为0.1秒
				search();
			});
			//焦点在搜索输入框内是回车可以搜索
			$(window).keydown(function(e){
				if (e.keyCode==13) {
					if (searchIn.is(':focus')) {
						mySwiper.slideTo(0, 100, false);//切换到第一个slide，速度为0.1秒
						search();
					}
				}
			})
		/*	
//			$btn1.click(function(){
//				
//					url=zy_url;
//					$.ajax({
//						type:"get",
//						url:url,
//						headers:{//不要写错单词！
//							apikey:'a0de20180bb8e4c9f6b28867a9c414df'
//						},
//						dataType:'json',
//						data:{
//							s:key_word,//必填关键词
//							size:10,
//							page:1
//						},
//						success:function(res){
//							console.log(res);
//						}
//					});
//					
//				});
//			$btn2.click(function(){
//				
//					url=dz_url;
//					$.ajax({
//						type:"get",
//						url:url,
//						headers:{//不要写错单词！
//							apikey:'a0de20180bb8e4c9f6b28867a9c414df'
//						},
//						dataType:'json',
//						data:{
//							hash:dz_hash
//						},
//						success:function(res){
//							console.log(res);
//						}
//					});
//				});
//			$btn3.click(function(){
//					
//					url=xx_url;
//					$.ajax({
//						type:"get",
//						url:url,
//						headers:{//不要写错单词！
//							apikey:'a0de20180bb8e4c9f6b28867a9c414df'
//						},
//						dataType:'json',
//						data:{
//							name:singer_name
//						},
//						success:function(res){
//							console.log(res);
//						}
//					});
//				});
//			$btn4.click(function(){
//					
//					url=krc_url;
//					$.ajax({
//						type:"get",
//						url:url,
//						headers:{//不要写错单词！
//							apikey:'a0de20180bb8e4c9f6b28867a9c414df'
//						},
//						dataType:'json',
//						data:{
//							name:song_name,
//							hash:dz_hash,
//							time:song_time
//						},
//						success:function(res){
//							console.log(res);
//						}
//					});
//				});
//````````````````````````````````````````````````````//
*/
	
	


	// 2）播放/暂停歌曲
	// console.log(btnPlay.classList)
	btnPlay.onclick = function(){
		//如果当前处于暂停状态，就播放
		if(player.paused){
			player.play();
			
		}else{
			player.pause();
			
		}
	}

	// 上一曲/下一曲
	btnPrev.onclick = function(){
		index--;
		bofang();
		play();
	}
	btnNext.onclick = function(){
		index++;
		bofang();
		play();
	}
//点击静音
	btnVolume.onclick = function(){
		player.muted = !player.muted;
		if(player.muted){
			this.classList.add('icon-mute');
		}else{
			this.classList.remove('icon-mute');
		}
	}

	// 6）点击进度条改变播放进度
	eProgress.onclick = function(e){
		player.currentTime = (e.offsetX/this.offsetWidth)*player.duration;
	}


	// 播放时触发
	player.onplay = function(){
		btnPlay.classList.add('icon-pause');

		// 图片旋转效果
		eAlbum.classList.add('playing');
		eAlbum.style.webkitAnimationPlayState = 'running';

		// 给当前播放歌曲添加高亮效果
		var li = eList.querySelectorAll('li');
		for(var i=0;i<li.length;i++){
			if(i===index){
				li[i].classList.add('active');
				li[i].scrollIntoView();
			}else{
				li[i].classList.remove('active');
			}
		}
		

		// 改变标题
		//eTitle.innerHTML = playlist[index].singer + ' - ' + playlist[index].name;

		// 专辑图片
		//eAlbum.src = playlist[index].album;
	}

	// 暂停时触发
	player.onpause = function(){
		btnPlay.classList.remove('icon-pause');

		// 移除图片旋转效果
		// eAlbum.classList.remove('playing');
		eAlbum.style.animationPlayState = 'paused';
	}

	// 播放进度改变时触发
	// 播放过程一直触发
	player.ontimeupdate = function(){
		var miao=(Math.round(player.currentTime*100)/100%60).toFixed(0);
		var fen=parseInt(Math.round(player.currentTime*100)/100/60)
		if (miao<10) {
			miao='0'+miao;
		}
		if (fen<10) {
			fen='0'+fen;
		}
		var tranTime=fen+':'+miao;
		if (localStorage.getItem('krc_time')) {
			krc_time=JSON.parse(localStorage.getItem('krc_time'));
		}
		var krc_length=krc_time.length;
		//console.log(tranTime);
		krc_time.forEach(function(item,idx){
			//console.log(item==tranTime)
			if (tranTime==item) {
				$('.krc p').eq(idx).addClass('krc_addclass').siblings().removeClass('krc_addclass');
				//$('.krc p').eq(idx).siblings().css('color','black');
				$('.krc p').eq(idx).get(0).scrollIntoView();
				//addClass('.krc_addclass').siblings().removeClass('.krc_addclass');
				console.log(123)
			}
		});
		//console.log(tranTime)
		updateTime();
	}

	// 歌曲能播放时
	player.oncanplay = function(){
		init();
	}


	// 4）点击歌曲播放
	// 利用事件委托来实现
	var current_name;//当前要播放的歌曲名
	var hash;//歌曲对应的哈希值
	var timeLenght;//歌曲长度
	var krc_time;//转换后的歌词时间
	//封装一条龙请求数据函数~~~需要明确current_name变量的值
	function bofang(){
		//console.log(playlist[index].filename);
		current_name=playlist[index].filename;
				playlist.forEach(function(item){
					if(item.filename==current_name){
						hash=item.hash;
						singer_name=item.singername;
						localStorage.setItem('current_hash',hash);
						localStorage.setItem('current_singer',singer_name);
					}				
				});
				
				$.ajax({
						type:"get",
						url:dz_url,
						headers:{//不要写错单词！
							apikey:'a0de20180bb8e4c9f6b28867a9c414df'
						},
						dataType:'jsonp',
						data:{hash:hash},
						success:function(res){
							
							player.src=res.data.url;//更改播放地址
							timeLenght=res.data.timeLength;//获取参数timeLength的值，用来做参数time的值来查询歌词
							//通过singername搜索歌手信息获得图片````````````````````````````````````````
							$.ajax({
								type:"get",
								url:xx_url,
								headers:{//不要写错单词！
									apikey:'a0de20180bb8e4c9f6b28867a9c414df'
								},
								dataType:'jsonp',
								data:{
									name:singer_name
								},
								success:function(xx){
									singer_img.attr('src',xx.data.image);//更换歌手图片
									$('.krc').css('background','url('+xx.data.image+')');//更换歌词背景图
									//singer_img.src=xx.data.image;//无法显示图片，路径更换了
									//console.log(singer_img);
								}
							});
							//查找歌词
							$.ajax({
								type:"get",
								url:krc_url,
								headers:{//不要写错单词！
									apikey:'a0de20180bb8e4c9f6b28867a9c414df'
								},
								dataType:'jsonp',
								data:{
									name:current_name,
									hash:hash,
									time:timeLenght
								},
								success:function(krc){
									
									$('.krc').empty();
									var krcb=krc.data.content;
									krc_time=krcb.match(/\d{2}:\d{2}/g);
									//console.log(krcb);
									var krc=krcb.split(/\n\[\d{2}:\d{2}\.\d{2}\]/);
									localStorage.setItem('krc_time',JSON.stringify(krc_time));
									console.log(krc_time)
									//var krc=krcb.split(/\[\d{2}:\d{2}\.\d{2}\]/);
									krc.forEach(function(item){
										$('<p/>').html(item).appendTo($('.krc'));
									});
									krc=JSON.stringify(krc);
									localStorage.setItem('krc',krc)
								}
							});
							player.play();
						}
				});
			}
	function bofangLove(){
		//console.log(playlist[index].filename);
		
				playlist.forEach(function(item){
					if(item.filename==current_name){
						hash=item.hash;
						singer_name=item.singername;
						localStorage.setItem('current_hash',hash);
						localStorage.setItem('current_singer',singer_name);
					}				
				});
				
				$.ajax({
						type:"get",
						url:dz_url,
						headers:{//不要写错单词！
							apikey:'a0de20180bb8e4c9f6b28867a9c414df'
						},
						dataType:'jsonp',
						data:{hash:hash},
						success:function(res){
							
							player.src=res.data.url;//更改播放地址
							timeLenght=res.data.timeLength;//获取参数timeLength的值，用来做参数time的值来查询歌词
							//通过singername搜索歌手信息获得图片````````````````````````````````````````
							$.ajax({
								type:"get",
								url:xx_url,
								headers:{//不要写错单词！
									apikey:'a0de20180bb8e4c9f6b28867a9c414df'
								},
								dataType:'jsonp',
								data:{
									name:singer_name
								},
								success:function(xx){
									singer_img.attr('src',xx.data.image);//更换歌手图片
									$('.krc').css('background','url('+xx.data.image+')');//更换歌词背景图
									//singer_img.src=xx.data.image;//无法显示图片，路径更换了
									//console.log(singer_img);
								}
							});
							//查找歌词
							$.ajax({
								type:"get",
								url:krc_url,
								headers:{//不要写错单词！
									apikey:'a0de20180bb8e4c9f6b28867a9c414df'
								},
								dataType:'jsonp',
								data:{
									name:current_name,
									hash:hash,
									time:timeLenght
								},
								success:function(krc){
									
									$('.krc').empty();
									var krcb=krc.data.content;
									krc_time=krcb.match(/\d{2}:\d{2}/g);
									//console.log(krcb);
									var krc=krcb.split(/\n\[\d{2}:\d{2}\.\d{2}\]/);
									localStorage.setItem('krc_time',JSON.stringify(krc_time));
									console.log(krc_time)
									//var krc=krcb.split(/\[\d{2}:\d{2}\.\d{2}\]/);
									krc.forEach(function(item){
										$('<p/>').html(item).appendTo($('.krc'));
									});
									krc=JSON.stringify(krc);
									localStorage.setItem('krc',krc)
								}
							});
							player.play();
						}
				});
			}
	//点击搜索生成的列表
	eList.onclick = function(e){
		//console.log(e.target.innerHTML);
		if(e.target.tagName.toLowerCase() === 'li'){
			//console.log(e.target)
			index = parseInt(e.target.dataset.idx);
			//console.log(index)
			//current_name=e.target.innerHTML;
			//更换歌曲标题
			eTitle.innerHTML=e.target.innerHTML;
			//console.log(singer_name);
			//通过hash值来获取播放地址
			console.log(parseInt(e.target.dataset.idx))
			mySwiper.slideTo(1, 100, false);//切换到第2个slide
			$('.tab span').eq(1).addClass('btn_add').siblings().removeClass('btn_add');
			bofang();		
			play();
		}
	}
	love.onclick = function(e){
		//console.log(e.target.innerHTML);
		if(e.target.tagName.toLowerCase() === 'li'){
			//console.log(e.target)
			index = parseInt(e.target.dataset.idx);
			//console.log(index)
			//current_name=e.target.innerHTML;
			//更换歌曲标题
			eTitle.innerHTML=e.target.innerHTML;
			//console.log(singer_name);
			//通过hash值来获取播放地址
			console.log(parseInt(e.target.dataset.idx))
			mySwiper.slideTo(1, 100, false);//切换到第2个slide
			$('.tab span').eq(1).addClass('btn_add').siblings().removeClass('btn_add');
			current_name=eTitle.innerHTML;
			bofangLove();		
			//play();
		}
	}
	//点击添加到我喜欢的列表
	var $loveOl=$('.love_list_list');
	if (localStorage.getItem('love')) {
		//loveList=localStorage.getItem('love');
		$loveOl.empty();
		console.log(love_list)
		love_list=JSON.parse(localStorage.getItem('love'));
		love_list.forEach(function(item){
			var $li=$('<li/>');
			
			$li.html(item);
			$li.appendTo($loveOl)
			
		})
	}
	$('.icon-like').on('click',function(){
		if(love_list.indexOf(eTitle.innerHTML)<0){
			love_list.push(eTitle.innerHTML);
		}
		
		console.log(love_list)
		var	loveSave=JSON.stringify(love_list);
		localStorage.setItem('love',loveSave);
		
		love_list.forEach(function(item){
			loveList.empty();
			var $li=$('<li/>');
			
			$li.html(item);
			$li.appendTo($loveOl)
			
		})
		
	})
//	var $eList=$(eList);
//	$eList.on('click',li,function(){
//		index=$(this).index();
//		console.log(index);
//		bofang()
//	})

	// 8）播放模式
	// 当前歌曲播放完毕后，下一步做什么
	player.onended = function(){
		// 判断播放模式
		// 0:单曲播放,1:单曲循环,2:列表播放,3:列表循环,4:随机播放
		switch(model){
			case 1:
				play();
				break;
			case 2:
				if(index<playsrc.length-1){
					index++;
					bofang();
					play();
				}
				break;
			case 3:
				index++;
				bofang();
				play();
				break;
			case 4:
				index = Math.round(Math.random()*playlist.length);
				bofang();
				play();
				break;
		}
	}
	
	// 点击改变播放模式
	eModel.onclick = function(e){
		// 判断是否点击了模式按钮
		if(e.target.classList.contains('iconfont')){
			model = parseInt(e.target.dataset.model);
		}

		// 高亮显示播放模式
		var eModels = eModel.children;
		for(var i=0;i<eModels.length;i++){
			eModels[i].classList.remove('active');
		}
		e.target.classList.add('active');
	}
	
	/**
	 * [封装播放方法]
	 * 限定索引值index的范围
	 */
	function play(){
		if(index<0){
			index = playlist.length-1;
		}else if(index > playlist.length-1){
			index = 0;
		}
		//player.src = playsrc[index];//播放途径
		//singer_img.attr('src',playimg[index]);//更换歌手图片
		eTitle.innerHTML=playlist[index].filename;//标题
		bofang();
		//本地储存当前播放信息，用以初始化时使用
		localStorage.setItem('waypoint',player.src);
		localStorage.setItem('image',singer_img.attr('src'));
		console.log(playlist[index].filename)
		localStorage.setItem('title',playlist[index].filename);
		player.play();
		
	}

	// 初始化
	// 改变播放器的初始状态
	// 歌名，图片，播放模式，时间
	function init(){
		// 改变标题
		//eTitle.innerHTML = playlist[index].singer + ' - ' + playlist[index].name;
		if(playlist[0]){
			eTitle.innerHTML=playlist[index].filename;
		}else{
			eTitle.innerHTML=localStorage.getItem('title');//标题
		}
		
		// 专辑图片
		//eAlbum.src = playlist[index].album;
		//singer_img.attr('src',playimg[index]);//更换歌手图片
		// 播放模式
		for(var i=0;i<eModel.children.length;i++){
			if(eModel.children[i].dataset.model == model){
				eModel.children[i].classList.add('active');
			}
		}

		// 更新时间
		updateTime();
		
	}
	function updateTime(){
		// 时间
		// 剩余总时间
		var leftTime = player.duration - player.currentTime;

		// 剩余多少分
		var minLeft = parseInt(leftTime/60);
		var secLeft = parseInt(leftTime%60);

		eTime.innerHTML = '-' + minLeft + ':' + (secLeft<10 ? '0' : '') + secLeft;
		// 进度条
		eProgress.value = player.currentTime/player.duration*100;
	}

})
