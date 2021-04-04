import { _decorator, Component, Node, Graphics, systemEvent, SystemEvent, EventKeyboard, macro, Vec3, PhysicsSystem2D } from "cc";
const { ccclass, property } = _decorator;

const FPS = Math.round(1 / PhysicsSystem2D.instance.fixedTimeStep);

@ccclass("Player")
export class Player extends Component {
  @property()
  jumpHeight = 0;

  @property
  jumpDuration = 0;

  @property
  maxMovementSpeedX = 0;

  @property({ displayName: "Acceleration X" })
  accelX = 0;

  @property({ displayName: "Deceleration X" })
  decelX = 0;

  @property
  maxMovementSpeedY = 0;

  @property({ displayName: "Acceleration Y" })
  accelY = 0;

  @property({ displayName: "Deceleration Y" })
  decelY = 0;

  private _jumpAction: any;
  private _accLeft: boolean = false;
  private _accRight: boolean = false;
  private _xSpeed: number = 0;

  private _accUp: boolean = false;
  private _accDown: boolean = false;
  private _ySpeed: number = 0;

  private _minMovementAbleX: number = 0;
  private _minMovementAbleY: number = 0;

  start() {
    this.calMinMovementAble();
  }

  onLoad() {
    this._accLeft = false;
    this._accRight = false;
    this._xSpeed = 0;

    systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  }

  onKeyDown(event: EventKeyboard) {
    // console.log("Key down: ", event.keyCode);
    switch (event.keyCode) {
      case macro.KEY.a:
        return (this._accLeft = true);
      case macro.KEY.d:
        return (this._accRight = true);
      case macro.KEY.w:
        return (this._accUp = true);
      case macro.KEY.s:
        return (this._accDown = true);
    }
  }

  onKeyUp(event: EventKeyboard) {
    // console.log("Key up: ", event.keyCode);
    switch (event.keyCode) {
      case macro.KEY.a:
        return (this._accLeft = false);
      case macro.KEY.d:
        return (this._accRight = false);
      case macro.KEY.w:
        return (this._accUp = false);
      case macro.KEY.s:
        return (this._accDown = false);
    }
  }

  calMinMovementAble() {
    const { decelX, decelY } = this;
    this._minMovementAbleX = this.calDeltaV(decelX, 1 / FPS);
    this._minMovementAbleY = this.calDeltaV(decelY, 1 / FPS);
  }

  // Δv = a * Δt
  calDeltaV(a: number, dt: number) {
    return a * dt;
  }

  calVelocity(a: number, dt: number, v: number, maxSpeed: number) {
    v += this.calDeltaV(a, dt);
    if (Math.abs(v) > maxSpeed) v = maxSpeed * (Math.abs(v) / v);
    return v;
  }

  calNewXCor(curPosition: number, dt: number) {
    const { _accLeft, _accRight, _xSpeed, accelX, decelX, maxMovementSpeedX, _minMovementAbleX } = this;

    let a: number = 0;
    if (_accLeft || _accRight) {
      if (_accLeft) a = -accelX;
      if (_accRight) a = accelX;

      this._xSpeed = this.calVelocity(a, dt, _xSpeed, maxMovementSpeedX);
    }
    // reduce player speed to 0
    else {
      if (_xSpeed == 0) return curPosition;

      if (_xSpeed > 0) a = -decelX;
      if (_xSpeed < 0) a = decelX;

      this._xSpeed = this.calVelocity(a, dt, _xSpeed, maxMovementSpeedX);
      if (Math.abs(this._xSpeed) < _minMovementAbleX) this._xSpeed = 0;
    }

    // console.log("X speed: ", this._xSpeed);
    return curPosition + this._xSpeed * dt;
  }

  calNewYCor(curPosition: number, dt: number) {
    const { _accUp, _accDown, _ySpeed, accelY, decelY, maxMovementSpeedY, _minMovementAbleY } = this;

    let a: number = 0;
    if (_accUp || _accDown) {
      if (_accUp) a = accelY;
      if (_accDown) a = -decelY;

      this._ySpeed = this.calVelocity(a, dt, _ySpeed, maxMovementSpeedY);
    }
    // reduce player speed to 0
    else {
      if (_ySpeed == 0) return curPosition;

      if (_ySpeed > 0) a = -decelY;
      if (_ySpeed < 0) a = decelY;

      this._ySpeed = this.calVelocity(a, dt, _ySpeed, maxMovementSpeedY);
      if (Math.abs(this._ySpeed) < _minMovementAbleY) this._ySpeed = 0;
    }

    // console.log("X speed: ", this._xSpeed);
    return curPosition + this._ySpeed * dt;
  }

  // dt: deltaTime
  update(dt: number) {
    const curPosition = this.node.getPosition();
    const newX = this.calNewXCor(curPosition.x, dt);
    const newY = this.calNewYCor(curPosition.y, dt);
    curPosition.x = newX;
    curPosition.y = newY;

    this.node.setPosition(curPosition);
  }
}
