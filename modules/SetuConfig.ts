import { RefreshCatch } from "@modules/management/refresh";

export default class SetuConfig {
	public static init = {
		r18: false,
		proxy: "i.pixiv.re",
		humanGirls: true,
		vvhanCdn: "",
		recallTime: 0
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
	
	constructor( config: any ) {
		this.r18 = config.r18;
		this.proxy = config.proxy;
		this.humanGirls = config.humanGirls;
		this.vvhanCdn = config.vvhanCdn;
		this.recallTime = config.recallTime;
	}
	
	public async refresh( config ): Promise<string> {
		try {
			this.r18 = config.r18;
			this.proxy = config.proxy;
			this.humanGirls = config.humanGirls;
			this.vvhanCdn = config.vvhanCdn;
			this.recallTime = config.recallTime;
			return "setu.yml 重新加载完毕";
		} catch ( error ) {
			throw <RefreshCatch>{
				log: ( <Error>error ).stack,
				msg: "setu.yml 重新加载失败，请前往控制台查看日志"
			};
		}
	}
}