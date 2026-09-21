import styles from 'styles/QRScanner.module.css';
import { Html5Qrcode , Html5QrcodeSupportedFormats} from 'html5-qrcode';
import { ImCross } from "react-icons/im";
import { useEffect, useRef, useState } from 'react';
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
    if (props.showTorchButtonIfSupported !== undefined) {
        config.showTorchButtonIfSupported = props.showTorchButtonIfSupported;
    } else {
        config.showTorchButtonIfSupported = true;
    }
    return config;
};

const QRScanner = (props) => {
    const html5QrCodeRef = useRef(null);
    useEffect(() => {
        // when component mounts
        let cancelled = false;
        const config = createConfig(props);
        const verbose = props.verbose === true;
        // Suceess callback is required.
        if (!(props.qrCodeSuccessCallback)) {
            throw new Error("qrCodeSuccessCallback is required callback.");
        }
        const failAndClose = (err) => {
            console.error("QRScanner failed to start camera. ", err);
            if (props.showError) props.showError("Could not start the camera.");
            if (props.onScanError) props.onScanError(err);
            props.toggleQR(false);
        };
        Html5Qrcode.getCameras().then(devices => {
            // component unmounted before the camera list arrived
            if (cancelled) return;
            if (!(devices && devices.length)) {
                failAndClose(new Error("No camera available"));
                return;
            }
            //const cameraId = devices[0].id;
            let configuration = {
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                verbose: verbose,
            };
            const html5QrCode = new Html5Qrcode(qrcodeRegionId,configuration);
            html5QrCodeRef.current = html5QrCode;
            var lastsnap = null;
            return html5QrCode.start(
                //cameraId,
                { facingMode: "environment" },
                config,
                qrCodeMessage => {
                    if (qrCodeMessage === lastsnap) return;
                    lastsnap = qrCodeMessage;
                    try {
                        props.qrCodeSuccessCallback(qrCodeMessage);
                    } catch (callbackError) {
                        console.error("qrCodeSuccessCallback threw. ", callbackError);
                        if (props.showError) props.showError("Something went wrong during check-in.");
                    }
                    props.toggleQR(false);
                },
                errorMessage => {
//                    console.log(errorMessage);
                })
                .then(() => {
                    // camera opened only after unmount: release the stream at once
                    if (cancelled) {
                        html5QrCode.stop().catch(() => {});
                    }
                })
                .catch(err => {
                    if (!cancelled) failAndClose(err);
                });
        }).catch(err => {
            if (!cancelled) failAndClose(err);
        });

        return () => {
            cancelled = true;
            const html5QrCode = html5QrCodeRef.current;
            html5QrCodeRef.current = null;
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(error => {
                    console.error("Failed to stop html5QrCode. ", error);
                    if (props.showError) props.showError("Failed to release the camera.");
                });
            }
        };


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [oldzoom, setOldZoom] = useState(1);
    const toggleCloseup = () => {
        console.log("toggleCloseup");
        if (html5QrCodeRef.current) {
            const zoom = html5QrCodeRef.current.getRunningTrackCameraCapabilities().zoomFeature();
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
        if (html5QrCodeRef.current) {
            const torch = html5QrCodeRef.current.getRunningTrackCameraCapabilities().torchFeature();
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