import styles from 'styles/RegisterPerson.module.css';
import {BsQrCodeScan} from 'react-icons/bs';
import QRScanner from 'components/QRScanner';
import { useState } from 'react';

const RegisterPerson = ( { handleChange , people, settings, isCurrent, showNotice, showError}) => {
    const [qractive,toggleQR] = useState(false);
    const [cameraError,setCameraError] = useState(null);

    const openScanner = () => {
        setCameraError(null);
        toggleQR(true);
    };

    const handleScanError = () => {
        setCameraError("Camera unavailable. Close other camera apps or check browser permissions, then tap to retry.");
    };

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
        const messages = qrCodeMessage.split(";");
        if (messages[0] === settings.qrprefix) {
            const scannedID = parseInt(messages[1]);
            const person = people.find((person) => person.intPersonID === scannedID);
            if (!person) {
                console.log("unknown person id " + scannedID);
                showError("Unknown participant");
                beep(330,190,25);
                toggleQR(false);
                return;
            }
            const wasChecked = isCurrent(person.key);
            if (wasChecked && !window.confirm("Unregister " + (messages[2] ?? person.name) + " ?")){
                beep(330,190,25);
                return;
            }
            handleChange(scannedID);
            beep(880,190,25);
            showNotice(`${wasChecked ? "Unregistered" : "Checked"} ${messages[2] ?? person.name}`);
            toggleQR(false);

        } else {
            console.log("unrecognized strange QR code " + qrCodeMessage);
            showError("Unrecognized QR code");
            beep(330,190,25);
            toggleQR(false);
        }
    };


    return (
        <>
        {qractive ? <QRScanner 
        fps={10}
        qrbox={250}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}
        toggleQR={toggleQR} 
        onScanError={handleScanError}
        showError={showError}
        //aspectRatio={1.0}
        /> : <>
        {cameraError && <p className={styles.scanerror}>{cameraError}</p>}
        <button className={styles.scanbutton} onClick={openScanner}><BsQrCodeScan /></button>
        </>}
        </>
    );
    //size: '180px'
}
export default RegisterPerson;