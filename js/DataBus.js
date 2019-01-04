import Utils from './libs/Utils.js'
// 全局数据管理器 单例模式
export default class DataBus{
  constructor(){
    this.map = new Map()
    this.ratio = wx.getSystemInfoSync().pixelRatio
    this.endgame = true
    // 生命值
    this.defaultheart = 3
    // 分数
    this.score = 0
    // 游戏状态
    this.status = "home"
    // 连续得分
    this.linkscore = 0
    // 排行榜是否处于显示状态
    this.ranklist = false
    this.desc = false
    this.scorepage = "score"
    this.retry = false
    this.getinfotimes = 0
    this.islogin = false
    this.utils = new Utils()
    // 水果图片基本参数
    this.pointfruits = [
      {
        text: "一阶目标水果",    // 提示
        time: 600,            // 与下一个目标水果的时间间隔 单位帧 60=1S
      },
      {
        text: "二阶目标水果",    // 提示
        time: 1200,            // 与下一个目标水果的时间间隔
      },
      {
        text: "三阶目标水果",    // 提示
        time: 1800,            // 时间间隔
      },
    ]
    this.pointindex = 0
    // 目标水果展示时间
    this.pointshowtime = 25
    // 数字展示时间
    this.numshowtime = 15
    // 切换间隔 数字之间以及目标水果与第一个数字之间
    this.changetime = 10
  }
  set(key, value){
    if (typeof value === 'function'){
      value = new value
    }
    this.map.set(key, value)
    return this
  }
  get(key){
    return this.map.get(key)
  }
  static getDataBus(){
    if (!DataBus.instance) {
      DataBus.instance = new DataBus()
    }
    return DataBus.instance
  }
  destory(){
    this.map.forEach((value, key)=>{
      this.map.set(key, null)
    })
  }
}