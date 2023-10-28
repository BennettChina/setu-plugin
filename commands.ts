import { ConfigType, OrderConfig } from "@/modules/command";

const setu: OrderConfig = {
	type: "order",
	cmdKey: "bennett-setu",
	desc: [ "获取一张涩图", "(关键词) (原图)" ],
	headers: [ "setu" ],
	regexps: [ ".*" ],
	main: "achieves/setu",
	detail: "获取一张涩图，参数：\n" +
		"无参数 随机获取一张图片\n" +
		"有参数 获取一张该关键词风格的涩图，多个关键词以空格隔开（空格AND条件，｜是OR条件）\n" +
		"比如: #setu 萝莉｜少女 白丝｜黑丝\n" +
		"如果要获取原图请在最后加上原图两字并用空格与之前的参数隔开\n"
}

const setu_human: OrderConfig = {
	type: "order",
	cmdKey: "bennett-setu-human",
	desc: [ "获取美女图", "" ],
	headers: [ "3dsetu" ],
	regexps: [],
	main: "achieves/setu_human",
	detail: "随机获取一张三次元美女图"
}

const pixiv: OrderConfig = {
	type: "order",
	cmdKey: "bennett-pixiv",
	desc: [ "获取P站图", "[pixiv_id] (原图)" ],
	headers: [ "pixiv" ],
	regexps: [ "\\d+", "(原图)?" ],
	main: "achieves/pixiv",
	detail: "根据PixivID获取P站图"
}

const search: OrderConfig = {
	type: "order",
	cmdKey: "bennett-search",
	desc: [ "搜索P站图", "[关键词]" ],
	headers: [ "search" ],
	regexps: [ ".+" ],
	main: "achieves/search",
	detail: "根据关键词搜索P站图，再根据返回的渲染图中pid获取相关图片或者根据搜索结果的序号(从左到右再从上到下1-60)。\n" +
		"其他可用参数包括筛选条件、排序条件(有额外参数需要在搜索关键词后用。号隔开)：\n" +
		"时间(筛选条件)：近<number>[日天月年]\n" +
		"模式(筛选条件)：全部｜全年龄｜r18\n" +
		"排序：升序｜降序｜热度，热度需要有P站的VIP才能用。\n" +
		"示例：search 花嫁 刻晴。升序&全年龄&近2月"
}

const get_search: OrderConfig = {
	type: "order",
	cmdKey: "bennett-get_search",
	desc: [ "获取搜索结果图", "[序号] (原图)" ],
	headers: [ "gs" ],
	regexps: [ "\\d{1,2}", "(原图)?" ],
	main: "achieves/get_search",
	detail: "根据搜索结果的第几张图获取这个帖子所有图片。"
}

export default <ConfigType[]>[
	setu, setu_human, pixiv, search, get_search
];