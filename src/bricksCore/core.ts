export class Game{
  public field: Field;
  public stackList: StackList;

  constructor(width:number, height:number, colors:number){
    this.field = new Field(width, height, colors);
    this.stackList = new StackList(width, height, colors);
    this.field.onReverted = (cell:Cell)=>{
      let st = this.stackList.stacks.find(stack=>{
        let dir = [0, 4, 3, 2, 1];
        return stack.initialPosition.x == cell.position.x && stack.initialPosition.y == cell.position.y && stack.direction == dir[cell.direction];
      });
      if (st){
        st.push(cell.color);
      }
    }
  }

  public move(stackIndex:number){
    const currentStack = this.stackList.stacks[stackIndex];
    console.log(currentStack.initialPosition);
    if (this.field.cells.find(cell=>(((currentStack.direction == 1 || currentStack.direction == 4) && cell.position.x == currentStack.initialPosition.x) || ((currentStack.direction == 2 || currentStack.direction == 3) &&cell.position.y == currentStack.initialPosition.y )) )){
      this.field.putCell(new Cell(currentStack.pop(), currentStack.direction, {...currentStack.initialPosition}));
    }
  }

  public processMove(){
    for (let i=0; i<10000;i++){
      if (!this.field.processStep()){
        return;
      };
    } 
    throw new Error('Max iterations, break');
  }

  public checkFigure(point:IVector2){
    //console.log(this.field.checkFigure(point));
  }
}

class Field{
  public cells: Array<Cell> = [];
  private width: number;
  private height: number;
  public onReverted:(cell:Cell)=>void;

  constructor(width:number, height:number, colors:number){
    this.width = width;
    this.height = height;
    for (let i = 0; i< 10; i++){
      let cell = new Cell(Math.floor(Math.random() * colors), 0, {x: Math.floor(Math.random() * width), y:Math.floor(Math.random() * height)});
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

  public processStep(){
    let isChanged = false;
    this.cells.forEach(cell=>{
      const nextPosition = cell.getNextPosition();
      let nextCell = this.cells[this.getIndex(nextPosition.x, nextPosition.y)]
      if ( nextCell == null ){
        if (nextPosition.x >=0 && nextPosition.y>=0 && nextPosition.x<this.width && nextPosition.y<this.height){
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
        if (fig.length>3){
          this.removeFigure(fig);
          isChanged = true;
        }
      });
    }
    return isChanged;
  }

  private getIndex(x:number, y:number):number{
    return this.cells.findIndex(cell=>{
      return cell.position.x == x && cell.position.y == y;
    });
  }

  public checkFigure(initialPoint:IVector2, color:number){
    let waveField = this.cells.map(it=>{
      return {color:it.color, generation:99999}
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
        let cell = this.cells[this.getIndex(point.x, point.y)];
        if (cell){
          deletedCells.push(cell);
        }
    });

    this.cells = this.cells.filter(it=>!deletedCells.includes(it));
  }

}

class StackList{
  public stacks: Array<Stack>;

  constructor (width:number, height:number, colors:number){
    this.stacks = [];
    for (let i = 0; i< (width + height) *2; i++){
      const stack = new Stack();
      const direction = this.getDirection(i, width, height);
      stack.direction = direction;
      stack.initialPosition = this.getInitial(i, width, height);
      for (let j = 0; j<3;j++){
        stack.push(Math.floor(Math.random()* colors));
      }
      this.stacks.push(stack);
    }
  }

  private getDirection(index: number, width:number, height:number){
    if (index < width) { return 1; }
    if (index < width + height) { return 2; }
    if (index < width * 2  + height) { return 3; }
    return 4;
  }

  public getInitial(index: number, width:number, height:number){
    if (index < width) { return {x: Math.floor(index % width), y: 0} }
    if (index < width + height) { return {x: 0, y: Math.floor((index - width) % height)} }
    if (index < width * 2  + height) {return {x: width-1, y: Math.floor((index - width - height) % height)} }
    return {x: Math.floor(index % width), y: height - 1}
  }

 /* public getStack(index:number){
    return this.stacks[index];
  }*/

}

class Stack{
  public cells: Array<number> = [];
  public direction: number;
  public initialPosition: IVector2;

  pop(){
    const cell = this.cells.pop();
    this.cells.unshift(Math.floor(Math.random() * /*colors*/3));
    return cell;
  }

  push(color:number){
    this.cells = this.cells.slice(this.cells.length - 2);
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