import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';

const App = function (props) {
    const columnDefs = useMemo(() => [
        {
            field: 'country',
        },
        {
            field: 'year',
        },
        {field: 'sport'},
        {field: 'athlete'},
        {field: 'total'},
    ], []);
    const defaultColDef = useMemo(() => ({
        flex: 1,
        minWidth: 100,
        filter: true,
        sortable: true,
        resizable: true,
    }), []);

    const [selectedCount, setSelectedCount] = useState(0);
    const [selectedCellContents, setSelectedCellContents] = useState(null);
    const [rowData, setRowData] = useState(null);

    const gridRef = useRef(null);
    useEffect(() => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then((resp) => resp.json())
            .then((data) => {
                setRowData(data);
            });
    }, [])

    const handleSelectAll = () => {
        gridRef.current.api.selectAll();
        setSelectedCount(gridRef.current.api.getSelectedRows().length);
    };

    const handleDeselectAll = () => {
        gridRef.current.api.deselectAll();
        setSelectedCount(gridRef.current.api.getSelectedRows().length);
    };

    const handleRowClicked = (params) => {
       // console.log('Clicked row',params.data);
        setSelectedCount(gridRef.current.api.getSelectedRows().length);
    };
    const handleCellClicked = (params) => {
    //    console.log('Clicked cell',params.value);
        setSelectedCellContents(params.value);
    };

    return (
      <div>
        <button id="selectAll" onClick={handleSelectAll}>
          Select All Rows
        </button>
        <button id="deSelectAll" onClick={handleDeselectAll}>
          Deselect All Rows
        </button>
        <div>
          <label htmlFor="selected-count">Selected Rows:</label>
          <output id="selected-count">{selectedCount}</output>
          <br />
          <label htmlFor="cell-value">Selected Cell Value:</label>
          <output id="cell-value">{selectedCellContents}</output>
        </div>
        <div
          className="ag-theme-balham"
          style={{
            height: "500px",
            width: "600px",
          }}
        >
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            alwaysShowHorizontalScroll
            animateRows={true}
            rowSelection="multiple"
            rowData={rowData}
            onRowClicked={(p) => handleRowClicked(p)}
            onCellClicked={(p) => handleCellClicked(p)}
          />
        </div>
      </div>
    );
};
export default App;
