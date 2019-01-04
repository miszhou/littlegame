import Sprite from '../base/Sprite.js'
/**
 * 开始类 继承自精灵基类
 */
export default class Restart extends Sprite {
  constructor() {
    let img = Sprite.getImage('restart')
    super(img, 0, 0, img.width, img.height / 6, parseInt((window.innerWidth * 0.45) / 2), parseInt(window.innerHeight * 0.44), parseInt(window.innerWidth * 0.55), parseInt(window.innerWidth * 0.14))
    this.times = 0
  }
  draw() {
    this.times++
    this.y = parseInt(this.height * (parseInt(this.times / 9) % 6))
    super.draw(this.img, this.x, this.y, this.width, this.height, this.sx, this.sy)
  }
}