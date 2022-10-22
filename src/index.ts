import { Game , Stack, Field} from './bricksCore/core';
import Control from './control/control';
import './index.css';

class StackView extends Control{
  private stackModel:Stack;
  private cellViews: Array<Control>;
  private colors:Array<string>;

  constructor (parentNode: HTMLElement, stackModel:Stack, colors:Array<string>, onClick:()=>void){
    let direction = stackModel.direction;
    super(parentNode, 'div', (direction == 2 || direction == 3)?'row':'row row__vertical');
    
    this.cellViews = [];
    this.stackModel = stackModel;
    this.colors = colors;

    stackModel.cells.forEach((jt, j)=>{
      let cellView = new Control(this.node, 'div', 'cell cell__stack');
      cellView.node.textContent = stackModel.direction.toString();
      //cellView.node.textContent = direction.toString();
      cellView.node.onclick = ()=>{
        onClick();
      }
      this.cellViews.push(cellView);

      /*cellView.node.onmouseover = ()=>{
        cells[it.initialPosition.y][it.initialPosition.x].node.style.borderWidth = '3px';
      }
      cellView.node.onmouseout = ()=>{
        cells[it.initialPosition.y][it.initialPosition.x].node.style.borderWidth = '';
      }*/

      
    });  

    //this.update();
  }

  public update(){
    this.cellViews.forEach((cellView, index)=>{
      const direction = this.stackModel.direction
      const cellIndex = ( direction == 2 || direction == 1 ) ? index : this.stackModel.cells.length - 1 - index
      const cellColor = this.stackModel.cells[cellIndex]
      cellView.node.style.backgroundColor = this.colors[cellColor];
      //cellView.node.textContent =['', '\\/', '>', '<', '/\\'  , ][direction];
    });
  }
}

class FieldView extends Control{
  private colors:Array<string>;
  private fieldModel:Field;
  private cells: Array<Array<Control>>;

  constructor (parentNode:HTMLElement, colors:Array<string>, fieldModel:Field){
    super(parentNode);
    this.fieldModel = fieldModel;
    this.colors = colors;
    this.cells = [];
    for (let i = 0; i<fieldModel.width; i++){
      const rowView = new Control(this.node, 'div', 'row');
      const row: Array<Control> = [];
      for (let j = 0; j< fieldModel.height; j++){
        let cell = new Control(rowView.node, 'div', 'cell cell__field');  
        row.push(cell); 
      }
      this.cells.push(row);
    }
  }

  public update(){
    this.cells.forEach(it=>it.forEach(cellView=>{
      cellView.node.style.backgroundColor = '#fff';
      cellView.node.textContent = '';
    }));

    this.fieldModel.cells.forEach(cell=>{
      const cellView = this.cells[cell.position.y][cell.position.x];
      cellView.node.style.backgroundColor = this.colors[cell.color];
      cellView.node.textContent = ['', '\\/', '>', '<', '/\\'  , ][cell.direction];
    }); 
  }
}

class BricksView extends Control{
  private colors = ['#f99', '#9f9', '#99f', '#f4f', '#df0', '#f90'];
  private fieldView: FieldView;
  private stakes: Array<StackView>;

  constructor (parentNode: HTMLElement, game:Game){
    super(parentNode, 'div', 'grid_wrapper');

    this.stakes = [];
    const gridZones:Array<Control> = [];
    for (let i =0; i< 9; i++){
      gridZones.push(new Control(this.node, 'div', 'grid_zone'));
    }

    for (let direction = 1; direction<=4; direction++){
      const stackView = new Control(gridZones[[1, 3, 5, 7][direction -1 ]].node, 'div', (direction == 1 || direction == 4)?'row':'row row__vertical');
      game.stackList.stacks.forEach((it, i)=>{
        //console.log(it.direction);
        /*if (it.direction == direction){
          let stacker = new Control(stackView.node, 'div', (direction == 2 || direction == 3)?'row':'row row__vertical');
          
          it.cells.forEach((jt, j)=>{

          
            let cellView = new Control(stacker.node, 'div', 'cell cell__stack');
            cellView.node.textContent = it.direction.toString();
            cellView.node.onclick = ()=>{
              this.handleMove(i);
            }

            cellView.node.onmouseover = ()=>{
              cells[it.initialPosition.y][it.initialPosition.x].node.style.borderWidth = '3px';
            }
            cellView.node.onmouseout = ()=>{
              cells[it.initialPosition.y][it.initialPosition.x].node.style.borderWidth = '';
            }

            cellView.node.style.backgroundColor = this.colors[it.cells[(direction == 2 || direction == 1) ? j : it.cells.length-1 - j]];
          });
        }*/
        if (it.direction == direction){
          let stacker = new StackView(stackView.node, it, this.colors, ()=>{ this.handleMove(i); });
          this.stakes.push(stacker);
        }
      });
    }
    /*

    const cells: Array<Array<Control>> = [];
    const fieldView = new Control(gridZones[4].node);
    for (let i = 0; i<10; i++){
      const rowView = new Control(fieldView.node, 'div', 'row');
      const row: Array<Control> = [];
      for (let j = 0; j< 10; j++){
        let cell = new Control(rowView.node, 'div', 'cell cell__field');  
        row.push(cell); 
      }
      cells.push(row);
    }

    game.field.cells.forEach(cell=>{
      const cellView = cells[cell.position.y][cell.position.x];
      cellView.node.style.backgroundColor = this.colors[cell.color];
      cellView.node.textContent = cell.direction.toString();
    });*/

    this.fieldView = new FieldView(gridZones[4].node, this.colors, game.field);

    this.update();
  }

  private handleMove(stackIndex:number){
    game.move(stackIndex);
    //game.processMove();
    let timer = 0;
    game.processSteps({
      onStep:(next)=>{
        setTimeout(()=>{
          //document.querySelector('#app').innerHTML='';
          //new BricksView(document.querySelector('#app'), game);
          this.update();
          timer = 100;
          next();
        }, timer);
      },
      onFinish:()=>{
          if (game.field.cells.length == 0){
            console.log('win');
          }
      }
    });
  }

  public update(){
    this.stakes.forEach(stake=>stake.update());
    this.fieldView.update();
  }
}

const game = new Game(5, 10, 2, 3);

new BricksView(document.querySelector('#app'), game);

(window as any).app = game;
console.log("App started");
