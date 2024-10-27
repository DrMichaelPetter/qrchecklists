import {BsPersonDash} from 'react-icons/bs';
import {BsPersonAdd}  from 'react-icons/bs';

const PersonItem = ({itemProp, handleChange}) => {
    const person = itemProp;  
    return (
        <li>
            { (!itemProp.checked) ? <button onClick={() => handleChange(person.key)}><BsPersonAdd /></button> : <></>}
            ({person.hof[0]}, K{person.kurs}) {person.name} 
         { (itemProp.checked) ? <button onClick={() => handleChange(person.key)}><BsPersonDash /></button> : <></>}
        </li>
    );
}
export default PersonItem;