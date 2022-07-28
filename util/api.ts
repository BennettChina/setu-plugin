import axios, { AxiosError } from "axios";
import bot from "ROOT";
import { LoliconSetu } from "#setu-plugin/types/type";
import { config } from "#setu-plugin/init";

const API = {
	lolicon: "https://api.lolicon.app/setu/v2",
	girls_mobile: "https://api.vvhan.com/api/mobil.girl",
	girls_pc: "https://api.vvhan.com/api/girl"
}

export async function getSetu( tags: string[] | undefined = undefined, size: string = "regular" ): Promise<string | LoliconSetu> {
	let r18: number = 0;
	if ( config.r18 ) {
		r18 = 2;
	}
	return new Promise( resolve => {
		axios.post( API.lolicon, {
			tag: tags,
			r18,
			size,
			proxy: config.proxy
		}, {
			timeout: 30000
		} ).then( response => {
			const data = response.data;
			if ( data.error ) {
				bot.logger.error( ` [setu] - 获取随机涩图失败，error: ${ data.error }` );
				resolve( '获取涩图失败请前往控制台查看错误信息。' );
				return;
			}
			
			if ( data.data.length === 0 ) {
				resolve( "未找到符合条件的涩图" );
				return;
			}
			
			const setu = <LoliconSetu>data.data[0];
			resolve( setu );
		} ).catch( reason => {
			if ( axios.isAxiosError( reason ) ) {
				const err = <AxiosError>reason;
				bot.logger.error( ` [setu] - 获取随机涩图失败，reason: ${ err.message }` );
				resolve( '获取涩图失败请前往控制台查看错误信息。' );
			} else {
				bot.logger.error( ` [setu] - 获取随机涩图失败，${ reason }` );
				resolve( '获取涩图失败请前往控制台查看错误信息。' );
			}
		} )
	} );
}

function randomInt( min: number, max: number ): number {
	const range: number = max - min + 1;
	return min + Math.floor( Math.random() * range );
}

export async function getHumanImgUrlRandom(): Promise<string> {
	const num: number = randomInt( 0, 100 );
	let baseurl: string = API.girls_pc;
	if ( num <= 50 ) {
		baseurl = API.girls_mobile;
	}
	
	return new Promise( ( resolve, reject ) => {
		axios.get( `${ baseurl }?type=json`, { timeout: 5000 } )
			.then( response => {
				if ( response.data.success ) {
					const imgUrl = response.data.imgurl;
					resolve( imgUrl );
				}
			} )
			.catch( reason => {
				if ( axios.isAxiosError( reason ) ) {
					const err = <AxiosError>reason;
					bot.logger.error( ` [setu] - 获取随机三次元涩图失败，reason: ${ err.message }` );
					reject( '获取涩图失败请前往控制台查看错误信息。' );
				} else {
					bot.logger.error( ` [setu] - 获取随机三次元涩图失败，${ reason }` );
					reject( '获取涩图失败请前往控制台查看错误信息。' );
				}
			} )
	} );
}