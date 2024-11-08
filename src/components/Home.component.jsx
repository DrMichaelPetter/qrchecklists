import { BsClipboardPlusFill } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa";
import styles from 'styles/Home.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
    const [inputcheckpoint,setInputcheckpoint] = useState(false);
    const [name,setName] = useState("");
    const handleCName = (e) => {
        setName(e.target.value);
    }
    const finalizeCName = () => {
    }
    return (
        <div className={styles.content}>
            <img className={styles.logo} src={process.env.PUBLIC_URL + '/logo.svg'} alt="logo" />
            <h1 className={styles.title}>Ferienakademie Checkpoint Checker</h1>
            <div className={styles.contentItem}>
                <Link to="/newcheckpoint" state={{ prev: "all"}}><BsClipboardPlusFill className={styles.megaicon}/>Start Fresh</Link>
                </div>

            <div className={styles.contentItem} onClick={()=>alert("[PLACEHOLDER] Here, we would start a dialog to select a Server-based checkpoint by its tag")}><FaHashtag className={styles.megaicon}/> Retrieve from Cloud</div>
        </div>
    );
}

export default Home;