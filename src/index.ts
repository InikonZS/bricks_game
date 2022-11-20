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
  onFinish:  (result: string)=> void;
  game: Game;
  removeLayer: Control;
  locked: boolean;
  gridWrapper: Control;
  flw: Control;

  constructor (parentNode: HTMLElement, game:Game){
    super(parentNode, 'div', 'bricks_wrapper');
    const header = new Control(this.node, 'div', 'header');
    /*const saveBtn = new Control(header.node, 'button', 'header_button', 'save');
    saveBtn.node.onclick = ()=>{
      const saveData = this.game.save();
      console.log(saveData);
      localStorage.setItem('saved', JSON.stringify(saveData));
      //window.saved = saveData
    }

    const exitBtn = new Control(header.node, 'button', 'header_button', 'exit');
    exitBtn.node.onclick = ()=>{
      this.onFinish();
    }*/

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

    const menuBtn = new Control(gridZones[0].node, 'button', 'header_button', 'menu');
    menuBtn.node.onclick = ()=>{
      const overlay = new Control(this.node, 'div', 'overlay');
      const menu = new PauseMenu(overlay.node);
      menu.onSubmit = (result)=>{
        if (result == 'save'){
            const saveData = this.game.save();
            console.log(saveData);
            localStorage.setItem('saved', JSON.stringify(saveData));
        } else if (result == 'menu'){
           this.onFinish('mainMenu');
        } else if (result == 'restart'){
          this.onFinish('restart');
        }
        menu.destroy();
        overlay.destroy();
      }
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
            this.onFinish?.('completed');
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
  const root = document.querySelector<HTMLElement>('#app');
  const mainMenu = new MainMenu(root);
  mainMenu.onSubmit = (selected=>{
    if (selected == 'load'){
      const saved = localStorage.getItem('saved');
      if (saved){
        const parsed = JSON.parse(saved);
        loadGame(parsed);
        mainMenu.destroy();
      }
      //loadGame();
    } else if (selected == 'custom'){
      mainMenu.destroy();
      const settingsView = new SettingsView(root);
      settingsView.onSubmit = (settings)=>{
        //const game = new Game(3, Game.generate(6, 10, 5));//Game.generate(6, 10, 2, 3);
        const generated = Game.generate(settings.height, settings.width, settings.colors, 15);
        const startWithGenerated = ()=>{
          const game = new Game(3, generated);//Game.generate(6, 10, 2, 3);
          const view = new BricksView(root, game);

          (window as any).app = game;
          view.onFinish = (result)=>{
            if (result == 'mainMenu'){
              view.destroy();
              startGame()
            } else if (result == 'restart'){
              view.destroy();
              startWithGenerated()
            } else if (result == 'completed'){
              view.destroy();
              startGame()
            }
            
          }
        }
        startWithGenerated();
        
      }
    }
  })
  
  
}

class RemoveView extends Control{
  constructor(parentNode:HTMLElement, position:IVector2, color:number){
    super(parentNode, 'div', 'cell remove_cell');
    this.node.style.left = `calc(${position.x} * (var(--cellSize) + 0px))`;
    this.node.style.top = `calc(${position.y} * (var(--cellSize) + 0px))`;
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

interface ISettings{
  colors: number,
  width: number,
  height: number
}
class SettingsView extends Control{
  onSubmit: (settings:ISettings)=>void;

  constructor(parentNode:HTMLElement){
    super(parentNode, 'div', 'settings_wrapper');

    const colorsText = new Control(this.node, 'div', 'option_text', 'colors: ');
    const colors = new Control<HTMLInputElement>(this.node, 'input', 'option_input');
    colors.node.type = 'number';
    colors.node.value = '5';

    const sizeXText = new Control(this.node, 'div', 'option_text', 'sizeX: ');
    const sizeX = new Control<HTMLInputElement>(this.node, 'input', 'option_input');
    sizeX.node.type = 'number';
    sizeX.node.value = '10';
    

    const sizeYText = new Control(this.node, 'div', 'option_text', 'sizeY: ');
    const sizeY = new Control<HTMLInputElement>(this.node, 'input', 'option_input');
    sizeY.node.type = 'number';
    sizeY.node.value = '6';

    const submitText = new Control(this.node, 'div', 'option_text', '');
    const submit = new Control(this.node, 'button', 'option_input option_button', 'New game');
    submit.node.onclick = ()=>{
      this.node.remove();
      this.onSubmit?.({
        colors: colors.node.valueAsNumber,
        width: sizeX.node.valueAsNumber,
        height: sizeY.node.valueAsNumber
      })
    }
  }
}

class MainMenu extends Control{
  onSubmit: (selected:string)=>void;

  constructor(parentNode:HTMLElement){
    super(parentNode, 'div', 'settings_wrapper');
    const customGame = new Control(this.node, 'button', 'option_input option_button', 'custom game');
    customGame.node.onclick = ()=>{
      this.onSubmit('custom');
    }

    const loadGame = new Control(this.node, 'button', 'option_input option_button', 'load game');
    loadGame.node.onclick = ()=>{
      this.onSubmit('load');
    }

    const levelGenerators = [
      ()=>Game.generate(6, 6, 2, 1),
      ()=>Game.generate(7, 7, 3, 4),
      ()=>Game.generate(8, 8, 4, 7),
      ()=>Game.generate(10, 10, 5, 12),
      ()=>Game.generate(10, 10, 6, 15),
      ()=>Game.generate(10, 10, 7, 15),
      ()=>Game.generate(12, 12, 8, 15),
    ]

    const levelContainer = new Control(this.node, 'div', 'level_container');
    levelGenerators.forEach((levelGenerator, index)=>{
      const levelButton = new Control(levelContainer.node, 'button', 'level_button', index.toString());
      levelButton.node.onclick = ()=>{

      }
    })
  }
}

class PauseMenu extends Control{
  onSubmit: (selected:'continue' | 'restart' | 'save' | 'menu')=>void;

  constructor(parentNode:HTMLElement){
    super(parentNode, 'div', 'settings_wrapper');
    const continueButton = new Control(this.node, 'button', 'option_input option_button', 'continue');
    continueButton.node.onclick = ()=>{
      this.onSubmit('continue');
    }

    const restart = new Control(this.node, 'button', 'option_input option_button', 'restart');
    restart.node.onclick = ()=>{
      this.onSubmit('restart');
    }


    const saveGame = new Control(this.node, 'button', 'option_input option_button', 'save game');
    saveGame.node.onclick = ()=>{
      this.onSubmit('save');
    }

    const mainMenu = new Control(this.node, 'button', 'option_input option_button', 'main menu');
    mainMenu.node.onclick = ()=>{
      this.onSubmit('menu');
    }
  }
}

startGame();