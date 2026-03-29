import React, { useRef } from 'react';
import { Box, Button, Typography, Stack, IconButton } from '@mui/material';
import { AddPhotoAlternate as AddPhotoIcon, Close as CloseIcon } from '@mui/icons-material';

interface Base64ImagePickerProps {
    onImagesSelected: (base64Strings: string[]) => void;
    selectedImages: string[];
    onRemoveImage: (index: number) => void;
}

export const Base64ImagePicker: React.FC<Base64ImagePickerProps> = ({ 
    onImagesSelected, 
    selectedImages, 
    onRemoveImage 
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const base64Promises = files.map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        });

        Promise.all(base64Promises).then(base64s => {
            onImagesSelected(base64s);
            if (fileInputRef.current) fileInputRef.current.value = '';
        });
    };

    return (
        <Box>
            <input
                type="file"
                multiple
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                {selectedImages.map((img, idx) => (
                    <Box key={idx} sx={{ position: 'relative', width: 60, height: 60, borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
                        <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <IconButton 
                            size="small" 
                            onClick={() => onRemoveImage(idx)}
                            sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.8)', p: 0.2 }}
                        >
                            <CloseIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                    </Box>
                ))}
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddPhotoIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ height: 60, width: 80, borderStyle: 'dashed' }}
                >
                    Add
                </Button>
            </Stack>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                Max 3 images. Stored directly in encrypted ledger.
            </Typography>
        </Box>
    );
};
