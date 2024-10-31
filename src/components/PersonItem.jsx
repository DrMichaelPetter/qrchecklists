import styles from 'styles/PersonItem.module.css'
import { IconContext } from 'react-icons';
import { BsXSquareFill} from 'react-icons/bs';
import { BsPlusCircleFill}  from 'react-icons/bs';
import { BsHouse } from 'react-icons/bs';
import { BsMortarboard } from 'react-icons/bs';
import { BsPerson } from 'react-icons/bs';

const PersonItem = ({itemProp, handleChange}) => {
    const person = itemProp;  
    return (
        <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
        <li className={styles.item} style={itemProp.checked ? { background: 'var(--checkmarks-highlightgreen)'}: {}}>
            
            { (!itemProp.checked) ? <button className={styles.leftbutton} onClick={() => handleChange(person.key)}><BsPlusCircleFill /></button> : <></>}
            <div className={styles.metadata}><BsHouse />{person.hof[0]}</div> <div className={styles.metadata}><BsMortarboard />{person.kurs}</div> <div className={styles.metadata}>{person.name}</div>
            { (itemProp.checked) ? <button className={styles.rightbutton} onClick={() => handleChange(person.key)}><BsXSquareFill /></button> : <></>}
        </li>
        </IconContext.Provider>
    );
}
export default PersonItem;