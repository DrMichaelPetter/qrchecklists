//import QRC from 'https://github.com/mebjas/html5-qrcode/releases/download/v2.3.8/html5-qrcode.min.js';

const RegisterPerson = () => {
//    QRC.HTML5Qrcode.getCameras().then(devices => {
//        if (devices && devices.length) {
//            const cameraId = devices[0].id;
//            const config = { fps: 10, qrbox: 250 };
//            const html5QrCode = new QRC.HTML5Qrcode("reader");
//            html5QrCode.start(
//                cameraId,
//                config,
//                qrCodeMessage => {
//                    console.log(qrCodeMessage);
//                    html5QrCode.stop();
//                },
//                errorMessage => {
//                    console.log(errorMessage);
//                })
//                .catch(err => {
//                    console.log(err);
//                });
//        }
//    });
    return (
        <div><button>Scan</button></div>
    );
}
export default RegisterPerson;