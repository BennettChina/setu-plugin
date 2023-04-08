import { InputParameter } from "@modules/command";
import { searchPixivImages } from "../util/api";
import { PixivIllustData } from "../types/type";
import { isPrivateMessage } from "@modules/message";
import { config, render } from "#setu-plugin/init";
import { Sendable } from "icqq";
import { RenderResult } from "@modules/renderer";
import moment from "moment";

export async function main( { sendMessage, messageData, logger, redis }: InputParameter ): Promise<void> {
	let rawMessage: string = messageData.raw_message;
	if ( !rawMessage.includes( "。" ) && /升序|降序|热度|全年龄|r18|全部|(近\d+[日天月年])/.test( rawMessage ) ) {
		await sendMessage( "请在搜索关键词后加句号与筛选条件隔开" );
		return;
	}
	rawMessage = rawMessage.includes( "。" ) ? rawMessage : rawMessage + "。";
	const qq: number = isPrivateMessage( messageData ) ? messageData.from_id : messageData.sender.user_id;
	const reg = /(?<keywords>.+)。(&?\s*(?<order>升序|降序|热度))?(&?\s*(?<mode>全年龄|r18|全部))?(&?\s*(?<page>\d+))?(&?\s*(近(?<date>\d+)(?<unit>[日天月年])))?/;
	const exec: RegExpMatchArray | null = reg.exec( rawMessage );
	const keywords: string = exec?.groups?.keywords!;
	let order: string = exec?.groups?.order || 'date_d';
	let mode: string = exec?.groups?.mode || 'all';
	const p: number = parseInt( exec?.groups?.page || "1" );
	const date: number = parseInt( exec?.groups?.date || "0" );
	const unit: string | undefined = exec?.groups?.unit;
	
	order = order === '升序' ? 'date' : order;
	order = order === '降序' ? 'date_d' : order;
	// todo 需要找个有会员的查看热度筛选时该参数的值
	// order = order === '热度' ? 'hot' : order;
	
	mode = mode === '全年龄' ? 'safe' : mode;
	mode = mode === 'r18' ? 'r18' : mode;
	if ( !config.r18 ) {
		if ( mode === 'r18' ) {
			await sendMessage( 'BOT 持有者未启用R18功能' );
		}
		mode = 'safe';
	}
	
	let scd: string | undefined;
	let ecd: string | undefined;
	if ( date > 0 && unit ) {
		ecd = moment().format( "yy-MM-DD" );
		switch ( unit ) {
			case "天":
			case "日":
				scd = moment().subtract( date, 'days' ).format( "yy-MM-DD" );
				break;
			case "月":
				scd = moment().subtract( date, 'months' ).format( "yy-MM-DD" );
				break;
			case "年":
				scd = moment().subtract( date, 'years' ).format( "yy-MM-DD" );
				break;
		}
	}
	
	try {
		const result: PixivIllustData = await searchPixivImages( keywords, order, mode, p, scd, ecd );
		await redis.setString( `search.pixiv.${ qq }`, JSON.stringify( result ), 7 * 24 * 60 * 60 );
	} catch ( e ) {
		logger.error( `搜索Pixiv图: ${ keywords } 失败`, e );
		await sendMessage( <string>e );
		return;
	}
	
	const renderResult: RenderResult = await render.asSegment( "/search_result.html", {
		"qq": qq,
		"orderType": order,
		"currentPage": p
	}, {
		width: 1800,
		height: 3000,
		// 设备比例，该值越大图片越清晰，图片也越大（对内存压力也越大，很危险容易卡死），一般1-3内选择
		// 经测试window.devicePixelRatio在macOS中为2，使用3时图片似乎过大无法上传成功。
		deviceScaleFactor: 2
	} );
	if ( renderResult.code === 'ok' ) {
		const screenshot: Sendable = renderResult.data;
		await sendMessage( screenshot );
	} else {
		logger.error( `[setu-plugin] 渲染搜索图失败: `, renderResult.error );
		await sendMessage( renderResult.error );
	}
}