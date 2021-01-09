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
    // type is "Header" or "Cell"
    const props = (type == "Cell") ? cell.getCellProps() : cell.getHeaderProps();
    const className = (type == "Header") ? "react-table-cell-header react-table-cell" : "react-table-cell";
    const value = (type == "Cell") ? cell.value : cell.Header

    const [{ isDragging }, drag] = useDrag({
        item: { value: value, type: "cell" },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
              // convert to string to match the type of values that are typed into the
              dropResult.handleChange(dropResult.channel, item.value.toString());
              //alert(`You dropped ${item.value} into ${dropResult.tag.toString()}!`);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 1 : 1;
    const cursor = isDragging ? "grabbing" : "grab";
    return (
      <TableCell ref={drag} className={className} 
            style={{"opacity": opacity, transform: 'translate(0, 0)', "cursor": cursor, overflow: "hidden"}}
          {...props}>
        {cell.render(type)}
      </TableCell>); 
};

function ReactTable({ columns, data, defaultPageSize, 
                      paginationOption = true, 
                      enableClickCopy = true, 
                      useDraggableCell = true }) {
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
        <IconButton className="pagination-btn" onClick={() => previousPage()} 
            disabled={!canPreviousPage} aria-label="previous page">
          <KeyboardArrowLeft />
        </IconButton>
        <span className="info-span">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <IconButton className="pagination-btn" 
            onClick={() => nextPage()} disabled={!canNextPage} aria-label="next page">
          <KeyboardArrowRight />
        </IconButton>
      </div>) : "";

  const cellSwitcher = (cell, type, key) => {
    // type is "Header" or "Cell"
    const value = (type == "Header") ? cell.Header : cell.value; 
    const props = type == "Cell" ? cell.getCellProps() : cell.getHeaderProps();
    const className = (type == "Header") ? "react-table-cell-header react-table-cell" : "react-table-cell";

    // below is the reference version of the two types of cells
    /*<TableCell className={"react-table-cell-header react-table-cell"}
        {...column.getHeaderProps()}> 
      {column.render('Header')}
    </TableCell>
    <TableCell className={"react-table-cell"} {...cell.getCellProps()}>
      {cell.render('Cell')}
    </TableCell>*/

    if (useDraggableCell) {
      return (<DraggableTableCell cell={cell} type={type} key={key}/>);
    } else if (enableClickCopy) {
      return (
        <TableCell className={className + " pointer"}
            onClick={(e) => {showTips(e, value)}}
            {...props}> 
          {cell.render(type)}
        </TableCell>);
    } else {
      return (
        <TableCell className={className} {...props}> 
          {cell.render(type)}
        </TableCell>);
    }
  } 

  // Render the UI for your table
  return (
    <>
      <MaUTable className="react-table" {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => cellSwitcher(column, "Header", `draggable-cell-header-${i}`))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell, j) => cellSwitcher(cell, "Cell", `draggable-cell-body-${i}-${j}`))}
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