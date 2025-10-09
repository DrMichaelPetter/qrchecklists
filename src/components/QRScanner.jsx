import styles from 'styles/QRScanner.module.css';
import { Html5Qrcode , Html5QrcodeSupportedFormats} from 'html5-qrcode';
import { ImCross } from "react-icons/im";
import { useEffect, useState } from 'react';
import { IoIosFlashlight } from 'react-icons/io';
import { PiMagnifyingGlassDuotone } from 'react-icons/pi';

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
    var html5QrCode = null;
    useEffect(() => {
        // when component mounts
        const config = createConfig(props);
        const verbose = props.verbose === true;
        // Suceess callback is required.
        if (!(props.qrCodeSuccessCallback)) {
            throw new Error("qrCodeSuccessCallback is required callback.");
        }
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                //const cameraId = devices[0].id;
                let configuration = {
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                    verbose: verbose,
                };
                html5QrCode = new Html5Qrcode(qrcodeRegionId,configuration);
                var lastsnap = null;
                html5QrCode.start(
                    //cameraId,
                    { facingMode: "environment" },
                    config,
                    qrCodeMessage => {
                        if (qrCodeMessage === lastsnap) return;
                        lastsnap = qrCodeMessage;
                        props.qrCodeSuccessCallback(qrCodeMessage);
                        props.toggleQR(false);
                       
                    },
                    errorMessage => {
//                        console.log(errorMessage);
                    })
                    .catch(err => {
                        console.log(err);
                    });
                
            }
        });



        return () => {
            html5QrCode.stop().catch(error => {
                console.error("Failed to stop html5QrCode. ", error);
                props.toggleQR(false)
            });
        };


    }, [props]);
    const [oldzoom, setOldZoom] = useState(1);
    const toggleCloseup = () => {
        console.log("toggleCloseup");
        if (html5QrCode) {
            const zoom = html5QrCode.getRunningTrackCameraCapabilities().zoomFeature();
            const value = zoom.value();
            if (value !== null) {
                if (value !== zoom.max()) {
                    console.log("toggle max zoom");
                    zoom.apply(zoom.max());
                    setOldZoom(value);
                } else {
                    console.log("toggle old zoom ", oldzoom);
                    zoom.apply(oldzoom);
                }
            }
        }
    }

    const toggleTorchLight = () => {
        if (html5QrCode) {
            const torch = html5QrCode.getRunningTrackCameraCapabilities().torchFeature();
            if (torch.value() !== null) {
                torch.apply(!torch.value());
            }
        }
    }

    return (
        <div className={styles.container}>
        <div id={qrcodeRegionId} />
        <button className={styles.btn} onClick={()=> props.toggleQR(false)}><ImCross /></button>
        <button className={styles.torch}  onClick={()=> toggleTorchLight()}><IoIosFlashlight /></button>
        <button className={styles.zoom} onClick={()=> toggleCloseup()}><PiMagnifyingGlassDuotone /></button>
        </div>
    );
};

export default QRScanner;