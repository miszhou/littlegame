import Sprite from '../base/Sprite.js'

/**
 * 倒计时类
 */
export default class CountDown extends Sprite {
  constructor(index = 1) {
    let imgtitle = "countdown" + index
    let img = Sprite.getImage(imgtitle)
    super(img, 0, 0, img.width, img.height, (window.innerWidth - img.width / 2) / 2, window.innerHeight * 0.346, img.width / 2, img.height / 2)
  }
}