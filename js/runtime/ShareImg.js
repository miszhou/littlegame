import Sprite from '../base/Sprite.js'

/**
 * 分享截图类
 */
export default class ShareImg extends Sprite {
  constructor(imgtitle, title = '', query = '', texty = 0) {
    let img = Sprite.getImage(imgtitle)
    super(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height)
    this.canvas = wx.createCanvas()
    this.canvas.width = this.img.width
    this.canvas.height = this.img.height
    this.ctx = this.canvas.getContext('2d')
    this.title = title
    this.query = query
    this.texty = this.img.height * texty
  }
  // 合成图片
  makeImg(img = this.img, x = this.x, y = this.y, width = this.width, height = this.height, screenx = this.sx, screeny = this.sy, screenWidth = this.screenWidth, screenHeight = this.screenHeight) {
    this.ctx.drawImage(
      img,
      x,
      y,
      width,
      height,
      screenx,
      screeny,
      screenWidth,
      screenHeight
    )
    this.ctx.font = 100 + 'px Microsoft YaHei bold'
    this.ctx.fillStyle = "blank"
    this.ctx.fillText(this.databus.score, parseInt((this.screenWidth - parseInt(this.ctx.measureText(this.databus.score).width)) / 2), this.texty)
    this.canvas.toTempFilePath({
      x: 0,
      y: 0,
      width: this.img.width,
      height: this.img.height,
      destWidth: this.img.width,
      destHeight: this.img.height,
      success: (res) => {
        console.log(res)
        wx.shareAppMessage({
          title: this.title,
          imageUrl: res.tempFilePath,
          query: this.query
        })
      }
    })
  }
  // // 返回image对象
  // static getShareImg(imgtitle, title = '', query = '', testy = 0) {
  //   if (!ShareImg.instance) {
  //     ShareImg.instance = new ShareImg(imgtitle, title, query, testy)
  //   }
  //   return ShareImg.instance
  // }
}