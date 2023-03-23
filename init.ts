import { OrderConfig } from "@modules/command";
import { BOT } from "@modules/bot";
import { PluginSetting } from "@modules/plugin";
import FileManagement from "@modules/file";
import SetuConfig from "#setu-plugin/modules/SetuConfig";

export let config: SetuConfig;

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
	
	return {
		pluginName: "setu-plugin",
		aliases: config.aliases,
		cfgList: [ setu ],
		repo: {
			owner: "BennettChina",
			repoName: "setu-plugin",
			ref: "master"
		}
	};
}