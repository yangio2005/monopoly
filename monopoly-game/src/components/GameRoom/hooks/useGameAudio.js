import { useState } from 'react';
import { Howl } from 'howler';

export const useGameAudio = () => {
    const [transferSound] = useState(new Howl({ src: ['/coin.mp3'] }));
    const [clickSound] = useState(new Howl({ src: ['/click.mp3'] }));
    const [moneyReceivedSound] = useState(new Howl({
        src: ['/money_received.mp3'],
        onload: () => console.log('money_received.mp3 loaded successfully!'),
        onloaderror: (id, err) => console.error('Error loading money_received.mp3:', id, err),
        onplayerror: (id, err) => console.error('Error playing money_received.mp3:', id, err),
    }));

    return {
        transferSound,
        clickSound,
        moneyReceivedSound
    };
};
