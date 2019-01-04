// 全局逻辑控制器 单例模式
import DataBus from './DataBus.js'
import Music from './runtime/Music.js'
import Fruit from './runtime/Fruit.js'
import CountDown from './runtime/CountDown.js'
import ShareImg from './runtime/ShareImg.js'

export default class Director {
  constructor() {
    this.databus = DataBus.getDataBus()
    this.music = Music.getMusic()
    this.databus.sharedCanvas.width = window.innerWidth * this.databus.ratio
    this.databus.sharedCanvas.height = window.innerHeight * this.databus.ratio
    this.databus.openDataContext.postMessage({
      command: 'defaultData',
      newdata: [['innerWidth', window.innerWidth], ['innerHeight', window.innerHeight], ['ratio', this.databus.ratio]]
    })
    // 水果图片基本参数
    this.imgdata = {
      width: 120,    // 图片宽
      height: 120,   // 图片高
      xborder: 5,    // 左右边距
      yborder: 5,    // 上下边距
      scale: 2
    }
    // 礼物项
    this.gift = [
      {
        type: "double",
        desc: "当前分数加倍",
        img: "",
        value: 0
      },
      {
        type: "heart",
        desc: "生命值+1",
        img: "",
        value: 1
      },
      {
        type: "heart",
        desc: "生命值+2",
        img: "",
        value: 2
      }, 
      {
        type: "heart",
        desc: "生命值+3",
        img: "",
        value: 3
      }, 
      {
        type: "score",
        desc: "分数+10",
        img: "",
        value: 10
      },
      {
        type: "score",
        desc: "分数+15",
        img: "",
        value: 15
      },
      {
        type: "score",
        desc: "分数+30",
        img: "",
        value: 30
      }
    ]
  }
  // 初始化数据
  init() {
    wx.triggerGC()
    this.databus.heart = this.databus.defaultheart
    this.databus.status = "parse"
    this.databus.ranklist = false
    this.databus.score = 0
    this.databus.speed = 2
    this.databus.set('fruits', [])
    this.databus.set('pointfruit', {})
    // 暂停读秒的变量
    this.parsetimes = 0
    // 产生水果的控制变量
    this.lock = false
    // 加分特效数组
    this.addarr = []
    // 礼物锁
    this.giftlock = 1
    this.giftlimit = 50
    // 炸弹出现间隔
    this.initBoom()
    this.speedUp()
  }
  initBoom() {
    // 炸弹出现间隔
    this.boom = 20
  }
  // 页面操作监听
  listenClick() {
    // 监听点击屏幕事件
    wx.onTouchStart((e) => {
      if (this.databus.status === "running") {
        // 判断点击
        // 绘制水果
        this.databus.get('fruits').forEach((value,index,arr) => {
          if (value.isCollideWith(e, -10)) {
            // 点击的是礼物或者炸弹
            if (value.y > this.imgdata.height) {
              // 礼物
              if (value.x === this.imgdata.width) {
                this.music.playFly()
                this.giftshow()
                arr.splice(index, 1)
              } else {
                // 炸弹
                this.databus.status = "gameover"
              }
            } else {
              // 点击的是正确的水果 加分 水果消失
              if (value.x === this.databus.get("pointfruit").x && value.y === this.databus.get("pointfruit").y) {
                this.music.playFly()
                this.addarr["tips"] = this.addScore()
                this.addarr["tipstimes"] = 0
                arr.splice(index, 1)
              } else {
                if (value.y === 0) {
                  // 水果点击错误 切错误提示与表情 不加分 扣生命值
                  arr[index].y = 120
                  arr[index].tips = "break"
                  arr[index].tipstimes = 0
                  this.databus.heart--
                  this.databus.linkscore = 0
                  this.music.playExplosion()
                  if (this.databus.heart <= 0) {
                    this.databus.status = "gameover"
                  }
                }
              }
            }
          }
        })
        // 模拟结束游戏
        // if (this.databus.utils.isCollideWith({ x: 20, y: 60, width: 100, height: 30 }, e)) {
        //   this.databus.status = "gameover"
        // }
      } else {
        // 首页操作
        if (this.databus.status === "home") {
          // 首页开始按钮
          if (this.databus.get('restart').isCollideWith(e) && !this.databus.ranklist && !this.databus.desc) {
            if (this.databus.islogin) {
              this.init()
              this.run()
              this.music.playFly()
            }
          }
          // 首页排行榜
          if (!this.databus.ranklist && !this.databus.desc && this.databus.get("ranklist").isCollideWith(e)) {
            this.databus.openDataContext.postMessage({
              command: 'defaultData',
              newdata: [['show', "ranklist"],['openid', this.databus.openid]]
            })
            this.databus.openDataContext.postMessage({
              command: 'getFCloudStorage'
            })
            this.databus.ranklist = true
            this.music.playFly()
            if (this.databus.status === "home") {
              this.createShareCanvas()
            }
          }
          // 首页游戏说明
          if (!this.databus.ranklist && !this.databus.desc && this.databus.get("gamedesc").isCollideWith(e)) {
            var that = this
              that.music.playFly()
              that.databus.desc = true
              that.databus.get('home').draw()
              that.bgmask()
              that.databus.get('desc').draw()
          }
          // 首页游戏说明 点击确定
          if (this.databus.desc && this.databus.utils.isCollideWith({ x: (window.innerWidth - 223) / 2, y: (window.innerHeight * 0.636), width: 223, height: 45 }, e)) {
            this.databus.desc = false
            this.databus.status = "home"
            this.home()
          }
        } else if (this.databus.status === "gameover") {
          // 游戏结束页
          if (this.databus.scorepage === "newscore" && !this.databus.ranklist) {
            // 新记录页监听
            // 分享
            if (this.databus.utils.isCollideWith({ x: (window.innerWidth - 15) / 2, y: (window.innerHeight * 0.422), width: 15, height: 21 }, e)) {
              new ShareImg('newscoreshare', '新纪录，快来膜拜我！', 'page=home', 0.5).makeImg()
            }
            // 查看全部排行
            if (this.databus.utils.isCollideWith({ x: (window.innerWidth - 84) / 2, y: (window.innerHeight * 0.528 - 12), width: 84, height: 12 }, e)) {
              this.databus.ranklist = true
              this.databus.openDataContext.postMessage({
                command: 'defaultData',
                newdata: [['show', "ranklist"]]
              })
              this.databus.openDataContext.postMessage({
                command: 'getFCloudStorage'
              })
            }
            // 首页
            if (this.databus.utils.isCollideWith({ x: (window.innerWidth * 0.147), y: (window.innerHeight * 0.616), width: 42, height: 42 }, e)) {
              cancelAnimationFrame(this.shareanid)
              this.databus.status = "home"
              this.home()
            }
            // 再玩一局
            if (this.databus.utils.isCollideWith({ x: (window.innerWidth * 0.853 - 133), y: (window.innerHeight * 0.616), width: 133, height: 41 }, e)) {
              this.init()
              this.run()
              this.music.playFly()
            }
          } else if (this.databus.scorepage === "score" && !this.databus.ranklist) {
            // 得分监听
            // 分享 发起挑战
            if (this.databus.utils.isCollideWith({ x: (window.innerWidth * 0.368), y: (window.innerHeight * 0.295), width: window.innerWidth * 0.264, height: window.innerHeight * 0.051 }, e)) {
              new ShareImg('scoreshare', '发起挑战', 'page=home', 0.5).makeImg()
            }
            // 查看全部排行
            if (this.databus.utils.isCollideWith({ x: (window.innerWidth * 0.912 - 104), y: (window.innerHeight * 0.66 - 12), width: 84, height: 12 }, e)) {
              this.databus.ranklist = true
              this.databus.openDataContext.postMessage({
                command: 'defaultData',
                newdata: [['show', "ranklist"]]
              })
              this.databus.openDataContext.postMessage({
                command: 'getFCloudStorage'
              })
            }
            // 首页
            if (this.databus.utils.isCollideWith({ x: (window.innerWidth * 0.147), y: (window.innerHeight * 0.748), width: 42, height: 42 }, e)) {
              cancelAnimationFrame(this.shareanid)
              this.databus.status = "home"
              this.home()
            }
            // 再玩一局
            if (this.databus.utils.isCollideWith({ x: (window.innerWidth * 0.853 - 133), y: (window.innerHeight * 0.748), width: 133, height: 41 }, e)) {
              this.init()
              this.run()
              this.music.playFly()
            }
          }
        }
        // 排行榜页
        if (this.databus.ranklist) {
          // 排行榜页 点击返回
          if (this.databus.utils.isCollideWith({x: window.innerWidth*0.1, y: window.innerHeight * 0.76, width: 40, height: 40}, e)) {
            // TODO:判断当前排行榜处于的页面 点击返回展示对应页面内容
            this.databus.ranklist = false
            this.databus.openDataContext.postMessage({
              command: 'defaultData',
              newdata: [['show', ""]]
            })
            if (this.databus.status === "home") {
              cancelAnimationFrame(this.shareanid)
              this.home()
            } else {
              // 游戏中返回
              this.databus.openDataContext.postMessage({
                command: 'defaultData',
                newdata: [['newscore', this.databus.score.toString()]]
              })
              this.databus.openDataContext.postMessage({
                command: 'getMyCloudStorage'
              })
              this.databus.ranklist = false
            }
          }
          // 排行榜页 点击查看群排行榜
          if (this.databus.utils.isCollideWith({x: (window.innerWidth * 0.9 - 140), y: window.innerHeight * 0.76, width: 140, height: 40}, e)) {
            wx.updateShareMenu({
              withShareTicket: true,
              success(res) {
                wx.shareAppMessage({
                  title: '群雄逐鹿，看看你第几',
                  imageUrl: 'images/groupshare.jpg',
                  query: 'page=group'
                })
                wx.updateShareMenu({
                  withShareTicket: false
                })
              }
            })
          }
        }
      }
    })
    // 监听音乐被暂停事件
    wx.onAudioInterruptionEnd(function () {
      this.music.playBgm()
    })
  }
  // 首页
  home() {
    // 开始按钮动态展示
    if (this.databus.status === "home" && !this.databus.ranklist && !this.databus.desc) {
      this.databus.get('home').draw()
      this.databus.get('restart').draw()
      this.databus.get('ranklist').draw()
      this.databus.get('gamedesc').draw()
      // 刷帧
      this.aniId = requestAnimationFrame(() => {
        this.databus.aniId = this.aniId
        this.home()
      })
    }
  }
  // 开始游戏
  run(){
    // 绘制水果
    if ((this.parsetimes === this.databus.pointfruits[this.databus.pointindex].time || this.parsetimes === 0) && this.databus.pointindex < this.databus.pointfruits.length - 1) {
      if (this.parsetimes !== 0) {
        this.databus.pointindex++
        this.parsetimes = 0
      }
      this.createPoint()
      this.databus.set('fruits', [])
      this.numindex = 3
      this.databus.status = "parse"
    }
    if (this.databus.status === "parse"){
      // 目标水果及倒计时展示 背景暂停+蒙版
      this.databus.get('background').draw()
      this.databus.get('fruits').forEach((value, index, arr) => {
        value.draw("static")
      })
      this.databus.get('pointstatic').draw("pointstatic")
      this.databus.get('score').draw()
      this.bgmask()
      
      this.parsetimes++
      if (this.parsetimes <= this.databus.pointshowtime) {
        this.databus.get('pointfruit').draw("point")
      }
      // 目标水果展示时间this.databus.pointshowtime
      // 数字展示时间this.databus.numshowtime
      // 切换间隔 数字之间以及目标水果与第一个数字之间 this.databus.changetime
      if (this.parsetimes > this.databus.changetime + this.databus.pointshowtime + (this.databus.changetime + this.databus.numshowtime) * (3 - this.numindex) && this.parsetimes < this.databus.changetime + this.databus.pointshowtime + (this.databus.changetime + this.databus.numshowtime) * (4 - this.numindex) && this.numindex > 0) {
        // 第一帧创建新倒计时对象
        if (this.parsetimes === this.databus.changetime + this.databus.pointshowtime + (this.databus.changetime + this.databus.numshowtime) * (3 - this.numindex) + 1) {
          this.databus.set('countdown', new CountDown(this.numindex))
        }
        this.databus.get('countdown').draw()
        // 数字显示区域内最后一帧进行index--
        if (this.parsetimes + 1 === this.databus.changetime + this.databus.pointshowtime + (this.databus.changetime + this.databus.numshowtime) * (4 - this.numindex)) {
          this.numindex--
          if (this.numindex === 0) {
            // 最后倒计时走完 暂停结束
            this.databus.status = "running"
          }
        }
      }
      // 刷帧
      this.aniId = requestAnimationFrame(() => {
        this.databus.aniId = this.aniId
        this.run()
      })
    } else if (this.databus.status === "running") {
      if (!this.lock) {
        this.lock = true
        this.createFruits(4)
      }
      // 当水果淡出屏幕左侧则从全局水果数组中删除
      if (this.databus.get('fruits').length > 0 && this.databus.get('fruits')[0].sy >= this.databus.get('fruits')[0].innerHeight - this.databus.get('fruits')[0].screenHeight) {
        // 漏点 减生命值
        if (this.databus.get('fruits')[0].x === this.databus.get('pointfruit').x && this.databus.get('fruits')[0].y === 0) {
          this.databus.heart--
          this.databus.linkscore = 0
          this.music.playExplosion()
          if (this.databus.heart <= 0) {
            this.databus.status = "gameover"
          }
        }
        this.databus.get('fruits').shift()
      }
      this.databus.get('background').draw()
      this.databus.get('fruits').forEach((value, index, arr) => {
        value.draw()
        if (value.tips !== undefined && value.tipstimes < 100) {
          arr[index].tipstimes++
          // 绘制心碎
          this.databus.get("breakheart").draw(value)
        }
      })
      if (this.addarr["tips"] !== undefined && this.addarr["tipstimes"] < 100 && this.databus.linkscore !== 0) {
        this.addarr["tipstimes"] = this.addarr["tipstimes"] + 1
        // 加分特效
        this.databus.ctx.fillStyle = "white"
        this.databus.ctx.font = 18 * this.databus.ratio + "px Courier New bold"
        this.databus.ctx.fillText("+" + this.databus.linkscore, parseInt(this.databus.get('score').screenWidth + 15) * this.databus.ratio, parseInt(window.innerHeight * 0.11) * this.databus.ratio)
      }
      this.databus.get('pointstatic').draw("pointstatic")
      this.parsetimes++
      // 绘制分数
      this.databus.get('score').draw()
      // 刷帧
      this.aniId = requestAnimationFrame(() => {
        this.databus.aniId = this.aniId
        this.run()
      })
    } else {
      this.music.playExplosion()
      this.databus.status = "gameover"
      this.databus.heart = 0
      this.databus.pointindex = 0
      this.parsetimes = 0
      this.databus.login.getScore(this.saveScoreToWx, this)
      cancelAnimationFrame(this.aniId)
    }
  }
  // 随机创建水果
  createFruits(part) {
    let index = 0
    let lastindex = 0
    let thisindex = 0
    let createfruit = setInterval(()=>{
      if (index >= part || this.databus.status === "gameover") {
        this.lock = false
        clearInterval(createfruit)
      } else {
        if (this.databus.status === "running") {
          if (lastindex < 2) {
            thisindex = 2 + Math.round(Math.random())
          } else {
            thisindex = Math.round(Math.random())
          }
          let sx = window.innerWidth / part * thisindex + Math.round((window.innerWidth / 4 - this.imgdata.width / this.imgdata.scale) / 2)
          let sy = window.innerHeight * 0.3 / this.imgdata.scale
          if (this.giftBox(sx, sy) || this.giftBoom(sx, sy)) {
            // 绘制礼物或者炸弹 
          } else {
            let x = 0, y = 0
            if (Math.round(Math.random() * 0.9) && this.databus.get('fruits').length > 0 && this.databus.get('fruits')[this.databus.get('fruits').length - 1].x !== this.databus.get("pointfruit").x) {
              x = this.databus.get("pointfruit").x
            } else {
              x = this.randomX()
            }
            lastindex = thisindex
            this.databus.get('fruits').push(new Fruit(x, y, this.imgdata.width, this.imgdata.height, sx, sy, Math.round(this.imgdata.width / this.imgdata.scale), Math.round(this.imgdata.height / this.imgdata.scale)))
          }
          index++
        }
      }
    }, 900 * 2 / this.databus.speed)
  }
  // 创建目标水果
  createPoint () {
    let y = 0
    let x = this.randomX(true)
    this.databus.set('pointfruit', new Fruit(x, y, this.imgdata.width, this.imgdata.height, parseInt(window.innerWidth - this.imgdata.width / this.imgdata.scale) / 2, window.innerHeight * 0.277 + (parseInt(window.innerHeight * 0.274) - this.imgdata.height / this.imgdata.scale) / 2, Math.round(this.imgdata.width / this.imgdata.scale), Math.round(this.imgdata.height / this.imgdata.scale)))
    // 创建右上角静止目标水果
    this.databus.set('pointstatic', new Fruit(x, y, this.imgdata.width, this.imgdata.height, parseInt(window.innerWidth - this.imgdata.width / this.imgdata.scale), window.innerHeight * 0.075, Math.round(this.imgdata.width / this.imgdata.scale), Math.round(this.imgdata.height / this.imgdata.scale)))
  }
  // 随机水果x值
  randomX (ispoint = false) {
    let maxX = this.databus.resources.get('fruit').width / this.imgdata.width - 1
    let x = this.imgdata.width * Math.round(maxX * Math.random())
    // let maxY = this.databus.resources.get('fruit').height / this.imgdata.height - 1
    if (!ispoint || Object.getOwnPropertyNames(this.databus.get("pointfruit")).length === 0) {
      // let y = this.imgdata.height * Math.round(maxY * Math.random())
      return x
    } else {
      if (Object.getOwnPropertyNames(this.databus.get("pointfruit")).length !== 0 && this.databus.get("pointfruit").x !== x) {
        return x
      } else {
        this.randomX(true)
      }
    }
  }
  // 每到达50分 创建礼物箱  giftlock 礼物锁变量 默认1
  giftBox (sx, sy) {
    if (this.databus.score > this.giftlimit * this.giftlock) {
      this.giftlock = this.databus.score / this.giftlimit
      this.giftlock++
      this.boom--
      // 创建礼物箱
      this.databus.get('fruits').push(new Fruit(this.imgdata.width, this.imgdata.height * 2, this.imgdata.width, this.imgdata.height, sx, sy, Math.round(this.imgdata.width / this.imgdata.scale), Math.round(this.imgdata.height / this.imgdata.scale)))
      return true
    }
    return false
  }
  // 礼物箱特效 礼物项随机 分数翻倍 加心+1 +2 +3 分数+10 +15 +30
  giftshow () {
    let index = parseInt(Math.random() * (this.gift.length - 1))
    switch (this.gift[index].type) {
      case "double":
        this.databus.score = this.databus.score * 2
        break
      case "score":
        this.databus.score = this.databus.score + this.gift[index].value
        break
      case "heart":
        this.databus.heart = this.databus.heart + this.gift[index].value
        break
      default:
        break
    }
  }
  // 创建炸弹 
  giftBoom (sx, sy) {
    if (this.boom <= 0) {
      this.initBoom()
      this.databus.get('fruits').push(new Fruit(0, this.imgdata.height * 2, this.imgdata.width, this.imgdata.height, sx, sy, Math.round(this.imgdata.width / this.imgdata.scale), Math.round(this.imgdata.height / this.imgdata.scale)))
      return true
    } else {
      this.boom--
      return false
    }
  }
  // 加分
  addScore () {
    if (this.databus.linkscore > 0 && this.databus.linkscore < 16){
      this.databus.score += this.databus.linkscore * 2
      this.databus.linkscore = this.databus.linkscore * 2
    } else {
      this.databus.score++
      this.databus.linkscore = 1
    }
    return "+"+this.databus.linkscore    
  }
  // 保存用户游戏数据到微信公享数据
  saveScoreToWx () {
    // 获取当前用户最高分
    this.databus.openDataContext.postMessage({
      command: 'getMyCloudStorage'
    })
    this.createShareCanvas()
  }
  // 游戏结束状态绘制 点击排行榜时进行 开放域canvas绘制 排行榜显示 
  createShareCanvas () {
    if (this.databus.status === "gameover" || this.databus.status === "home") {
      if (this.databus.status === "gameover") {
        this.databus.get('background').draw()
        this.databus.get('fruits').forEach((value, index, arr) => {
          value.draw("static")
        })
        this.databus.get('pointstatic').draw("pointstatic")
        this.databus.get('score').draw()
      } else if (this.databus.status === "home") {
        this.databus.get('home').draw()
      }
      this.bgmask()
      this.databus.ctx.drawImage(this.databus.sharedCanvas, 0, 0, window.innerWidth * this.databus.ratio, window.innerHeight * this.databus.ratio, 0, 0, window.innerWidth * this.databus.ratio, window.innerHeight * this.databus.ratio)
      this.shareanid = requestAnimationFrame(this.createShareCanvas.bind(this))
    } else {
      cancelAnimationFrame(this.shareanid)
    }
  }
  // 添加速度变更定时器
  speedUp () {
    clearInterval(this.databus.speedup)
    this.databus.speedup = setInterval(() => {
      this.databus.speed++
      if (this.databus.heart === 0) {
        // 游戏结束 显示分数以及清除定时器
        this.databus.status = "gameover"
        clearInterval(this.databus.speedup)
      }
    }, 5000)
  }
  // 背景蒙版
  bgmask () {
    this.databus.ctx.globalAlpha = 0.8
    this.databus.ctx.fillStyle = '#000'
    this.databus.ctx.fillRect(0, 0, window.innerWidth * this.databus.ratio, window.innerHeight * this.databus.ratio)
    this.databus.ctx.globalAlpha = 1
  }
  static getDirector () {
    if (!Director.instance) {
      Director.instance = new Director()
    }
    return Director.instance
  }
}