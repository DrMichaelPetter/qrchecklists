import { FaPlusCircle } from 'react-icons/fa';
import { useState } from 'react';
import { MdCancel } from 'react-icons/md';
import { FaCheckCircle } from "react-icons/fa";
import styles from 'styles/InstaName.module.css';
const InstaName = ({branchOff,pred}) => {
    const [input,setInput] = useState(false);
    const [name,setName] = useState("");
    const handleName = (e) => {
        setName(e.target.value);
    }
    const finalize = () => {
        branchOff(name,pred);
        setInput((myin)=>false);
    }
    return (
        <>
        <div className={styles.instaName}>
        {!input && <FaPlusCircle className={styles.add} onClick={()=> setInput((myin)=>true)} />}
        {input && <>
                <input className={styles.namefield} type="text" placeholder="MyCheckmarks" onKeyDown={(e)=>{ if (e.key==='Enter') finalize();}} onChange={handleName} />
                <MdCancel className={styles.cancel} onClick={()=> setInput((myin)=>false)} />
                <FaCheckCircle className={styles.commit} onClick={finalize} />
            </>
        }
        </div>
        </>
    );
}
export default InstaName;