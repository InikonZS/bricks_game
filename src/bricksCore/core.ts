import {Cell} from './cell';
import { StackList } from './stackList';
import { IVector2 } from './IVector2';

export class Game{
  public field: Field;
  public stackList: StackList;
  combo: number = 0;

  constructor(width:number, height:number, colors:number, breakFigureLength:number){
    this.field = new Field(width, height, colors, breakFigureLength);
    this.stackList = new StackList(width, height, colors);
    this.field.onReverted = (cell:Cell)=>{
      const st = this.stackList.findByCell(cell);
      st.push(cell.color);
    }
  }

  public move(stackIndex:number){
    const currentStack = this.stackList.stacks[stackIndex];
    if (this.field.isAvailableLine(currentStack.direction, currentStack.initialPosition)){
      this.field.putCell(new Cell(currentStack.pop(), currentStack.direction, {...currentStack.initialPosition}));
    }
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
        console.log('finish')
        this.combo = 0;
        handlers.onFinish();
      });
      return;
    }
  }

  public checkFigure(point:IVector2){
    //console.log(this.field.checkFigure(point));
  }
}

export class Field{
  public cells: Array<Cell> = [];
  public width: number;
  public height: number;
  public onReverted:(cell:Cell)=>void;
  public onRemove:(figure:Array<IVector2>, color: number)=>void;
  private breakFigureLength: number;
  //public forRemove: Array<Array<Cell>> = []

  constructor(width:number, height:number, colors:number, breakFigureLength:number){
    this.breakFigureLength = breakFigureLength;
    this.width = width;
    this.height = height;
    for (let i = 0; i< 10; i++){
      const position = {
        y: Math.floor(Math.random() * width), 
        x: Math.floor(Math.random() * height)
      }
      if (this.getIndex(position.x, position.y) != -1){
        console.log('wrong position')
        continue;
      }
      let cell = new Cell(Math.floor(Math.random() * colors), 0, position);
      this.putCell(cell);
    }
  }

  public putCell(cell:Cell){
    this.cells.push(cell);
    return cell;
  }

  public revertCell(cell:Cell){
    this.cells = this.cells.filter(it=>it!=cell);
    return cell;
  }

  private isInsideField(nextPosition:IVector2){
    return (nextPosition.x >=0 && nextPosition.y>=0 && nextPosition.y<this.width && nextPosition.x<this.height);
  }

  public processStep(){
    let isChanged = false;
    this.cells.forEach(cell=>{
      const nextPosition = cell.getNextPosition();
      const nextCell = this.getCell(nextPosition);//this.cells[this.getIndex(nextPosition.x, nextPosition.y)]
      if ( nextCell == null ){
        if (this.isInsideField(nextPosition)){
          cell.position = nextPosition;
        } else {
          this.revertCell(cell);
          this.onReverted(cell);
        }
        isChanged = true;
        //this.combo = 0;
      }
    });
    const forRemove: IVector2[][] = [];
    if (isChanged == false){
      this.cells.forEach(cell=>{
        if (forRemove.find(figure=> figure.find(({x, y})=> cell.position.x == x && cell.position.y == y))){
          return;
        }
        let fig = this.checkFigure(cell.position, cell.color);
        
        if (fig.length>=this.breakFigureLength){
          //this.removeFigure(fig);
          forRemove.push(fig);
          //this.combo+=1;
          this.onRemove(fig, cell.color);
          //console.log(JSON.stringify(fig));
          isChanged = true;
        } else {
          //this.combo = 0;
        }
      });
      console.log(forRemove);
      forRemove.forEach(it=>{
        this.removeFigure(it);
      })
    }
    return isChanged;
  }

  public getIndex(x:number, y:number):number{
    return this.cells.findIndex(cell=>{
      return cell.position.x == x && cell.position.y == y;
    });
  }

  public getCell(position:IVector2):Cell{
    return this.cells[this.getIndex(position.x, position.y)];
  }

  private checkFigure(initialPoint:IVector2, color:number){
    const waveField = this.cells.map(it=>{
      return {color:it.color, generation: Number.MAX_SAFE_INTEGER}
    });

    const moves:Array<IVector2> = [{x:0, y:1},{x:1, y:0}, {x:-1, y:0}, {x:0, y:-1}];

    const trace = (points:Array<IVector2>, currentGen:number, figPoints:Array<IVector2>): Array<IVector2> =>{
      let nextGen:Array<IVector2> = [];
      points.forEach(point=>{
        moves.forEach(move=>{
          let moved: IVector2 = {x:point.x + move.x, y: point.y + move.y};
          let cell = waveField[this.getIndex(moved.x, moved.y)];
          if (cell && cell.generation > currentGen && cell.color == color){
            nextGen.push(moved); 
            cell.generation = currentGen;
            figPoints.push(moved);
            //count+=1;
          }
        });
      });
      if (nextGen.length){
        return trace(nextGen, currentGen+1, figPoints);
      } else {
        return figPoints;
      }
    }
    
    return trace([initialPoint], 0, []);
  }

  public removeFigure(figPoints:Array<IVector2>){
    let deletedCells:Array<Cell> = [];
    figPoints.forEach(point=>{
        let cell = this.getCell(point);//this.cells[this.getIndex(point.x, point.y)];
        if (cell){
          deletedCells.push(cell);
        }
    });

    this.cells = this.cells.filter(it=>!deletedCells.includes(it));
    //this.forRemove.push(deletedCells);
  }

  public isAvailableLine(direction: number, initialPosition: IVector2):boolean{
    const firstCell = this.cells.find(cell=>{
      return (
        ((direction == 1 || direction == 4) && cell.position.x == initialPosition.x) || 
        ((direction == 2 || direction == 3) && cell.position.y == initialPosition.y)
      )
    });
    if (firstCell){
      if (!this.getCell(initialPosition)){
        return true;
      }
    }
    return false;
  }

}


