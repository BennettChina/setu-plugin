import axios, { AxiosError } from "axios";
import bot from "ROOT";
import {
	LoliconSetu,
	MirrorPixivImages,
	MirrorPixivMultipleImages,
	MirrorPixivSingleImages,
	PixivIllustData,
	PixivPages
} from "#/setu-plugin/types/type";
import { config } from "#/setu-plugin/init";

const API = {
	lolicon: "https://api.lolicon.app/setu/v2",
	girls_mobile: "https://api.vvhan.com/api/mobil.girl",
	girls_pc: "https://api.vvhan.com/api/girl",
	pixiv_image_pages: "https://www.pixiv.net/ajax/illust/$/pages?lang=zh",
	pixiv_search: "https://www.pixiv.net/ajax/search/illustrations/$",
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
				bot.logger.error( ` [setu] - 获取随机涩图失败`, reason );
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
	
	let headers = {};
	if ( config.vvhanCdn ) {
		baseurl = baseurl.replace( "https://api.vvhan.com", config.vvhanCdn );
		headers = {
			"Referer": "https://hibennett.cn/?bot=SilveryStar/Adachi-BOT&plugin=setu-plugin&version=v1"
		}
	}
	
	return new Promise( ( resolve, reject ) => {
		axios.get( `${ baseurl }?type=json`, {
			timeout: 5000,
			headers
		} )
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
					bot.logger.error( ` [setu] - 获取随机三次元涩图失败`, reason );
					reject( '获取涩图失败请前往控制台查看错误信息。' );
				}
			} )
	} );
}

export async function getPixivImages( pixivId: string, size?: string ): Promise<string[]> {
	return new Promise( ( resolve, reject ) => {
		axios.get( API.pixiv_image_pages.replace( "$", pixivId ), {
			timeout: 5000,
			headers: {
				"referer": `https://www.pixiv.net/artworks/${ pixivId }`,
				"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
				"cookie": config.pixiv_cookie,
			},
			proxy: config.pixiv_proxy
		} ).then( response => {
			const pixivInfo: PixivPages = response.data;
			if ( pixivInfo.error ) {
				reject( pixivInfo.message );
				return;
			}
			const urls: string[] = pixivInfo.body.map( body => size === "原图" ? body.urls.original : ( body.urls.regular || body.urls.original ) );
			resolve( urls );
		} ).catch( reason => {
			if ( axios.isAxiosError( reason ) ) {
				const err = <AxiosError>reason;
				if ( err.response?.data ) {
					bot.logger.debug( err.message, err.response.data );
					bot.logger.error( ` [setu] - 查询 pixiv 作品[${ pixivId }]的图片信息失败，data reason: ${ err.response.data["message"] }` );
					if ( err.response.data["message"] === "尚无权限浏览该作品" ) {
						bot.logger.error( ` [setu] - pixiv 作品[${ pixivId }]可能不存在或者cookie失效，请自行确认是否是cookie失效。` );
					} else if ( err.response.data["message"] === '出现了未知错误' ) {
						bot.logger.error( `[setu] 未知错误可能与Cookie有关，可尝试更换Cookie。` )
					}
					reject( err.response.data["message"] );
					return;
				}
				bot.logger.error( ` [setu] - 查询 pixiv 作品[${ pixivId }]的图片信息失败，reason: ${ err.message }` );
				reject( '获取图片失败请前往控制台查看错误信息。' );
			} else {
				bot.logger.error( ` [setu] - 查询 pixiv 作品[${ pixivId }]的图片信息失败`, reason );
				reject( '获取图片失败请前往控制台查看错误信息。' );
			}
		} )
	} );
}

export async function getMirrorPixivImages( pixivId: string, size?: string ): Promise<string[]> {
	const params: URLSearchParams = new URLSearchParams();
	params.append( "p", pixivId );
	return new Promise( ( resolve, reject ) => {
		axios.post( "https://api.pixiv.cat/v1/generate", params, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			proxy: config.pixiv_proxy
		} ).then( response => {
			const body: MirrorPixivImages = response.data;
			if ( !body.success ) {
				reject( body.error );
				return;
			}
			
			if ( body.multiple ) {
				const multipleBody: MirrorPixivMultipleImages = <MirrorPixivMultipleImages>body;
				const urls: string[] = multipleBody.original_urls.map( ( url: string ) => {
					return size === "原图" ? url : url.replace( "img-original", "img-master" );
				} );
				resolve( urls );
				return;
			} else {
				const singleBody: MirrorPixivSingleImages = <MirrorPixivSingleImages>body;
				// 使用这个接口返回的地址部分图只有原图没有标准图
				// const url: string = size === "原图" ? singleBody.original_url : singleBody.original_url.replace( "img-original", "img-master" );
				resolve( [ singleBody.original_url ] );
			}
		} ).catch( reason => {
			if ( axios.isAxiosError( reason ) ) {
				const err = <AxiosError>reason;
				bot.logger.error( ` [setu] - 查询 pixiv 作品[${ pixivId }]的图片信息失败，reason: ${ err.message }` );
				reject( '获取图片失败请前往控制台查看错误信息。' );
			} else {
				bot.logger.error( ` [setu] - 查询 pixiv 作品[${ pixivId }]的图片信息失败，${ reason }` );
				reject( '获取图片失败请前往控制台查看错误信息。' );
			}
		} )
	} );
}


export async function searchPixivImages( keyword: string, order: string = 'date_d', mode: string = 'all', p: number = 1, scd?: string, ecd?: string ): Promise<PixivIllustData> {
	return new Promise( ( resolve, reject ) => {
		const encodeKeyword = encodeURI( keyword );
		axios.get( API.pixiv_search.replace( "$", encodeKeyword ), {
			params: {
				word: keyword,
				order,
				mode,
				p,
				s_mode: "s_tag",
				type: "illust",
				lang: "zh",
				version: "c1aefca1551cb49622c0f05d3474af5f813f4f5e",
				scd,
				ecd
			},
			timeout: 5000,
			headers: {
				"referer": `https://www.pixiv.net/tags/${ encodeKeyword }/illustrations?s_mode=s_tag`,
				"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
				"cookie": config.pixiv_cookie,
			},
			proxy: config.pixiv_proxy
		} ).then( response => {
			if ( response.data["error"] ) {
				reject( "查询pixiv作品异常: " + response.data["message"] );
				return;
			}
			
			const pixivInfo: PixivIllustData = response.data["body"]["illust"];
			if ( config.proxy ) {
				pixivInfo.data.forEach( value => {
					value.url = value.url.replace( "i.pximg.net", config.proxy );
					value.profileImageUrl = value.profileImageUrl.replace( "i.pximg.net", config.proxy );
				} )
			}
			resolve( pixivInfo );
		} ).catch( reason => {
			if ( axios.isAxiosError( reason ) ) {
				const err = <AxiosError>reason;
				if ( err.response?.data ) {
					bot.logger.debug( err.message, err.response.data );
					bot.logger.error( ` [setu] - 查询 pixiv 作品[KEYWORD: ${ keyword }]的图片信息失败(axios:origin)，reason: ${ err.response.data["message"] }` );
					if ( err.response.data["message"] === "尚无权限浏览该作品" ) {
						bot.logger.error( ` [setu] - pixiv 作品[KEYWORD: ${ keyword }]可能不存在或者cookie失效，请自行确认是否是cookie失效。` );
					} else if ( err.response.data["message"] === '出现了未知错误' ) {
						bot.logger.error( `[setu] 未知错误可能与Cookie有关，可尝试更换Cookie。` )
					}
					reject( err.response.data["message"] );
					return;
				}
				bot.logger.error( ` [setu] - 查询 pixiv 作品[KEYWORD: ${ keyword }]的图片信息失败(axios)，reason: ${ err.message }` );
				reject( '获取图片失败请前往控制台查看错误信息。' );
			} else {
				bot.logger.error( ` [setu] - 查询 pixiv 作品[KEYWORD: ${ keyword }]的图片信息失败`, reason );
				reject( '获取图片失败请前往控制台查看错误信息。' );
			}
		} )
	} );
}