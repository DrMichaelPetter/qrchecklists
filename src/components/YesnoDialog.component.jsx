import styles from 'styles/YesnoDialog.module.css';
import { MdCancel, MdQuestionMark } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
const YesNoDialog = ({onAnswer,text}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const answer = (yes) => {
        let state = location.state;
        let followup = state.followup;
        console.log("Answered: "+yes);
        navigate(followup);
    };

    return (<>
       <div className={styles.modal}>
        <div className={styles.message}>
            <div className={styles.icon}><MdQuestionMark /></div>
            { location.state.text}
        <div className={styles.choice}>
            <button className={styles.yesBtn} onClick={()=>{answer(true);}}><IoCheckmarkCircle /> Yes</button>
            <button className={styles.noBtn}  onClick={()=>{answer(false);}}><MdCancel /> No</button>
        </div>
        </div>
        </div>
    </>)
}

export default YesNoDialog;



