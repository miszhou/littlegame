# fruits

接水果小游戏

目录结构
```
文件名                            一级目录               二级目录                   三级目录
-----------------------------------------------------------------------------------------------------
├─── audio                       音频文件夹
├─── images                      图片文件夹
├─── js                          业务逻辑
│     ├─── base                                         基类
│     │     └── Sprite.js                                                             精灵基类
│     ├─── libs                                         微信辅助工具类
│     │     ├── Resources.js                                                          资源文件路径声明
│     │     ├── Utils.js                                                              工具类
│     │     ├── symbol.js                                                             对于ES6中Symbol的极简兼容
│     │     └── weapp-adapter.js                                                      微信小游戏基础适配器 
│     ├─── runtimes                                     运行中逻辑
│     │     ├── BackGround.js                                                         背景类
│     │     ├── Fruit.js                                                              水果类
│     │     ├── GameDesc.js                                                           游戏说明类
│     │     ├── Home.js                                                               首页类
│     │     ├── Music.js                                                              音乐类
│     │     ├── RankList.js                                                           排行榜类
│     │     ├── ResourcesLoader.js                                                    资源加载器
│     │     └── Restart.js                                                            开始游戏类
│     ├─── Databus.js                                   全局数据管理器 单例模式
│     ├─── Director.js                                  全局逻辑控制器 单例模式
│     └─── Main.js                                      游戏入口主函数  
└─── opendata                    开放数据域（开放域与主域文件不共享，各自可以访问本域文件）
      ├─── Utils.js                                     开放域工具类
      └─── index.js                                     开放域入口及业务逻辑
```
全局状态 
```
status：
1，home     游戏未开始 处于首页
2，parse    游戏暂停中（切换水果以及读秒的状态，每次开始游戏及切换水果会置为parse）
3，running  游戏中（玩家可操作）
4，gameover 游戏结束
```

