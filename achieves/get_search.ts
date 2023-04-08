import { InputParameter } from "@modules/command";
import { isPrivateMessage } from "@modules/message";
import { PixivIllustData } from "#setu-plugin/types/type";
import { sendPixivImg } from "#setu-plugin/achieves/setu";
import { config } from "#setu-plugin/init";
import { wait } from "#setu-plugin/util/utils";

export async function main( i: InputParameter ): Promise<void> {
	const { sendMessage, messageData, redis, logger, client } = i;
	const reg: RegExp = /^(?<number>\d{1,2})\s*(?<size>原图)?$/;
	let exec: RegExpExecArray | null = reg.exec( messageData.raw_message );
	const number: number = parseInt( exec!.groups!.number );
	const size: string | undefined = exec?.groups?.size;
	const qq: number = isPrivateMessage( messageData ) ? messageData.from_id : messageData.sender.user_id;
	if ( number > 60 || number < 1 ) {
		await sendMessage( "序号范围为1～60" );
		return;
	}
	
	const cache: string = await redis.getString( `search.pixiv.${ qq }` );
	const result: PixivIllustData = JSON.parse( cache );
	if ( number > result.data.length ) {
		await sendMessage( `本页无${ number }条数据.` );
		return;
	}
	
	const pid: string = result.data[number - 1].id;
	logger.info( `[setu] 获取到搜索图${ pid };` );
	const messageId = await sendPixivImg( i, pid, size );
	if ( messageId && config.recallTime > 0 ) {
		logger.info( `消息: ${ messageId } 将在${ config.recallTime }秒后撤回.` );
		await wait( config.recallTime * 1000 );
		await client.deleteMsg( messageId );
	}
}