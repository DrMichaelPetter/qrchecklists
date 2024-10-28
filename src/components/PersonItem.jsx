import styles from 'styles/PersonItem.module.css'
import {BsPersonDash} from 'react-icons/bs';
import {BsPersonAdd}  from 'react-icons/bs';
import { BsHouse } from 'react-icons/bs';
import { BsMortarboardFill } from 'react-icons/bs';
import { BsPerson } from 'react-icons/bs';

const PersonItem = ({itemProp, handleChange}) => {
    const person = itemProp;  
    return (
        <li className={styles.item}>
            { (!itemProp.checked) ? <button className={styles.leftbutton} onClick={() => handleChange(person.key)}><BsPersonAdd /></button> : <></>}
            <div className={styles.metadata}><BsHouse/>{person.hof[0]}</div> <div className={styles.metadata}><BsMortarboardFill />{person.kurs}</div> <div className={styles.metadata}><BsPerson />{person.name}</div>
            { (itemProp.checked) ? <button className={styles.rightbutton} onClick={() => handleChange(person.key)}><BsPersonDash /></button> : <></>}
        </li>
    );
}
export default PersonItem;