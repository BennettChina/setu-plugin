import { defineDirective, InputParameter } from "@/modules/command";
import { getSetu } from "#/setu-plugin/util/api";
import { LoliconSetu } from "#/setu-plugin/types/type";
import { config } from "#/setu-plugin/init";
import { wait } from "#/setu-plugin/util/utils";
import { segment } from "@/modules/lib";

async function sendAcgnImg( { messageData, sendMessage }: InputParameter ) {
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
		return 0;
	}
	
	const image = segment.image( setu.urls.original || setu.urls.regular );
	
	const msg = `\n--------图片来源：Pixiv-------\n标题：${ setu.title }\n作者：${ setu.author }\n作者UID: ${ setu.uid }\n作品ID: ${ setu.pid }`;
	return await sendMessage( [ image, msg ] );
}

export default defineDirective( "order", async ( i ) => {
	const { client, logger }: InputParameter = i;
	const messageId = await sendAcgnImg( i );
	if ( messageId && config.recallTime > 0 ) {
		logger.info( `消息: ${ messageId } 将在${ config.recallTime }秒后撤回.` );
		await wait( config.recallTime * 1000 );
		await client.recallMessage( messageId );
	}
} )