import styles from 'styles/PersonList.module.css';
import PersonItem from 'components/PersonItem';
import StatsItem from 'components/StatsItem';

const PersonList = ({personProps, handleChange, isCurrent,chosen,label }) => {
    return (
        <ul aria-current={chosen} className={styles.personbox}>
            <div className={styles.label}>{label}</div>{
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