import { useCallback } from 'react';

export const useVoiceNotification = () => {
    const speak = useCallback((text, lang = 'vi-VN') => {
        // Check if speech synthesis is supported
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 1.0; // Normal speed
            utterance.pitch = 1.0; // Normal pitch
            utterance.volume = 1.0; // Maximum volume

            // Add a small delay to ensure previous speech is cancelled
            setTimeout(() => {
                window.speechSynthesis.speak(utterance);
            }, 100);
        } else {
            console.warn('Text-to-speech is not supported in this browser');
        }
    }, []);

    // Replace placeholders in template with actual values
    const replacePlaceholders = useCallback((template, placeholders) => {
        let message = template;
        Object.keys(placeholders).forEach(key => {
            const placeholder = `{${key}}`;
            message = message.replace(new RegExp(placeholder, 'g'), placeholders[key]);
        });
        return message;
    }, []);

    const announceMoneySent = useCallback((amount, currencySymbol = '₫', options = {}) => {
        const formattedAmount = amount.toLocaleString('vi-VN');
        const {
            template = 'Đã chuyển {amount} {currency}',
            receiver = '',
            sender = ''
        } = options;

        const message = replacePlaceholders(template, {
            amount: formattedAmount,
            currency: currencySymbol,
            receiver: receiver,
            sender: sender
        });

        speak(message);
    }, [speak, replacePlaceholders]);

    const announceMoneyReceived = useCallback((amount, currencySymbol = '₫', options = {}) => {
        const formattedAmount = amount.toLocaleString('vi-VN');
        const {
            template = 'Đã nhận {amount} {currency}',
            receiver = '',
            sender = ''
        } = options;

        const message = replacePlaceholders(template, {
            amount: formattedAmount,
            currency: currencySymbol,
            receiver: receiver,
            sender: sender
        });

        speak(message);
    }, [speak, replacePlaceholders]);

    return {
        speak,
        announceMoneySent,
        announceMoneyReceived
    };
};
