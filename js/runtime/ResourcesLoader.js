// 资源加载器
import {Resources} from '../libs/Resources.js'

export default class ResourcesLoader{
  constructor(){
    this.map = new Map(Resources)
    
    for (var [key, value] of this.map) {
      let img = new Image()
      img.src = value
      this.map.set(key, img)
    }
  }
  onLoaded(callback){
    let loadcount = 0
    for(var value of this.map.values()){
      value.onload = () => {
        loadcount++
        if (loadcount >= this.map.size) {
          return callback(this.map)
        }
      }
    }
  }
  static getLoader(){
    if (!ResourcesLoader.instance) {
      ResourcesLoader.instance = new ResourcesLoader()
    }
    return ResourcesLoader.instance
  }
}