import styles from 'styles/YesnoDialog.module.css';
import { MdCancel, MdQuestionMark } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useEffect, useState } from 'react';
const YesNoDialog = ({onAnswer,text}) => {
    const [show, setShow] = useState(true);
    const [yes, setYes] = useState(false);

    useEffect(() => {
            onAnswer(yes);
    }, [show]);

    return (<>
        {show&& <div className={styles.modal}>
        <div className={styles.message}>
            <div className={styles.icon}><MdQuestionMark /></div>
            {text}
        <div className={styles.choice}>
            <button className={styles.choiceBtn} onClick={()=>{setYes((y)=>true) ;setShow(false);}}><IoCheckmarkCircle /> Yes</button>
            <button className={styles.choiceBtn} onClick={()=>{setYes((y)=>false);setShow(false);}}><MdCancel /> No</button>
        </div>
        </div>
        </div>}
    </>)
}

export default YesNoDialog;



