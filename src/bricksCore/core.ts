import {Cell} from './cell';
import { StackList } from './stackList';
import { IVector2 } from './IVector2';

export interface IGameData{
  width: number,
  height: number,
  colors: number,
  field: {
    cells: Array<ICellData>
  }
  stackList: Array<Array<number>>
}

export class Game{
  public field: Field;
  public stackList: StackList;
  combo: number = 0;
  width: number;
  height: number;
  colors: number;

  constructor(breakFigureLength:number, data:IGameData){
    this.width = data.width;
    this.height = data.height;
    this.colors = data.colors;
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

  save(){
    return {
      field: this.field.save(),
      stackList: this.stackList.save(),
      width: this.width,
      height: this.height,
      colors: this.colors
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

interface ICellData{
  position: IVector2,
  color: number,
  direction: number
}

export class Field{
  public cells: Array<Cell> = [];
  public width: number;
  public height: number;
  public onReverted:(cell:Cell)=>void;
  public onRemove:(figure:Array<IVector2>, color: number)=>void;
  private breakFigureLength: number;
  colors: number;
  //public forRemove: Array<Array<Cell>> = []

  constructor(width:number, height:number, colors:number, breakFigureLength:number, cells:Array<ICellData>){
    this.breakFigureLength = breakFigureLength;
    this.width = width;
    this.height = height;
    this.colors = colors;
    this.loadCells(cells);
  }

  static generateByTemplate(width:number, height:number, colors:number, template:Array<Array<number>>){
    /*const template = [
      [0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 0],
    ];
    const template2 = [
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
    ];*/
    const centerPoint = {x: Math.floor((width - template[0].length) / 2), y: Math.floor((height - template.length) / 2)};
    const result: Array<ICellData> = [];
    template.forEach((row, y)=>{
      row.forEach((cell, x)=>{
        if (cell == 0) return;
        const position = {
          y: y + centerPoint.y, 
          x: x + centerPoint.x
        }
        let cellData: ICellData = {
          color: Math.floor(Math.random() * colors), 
          direction: 0, 
          position
        };
        result.push(cellData);
      })
    })
    
    return result
  }

  static generateRandom(width:number, height:number, colors:number, count: number){
    const result: Array<ICellData> = [];
    const getIndex = (x:number, y:number)=>{
      return result.findIndex(cell=>{
        return cell.position.x == x && cell.position.y == y;
      });
    }
    for (let i = 0; i< count; i++){
      const position = {
        y: Math.floor(Math.random() * width), 
        x: Math.floor(Math.random() * height)
      }
      if (getIndex(position.x, position.y) != -1){
        console.log('wrong position')
        continue;
      }
      let cell: ICellData = {
        color: Math.floor(Math.random() * colors), 
        direction: 0, 
        position
      };
      result.push(cell);
      //this.putCell(cell);
    }
    return result
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

  save(){
    return {
      cells: this.cells.map(it=> it.save()),
    }
  }

  loadCells(cellsData: Array<any>){
    this.cells = cellsData.map(it=> Cell.load(it));
  }

  /*static load(width:number, height:number, colors:number, data:any){
    const field = new Field(width, height, colors, 3);
    field.loadCells(data.cells);
    return field;
  }*/

}


