import Control from '../../control/control';
import content from './rules.html';
import './rules.css';

console.log(content);
export class RulesView extends Control {
    onClose: () => void;
    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', 'rules_view');
        const center = new Control(this.node, 'div', 'rules_center');
        const contentContainer = new Control(center.node, 'div', 'rules_content_container');
        contentContainer.node.innerHTML = content;
        const buttonsContainer = new Control(center.node, 'div', 'rules_buttons');
        const closeButton = new Control(buttonsContainer.node, 'button', 'option_button rules_close', 'close');
        closeButton.node.onclick = ()=>{
            this.close();
        }
    }

    animate() {
        requestAnimationFrame(() => requestAnimationFrame(() => {
            this.node.classList.add('rules_view_animate');
        }))
    }

    close() {
        this.node.remove();
        this.onClose?.();
    };
}