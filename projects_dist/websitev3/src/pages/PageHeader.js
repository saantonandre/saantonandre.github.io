const PageHeader = ({ section }) => {
    const imagesPath = "/images/";
  return (
    <div className="d-flex justify-content-center container border-bottom border-fadewhite p-2">
      <img
        src={`${imagesPath + section}-icons.png`}
        style={{ height: "100px" }}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = `${imagesPath}not-found-icons.png`;
        }}
        alt={`${section} icon`}
      />
    </div>
  );
};

export default PageHeader;
