import "./NotFound.css";

const NotFoundPage = () => {
  return (
    <>
      <div className="not-found">
        <div className="not-found-title">404 Page Not Found</div>
        <div className="not-found-page">
          <img
            className="not-found"
            alt="404"
            src="../../assets/racoon-washing-cotton-candy.png"
          />
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
