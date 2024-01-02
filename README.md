本项目为 [SilveryStar/Adachi-BOT](https://github.com/SilveryStar/Adachi-BOT) 衍生插件，用于获取涩图。

## 安装

在 `src/plugins`目录下使用下面的命令

### 网好用这个

```sh
git clone https://github.com/BennettChina/setu-plugin.git
```

### 网差用这两个

```shell
git clone https://mirror.ghproxy.com/https://github.com/BennettChina/setu-plugin.git
```

需要注意的时 `GitClone` 镜像同步比较慢(夜间同步)，因此如果 `pull` 时未拉取到内容可将插件删掉用 `Ghproxy` 重新克隆。

```shell
git clone https://gitclone.com/github.com/BennettChina/setu-plugin.git
```

> 感谢[GitClone](https://gitclone.com/) 和 [GitHub Proxy](https://mirror.ghproxy.com/) 提供的镜像服务！

## 使用方法

```
# 随机获取一张涩图
命令: <header> setu
范围: 群/私聊
权限: 用户 (User)

# 获取一张指定内容的涩图(后面的关键词空格AND条件，｜是OR条件),如果要获取原图请在最后加上原图两字并用空格与之前的参数隔开
命令: <header> setu 刻晴|甘雨 黑丝|白丝
命令: <header> setu 刻晴|甘雨 黑丝|白丝 原图
范围: 群/私聊
权限: 用户 (User)

# 随机获取一张三次元涩图
命令: <header> 3setu
范围: 群/私聊
权限: 用户 (User)

# 使用 pid 获取 pixiv 图，默认使用标准图，给原图参数下载原图
命令: <header> pixiv 100905772
命令: <header> pixiv 100905772 原图
范围: 群/私聊
权限: 用户 (User)

# 根据关键字搜索P站图
命令: <header> search 花嫁 刻晴
# 关键词后如果有筛选/排序条件则需要在关键词后加。号隔开，条件包括：
# 时间：近<number>[日天月年]
# 模式：全部｜全年龄｜r18
# 排序：升序｜降序｜热度，热度需要有P站的VIP才能用。
命令: <header> search 花嫁 刻晴。升序&全年龄&近2月
范围: 群/私聊
权限: 用户 (User)

# 根据搜索结果的序号（1-60）获取该帖子的所有图(pid的方式依旧使用 setu 指令)
命令: <header> gs 2
范围: 群/私聊
权限: 用户 (User)
```

## 插件配置

```yaml
# 是否启用R18涩图（谨慎使用！！！）
r18: false
# P站的反代服务，详情见 https://api.lolicon.app/#/setu?id=proxy
proxy: i.pixiv.re
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
pixiv_proxy:
    enabled: false
    host: "127.0.0.1"
    port: 7890
    protocol: "http:"
```

```ts
// 以下是关于pixiv_proxy 属性的类型定义
class Config {
    pixiv_proxy: {
        enabled: boolean;
        host: string;
        port: number;
        auth?: {
            username: string;
            password: string;
        };
        protocol?: string;
    };
}
```

## P站反代服务

| 提供者     | 代理域名                | 备注    |
|---------|---------------------|-------|
| P猫      | `i.pixiv.re`        | 大陆可访问 |
| P猫      | `i.pixiv.nl`        | 大陆可访问 |
| Yuki    | `pixiv.yuki.sh`     | 大陆可访问 |
| pixivel | `proxy.pixivel.moe` | 大陆可访问 |
| P猫      | `i.pixiv.cat`       | 仅海外   |

也可以自行搭建反代服务，可参考[P猫的设置](https://pixiv.cat/reverseproxy.html)，无法访问可以直接看下面的配置。

### Nginx

```nginx
proxy_cache_path /path/to/cache levels=1:2 keys_zone=pximg:10m max_size=10g inactive=7d use_temp_path=off;

server {
    listen 443 ssl http2;

    ssl_certificate /path/to/ssl_certificate.crt;
    ssl_certificate_key /path/to/ssl_certificate.key;

    server_name i.pixiv.cat;
    access_log off;

    location / {
    proxy_cache pximg;
    proxy_pass https://i.pximg.net;
    proxy_cache_revalidate on;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    proxy_cache_lock on;
    add_header X-Cache-Status $upstream_cache_status;
    proxy_set_header Host i.pximg.net;
    proxy_set_header Referer "https://www.pixiv.net/";

    proxy_cache_valid 200 7d;
    proxy_cache_valid 404 5m;
 }
}
```

### Cloudflare Workers

```js
addEventListener("fetch", event => {
    let url = new URL(event.request.url);
    url.hostname = "i.pximg.net";

    let request = new Request(url, event.request);
    event.respondWith(
            fetch(request, {
                headers: {
                    'Referer': 'https://www.pixiv.net/',
                    'User-Agent': 'Cloudflare Workers'
                }
            })
    );
});
```

## 感谢

- 感谢 [Lolicon API](https://api.lolicon.app/#/setu) 站长提供的API
- 感谢 [韩小韩](https://api.vvhan.com/) 提供的 API 服务。
- 感谢上述的反代服务提供者。