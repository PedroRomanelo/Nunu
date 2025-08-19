import { PopupConfig, PopupLibraryConfig, PopupPosition, StorageData, TriggerConfig, TriggerType } from './types';
import { Popup } from './Popup';

export class PopupManager {
    private config: PopupLibraryConfig;
    private activePopup: Popup | null = null ;
    private STORAGE_KEY = 'popup_library_data'; 

    constructor(config?: PopupLibraryConfig) {
        this.config = {
        reappearInterval: 4, // default 4 hours
        defaultPosition: 'center',
        ...config,
        };
        this.init();
    }
    private init(): void { // Adicionar estilos base ao head do documento
        this.injectBaseStyles();
    }

    private injectBaseStyles(): void {
        const style = document.createElement("style"); //cria um novo elemento <style>
        style.textContent = `
            .popup-overlay{}
            .popup-overlay.active{}
            .popup-container{}
            .popup-overlay.active .popup-container{}
            .popup-close-button{}
            .popup-image{}
            .popup-title{}
            .popup-text{}
            .popup-button{}
            .popup-button:hover{}
            .popup-container.position-center{}
            .popup-container.position-bottom-right{}
            .popup-container.position-bottom-left{}
            .popup-container.position-top-banner{}
            .popup-container.position-bottom-banner{}
            @media() {
              .popup-container{}
              .popup-container.position-bottom-right,
              .popup-container.position-bottom-left{}
              .popup-image{}
            }
        `;
        document.head.appendChild(style);
    }

    private canShowPopup(popupId: string): boolean { //evitará mostrar popups repetidamente
        const storedData = localStorage.getItem(this.STORAGE_KEY); //usando a chave "popup_library_data" obtemos os dados do localStorage
        if(storedData) { //se houver dados no localStorage
            const data: StorageData = JSON.parse(storedData); //converte os dados do localStorage em um objeto
            const now = Date.now(); //obtemos a data atual 
            const fourHoursInMillis = (this.config.reappearInterval || 4) * 60 * 60 * 1000;

            //verifica se o ID do popup atual é igual ao último ID registrado
            //verifica se a data de última visualização é menor que 4 horas(fourHoursInMillis)
            if (data.popupId === popupId && (now - data.lastShown < fourHoursInMillis)) {
                return false; // Não pode mostrar, ainda está no intervalo
            }
        }
        return true;
    }

    private recordPopupShown (popupId: string):void { //registra o ID do popup na data do localStorage
        const data: StorageData = {
            lastShown: Date.now(),
            popupId: popupId,
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
    
    private isMobileDevice(): boolean { //verifica se o navegador é mobile
        return ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
    }

    public show(config: PopupConfig): void {
        const popupId = config.title.replace(/\s+/g, "-").toLowerCase(); //remove espaços e converte em minusculas - gerar Id simples

        if (!this.canShowPopup(popupId)) {
            console.log(`popup "${config.title}" não pode ser exibido ainda`);
            return;
        }
        
        if (this.activePopup) {
            this.activePopup.hide();
        }

        let finalPosition = config.position || this.config.defaultPosition;
        if (this.isMobileDevice()) {
            if (finalPosition === "bottom-right" || finalPosition === "bottom-left") {
                finalPosition = "bottom-banner";
            }
        }

        this.activePopup = new Popup ({
            ...config,
            position: finalPosition,
            onClose: () => {
                this.recordPopupShown(popupId);
                config.onClose?.();
                this.activePopup = null;
            },
        });

        const trigger = config.trigger;
        if (trigger) {
            this.setupTrigger (trigger, () => this.activePopup?.show());
        } else {
            this.activePopup.show();
        }
    }

    setupTrigger(trigger: TriggerConfig, callback: () => void): void {
        switch (trigger.type) {
            case "time":
                setTimeout(callback, trigger.delay || 0);
                break;
            case "scroll":
                const scrollHandler = () => {
                    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                    if (scrollPercentage >= (trigger.scrollPercentage || 50)) {
                        callback();
                        window.removeEventListener("scroll", scrollHandler);
                    }
                };
                window.addEventListener("scroll", scrollHandler);
                break;
            case "exit-intent":
                if(this.isMobileDevice()) {
                    setTimeout(callback, 10000);
                    console.warn("exit-intent trigger is not fully supported on mobile. Using a time based fallback.");
                } else {
                    const mouseLeaveHandler = (e:MouseEvent) => {
                        if (e.clientY < 10 ) {
                            callback();
                            document.removeEventListener("mouseleave", mouseLeaveHandler);
                        }
                    };
                    document.addEventListener("mouseleave", mouseLeaveHandler);
                }
                break;
            case "click":
                if(trigger.element) {
                    const element = document.querySelector(trigger.element);
                    if (element) {
                        element.addEventListener("click", callback);
                    } else {
                        console.warn (`element with selector "${trigger.element}" not found`);
                    }
                }
                break;
        }
    }

    public hideActtivePopup(): void {
        if(this.activePopup) {
            this.activePopup.hide();
            this.activePopup = null;
        }
    }
}