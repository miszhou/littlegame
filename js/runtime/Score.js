import Sprite from '../base/Sprite.js'
import DataBus from '../DataBus.js'
/**
 * 得分类 带背景面板以及桃心处理 继承自精灵基类
 */
export default class Score extends Sprite {
  constructor() {
    let img = Sprite.getImage('scorebg')
    super(img, 0, 0, img.width, img.height, 15, parseInt(window.innerHeight * 0.065), img.width / 2, img.height/2)
    this.databus = DataBus.getDataBus()
    this.textwidth = 0
    this.maxheart = 5
  }
  draw() {
    // 背景
    super.draw(this.img, this.x, this.y, this.width, this.height, this.sx, this.sy)
    //设置字体样式
    this.databus.ctx.font = 27 * this.databus.ratio + "px Courier New blod"
    // 创建渐变 TODO:!!!!!!!!!!!!!!!!!
    this.scorelength = this.databus.ctx.measureText(this.databus.score)
    this.textx = (this.sx + this.screenWidth - 15) * this.ratio - this.scorelength.width
    this.gradient = this.databus.ctx.createLinearGradient(this.textx + this.scorelength.width / 2, (this.sy + this.screenHeight / 2 - 14) * this.ratio, this.textx + this.scorelength.width / 2, (this.sy + this.screenHeight / 2) * this.ratio)
    this.gradient.addColorStop(0, "#fffea7")
    this.gradient.addColorStop(1, "#f8cb49")
    // 用渐变填色
    this.databus.ctx.fillStyle = this.gradient
    //从坐标点(50,50)开始绘制文字
    this.databus.ctx.fillText(this.databus.score, this.textx, (this.sy + this.screenHeight/2) * this.ratio)
    // 桃心 最多5颗 超过 显示+1
    if (this.databus.heart > 0) {
      this.heart = Sprite.getImage('heart')
      this.heartnum = this.databus.heart > this.maxheart ? this.maxheart : this.databus.heart
      if (this.databus.heart > this.heartnum) {
        // 文字+2
        this.databus.ctx.fillStyle = "black"
        this.databus.ctx.font = 16 * this.ratio + 'px ' + "Courier New blod"
        this.textwidth = this.databus.ctx.measureText("+"+(this.databus.heart - this.heartnum)).width / this.ratio
        this.databus.ctx.fillText('+' + (this.databus.heart - this.heartnum), (this.sx + this.screenWidth / 2 + (this.heart.width / 2 + 4) * this.heartnum / 2 - this.textwidth / 2) * this.ratio, (this.sy + this.screenHeight * 2 / 3 + 16) * this.ratio)
      } else {
        this.textwidth = 0
      }
      for (var i = 0; i < this.heartnum; i++) {
        super.draw(this.heart, 0, 0, this.heart.width, this.heart.height, this.sx + this.screenWidth / 2 - (this.heart.width / 2 + 4) * this.heartnum / 2 - this.textwidth/2 + i * (this.heart.width / 2 + 4), this.sy + this.screenHeight * 2 / 3, this.heart.width / 2, this.heart.height / 2)
      }
    }
    
  }
}