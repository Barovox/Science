import style from "./style.module.css";

const PageLoader = () => {
  return (
    <div className={style["loader-container"]}>
      <div className={style.circles}>
        <div className={`${style.circle} ${style.c1}`}></div>
        <div className={`${style.circle} ${style.c2}`}></div>
        <div className={`${style.circle} ${style.c3}`}></div>
      </div>
      <div className={style.loading}>
        <div className={style.a}></div>
        <div className={style.b}></div>
        <div className={style.c}></div>
        <div className={style.d}></div>
      </div>
    </div>
  );
};

export default PageLoader;
