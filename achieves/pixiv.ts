import { InputParameter } from "@modules/command";
import { config } from "#setu-plugin/init";
import { wait } from "#setu-plugin/util/utils";
import { getPixivImages } from "#setu-plugin/util/api";
import { Forwardable, ImageElem, MessageRet, segment } from "icqq";
import { isPrivateMessage } from "@modules/message";

export async function sendPixivImg( {
	                                    client,
	                                    config: botConfig,
	                                    messageData,
	                                    sendMessage
                                    }: InputParameter, pixivId: string, size?: string ): Promise<string> {
	let urls: string[];
	try {
		urls = await getPixivImages( pixivId, size );
		// 镜像接口虽然不需要cookie，但仍需要代理并且没有原站的准确，不好用。
		// urls = await getMirrorPixivImages( pixivId, size );
	} catch ( e ) {
		await sendMessage( <string>e );
		return "";
	}
	if ( urls.length === 0 ) {
		await sendMessage( "未找到该作品，可能已被删除。" )
		return "";
	}
	if ( urls.length === 1 ) {
		let url = urls[0];
		if ( config.proxy ) {
			url = url.replace( "i.pximg.net", config.proxy );
		}
		const img: ImageElem = segment.image( url, true, 60 );
		const { message_id } = await sendMessage( img );
		return message_id;
	}
	const content: Forwardable[] = urls.map( url => {
		if ( config.proxy ) {
			url = url.replace( "i.pximg.net", config.proxy );
		}
		const img: ImageElem = segment.image( url, true, 60 );
		const node: Forwardable = {
			user_id: botConfig.number,
			message: img,
			nickname: client.nickname,
			time: Date.now()
		}
		return node;
	} )
	const forwardMessage = await client.makeForwardMsg( content, isPrivateMessage( messageData ) );
	const { message_id }: MessageRet = await sendMessage( forwardMessage );
	return message_id;
}

export async function main( i: InputParameter ): Promise<void> {
	const { messageData, client, logger }: InputParameter = i;
	const reg: RegExp = /^(?<pixivId>\d+)\s*(?<size>原图)?$/;
	let content = messageData.raw_message;
	let exec: RegExpExecArray | null = reg.exec( content );
	const pixivId: string = exec!.groups!.pixivId;
	const size: string | undefined = exec?.groups?.size;
	const messageId: string = await sendPixivImg( i, pixivId, size );
	if ( messageId && config.recallTime > 0 ) {
		logger.info( `消息: ${ messageId } 将在${ config.recallTime }秒后撤回.` );
		await wait( config.recallTime * 1000 );
		await client.deleteMsg( messageId );
	}
}