/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src  = 'audio/background.mp3'

    this.flyAudio     = new Audio()
    this.flyAudio.src = 'audio/fly.mp3'

    this.boomAudio     = new Audio()
    this.boomAudio.src = 'audio/boom.mp3'
  }

  playBgm() {
    this.bgmAudio.play()
  }
  // 点击屏幕飞动
  playFly() {
    this.flyAudio.currentTime = 0
    this.flyAudio.play()
  }
  // 撞击
  playExplosion() {
    this.boomAudio.currentTime = 0
    this.boomAudio.play()
  }
  
  static getMusic() {
    if (!Music.instance) {
      Music.instance = new Music()
    }
    return Music.instance
  }
}
