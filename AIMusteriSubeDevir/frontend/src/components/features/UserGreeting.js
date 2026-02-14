// User Greeting Component
// Kullanıcı karşılama bileşeni
// Displays user welcome message and current branch

import React from 'react';
import { Box, Typography, Avatar, Card, CardContent } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';

/**
 * UserGreeting Component
 * Kullanıcı adı ve mevcut şube bilgisini gösterir
 * Displays user name and current branch information
 * 
 * @param {Object} props - Component props
 * @param {string} props.userName - Kullanıcı adı / User name
 * @param {string} props.currentBranch - Mevcut şube / Current branch
 */
const UserGreeting = ({ userName, currentBranch }) => {
    return (
        <Card
            elevation={0}
            sx={{
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }}
        >
            <CardContent sx={{ py: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            width: 56,
                            height: 56
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                </Box>

                <Typography
                    variant="h5"
                    textAlign="center"
                    fontWeight="bold"
                    gutterBottom
                >
                    Hoş Geldiniz
                </Typography>

                <Typography
                    variant="h6"
                    textAlign="center"
                    sx={{ mb: 2 }}
                >
                    {userName}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        mt: 2,
                        p: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: 2
                    }}
                >
                    <BusinessIcon />
                    <Box>
                        <Typography variant="caption" display="block">
                            Mevcut Şubeniz
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                            {currentBranch}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserGreeting;
