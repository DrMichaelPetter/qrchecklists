const PersonItem = ({itemProp, setPeople}) => {
    const person = itemProp;  
    return (
        <li><input type="checkbox" checked={itemProp.checked} onChange={()=> console.log("clicked")} /> {person.name} ({person.hof[0]}, K{person.kurs})</li>
    );
}
export default PersonItem;