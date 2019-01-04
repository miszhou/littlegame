// 精灵类 元素继承基类
import DataBus from '../DataBus.js'

export default class Sprite{

  constructor(img = null, x = 0, y = 0, width = 0, height = 0, sx = 0, sy = 0, screenWidth = window.innerWidth, screenHeight = window.innerHeight) {
    this.img = img
    this.width = width
    this.height = height
    this.x = x
    this.y = y
    this.sx = sx
    this.sy = sy
    this.screenWidth = screenWidth
    this.screenHeight = screenHeight
    this.databus = DataBus.getDataBus()
    this.innerWidth = window.innerWidth
    this.innerHeight = window.innerHeight
    this.ratio = wx.getSystemInfoSync().pixelRatio
    this.textset = {
      fontcolor: "black", 
      fontsize: 14, 
      fontstyle: "Microsoft YaHei", 
      text: "", 
      alignx: "", 
      aligny: "", 
      alignxbase: 0,
      alignybase: 0, 
      x: 0, 
      y: 0
    }
  }
  draw(img = this.img, x = this.x, y = this.y, width = this.width, height = this.height, screenx = this.sx, screeny = this.sy, screenWidth = this.screenWidth, screenHeight = this.screenHeight){
    this.databus.ctx.drawImage(
      img,
      x,
      y,
      width,
      height,
      screenx * this.ratio,
      screeny * this.ratio,
      screenWidth * this.ratio,
      screenHeight * this.ratio
    )
  }
  // 抽象绘制文字
  filltext(textset = this.textset){
    // 标题绘制
    this.databus.ctx.fillStyle = textset.fontcolor
    this.databus.ctx.font = textset.fontsize * this.ratio + 'px ' + textset.fontstyle
    const tips = this.databus.ctx.measureText(textset.text) 
    if (textset.alignx === "center") {
      textset.x = textset.alignxbase * this.ratio + parseInt((this.screenWidth * this.ratio - parseInt(tips.width)) / 2)
    } else if (textset.alignx === "screencenter") {
      textset.x = parseInt((this.innerWidth * this.ratio - parseInt(tips.width)) / 2)
    } else {
      textset.x = textset.x * this.ratio
    }
    if (textset.aligny === "center") {
      let textlength = textset.text.length ? textset.text.length : 1
      textset.y = textset.alignybase * this.ratio + parseInt((this.screenHeight * this.ratio - parseInt(tips.width)) / 2)
    } else {
      textset.y = textset.y * this.ratio
    }
    this.databus.ctx.fillText(textset.text, textset.x, textset.y)
  }
  /**
 * 简单的碰撞检测定义：
 * 点击点处于精灵所在的矩形内即可
 * @param{e} e: 触摸对象
 */
  isCollideWith(e,border = 0) {
    let spX = e.changedTouches[0].pageX
    let spY = e.changedTouches[0].pageY
    return !!(this.sx + border <= spX
      && spX <= this.sx + this.screenWidth - border
      && spY >= this.sy + border
      && spY <= this.sy + this.screenHeight - border)
  }
  // 返回image对象
  static getImage(key) {
    return DataBus.getDataBus().resources.get(key)
  }
}