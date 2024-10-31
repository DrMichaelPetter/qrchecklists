import styles from 'styles/PersonItem.module.css'
import { IconContext } from 'react-icons';
import { BsPlusCircleFill, BsHouse, BsMortarboard, BsFillXCircleFill } from 'react-icons/bs';
//import { BsXSquareFill, BsPerson } from 'react-icons/bs';

const PersonItem = ({itemProp, handleChange}) => {
    const person = itemProp;  
    return (
        <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
        <li className={styles.item} style={itemProp.checked ? { background: 'var(--checkmarks-highlightgreen)'}: {}}>
            
            { (!itemProp.checked) ? <button className={styles.leftbutton} onClick={() => handleChange(person.key)}><BsPlusCircleFill /></button> : <></>}
            <div className={styles.metadata}><BsHouse />{person.hof[0]}</div> <div className={styles.metadata}><BsMortarboard />{person.kurs}</div> <div className={styles.metadata}>{person.name}</div>
            { (itemProp.checked) ? <button className={styles.rightbutton} onClick={() => handleChange(person.key)}><BsFillXCircleFill /></button> : <></>}
        </li>
        </IconContext.Provider>
    );
}
export default PersonItem;