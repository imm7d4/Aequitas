import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface HolidayTableProps {
    holidays: any[];
    onDelete: (id: string) => void;
}

export const HolidayTable: React.FC<HolidayTableProps> = ({ holidays, onDelete }) => (
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Exchange</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Holiday Name</TableCell>
                    <TableCell align="right">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {holidays.length === 0 ? (
                    <TableRow><TableCell colSpan={4} align="center">No holidays found</TableCell></TableRow>
                ) : (
                    holidays.map((h) => (
                        <TableRow key={h.id}>
                            <TableCell>{h.exchange}</TableCell>
                            <TableCell>{new Date(h.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</TableCell>
                            <TableCell>{h.name}</TableCell>
                            <TableCell align="right">
                                <IconButton color="error" onClick={() => onDelete(h.id)}><DeleteIcon /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    </TableContainer>
);
