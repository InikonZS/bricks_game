import {Cell} from './cell';
import { StackList } from './stackList';
import { Field } from './field';
import { IVector2 } from './IVector2';
import { ICellData } from './interfaces';

export interface IGameData{
  width: number,
  height: number,
  colors: number,
  score?: number,
  moves?: number,
  field: {
    cells: Array<ICellData>
  }
  stackList: Array<Array<number>>
}

export class Game{
  public field: Field;
  public stackList: StackList;
  score: number = 0;
  moves: number = 0;
  combo: number = 0;
  width: number;
  height: number;
  colors: number;

  constructor(breakFigureLength:number, data:IGameData){
    this.width = data.width;
    this.height = data.height;
    this.colors = data.colors;
    this.score = data.score || 0;
    this.moves = data.moves || 0;
    const fieldData = data.field.cells;//Field.generate(width, height, colors, 15);
    this.field = new Field(data.width, data.height, data.colors, breakFigureLength, fieldData);
    const stackData = data.stackList;
    this.stackList = new StackList(data.width, data.height, data.colors, stackData/*.generate(width, height, colors)*/);
    this.field.onReverted = (cell:Cell)=>{
      const st = this.stackList.findByCell(cell);
      st.push(cell.color);
    }
  }

  static generateRandom(width: number, height:number, colors:number, count:number){
    return {
      width: width,
      height: height,
      colors: colors,
      field: {cells: Field.generateRandom(width, height, colors, count)},
      stackList: StackList.generate(width, height, colors)
    }
  }

  static generateByTemplate(width: number, height:number, colors:number, template:Array<Array<number>>){
    return {
      width: width,
      height: height,
      colors: colors,
      field: {cells: Field.generateByTemplate(width, height, colors, template)},
      stackList: StackList.generate(width, height, colors)
    }
  }

  /*static generate(width:number, height:number, colors:number, breakFigureLength:number){
    const game = new Game(width, height, colors, breakFigureLength);
    const fieldData = Field.generate(width, height, colors, 15);
    game.field = new Field(width, height, colors, breakFigureLength, fieldData);
    game.stackList = new StackList(width, height, colors, StackList.generate(width, height, colors));
    game.width = width;
    game.height = height;
    game.colors = colors;
    game.field.onReverted = (cell:Cell)=>{
      const st = game.stackList.findByCell(cell);
      st.push(cell.color);
    }
    
    return game;
  }*/

  public move(stackIndex:number){
    const currentStack = this.stackList.stacks[stackIndex];
    if (this.field.isAvailableLine(currentStack.direction, currentStack.initialPosition)){
      this.moves++;
      const newCell = new Cell(currentStack.pop(), currentStack.direction, {...currentStack.initialPosition});
      newCell.isMoving = true;
      this.field.putCell(newCell);
    }
  }

  //payed hint setColor handler, not a main mechanic
  public setColor(color: number, position: IVector2){
    const cell = this.field.getCell(position);
    cell.setColor(color);
  }

  /*public processMove(){
    for (let i=0; i<10000;i++){
      if (!this.field.processStep()){
        return;
      };
    } 
    throw new Error('Max iterations, break');
  }*/

  public processSteps(handlers:{onStep:(next:()=>void)=>void, onFinish:()=>void, onRemove: (figure:Array<IVector2>, color: number, combo:number)=>void}){
    this.field.onRemove = (fig, color)=>{
      this.combo +=1;
      this.score += (fig.length * (fig.length - 2)) * this.combo;
      handlers.onRemove(fig, color, this.combo);
    }
    const processStep = ()=>{
      return this.field.processStep()
    }
    if (processStep()){
      handlers.onStep(()=>{
        this.processSteps(handlers);
      });
    } else {
      handlers.onStep(()=>{
        //console.log('finish')
        this.combo = 0;
        handlers.onFinish();
      });
      return;
    }
  }

  public checkFigure(point:IVector2){
    //console.log(this.field.checkFigure(point));
  }

  save(){
    return {
      field: this.field.save(),
      stackList: this.stackList.save(),
      width: this.width,
      height: this.height,
      colors: this.colors,
      moves: this.moves,
      score: this.score
    }
  }

  /*static load(data:any){
    const game = new Game(data.width, data.height, data.colors, 3);
    game.field = new Field(data.width, data.height, data.colors, 3, data.field.cells);
    game.stackList = StackList.load(data.stackList);//new StackList(data.width, data.height, data.colors);
    game.width = data.width;
    game.height = data.height;
    game.colors = data.colors;
    game.field.onReverted = (cell:Cell)=>{
      const st = game.stackList.findByCell(cell);
      st.push(cell.color);
    }
    return game;
  }*/
}



