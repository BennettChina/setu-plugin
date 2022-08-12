import { InputParameter } from "@modules/command";
import { getHumanImgUrlRandom, getSetu } from "#setu-plugin/util/api";
import { LoliconSetu } from "#setu-plugin/types/type";
import { Client, ImgPttElem, segment } from "oicq";
import { config } from "#setu-plugin/init";
import { getTargetInfo, sendMsg, wait } from "#setu-plugin/util/utils";
import { Message } from "@modules/message";

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

export async function main( { messageData, client, config: botConfig, logger }: InputParameter ): Promise<void> {
	let content = messageData.raw_message;
	let messageId: string;
	if ( content === "真人" ) {
		messageId = await sendHumanImg( messageData, client, botConfig.atUser );
	} else {
		messageId = await sendAcgnImg( messageData, client, botConfig.atUser );
	}
	
	if ( messageId && config.recallTime > 0 ) {
		logger.info( `消息: ${ messageId } 将在${ config.recallTime }秒后撤回.` );
		await wait( config.recallTime * 1000 );
		await client.deleteMsg( messageId );
	}
}

