import ChatComponent from "./ChatComponent";
import styles from "./page.module.css";

export default async function page() {
  console.log(`Project: ${process.env.PROJECT_NAME || "unable to access env"}`);
  return (
    <div className={styles.main}>
      <ChatComponent />
    </div>
  );
}
