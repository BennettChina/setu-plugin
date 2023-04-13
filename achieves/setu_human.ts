import { InputParameter } from "@modules/command";
import { config } from "#setu-plugin/init";
import { wait } from "#setu-plugin/util/utils";
import { getHumanImgUrlRandom } from "#setu-plugin/util/api";
import { ImageElem, segment } from "icqq";

async function sendHumanImg( { sendMessage }: InputParameter ): Promise<string> {
	// 随机获取一张三次元PC图或者手机图
	const url: string = await getHumanImgUrlRandom();
	const image: ImageElem = segment.image( url, true, 60 );
	const { message_id } = await sendMessage( image );
	return message_id;
}

export async function main( i: InputParameter ): Promise<void> {
	const { client, logger }: InputParameter = i;
	const messageId: string = await sendHumanImg( i );
	if ( messageId && config.recallTime > 0 ) {
		logger.info( `消息: ${ messageId } 将在${ config.recallTime }秒后撤回.` );
		await wait( config.recallTime * 1000 );
		await client.deleteMsg( messageId );
	}
}