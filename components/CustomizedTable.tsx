import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, tableCellClasses, TableCell  } from '@mui/material';
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f9fafb',
    color: '#6B7280',
    fontWeight:'600',
    textTransform: 'uppercase',
    fontFamily:'Inter'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '10px 16px',
    fontFamily:'Inter',
    fontWeight:'400',
    color: '#0F6937'
  },
}));

const StyledTableCellSecond = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f9fafb',
    color: '#6B7280',
    fontWeight:'600',
    textTransform: 'uppercase',
    fontFamily:'Inter'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '10px 16px',
    fontFamily:'Inter',
    fontWeight:'400',
    color: '#0F6937'
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#FFFFFF',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#FFFFFF',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


type Props = {
  data: {
    heading: string[];
    rows: Array<Array<string>>;
  }
}

export default function CustomizedTable({data} : Props) {
  const { heading, rows } = data;
  console.log("🚀 ~ file: CustomizedTable.tsx:43 ~ CustomizedTable ~ rows:", rows)

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '100%', fontFamily:'Inter' }} aria-label="speaker table">
        <TableHead>
          <TableRow>
            {heading.map((heading, i) => <StyledTableCell key={i} >{heading}</StyledTableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowInex) => (
            <StyledTableRow key={rowInex}>
            {row.map((rowVal, colIndex) => <StyledTableCell key={colIndex}>
                <span className="content" dangerouslySetInnerHTML={{__html: rowVal}}></span>
              </StyledTableCell>)}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}