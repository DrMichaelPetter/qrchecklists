import { useEffect, useRef } from "react";
import { FaHashtag } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import styles from 'styles/Home.module.css';
import { api, toBig } from 'services/api';

const SubscribeCheckpoint = ({ settings, subscribeTo, switchTo, findKeyByTag, showError, showNotice }) => {
    const { tag } = useParams();
    const navigate = useNavigate();
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        async function subscribe() {
            try {
                const data = await api(settings.webservice, tag);
                const existing = findKeyByTag(tag);
                if (existing !== null) {
                    switchTo(existing);
                    showNotice(`Already subscribed to #${tag}`);
                } else {
                    subscribeTo(tag, toBig(data.state), toBig(data.prevstate));
                    showNotice(`Subscribed to #${tag}`);
                }
                navigate("/checkpoint");
            } catch (e) {
                showError(e.message);
                navigate("/");
            }
        }
        subscribe();
    }, [settings.webservice, tag, subscribeTo, switchTo, findKeyByTag, showError, showNotice, navigate]);

    return (
        <div className={styles.content}>
            <h1 className={styles.title}>Subscribing to #{tag} <FaHashtag className={styles.icon} /></h1>
            <div className={styles.contentItem}>Just a moment&hellip;</div>
        </div>
    );
}
export default SubscribeCheckpoint;
