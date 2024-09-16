import Control from '../control/control';
import { localize } from '../localization/localization';
import './hintView.css';
  
export class HintView extends Control{
    hintShadow: Control<HTMLElement>;
    hintPopup: Control<HTMLElement>;
    hintBuy: Control<HTMLElement>;
    colorsWrap: Control<HTMLElement>;
    hintPopupTitle: Control<HTMLElement>;
    hintPopupDesc: Control<HTMLElement>;
    closeButton: Control<HTMLElement>;
    onSelect: (color: number)=>void;
    onClose: ()=>void;

    constructor(parentNode: HTMLElement, colors: number){
        super(parentNode, 'div', 'hint_view');
        this.hintShadow = new Control(this.node, 'div', 'hint_shadow');
        this.hintShadow.node.onclick = ()=>{
            this.hide();
            this.onClose?.();
        }

        this.hintPopup = new Control(this.node, 'div', 'hint_popup');
        this.hintPopupTitle = new Control(this.hintPopup.node, 'div', 'hint_popup_title');
        this.hintPopupTitle.node.textContent = localize.currentLang['hintChangeColorTitle']
        this.hintPopupDesc = new Control(this.hintPopup.node, 'div', 'hint_popup_desc');
        this.hintPopupDesc.node.textContent = localize.currentLang['hintChangeColorDesc'];
        this.colorsWrap = new Control(this.hintPopup.node, 'div', 'hint_colors_wrap');
        for (let i = 0; i<colors; i++){
            const colorCell = new Control(this.colorsWrap.node, 'div', 'cell cell__field');
            colorCell.node.style.backgroundColor = `var(--cellColor${i + 1})`
            colorCell.node.onclick = ()=>{
                console.log('select ', i);
                this.onSelect?.(i);
                this.hide();
            }
        }

        this.closeButton = new Control(this.hintPopup.node, 'button', 'option_button hint_popup_close', localize.currentLang['close']);
        this.closeButton.node.onclick = ()=>{
            this.hide();
            this.onClose?.();
        }
        /*this.hintBuy = new Control(this.hintPopup.node, 'button', 'option_button', 'Watch adv.');
        this.hintBuy.node.onclick = ()=>{
            console.log('bought');
        }*/
    }

    show(){
        this.node.classList.add('hint_show');
    }

    hide(){
        this.node.classList.remove('hint_show');
    }
}