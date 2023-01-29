import { InputParameter, Order } from "@modules/command";
import { getHumanImgUrlRandom, getPixivImages, getSetu } from "#setu-plugin/util/api";
import { LoliconSetu } from "#setu-plugin/types/type";
import { Client, FakeMessage, ImgPttElem, Ret, segment, XmlElem } from "oicq";
import { config } from "#setu-plugin/init";
import { getTargetInfo, sendMsg, wait } from "#setu-plugin/util/utils";
import { isPrivateMessage, Message } from "@modules/message";
import bot from "ROOT";

async function sendAcgnImg( messageData: Message, client: Client, atUser: boolean ): Promise<string> {
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
		await sendMsg( getTargetInfo( messageData ), setu, client, atUser );
		return "";
	}
	
	const image: ImgPttElem = segment.image( setu.urls.original || setu.urls.regular, true, 30000 );
	const imageCq: string = segment.toCqcode( image );
	
	const msg = `${ imageCq }\n--------图片来源：Pixiv-------\n标题：${ setu.title }\n作者：${ setu.author }\n作者UID: ${ setu.uid }\n作品ID: ${ setu.pid }`;
	return await sendMsg( getTargetInfo( messageData ), msg, client, atUser );
}

async function sendHumanImg( messageData: Message, client: Client, atUser: boolean ): Promise<string> {
	if ( !config.humanGirls ) {
		await sendMsg( getTargetInfo( messageData ), 'BOT 持有者已将此服务关闭，无法使用。', client, atUser );
		return "";
	}
	// 随机获取一张三次元PC图或者手机图
	const url: string = await getHumanImgUrlRandom();
	const image: ImgPttElem = segment.image( url, true, 30000 );
	const imageCq: string = segment.toCqcode( image );
	return await sendMsg( getTargetInfo( messageData ), imageCq, client, atUser );
}

async function sendPixivImg( {
	                             client,
	                             config: botConfig,
	                             messageData,
	                             sendMessage
                             }: InputParameter, pixivId: string, size?: string ) {
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
		const img: ImgPttElem = segment.image( url, true, 30000 );
		return await sendMsg( getTargetInfo( messageData ), img, client, botConfig.atUser );
	}
	const content: FakeMessage[] = urls.map( url => {
		if ( config.proxy ) {
			url = url.replace( "i.pximg.net", config.proxy );
		}
		const img: ImgPttElem = segment.image( url, true, 30000 );
		const node: FakeMessage = {
			user_id: botConfig.number,
			message: img,
			nickname: client.nickname,
			time: Date.now()
		}
		return node;
	} )
	const forwardMessage: Ret<XmlElem> = await client.makeForwardMsg( content, isPrivateMessage( messageData ) );
	if ( forwardMessage.status === 'ok' ) {
		return await sendMsg( getTargetInfo( messageData ), forwardMessage.data, client, false );
	} else {
		const CALL = <Order>bot.command.getSingle( "adachi.call", await bot.auth.get( messageData.user_id ) );
		const appendMsg = CALL ? `私聊使用 ${ CALL.getHeaders()[0] } ` : "";
		await sendMessage( `转发消息生成错误，请${ appendMsg }联系持有者进行反馈` );
		return ""
	}
}

export async function main( i: InputParameter ): Promise<void> {
	const { messageData, client, config: botConfig, logger }: InputParameter = i;
	const reg: RegExp = /^(?<pixivId>\d+)\s*(?<size>原图)?$/;
	let content = messageData.raw_message;
	let messageId: string;
	if ( content === "真人" ) {
		messageId = await sendHumanImg( messageData, client, botConfig.atUser );
	} else if ( reg.test( content ) ) {
		let exec: RegExpExecArray | null = reg.exec( content );
		const pixivId: string = exec!.groups!.pixivId;
		const size: string | undefined = exec?.groups?.size;
		messageId = await sendPixivImg( i, pixivId, size );
	} else {
		messageId = await sendAcgnImg( messageData, client, botConfig.atUser );
	}
	
	if ( messageId && config.recallTime > 0 ) {
		logger.info( `消息: ${ messageId } 将在${ config.recallTime }秒后撤回.` );
		await wait( config.recallTime * 1000 );
		await client.deleteMsg( messageId );
	}
}

