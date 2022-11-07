import { Game, Field, IGameData} from './bricksCore/core';
import { IVector2 } from './bricksCore/IVector2';
import { Stack } from './bricksCore/stack';
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
      //cellView.node.textContent = stackModel.direction.toString();
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
      cellView.node.style.backgroundColor = `var(--cellColor${cellColor + 1})`;//this.colors[cellColor];
      //cellView.node.textContent =['', '\\/', '>', '<', '/\\'  , ][direction];
    });
  }
}

class FieldView extends Control{
  private colors:Array<string>;
  private fieldModel:Field;
  private cells: Array<Array<Control>>;

  constructor (parentNode:HTMLElement, colors:Array<string>, fieldModel:Field){
    super(parentNode, 'div', '');
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
      cellView.node.style.backgroundColor = `var(--cellColorEmpty)`;
      cellView.node.textContent = '';
    }));

    this.fieldModel.cells.forEach(cell=>{
      const cellView = this.cells[cell.position.y][cell.position.x];
      cellView.node.style.backgroundColor = `var(--cellColor${cell.color + 1})`//this.colors[cell.color];
      cellView.node.innerHTML = `<svg class="sw_wrapper sw_wrapper${cell.direction}" version="1.0" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet">
       <path fill="#000" d="M50 100 L0 50 L45 5 L50 10 L10 50 L50 90 L45 95Z">
     </svg>`
     // cellView.node.textContent = ['', '\\/', '>', '<', '/\\'  , ][cell.direction];
    }); 

    /*this.fieldModel.forRemove.forEach(figure=>{
      figure.forEach(cell=>{
        const cellView = this.cells[cell.position.y][cell.position.x];
        cellView.node.style.backgroundColor = this.colors[cell.color];
        cellView.node.classList.add('cell__animate');
        cellView.node.ontransitionend = ()=>{
            cellView.node.ontransitionend = null;
            cellView.node.classList.remove('cell__animate');
            cellView.node.style.backgroundColor = '#fff';
            cellView.node.textContent = '';
            this.fieldModel.forRemove = this.fieldModel.forRemove.filter(it=> it !== figure);
        }
      })
    });*/
  }
}

class BricksView extends Control{
  private colors = ['#f99', '#9f9', '#99f', '#f4f', '#df0', '#f90'];
  private fieldView: FieldView;
  private stakes: Array<StackView>;
  onFinish: any;
  game: Game;
  removeLayer: Control;
  locked: boolean;
  gridWrapper: Control;
  flw: Control;

  constructor (parentNode: HTMLElement, game:Game){
    super(parentNode, 'div', 'bricks_wrapper');
    const header = new Control(this.node, 'div', 'header');
    const saveBtn = new Control(header.node, 'button', '', 'save');
    saveBtn.node.onclick = ()=>{
      const saveData = this.game.save();
      console.log(saveData);
      //@ts-ignore
      window.saved = saveData
    }
    const flw = new Control(this.node, 'div', 'flw');
    this.flw = flw;
    const wrapper = new Control(flw.node, 'div', 'grid_wrapper')
    this.gridWrapper = wrapper;
    this.game = game;
    
    
    this.stakes = [];
    const gridZones:Array<Control> = [];
    for (let i =0; i< 9; i++){
      gridZones.push(new Control(wrapper.node, 'div', 'grid_zone' + (i==4&&' gamefield')));
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
    this.removeLayer = new Control(gridZones[4].node, 'div', 'remove_layer');
    this.update();
    this.resize();
    requestAnimationFrame(()=> requestAnimationFrame(()=>{
      this.resize();
    }))
    window.onresize = ()=>{
      this.resize();
      requestAnimationFrame(()=> requestAnimationFrame(()=>{
        this.resize();
      }))
    }
  }

  resize(){
    const parent = this.gridWrapper.node;
    //const sizeW = (parent.clientWidth / (this.game.height + 6)) - 2;
    //const sizeH = (this.flw.node.clientHeight / (this.game.width + 6)) - 2;
    const sizeWF = (this.flw.node.clientWidth / (this.game.height + 6)) - 0;
    const sizeHF = (this.flw.node.clientHeight / (this.game.width + 6)) - 0;
    const size = Math.min(sizeHF, sizeWF);
    //const aspectF = (this.game.height + 6) / (this.game.width + 6)
    //const aspectR = this.flw.node.clientWidth / this.flw.node.clientHeight;
    /*if (size != sizeHF && size !== sizeWF){
      parent.classList.add('bricks_wrapper_full')
    } else {
      parent.classList.remove('bricks_wrapper_full')
    }*/
    /*if (aspectF <= aspectR){
      parent.classList.add('bricks_wrapper_h')
    } else {
      parent.classList.remove('bricks_wrapper_h')
    }*/
    document.body.style.setProperty('--cellSize', size.toString()+'px');
  }

  private handleMove(stackIndex:number){
    if (this.locked){
      return;
    }
    this.locked = true;
    const game = this.game;
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
            this.onFinish?.();
          } else {
            this.locked = false;
          }
      },
      onRemove:(figure:Array<IVector2>, color:number,combo:number)=>{
        console.log('combo '+combo);
        if (combo>1){
          const comoView = new ComboView(this.removeLayer.node, combo);
          comoView.animate();
        }
        figure.forEach(cell=>{
          const cellView = new RemoveView(this.removeLayer.node, cell, color);
          cellView.animate();
          
        })
      }
    });
  }

  public update(){
    this.stakes.forEach(stake=>stake.update());
    this.fieldView.update();
  }

  destroy(){
    this.node.remove();
  }
}

function startGame(){
  const game = new Game(3, Game.generate(6, 10, 5));//Game.generate(6, 10, 2, 3);
  const view = new BricksView(document.querySelector('#app'), game);
  (window as any).app = game;
  view.onFinish = ()=>{
    view.destroy();
    startGame()
  }
}

class RemoveView extends Control{
  constructor(parentNode:HTMLElement, position:IVector2, color:number){
    super(parentNode, 'div', 'cell remove_cell');
    this.node.style.left = `calc(${position.x} * (var(--cellSize) + 2px))`;
    this.node.style.top = `calc(${position.y} * (var(--cellSize) + 2px))`;
    this.node.style.backgroundColor = `var(--cellColor${color + 1})`;
  }

  animate(){
    const cellView = this;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      
      cellView.node.classList.add('cell__animate');
      cellView.node.ontransitionend = ()=>{
          cellView.node.ontransitionend = null;
          cellView.node.classList.remove('cell__animate');
          cellView.node.style.backgroundColor = `var(--cellColorEmpty)`;
          cellView.node.textContent = '';
          cellView.node.remove();
          //this.fieldModel.forRemove = this.fieldModel.forRemove.filter(it=> it !== figure);
      }
    }))
  }
}

class ComboView extends Control{
  constructor(parentNode:HTMLElement, combo: number){
    super(parentNode, 'div', '', 'Combo: '+ combo);
    this.node.style.left = '0';
    this.node.style.top =  '0';
    //this.node.style.backgroundColor = color;
  }

  animate(){
    const cellView = this;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      
      //cellView.node.classList.add('cell__animate');
      //cellView.node.ontransitionend = ()=>{
          /*cellView.node.ontransitionend = null;
          cellView.node.classList.remove('cell__animate');
          cellView.node.style.backgroundColor = '#fff';
          cellView.node.textContent = '';*/
          setTimeout(()=>{
            cellView.node.remove();
          }, 500);
          
          //this.fieldModel.forRemove = this.fieldModel.forRemove.filter(it=> it !== figure);
      //}
    }))
  }
}

startGame();


function loadGame(data:IGameData){
  const game = new Game(3, data)//Game.load(data);
  const view = new BricksView(document.querySelector('#app'), game);
  (window as any).app = game;
  view.onFinish = ()=>{
    view.destroy();
    startGame()
  }
}
/*const loadBtn = new Control(document.body, 'button', '', 'load');
loadBtn.node.onclick = ()=>{
  //@ts-ignore
  loadGame(window.saved);
}*/


console.log("App started");
