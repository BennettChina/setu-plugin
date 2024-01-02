export interface ISetuConfig {
	/** 使用启用R18涩图 */
	r18: boolean;
	/** pixiv.net站的代理地址 */
	proxy: string;
	/** api.vvhan.com站的代理地址 */
	vvhanCdn: string;
	/** <recallTime>秒后消息撤回 */
	recallTime: number;
	
	/** 更新使用的别名 */
	aliases: string[];
	
	/** P站查询图片信息时需要的cookie*/
	pixiv_cookie: string;
	
	pixiv_proxy: {
		enabled: boolean;
		host: string;
		port: number;
		auth?: {
			username: string;
			password: string;
		};
		protocol?: string;
	};
}

export default class SetuConfig implements ISetuConfig {
	public static init: ISetuConfig = {
		r18: false,
		proxy: "i.pixiv.re",
		vvhanCdn: "",
		recallTime: 0,
		aliases: [ "涩图", "色图" ],
		pixiv_cookie: "",
		pixiv_proxy: {
			enabled: false,
			host: "127.0.0.1",
			port: 7890,
			protocol: "http:"
		}
	};
	/** 使用启用R18涩图 */
	public r18: boolean;
	/** pixiv.net站的代理地址 */
	public proxy: string;
	/** api.vvhan.com站的代理地址 */
	public vvhanCdn: string;
	/** <recallTime>秒后消息撤回 */
	public recallTime: number;
	
	/** 更新使用的别名 */
	public aliases: string[];
	
	/** P站查询图片信息时需要的cookie*/
	public pixiv_cookie: string;
	
	public pixiv_proxy: {
		enabled: boolean;
		host: string;
		port: number;
		auth?: {
			username: string;
			password: string;
		};
		protocol?: string;
	};
	
	constructor( config: any ) {
		this.r18 = config.r18;
		this.proxy = config.proxy;
		this.vvhanCdn = config.vvhanCdn;
		this.recallTime = config.recallTime;
		this.aliases = config.aliases;
		this.pixiv_cookie = config.pixiv_cookie;
		this.pixiv_proxy = config.pixiv_proxy;
	}
}