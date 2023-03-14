import { InputParameter } from "@modules/command";
import { getHumanImgUrlRandom, getPixivImages, getSetu } from "#setu-plugin/util/api";
import { LoliconSetu } from "#setu-plugin/types/type";
import { Forwardable, ImageElem, MessageRet, segment, XmlElem } from "icqq";
import { config } from "#setu-plugin/init";
import { wait } from "#setu-plugin/util/utils";
import { isPrivateMessage } from "@modules/message";

async function sendAcgnImg( { messageData, sendMessage }: InputParameter ): Promise<string> {
	let content = messageData.raw_message;
	let size = "regular";
	if ( content.endsWith( "原图" ) ) {
		size = "original";
		content = content.slice( 0, -2 ).trim();
	}
	let setu: string | LoliconSetu;
	if ( content ) {
		const tags = content.replace( "｜", "|" ).split( " " );
		setu = await getSetu( tags, size );
	} else {
		setu = await getSetu( undefined, size );
	}
	
	if ( typeof setu === "string" ) {
		await sendMessage( setu );
		return "";
	}
	
	const image: ImageElem = segment.image( setu.urls.original || setu.urls.regular, true, 60 );
	
	const msg = `\n--------图片来源：Pixiv-------\n标题：${ setu.title }\n作者：${ setu.author }\n作者UID: ${ setu.uid }\n作品ID: ${ setu.pid }`;
	const { message_id } = await sendMessage( [ image, msg ] );
	return message_id;
}

async function sendHumanImg( { sendMessage }: InputParameter ): Promise<string> {
	if ( !config.humanGirls ) {
		await sendMessage( 'BOT 持有者已将此服务关闭，无法使用。' );
		return "";
	}
	// 随机获取一张三次元PC图或者手机图
	const url: string = await getHumanImgUrlRandom();
	const image: ImageElem = segment.image( url, true, 60 );
	const { message_id } = await sendMessage( image );
	return message_id;
}

async function sendPixivImg( {
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
	const forwardMessage: XmlElem = await client.makeForwardMsg( content, isPrivateMessage( messageData ) );
	const { message_id }: MessageRet = await sendMessage( forwardMessage );
	return message_id;
}


export async function main( i: InputParameter ): Promise<void> {
	const { messageData, client, logger }: InputParameter = i;
	const reg: RegExp = /^(?<pixivId>\d+)\s*(?<size>原图)?$/;
	let content = messageData.raw_message;
	let messageId: string;
	if ( content === "真人" ) {
		messageId = await sendHumanImg( i );
	} else if ( reg.test( content ) ) {
		let exec: RegExpExecArray | null = reg.exec( content );
		const pixivId: string = exec!.groups!.pixivId;
		const size: string | undefined = exec?.groups?.size;
		messageId = await sendPixivImg( i, pixivId, size );
	} else {
		messageId = await sendAcgnImg( i );
	}
	
	if ( messageId && config.recallTime > 0 ) {
		logger.info( `消息: ${ messageId } 将在${ config.recallTime }秒后撤回.` );
		await wait( config.recallTime * 1000 );
		await client.deleteMsg( messageId );
	}
}

