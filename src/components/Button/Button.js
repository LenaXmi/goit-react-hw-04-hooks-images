import s from "./Button.module.css";

function LoadMore({ fetchMoreImg }) {
  return (
    <button className={s.Button} onClick={fetchMoreImg} type="button">
      Load more
    </button>
  );
  //   <button type="button" className="" dataAction="load-more">
  //     <span className="">Load more</span>
  //   </button>;
}

export default LoadMore;
