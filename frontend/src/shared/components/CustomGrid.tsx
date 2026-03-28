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
    alpha,
    IconButton,
    Collapse,
    CircularProgress
} from '@mui/material';
import {
    KeyboardArrowDown,
    KeyboardArrowUp
} from '@mui/icons-material';

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

export interface Column<T> {
    id: keyof T | string;
    label: string;
    align?: 'left' | 'right' | 'center';
    minWidth?: number;
    format?: (value: any, row: T) => React.ReactNode;
    render?: (row: T) => React.ReactNode;
    sortable?: boolean;
}

export interface BaseRow {
    id: string | number;
}

interface CustomGridProps<T extends BaseRow> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (row: T) => void;
    sorting?: {
        column: string;
        direction: 'asc' | 'desc';
    };
    onSort?: (column: string) => void;
    stickyHeader?: boolean;
    maxHeight?: string | number;
    renderExpansion?: (row: T) => React.ReactNode;
    initialExpanded?: (string | number)[];
    isLoading?: boolean;
}

export function CustomGrid<T extends BaseRow>({
    columns,
    data: rows = [],
    onRowClick,
    sorting,
    onSort,
    stickyHeader = true,
    maxHeight,
    renderExpansion,
    initialExpanded = [],
    isLoading = false
}: CustomGridProps<T>) {
    const [expandedRows, setExpandedRows] = React.useState<Set<string | number>>(new Set(initialExpanded));

    const toggleRow = (id: string | number, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    return (
        <StyledTableContainer sx={{ maxHeight }}>
            <StyledTable stickyHeader={stickyHeader} size="small">
                <TableHead>
                    <TableRow>
                        {renderExpansion && <TableCell sx={{ width: 40 }} />}
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
                <TableBody sx={{ position: 'relative' }}>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={columns.length + (renderExpansion ? 1 : 0)} sx={{ height: 200, textAlign: 'center' }}>
                                <CircularProgress size={32} />
                            </TableCell>
                        </TableRow>
                    )}
                    {!isLoading && rows.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={columns.length + (renderExpansion ? 1 : 0)} sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
                                No data available
                            </TableCell>
                        </TableRow>
                    )}
                    {!isLoading && rows.map((row) => (
                        <React.Fragment key={row.id}>
                            <TableRow
                                hover
                                tabIndex={-1}
                                onClick={() => onRowClick?.(row)}
                                sx={{ 
                                    cursor: onRowClick ? 'pointer' : 'default',
                                    '& > *': renderExpansion ? { borderBottom: 'unset !important' } : {}
                                }}
                            >
                                {renderExpansion && (
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => toggleRow(row.id, e)}
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {expandedRows.has(row.id) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                        </IconButton>
                                    </TableCell>
                                )}
                                {columns.map((column) => {
                                    const value = (row as any)[column.id];
                                    return (
                                        <TableCell key={column.id.toString()} align={column.align}>
                                            {column.render ? column.render(row) : (column.format ? column.format(value, row) : value)}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                            {renderExpansion && (
                                <TableRow sx={{ '&:hover': { backgroundColor: 'transparent !important' } }}>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 1}>
                                        <Collapse in={expandedRows.has(row.id)} timeout="auto" unmountOnExit>
                                            {renderExpansion(row)}
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </StyledTable>
        </StyledTableContainer>
    );
}
