import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getPartContrats } from '../../api/part'; 
import { Card ,Box, Typography, CircularProgress} from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import Sidebar from '../../components/Sidebar';

const statut = [
    { value: 'actif', label: 'Actif' },
    { value: 'expire', label: 'Expire' },
    { value: 'resilie', label: 'Resilie' },
];
const typeIcons = {
  actif: <HotelIcon style={{ fontSize: 20, color: '#3f51b5' }} />,
  expire: <DirectionsCarIcon style={{ fontSize: 20, color: '#009688' }} />,
  resilie: <EmojiPeopleIcon style={{ fontSize: 20, color: '#ff9800' }} />,
};
const PartenaireContrat = () => {
    const [contrats, setContrats] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    const fetchContratsData = async () => {
        try {
            const response = await getPartContrats();
            console.log('contrats:',response.data);
            setContrats(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setError("Impossible de récupérer les Contrats des partenaires. Vérifiez vos permissions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContratsData();
    }, []);


    const countByType = (type) => {
      return contrats.filter((p) => p.statut === type).length;
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'partenaire', headerName: 'partenaire', width: 150 },
        { field: 'titre', headerName: 'titre', width: 100 },
        { field: 'description', headerName: 'description ', width: 100 },
        { field: 'fichier_contrat', headerName: 'fichier_contrat', width: 100 },
        { field: 'date_debut', headerName: 'date_debut', width: 100 },
        { field: 'date_fin', headerName: 'date_fin', width: 100 },
        { field: 'statut', headerName: 'statut', width: 100 },
        { field: 'date_creation', headerName: 'date_creation', width: 100 },
    ];

    return (
        <Sidebar>
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Gestion des Partenaires
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                                {/* Statistiques */}
                                <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
                    {statut.map((choice) => (
                        <Card key={choice.value} sx={{ flex: '1 1 100px', display: 'flex', alignItems: 'center', padding: 1 }}>
                            {typeIcons[choice.value]}
                            <Box ml={2}>
                                <Typography variant="h6">{choice.label} : {countByType(choice.value)}</Typography>
                            </Box>
                        </Card>
                    ))}
                </Box>
                <Box display="flex" gap={4} flexWrap="wrap">
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <DataGrid rows={contrats} columns={columns} autoHeight pageSize={5} />
                    )}
                </Box>
            </Box>
        </Sidebar>
    );
};

export default PartenaireContrat;
