
import styles from '../styles/Loader.module.css'

export default function Loader() {
  return <div className={styles.loader}>
  <div className={styles.bounce1}></div>
  <div className={styles.bounce2}></div>
  <div className={styles.bounce3}></div>
</div>
}