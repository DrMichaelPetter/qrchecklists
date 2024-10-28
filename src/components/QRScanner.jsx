import { Html5Qrcode } from 'html5-qrcode';
import { useEffect } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

// documentation in https://scanapp.org/html5-qrcode-docs/
// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
    let config = {};
    if (props.fps) {
        config.fps = props.fps;
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
};

const QRScanner = (props) => {

    const toggleQR = props.toggleQR;

    useEffect(() => {
        // when component mounts
        const config = createConfig(props);
        const verbose = props.verbose === true;
        // Suceess callback is required.
        if (!(props.qrCodeSuccessCallback)) {
            throw "qrCodeSuccessCallback is required callback.";
        }

        var html5QrCode = null;;

        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                const cameraId = devices[0].id;
                html5QrCode = new Html5Qrcode(qrcodeRegionId,verbose);
                html5QrCode.start(
                    cameraId,
                    config,
                    qrCodeMessage => {
                        props.qrCodeSuccessCallback(qrCodeMessage);
                        toggleQR(false);
                    },
                    errorMessage => {
                        console.log(errorMessage);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        });

        return () => {
            html5QrCode.stop().catch(error => {
                console.error("Failed to stop html5QrCode. ", error);
                toggleQR(false)
            });
        };

//        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
//        html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);
//        // cleanup function when component will unmount
//        return () => {
//            html5QrcodeScanner.clear().catch(error => {
//                console.error("Failed to clear html5QrcodeScanner. ", error);
//            });
//        };
    }, []);

    return (
        <div id={qrcodeRegionId} />
    );
};

export default QRScanner;