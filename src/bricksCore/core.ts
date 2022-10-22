export class Game{
  public field: Field;
  public stackList: StackList;

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

  public processSteps(handlers:{onStep:(next:()=>void)=>void, onFinish:()=>void}){
    const processStep = ()=>{
      return this.field.processStep()
    }
    if (processStep()){
      handlers.onStep(()=>{
        this.processSteps(handlers);
      });
    } else {
      handlers.onStep(()=>{
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
  private breakFigureLength: number

  constructor(width:number, height:number, colors:number, breakFigureLength:number){
    this.breakFigureLength = breakFigureLength;
    this.width = width;
    this.height = height;
    for (let i = 0; i< 10; i++){
      const position = {
        y: Math.floor(Math.random() * width), 
        x: Math.floor(Math.random() * height)
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
      }
    });
    if (isChanged == false){
      this.cells.forEach(cell=>{
        let fig = this.checkFigure(cell.position, cell.color);
        if (fig.length>=this.breakFigureLength){
          this.removeFigure(fig);
          isChanged = true;
        }
      });
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

class StackList{
  public stacks: Array<Stack>;

  constructor (width:number, height:number, colors:number){
    this.stacks = [];
    for (let i = 0; i< (width + height) *2; i++){
      const stack = new Stack(colors);
      const direction = this.getDirection(i, width, height);
      stack.direction = direction;
      stack.initialPosition = this.getInitial(i, width, height);
      console.log(direction, stack.initialPosition);
      for (let j = 0; j<3;j++){
        stack.push(Math.floor(Math.random()* colors));
      }
      this.stacks.push(stack);
    }
  }

  private getDirection(index: number, width:number, height:number){
    if (index < height) { return 1; }
    if (index < width + height) { return 2; }
    if (index < width * 2  + height) { return 3; }
    return 4;
  }

  public getInitial(index: number, width:number, height:number){
    if (index < height) { return {x: Math.floor(index % height), y: 0} }
    if (index < width + height) { return {x: 0, y: Math.floor((index - width) % width)} }
    if (index < width * 2  + height) {return {x: height-1, y: Math.floor((index - width - height) % width)} }
    return {x: Math.floor(index % height), y: width - 1}
  }

  public findByCell(cell:Cell){
    return this.stacks.find(stack=>{
      let dir = [0, 4, 3, 2, 1];
      return stack.initialPosition.x == cell.position.x && stack.initialPosition.y == cell.position.y && stack.direction == dir[cell.direction];
    });
  }

 /* public getStack(index:number){
    return this.stacks[index];
  }*/

}

export class Stack{
  public cells: Array<number> = [];
  public direction: number;
  public initialPosition: IVector2;

  private colorsCount: number;
  private stackLength: number = 3;

  constructor(colorsCount: number){
    this.colorsCount = colorsCount;
  }

  pop(){
    const cell = this.cells.pop();
    this.cells.unshift(Math.floor(Math.random() * this.colorsCount));
    return cell;
  }

  push(color:number){
    this.cells = this.cells.slice(this.cells.length + 1 - this.stackLength);
    return this.cells.push(color); 
  }
}

class Cell{
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

}

interface IVector2{
  x: number;
  y: number;
}