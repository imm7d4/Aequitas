import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    styled,
    alpha
} from '@mui/material';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: '16px',
    border: `1px solid ${theme.palette.divider}`,
    background: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(20px)',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.divider,
        borderRadius: '10px',
    }
}));

const StyledTable = styled(Table)(({ theme }) => ({
    '& .MuiTableCell-root': {
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        padding: theme.spacing(1, 1.5),
        fontSize: '0.875rem',
        color: theme.palette.text.primary,
    },
    '& .MuiTableCell-head': {
        backgroundColor: alpha(theme.palette.background.paper, 0.5),
        color: theme.palette.text.secondary,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontSize: '0.75rem',
        borderBottom: `2px solid ${theme.palette.divider}`,
    },
    '& .MuiTableRow-root': {
        transition: theme.transitions.create(['background-color'], {
            duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.02),
        },
        '&:last-child .MuiTableCell-root': {
            borderBottom: 'none',
        }
    }
}));

interface Column<T> {
    id: keyof T | string;
    label: string;
    align?: 'left' | 'right' | 'center';
    minWidth?: number;
    format?: (value: any, row: T) => React.ReactNode;
    sortable?: boolean;
}

interface CustomGridProps<T> {
    columns: Column<T>[];
    rows: T[];
    onRowClick?: (row: T) => void;
    sorting?: {
        column: string;
        direction: 'asc' | 'desc';
    };
    onSort?: (column: string) => void;
    stickyHeader?: boolean;
    maxHeight?: string | number;
}

export function CustomGrid<T extends { id: string | number }>({
    columns,
    rows,
    onRowClick,
    sorting,
    onSort,
    stickyHeader = true,
    maxHeight
}: CustomGridProps<T>) {
    return (
        <StyledTableContainer sx={{ maxHeight }}>
            <StyledTable stickyHeader={stickyHeader} size="small">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id.toString()}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                            >
                                {column.sortable !== false && onSort ? (
                                    <TableSortLabel
                                        active={sorting?.column === column.id}
                                        direction={sorting?.column === column.id ? sorting.direction : 'asc'}
                                        onClick={() => onSort(column.id.toString())}
                                        sx={{ 
                                            '&.Mui-active': { color: 'primary.main' },
                                            '& .MuiTableSortLabel-icon': { color: 'primary.main !important' }
                                        }}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                ) : (
                                    column.label
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            hover
                            key={row.id}
                            tabIndex={-1}
                            onClick={() => onRowClick?.(row)}
                            sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                        >
                            {columns.map((column) => {
                                const value = (row as any)[column.id];
                                return (
                                    <TableCell key={column.id.toString()} align={column.align}>
                                        {column.format ? column.format(value, row) : value}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </StyledTable>
        </StyledTableContainer>
    );
}
