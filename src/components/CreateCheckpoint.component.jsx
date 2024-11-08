import { useState } from 'react';
import { BsClipboardPlusFill } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import styles from 'styles/Home.module.css';
const CreateCheckpoint = ({createCheckpoint,switchTo}) => {
    const [name, setName] = useState("");
    const handleCName = (e) => {
        setName(e.target.value);
    }
    const navigate  = useNavigate();
    const location = useLocation();
    const finalizeCName = () => {
        const prev = location.state.prev;
        const ncheck = createCheckpoint(name, prev);
        switchTo(ncheck);
        navigate("/checkpoint");
    }
    return (
        <div className={styles.content}>
            <h1 className={styles.title}>Create New Checkpoint</h1>
            <div className={styles.contentItem} >
                <input autofocus onChange={handleCName} className={styles.input} type="text" placeholder="New Checkpoint"  ></input>
                <FaCheckCircle className={styles.commit} onClick={finalizeCName} />
                </div>
        </div>
    );
}
export default CreateCheckpoint;