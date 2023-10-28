import { InputParameter } from "@/modules/command";
import { config } from "#/setu-plugin/init";
import { wait } from "#/setu-plugin/util/utils";
import { getHumanImgUrlRandom } from "#/setu-plugin/util/api";
import { segment } from "@/modules/lib";

async function sendHumanImg( { sendMessage }: InputParameter ) {
	// 随机获取一张三次元PC图或者手机图
	const url: string = await getHumanImgUrlRandom();
	const image = segment.image( url );
	return await sendMessage( image );
}

export async function main( i: InputParameter ): Promise<void> {
	const { client, logger }: InputParameter = i;
	const messageId = await sendHumanImg( i );
	if ( messageId && config.recallTime > 0 ) {
		logger.info( `消息: ${ messageId } 将在${ config.recallTime }秒后撤回.` );
		await wait( config.recallTime * 1000 );
		await client.recallMessage( messageId );
	}
}