// 主函数 小游戏入口
import DataBus from './DataBus.js'
import ResourcesLoader from './runtime/ResourcesLoader.js'
import BackGround from './runtime/BackGround.js'
import Restart from './runtime/Restart.js'
import Home from './runtime/Home.js'
import Director from './Director.js'
import Login from './Login.js'
import Music from './runtime/Music.js'
import Score from './runtime/Score.js'
import BreakHeart from './runtime/BreakHeart.js'
import GameDesc from './runtime/GameDesc.js'
import Desc from './runtime/Desc.js'
import RankList from './runtime/RankList.js'

export default class Main {
  constructor(){
    // 微信适配器已经创建了上屏canvas 之后创建的都是离屏画布
    canvas.width = window.innerWidth * wx.getSystemInfoSync().pixelRatio
    canvas.height = window.innerHeight * wx.getSystemInfoSync().pixelRatio
    this.ctx = canvas.getContext('2d')
    this.databus = DataBus.getDataBus()
    this.databus.ctx = this.ctx
    
    this.loader = ResourcesLoader.getLoader()
    this.music = Music.getMusic()
    // 开放数据
    this.databus.openDataContext = wx.getOpenDataContext()
    this.databus.sharedCanvas = this.databus.openDataContext.canvas
    this.director = Director.getDirector()
    this.loader.onLoaded(map => this.firstLoad(map))

    this.databus.login = new Login()
  }
  firstLoad(map){
    // 首次静态资源加载完成
    // 初始化页面
    this.databus.resources = map
    this.home()
    this.databus.login.getToken()
  }
  // 加载首页
  home(){
    this.databus.speed = 2
    this.databus.set('home', Home)
      .set('restart', Restart)
      .set('background', BackGround)
      .set('gamedesc', GameDesc)
      .set('desc', Desc)
      .set('ranklist', RankList)
      .set('score', Score)
      .set('breakheart', BreakHeart)
      .set('fruits', [])
      .set('pointfruit', {})
      .set('pointstatic', {})
      .set('countdown', {})
    this.databus.status = "home"
    // 添加页面监听事件
    this.director.listenClick()
    this.director.home()
  }
  group(info) {
    var that = this
    wx.getShareInfo({
      shareTicket: info.shareTicket,
      success(result) {
        if (result.errMsg == "getShareInfo:ok") {
          // 进行数据解密拿到groupid进行页面渲染 不渲染首页 渲染群排行页
          that.databus.ranklist = true
          that.databus.openDataContext.postMessage({
            command: 'defaultData',
            newdata: [['show', "ranklist"], ['shareTicket', info.shareTicket]]
          })
          that.databus.openDataContext.postMessage({
            command: 'getGCloudStorage'
          })
          that.databus.get("home").draw()
          that.director.bgmask()
          that.director.createShareCanvas()
        }
      }
    })
  }
}