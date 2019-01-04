import Sprite from '../base/Sprite.js'

/**
 * 心碎类
 */
export default class BreakHeart extends Sprite {
  constructor() {
    let img = Sprite.getImage('break')
    super(img, 0, 0, img.width, img.height)
  }
  draw(value) {
    super.draw(this.img, 0, 0, this.img.width, this.img.height, value.sx + (value.screenWidth - this.img.width / 2) / 2, value.sy - this.img.height / 2 - 4, this.img.width / 2, this.img.height/2)
  }
}