import {
    useReactTable,
    getCoreRowModel,
    flexRender, 
    getFilteredRowModel, 
    getSortedRowModel, 
    getPaginationRowModel } from "@tanstack/react-table"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import FilterDescription from "./FilterDescription";
import FilterType, {typeFilter} from "./FilterType";
import DateFilter, {dateFilterFunction} from "./DateFilter";






const ExpenseTable = ({data = []}) => {
    const [tableData, setTableData] = useState(data);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [totalSpend, setTotalSpend] = useState(null)
    const navigate = useNavigate()

    const columns = [
        {
            accessorKey: "_id",
            header: "",
            size: 50,
            cell: (props) => {
                const theID = props.getValue();
                return (<button className='button-more-info' type="button" onClick={() => navigate(`/expenses/${theID}`)}><img src="/open.png" alt="open" /></button>)
            },
            enableColumnFilter: false,
            enableSorting: false,
        },
        {
            accessorKey: "date",
            header: "Date",
            filterFn: dateFilterFunction,
            sortingFn: "datetime",
            cell:(props) => {
               
                return <p>{props.getValue()}</p>
            }
        },
        {
            accessorKey: "description",
            header: "Description",
            cell:(props) => {
                const theDescription = props.getValue()
                return theDescription.length > 25 ? `${theDescription.slice(0,25)} ...` : theDescription
            }
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell:(props) => {
                const theAmount = props.getValue()
                return <span className={theAmount < 0 ? 'rag-red' : "rag-green"}>{theAmount.toFixed(2)} €</span>
            },
            sortingFn: 'basic',
            filterFn: typeFilter,
            footer: ({table}) => {
                const total = table.getFilteredRowModel().rows.reduce((total,row) => total + +row.getValue("amount"),0)
                setTotalSpend(total.toFixed(2))
                return total.toFixed(2) + ' €'
            },
        },
        {
            accessorKey: "wallet",
            header: "Wallet",
            cell:(props) => {
                
                return <p>{props.getValue()}</p>
            }
        },
        {
            accessorKey: "category",
            header: "Category",
            cell:(props) => {
                
                return <p>{props.getValue()}</p>
            }
        },
    ]

    const table = useReactTable({
        data,
        columns,
        initialState: {
            sorting: [
              {
                id: 'date',
                desc: true, 
              },
            ],
          },
        state: {
            columnFilters,
            globalFilter
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: "onChange",
    });

    console.log(columnFilters)
    
  return (
    <>
    <h1>ExpenseTable</h1>
    <p>I've got {data.length} bits of data </p>
    <hr />

    
    <div className="container expense-filters" >
    <FilterDescription columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
    <FilterType columnFilters={columnFilters} setColumnFilters={setColumnFilters}/>
    <DateFilter columnFilters={columnFilters} setColumnFilters={setColumnFilters} />
    </div>
    <div className="container-fluid expense-summary">
        <p style={{fontSize: "x-large"}}>The balance is <strong>{totalSpend} buckaroos</strong></p>
    </div>

    <table className="expense-table">
    <thead>
        {table.getHeaderGroups().map(headerGroup => <tr key={headerGroup.id} >
            {headerGroup.headers.map(header => 
            <th 
                key={header.id}
                width={header.getSize()}
            >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      </>
                    )}
                <div 
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}>
                </div>
            </th>)}
        </tr>)}
    </thead>
    <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                    //console.log(cell.getContext())
                  return (
                    <td 
                        key={cell.id}
                        width={cell.column.getSize()}
                    
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
        <tfoot style={{visibility: "hidden"}}>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
    </table>
    <p>
    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
    </p>
    <div role="group">
        <button 
            type="button" 
            onClick={() => table.previousPage()} 
            disabled={!table.getCanPreviousPage()}
        >{"<"}</button>
        <button 
            type="button" 
            onClick={() => table.nextPage()} 
            disabled={!table.getCanNextPage()}
        >{">"}</button>
    </div>
    </>
  )
}
export default ExpenseTable

// {
//     "_id": "660ebf21cfb20fbb8fb74669",
//     "description": "PayPal Europe S.a.r.l. et Cie S.C.A 1033515140395/. CJS SALES + SERVICE S LIMITED, Ihr Einkauf bei CJS SALE S + SERVICES LIMITED End-to-End-Ref.: 1033515140395 Mandatsref: 532J224MHMP94 Gläubiger-ID: LU96ZZZ0000000000000000058 SEPA-BASISLASTSCHRIFT wiederholend",
//     "amount": -42.6,
//     "date": "2024-04-02",
//     "category": "one",
//     "wallet": "cash",
//     "payment_method": "bank_statement",
//     "tags": [],
//     "__v": 0,
//     "createdAt": "2024-04-04T14:54:25.988Z",
//     "updatedAt": "2024-04-04T14:54:25.988Z"
// },