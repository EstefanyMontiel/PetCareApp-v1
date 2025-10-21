    import React, { useState } from 'react';
    import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    TextInput,
    FlatList,
    Dimensions,
    } from 'react-native';
    import { Ionicons } from '@expo/vector-icons';
    import styles from '../styles/HuellitasScreenStyles';
    
    const { width } = Dimensions.get('window');
    const ITEM_WIDTH = (width - 45) / 2;

    export default function HuellitasEternasScreen() {
    const [activeTab, setActiveTab] = useState('misPeludos'); // 'misPeludos' o 'galeria'
    
    // Datos de ejemplo - conectar con tu base de datos
    const [misMascotasInactivas] = useState([
        {
        id: '1',
        nombre: 'Luna',
        foto: 'https://www.aon.es/personales/seguro-perro-gato/wp-content/uploads/sites/2/2021/04/bichon-maltes.jpg',
        fechaDespedida: '2024-05-15',
        mensaje: 'Siempre fuiste mi compañera fiel',
        likes: 15,
        },
    ]);

    const [galeriaComunitaria] = useState([
        {
        id: '1',
        usuario: 'María García',
        mascota: 'Daisy',
        foto: 'https://example.com/daisy.jpg',
        mensaje: 'Tu lealtad quedó marcada en mi corazón',
        likes: 16,
        comentarios: 3,
        },
        {
        id: '2',
        usuario: 'Carlos Ruiz',
        mascota: 'Buddy',
        foto: 'https://example.com/buddy.jpg',
        mensaje: 'Siempre serás parte de nuestra familia',
        likes: 23,
        comentarios: 5,
        },
    ]);

    const renderMiMascotaCard = ({ item }) => (
        <View style={styles.myPetCard}>
        <Image source={{ uri: item.foto }} style={styles.petImage} />
        <View style={styles.petInfo}>
            <Text style={styles.petName}>{item.nombre}</Text>
            <Text style={styles.petDate}>{item.fechaDespedida}</Text>
            <Text style={styles.petMessage}>{item.mensaje}</Text>
            <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart" size={20} color="#6B9B8E" />
                <Text style={styles.actionText}>{item.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-social-outline" size={20} color="#6B9B8E" />
                <Text style={styles.actionText}>Compartir</Text>
            </TouchableOpacity>
            </View>
        </View>
        </View>
    );

    const renderGaleriaCard = ({ item }) => (
        <View style={styles.galeriaCard}>
        <View style={styles.cardHeader}>
            <View style={styles.userInfo}>
            <View style={styles.avatar}>
                <Ionicons name="person" size={20} color="#fff" />
            </View>
            <View>
                <Text style={styles.userName}>{item.usuario}</Text>
                <Text style={styles.petNameSmall}>En memoria de {item.mascota}</Text>
            </View>
            </View>
            <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
        </View>

        <Image source={{ uri: item.foto }} style={styles.galeriaImage} />

        <View style={styles.cardActions}>
            <View style={styles.leftActions}>
            <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="heart-outline" size={28} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="chatbubble-outline" size={26} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="share-outline" size={26} color="#000" />
            </TouchableOpacity>
            </View>
        </View>

        <View style={styles.cardFooter}>
            <Text style={styles.likes}>{item.likes} me gusta</Text>
            <Text style={styles.caption}>
            <Text style={styles.captionUser}>{item.usuario}</Text> {item.mensaje}
            </Text>
            <TouchableOpacity>
            <Text style={styles.viewComments}>
                Ver los {item.comentarios} comentarios
            </Text>
            </TouchableOpacity>
        </View>
        </View>
    );

    return (
        <View style={styles.container}>
        {/* Header con descripción */}
        <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Huellitas Eternas</Text>
            <Text style={styles.headerSubtitle}>
            Un espacio para honrar y recordar a nuestros compañeros que dejaron huellas
            en nuestros corazones
            </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
            <TouchableOpacity
            style={[styles.tab, activeTab === 'misPeludos' && styles.activeTab]}
            onPress={() => setActiveTab('misPeludos')}
            >
            <Text
                style={[styles.tabText, activeTab === 'misPeludos' && styles.activeTabText]}
            >
                Mis Peludos
            </Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={[styles.tab, activeTab === 'galeria' && styles.activeTab]}
            onPress={() => setActiveTab('galeria')}
            >
            <Text
                style={[styles.tabText, activeTab === 'galeria' && styles.activeTabText]}
            >
                Galería Comunitaria
            </Text>
            </TouchableOpacity>
        </View>

        {/* Sección "Rincón de recuerdos" para compartir */}
        {activeTab === 'misPeludos' && (
            <View style={styles.shareSection}>
            <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="add-circle-outline" size={24} color="#6B9B8E" />
                <Text style={styles.shareButtonText}>Compartir recuerdo</Text>
            </TouchableOpacity>
            </View>
        )}

        {/* Contenido según tab activo */}
        <FlatList
            data={activeTab === 'misPeludos' ? misMascotasInactivas : galeriaComunitaria}
            renderItem={
            activeTab === 'misPeludos' ? renderMiMascotaCard : renderGaleriaCard
            }
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
        />
        </View>
    );
    }