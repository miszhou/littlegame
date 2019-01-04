
export default class Utils {
  /**
  * 绘制圆角按钮区域
  * @param {CanvasContext} ctx canvas上下文
  * @param {number} x 圆角矩形选区的左上角 x坐标
  * @param {number} y 圆角矩形选区的左上角 y坐标
  * @param {number} w 圆角矩形选区的宽度
  * @param {number} h 圆角矩形选区的高度
  * @param {number} r 圆角的半径
  * @param {var} drawtype 绘制方式 填充fill 还是描边绘制stroke 默认 fill
  * @param {json} style 填充样式及描边样式 linewidth 描边粗
  */
  roundRect(ctx, x, y, w, h, r, drawtype = 'fill', style = { fillstyle: "#fffbed", strokestyle: "#f1886d", linewidth: 10}) {

    // 开始绘制
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // 这里是使用 fill 还是 stroke都可以，二选一即可
    // ctx.setFillStyle('transparent')
    // ctx.setStrokeStyle('transparent')
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    // ctx.lineTo(x + w, y + r)
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // border-right
    ctx.lineTo(x + w, y + h - r)
    // ctx.lineTo(x + w - r, y + h)
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // border-bottom
    ctx.lineTo(x + r, y + h)
    // ctx.lineTo(x, y + h - r)
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // border-left
    ctx.lineTo(x, y + r)
    // ctx.lineTo(x + r, y)

    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    ctx.lineWidth = style.linewidth !== undefined ? style.linewidth : 10
    ctx.strokeStyle = style.strokestyle !== undefined ? style.strokestyle : "#fff"
    ctx.stroke()
    // if (drawtype === "fill"){
    //   ctx.fill()
    // }
    ctx.closePath()
    // 剪切
    ctx.clip()
    // 填充背景
    if (drawtype === "fill") {
      ctx.fillStyle = style.fillstyle !== undefined ? style.fillstyle : "#fff"
      ctx.fillRect(x, y, w, h)
    }
  }

  /**
  * 获取文字宽高
  * @param {CanvasContext} ctx canvas上下文
  * @param {number} text 待测量文本
  * @param {text} color 颜色
  * @param {number} fontsize 文本字体大小
  * @param {number} ratio 设备像素比
  * @param {number} x 
  * @param {number} y 
  */
  fillText(ctx, text, color = "white", fontsize = 20, fontstyle = "Courier New bold", x, y, map) {
    ctx.font = fontsize * map.get('ratio') + "px " + fontstyle
    //设置字体填充颜色
    ctx.fillStyle = color
    if (x==="center") {
      x = (map.get('innerWidth') - ctx.measureText(text).width / map.get('ratio')) / 2
    }
    ctx.fillText(text,  x * map.get('ratio'), y * map.get('ratio'))
  }
}