import { FaPlusCircle } from 'react-icons/fa';
import { FcCheckmark } from "react-icons/fc";
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
    return (
        <>
        <div className={styles.instaName}>
        {!input && <FaPlusCircle className={styles.add} onClick={()=> setInput((myin)=>true)} />}
        {input && <>
                <input className={styles.namefield} type="text" placeholder="MyCheckmarks" onChange={handleName} />
                <MdCancel className={styles.cancel} onClick={()=> setInput((myin)=>false)} />
                <FaCheckCircle className={styles.commit} onClick={()=>{branchOff(name,pred);setInput((myin)=>false)}} />
            </>
        }
        </div>
        </>
    );
}
export default InstaName;