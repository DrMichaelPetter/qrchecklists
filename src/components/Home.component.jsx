import { BsClipboardPlusFill } from "react-icons/bs";
import { FaHashtag, FaHiking } from "react-icons/fa";
import styles from 'styles/Home.module.css';
import { Link } from 'react-router-dom';
import useOnlineStatus from 'components/OnlineStatus.component';
import { MdOutlineSignalWifi4Bar } from "react-icons/md";

const Home = () => {
    const isOnline = useOnlineStatus();
    return (
        <div className={styles.content}>
            <img className={styles.logo} src={process.env.PUBLIC_URL + '/logo.svg'} alt="logo" />
            <h1 className={styles.title}>Ferienakademie Checkpoint Checker</h1>
            <div className={styles.contentItem}>
                <Link to="/newcheckpoint" state={{ prev: "all"}}><BsClipboardPlusFill className={styles.megaicon}/>Start Fresh</Link>
            </div>
            {  isOnline &&
                <>
                <div className={styles.contentItem}><Link to="/cloud"><FaHashtag className={styles.megaicon}/> Manage Checkpoint Subscriptions</Link></div>
                <div className={styles.information}><MdOutlineSignalWifi4Bar className={styles.megaicon}/>online mode</div>
                </>
            }
            {  !isOnline &&
                <div className={styles.information}><FaHiking className={styles.megaicon}/>offline mode</div>
            }
        </div>
    );
}

export default Home;