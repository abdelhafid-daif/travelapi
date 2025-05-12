import { useEffect, useState } from 'react';
import { fetchPartenaireStats, fetchContratStats } from '../../api/part';
import {
  Grid, useTheme,Box,Avatar
} from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid
} from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton,Paper  } from '@mui/material';
import {Divider } from '@mui/joy';
import Sidebar from '../../components/Sidebar';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';
import SvgIcon from '@mui/joy/SvgIcon';
import { Hotel, DirectionsBus, LocalAtm, AccessAlarm, Help } from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function StatistiquesPartenaires() {
  const [typeData, setTypeData] = useState([]);
  const [statutData, setStatutData] = useState([]);
  const [parMois, setParMois] = useState([]);
  const [partenaires, setPartenaires ] =useState([]);

  const theme = useTheme();
  const mediaUrl = import.meta.env.VITE_MEDIA_URL;

  useEffect(() => {
    fetchPartenaireStats().then(data => {
      const predefinedTypes = ['hotel', 'transport', 'guide', 'agence_locale', 'autre'];
      const result = predefinedTypes.map(type => ({
        name: type,
        value: data.type_counts[type] || 0 // Si le type n'existe pas dans les données, on lui attribue 0
      }));
      setTypeData(result);

    });

    fetchContratStats().then(data => {
      const statuts = Object.entries(data.statut_counts).map(([name, value]) => ({
        name,
        value
      }));
      setStatutData(statuts);
      setParMois(data.contrats_par_mois);
      console.log('partenaires',data.partenaires);
      setPartenaires(data.partenaires);
    });

  }, []);
  const PartnerCard = ({ type, count }) => {
    const getCardColor = (type) => {
      switch (type) {
        case 'hotel':
          return '#28a745'; // Green
        case 'transport':
          return '#17a2b8'; // Cyan
        case 'guide':
          return '#ffc107'; // Yellow
        case 'agence_locale':
          return '#dc3545'; // Red
        case 'autre':
          return '#6c757d'; // Gray
        default:
          return '#6c757d'; // Gray
      }
    };
  
    const getIcon = (type) => {
      switch (type) {
        case 'hotel':
          return <Hotel  sx={{ fontSize: 40}} />;
        case 'transport':
          return <DirectionsBus sx={{ fontSize: 40}} />;
        case 'guide':
          return <LocalAtm sx={{ fontSize: 40}} />;
        case 'agence_locale':
          return <AccessAlarm sx={{ fontSize: 40}} />;
        case 'autre':
          return <Help sx={{ fontSize: 40}} />;
        default:
          return <Help sx={{ fontSize: 40}} />;
      }
    };
  
    const cardColor = getCardColor(type);
    const icon = getIcon(type);
  
    return (
      <Card variant="outlined" sx={{ width: 200, backgroundColor: cardColor, color: 'white', margin: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ fontSize: 40, marginBottom: 1 }}>
            {icon}
          </Box>
          <Typography variant="body3" fontWeight="bold" sx={{ color:'white'}}>{type}</Typography>
          <Divider sx={{ my: 1, bgcolor: 'white' }} />
          <Typography variant="h2" fontWeight="bold" sx={{ color:'white'}}>{count} partenaires</Typography>
        </CardContent>
      </Card>
    );
  };
  
  const columns =[
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'partenaire__id', headerName: 'part_id', width: 60 },
    { field: 'partenaire__nom', headerName: 'nom', width: 150 },
    { field: 'partenaire__type_partenaire', headerName: 'Type', width: 150 },
    { field: 'partenaire__adresse', headerName: 'Adresse', width: 120 },
    { field: 'titre', headerName: 'titre', width: 150 },
    { field: 'description', headerName: 'description', width: 130 },
    { field: 'date_debut', headerName: 'date_debut', width: 120 },
    { field: 'date_fin', headerName: 'date_fin', width: 120 },
    { field: 'statut', headerName: 'statut', width: 90 },
    {
      field: 'fichier_contrat',
      headerName: 'Contrat',
      width: 90,
      renderCell: (params) => {
        const contrat = params.row;
        console.log('Contrat Row:', contrat); // Log the entire row to verify data
        console.log('Fichier Contrat:', contrat.fichier_contrat);
  
        if (!contrat.fichier_contrat) {
          return <Typography variant="body2">Pas de fichier</Typography>;
        }
  
        const downloadFichier = async () => {
          const fileUrl = getSecureFilesContratUrl(contrat.fichier_contrat);
          const fileName = contrat.fichier_contrat.split('/').pop();
  
          try {
            const response = await fetch(fileUrl, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            });
  
            if (!response.ok) throw new Error('Le téléchargement a échoué');
  
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(url); // Clean up the URL
          } catch (error) {
            console.error('Erreur de téléchargement du fichier:', error);
          }
        };
  
        return (
            <IconButton
              color="primary"
              sx={{ textTransform: 'none' }}
              onClick={downloadFichier}
            >
              <DownloadIcon />
            </IconButton>
        );
      }
    },
   {
      field: 'commercial_info',
      headerName: 'Commercial',
      width: 220,
      sortable: false,
      renderCell: (params) => {
        const email = params.row.partenaire__commercial_responsable__email;
        const avatar = params.row.avatar;
        const avatarUrl = avatar
          ? `${mediaUrl}/media/${avatar}`
          : 'https://via.placeholder.com/40';
        console.log('avatarUrl',avatarUrl);
  
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={avatarUrl} alt="avatar" sx={{ width: 32, height: 32 }} />
            {email}
          </Box>
        );
      },
    },
  ];

  

  return (
  <Sidebar>

    <Box
        sx={{
          p: 2,
          maxWidth: {
            xs: '100%',  
            sm: '600px',  
            md: '800px', 
            lg: '1300px'  
          },
          margin: '0 auto' 
        }}
      > 
      <Typography variant="h6" gutterBottom>
        Statistiques par Type de Partenaire
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} justifyContent="center">
          {typeData.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.name}>
              <PartnerCard type={item.name} count={item.value} />
            </Grid>
          ))}
        </Grid>
      </Box>


          <Grid container spacing={3} padding={2}>


            <Grid item xs={12} sm={6} md={4}>
            <Card variant={'soft'} color={'primary'} sx={{ minWidth: 300 , backgroundColor:"#fff" }}>
            <Typography
              level="title-md"
              textColor="inherit"
              sx={{ textTransform: 'capitalize' }}
            >
              Par Type de Partenaire
            </Typography>
                <CardContent>

                  <PieChart width={250} height={250}>
                    <Pie
                      data={typeData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      cornerRadius={5}
                      startAngle={0}
                      endAngle={380}
                      cx={150}
                      cy={150}
                      label
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
            <Card variant={'soft'} color={'primary'} sx={{ minWidth: 543,backgroundColor:"#fff"  }}>
              <Typography
                level="title-md"
                textColor="inherit"
                sx={{ textTransform: 'capitalize' }}
              >Statut des Contrats</Typography>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contrats par Mois
                  </Typography>
                  <LineChart width={250} height={200} data={parMois}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count"  stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
          <Typography variant="h4" gutterBottom>
                Statistiques des Partenaires
              </Typography>
            
          <Card variant="solid" color="primary" invertedColors>
            <CardContent>
              <Box sx={{ width: '100%', overflow: 'auto', minHeight:'500px'}}>
                <DataGrid
                  sx={{ width: '100%', overflow: 'auto', minHeight:'500px'}}
                  rows={partenaires}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  getRowHeight={() => 'auto'}
                  showCellVerticalBorder
                  showColumnVerticalBorder
                  checkboxSelection
                  disableSelectionOnClick
                />
              </Box>
            </CardContent>
          </Card>
          </Box>
    </Sidebar>

  );
}
