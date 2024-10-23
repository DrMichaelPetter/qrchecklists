import PersonItem from 'components/PersonItem';

const PersonList = ({personProps, setPeople }) => {
    return (
        <ul>{
            personProps.map((person) => (
                <PersonItem key={person.key} itemProp={person} setPeople={setPeople} />
            ))
        }</ul>
    );
}
export default PersonList;