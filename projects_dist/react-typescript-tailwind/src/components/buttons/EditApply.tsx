import { CheckIcon, PencilIcon } from "@heroicons/react/24/outline";
import BasicButton from "components/buttons/Basic";
import LoadingSpinner from "components/others/LoadingSpinner";

type Props = {
    flag: boolean;
    pending:boolean;
    setter: React.Dispatch<React.SetStateAction<boolean>>;
    onClick:(flag:boolean)=>void
  };

export const EditApply = ({ onClick=()=>{},flag, setter,pending }: Props) => {
    return (
      <BasicButton
        onClick={() => {
          setter(!flag);
          onClick(flag)
        }}
        disabled={pending}
        className="select-none w-24 p-1 text-sm font-medium bg-transparent border rounded-lg h-fit border-slate-400 text-slate-500"
      >
        <div className="flex items-center justify-center gap-1">
          {pending ? (
            <LoadingSpinner className="h-4  fill-gray-700" />
          ) : flag ? (
            <>
              <CheckIcon className="h-4" /> Applica
            </>
          ) : (
            <>
              <PencilIcon className="h-4" /> Modifica
            </>
          )}
        </div>
      </BasicButton>
    );
  };

  export default EditApply