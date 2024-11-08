import styles from 'styles/PersonItem.module.css'
import { IconContext } from 'react-icons';
import { BsPlusCircleFill, BsFillXCircleFill } from 'react-icons/bs';
import HofSymbol from 'components/HofSymbol';
import KursSymbol from 'components/KursSymbol';
//import { BsXSquareFill, BsPerson } from 'react-icons/bs';

const PersonItem = ({itemProp, handleChange, isCurrent}) => {
    const person = itemProp;  
    return (
        <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
        <li className={styles.item} style={isCurrent(person.key) ? { background: 'var(--checkmarks-highlightgreen)'}: {}}>
            { (!isCurrent(person.key)) ? <button className={styles.leftbutton} onClick={() => handleChange(person.key)}><BsPlusCircleFill /></button> : <></>}
            <HofSymbol hofkuerzel={person.hof[0]} /><KursSymbol kurskuerzel={person.kurs} /><div className={styles.metadata}>{person.name}</div>
            { (isCurrent(person.key)) ? <button className={styles.rightbutton} onClick={() => handleChange(person.key)}><BsFillXCircleFill /></button> : <></>}
        </li>
        </IconContext.Provider>
    );
}
export default PersonItem;