// pages/Welcome/Welcome.jsx
import { Link, useNavigate } from "react-router-dom";
import styles from "./Welcome.module.css";
import Button from "../../components/ui/Button";
import { useNotification } from "../../contexts/NotificationContext";
export default function Welcome() {

  const { showError } = useNotification();

  const navigate = useNavigate();

  const handleStart = () => {
    // Можно добавить дополнительную логику перед навигацией
    console.log("Переход на страницу авторизации");
    navigate("/auth");
  };

  return (
    <div className={styles["welcome-container"]}>
      <div className={styles["welcome-content"]}>
        <h1 className={styles["welcome-title"]}>
          Добро пожаловать в{" "}
          <span className={styles.highlight}>реверсивную диаграмму Ганта</span>!
        </h1>
        <p className={styles["welcome-subtitle"]}>
          Инновационный инструмент для планирования и управления проектами
        </p>
        <Button variant="start" onClick={handleStart}>
          <span>Начать</span>
        </Button>
      </div>
    </div>
  );
}
