import Utils from './Utils.js'

let sharedCanvas = wx.getSharedCanvas()
let context = sharedCanvas.getContext('2d')
let datalist = {}
let map = new Map()
let sharemap = new Map()
let utils = new Utils()
let background = {
  x: 30,
  y: 100,
  color: '#808080',
  lineheight: 40,
  height: 400
}
let my = {}
let myopenid = ""
let img = {
  'imgsrc': '',
  'x': 0,
  'y': 0,
  'width': 0,
  'height': 0,
  'sx': 0,
  'sy': 0,
  'screenWidth': 0,
  'screenHeight': 0,
}
// 排行榜标准绘制
function drawRankList(data) {
  // 图片加载
  data.forEach((item, index) => {
    let image = wx.createImage()
    image.src = item.avatarUrl
    item.faceimg = image
  })
  datalist = data
  onLoaded(data => drawList(0))
}

// 标准排行榜
function drawList(move){
  // 背景绘制
  // 画标题
  context.fillStyle = '#fff'
  context.font = 24 * map.get('ratio')+'px Arial'
  context.fillText('好友排行榜', (map.get('innerWidth') - 120) / 2 * map.get('ratio'), parseInt(map.get("innerHeight") * 0.17) * map.get('ratio'))
  context.save()
  utils.roundRect(context, map.get('innerWidth') * 0.1 * map.get('ratio'), map.get("innerHeight") * 0.2 * map.get('ratio'), parseInt(map.get('innerWidth') * 0.8) * map.get('ratio'), parseInt(map.get("innerHeight") * 0.429) * map.get('ratio'), 25 * map.get('ratio'), "fill", { fillstyle: "#fffbed", strokestyle: "#f1886d", linewidth: 10 })
  // 画标题
  if (move === 0) {
    context.fillStyle = '#000'
    context.font = 12 * map.get('ratio') + 'px Arial'
    context.fillText('每周一凌晨刷新', (map.get('innerWidth') * 0.1 + 20) * map.get('ratio'), (map.get("innerHeight") * 0.2 + 20) * map.get('ratio'))
  }
  datalist = datalist.filter(weeklist)
  // 排行榜排序
  datalist.sort(compare('KVDataList'))
  let fontsize = 14 * map.get('ratio')
  datalist.forEach((item, index) => {
    item.index = index
    if (item.openid === map.get("openid")) {
      my = item
    } else {
      if(index === 0) {
        my = item
      }
    }
    context.font = fontsize + "px Microsoft YaHei bold"
    //设置字体填充颜色
    context.fillStyle = "#000"
    context.fillText(item.index + 1, (map.get('innerWidth') * 0.1 + 20) * map.get('ratio'), (map.get("innerHeight") * 0.2 + 50 - move + index * background.lineheight) * map.get('ratio'), 15 * map.get('ratio'))
    context.drawImage(item.faceimg, 0, 0, item.faceimg.width, item.faceimg.height, (map.get('innerWidth') * 0.1 + 50) * map.get('ratio'), (map.get("innerHeight") * 0.2 + 30 - move + index * background.lineheight) * map.get('ratio'), 30 * map.get('ratio'), 30 * map.get('ratio'))
    context.fillText(item.nickname, (map.get('innerWidth') * 0.1 + 95) * map.get('ratio'), (map.get("innerHeight") * 0.2 + 50 - move + index * background.lineheight) * map.get('ratio'), 150 * map.get('ratio'))
    context.fillText(item.KVDataList[0].value, (map.get('innerWidth') * 0.9 - 24 - fontsize / 2/ map.get('ratio') * item.KVDataList[0].value.length) * map.get('ratio'), (map.get("innerHeight") * 0.2 + 50 - move + index * background.lineheight) * map.get('ratio'), 30 * map.get('ratio'))
  })
  context.restore()
  context.save()
  if (Object.getOwnPropertyNames(my).length !== 0) {
    utils.roundRect(context, map.get('innerWidth') * 0.1 * map.get('ratio'), (map.get('innerHeight') * 0.654) * map.get('ratio'), map.get('innerWidth') * 0.8 * map.get('ratio'), map.get('innerHeight') * 0.072 * map.get('ratio'), 20 * map.get('ratio'), "fill", { fillstyle: "#fffbed", strokestyle: "#f1886d", linewidth: 10 })
    context.fillStyle = "#000"
    let fontsize = 14 * map.get('ratio')
    context.font = fontsize + "px Microsoft YaHei bold"
    context.fillText(my.index + 1, (map.get('innerWidth') * 0.1 + 20) * map.get('ratio'), (map.get("innerHeight") * 0.654 + (map.get('innerHeight') * 0.072 + 10) / 2) * map.get('ratio'), 15 * map.get('ratio'))
    context.drawImage(my.faceimg, 0, 0, my.faceimg.width, my.faceimg.height, (map.get('innerWidth') * 0.1 + 50) * map.get('ratio'), (map.get("innerHeight") * 0.654 + (map.get('innerHeight') * 0.072 - 30) / 2) * map.get('ratio'), 30 * map.get('ratio'), 30 * map.get('ratio'))
    context.fillText(my.nickname, (map.get('innerWidth') * 0.1 + 95) * map.get('ratio'), (map.get("innerHeight") * 0.654 + (map.get('innerHeight') * 0.072 + 10) / 2) * map.get('ratio'), 150 * map.get('ratio'))
    context.fillText(my.KVDataList[0].value, (map.get('innerWidth') * 0.9 - 24 - fontsize / 2 / map.get('ratio') * my.KVDataList[0].value.length) * map.get('ratio'), (map.get("innerHeight") * 0.654 + (map.get('innerHeight') * 0.072 + 10) / 2) * map.get('ratio'), 30 * map.get('ratio'))
  }
  context.restore()
  let image = wx.createImage()
  image.src = "images/back.png"
  image.onload = () => {
    context.drawImage(image, 0, 0, image.width, image.height, (map.get('innerWidth') * 0.11) * map.get('ratio'), (map.get("innerHeight") * 0.76) * map.get('ratio'), image.width / 2 * map.get('ratio'), image.height / 2 * map.get('ratio'))
  }
  let image1 = wx.createImage()
  image1.src = "images/grouplist.png"
  image1.onload = () => {
    context.drawImage(image1, 0, 0, image1.width, image1.height, (map.get('innerWidth') * 0.9 - image1.width / 2) * map.get('ratio'), (map.get("innerHeight") * 0.76) * map.get('ratio'), image1.width/2 * map.get('ratio'), image1.height / 2 * map.get('ratio'))
  }
}

// miniList 迷你排行榜
function miniList(datalist){
  context.save()
  utils.roundRect(context, map.get('innerWidth') * 0.097 * map.get('ratio'), (map.get('innerHeight') * 0.416) * map.get('ratio'), map.get('innerWidth') * 0.805 * map.get('ratio'), map.get('innerHeight') * 0.268 * map.get('ratio'), 26 * map.get('ratio'), "fill", { fillstyle: "#fffbed", strokestyle: "#f1886d", linewidth: 10 })
  let fontsize = 14 * map.get('ratio')
  let iwidth = map.get('innerWidth') * 0.805 / 3
  let widthstart = map.get('innerWidth') * 0.097
  let datalen = datalist.length
  datalist.every((item, index) => {
    if (index < 3) {
      item.index = index
      context.font = fontsize + "px Microsoft YaHei bold"
      //设置字体填充颜色
      context.fillStyle = "#000"
      let indexwidth = context.measureText(item.index + 1).width / map.get('ratio')
      context.fillText(item.index + 1, (widthstart + (iwidth - indexwidth) / 2 + iwidth * index) * map.get('ratio'), (map.get("innerHeight") * 0.458) * map.get('ratio'))
      context.drawImage(item.faceimg, 0, 0, item.faceimg.width, item.faceimg.height, (widthstart + (iwidth - 30) / 2 + iwidth * index) * map.get('ratio'), (map.get("innerHeight") * 0.47 ) * map.get('ratio'), 30 * map.get('ratio'), 30 * map.get('ratio'))
      fontsize = 13 * map.get('ratio')
      context.font = fontsize + "px Microsoft YaHei bold"
      let textwidth = context.measureText(item.nickname).width / map.get('ratio')
      let base = iwidth - textwidth > 0 ? iwidth - textwidth : 10
      context.fillText(item.nickname, (widthstart + (base) / 2 + iwidth * index) * map.get('ratio'), (map.get("innerHeight") * 0.546) * map.get('ratio'), (iwidth - 10) * map.get('ratio'))
      fontsize = 14 * map.get('ratio')
      context.font = fontsize + "px Microsoft YaHei bold"
      let scorewidth = context.measureText(item.KVDataList[0].value).width / map.get('ratio')
      context.fillText(item.KVDataList[0].value, (widthstart + (iwidth - scorewidth) / 2 + iwidth * index) * map.get('ratio'), (map.get("innerHeight") * 0.586) * map.get('ratio'), 30 * map.get('ratio'))
      if (index < datalen - 1 && index < 2) {
        context.beginPath()
        context.strokeStyle = '#f1886d'
        context.lineWidth = 2
        context.moveTo((widthstart + iwidth * (index + 1)) * map.get('ratio'), (map.get("innerHeight") * 0.44) * map.get('ratio'))
        context.lineTo((widthstart + iwidth * (index + 1)) * map.get('ratio'), (map.get("innerHeight") * 0.59) * map.get('ratio'))
        context.stroke()
      }
      return true
    } else {
      // 终止循环
      return false
    }
  })
  context.beginPath()
  context.strokeStyle = '#f1886d'
  context.lineWidth = 2
  context.moveTo((widthstart) * map.get('ratio'), (map.get("innerHeight") * 0.621) * map.get('ratio'))
  context.lineTo((widthstart + map.get('innerWidth') * 0.805) * map.get('ratio'), (map.get("innerHeight") * 0.621) * map.get('ratio'))
  context.stroke()
  fontsize = 12 * map.get('ratio')
  context.font = fontsize + "px Courier New"
  let tipswidth = context.measureText("查看全部排行>").width / map.get('ratio')
  context.fillText("每周一凌晨刷新", (widthstart + 20) * map.get('ratio'), (map.get("innerHeight") * 0.66) * map.get('ratio'))
  context.fillText("查看全部排行>", (widthstart + map.get('innerWidth') * 0.805 - tipswidth -20) * map.get('ratio'), (map.get("innerHeight") * 0.66) * map.get('ratio'))
  context.restore()
}

// 分数排序
function compare(property) {
  return function (a, b) {
    var value1 = a[property][0].value
    var value2 = b[property][0].value
    return value2 - value1
  }
}

// 返回周数据
function weeklist(time) {
  let date = new Date()
  let day = date.getDay() || 7
  let firsrday = date.setHours(0, 0, 0, 0) + (1 - day) * 60 * 60 * 24 * 1000
  return time.KVDataList.length > 0 && parseInt(time.KVDataList[1].value) >= firsrday
}

// 加载图片
function onLoaded(callback) {
  let loadcount = 0
  datalist.forEach((item, index) => {
    item.faceimg.onload = () => {
      loadcount++
      if (loadcount >= datalist.length) {
        return callback(datalist)
      }
    }
  })
}

// 获取当前用户数据 绘制当前得分
function getMyCloudStorage(){
  context.clearRect(0, 0, map.get("innerWidth") * map.get("ratio"), map.get("innerHeight") * map.get("ratio"))
  wx.getUserCloudStorage({
    keyList: ['score', 'uptime'], // 你要获取的、托管在微信后台的key
    success: res => {
      // 更新云数据最新记录
      let date = new Date()
      let day = date.getDay() || 7
      let firsrday = date.setHours(0, 0, 0, 0) + (1 - day) * 60 * 60 * 24 * 1000
      if (res.KVDataList.length === 0 || parseFloat(res.KVDataList[0].value) < parseFloat(map.get('newscore')) || parseFloat(res.KVDataList[1].value) < firsrday) {
        setMyCloudStorage()
      }
      if (map.get('scorepage') === "newscore") {
        // 创造新纪录
        context.save()
        utils.roundRect(context, map.get('innerWidth') * 0.097 * map.get('ratio'), (map.get('innerHeight') * 0.179) * map.get('ratio'), map.get('innerWidth') * 0.805 * map.get('ratio'), map.get('innerHeight') * 0.377 * map.get('ratio'), 25 * map.get('ratio'), "fill", { fillstyle: "#fffbed", strokestyle: "#f1886d", linewidth: 10 })
        utils.fillText(context, "本周最高分", "black", 12, "Microsoft YaHei bold", "center", map.get('innerHeight') * 0.274, map)
        utils.fillText(context, map.get('newscore'), "#f1886d", 45, "Microsoft YaHei bold", "center", map.get('innerHeight') * 0.37, map)
        utils.fillText(context, "查看全部排行>", "black", 12, "Courier New", "center", map.get('innerHeight') * 0.528, map)
        // 分享按钮
        let shareimage = wx.createImage()
        shareimage.src = "images/share.png"
        shareimage.onload = () => {
          context.drawImage(shareimage, 0, 0, shareimage.width, shareimage.height, (map.get('innerWidth') - shareimage.width / 2) / 2 * map.get('ratio'), (map.get("innerHeight") * 0.422) * map.get('ratio'), shareimage.width / 2 * map.get('ratio'), shareimage.height / 2 * map.get('ratio'))
        }
        context.beginPath()
        context.strokeStyle = '#f1886d'
        context.lineWidth = 2
        context.moveTo(map.get('innerWidth') * 0.097 * map.get('ratio'), (map.get("innerHeight") * 0.49) * map.get('ratio'))
        context.lineTo((map.get('innerWidth') * 0.097 + map.get('innerWidth') * 0.805) * map.get('ratio'), (map.get("innerHeight") * 0.49) * map.get('ratio'))
        context.stroke()
        context.restore()
        context.save()
        utils.roundRect(context, map.get('innerWidth') * 0.317 * map.get('ratio'), (map.get('innerHeight') * 0.155) * map.get('ratio'), map.get('innerWidth') * 0.365 * map.get('ratio'), map.get('innerHeight') * 0.055 * map.get('ratio'), 6 * map.get('ratio'), "fill", { fillstyle: "red", strokestyle: "#fff", linewidth: 8 })
        utils.fillText(context, "新纪录", "white", 13, "Microsoft YaHei bold", "center", map.get('innerHeight') * 0.189, map)
        context.restore()
        // 返回首页按钮
        let image = wx.createImage()
        image.src = "images/homeicon.png"
        image.onload = () => {
          context.drawImage(image, 0, 0, image.width, image.height, (map.get('innerWidth') * 0.147) * map.get('ratio'), (map.get("innerHeight") * 0.616) * map.get('ratio'), image.width / 2 * map.get('ratio'), image.height / 2 * map.get('ratio'))
        }
        // 再玩一局按钮
        let image1 = wx.createImage()
        image1.src = "images/replay.png"
        image1.onload = () => {
          context.drawImage(image1, 0, 0, image1.width, image1.height, (map.get('innerWidth') * 0.853 - image1.width / 2) * map.get('ratio'), (map.get("innerHeight") * 0.616) * map.get('ratio'), image1.width / 2 * map.get('ratio'), image1.height / 2 * map.get('ratio'))
        }
        // 历史最高分
        console.log(map.get('scoreinfo'))
        utils.fillText(context, "历史最高分：" + (map.get('scoreinfo') ? map.get('scoreinfo').highscore : 0), "white", 12, "Microsoft YaHei bold", "center", map.get('innerHeight') * 0.86, map)
      } else {
        
        // 绘制本次得分
        utils.fillText(context, "本次得分", "white", 12, "Microsoft YaHei bold", "center", map.get('innerHeight') * 0.164, map)
        utils.fillText(context, map.get('newscore'), "white", 40, "Microsoft YaHei bold", "center", map.get('innerHeight') * 0.233, map)
        context.save()
        utils.roundRect(context, map.get('innerWidth') * 0.368 * map.get('ratio'), (map.get('innerHeight') * 0.295) * map.get('ratio'), map.get('innerWidth') * 0.264 * map.get('ratio'), map.get('innerHeight') * 0.051 * map.get('ratio'), 17 * map.get('ratio'), "stroke", { fillstyle: "", strokestyle: "#fff", linewidth: 4 })
        context.restore()
        utils.fillText(context, "发起挑战", "white", 13, "Microsoft YaHei bold", "center", map.get('innerHeight') * 0.328, map)
        
        // 获取迷你排行榜
        miniRanklist()
        // 返回首页按钮
        let image = wx.createImage()
        image.src = "images/homeicon.png"
        image.onload = () => {
          context.drawImage(image, 0, 0, image.width, image.height, (map.get('innerWidth') * 0.147) * map.get('ratio'), (map.get("innerHeight") * 0.748) * map.get('ratio'), image.width / 2 * map.get('ratio'), image.height/2 * map.get('ratio'))
        }
        // 再玩一局按钮
        let image1 = wx.createImage()
        image1.src = "images/replay.png"
        image1.onload = () => {
          context.drawImage(image1, 0, 0, image1.width, image1.height, (map.get('innerWidth') * 0.853 - image1.width / 2) * map.get('ratio'), (map.get("innerHeight") * 0.748) * map.get('ratio'), image1.width / 2 * map.get('ratio'), image1.height/2 * map.get('ratio'))
        }
        // 历史最高分
        utils.fillText(context, "历史最高分：" + (map.get('scoreinfo') ? map.get('scoreinfo').highscore : 0), "white", 12, "Microsoft YaHei bold", "center", map.get('innerHeight') * 0.9, map)
      }
    }
  })
}

// 更新当前用户数据
function setMyCloudStorage() {
  wx.setUserCloudStorage({
    KVDataList: [
      { key: 'score', value: map.get('newscore') }, { key: 'uptime', value: new Date().getTime().toString() }],
    success: res => {
      console.log(res)
    },
    fail: res => {
      console.log(res)
    }
  })
}

// 获取好友排行榜
function getFCloudStorage() {
  // 获取排行榜好友数据
  context.clearRect(0, 0, map.get("innerWidth") * map.get("ratio"), map.get("innerHeight") * map.get("ratio"))
  wx.getFriendCloudStorage({
    keyList: ['score', 'uptime'], // 你要获取的、托管在微信后台的key
    success: res => {
      let data = res.data
      if (data.length > 0) {
        drawRankList(data)
      }
    }
  })
}

// 获取群排行榜
function getGCloudStorage() {
  // 获取排行榜好友数据
  console.log(map.get("shareTicket"))
  context.clearRect(0, 0, map.get("innerWidth") * map.get("ratio"), map.get("innerHeight") * map.get("ratio"))
  wx.getGroupCloudStorage({
    shareTicket: map.get("shareTicket"),
    keyList: ['score', 'uptime'], // 你要获取的、托管在微信后台的key
    success: res => {
      var data = res.data
      if (data.length > 0) {
        drawRankList(data)
      }
    }
  })
}
function miniRanklist() {
  wx.getFriendCloudStorage({
    keyList: ['score', 'uptime'], // 你要获取的、托管在微信后台的key
    success: res => {
      let data = res.data
      // 图片加载
      data.forEach((item, index) => {
        let image = wx.createImage()
        image.src = item.avatarUrl
        item.faceimg = image
      })
      datalist = data.filter(weeklist)
      if (data.length > 0) {
        datalist.sort(compare('KVDataList'))
        onLoaded(data => miniList(datalist))
      } else {
        // 暂无排行榜数据
      }
    }
  })
}
let startY = undefined, moveY = 0
// 触摸移动事件
wx.onTouchMove(e => {
  if (Object.getOwnPropertyNames(datalist).length !== 0 && map.get("show") === "ranklist") {
    let touch = e.touches[0]
    // 触摸移动第一次触发的位置
    if (startY === undefined) {
      startY = parseInt(touch.clientY) + moveY
    }
    moveY = startY - parseInt(touch.clientY)
    drawList(moveY)
  }
})
wx.onTouchEnd(e => {
  startY = undefined
  if (Object.getOwnPropertyNames(datalist).length !== 0 && map.get("show") === "ranklist") {
    if (moveY < 0 || (datalist.length + 1) * background.lineheight < parseInt(map.get("innerHeight") * 0.429)) { // 到顶
      moveY = 0
    } else if (moveY > ((datalist.length + 1) * background.lineheight - parseInt(map.get("innerHeight") * 0.44))) { // 到底
      moveY = (datalist.length + 1) * background.lineheight - parseInt(map.get("innerHeight") * 0.44)
    }
    drawList(moveY)
  }
})
// 监听接收主域消息
wx.onMessage(data => {
  if (data.command === 'clear') {
    // ... 清空 sharedCanvas
    context.clearRect(0, 0, map.get("innerWidth") * map.get("ratio"), map.get("innerHeight") * map.get("ratio"))
  } else if (data.command === 'getFCloudStorage') { // 获取好友数据排行榜
    getFCloudStorage()
  } else if (data.command === 'getGCloudStorage') { // 获取我的游戏云数据
    getGCloudStorage()
  } else if (data.command === 'getMyCloudStorage') { // 获取我的游戏云数据
    getMyCloudStorage()
  } else if (data.command === 'defaultData') {       // 默认主域向开放域传递数据保存
    map = new Map([...map, ...new Map(data.newdata)])
  }
})
