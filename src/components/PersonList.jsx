import PersonItem from 'components/PersonItem';

const PersonList = ({personProps, handleChange }) => {
    return (
        <ul>{
            personProps.map((person) => (
                <PersonItem key={person.key} itemProp={person} handleChange={handleChange} />
            ))
        }</ul>
    );
}
export default PersonList;