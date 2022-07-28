import { InputParameter } from "@modules/command";
import { getHumanImgUrlRandom, getSetu } from "#setu-plugin/util/api";
import { LoliconSetu } from "#setu-plugin/types/type";
import { ImgPttElem, segment, Sendable } from "oicq";
import { config } from "#setu-plugin/init";

async function sendAcgnImg( content: string, sendMessage: ( content: Sendable, allowAt?: boolean ) => Promise<void> ) {
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
		return;
	}
	
	const image: ImgPttElem = segment.image( setu.urls.original || setu.urls.regular, true, 30000 );
	const imageCq: string = segment.toCqcode( image );
	
	const msg = `${ imageCq }\n--------图片来源：Pixiv-------\n标题：${ setu.title }\n作者：${ setu.author }\n作者UID: ${ setu.uid }\n作品ID: ${ setu.pid }`;
	await sendMessage( msg );
}

async function sendHumanImg( sendMessage: ( content: Sendable, allowAt?: boolean ) => Promise<void> ) {
	if ( !config.humanGirls ) {
		await sendMessage( 'BOT 持有者已将此服务关闭，无法使用。' );
		return;
	}
	// 随机获取一张三次元PC图或者手机图
	const url: string = await getHumanImgUrlRandom();
	const image: ImgPttElem = segment.image( url, true, 30000 );
	await sendMessage( image );
}

export async function main( { sendMessage, messageData }: InputParameter ): Promise<void> {
	let content = messageData.raw_message;
	if ( content === "真人" ) {
		await sendHumanImg( sendMessage );
		return;
	}
	
	await sendAcgnImg( content, sendMessage );
}

