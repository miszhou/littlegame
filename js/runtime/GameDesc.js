import Sprite from '../base/Sprite.js'

/**
 * 
 */
export default class GameDesc extends Sprite {
  constructor() {
    let img = Sprite.getImage('gamedesc')
    super(img, 0, 0, img.width, img.height, parseInt(window.innerWidth * 0.55), parseInt(window.innerHeight * 0.56), 45, 45)
  }
  draw() {
    super.draw()
    this.textset.text = "游戏说明"
    this.textset.alignx = "center"
    this.textset.alignxbase = this.sx
    this.textset.y = this.sy + this.screenHeight + 14
    this.filltext(this.textset)
  }
}
