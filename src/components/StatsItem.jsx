import styles from 'styles/StatsItem.module.css'
import { BsPerson } from 'react-icons/bs';


const hoefe = (personen) => {
    if (personen.length === 0) return <></>;
    let hoefe= personen.map((person) => {
        return person.kurs;
    }).sort();
    let hofmap = hoefe.reduce((acc, val) => {
        return ({...acc, [val]:(acc[val]||0)+1});
    },{});
    return Object.keys(hofmap).map((key) => (
        <>{hofmap[key]}&middot;<div className={styles.colored}>K{key}</div> </>)
    );//<BsMortarboardFill />
}

const StatsItem = ({itemProp}) => {
    const person = itemProp;  
    return (
        <li className={styles.item}>
        {person.length}<BsPerson />&ensp; {hoefe(person)} 
        </li>
    );
}
export default StatsItem;