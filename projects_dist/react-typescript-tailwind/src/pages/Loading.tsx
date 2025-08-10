import LoadingSpinner from "components/others/LoadingSpinner";

export const Loading = () => {
  return (
    <div
      className={
        "flex h-screen max-h-screen w-screen flex-col items-center justify-center gap-3 "
      }
    >
      <LoadingSpinner />
    </div>
  );
};
export default Loading;
