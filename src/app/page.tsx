import ChatComponent from "./ChatComponent";
import styles from "./page.module.css";

export default async function page() {
  return (
    <div className={styles.main}>
      <ChatComponent />
    </div>
  );
}
