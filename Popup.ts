import { BasePopupConfig, CouponPopupConfig, CallToActionPopupConfig, LeadCapturePopupConfig, FeedbackPopupConfig, FeedbackType, FeedbackData, LeadData } from './types';

export class Popup {
    private config: BasePopupConfig;
    private overlay: HTMLElement; //cria a camada de fundo atrás do pop-up
    private container: HTMLElement; //cria o elemento principal que "contém" todo o conteúdo do pop-up
    private closeButton: HTMLElement; //cria o botão de fechar

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

    //permitirá fechar o popup com "esc", "x" ou clicando no fundo(overlay)
    private attachEventListeners(): void { //void pois não precisa retornar nada
        this.closeButton.addEventListener('click', this.hide.bind(this)); //bind(this) para que o this seja o popup
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) { //evita que se feche ao clicar dentro do popup
                this.hide();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { //key retorna o valor da tecla pressionada, no caso "Esc"
                this.hide();
            }
        });
    }

    public hide(): void { //funcao para fechar o popup
        this.overlay.classList.remove("active"); // Remove o pop-up do DOM após a transição para evitar acúmulo
        this.overlay.addEventListener("transitionend", () => { //remoção do pop-up só acontece após a animação de saída ter sido completamente finalizada
            if(!this.overlay.classList.contains("active")) {  //se o popup não estiver ativo, remove o elemento do DOM
                this.overlay.remove();
                this.config.onClose?.();
            }
        }, {once: true});
    }

    private renderContent(): void {
        this.container.innerHTML = ""; //limpa o container antes de renderizar o conteúdo
        this.container.appendChild(this.closeButton); //adicio                                                                 na popup

        const img = document.createElement("img"); //adiciona a imagem ao container
        img.src = this.config.imageUrl;
        img.classList.add("popup-image");
        this.container.appendChild(img); 

        const title = document.createElement("h2"); //cria o título
        title.classList.add("popup-title");
        title.textContent = this.config.title;
        this.container.appendChild(title);

        if (this.config.text) { //texto
            const text = document.createElement("p");
            text.classList.add("popup-text");
            text.textContent = this.config.text;
            this.container.appendChild(text);
        }

        switch (this.config.type) { // Renderiza o conteúdo específico do tipo de pop-up
            case "coupon":
                this.renderCouponContent(this.config as CouponPopupConfig);
                break;
            case "call-to-action":
                this.renderCallToActionContent(this.config as CallToActionPopupConfig);
                break;
            case "lead-capture":
                this.renderLeadCaptureContent(this.config as LeadCapturePopupConfig);
                break;
            case "feedback":
                this.renderFeedbackContent(this.config as FeedbackPopupConfig);
                break;
        }
    }

    private renderCouponContent(config: CouponPopupConfig): void {
        const couponContainer = document.createElement("div"); //cria div
        couponContainer.classList.add("coupon-container"); //adiciona a classe para o css

        const couponCodeDisplay = document.createElement("input"); //cria o input para exibir o código do cupom
        couponCodeDisplay.type = "text"; //define o tipo do input
        couponCodeDisplay.value = config.couponCode; //colocar dentro do input o código
        couponCodeDisplay.readOnly = true; //o input se torna somente leitura
        couponCodeDisplay.classList.add("coupon-code-display"); //classe css para o campo que mostra o código

        const copyButton = document.createElement("button"); //cria o botão
        copyButton.classList.add("popup-button", "copy-coupon-button"); //classe genérica do botão popup e uma especifica para copiar o cupom
        copyButton.textContent = "Copiar"; //texto do botão

        const message = document.createElement("span"); //cria o elemento que mostra a mensagem de sucesso
        message.classList.add("copy-message"); //classe css para o elemento que mostra a mensagem

        copyButton.addEventListener("click", () => {
            navigator.clipboard.writeText(config.couponCode).then(() => { //Usa a API de clipboard do navegador para copiar o código do cupom. Retorna uma promisse
                message.textContent = "Copiado !"; //altera o texto do elemento que mostra a mensagem
                setTimeout(() => message.textContent = "", 2000); //limpa o elemento após 2 segundos
            }).catch(err => {
                console.error("FALHA ! Tente copiar o cupom novamente !", err); 
                message.textContent = "Erro ao copiar !"; 
            });
        });
        couponContainer.appendChild(couponCodeDisplay); // Coloca o <input> dentro da <div> container.
        couponContainer.appendChild(copyButton); // Coloca o botão dentro da <div> container.
        couponContainer.appendChild(message); //Coloca o <span> de mensagens dentro da <div> container.
        this.container.appendChild(couponContainer); //injeta o container completo no elemento raiz da classe popup-container
    }

    private renderCallToActionContent(config: CallToActionPopupConfig): void {
        const button = document.createElement("button");
        button.classList.add("popup-button");
        button.textContent = config.buttonText;
        button.addEventListener("click", () => {
            window.location.href = config.redirectUrl; // Redireciona o usuário para a URL definida em config.redirectUrl.
            this.hide(); //chama o método hide para fecha o popup.
        });
        this.container.appendChild(button);
    }

    renderLeadCaptureContent(): void {
        console.log("renderLeadCaptureContent");
    }

    renderFeedbackContent(): void {
        console.log("renderFeedbackContent");
    }
}   