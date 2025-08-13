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
    title: string;
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

export interface CallToActionPopupConfig extends BasePopupConfig { // interface para popup de call to action
    type: 'call-toaction';
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

export interface FeedbackPopupConfig extends BasePopupConfig { // interface para popup de feedback
    type: 'feedback';
    feedbackType: FeedbackType;
}

//Aqui unimos todos os tipos de configurações
export type PopupConfig = CouponPopupConfig | CallToActionPopupConfig | LeadCapturePopupConfig | FeedbackPopupConfig;

export interface feedbackData { // Interface para dados de feedback

    type: FeedbackType;
    value: number | string  ; // número para stars (1-5), string para emoji/thumbs
}

export interface LeadData { // Interface para dados de lead
    name?: string;
    email?: string;
    phone?: string;
}

export interface PopupLibraryConfig { // interface para configuração da biblioteca de popups
    reapperInterval?: number; //h
    defaultPosition?: PopupPosition;
    theme?:{
        primaryColor: string;
        backgroundColor: string;
        textColor: string;
        borderRadius: string;
    }
}

export interface StorageData { // Interface para dados armazenados no localStorage
    lastShown: number; // timestamp da última vez que o popup foi mostrado
    popupId: string; // id do popup
}