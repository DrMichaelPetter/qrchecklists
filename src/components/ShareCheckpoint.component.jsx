import { useState } from "react";
import { BsShare } from "react-icons/bs";
import { FaCheckCircle, FaHashtag, FaTimesCircle } from "react-icons/fa";
import { VscChecklist } from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router-dom";
import styles from 'styles/Home.module.css';

const ShareCheckpoint = ({ lists,share }) => {
    var [tag, setTag] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const handleCName = (e) => {
        setTag(e.target.value);
    }
    const finalizeCName = () => {
        share(tag,location.state.prev);
        navigate("/checkpoint");
    }
    const cancel = () => {
        window.history.back();
    }
    return (<div className={styles.content}>
    <h1 className={styles.title}>Share Checkpoint based on <VscChecklist  className={styles.icon} /> {lists[location.state.prev].name}</h1>
    <div className={styles.contentItem} >
        <BsShare className={styles.megaicon} />
        <div className={styles.maxedout}><FaHashtag className={styles.hashicon}/><input autoFocus onChange={handleCName} className={styles.input} type="text" placeholder="Flashy Tag" onKeyDown={(e)=>{ if (e.key==='Enter') finalizeCName();}} ></input></div>
        <FaCheckCircle className={styles.commit} onClick={finalizeCName} /><FaTimesCircle className={styles.cancel} onClick={()=>cancel()}/>
    </div>
    </div>);
}
export default ShareCheckpoint;