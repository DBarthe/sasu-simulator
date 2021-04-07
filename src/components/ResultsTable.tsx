import React from "react";
import { useMemo } from "react";
import { useTable, useExpanded } from 'react-table';
import { SimulationOutput } from "../models";
import styles from '../styles/Simulator.module.css';
import { formatEuro, formatPercent } from "../utils";
import DetailsTable from "./DetailsTable";

export default function ResultsTable(props: { output: SimulationOutput; }) {
  const { output } = props;

  const renderRowSubComponent = React.useCallback(
    ({ row }) => <DetailsTable item={row.original} />, []
  );

  const columns = useMemo(() => [
    {
      // Make an expander cell
      Header: () => null,
      id: 'expander',
      Cell: ({ row }) => (
        // Use Cell to render an expander for each row.
        // We can use the getToggleRowExpandedProps prop-getter
        // to build the expander.
        <span {...row.getToggleRowExpandedProps()}>
          {row.isExpanded ? '👇' : '👉'}
        </span>
      ),
    },
    {
      Header: 'Salaire brut',
      accessor: 'salaire.brut',
      Cell: props => <>{formatEuro(props.value)}</>
    },
    {
      Header: 'Dividendes',
      accessor: 'dividendes.brut',
      Cell: props => <>{formatEuro(props.value)}</>
    },
    {
      Header: 'Net avant impôts',
      accessor: 'impots.avant',
      Cell: props => <>{formatEuro(props.value)}/an <br></br> {formatEuro(props.value / 12)}/mois</>
    },
    {
      Header: 'Net après impôts',
      accessor: 'impots.apres',
      Cell: props => <>{formatEuro(props.value)}/an <br></br> {formatEuro(props.value / 12)}/mois</>
    },
    {
      Header: 'Rendement',
      accessor: 'rendement',
      Cell: props => <>{formatPercent(props.value)}</>
    },
    {
      Header: 'Option dividendes',
      accessor: 'dividendes',
      Cell: props => <>{props.value.option} (+{formatEuro(props.value.optionDifference)})</>
    },
  ], []);

  const tableInstance = useTable({ columns, data: output.items }, useExpanded);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    state: { expanded },
  } = tableInstance;

  return (
    <div className={styles.verticalContainer}>
      <h2>Resultats</h2>
      <table className={styles.resultsTable} {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              // Use a React.Fragment here so the table markup is still valid
              <React.Fragment {...row.getRowProps()}>
                <tr>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
                {/*
                              If the row is in an expanded state, render a row with a
                              column that fills the entire length of the table.
                            */}
                {row.isExpanded ? (
                  <tr>
                    <td colSpan={visibleColumns.length}>
                      {/*
                                      Inside it, call our renderRowSubComponent function. In reality,
                                      you could pass whatever you want as props to
                                      a component like this, including the entire
                                      table instance. But for this example, we'll just
                                      pass the row
                                    */}
                      {renderRowSubComponent({ row })}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>);
}
