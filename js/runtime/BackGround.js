import Sprite from '../base/Sprite.js'

/**
 * 游戏背景类
 */
export default class BackGround extends Sprite {
  constructor() {
    let img = Sprite.getImage('background')
    super(img, 0, 0, img.width, img.height)
  }
}
