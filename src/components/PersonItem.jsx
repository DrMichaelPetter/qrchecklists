const PersonItem = ({itemProp, setPeople}) => {
    const person = itemProp;  
    const handleChange = (key) => {
        setPeople(prevPeople => {
            return prevPeople.map(person => {
                if (person.key === key) {
                    return {
                        ...person,
                        checked: !person.checked
                    };
                }
                return person;
            });
        })};
    return (
        <li><input type="checkbox" checked={itemProp.checked} onChange={()=> handleChange(person.key)} /> {person.name} ({person.hof[0]}, K{person.kurs})</li>
    );
}
export default PersonItem;