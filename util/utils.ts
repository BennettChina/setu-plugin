import * as sdk from "oicq";
import { MessageElem } from "oicq";
import { isGroupMessage, Message, MessageType } from "@modules/message";

function checkIterator( obj: MessageElem | Iterable<MessageElem | string> ): obj is Iterable<MessageElem | string> {
	return typeof obj[Symbol.iterator] === "function";
}

export async function sendMsg( targetInfo: TargetInfo, content: sdk.Sendable, client: sdk.Client, atUser?: boolean ): Promise<string> {
	if ( targetInfo.type === MessageType.Private ) {
		const ret = await client.sendPrivateMsg( targetInfo.targetId, content );
		if ( ret.retcode === 0 ) {
			return ret.data.message_id;
		}
		return "";
	}
	
	const at = sdk.segment.at( targetInfo.user_id )
	const space = sdk.segment.text( " " );
	if ( atUser ) {
		if ( typeof content === "string" ) {
			const split = content.length < 60 ? " " : "\n";
			content = sdk.cqcode.at( targetInfo.user_id ) + split + content;
		} else if ( checkIterator( content ) ) {
			// @ts-ignore
			content = [ at, space, ...content ];
		} else {
			const data = ( "data" in content && content.data ) ? Object.values( content.data ) : []
			content = [ at, space, sdk.segment[content.type]( ...data ) ];
		}
	}
	const ret = await client.sendGroupMsg( targetInfo.targetId, content );
	if ( ret.retcode === 0 ) {
		return ret.data.message_id;
	}
	return ""
}

/**
 * await实现线程暂定的功能，等同于 sleep
 * @param ms
 */
export async function wait( ms: number ): Promise<void> {
	return new Promise( resolve => setTimeout( resolve, ms ) );
}

/**
 * @interface
 * 聊天来源信息
 * @targetId 群号｜QQ号
 * @user_id QQ号
 * @type: 群聊｜私聊｜未知
 */
export interface TargetInfo {
	targetId: number;
	user_id: number;
	type: MessageType;
}

export const getTargetInfo: ( messageData: Message ) => TargetInfo = ( messageData ) => {
	// 获取当前对话的群号或者QQ号
	if ( isGroupMessage( messageData ) ) {
		return {
			targetId: messageData.group_id,
			user_id: messageData.user_id,
			type: MessageType.Group
		};
	} else {
		return {
			targetId: messageData.user_id,
			user_id: messageData.user_id,
			type: MessageType.Private
		};
	}
}