import { RefreshCatch } from "@modules/management/refresh";
import { PluginAlias } from "@modules/plugin";
import { AxiosProxyConfig } from "axios";

export default class SetuConfig {
	public static init = {
		r18: false,
		proxy: "i.pixiv.re",
		humanGirls: true,
		vvhanCdn: "",
		recallTime: 0,
		aliases: [ "涩图", "色图" ],
		pixiv_cookie: "",
		pixiv_proxy: false
	};
	/** 使用启用R18涩图 */
	public r18: boolean;
	/** pixiv.net站的代理地址 */
	public proxy: string;
	/** 是否启用三次元涩图功能 */
	public humanGirls: boolean;
	/** api.vvhan.com站的代理地址 */
	public vvhanCdn: string;
	/** <recallTime>秒后消息撤回 */
	public recallTime: number;
	
	/** 更新使用的别名 */
	public aliases: string[];
	
	/** P站查询图片信息时需要的cookie*/
	public pixiv_cookie: string;
	
	public pixiv_proxy: AxiosProxyConfig | false;
	
	constructor( config: any ) {
		this.r18 = config.r18;
		this.proxy = config.proxy;
		this.humanGirls = config.humanGirls;
		this.vvhanCdn = config.vvhanCdn;
		this.recallTime = config.recallTime;
		this.aliases = config.aliases;
		this.pixiv_cookie = config.pixiv_cookie;
		this.pixiv_proxy = config.pixiv_proxy;
	}
	
	public async refresh( config ): Promise<string> {
		try {
			this.r18 = config.r18;
			this.proxy = config.proxy;
			this.humanGirls = config.humanGirls;
			this.vvhanCdn = config.vvhanCdn;
			this.recallTime = config.recallTime;
			for ( let alias of this.aliases ) {
				delete PluginAlias[alias];
			}
			this.aliases = config.aliases;
			for ( let alias of this.aliases ) {
				PluginAlias[alias] = "setu-plugin";
			}
			this.pixiv_cookie = config.pixiv_cookie;
			this.pixiv_proxy = config.pixiv_proxy;
			return "setu.yml 重新加载完毕";
		} catch ( error ) {
			throw <RefreshCatch>{
				log: ( <Error>error ).stack,
				msg: "setu.yml 重新加载失败，请前往控制台查看日志"
			};
		}
	}
}