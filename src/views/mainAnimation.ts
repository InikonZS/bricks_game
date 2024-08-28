import { ICellData } from '../bricksCore/interfaces';
import { IVector2 } from '../bricksCore/IVector2';
import Control from '../control/control';
import './mainAnimation.css';

export class MainAnimation extends Control{
    items: Array<ICellData> = [];
    cellViews: Record<string, Control> = {};
    subFieldView: Control<HTMLElement>;
    colors = ['#f99', '#9f9', '#99f', '#f4f', '#df0', '#f90'];
    timer: NodeJS.Timeout;
    lastCellId = 10;
    subFieldWrap: Control<HTMLElement>;
    subFieldShade: Control<HTMLElement>;

    constructor(parentNode: HTMLElement){
        super(parentNode, 'div', 'mainAnimation_wrap');

        this.subFieldWrap = new Control(this.node, 'div', 'mainAnimation_subFieldWrap');
        this.subFieldView = new Control(this.subFieldWrap.node, 'div', 'mainAnimation_subField');
        this.subFieldShade = new Control(this.subFieldWrap.node, 'div', 'mainAnimation_subFieldShade');

        this.items.push({
            position: {x: 1, y: 1},
            color: Math.floor(Math.random() *this.colors.length),
            direction: 1,
            id: "1"
        });
        this.items.push({
            position: {x: 2, y: 2},
            color: Math.floor(Math.random() *this.colors.length),
            direction: 2,
            id: "2"
        });
        this.items.push({
            position: {x: 4, y: 4},
            color: Math.floor(Math.random() *this.colors.length),
            direction: 3,
            id: "3"
        });
        this.update();

        this.timer = setInterval(()=>{
            this.items.forEach(it=>{
                it.position = this.getNextCellPosition(it, 0.1);
                if (it.position.x < -1 || it.position.y< -1 || it.position.x > 6 ||  it.position.y >6){
                    this.items = this.items.filter(jt=>jt!= it);
                    this.lastCellId+=1;
                    const direction = Math.floor(Math.random() * 4 + 1);
                    let pos;
                    if (direction == 2){
                        pos = {x: -1, y: Math.floor(Math.random() * 6)}
                    } else if (direction == 1){
                        pos = {y: -1, x: Math.floor(Math.random() * 6)}
                    } else if (direction == 3){
                        pos = {x: 6, y: Math.floor(Math.random() * 6)}
                    } else if (direction == 4){
                        pos = {y: 6, x: Math.floor(Math.random() * 6)}
                    }
                    this.items.push({
                        position: pos,
                        color: Math.floor(Math.random() *this.colors.length),
                        direction: direction,
                        id: this.lastCellId.toString()
                    });
                }
                this.update();
            });
        }, 50);
    }

    getNextCellPosition(cell:ICellData, k: number){
        const movements:Array<IVector2> = [{x:0, y:0}, {x:0, y:1},{x:1, y:0}, {x:-1, y:0}, {x:0, y:-1}];
        const currentMovement = movements[cell.direction];
        return {x:  cell.position.x + currentMovement.x * k, y: cell.position.y + currentMovement.y * k};
      }

    cssPos(value: number){
        return `calc(${value} * 100% / ${300 / 50})`
    }

    update(){
        this.items.forEach(it=>{
            if (this.cellViews[it.id]){
                this.cellViews[it.id].node.style.top = this.cssPos(it.position.y);
                this.cellViews[it.id].node.style.left = this.cssPos(it.position.x);
            } else {
                const cell = new Control(this.subFieldView.node, 'div', 'mainAnimation_cell');
                cell.node.style.top = this.cssPos(it.position.y);
                cell.node.style.left = this.cssPos(it.position.x);
                cell.node.style.backgroundColor = this.colors[it.color];
                this.cellViews[it.id] = cell;
            }
        });
        const itemsMap: Record<string, ICellData> = {};
        this.items.forEach(it=>{
            itemsMap[it.id] = it;
        });
        Object.keys(this.cellViews).forEach((key)=>{
            if (!itemsMap[key]){
                this.cellViews[key].destroy();
                delete this.cellViews[key];
            }
        })
    }

    destroy(): void {
        clearInterval(this.timer);
    }
}