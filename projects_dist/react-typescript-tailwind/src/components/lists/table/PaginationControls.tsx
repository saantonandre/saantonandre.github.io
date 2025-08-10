import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import BasicInput from "components/inputs/Basic";
import Select from "components/inputs/Select";
import { UsePaginationInstanceProps, UsePaginationState } from "react-table";

type Props = Omit<UsePaginationInstanceProps<any>, "page"> & {
  defaultPageSize: number;
} & UsePaginationState<any>;

export const PaginationControls: React.FC<Props> = ({
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  defaultPageSize,
  pageSize,
  pageIndex,
}) => {
  return (
    <div className="flex items-stretch justify-between w-full gap-4 text-contrast2">
      <Select
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
        }}
        className="border w-fit border-neutral3 bg-neutral2"
      >
        {[10, 20, 30, 40, 50, defaultPageSize].sort().map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Righe: {pageSize}
          </option>
        ))}
      </Select>
      <div className="flex items-center justify-center gap-1 grow">
        <button
          className="p-1 rounded hover:text-contrast hover:bg-neutral3"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <ChevronDoubleLeftIcon className="h-5" />
        </button>
        <button
          className="p-1 rounded hover:text-contrast hover:bg-neutral3"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <ChevronLeftIcon className="h-5" />
        </button>
        <div className="flex items-center gap-2">
          Pagina
          <strong>
            {pageIndex + 1} di {pageOptions.length}
          </strong>
        </div>
        <button
          className="p-1 rounded hover:text-contrast hover:bg-neutral3"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <ChevronRightIcon className="h-5" />
        </button>
        <button
          className="p-1 rounded hover:text-contrast hover:bg-neutral3"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <ChevronDoubleRightIcon className="h-5" />
        </button>
      </div>
      <span>
        Vai a pagina:{" "}
        <BasicInput
          type="number"
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
          max={pageCount}
          style={{ width: "100px" }}
        />
      </span>
    </div>
  );
};
