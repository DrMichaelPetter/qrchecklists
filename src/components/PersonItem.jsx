import {BsPersonDash} from 'react-icons/bs';
import {BsPersonAdd}  from 'react-icons/bs';
import { BsHouse } from 'react-icons/bs';
import { BsMortarboardFill } from 'react-icons/bs';
import { BsPerson } from 'react-icons/bs';

const PersonItem = ({itemProp, handleChange}) => {
    const person = itemProp;  
    return (
        <li>
            { (!itemProp.checked) ? <button onClick={() => handleChange(person.key)}><BsPersonAdd /></button> : <></>}
            <div><BsHouse/>{person.hof[0]}</div> <div><BsMortarboardFill />{person.kurs}</div> <div><BsPerson />{person.name}</div>
            { (itemProp.checked) ? <button onClick={() => handleChange(person.key)}><BsPersonDash /></button> : <></>}
        </li>
    );
}
export default PersonItem;