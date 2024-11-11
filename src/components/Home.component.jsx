import { BsClipboardPlusFill } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa";
import styles from 'styles/Home.module.css';
import { Link } from 'react-router-dom';
import useOnlineStatus from 'components/OnlineStatus.component';
import { MdOutlineAirplanemodeActive, MdOutlineSignalWifi4Bar } from "react-icons/md";

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
                <div className={styles.contentItem} onClick={()=>alert("[PLACEHOLDER] Here, we would start a dialog to select a Server-based checkpoint by its tag")}><FaHashtag className={styles.megaicon}/> Retrieve from Cloud</div>
                <div className={styles.information}><MdOutlineSignalWifi4Bar className={styles.megaicon}/>online mode</div>
                </>
            }
            {  !isOnline &&
                <div className={styles.information}><MdOutlineAirplanemodeActive className={styles.megaicon}/>offline mode</div>
            }
        </div>
    );
}

export default Home;