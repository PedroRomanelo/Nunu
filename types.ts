export type PopopType = 'coupon' | 'call-toaction' | 'lead-capture' | 'feedback';  // Tipos de pop-up disponíveis

export type FeedbackType = 'stars' | 'emoji' | 'thumbs';  // Tipos de feedback disponíveis

export type PopupPosition = 'center' | 'bottom-right' | 'bottom-left' | 'top-banner' | 'bottom-banner';  // Posições de pop-up disponíveis

export type TriggerType = 'time' | 'scroll' | 'exit-intent' | 'click' // tipos de gatilho

export interface TriggerConfig { // configuração para o gatilho
    type: TriggerType;

    delay?: number; // ms

    scrollPercentage?: number; // 0-1

    element?: string; // Para trigger 'click' - seletor CSS
}

export interface BasePopupConfig { // interface base todos os popups
    type: PopopType;
    tittle: string;
    text?: string;
    imageUrl: string;
    position?: PopupPosition;
    trigger?: TriggerConfig;
    onSubmit?: (data:any) => void;
    onClose?: () => void;
}

export interface CouponPopupConfig extends BasePopupConfig { // interface para popup de coupon
    type: 'coupon';
    buttonText: string;
    redirectUrl: string;
}

export interface LeadCapturePopupConfig extends BasePopupConfig { // interface para popup de lead capture
    type: 'lead-capture';
    fields: {
        name?: boolean;
        email?: boolean;
        phone?: boolean;
    };
    buttonText?: string;
}

