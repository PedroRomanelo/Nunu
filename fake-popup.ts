import { BasePopupConfig, CouponPopupConfig, CallToActionPopupConfig, LeadCapturePopupConfig, FeedbackPopupConfig, FeedbackType, FeedbackData, LeadData } from './types';

export class Popup {
  private config: BasePopupConfig;
  private overlay: HTMLElement;
  private container: HTMLElement;
  private closeButton: HTMLElement;

  constructor(config: BasePopupConfig) {
    this.config = config;
    this.overlay = this.createOverlay();
    this.container = this.createContainer();
    this.closeButton = this.createCloseButton();

    this.container.appendChild(this.closeButton);
    this.renderContent();
    this.overlay.appendChild(this.container);
    document.body.appendChild(this.overlay);

    this.attachEventListeners();
  }

  private createOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.classList.add('popup-overlay');
    return overlay;
  }

  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('popup-container');
    if (this.config.position) {
      container.classList.add(`position-${this.config.position}`);
    }
    return container;
  }

  private createCloseButton(): HTMLElement {
    const button = document.createElement('button');
    button.classList.add('popup-close-button');
    button.innerHTML = '&times;'; // Símbolo 'x'
    return button;
  }

  private attachEventListeners(): void {
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

  private renderContent(): void {
    this.container.innerHTML = ''; // Limpa conteúdo anterior
    this.container.appendChild(this.closeButton); // Adiciona o botão de fechar novamente

    // Imagem (obrigatória)
    const img = document.createElement('img');
    img.src = this.config.imageUrl;
    img.classList.add('popup-image');
    this.container.appendChild(img);

    // Título
    const title = document.createElement('h2');
    title.classList.add('popup-title');
    title.textContent = this.config.title;
    this.container.appendChild(title);

    // Texto (opcional)
    if (this.config.text) {
      const text = document.createElement('p');
      text.classList.add('popup-text');
      text.textContent = this.config.text;
      this.container.appendChild(text);
    }

    // Renderiza o conteúdo específico do tipo de pop-up
    switch (this.config.type) {
      case 'coupon':
        this.renderCouponContent(this.config as CouponPopupConfig);
        break;
      case 'call-to-action':
        this.renderCallToActionContent(this.config as CallToActionPopupConfig);
        break;
      case 'lead-capture':
        this.renderLeadCaptureContent(this.config as LeadCapturePopupConfig);
        break;
      case 'feedback':
        this.renderFeedbackContent(this.config as FeedbackPopupConfig);
        break;
    }
  }

  private renderCouponContent(config: CouponPopupConfig): void {
    const couponContainer = document.createElement('div');
    couponContainer.classList.add('coupon-container');

    const couponCodeDisplay = document.createElement('input');
    couponCodeDisplay.type = 'text';
    couponCodeDisplay.value = config.couponCode;
    couponCodeDisplay.readOnly = true;
    couponCodeDisplay.classList.add('coupon-code-display');

    const copyButton = document.createElement('button');
    copyButton.classList.add('popup-button', 'copy-coupon-button');
    copyButton.textContent = 'Copiar Cupom';

    const message = document.createElement('span');
    message.classList.add('copy-message');

    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(config.couponCode).then(() => {
        message.textContent = 'Copiado!';
        setTimeout(() => message.textContent = '', 2000);
      }).catch(err => {
        console.error('Falha ao copiar cupom:', err);
        message.textContent = 'Erro ao copiar.';
      });
    });

    couponContainer.appendChild(couponCodeDisplay);
    couponContainer.appendChild(copyButton);
    couponContainer.appendChild(message);
    this.container.appendChild(couponContainer);
  }

  private renderCallToActionContent(config: CallToActionPopupConfig): void {
    const button = document.createElement('button');
    button.classList.add('popup-button');
    button.textContent = config.buttonText;
    button.addEventListener('click', () => {
      window.location.href = config.redirectUrl;
      this.hide();
    });
    this.container.appendChild(button);
  }

  private renderLeadCaptureContent(config: LeadCapturePopupConfig): void {
    const form = document.createElement('form');
    form.classList.add('lead-capture-form');

    if (config.fields.name) {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'name';
      input.placeholder = 'Seu Nome';
      input.classList.add('form-input');
      form.appendChild(input);
    }
    if (config.fields.email) {
      const input = document.createElement('input');
      input.type = 'email';
      input.name = 'email';
      input.placeholder = 'Seu E-mail';
      input.required = true;
      input.classList.add('form-input');
      form.appendChild(input);
    }
    if (config.fields.phone) {
      const input = document.createElement('input');
      input.type = 'tel';
      input.name = 'phone';
      input.placeholder = 'Seu Telefone/WhatsApp';
      input.classList.add('form-input');
      form.appendChild(input);
    }

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.classList.add('popup-button');
    submitButton.textContent = config.buttonText || 'Enviar';
    form.appendChild(submitButton);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData: LeadData = {};
      if (config.fields.name) formData.name = (form.elements.namedItem('name') as HTMLInputElement)?.value;
      if (config.fields.email) formData.email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
      if (config.fields.phone) formData.phone = (form.elements.namedItem('phone') as HTMLInputElement)?.value;

      config.onSubmit?.(formData);
      this.hide();
    });

    this.container.appendChild(form);
  }

  private renderFeedbackContent(config: FeedbackPopupConfig): void {
    const feedbackContainer = document.createElement('div');
    feedbackContainer.classList.add('feedback-container');

    switch (config.feedbackType) {
      case 'stars':
        for (let i = 1; i <= 5; i++) {
          const star = document.createElement('span');
          star.classList.add('feedback-star');
          star.innerHTML = '&#9733;'; // Estrela vazia
          star.dataset.value = i.toString();
          star.addEventListener('click', () => {
            config.onSubmit?.({ type: 'stars', value: i } as FeedbackData);
            this.hide();
          });
          feedbackContainer.appendChild(star);
        }
        break;
      case 'emoji':
        const emojis = ['😠', '😐', '😊']; // Pode ser configurável no futuro
        emojis.forEach(emoji => {
          const emojiBtn = document.createElement('button');
          emojiBtn.classList.add('feedback-emoji');
          emojiBtn.textContent = emoji;
          emojiBtn.addEventListener('click', () => {
            config.onSubmit?.({ type: 'emoji', value: emoji } as FeedbackData);
            this.hide();
          });
          feedbackContainer.appendChild(emojiBtn);
        });
        break;
      case 'thumbs':
        const thumbs = ['👍', '👎'];
        thumbs.forEach(thumb => {
          const thumbBtn = document.createElement('button');
          thumbBtn.classList.add('feedback-thumb');
          thumbBtn.textContent = thumb;
          thumbBtn.addEventListener('click', () => {
            config.onSubmit?.({ type: 'thumbs', value: thumb } as FeedbackData);
            this.hide();
          });
          feedbackContainer.appendChild(thumbBtn);
        });
        break;
    }
    this.container.appendChild(feedbackContainer);
  }

  public show(): void {
    this.overlay.classList.add('active');
  }

  public hide(): void {
    this.overlay.classList.remove('active');
    // Remove o pop-up do DOM após a transição para evitar acúmulo
    this.overlay.addEventListener('transitionend', () => {
      if (!this.overlay.classList.contains('active')) {
        this.overlay.remove();
        this.config.onClose?.();
      }
    }, { once: true });
  }
}


