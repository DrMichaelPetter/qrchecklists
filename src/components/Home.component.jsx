import { BsClipboardPlusFill } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa";
import styles from 'styles/Home.module.css';
import { useState } from 'react';
import { FaCheckCircle } from "react-icons/fa";
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
            <div className={styles.contentItem} onClick={()=> setInputcheckpoint((myin)=>true)} >
                {!inputcheckpoint &&<><BsClipboardPlusFill className={styles.megaicon}/>Start Fresh</>}
                { inputcheckpoint && <><input autofocus onChange={handleCName} className={styles.input} type="text" placeholder="Super Checkpoint"  ></input><FaCheckCircle className={styles.commit} onClick={finalizeCName} /></>}
                </div>

            <div className={styles.contentItem}><FaHashtag className={styles.megaicon}/> Retrieve from Cloud</div>
        </div>
    );
}

export default Home;