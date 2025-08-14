import { BasePopupConfig, CouponPopupConfig, CallToActionPopupConfig, LeadCapturePopupConfig, FeedbackPopupConfig, FeedbackType, FeedbackData, LeadData } from './types';

export class Popup {
    config: BasePopupConfig;
    overlay: HTMLElement; //cria a camada de fundo atrás do pop-up
    container: HTMLElement; //cria o elemento principal que "contém" todo o conteúdo do pop-up
    closeButton: HTMLElement; //cria o botão de fechar

    constructor(config: BasePopupConfig) {
        this.config = config;
        this.overlay = this.createOverlay();
        this.container = this.createContainer();
        this.closeButton = this.createCloseButton();
    }

    private createOverlay(): HTMLElement { //retorna um elemento HTML
        const overlay = document.createElement("div"); 
        overlay.classList.add("popup-overlay");
        return overlay;
    }

    private createContainer(): HTMLElement {    
        const container = document.createElement("div");
        container.classList.add("popup-container");
        if(this.config.position) {
            container.classList.add(`container-${this.config.position}`);
        }
        return container
    }

    private createCloseButton(): HTMLElement {
        const button = document.createElement("button");
        button.classList.add("popup-close-button");
        button.innerHTML = "&times;" // "x"
        return button;
    }

    private attachEventListeners(): void { //permitirá fechar o popup com "esc", "x" ou clicando no fundo(overlay)
        this.closeButton.addEventListener('click', this.hide.bind(this));
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        });
    }

    public hide(): void { //funcao para fechar o popup
        console.log('hide');
    }
}