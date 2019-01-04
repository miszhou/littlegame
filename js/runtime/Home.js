import Sprite from '../base/Sprite.js'
import DataBus from '../DataBus.js'
/**
 * 首页类
 * 
 */
export default class Home extends Sprite {
  constructor() {
    let img = Sprite.getImage('home')
    super(img, 0, 0, img.width, img.height, 0, 0)
  }
  draw() {
    super.draw()
  }
}
