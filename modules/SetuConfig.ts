import { RefreshCatch } from "@modules/management/refresh";

export default class SetuConfig {
	public r18: boolean;
	public proxy: string;
	public humanGirls: boolean;
	
	constructor( config: any ) {
		this.r18 = config.r18;
		this.proxy = config.proxy;
		this.humanGirls = config.humanGirls;
	}
	
	public static init = {
		r18: false,
		proxy: "i.pixiv.re",
		humanGirls: true
	};
	
	public async refresh( config ): Promise<string> {
		try {
			this.r18 = config.r18;
			this.proxy = config.proxy;
			this.humanGirls = config.humanGirls;
			return "setu.yml 重新加载完毕";
		} catch ( error ) {
			throw <RefreshCatch>{
				log: ( <Error>error ).stack,
				msg: "setu.yml 重新加载失败，请前往控制台查看日志"
			};
		}
	}
}