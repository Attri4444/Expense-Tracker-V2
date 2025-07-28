import styles from "./Button.module.css";
export default function Button({
  children,
  handleClick,
  stylebtn = "primary",
  shadow = false,
  type = "button",
}) {
  return (
    <button type={type} onClick={handleClick} className={`${styles.button} ${styles[stylebtn]} ${shadow && styles.shadow}`}>
      {children}
    </button>
  );
}