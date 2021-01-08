import React, { Component } from "react";
import { useTable, usePagination } from 'react-table'

import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Popover from '@material-ui/core/Popover';

import { useDrag } from 'react-dnd';

import '../scss/TableViewer.scss';


const DraggableTableCell = ({ cell, type }) => {
    const [{ isDragging }, drag] = useDrag({
        item: { value: type == "Cell" ? cell.value : cell.Header, type: "cell" },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
              dropResult.handleChange(dropResult.channel, item.value);
              //alert(`You dropped ${item.value} into ${dropResult.tag.toString()}!`);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 1 : 1;
    const cursor = isDragging ? "grabbing" : "grab";
    const props = type == "Cell" ? cell.getCellProps() : cell.getHeaderProps();

    return (
      <TableCell ref={drag} className={"react-table-cell"} 
            style={{"opacity": opacity, transform: 'translate(0, 0)', "cursor": cursor, overflow: "hidden"}}
          {...props}>
        {cell.render(type)}
      </TableCell>)
};

function ReactTable({ columns, data, defaultPageSize, paginationOption = true, enableClickCopy = true }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
          // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize},
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: defaultPageSize, showCopied: false, pointerX: 0, pointerY: 0 },
    },
    usePagination
  )

  const [showCopied, setShowCopied] = React.useState(false);
  const [tipPositionX, setTipPositionX] = React.useState(0);
  const [tipPositionY, setTipPositionY] = React.useState(0);

  const handleClickCopy = (x, y) => {
    setTipPositionX(x);
    setTipPositionY(y);
    setShowCopied(true);

    setTimeout(function () {
      setShowCopied(false);
    }, 500);
  }

  const showTips = (event, cellValue) => {
                       navigator.clipboard.writeText(cellValue); 
                       event.persist();
                       handleClickCopy(event.clientX, event.clientY);}

  const pagination = paginationOption ? (
    <div className="pagination">
        <IconButton className="pagination-btn" onClick={() => previousPage()} disabled={!canPreviousPage} aria-label="previous page">
          <KeyboardArrowLeft />
        </IconButton>
        <span className="info-span">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <IconButton className="pagination-btn" onClick={() => nextPage()} disabled={!canNextPage} aria-label="next page">
          <KeyboardArrowRight />
        </IconButton>
      </div>) : "";


  // Render the UI for your table
  return (
    <>
      <MaUTable className="react-table" {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => {

                return (
                  <DraggableTableCell cell={column} type={"Header"} key={"draggable-cell-header-" + i.toString()}/>
                  // <TableCell className={"react-table-cell-header react-table-cell " + (enableClickCopy ?  "pointer" : "")}
                  //     onClick={(e) => { 
                  //       if (enableClickCopy) {showTips(e, column.Header)}}} 
                  //     {...column.getHeaderProps()}> 
                  //   {column.render('Header')}
                  // </TableCell>
                 );
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell, j) => {
                  return (
                    <DraggableTableCell cell={cell} type={"Cell"} key={"draggable-cell-body-" + i.toString() + "-" + j.toString()}/>
                    // <TableCell className={"react-table-cell " + (enableClickCopy ?  "pointer" : "")} 
                    //       onClick={(e) => {if (enableClickCopy) {showTips(e, cell.value)}}}
                    //     {...cell.getCellProps()}>
                    //   {cell.render('Cell')}
                    // </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </MaUTable>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      {pagination}

      <Popover 
        className="tipIcon"
        anchorReference="anchorPosition"
        open={showCopied}
        anchorPosition={{ top: tipPositionY, left: tipPositionX }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        copied!
      </Popover>
    </>
  )
}

export default ReactTable;