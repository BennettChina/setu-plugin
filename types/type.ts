/**
 * api.lolicon.app的setu响应数据结构
 * @interface LoliconSetu
 * @pid 作品ID
 * @p 作品所在页码
 * @uid 作者ID
 * @title 作品标题
 * @author 作者名称
 * @r18 是否是R18作品
 * @width 原图宽度
 * @height 原图高度
 * @tags 作品标签
 * @ext 图片扩展名
 * @uploadDate 图片上传日期，毫秒级时间戳
 * @urls 包含了所有指定size的图片地址
 */
export interface LoliconSetu {
	pid: number;
	p: number;
	uid: number;
	title: string;
	author: string;
	r18: boolean;
	width: number;
	height: number;
	tags: string[];
	ext: string;
	uploadDate: number;
	urls: {
		original: string;
		regular: string;
		small: string;
		thumb: string;
		mini: string
	};
}

/**
 * Pixiv 作品信息
 *
 * @error 接口是否正常响应
 * @message 错误信息
 * @body 图片信息
 */
export interface PixivPages {
	error: boolean;
	message: string;
	body: {
		width: number;
		height: number;
		urls: {
			original: string;
			regular: string;
			small: string;
			thumb_mini: string;
		}
	}[]
}

export interface MirrorPixivImages {
	success: boolean;
	error: string | undefined;
	id: number;
	title: string;
	artist: {
		id: number;
		name: string;
	};
	multiple: boolean;
}

export interface MirrorPixivSingleImages extends MirrorPixivImages {
	original_url: string;
	original_url_proxy: string;
}

export interface MirrorPixivMultipleImages extends MirrorPixivImages {
	original_urls: string[];
	original_urls_proxy: string[];
	thumbnails: string[];
}


export interface TitleCaptionTranslation {
	workTitle?: any;
	workCaption?: any;
}

export interface PixivImage {
	// 作品ID
	id: string;
	// 作品标题
	title: string;
	illustType: number;
	// 标志是否是R-18
	xRestrict: number;
	restrict: number;
	sl: number;
	// 缩略图
	url: string;
	description: string;
	tags: string[];
	// 作者的ID
	userId: string;
	// 作者名称
	userName: string;
	// 原始图的宽度
	width: number;
	// 原始图的高度
	height: number;
	// 作品页拥有的作品数量
	pageCount: number;
	isBookmarkable: boolean;
	bookmarkData?: any;
	alt: string;
	titleCaptionTranslation: TitleCaptionTranslation;
	createDate: string;
	updateDate: string;
	isUnlisted: boolean;
	isMasked: boolean;
	// 是否AI图（1：否，2：是）
	aiType: number;
	// 作者的头像缩略图
	profileImageUrl: string;
}

export interface PixivIllustData {
	data: PixivImage[];
	total: number;
	bookmarkRanges: {
		min?: number;
		max?: number;
	}[]
}