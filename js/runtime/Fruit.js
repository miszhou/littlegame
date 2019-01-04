import Sprite from '../base/Sprite.js'
import DataBus from '../DataBus.js'
/**
 * 水果类 继承自精灵基类
 */
export default class Fruit extends Sprite {
  constructor(x, y, width, height, sx, sy, swidth, sheight) {
    let img = Sprite.getImage('fruit')
    super(img, x, y, width, height, sx, sy, swidth, swidth)
    
    this.databus = DataBus.getDataBus()
  }
  // fruittype: run正常下落水果 point提示水果 static静止水果
  draw(fruittype = "run") {
    if (fruittype === "run") {
      // 正常水果
      this.sy = this.sy + this.databus.speed
      super.draw(this.img, this.x, this.y, this.width, this.height, this.sx, this.sy)
    } else if (fruittype === "point"){
      // 目标提示水果 矩形背景 + 提示文字 + 静态水果
      this.textset.text = this.databus.pointfruits[this.databus.pointindex].text
      this.textset.fontsize = 24
      this.textset.fontcolor = "white"
      this.textset.alignx = "screencenter"
      this.textset.y = parseInt(this.innerHeight * 0.247)
      this.filltext(this.textset)
      this.databus.ctx.save()
      this.databus.utils.roundRect(this.databus.ctx, this.innerWidth * 0.22 * this.ratio, this.innerHeight * 0.277 * this.ratio, parseInt(this.innerWidth * 0.56) * this.ratio, parseInt(this.innerHeight * 0.274) * this.ratio, 25 * this.ratio, "fill", {fillstyle: "#fffbed", strokestyle: "#f1886d", linewidth: 10 })
      super.draw(this.img, this.x, this.y, this.width, this.height, this.sx, this.sy)
      this.databus.ctx.restore()
    } else if (fruittype === "pointstatic") {
      // 右上角静止水果
      // 背景
      this.pointbg = Sprite.getImage('pointbg')
      super.draw(this.pointbg, 0, 0, this.pointbg.width, this.pointbg.height, this.innerWidth - this.pointbg.width / 2 - 15, this.innerHeight* 0.065, this.pointbg.width / 2, this.pointbg.height / 2)
      super.draw(this.img, this.x, this.y, this.width, this.height, this.innerWidth - this.pointbg.width / 2 - 15 + this.pointbg.width / 6, this.sy)
    } else {
      // 静止水果
      super.draw(this.img, this.x, this.y, this.width, this.height, this.sx, this.sy)
    }
  }
}