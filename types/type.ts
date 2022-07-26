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