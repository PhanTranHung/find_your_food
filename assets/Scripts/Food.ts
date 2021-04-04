import { _decorator, Component, Node, Enum, Collider2D, CircleCollider2D, ITriggerEvent, Contact2DType, IPhysics2DContact } from "cc";
const { ccclass, property } = _decorator;
import { GameManager } from "./GameManager";

@ccclass("Food")
export class Food extends Component {
  @property
  pickRadius: number = 0;

  shouldDestroy = false;

  start() {
    const collider = this.node.getComponent(CircleCollider2D);
    // console.log("Collider", collider);
    if (!collider) throw "Collider Null";
    collider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
    // collider.on(Contact2DType.PRE_SOLVE, this.onContact, this);
    // collider.on(Contact2DType.POST_SOLVE, this.onContact, this);
    // collider.on(Contact2DType.END_CONTACT, this.onContact, this);
  }

  onContact(selfCollider: CircleCollider2D, otherCollider: CircleCollider2D, contact: IPhysics2DContact | null) {
    // will be called once when two colliders begin to contact
    console.log("self: ", selfCollider.name, " other: ", otherCollider.name);
    if (otherCollider.name === "PurpleMonster<CircleCollider2D>") {
      const gm = this.node.parent?.getComponent(GameManager);
      gm?.spawnNewFood();
      gm?.gainScore();

      this.shouldDestroy = true;
    }
  }

  lateUpdate(deltaTime: number) {
    if (this.shouldDestroy) {
      this.node.destroy();
    }
  }

  onDestroy() {}
}
