import styles from 'styles/StatsItem.module.css'
import { BsPerson } from 'react-icons/bs';

const swapCourse = (personen,handleChange, kurs) => {
    let targets = personen.filter((person) => person.kurs+"" === kurs);
    if (window.confirm("Wirklich alle " + targets.length + " Teilnehmer aus K" + kurs + " übertragen ?"))
    console.log("Swpapping ");
    targets.forEach(element => {
            handleChange(element.key);    
        });
};

const hoefe = (personen,handleChange) => {
    if (personen.length === 0) return <></>;
    let hoefe= personen.map((person) => {
        return person.kurs;
    }).sort();
    let hofmap = hoefe.reduce((acc, val) => {
        return ({...acc, [val]:(acc[val]||0)+1});
    },{});
    return Object.keys(hofmap).map((key) => (
        <div className={styles.stat} key={key}>{hofmap[key]}&middot;<div  onClick={()=>swapCourse(personen,handleChange,key)} className={styles.colored}>K{key}</div> </div>)
    );//<BsMortarboardFill />
}
//    <Link to="/yesno" state={{ followup: "/checkpoint", text: "Are you sure, you want to remove K1?"}}>aaaa</Link>
const StatsItem = ({itemProp, handleChange}) => {
    const person = itemProp;  
    return (
        <li  className={styles.item}>
        {person.length}<BsPerson />&ensp; {hoefe(person,handleChange)} 
        </li>
    );
}
export default StatsItem;