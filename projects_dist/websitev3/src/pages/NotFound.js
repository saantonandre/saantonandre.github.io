import PageHeader from "./PageHeader";
const NotFound = () => {
  return (
    <>
      <PageHeader section="not-found" />
      <div className="text-center p-5">
        <h1 className="px-font">404</h1>
        <div className="fs-3">
          The resource you were looking for could not be found :(
        </div>
      </div>
    </>
  );
};
export default NotFound;
