import Checkbox from "components/inputs/Checkbox";
import Tooltip from "components/popovers/Tooltip";
import { ColumnInstance } from "react-table";

export function selectionHook<T extends {}>(columns: ColumnInstance<T>[]) {
  return [
    {
      id: "selection",
      Header: ({ ...getToggleRowsSelectedProps }) => {
        // toggleAllRowsSelected is missing in react-table types declaration...
        const fixed = { toggleAllRowsSelected: (val: boolean) => {} };
        const { toggleAllRowsSelected } = {
          ...fixed,
          ...getToggleRowsSelectedProps,
        };
        return (
          <Tooltip tip="Seleziona tutti">
            <div className="flex items-center h-full">
              <Checkbox
                className="w-5 h-5 mx-2 rounded bg-neutral"
                onChange={(e) => {
                  toggleAllRowsSelected(e.target.checked);
                }}
              />
            </div>
          </Tooltip>
        );
      },
      Cell: ({ row }: any) => {
        const { checked, onChange } = row.getToggleRowSelectedProps();
        return (
          <Tooltip tip="Seleziona">
            <div className="flex items-center h-full" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                className="w-5 h-5 mx-2 rounded"
                checked={checked}
                onChange={onChange}
              />
            </div>
          </Tooltip>
        );
      },
    },
    ...columns,
  ];
}
export default selectionHook;
