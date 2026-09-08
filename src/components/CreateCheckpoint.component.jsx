import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import  { LuCaptions } from "react-icons/lu";
import styles from 'styles/Home.module.css';
import { VscChecklist } from 'react-icons/vsc';
const CreateCheckpoint = ({lists,createCheckpoint,switchTo,showNotice,showError}) => {
    const [name, setName] = useState("");
    const handleCName = (e) => {
        setName(e.target.value);
    }
    const navigate  = useNavigate();
    const location = useLocation();
    const finalizeCName = () => {
        if (!name || !name.trim()) { showError("Name required"); return; }
        const prev = location.state.prev;
        const ncheck = createCheckpoint(name, prev);
        switchTo(ncheck);
        showNotice(`Created "${name}"`);
        navigate("/checkpoint");
    }
    const cancel = () => {
        window.history.back();
    }
    return (
        <div className={styles.content}>
            <h1 className={styles.title}>Derive New Checkpoint from <VscChecklist  className={styles.icon} /> {lists[location.state.prev].name}</h1>
            <div className={styles.contentItem} >
                <LuCaptions className={styles.megaicon} />
                <input autoFocus onChange={handleCName} className={styles.input} type="text" placeholder="Fancy Name" onKeyDown={(e)=>{ if (e.key==='Enter') finalizeCName();}} ></input>
                <FaCheckCircle className={styles.commit} onClick={finalizeCName} /><FaTimesCircle className={styles.cancel} onClick={()=>cancel()}/>
                </div>
        </div>
    );
}
export default CreateCheckpoint;