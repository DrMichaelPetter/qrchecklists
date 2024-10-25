const PersonItem = ({itemProp, handleChange}) => {
    const person = itemProp;  
    return (
        <li><input 
            type="checkbox" 
            checked={itemProp.checked} 
            onChange={()=> handleChange(person.key)}/> ({person.hof[0]}, K{person.kurs}) {person.name} 
        </li>
    );
}
export default PersonItem;