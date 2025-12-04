import { 
  Text, 
  ScrollView, 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  Dimensions,
  StatusBar,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Collapsible from 'react-native-collapsible';
import { BookingCommerce, ReservationDetail } from "@/types/booking";
import Configuration from "@/config/constants";
import { useAuth } from "@/contexts/AuthContext";
import useApi from "@/utils/useApi";
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

// Tipos extendidos para incluir detalles de reservas
interface BranchWithReservations extends BookingCommerce {
  reservations?: ReservationDetail[];
  occupancyRate?: number;
  showAllReservations?: boolean;
}

// Tipo para la respuesta de la API de reservas
interface ApiReservation {
  ID_Reserva: number;
  Hora_Inicio: string;
  Hora_Final: string;
  Estado: string;
  Monto: number;
  Fecha_de_creacion: string;
  ID_Espacio: number;
  Codigo: string;
  Disponible: boolean;
  ID_Sucursal: number;
  Nombre: string;
  Ubicacion: string;
  Espacios_Disponibles: number;
  Precio_Parqueo: number;
  Espacios_Totales: number;
  Limite_Hora_Parqueo: number;
  ID_Comercio: number;
  Activo: boolean;
  ID: number;
  Cliente: string;
  Vehiculo: string;
}

// Constantes para límites de paginación
const BRANCHES_PER_PAGE = 3;
const RESERVATIONS_PER_PAGE = 3;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Función para extraer solo la hora de un string ISO
const extractTimeOnly = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } catch (error) {
    return "00:00";
  }
};

// Función para agrupar reservas por sucursal
const groupReservationsByBranch = (reservations: ApiReservation[]): Record<number, ApiReservation[]> => {
  return reservations.reduce((acc, reservation) => {
    const branchId = reservation.ID_Sucursal;
    if (!acc[branchId]) {
      acc[branchId] = [];
    }
    acc[branchId].push(reservation);
    return acc;
  }, {} as Record<number, ApiReservation[]>);
};

export default function() {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [branches, setBranches] = useState<BranchWithReservations[]>([]);
  const [expandedBranchId, setExpandedBranchId] = useState<number | null>(null);
  const [searchBox, setSearchBox] = useState<string>("");
  const [filteredBranches, setFilteredBranches] = useState<BranchWithReservations[]>([]);
  const [displayedBranchesCount, setDisplayedBranchesCount] = useState<number>(BRANCHES_PER_PAGE);
  const [displayedBranches, setDisplayedBranches] = useState<BranchWithReservations[]>([]);
  
  // Estados para el modal de escaneo
  const [scanModalVisible, setScanModalVisible] = useState<boolean>(false);
  const [scanType, setScanType] = useState<'entrada' | 'salida' | null>(null);
  const [scanResult, setScanResult] = useState<string>('');
  const [scanning, setScanning] = useState<boolean>(false);
  const [manualCode, setManualCode] = useState<string>('');
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');

  const { session } = useAuth();
  const api = useApi();

  // Función para cargar sucursales y reservas
  const loadBranchesWithReservations = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obtener el ID del comercio desde la sesión
      const commerceId = session?.userData?.commerce?.ID_Comercio;
      
      if (!commerceId) {
        Alert.alert("Información", "No se pudo identificar el comercio");
        setLoading(false);
        return;
      }

      // Obtener sucursales y reservas en paralelo
      const [branchesResponse, bookingsResponse] = await Promise.all([
        api.get(`/api/branches/commerce/${commerceId}`),
        api.get(`/api/bookings/commerce/${commerceId}`)
      ]);

      if (branchesResponse.data.success && branchesResponse.data.data) {
        const branchesData = branchesResponse.data.data;
        let allReservations: ApiReservation[] = [];
        
        if (bookingsResponse.data.success && bookingsResponse.data.data) {
          allReservations = bookingsResponse.data.data;
        }
        
        // Agrupar reservas por sucursal
        const reservationsByBranch = groupReservationsByBranch(allReservations);
        
        // Filtrar solo reservas activas para el conteo
        const activeReservations = allReservations.filter(res => 
          res.Estado === 'activa' || res.Estado === 'en_curso'
        );

        // Mapear sucursales con datos
        const apiBranches: BranchWithReservations[] = branchesData.map((branch: any) => {
          const totalSpots = branch.Espacios_Totales || 0;
          const availableSpots = branch.Espacios_Disponibles || 0;
          const branchReservations = reservationsByBranch[branch.ID_Sucursal] || [];
          
          // Filtrar reservas activas para esta sucursal
          const activeReservationsForBranch = branchReservations.filter((res: ApiReservation) => 
            res.Estado === 'activa' || res.Estado === 'en_curso'
          );
          
          const occupancyRate = totalSpots > 0 
            ? Math.round((activeReservationsForBranch.length / totalSpots) * 100)
            : 0;

          return {
            id: branch.ID_Sucursal,
            title: branch.Nombre,
            location: branch.Ubicacion,
            nBookings: activeReservationsForBranch.length,
            availableSpots: availableSpots,
            totalSpots: totalSpots,
            img: `https://d1qe01kdo9e97u.cloudfront.net/assets/images/home-slide/tegucigalpa/9i97bjODRIrLoTGACnOhOZRUaMm1egSw7bns92r5.webp`,
            occupancyRate,
            showAllReservations: false,
            reservations: activeReservationsForBranch.map((reservation: ApiReservation) => ({
              id: reservation.ID_Reserva,
              espacio: reservation.Codigo,
              clientName: reservation.Cliente,
              clientPhone: "N/A",
              clientEmail: "N/A",
              vehiclePlate: reservation.Vehiculo,
              startTime: extractTimeOnly(reservation.Hora_Inicio),
              endTime: extractTimeOnly(reservation.Hora_Final),
              status: reservation.Estado === "activa" || reservation.Estado === "en_curso" ? "activa" : 
                     reservation.Estado === "pendiente" || reservation.Estado === "confirmada" ? "por_llegar" : "completada",
            }))
          };
        });
        
        setBranches(apiBranches);
        setFilteredBranches(apiBranches);
        
        // Calcular total de reservas activas
        const total = apiBranches.reduce((sum, branch) => sum + branch.nBookings, 0);
        setTotalBookings(total);
        
        // Inicializar con las primeras sucursales
        setDisplayedBranches(apiBranches.slice(0, BRANCHES_PER_PAGE));
        setDisplayedBranchesCount(BRANCHES_PER_PAGE);
      } else {
        setBranches([]);
        setFilteredBranches([]);
        setDisplayedBranches([]);
        setTotalBookings(0);
      }
    } catch (error: any) {
      console.error("Error cargando reservas activas:", error);
      
      let errorMessage = "Error de conexión con el servidor";
      
      if (error.response?.status === 404) {
        errorMessage = "No se encontraron sucursales o reservas";
      } else if (error.response?.status === 401) {
        errorMessage = "No autorizado. Por favor, inicia sesión nuevamente";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
      setBranches([]);
      setFilteredBranches([]);
      setDisplayedBranches([]);
      setTotalBookings(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session, api]);

  // Actualizar sucursales mostradas cuando cambia el searchBox o filteredBranches
  useEffect(() => {
    if (searchBox.trim() === "") {
      setFilteredBranches(branches);
      setDisplayedBranches(branches.slice(0, displayedBranchesCount));
    } else {
      const filtered = branches.filter(branch =>
        branch.title.toLowerCase().includes(searchBox.toLowerCase()) ||
        branch.location.toLowerCase().includes(searchBox.toLowerCase())
      );
      setFilteredBranches(filtered);
      setDisplayedBranches(filtered.slice(0, displayedBranchesCount));
    }
  }, [searchBox, branches, displayedBranchesCount]);

  // Cargar datos al montar
  useEffect(() => {
    if (session?.userData?.commerce?.ID_Comercio) {
      loadBranchesWithReservations();
    }
  }, [session]);

  // Recargar cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        if (session?.userData?.commerce?.ID_Comercio) {
          loadBranchesWithReservations();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }, [session, loadBranchesWithReservations])
  );

  const toggleBranch = (branchId: number) => {
    if (expandedBranchId === branchId) {
      // Cuando se contrae, también cerramos la vista de todas las reservas
      setBranches(prev => prev.map(branch => 
        branch.id === branchId ? { ...branch, showAllReservations: false } : branch
      ));
      setFilteredBranches(prev => prev.map(branch => 
        branch.id === branchId ? { ...branch, showAllReservations: false } : branch
      ));
      setDisplayedBranches(prev => prev.map(branch => 
        branch.id === branchId ? { ...branch, showAllReservations: false } : branch
      ));
    }
    setExpandedBranchId(expandedBranchId === branchId ? null : branchId);
  };

  const toggleShowAllReservations = (branchId: number) => {
    setBranches(prev => prev.map(branch => 
      branch.id === branchId ? { 
        ...branch, 
        showAllReservations: !branch.showAllReservations 
      } : branch
    ));
    setFilteredBranches(prev => prev.map(branch => 
      branch.id === branchId ? { 
        ...branch, 
        showAllReservations: !branch.showAllReservations 
      } : branch
    ));
    setDisplayedBranches(prev => prev.map(branch => 
      branch.id === branchId ? { 
        ...branch, 
        showAllReservations: !branch.showAllReservations 
      } : branch
    ));
  };

  const loadMoreBranches = () => {
    const newCount = displayedBranchesCount + BRANCHES_PER_PAGE;
    setDisplayedBranchesCount(newCount);
    setDisplayedBranches(filteredBranches.slice(0, newCount));
  };

  // Función para abrir el modal de escaneo
  const handleScan = (type: 'entrada' | 'salida') => {
    setScanType(type);
    setScanModalVisible(true);
    setScanResult('');
    setManualCode('');
    setScanning(false);
  };

  // Función para cerrar el modal
  const closeScanModal = () => {
    setScanModalVisible(false);
    setScanType(null);
    setScanResult('');
    setManualCode('');
    setScanning(false);
  };

  // Función para procesar el escaneo de QR
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanning(true);
    setScanResult(data);
    
    // Aquí puedes procesar el código QR escaneado
    // Por ejemplo, enviarlo a tu API para registrar entrada/salida
    Alert.alert(
      "Código QR Escaneado",
      `Código: ${data}\n\n¿Deseas registrar ${scanType === 'entrada' ? 'entrada' : 'salida'}?`,
      [
        { text: "Cancelar", style: "cancel", onPress: () => setScanning(false) },
        { 
          text: "Confirmar", 
          style: "default",
          onPress: async () => {
            try {
              // Aquí llamarías a tu API para registrar la entrada/salida
              // Ejemplo:
              // const response = await api.post(`/api/registrar-${scanType}`, { codigo: data });
              
              Alert.alert(
                "Éxito", 
                `${scanType === 'entrada' ? 'Entrada' : 'Salida'} registrada exitosamente`,
                [{ text: "OK", onPress: closeScanModal }]
              );
            } catch (error) {
              Alert.alert("Error", "No se pudo registrar la operación");
              setScanning(false);
            }
          }
        }
      ]
    );
  };

  // Función para procesar código manual
  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      Alert.alert("Error", "Por favor ingresa un código");
      return;
    }
    
    setScanResult(manualCode);
    Alert.alert(
      "Código Ingresado",
      `Código: ${manualCode}\n\n¿Deseas registrar ${scanType === 'entrada' ? 'entrada' : 'salida'}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar", 
          style: "default",
          onPress: async () => {
            try {
              // Aquí llamarías a tu API para registrar la entrada/salida
              // Ejemplo:
              // const response = await api.post(`/api/registrar-${scanType}`, { codigo: manualCode });
              
              Alert.alert(
                "Éxito", 
                `${scanType === 'entrada' ? 'Entrada' : 'Salida'} registrada exitosamente`,
                [{ text: "OK", onPress: closeScanModal }]
              );
            } catch (error) {
              Alert.alert("Error", "No se pudo registrar la operación");
            }
          }
        }
      ]
    );
  };

  // Función para alternar entre cámara frontal y trasera
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Función para seleccionar imagen de galería
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        // Aquí procesarías la imagen para extraer el código QR
        // Por ahora solo mostramos un mensaje
        Alert.alert("Imagen seleccionada", "La funcionalidad de extraer QR de imágenes está en desarrollo.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir la galería");
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'activa':
        return styles.statusActive;
      case 'por_llegar':
        return styles.statusUpcoming;
      case 'completada':
        return styles.statusCompleted;
      default:
        return {};
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'activa':
        return 'En estacionamiento';
      case 'por_llegar':
        return 'Por llegar';
      case 'completada':
        return 'Completada';
      default:
        return status;
    }
  };

  // Función para refrescar
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBranchesWithReservations();
  }, [loadBranchesWithReservations]);

  // Componente para manejar imágenes con fallback
  const BranchImage = ({ uri, branchId }: { uri: string; branchId: number }) => {
    const [imageError, setImageError] = useState(false);
    
    if (imageError || !uri || typeof uri !== 'string' || !uri.startsWith('http')) {
      return (
        <View style={[styles.branchImage, styles.branchImagePlaceholder]}>
          <Ionicons name="business-outline" size={30} color="#ccc" />
        </View>
      );
    }
    
    return (
      <Image 
        source={{ uri }} 
        style={styles.branchImage}
        onError={() => setImageError(true)}
      />
    );
  };

  if (loading && branches.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 15,
        }}
      >
        <ActivityIndicator size="large" color={ Configuration.SPOTTY_PRIMARY_COLOR } />
        <Text style={{ marginTop: 10, color: "#666" }}>Cargando reservas activas...</Text>
      </View>
    );
  }

  const totalBranches = filteredBranches.length;
  const hasMoreBranches = totalBranches > displayedBranchesCount;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Reservas activas</Text>
          <Text style={styles.subtitle}>{totalBookings} espacios reservados en total</Text>
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.search}>
        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.input}
          placeholder="Buscar establecimiento"
          placeholderTextColor="gray"
          value={searchBox}
          onChangeText={setSearchBox}
        />
        {searchBox.length > 0 && (
          <TouchableOpacity onPress={() => setSearchBox("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Botones de QR */}
      <View style={styles.scanContainer}>
        <TouchableOpacity 
          style={styles.scanButtonPrimary}
          onPress={() => handleScan('entrada')}
        >
          <Ionicons name="log-in-outline" size={22} color="#fff" />
          <Text style={styles.scanButtonText}>Registrar Entrada</Text>
          <Text style={styles.scanButtonSubText}>Escanear QR</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.scanButtonSecondary}
          onPress={() => handleScan('salida')}
        >
          <Ionicons name="log-out-outline" size={22} color={Configuration.SPOTTY_PRIMARY_COLOR} />
          <Text style={styles.scanButtonTextSecondary}>Registrar Salida</Text>
          <Text style={styles.scanButtonSubTextSecondary}>Escanear QR</Text>
        </TouchableOpacity>
      </View>

      {/* Contador de sucursales mostradas */}
      <View style={styles.branchesCounter}>
        <Text style={styles.branchesCounterText}>
          Mostrando {Math.min(displayedBranchesCount, totalBranches)} de {totalBranches} sucursales
        </Text>
      </View>

      {/* Lista de sucursales con reservas */}
      <ScrollView 
        style={styles.branchesContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Configuration.SPOTTY_PRIMARY_COLOR]}
            tintColor={Configuration.SPOTTY_PRIMARY_COLOR}
          />
        }
      >
        {displayedBranches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="calendar-outline" 
              size={60} 
              color={Configuration.SPOTTY_PRIMARY_COLOR}
              style={{ marginBottom: 15 }}
            />
            <Text style={styles.emptyText}>
              {searchBox ? "No se encontraron resultados" : "No hay reservas activas"}
            </Text>
            {!searchBox && (
              <Text style={styles.emptySubtext}>
                Todas las reservas están completadas o no hay reservas activas
              </Text>
            )}
          </View>
        ) : (
          <>
            {displayedBranches.map((branch) => {
              // Determinar qué reservas mostrar (máximo 3 inicialmente)
              const reservationsToShow = branch.reservations && branch.reservations.length > 0
                ? branch.showAllReservations
                  ? branch.reservations
                  : branch.reservations.slice(0, RESERVATIONS_PER_PAGE)
                : [];

              const hasMoreReservations = branch.reservations && branch.reservations.length > RESERVATIONS_PER_PAGE;
              
              return (
                <View key={branch.id} style={styles.branchCard}>
                  {/* Encabezado de la sucursal */}
                  <TouchableOpacity 
                    style={styles.branchHeader}
                    onPress={() => toggleBranch(branch.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.branchInfo}>
                      {/* Usar componente BranchImage */}
                      <BranchImage uri={branch.img} branchId={branch.id} />
                      
                      <View style={styles.branchText}>
                        <Text style={styles.branchTitle}>{branch.title}</Text>
                        <Text style={styles.branchLocation}>
                          <Ionicons name="location-outline" size={12} /> {branch.location}
                        </Text>
                        <View style={styles.branchStats}>
                          <View style={styles.statBadge}>
                            <Ionicons name="car-outline" size={12} color="#fff" />
                            <Text style={styles.statBadgeText}>{branch.nBookings} reservados</Text>
                          </View>
                          <Text style={styles.occupancyText}>
                            {branch.occupancyRate}% ocupación
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons 
                      name={expandedBranchId === branch.id ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color="#666" 
                    />
                  </TouchableOpacity>

                  {/* Detalles de reservas colapsables */}
                  <Collapsible collapsed={expandedBranchId !== branch.id}>
                    <View style={styles.reservationsContainer}>
                      <View style={styles.reservationsHeader}>
                        <Text style={styles.reservationsTitle}>Espacios Reservados:</Text>
                        {branch.reservations && branch.reservations.length > 0 && (
                          <Text style={styles.reservationsCount}>
                            {branch.reservations.length} total
                          </Text>
                        )}
                      </View>
                      
                      {(!branch.reservations || branch.reservations.length === 0) ? (
                        <View style={styles.noReservations}>
                          <Ionicons name="car-outline" size={40} color="#ccc" />
                          <Text style={styles.noReservationsText}>
                            No hay espacios reservados en este momento
                          </Text>
                        </View>
                      ) : (
                        <>
                          {reservationsToShow.map((reservation) => (
                            <View key={reservation.id} style={styles.reservationCard}>
                              {/* Encabezado de reserva */}
                              <View style={styles.reservationHeader}>
                                <View style={styles.spaceBadge}>
                                  <Ionicons name="car-sport-outline" size={16} color="#fff" />
                                  <Text style={styles.spaceText}>Espacio {reservation.espacio}</Text>
                                </View>
                                <View style={[styles.statusBadge, getStatusBadgeStyle(reservation.status)]}>
                                  <Text style={styles.statusText}>
                                    {getStatusText(reservation.status)}
                                  </Text>
                                </View>
                              </View>
                              
                              {/* Detalles de la reserva */}
                              <View style={styles.reservationDetails}>
                                <View style={styles.detailRow}>
                                  <Ionicons name="person-outline" size={16} color="#666" />
                                  <Text style={styles.detailLabel}>Cliente: </Text>
                                  <Text style={styles.detailValue}>{reservation.clientName}</Text>
                                </View>
                                
                                {reservation.clientPhone !== "N/A" && (
                                  <View style={styles.detailRow}>
                                    <Ionicons name="call-outline" size={16} color="#666" />
                                    <Text style={styles.detailLabel}>Teléfono: </Text>
                                    <Text style={styles.detailValue}>{reservation.clientPhone}</Text>
                                  </View>
                                )}
                                
                                <View style={styles.detailRow}>
                                  <Ionicons name="car-outline" size={16} color="#666" />
                                  <Text style={styles.detailLabel}>Vehículo: </Text>
                                  <Text style={styles.detailValue}>{reservation.vehiclePlate}</Text>
                                </View>
                                
                                <View style={styles.detailRow}>
                                  <Ionicons name="time-outline" size={16} color="#666" />
                                  <Text style={styles.detailLabel}>Horario: </Text>
                                  <Text style={styles.detailValue}>{reservation.startTime} - {reservation.endTime}</Text>
                                </View>
                                
                                {reservation.checkInTime && (
                                  <View style={styles.detailRow}>
                                    <Ionicons name="log-in-outline" size={16} color="#28a745" />
                                    <Text style={styles.detailLabel}>Entrada: </Text>
                                    <Text style={[styles.detailValue, { color: '#28a745' }]}>
                                      {reservation.checkInTime}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          ))}

                          {/* Botón para ver más/menos reservas */}
                          {hasMoreReservations && (
                            <TouchableOpacity
                              style={styles.viewMoreButton}
                              onPress={() => toggleShowAllReservations(branch.id)}
                            >
                              <Text style={styles.viewMoreText}>
                                {branch.showAllReservations 
                                  ? `Ver menos (mostrando ${branch.reservations?.length})` 
                                  : `Ver todas las reservas (${branch.reservations!.length - RESERVATIONS_PER_PAGE} más)`}
                              </Text>
                              <Ionicons 
                                name={branch.showAllReservations ? "chevron-up" : "chevron-down"} 
                                size={16} 
                                color={Configuration.SPOTTY_PRIMARY_COLOR} 
                              />
                            </TouchableOpacity>
                          )}
                        </>
                      )}
                      
                      {/* Estadísticas rápidas de la sucursal */}
                      <View style={styles.quickStats}>
                        <View style={styles.quickStat}>
                          <Text style={styles.quickStatLabel}>Total</Text>
                          <Text style={styles.quickStatValue}>{branch.totalSpots}</Text>
                        </View>
                        
                        <View style={styles.quickStat}>
                          <Text style={styles.quickStatLabel}>Reservados</Text>
                          <Text style={[styles.quickStatValue, { color: Configuration.SPOTTY_PRIMARY_COLOR }]}>
                            {branch.nBookings}
                          </Text>
                        </View>
                        
                        <View style={styles.quickStat}>
                          <Text style={styles.quickStatLabel}>Disponibles</Text>
                          <Text style={[styles.quickStatValue, { color: '#28a745' }]}>
                            {branch.availableSpots}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Collapsible>
                </View>
              );
            })}

            {/* Botón para cargar más sucursales */}
            {hasMoreBranches && (
              <TouchableOpacity
                style={styles.loadMoreBranchesButton}
                onPress={loadMoreBranches}
              >
                <Text style={styles.loadMoreBranchesText}>
                  Cargar más sucursales ({totalBranches - displayedBranchesCount} más)
                </Text>
                <Ionicons 
                  name="chevron-down" 
                  size={20} 
                  color={Configuration.SPOTTY_PRIMARY_COLOR} 
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      {/* Modal de escaneo QR - FULL SCREEN */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={scanModalVisible}
        onRequestClose={closeScanModal}
        statusBarTranslucent={true}
      >
        <View style={styles.modalFullScreen}>
          {/* Header del modal */}
          <SafeAreaView style={styles.modalHeaderContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <TouchableOpacity onPress={closeScanModal} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.modalTitleContainer}>
                  <Ionicons 
                    name={scanType === 'entrada' ? "log-in-outline" : "log-out-outline"} 
                    size={20} 
                    color="#fff" 
                  />
                  <Text style={styles.modalTitle}>
                    {scanType === 'entrada' ? 'Escanear Entrada' : 'Escanear Salida'}
                  </Text>
                </View>
              </View>
            </View>
          </SafeAreaView>

          {/* Contenido del modal */}
          <View style={styles.modalBody}>
            {permission === null ? (
              <View style={styles.permissionContainer}>
                <ActivityIndicator size="large" color={Configuration.SPOTTY_PRIMARY_COLOR} />
                <Text style={styles.permissionText}>Solicitando permiso para la cámara...</Text>
              </View>
            ) : permission === false ? (
              <View style={styles.permissionContainer}>
                <Ionicons name="camera-off-outline" size={60} color="#ff6b6b" />
                <Text style={styles.permissionText}>No tenemos permiso para acceder a la cámara</Text>
                <TouchableOpacity 
                  style={styles.permissionButton}
                  onPress={requestPermission}
                >
                  <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Vista de la cámara - Ocupa la mayor parte de la pantalla */}
                <View style={styles.cameraFullScreenContainer}>
                  <CameraView
                    style={styles.cameraFullScreen}
                    facing={facing}
                    onBarcodeScanned={scanning ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                      barcodeTypes: ['qr', 'pdf417', 'code128'],
                    }}
                  />
                  
                  {/* Marco de escaneo */}
                  <View style={styles.scanFrame}>
                    <View style={styles.scanFrameCornerTopLeft} />
                    <View style={styles.scanFrameCornerTopRight} />
                    <View style={styles.scanFrameCornerBottomLeft} />
                    <View style={styles.scanFrameCornerBottomRight} />
                  </View>
                  
                  {/* Instrucciones superiores */}
                  <View style={styles.topInstructions}>
                    <Text style={styles.instructionsText}>
                      Coloca el código QR dentro del marco
                    </Text>
                  </View>
                </View>

                {/* Controles en la parte inferior */}
                <View style={styles.bottomControls}>
                  {/* Entrada manual */}
                  <View style={styles.manualInputContainer}>
                    <Text style={styles.manualInputLabel}>O ingresa el código manualmente:</Text>
                    <View style={styles.manualInputRow}>
                      <TextInput
                        style={styles.manualInput}
                        placeholder="Ej: RESERVA-12345"
                        value={manualCode}
                        onChangeText={setManualCode}
                        autoCapitalize="characters"
                        onSubmitEditing={handleManualSubmit}
                      />
                      <TouchableOpacity 
                        style={[
                          styles.manualSubmitButton,
                          !manualCode.trim() && styles.manualSubmitButtonDisabled
                        ]}
                        onPress={handleManualSubmit}
                        disabled={!manualCode.trim()}
                      >
                        <Text style={styles.manualSubmitButtonText}>Enviar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Controles de cámara */}
                  <View style={styles.cameraControlsRow}>
                    <TouchableOpacity 
                      style={styles.cameraControlButton}
                      onPress={pickImage}
                    >
                      <Ionicons name="image-outline" size={24} color="#fff" />
                      <Text style={styles.cameraControlText}>Galería</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.cameraControlButton}
                      onPress={toggleCameraFacing}
                    >
                      <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
                      <Text style={styles.cameraControlText}>Voltear</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Resultado del escaneo */}
                  {scanResult && (
                    <View style={styles.resultContainer}>
                      <Text style={styles.resultLabel}>Código escaneado:</Text>
                      <Text style={styles.resultText}>{scanResult}</Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 16,
  },
  scanContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 15,
    gap: 10,
  },
  scanButtonPrimary: {
    flex: 1,
    backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
    paddingVertical: 18,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonSecondary: {
    flex: 1,
    backgroundColor: "#e8eef5",
    paddingVertical: 18,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Configuration.SPOTTY_PRIMARY_COLOR,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  scanButtonSubText: {
    color: "#dbe6ff",
    fontSize: 13,
  },
  scanButtonTextSecondary: {
    color: Configuration.SPOTTY_PRIMARY_COLOR,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  scanButtonSubTextSecondary: {
    color: Configuration.SPOTTY_PRIMARY_COLOR,
    fontSize: 13,
  },
  branchesCounter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  branchesCounterText: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  branchesContainer: {
    flex: 1,
  },
  branchCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  branchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  branchInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  branchImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  branchImagePlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  branchText: {
    flex: 1,
  },
  branchTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  branchLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  branchStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  statBadgeText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
  occupancyText: {
    fontSize: 12,
    color: "#666",
  },
  reservationsContainer: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  reservationsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reservationsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  reservationsCount: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#e9ecef",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  reservationCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: Configuration.SPOTTY_PRIMARY_COLOR,
  },
  reservationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  spaceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Configuration.SPOTTY_SECONDARY_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  spaceText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  statusUpcoming: {
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
  },
  statusCompleted: {
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  reservationDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  noReservations: {
    alignItems: "center",
    paddingVertical: 20,
  },
  noReservationsText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  quickStat: {
    alignItems: "center",
  },
  quickStatLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
  },
  viewMoreText: {
    color: Configuration.SPOTTY_PRIMARY_COLOR,
    fontWeight: "600",
    fontSize: 14,
    marginRight: 8,
  },
  loadMoreBranchesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  loadMoreBranchesText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },

  // Estilos para el modal de escaneo - MODAL FULL SCREEN
  modalFullScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeaderContainer: {
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  modalBody: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  // Estilos para permisos de cámara
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  permissionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  permissionButton: {
    backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Estilos para la cámara en pantalla completa
  cameraFullScreenContainer: {
    flex: 1,
    position: 'relative',
  },
  cameraFullScreen: {
    flex: 1,
  },
  
  // Estilos para el marco de escaneo
  scanFrame: {
    position: 'absolute',
    top: '20%',
    left: '15%',
    width: '70%',
    height: '35%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  scanFrameCornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 25,
    height: 25,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: Configuration.SPOTTY_PRIMARY_COLOR,
  },
  scanFrameCornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 25,
    height: 25,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: Configuration.SPOTTY_PRIMARY_COLOR,
  },
  scanFrameCornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 25,
    height: 25,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: Configuration.SPOTTY_PRIMARY_COLOR,
  },
  scanFrameCornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 25,
    height: 25,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: Configuration.SPOTTY_PRIMARY_COLOR,
  },
  
  // Instrucciones superiores
  topInstructions: {
    position: 'absolute',
    top: '10%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  // Controles inferiores
  bottomControls: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  
  // Entrada manual
  manualInputContainer: {
    marginBottom: 15,
  },
  manualInputLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
  },
  manualInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  manualInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  manualSubmitButton: {
    backgroundColor: Configuration.SPOTTY_PRIMARY_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  manualSubmitButtonDisabled: {
    backgroundColor: '#666',
  },
  manualSubmitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Controles de cámara en fila
  cameraControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  cameraControlButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 100,
  },
  cameraControlText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  
  // Resultado del escaneo
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  resultLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Configuration.SPOTTY_PRIMARY_COLOR,
  },
});