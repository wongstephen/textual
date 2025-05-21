import ChatComponent from "./ChatComponent";
import styles from "./page.module.css";

export default async function page() {
  console.log(process.env.PROJECT_NAME);
  return (
    <div className={styles.main}>
      <ChatComponent />
    </div>
  );
}
