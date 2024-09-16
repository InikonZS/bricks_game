import { Game } from '../bricksCore/core';
import Control from '../control/control';
import { StackView } from './stackView';
import { FieldView } from './fieldView';
import { ComboView } from './comboView';
import { RemoveView } from './removeView';
import { PauseMenu } from './pauseMenu';
import { IVector2 } from '../bricksCore/IVector2';
import { WinView } from '../views/winView'; 
import { ScoreBlock } from './scoreBlock/scoreBlock';
import { localize } from '../localization/localization';
import { CorpLink } from './corpLink';
import { sound } from './sounds';
import { yandex } from '../platforms/yandex';

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
    combos: Array<ComboView> = [];
    scoreBlock: ScoreBlock;
    menuBtn: Control<HTMLElement>;
    soundVolume: Control<HTMLInputElement>;
  cornerSettings: Control<HTMLElement>;
  soundVolumeTitle: Control<HTMLElement>;
  corpLink: CorpLink;
  
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
  
      this.scoreBlock = new ScoreBlock(gridZones[2].node);
      this.scoreBlock.update({score: game.score, moves: game.moves});

      this.cornerSettings = new Control(gridZones[8].node, 'div', 'corner_settings');

      const soundSetting = new Control(this.cornerSettings.node, 'div');
      this.soundVolumeTitle = new Control(soundSetting.node, 'div', 'sound_volume_title', 'Volume');

      this.soundVolume = new Control<HTMLInputElement>(soundSetting.node, 'input', 'sound_volume');
      this.soundVolume.node.type = 'range';
      this.soundVolume.node.min = '0';
      this.soundVolume.node.max = '1';
      this.soundVolume.node.step = '0.01';
      this.soundVolume.node.value = sound.volume.toString();
      this.soundVolume.node.oninput = ()=>{
        sound.volume = this.soundVolume.node.valueAsNumber;
      };

      if (!yandex.sdk){
        //No corp. link for ya-games
        this.corpLink = new CorpLink(this.cornerSettings.node);
      }

      this.menuBtn = new Control(gridZones[0].node, 'button', 'header_button', 'menu');
      this.menuBtn.node.onclick = ()=>{
        const overlay = new Control(this.node, 'div', 'overlay');
        const menu = new PauseMenu(overlay.node);
        menu.onSubmit = (result)=>{
          if (result == 'save'){
              const saveData = this.game.save();
              //console.log(saveData);
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
      this.fieldView.onSetColor = (color, position)=>{
        game.setColor(color, position);
        this.handleMove();
      };
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
      this.updateLocalize = this.updateLocalize.bind(this);
      localize.onChange.add(this.updateLocalize);
      this.updateLocalize();
    }

    updateLocalize() {
        this.menuBtn.node.textContent = localize.currentLang['menu'];
        this.soundVolumeTitle.node.textContent = localize.currentLang['volume'];
    }

    destroy(): void {
        localize.onChange.remove(this.updateLocalize);
        super.destroy();
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
     const thinThreshold = 18;
     if (size<thinThreshold){
      this.node.classList.add('use_think');
      document.body.style.setProperty('--cellSize', (size+1).toString()+'px');
     } else {
      this.node.classList.remove('use_think');
      document.body.style.setProperty('--cellSize', size.toString()+'px');
     }

      if (this.node.clientHeight< 600){
        this.node.classList.add('pause_menu_low_h');
      } else {
        this.node.classList.remove('pause_menu_low_h');
      }
      if (this.node.clientHeight< 400){
        this.node.classList.add('pause_menu_super_low_h');
      } else {
        this.node.classList.remove('pause_menu_super_low_h');
      }
      this.node.style.setProperty('--mm-base-size', (this.node.clientHeight / 600) + 'px');
      //document.body.style.setProperty('--cellSize', size.toString()+'px');
    }
  
    private handleMove(stackIndex?:number){
      if (this.locked){
        return;
      }
      this.locked = true;
      const game = this.game;

      if (stackIndex != undefined){
        game.move(stackIndex);
        sound.play('shot');
      }

      this.scoreBlock.update({score:game.score, moves: game.moves});
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
              //console.log('win');
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
          sound.play('remove');

          this.update();
          //console.log('combo '+combo);
          if (combo>1){
            const comboView = new ComboView(this.removeLayer.node, combo);
            this.combos.push(comboView);
            comboView.onClose =()=>{
              //console.log(this.combos.length);
              this.combos.shift();
              const nextCombo = this.combos[0];
              if (nextCombo){
                nextCombo.animate();
              }
            }
            if (this.combos.length == 1){
              comboView.animate();
            }
          }
          this.scoreBlock.update({score:game.score, moves: game.moves})
          const animationType = Math.floor(Math.random()* RemoveView.animationsCount)
          figure.forEach(cell=>{
            const cellView = new RemoveView(this.removeLayer.node, cell, color);
            cellView.animate(animationType);
            
          })
        }
      });
    }
  
    public update(){
      this.stakes.forEach((stake, i)=>{
        const stackModel = this.game.stackList.stacks[i];
        const isAvailable = !this.game.field.isAvailableLine(stackModel.direction, stackModel.initialPosition);
        stake.update(isAvailable);
      });
      this.fieldView.update();
    }
    
  }