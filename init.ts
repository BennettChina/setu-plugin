import { OrderConfig } from "@modules/command";
import { BOT } from "@modules/bot";
import { PluginSetting } from "@modules/plugin";
import FileManagement from "@modules/file";
import SetuConfig from "#setu-plugin/modules/SetuConfig";
import { findFreePort } from "@modules/utils";
import { createServer } from "#setu-plugin/server";
import { Renderer } from "@modules/renderer";

export let config: SetuConfig;
export let render: Renderer;

const setu: OrderConfig = {
	type: "order",
	cmdKey: "bennett-setu",
	desc: [ "获取一张涩图", "(关键词)" ],
	headers: [ "setu" ],
	regexps: [ ".*" ],
	main: "achieves/setu",
	detail: "获取一张涩图，参数：\n" +
		"无参数 随机获取一张图片\n" +
		"有参数 获取一张该关键词风格的涩图，多个关键词以空格隔开（空格AND条件，｜是OR条件）\n" +
		"比如: #setu 萝莉｜少女 白丝｜黑丝\n" +
		"如果要获取原图请在最后加上原图两字并用空格与之前的参数隔开\n" +
		"获取三次元美女图可用#setu 真人"
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

function loadConfig( file: FileManagement ): SetuConfig {
	const initCfg = SetuConfig.init;
	const fileName: string = "setu";
	
	const path: string = file.getFilePath( `${ fileName }.yml` );
	const isExist: boolean = file.isExist( path );
	if ( !isExist ) {
		file.createYAML( fileName, initCfg );
		return new SetuConfig( initCfg );
	}
	
	const config: any = file.loadYAML( fileName );
	const keysNum = o => Object.keys( o ).length;
	
	/* 检查 defaultConfig 是否更新 */
	if ( keysNum( config ) !== keysNum( initCfg ) ) {
		const c: any = {};
		const keys: string[] = Object.keys( initCfg );
		for ( let k of keys ) {
			c[k] = config[k] ? config[k] : initCfg[k];
		}
		file.writeYAML( fileName, c );
		return new SetuConfig( c );
	}
	return new SetuConfig( config );
}

// 不可 default 导出，函数名固定
export async function init( bot: BOT ): Promise<PluginSetting> {
	/* 加载 setu.yml 配置 */
	config = loadConfig( bot.file );
	bot.refresh.registerRefreshableFile( "setu", config );
	const port: number = await findFreePort( 2389 );
	createServer( port, bot.logger );
	// 注册渲染器
	render = bot.renderer.register( "setu", "/views", port, "#app" );
	
	return {
		pluginName: "setu-plugin",
		aliases: config.aliases,
		cfgList: [ setu, search, get_search ],
		repo: {
			owner: "BennettChina",
			repoName: "setu-plugin",
			ref: "master"
		}
	};
}