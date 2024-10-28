import styles from 'styles/RegisterPerson.module.css';
import { IconContext } from 'react-icons';
import {BsQrCodeScan} from 'react-icons/bs';
import QRScanner from 'components/QRScanner';
import { useState } from 'react';

const RegisterPerson = ( { handleChange }) => {

    const [qractive,toggleQR] = useState(false);

    const beep = (freq = 440, duration= 90, vol=50) => {
        var context = new (window.AudioContext || window.webkitAudioContext)();
        var oscillator = context.createOscillator();
        var gain = context.createGain();
        gain.gain.setValueAtTime(0,context.currentTime);
        gain.gain.linearRampToValueAtTime(vol/100,context.currentTime + 0.002);
        oscillator.connect(gain);
        oscillator.frequency.value = freq;
        oscillator.type = "square";
        gain.connect(context.destination);
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + (duration / 1000));
        oscillator.onended = () => {
            context.close();
        };
    }
    const onNewScanResult = (qrCodeMessage) => {
        const messages = qrCodeMessage = qrCodeMessage.split(";");
        if (messages[0] === "FA25") {
            const key = parseInt(messages[1]);
            handleChange(key);
            beep(440,190,25);
            beep(660,50,25);
        } else {
            console.log("unrecognized strange QR code " + qrCodeMessage);
            beep(660,50,25);
            beep(880,250,25);
            beep(440,250,25);
        }
    };

    return (
        qractive ? <QRScanner 
        fps={10}
        qrbox={250}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
        toggleQR={toggleQR} 
        aspectRatio={1}
        /> : <IconContext.Provider value={{size: '300px'}}><button className={styles.scanbutton} onClick={()=> toggleQR((prev)=> true)}><BsQrCodeScan /></button></IconContext.Provider>
    );
}
export default RegisterPerson;