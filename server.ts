import { Logger } from "log4js";
import express from "express";
import Search from "#setu-plugin/routes/search";

export function createServer( port: number, logger: Logger ): void {
	const app = express();
	app.use( express.static( __dirname ) );
	
	app.use( "/api/search", Search );
	
	app.listen( port, () => {
		logger.info( `[setu]插件的 Express 服务器已启动, 端口为: ${ port }` );
	} );
}