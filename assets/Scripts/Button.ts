import { _decorator, Component, Node, director, SystemEventType } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Button")
export class Button extends Component {
  onLoad() {
    director.preloadScene("Main");
    this.node.on(
      SystemEventType.TOUCH_START,
      function () {
        console.log(director.loadScene("Main"));
      },
      this
    );
  }

  //   start() {
  //     // [3]
  //   }

  // update (deltaTime: number) {
  //     // [4]
  // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
