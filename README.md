本项目为 [SilveryStar/Adachi-BOT](https://github.com/SilveryStar/Adachi-BOT) 衍生插件，用于获取涩图。

## 安装

在 `src/plugins`目录下使用下面的命令

### 网好用这个

```sh
git clone https://github.com/BennettChina/setu-plugin.git
```

### 网差用这两个

```shell
git clone https://ghproxy.com/https://github.com/BennettChina/setu-plugin.git
```

需要注意的时 `GitClone` 镜像同步比较慢(夜间同步)，因此如果 `pull` 时未拉取到内容可将插件删掉用 `Ghproxy` 重新克隆。

```shell
git clone https://gitclone.com/github.com/BennettChina/setu-plugin.git
```

> 感谢[GitClone](https://gitclone.com/) 和 [GitHub Proxy](https://ghproxy.com/) 提供的镜像服务！

## 使用方法

```
# 随机获取一张涩图
命令: <header> setu
范围: 群/私聊
权限: 用户 (User)

# 获取一张指定内容的涩图(后面的关键词空格AND条件，｜是OR条件),如果要获取原图请在最后加上原图两字并用空格与之前的参数隔开
命令: <header> setu 刻晴|甘雨 黑丝|白丝 原图
范围: 群/私聊
权限: 用户 (User)

# 随机获取一张三次元涩图
命令: <header> setu 真人
范围: 群/私聊
权限: 用户 (User)
```

## 插件配置

```yaml
# 是否启用R18涩图（谨慎使用！！！）
r18: false
# P站的反代服务，详情见 https://api.lolicon.app/#/setu?id=proxy
proxy: i.pixiv.re
# 是否开启发送三次元涩图的功能 (韩小韩的API，海外不可用)
humanGirls: true
# 韩小韩API的CDN（由于该站长未开启海外IP的可用，因此需要自行部署CDN来代理他的API，没有域名的可以使用我为你们提供的CDN）
vvhanCdn: "https://vvhan.hibennett.cn"
# <recallTime>秒后消息撤回
recallTime: 0
aliases:
    - 涩图
    - 色图
# pixiv的cookie， 不能直接用脚本获取（因为该站使用了大量的httpOnly的cookie），需要通过F12获取网络请求中的cookie，随便在P站中找一个作品打开
# 然后在网络请求中找到最后一段是数字的网络请求，拿到cookie值。
pixiv_cookie: ""
# 系统代理设置，国内服务器必须设置系统代理，因为访问P站接口必须通过代理否则无法连接。
# 仅接口使用该代理，图片下载仍使用上面的反代服务，所以不用担心流量问题。
pixiv_proxy: false
```

```ts
// 以下是关于pixiv_proxy 属性的类型定义
interface AxiosProxyConfig {
    host: string;
    port: number;
    auth?: {
        username: string;
        password: string;
    };
    protocol?: string;
}

const puxiv_proxy: AxiosProxyConfig | false = false;
```

## 更新日志

- 2022/12/07 增加通过P站作品ID获取 pixiv 图的功能。
- 2022/10/07 支持插件的别名更新
- 2022/08/12 增加消息延迟撤回配置， `recallTime` 祥见配置。
- 2022/08/08 增加韩小韩CDN配置来支持海外用户，祥见配置项。
- 2022/07/28 添加随机获取三次元涩图功能（使用韩小韩的API，海外不可用）。
- 2022/07/26 添加获取随机涩图功能。

## 感谢

- 感谢 [Lolicon API](https://api.lolicon.app/#/setu) 站长提供的API
- 感谢 [韩小韩](https://api.vvhan.com/) 提供的 API 服务。