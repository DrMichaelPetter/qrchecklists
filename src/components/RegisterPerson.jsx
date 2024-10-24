import QRScanner from 'components/QRScanner';

const RegisterPerson = ( { handleChange }) => {
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
        console.log(qrCodeMessage);
        beep(440,190,25);
        beep(660,50,25);
    };
    return (
        <div><QRScanner 
        fps={10}
        qrbox={250}
        disableFlip={false}
        qrCodeSuccessCallback={onNewScanResult}/>
        <button>Scan</button></div>
    );
}
export default RegisterPerson;