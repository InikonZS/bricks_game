import Control from '../control/control';
import './winView.css';
import { localize } from '../localization/localization';

export class WinView extends Control {
    onClose: ()=>void;
    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', 'winView_center');
        const animatedText = new Control(this.node, 'div', 'winView', 'Level completed')
    }

    animate() {
        const cellView = this;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            setTimeout(() => {
                cellView.node.remove();
                this.onClose?.();
            }, 2900);
        }))
    }
}