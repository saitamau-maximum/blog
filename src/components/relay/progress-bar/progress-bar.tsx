import style from "./progress-bar.module.css";

interface Props {
  progress: number; // 0 ~ 1
}

export const ProgressBar = ({ progress }: Props) => {
  const percent = progress * 100;

  const statusDisplay = () => {
    if (progress === 1) {
      return "Completed";
    } else if (progress === 0) {
      return "";
    } else {
      return `${Math.floor(percent)}%`;
    }
  };

  return (
    <div className={style.progress}>
      <div className={style.progressInner} style={{ width: `${percent}%` }}>
        <div className={style.progressText}>{statusDisplay()}</div>
      </div>
    </div>
  );
};
