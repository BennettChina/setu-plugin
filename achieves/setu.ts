import { InputParameter } from "@modules/command";
import { getSetu } from "#setu-plugin/util/api";
import { LoliconSetu } from "#setu-plugin/types/type";
import { ImgPttElem, segment } from "oicq";

export async function main( { sendMessage, messageData }: InputParameter ): Promise<void> {
	let content = messageData.raw_message;
	let size = "regular";
	if ( content.endsWith( "原图" ) ) {
		size = "original";
		content = content.substr( 0, -2 ).trim();
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