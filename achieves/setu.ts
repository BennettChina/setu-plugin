import { InputParameter } from "@modules/command";
import { getSetu } from "#setu-plugin/util/api";
import { LoliconSetu } from "#setu-plugin/types/type";
import { ImageElem, segment } from "icqq";
import { config } from "#setu-plugin/init";
import { wait } from "#setu-plugin/util/utils";

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

export async function main( i: InputParameter ): Promise<void> {
	const { client, logger }: InputParameter = i;
	const messageId: string = await sendAcgnImg( i );
	if ( messageId && config.recallTime > 0 ) {
		logger.info( `消息: ${ messageId } 将在${ config.recallTime }秒后撤回.` );
		await wait( config.recallTime * 1000 );
		await client.deleteMsg( messageId );
	}
}

