import Sprite from '../base/Sprite.js'
import DataBus from '../DataBus.js'
/**
 * 
 */
export default class Desc extends Sprite {
  constructor() {
    let img = Sprite.getImage('desc')
    super(img, 0, 0, img.width, img.height, parseInt(window.innerWidth - img.width / 2) / 2, parseInt(window.innerHeight * 0.206), img.width / 2, img.height / 2)
    this.databus = DataBus.getDataBus()
  }
  draw() {
    let image = wx.createImage()
    image.src = "images/sure.png"
    image.onload = () => {
      super.draw()
      this.textset.text = "游戏说明"
      this.textset.fontsize = 24
      this.textset.fontcolor = "white"
      this.textset.alignx = "screencenter"
      this.textset.y = window.innerHeight * 0.182
      this.filltext(this.textset)
      super.draw(image, 0, 0, image.width, image.height, (window.innerWidth - image.width / 2) / 2, (window.innerHeight * 0.636), image.width / 2, image.height / 2)
    }
  }
}