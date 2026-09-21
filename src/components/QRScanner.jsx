import styles from 'styles/QRScanner.module.css';
import jsQR from 'jsqr';
import { ImCross } from "react-icons/im";
import { useEffect, useRef, useState } from 'react';
import { IoIosFlashlight } from 'react-icons/io';
import { PiMagnifyingGlassDuotone } from 'react-icons/pi';

const QRScanner = (props) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const loopRef = useRef(null);
    const torchRef = useRef(false);
    const [torchOn, setTorchOn] = useState(false);
    const [torchSupported, setTorchSupported] = useState(false);
    const [zoomSupported, setZoomSupported] = useState(false);
    const [oldzoom, setOldZoom] = useState(1);

    useEffect(() => {
        let cancelled = false;
        let lastSnap = null;
        if (!(props.qrCodeSuccessCallback)) {
            throw new Error("qrCodeSuccessCallback is required callback.");
        }

        const stopStream = () => {
            if (loopRef.current) {
                clearTimeout(loopRef.current);
                loopRef.current = null;
            }
            const stream = streamRef.current;
            streamRef.current = null;
            if (stream) stream.getTracks().forEach(t => t.stop());
            if (videoRef.current) videoRef.current.srcObject = null;
        };

        const failAndClose = (err) => {
            console.error("QRScanner failed to start camera. ", err);
            if (props.showError) props.showError("Could not start the camera.");
            if (props.onScanError) props.onScanError(err);
            props.toggleQR(false);
        };

        const scan = () => {
            if (cancelled) return;
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (video && canvas && video.readyState >= video.HAVE_ENOUGH_DATA && video.videoWidth) {
                const qrbox = props.qrbox || 250;
                const crop = Math.min(qrbox, video.videoWidth, video.videoHeight);
                const sx = Math.round((video.videoWidth - crop) / 2);
                const sy = Math.round((video.videoHeight - crop) / 2);
                canvas.width = crop;
                canvas.height = crop;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(video, sx, sy, crop, crop, 0, 0, crop, crop);
                const imageData = ctx.getImageData(0, 0, crop, crop);
                const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
                if (code && code.data) {
                    const message = code.data;
                    if (message !== lastSnap) {
                        lastSnap = message;
                        try {
                            props.qrCodeSuccessCallback(message);
                        } catch (callbackError) {
                            console.error("qrCodeSuccessCallback threw. ", callbackError);
                            if (props.showError) props.showError("Something went wrong during check-in.");
                        }
                    }
                }
            }
            const fps = props.fps || 10;
            loopRef.current = setTimeout(scan, 1000 / fps);
        };

        const getCamera = (attempt) => {
            return navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                .catch(err => {
                    const retriable = err && (err.name === "NotReadableError" || err.name === "AbortError");
                    if (retriable && !cancelled && attempt < 4) {
                        return new Promise(res => setTimeout(res, 200)).then(() => getCamera(attempt + 1));
                    }
                    throw err;
                });
        };

        getCamera(0)
            .then(stream => {
                if (cancelled) {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }
                streamRef.current = stream;
                const video = videoRef.current;
                video.srcObject = stream;
                return video.play();
            })
            .then(() => {
                if (cancelled) return;
                const track = streamRef.current && streamRef.current.getVideoTracks()[0];
                if (track) {
                    const caps = track.getCapabilities ? track.getCapabilities() : {};
                    setTorchSupported(!!caps.torch);
                    setZoomSupported(!!caps.zoom);
                }
                scan();
            })
            .catch(err => {
                if (!cancelled) failAndClose(err);
            });

        return () => {
            cancelled = true;
            stopStream();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getTrack = () => {
        const stream = streamRef.current;
        return stream && stream.getVideoTracks()[0];
    };

    const toggleTorchLight = () => {
        const track = getTrack();
        if (!track) return;
        const caps = track.getCapabilities ? track.getCapabilities() : {};
        if (!caps.torch) return;
        const next = !torchRef.current;
        track.applyConstraints({ advanced: [{ torch: next }] })
            .then(() => {
                torchRef.current = next;
                setTorchOn(next);
            })
            .catch(err => console.error("Failed to toggle torch. ", err));
    };

    const toggleCloseup = () => {
        const track = getTrack();
        if (!track) return;
        const caps = track.getCapabilities ? track.getCapabilities() : {};
        const zoom = caps.zoom;
        if (!zoom) return;
        const current = (track.getSettings ? track.getSettings().zoom : null);
        if (current == null) return;
        if (current < zoom.max) {
            setOldZoom(current);
            track.applyConstraints({ advanced: [{ zoom: zoom.max }] })
                .catch(err => console.error("Failed to apply zoom. ", err));
        } else {
            track.applyConstraints({ advanced: [{ zoom: oldzoom }] })
                .catch(err => console.error("Failed to apply zoom. ", err));
        }
    };

    return (
        <div className={styles.container}>
            <video ref={videoRef} className={styles.video} muted playsInline autoPlay />
            <div className={styles.scanbox} style={{ width: props.qrbox || 250, height: props.qrbox || 250 }} />
            <canvas ref={canvasRef} className={styles.canvas} />
            <button className={styles.btn} onClick={() => props.toggleQR(false)}><ImCross /></button>
            {torchSupported && <button className={`${styles.torch} ${torchOn ? styles.torchOn : ""}`} onClick={toggleTorchLight}><IoIosFlashlight /></button>}
            {zoomSupported && <button className={styles.zoom} onClick={toggleCloseup}><PiMagnifyingGlassDuotone /></button>}
        </div>
    );
};

export default QRScanner;
