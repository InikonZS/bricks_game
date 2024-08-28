import { Game } from '../bricksCore/core';
import Control from '../control/control';
import { StackView } from './stackView';
import { FieldView } from './fieldView';
import { ComboView } from './comboView';
import { RemoveView } from './removeView';
import { PauseMenu } from './pauseMenu';
import { IVector2 } from '../bricksCore/IVector2';
import { WinView } from '../views/winView'; 

export class BricksView extends Control{
    private colors = ['#f99', '#9f9', '#99f', '#f4f', '#df0', '#f90'];
    private fieldView: FieldView;
    private stakes: Array<StackView>;
    onFinish:  (result: string)=> void;
    game: Game;
    removeLayer: Control;
    locked: boolean;
    gridWrapper: Control;
    flw: Control;
    header: Control<HTMLElement>;
  
    constructor (parentNode: HTMLElement, game:Game){
      super(parentNode, 'div', 'bricks_wrapper');
      const header = new Control(this.node, 'div', 'header');
      this.header = header;
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
      const h = this.node.clientHeight - this.header.node.clientHeight
        //this.flw.node.style.height = this.node.clientHeight - this.header.node.clientHeight;
      const parent = this.gridWrapper.node;
      //const sizeW = (parent.clientWidth / (this.game.height + 6)) - 2;
      //const sizeH = (this.flw.node.clientHeight / (this.game.width + 6)) - 2;
      const sizeWF = (this.flw.node.clientWidth / (this.game.height + 6)) - 0;
      const sizeHF = (Math.min(this.flw.node.clientHeight, h) / (this.game.width + 6)) - 0;
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
              const winView = new WinView(this.removeLayer.node);
              winView.onClose = ()=>{
                this.onFinish?.('completed');
              }
              winView.animate();
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