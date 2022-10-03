const doms = {
	audio: document.getElementsByTagName("audio")[0],
	ul: document.getElementsByTagName("ul")[0],
};
const musciInfo = {
	lyric:
		"[00:00.000] 作词 : 光良\n[00:00.655] 作曲 : 光良\n[00:01.310] 编曲 : Taichi Nakamura\n[00:01.965] 制作人 : 光良/陈建良\n[00:02.620] 配唱 : 陈建良\n[00:03.275] 录音工程师 : Kohsuke Sakata/陈彦江\n[00:03.930] 录音室 : bluesofa (JP)/敬业录音室 (TW)\n[00:04.585] 混音工程师 : Im Chang Duk\n[00:05.240] 混音助理 : Kim Young Sik\n[00:05.895] 混音室 : Booming Sound Studio (KR)\n[00:06.550] 录音助理 : 邱弈维\n[00:07.205] 钢琴 : Akimitsu Homma (bluesofa)\n[00:07.860] 低音吉他 : Taichi Nakamura (bluesofa)\n[00:08.515] 吉他 : Taichi Nakamura (bluesofa)\n[00:09.170] 和声/和声编写 : 光良\n[00:09.825] OP : 多奇娱乐工作室 Doggie Entertainment\n[00:10.480] SP : Rock Music Publishing Co./Ltd.\n[00:11.135] ISRC TW-A45-05-82102\n[00:11.790] \n[00:12.445] 制作人经纪：Shinjiro Nitta (bluesofa)\n[00:13.107]忘了有多久 再没听到你\n[00:19.807]对我说你 最爱的故事\n[00:26.877]我想了很久 我开始慌了\n[00:33.929]是不是我又 做错了什么\n[00:40.999]你哭着对我说 童话里都是骗人的\n[00:49.290]我不可能是你的王子\n[00:55.799]也许你不会懂 从你说爱我以后\n[01:02.199]我的天空 星星都亮了\n[01:10.200]我愿变成童话里 你爱的那个天使\n[01:16.989]张开双手 变成翅膀守护你\n[01:24.80]你要相信 相信我们会像童话故事里\n[01:30.889]幸福和快乐是结局\n[01:48.699]你哭着对我说 童话里都是骗人的\n[01:55.99]我不可能是你的王子\n[02:02.118]也许你不会懂 从你说爱我以后\n[02:09.196]我的天空 星星都亮了\n[02:16.187]我愿变成童话里 你爱的那个天使\n[02:23.888]张开双手 变成翅膀守护你\n[02:31.188]你要相信 相信我们会像童话故事里\n[02:37.977]幸福和快乐是结局\n[02:44.526]我要变成童话里 你爱的那个天使\n[02:51.557]张开双手 变成翅膀守护你\n[02:58.567]你要相信 相信我们会像童话故事里\n[03:06.297]幸福和快乐是结局\n[03:12.776]我会变成童话里 你爱的那个天使\n[03:19.787]张开双手 变成翅膀守护你\n[03:26.767]你要相信 相信我们会像童话故事里\n[03:34.488]幸福和快乐是结局\n[03:44.967]一起写 我们的结局\n",
	url: "http://m10.music.126.net/20221003153411/4fbe220b66a7dca0557b9c4e907f46e1/ymusic/bc89/644c/89d6/fe58e906214257cf7094860e904bd0c0.flac",
};
doms.audio.src = musciInfo.url;

/**
 *
 * @param {*} lyricinfo 请求回来的歌词格式
 * @returns 返回处理后的数据
 */
const getLyricAndTime = (lyricinfo) => {
	const info = lyricinfo.split("\n");
	let arrmusciinfo = [];
	info.map((items) => {
		const LyricandTime = {
			lyric: items.split("]")[1],
			time: calculateTime(items.split("]")[0].slice(1)),
		};
		arrmusciinfo.push(LyricandTime);
	});
	arrmusciinfo.pop();
	return arrmusciinfo;
};
/**
 *
 * @param {*} time 原时间格式
 * @returns 处理后的时间格式
 */
const calculateTime = (time) => {
	const min = time.split(":");
	let times;
	if (+min[0] > 0) {
		times = Number(min[0]) * 60 + Number(min[1]);
	} else {
		times = +min[1];
	}
	return times != NaN ? times : "";
};

/**
 *
 * @param {*} arrmusciinfo 处理后的歌词格式
 * 该函数进行li的动态渲染
 */
const getNode = (arrmusciinfo) => {
	for (let i = 0; i < arrmusciinfo.length; i++) {
		const li = document.createElement("li");
		li.innerHTML = arrmusciinfo[i].lyric != undefined ? arrmusciinfo[i].lyric : "";
		doms.ul.appendChild(li);
	}
};

/**
 *
 * @param {*} arrmusciinfo 处理后的歌词数据
 * @returns 返回当前正在播放的歌词下标
 */
const getindex = (arrmusciinfo) => {
	const audiotime = doms.audio.currentTime;
	if (audiotime > arrmusciinfo[arrmusciinfo.length - 1].time) {
		return arrmusciinfo.length - 1;
	}
	for (let i = 0; i < arrmusciinfo.length; i++) {
		if (audiotime > arrmusciinfo[i].time && audiotime < arrmusciinfo[i + 1].time) {
			return i;
		}
	}
};

/**
 * 进行dom操作
 */
const setoff = () => {
	const index =
		getindex(getLyricAndTime(musciInfo.lyric)) == undefined ? 0 : getindex(getLyricAndTime(musciInfo.lyric));
	const li = doms.ul.querySelector(".active");
	if (li) {
		li.classList.remove("active");
	}
	doms.ul.children[index].classList.add("active");
	const h = doms.ul.children[0].clientHeight;
	const contain = document.getElementsByClassName("list")[0].clientHeight;
	let moveH = h * index + h / 2 - contain / 2;
	if (moveH < 0) {
		moveH = 0;
	}
	doms.ul.style.transform = `translateY(-${moveH}px)`;
};
// 监听事件
doms.audio.addEventListener("timeupdate", () => {
	setoff();
});
// dom更新
getNode(getLyricAndTime(musciInfo.lyric));
