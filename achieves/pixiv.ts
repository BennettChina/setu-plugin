import { defineDirective, InputParameter } from "@/modules/command";
import { config } from "#/setu-plugin/init";
import { wait } from "#/setu-plugin/util/utils";
import { getPixivImages } from "#/setu-plugin/util/api";
import { ForwardElem, segment } from "@/modules/lib";

export async function sendPixivImg( { client, sendMessage }: InputParameter, pixivId: string, size?: string ) {
	let urls: string[];
	try {
		urls = await getPixivImages( pixivId, size );
		// 镜像接口虽然不需要cookie，但仍需要代理并且没有原站的准确，不好用。
		// urls = await getMirrorPixivImages( pixivId, size );
	} catch ( e ) {
		await sendMessage( <string>e );
		return 0;
	}
	if ( urls.length === 0 ) {
		await sendMessage( "未找到该作品，可能已被删除。" );
		return 0;
	}
	if ( urls.length === 1 ) {
		let url = urls[0];
		if ( config.proxy ) {
			url = url.replace( "i.pximg.net", config.proxy );
		}
		const img = segment.image( url );
		return await sendMessage( img );
	}
	const info = await client.getLoginInfo();
	const content: ForwardElem = {
		type: "forward",
		messages: urls.map( url => {
			if ( config.proxy ) {
				url = url.replace( "i.pximg.net", config.proxy );
			}
			const img = segment.image( url );
			return {
				uin: client.uin,
				content: img,
				name: info.data.nickname,
			};
		} )
	}
	return await sendMessage( content );
}

export default defineDirective( "order", async ( i ) => {
	const { messageData, client, logger }: InputParameter = i;
	const reg: RegExp = /^(?<pixivId>\d+)\s*(?<size>原图)?$/;
	let content = messageData.raw_message;
	let exec: RegExpExecArray | null = reg.exec( content );
	const pixivId: string = exec!.groups!.pixivId;
	const size: string | undefined = exec?.groups?.size;
	const messageId = await sendPixivImg( i, pixivId, size );
	if ( messageId && config.recallTime > 0 ) {
		logger.info( `消息: ${ messageId } 将在${ config.recallTime }秒后撤回.` );
		await wait( config.recallTime * 1000 );
		await client.recallMessage( messageId );
	}
} )