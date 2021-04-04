import { _decorator, Component, Node, Prefab, UITransform, instantiate, Vec3, Enum, PhysicsSystem2D, v2, Label, director } from "cc";
import { Player } from "./Player";

const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property({ type: Prefab })
  public food: Prefab | null = null;

  @property({ type: Node })
  public ground: Node | null = null;

  @property({ type: Node })
  public player: Node | null = null;

  @property({ type: Label })
  public score: Label | null = null;

  @property({ displayName: "Max Start Duration" })
  public maxStartDuration: number = 0;

  @property({ displayName: "Min Start Duration" })
  public minStartDuaration: number = 0;

  groundY: number = 0;
  _playerScore = 0;
  timer: number = 0;
  startDuration: number = 0;

  gainScore() {
    this._playerScore += 1;
    this.score.string = `SCORE: ${this._playerScore}`;
  }

  spawnNewFood() {
    const newFood = instantiate(this.food);
    this.node.addChild(newFood);
    newFood.setPosition(this.getNewFoodPosition());

    this.startDuration = this.minStartDuaration + Math.random() * (this.maxStartDuration - this.minStartDuaration);
    this.timer = 0;
  }

  getNewFoodPosition(): Vec3 {
    const maxX = this.getComponent(UITransform)?.width / 2;
    const randX = (Math.random() - 0.5) * 2 * maxX;
    const randY = this.groundY + Math.floor(Math.random() * this.player.getComponent(Player)?.jumpHeight) + 50;

    // console.log("Rand XY", randX, randY, this.groundY);
    return new Vec3(randX, randY, 0);
  }

  onLoad() {
    this.timer = 0;
    this.startDuration = 0;

    const ground = this.ground;
    this.groundY = ground.getPosition().y + ground.getComponent(UITransform).height / 2;
    this.spawnNewFood();
  }

  start() {
    director.preloadScene("Menu");
  }

  update(dt: number) {
    if (this.timer > this.startDuration) return this.gameOver();
    this.timer += dt;
  }

  gameOver() {
    director.loadScene("Menu");
  }
}
