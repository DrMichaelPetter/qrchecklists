import styles from 'styles/RegisterPerson.module.css';
import {BsQrCodeScan} from 'react-icons/bs';
import QRScanner from 'components/QRScanner';
import { useState } from 'react';

const RegisterPerson = ( { handleChange , people, settings }) => {

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
        if (messages[0] === settings.qrprefix) {
            const key = parseInt(messages[1]);
            if (people.filter(person => person.key === key && person.checked===true).length > 0) {
                if (!window.confirm("Unregister " + messages[2] + " ?")){
                    beep(330,190,25);
                    return;
                }
            }
            handleChange(key);
            beep(880,190,25);

        } else {
            console.log("unrecognized strange QR code " + qrCodeMessage);
            beep(330,190,25);
        }
    };

    return (
        qractive ? <QRScanner 
        fps={10}
        qrbox={250}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
        toggleQR={toggleQR} 
        aspectRatio={1.0}
        /> : <button className={styles.scanbutton} onClick={()=> toggleQR((prev)=> true)}><BsQrCodeScan /></button>
    );
    //size: '180px'
}
export default RegisterPerson;