/**
 * Andrea Santona @ Radix Srl
 * https://github.com/saantonandre
 */
import { SearchBar } from "components/inputs/SearchBar";
import ActionDropdown from "./ActionDropdown";
import selectionHook from "./selectionHook";
import SortBy from "./SortBy";
import SortDesc from "./SortDesc";
import { Col, MiniFormatter } from "./types";
import { useEffect, useMemo, useState } from "react";
import {
  useTable,
  Column,
  useRowSelect,
  usePagination,
  PluginHook,
} from "react-table";
import { twMerge } from "tailwind-merge";
import { PaginationControls } from "components/lists/table/PaginationControls";
export type Props<T extends {}> = {
  /** An array of data objects */
  data: T[];
  /**
   * Bidimensional array describing each column **to be included** <pre/>
   * [Arbitrary name, property key, value parsing (callback), sorting algorithm]
   */
  cols: Col<Partial<T>>;
  /** [button_content, actionEffect(selectedData)] */
  actions?: [React.ReactNode | JSX.Element, ((selectedData: T[]) => void)?][];
  /** [actionEffect(selectedData), action_title] */
  rowActions?: [MiniFormatter<T>, string?][];
  /** Row click event callback */
  onRowClick?: (element: T) => void;
  /** Callback to set the hovered row data */
  setHovered?: (data: T | undefined) => void;
  /** Whether or not to display the thead, defaults to `true` */
  showTitles?: boolean;
  /** Whether or not to display the header, defaults to `true` */
  showHeader?: boolean;
  /** Whether or not to make the rows selectable */
  noSelect?: boolean;
  /** Whether or not to use pagination */
  pagination?: boolean;
  /** Default sorting method (key of list object) */
  defaultSort?:""|keyof T
  /** How many rows to display per page */
  defaultPageSize?: number;
  /** Extra sorting fields, every col field is also a sort option by default */
  additionalSorting?: Col<Partial<T>>;
  transparentRows?: boolean;
  /** use this to have a reference of the filtered items */
  filteredElementsSetter?: (elements: T[]) => void;

  /** Used to have an outside reference of the selected (checked) rows */
  setSelectedRows?: (data: T[]) => void;
} & React.HTMLAttributes<HTMLDivElement>;
/** Generics powered table */

export function Table<T extends { [K in keyof T]: T[K] }>({
  data,
  cols,
  rowActions,
  actions,
  className,
  showHeader = true,
  showTitles = true,
  pagination = true,
  transparentRows = false,
  defaultSort="",
  noSelect,
  additionalSorting,
  defaultPageSize = 8,
  setSelectedRows,
  setHovered = () => {},
  onRowClick,
  filteredElementsSetter = () => {},
  ...attributes
}: Props<T>) {
  const columns = useMemo<Column<T>[]>(() => {
    const rowActionsCols: Column<T>[] = rowActions
      ? rowActions.map(([formatter, title], i) => ({
          id: "action-" + i,
          Header: title || "",
          accessor: (obj: T) => {
            return formatter(obj);
          },
        }))
      : [];
    const colElements: Column<T>[] = Object.keys(cols).map((key) => ({
      id: key,
      Header: cols[key as keyof T][0],
      accessor: (obj: T) => {
        const safekey = key as keyof T;
        const resolver = cols[safekey][1];
        return resolver ? resolver(obj[safekey], obj) : obj[safekey];
      },
    }));
    return colElements.concat(rowActionsCols);
  }, [cols, rowActions]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"" | keyof T>(defaultSort);
  const [sortDesc, setSortDesc] = useState(false);

  /** Filters the data array depending on the search input */
  const filterData = useMemo(
    () => (data: T[]) => {
      if (!search) {
        return data;
      }
      return data.filter((item) => {
        for (let key in cols) {
          if (String(item[key]).toLowerCase().includes(search.toLowerCase())) {
            return true;
          }
        }
        return false;
      });
    },
    [search, cols]
  );
  /** Sorts the data array depending on the selected key option */
  const sortData = useMemo(
    () => (data: T[]) => {
      if (!sortBy) {
        return data;
      }
      const sorted = data.slice(0).sort((a, b) => {
        const col = cols[sortBy];
        if (col && col[2]) {
          // Column specific sort if provided
          return col[2](a[sortBy], b[sortBy], a, b);
        }
        // Default sorting algo
        return String(a[sortBy]) > String(b[sortBy]) ? 1 : -1;
      });
      return sortDesc ? sorted.reverse() : sorted;
    },
    [sortBy, cols, sortDesc]
  );

  const [targetData, setTargetData] = useState(sortData(data));

  const selectionParams: PluginHook<T>[] =
    showTitles && showHeader && !noSelect
      ? [
          useRowSelect,
          (hooks) => {
            hooks.visibleColumns.push(selectionHook);
          },
        ]
      : [];
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    selectedFlatRows,
    rows,
    // pagination
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable<T>(
    {
      columns: columns,
      data: targetData,
      initialState: {
        pageIndex: 0,
        pageSize: defaultPageSize,
      },
    },
    usePagination,
    ...selectionParams
  );

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    const filtered = sortData(filterData(data));
    setTargetData(filtered);
    // If a setter has been passed, will provide the filtered data to it
    // (otherwise does nothing)
    filteredElementsSetter(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortDesc, search, data]);

  useEffect(() => {
    setSelectedRows?.(selectedFlatRows.map((row) => row.original));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFlatRows?.length]);
  return (
    <div
      className={twMerge(
        "custom-scrollbar relative max-h-full w-full -translate-y-2 px-2",
        className
      )}
      {...attributes}
    >
      <table
        {...getTableProps()}
        className="w-full border-separate border-spacing-x-0 border-spacing-y-2"
      >
        <thead className="sticky z-20 m-0 text-left top-2 border-spacing-y-2">
          {showHeader && (
            <>
              <tr>
                <td
                  colSpan={
                    Object.keys(cols).length +
                    1 +
                    (rowActions ? rowActions.length : 0)
                  }
                  className="whitespace-nowrap"
                >
                  <div className="flex w-full flex-wrap justify-between gap-3 border-b border-contrast2 pb-1 [&>*]:h-9">
                    <div className="flex gap-3 grow">
                      {actions && (
                        <ActionDropdown
                          selectedData={selectedFlatRows.map((s) => s.original)}
                          actions={actions}
                          disabled={selectedFlatRows.length === 0}
                        />
                      )}
                      <SearchBar
                        onChange={handleSearch}
                        className="grow "
                        placeholder={(() => {
                          const names = Object.keys(cols).map(
                            (key) => cols[key as keyof T][0]
                          );
                          return "Cerca per " + names.join(", ").toLowerCase();
                        })()}
                      />
                    </div>
                    <SortBy value={sortBy} cols={cols} setValue={setSortBy} />
                    <SortDesc
                      setter={setSortDesc}
                      sortDesc={sortDesc}
                      disabled={!sortBy}
                    />
                  </div>
                </td>
              </tr>
            </>
          )}
          {showTitles &&
            headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="text-base font-semibold text-contrast2"
              >
                {headerGroup.headers.map((column, i) => (
                  <th
                    {...column.getHeaderProps()}
                    className="p-2 px-3 text-sm font-medium bg-neutral3"
                  >
                    <div
                      className={twMerge(
                        i < headerGroup.headers.length - 1 &&
                          "border-r border-contrast2"
                      )}
                    >
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
        </thead>
        <tbody {...getTableBodyProps()} className="">
          {(pagination ? page : rows).map((row) => {
            prepareRow(row);
            return (
              <tr
                role="button"
                {...row.getRowProps()}
                className={twMerge(
                  "group text-contrast",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => {
                  onRowClick?.(row.original);
                }}
                onMouseEnter={() => {
                  setHovered(row.original);
                }}
                onMouseLeave={() => {
                  setHovered(undefined);
                }}
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className={twMerge(
                        "px-3 py-2 text-left text-sm",
                        !transparentRows &&
                          "border-b border-contrast2 group-hover:bg-neutral3 group-hover:bg-opacity-20"
                      )}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {pagination && (
        <PaginationControls
          {...{
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
          }}
        />
      )}
    </div>
  );
}
export default Table;
