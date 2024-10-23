const PersonItem = ({itemProp, handleChange}) => {
    const person = itemProp;  
    return (
        <li><input 
            type="checkbox" 
            checked={itemProp.checked} 
            onChange={()=> handleChange(person.key)}/> {person.name} ({person.hof[0]}, K{person.kurs})
        </li>
    );
}
export default PersonItem;