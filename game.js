import './js/libs/weapp-adapter'
import './js/libs/symbol'

import Main from './js/Main.js'
wx.onError(res => {
  console.log('wx.onError:')
  console.log(res)
})

let main = new Main()
// main.music.playBgm()
wx.onShow(res => {
  if (res.scene === 1044) {
    main.group(res)
  }
})
wx.showShareMenu({
  success() {
    wx.updateShareMenu({
      withShareTicket: false,
      success() {
        // 设置右上角分享图
        wx.onShareAppMessage({
          title: '一起来玩水果大战',
          imageUrl: 'images/pointbg.png',
          query: 'page=home'
        })
      }
    })
  }
})
// 设置右上角分享图
wx.onShareAppMessage({
  title: '一起来玩水果大战',
  imageUrl: 'images/pointbg.png',
  query: 'page=home'
})


