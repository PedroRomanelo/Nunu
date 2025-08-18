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
}