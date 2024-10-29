import styles from 'styles/PersonList.module.css';
import PersonItem from 'components/PersonItem';
import StatsItem from 'components/StatsItem';

const PersonList = ({personProps, handleChange }) => {
    return (
        <ul className={styles.personbox}>{
            <StatsItem itemProp={personProps} />
        }
        {
            personProps.map((person) => (
                <PersonItem key={person.key} itemProp={person} handleChange={handleChange} />
            ))
        }</ul>
    );
}
export default PersonList;