import DataBus from './DataBus.js'
import Director from './Director.js'
/**
 * 登录类
 */
export default class Login {
  constructor() {
    this.databus = DataBus.getDataBus()
    this.fromObj = ''
  }
  // 将token从缓存中 赋值到全局变量
  getToken(cb, cb1) {
    var that = this
    try {
      var token = wx.getStorageSync('token')
      if (token) {
        that.databus.token = token
        that.getInfo()
      } else {
        wx.getUserInfo({
          withCredentials: true,
          lang: '',
          success: function (info) {
            that.databus.userInfo = info.userInfo
            try {
              wx.setStorageSync('userInfo', info.userInfo)
            } catch (e) {
            }
          },
          fail: function (res) {
            // 调用登录接口
            wx.login({
              success: function (res) {
                that.codeChangeToken(res.code, cb, cb1)
              }
            })
          }
        })
      }
    } catch (e) {
    }
  }
  // 登录获取sessionkey 提交后台换取基本openid unionid
  getSessionKey(cb, cb1) {
    var that = this
    // wx.checkSession({
    //   success() {
    //     //session_key 未过期，并且在本生命周期一直有效
    //     console.log("session_key 未过期")
    //     that.getToken(cb, cb1)
    //   },
    //   fail() {
        // session_key 已经失效，需要重新执行登录流程
        // 调用登录接口
        wx.login({
          success: function (res) {
            // console.log(res)
            that.codeChangeToken(res.code, cb, cb1)
          }
        })
    //   }
    // })
    
  }
  // 调取获取用户信息弹框 并将详细信息保存到数据库
  saveUserInfo(info, cb) {
    var that = this
    if (info) {
      this.databus.info = info
    }
    if (that.databus.token !== '') {
      that.databus.userInfo = JSON.parse(this.databus.info.rawData)
      wx.request({
        url: 'https://apis.bamasoso.com/xcx/saveinfo',
        data: {
          encryptedData: encodeURIComponent(that.databus.info.encryptedData),
          iv: encodeURIComponent(that.databus.info.iv),
          token: that.databus.token,
          vision: 1,
          app_type: "fruit"
        },
        method: 'GET',
        success: function (res) {
          if (res.data.meta.code == 200) {
            that.databus.islogin = true
            that.databus.getinfotimes = 0
            try {
              wx.setStorageSync('userInfo', JSON.parse(that.databus.info.rawData))
            } catch (e) {
            }
            that.databus.loginbutton.destroy()
            typeof cb == "function" && cb.apply(that)
          } else {
            if (that.databus.getinfotimes < 1) {
              that.databus.getinfotimes += 1;
              that.getSessionKey(that.saveUserInfo, cb)
            }
          }
        },
        fail: function () {
        }
      })
    } else {
      if (!this.databus.retry) {
        this.databus.retry = true
        this.getSessionKey(that.saveUserInfo, cb)
      } else {
        this.getSessionKey()
        wx.showModal({
          title: '提示',
          content: '登录验证失败，请稍后重试',
          showCancel: true,
          success: function (res) {
          }
        })
      }
    }
  }
  // sessionkey 换取token
  codeChangeToken(code, cb, cb1) {
    // 发起网络请求
    var that = this
    wx.request({
      url: 'https://apis.bamasoso.com/xcx/sessionkeynoinfo',
      data: {
        code: code,
        app_type: "fruit"
      },
      success: function (res) {
        if (res.data.meta.code === 200) {
          that.databus.token = res.data.data
          try {
            wx.setStorageSync('token', res.data.data)
          } catch (e) {
          }
          // that.getInfo()
          that.getInfo.apply(that)
          console.log('codeChangeToken:token=' + res.data.data)
          if (typeof cb1 == "function") {
            typeof cb == "function" && cb.apply(that, [cb1])
          } else {
            typeof cb == "function" && cb.apply(that)
          }
        } else {
          console.log(res)
        }
      },
      fail: function () {
      }
    })
  }
  loginbtn() {
    if (this.databus.loginbutton === undefined) {
      this.databus.loginbutton = wx.createUserInfoButton({
        type: 'text',
        text: '',
        style: {
          left: parseInt((window.innerWidth * 0.45) / 2),
          top: parseInt(window.innerHeight * 0.44),
          width: parseInt(window.innerWidth * 0.55),
          height: window.innerWidth * 0.14,
          lineHeight: 40,
          backgroundColor: '#00000000',
          color: '#ffffff',
          textAlign: 'center',
          fontSize: 16,
          borderRadius: 4
        }
      })
      var that = this
      this.databus.loginbutton.onTap((res) => {
        if (res.errMsg === "getUserInfo:ok") {
          this.saveUserInfo(res)
          // this.saveUserInfo.apply(this, [res])
        }
      })
    }
  }
  // 获取用户基本信息 取到openid
  getInfo() {
    var that = this
    if (!this.databus.islogin) {
      wx.request({
        url: 'https://apis.bamasoso.com/game/fruit/info',
        data: {
          token: that.databus.token
        },
        method: 'GET',
        success: function (res) {
          if (res.data.meta.code == 200) {
            if (res.data.data.userinfo) {
              that.databus.getinfotimes = 0
              that.databus.openid = res.data.data.userinfo.openid
              that.databus.openDataContext.postMessage({
                command: 'defaultData',
                newdata: [['openid', that.databus.openid]]
              })
              if (res.data.data.userinfo.bamaso_id) {
                that.databus.islogin = true
              } else {
                that.loginbtn()
              }
              try {
                wx.setStorageSync('openid', res.data.data.userinfo.openid)
              } catch (e) {
              }
            }
          } else {
            if (that.databus.getinfotimes < 1) {
              that.databus.getinfotimes += 1
              that.getSessionKey(that.getInfo)
            }
          }
        }
      })
    } else {
      wx.getStorage({
        key: 'openid',
        success(openidres) {
          that.databus.openid = openidres.data
        },
        fail(res) {
          wx.request({
            url: 'https://apis.bamasoso.com/game/fruit/info',
            data: {
              token: that.databus.token
            },
            method: 'GET',
            success: function (res) {
              if (res.data.meta.code == 200) {
                if (res.data.data.userinfo) {
                  that.databus.getinfotimes = 0
                  that.databus.openid = res.data.data.userinfo.openid
                  that.databus.openDataContext.postMessage({
                    command: 'defaultData',
                    newdata: [['openid', that.databus.openid]]
                  })
                  if (res.data.data.userinfo.bamaso_id) {
                    that.databus.islogin = true
                  } else {
                    that.loginbtn()
                  }
                  try {
                    wx.setStorageSync('openid', res.data.data.userinfo.openid)
                  } catch (e) {
                  }
                }
              } else {
                if (that.databus.getinfotimes < 1) {
                  that.databus.getinfotimes += 1
                  that.getSessionKey(that.getInfo)
                }
              }
            }
          })
        }
      })
    }
  }
  // 获取用户成绩 拿到历史最高以及本周最高 分数
  getScore(cb, fromObj = '') {
    if (this.fromObj !== '' && (fromObj === undefined || fromObj === '')) {
      console.log('fromObj没传的情况：' + this.fromObj)
      fromObj = this.fromObj
    }
    var that = this
    wx.request({
      url: 'https://apis.bamasoso.com/game/fruit/score',
      data: {
        token: that.databus.token
      },
      method: 'GET',
      success: function (res) {
        if (res.data.meta.code == 200) {
          that.databus.scoreinfo = res.data.data.score
          // 创造新纪录 服务器更新新数据
          if (!that.databus.scoreinfo || (that.databus.scoreinfo && that.databus.score > that.databus.scoreinfo.weekscore)) {
            that.databus.scorepage = 'newscore'
            that.updateScore(that.databus.score)
          } else {
            that.databus.scorepage = 'score'
          }
          that.databus.openDataContext.postMessage({
            command: 'defaultData',
            newdata: [['newscore', that.databus.score.toString()], ['scoreinfo', that.databus.scoreinfo], ['scorepage', that.databus.scorepage]]
          })
          this.fromObj = ''
          typeof cb == "function" && cb.apply(fromObj)
        } else {
          this.fromObj = fromObj
          that.getSessionKey(that.getScore, cb)
        }
      }
    })
  }
  // 获取用户礼物信息
  getGift() {
    var that = this
    wx.request({
      url: 'https://apis.bamasoso.com/game/fruit/gift',
      data: {
        token: that.databus.token
      },
      method: 'GET',
      success: function (res) {
        if (res.data.meta.code == 200) {
          that.databus.gift = res.data.gift
        }
      }
    })
  }
  // 更新最高分
  updateScore(score) {
    var that = this
    wx.request({
      url: 'https://apis.bamasoso.com/game/fruit/updatescore',
      data: {
        token: that.databus.token,
        score: score
      },
      method: 'GET',
      success: function (res) {
      }
    })
  }
}