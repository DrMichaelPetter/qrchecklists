import styles from 'styles/PersonList.module.css';
import PersonItem from 'components/PersonItem';
import StatsItem from 'components/StatsItem';

const PersonList = ({personProps, handleChange, isCurrent }) => {
    return (
        <ul className={styles.personbox}>{
            <StatsItem itemProp={personProps} handleChange={handleChange} />
        }
        {
            personProps.map((person) => (
                <PersonItem isCurrent={isCurrent} key={person.key} itemProp={person} handleChange={handleChange} />
            ))
        }</ul>
    );
}
export default PersonList;