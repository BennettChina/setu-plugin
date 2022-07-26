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
```

## 插件配置

```yaml
# 是否启用R18涩图（谨慎使用！！！）
r18: false
# P站的反代服务，详情见 https://api.lolicon.app/#/setu?id=proxy
proxy: i.pixiv.re
```

## 更新日志

- 2022/07/26 添加获取随机涩图功能。

## 感谢

- 感谢 [Lolicon API](https://api.lolicon.app/#/setu) 站长提供的API