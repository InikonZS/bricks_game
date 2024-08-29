import { ICellData } from "./interfaces";
import { IVector2 } from "./IVector2";

export class Cell{
    private _direction: number;
    private _color: number;
    public position: IVector2;
  
    constructor (color:number, direction:number, position:IVector2){
      this._color = color;
      this._direction = direction;
      this.position = position;
    }
  
    public setDirection(direction:number){
       this._direction = direction;
    }
  
    public getNextPosition(){
      const movements:Array<IVector2> = [{x:0, y:0}, {x:0, y:1},{x:1, y:0}, {x:-1, y:0}, {x:0, y:-1}];
      const currentMovement = movements[this._direction];
      return {x: this.position.x + currentMovement.x, y: this.position.y + currentMovement.y};
    }
  
    get color() {
      return this._color;
    }
  
    get direction(){
      return this._direction;
    }

    save(){
        return {
            direction: this.direction,
            color: this.color,
            position: this.position
        }
    }

    static load(data:ICellData){
        return new Cell(data.color, data.direction, data.position);
    }
  
  }