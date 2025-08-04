import React, { useEffect } from 'react';  
import { DivOverlay, geoJSON, latLng, LayerGroup } from 'leaflet';  
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMapEvent, useMapEvents, CircleMarker, ZoomControl } from 'react-leaflet'  
import 'leaflet/dist/leaflet.css';  
import { useState } from 'react';  
import { icon } from "leaflet"  
import { useForm, Controller, reset } from 'react-hook-form';  
import { Dialog } from 'primereact/dialog';  
import { Button } from 'primereact/button'  
import { Dropdown } from 'primereact/dropdown';  
import { InputText } from 'primereact/inputtext'  
import axios from 'axios';  

// Define um ícone customizado para os marcadores no mapa usando imagens locais
const ICON = icon({
    iconUrl: "/marker.png",
    shadowUrl: '/marker-shadow.png',
    // iconSize: [25, 41], // comentado, tamanho padrão será usado
    iconAnchor: [12, 41] // ponto do ícone que ficará na coordenada do mapa
})

export default function MainMap({ conflitos }) {
    // Posição inicial do mapa (latitude, longitude)
    const position = [-25.4845133, -49.2575359]

    // Estado para controle de exibição do formulário modal (visível ou não) e seus dados
    const [showForm, setShowForm] = useState({ visible: false })

    // Estado para armazenar coordenadas atuais (não usado diretamente no código mostrado)
    const [coordenadas, setCoordenadas] = useState(null)

    // Código comentado que buscaria dados iniciais com axios para popular coordenadas
    /*
    useEffect(async () => {
        const r = await axios.get('/api/mapcon/geolocalizacao', { params: { protesto_num_seq_protesto: protestId } })
        r.data ? setCoordenadas({latitude:r.data.latitude , longitude: r.data.longitude}) : null
    }, [])
    */

    // Limites geográficos do estado do Paraná para restringir o mapa
    const boundsParana = [
        [-26.7166667, -54.6188889],  // canto sudoeste
        [-22.5161111, -48.0936111]   // canto nordeste
    ]

    // Função que será chamada quando o usuário clicar com o botão direito no mapa (não ligada no código)
    function onMapRightClicked(pos, marker_pos) {
        // Monta os dados para o formulário com a posição clicada
        const dados = {
            nivel_exatidao: '',
            latitude: String(pos.lat),
            longitude: String(pos.lng),
            protesto_num_seq_protesto: String(protestId),
            raio: ''
        }

        // Atualiza estado para mostrar o formulário com os dados da posição clicada
        setShowForm({ data: dados, marker_pos: marker_pos, pos: pos, visible: true })
    }

    return (
        <>
            {/* Container do mapa com várias configurações */}
            <MapContainer 
                zoomControl={true} 
                style={{ height: "calc(100vh - 43px - 1.125rem)", width: "100vw" }} 
                center={latLng(position)} 
                zoom={10} 
                scrollWheelZoom={true} 
                minZoom={7} 
                maxZoom={18} 
                maxBounds={boundsParana}        // Limita o mapa ao território do Paraná
                maxBoundsViscosity={0.35}       // Suaviza o efeito de restrição ao arrastar
            >
                {/* Camada base do mapa - aqui usando tiles claros do CartoDB */}
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png" 
                />

                {/* 
                    Renderiza marcadores circulares vermelhos para cada conflito passado via props.
                    Usa CircleMarker com popup para mostrar data e tema do protesto.
                */}
                {conflitos.length > 0 && conflitos.map((element) => {
                    return (
                        <CircleMarker 
                            key={`${element.protesto_num_seq_protesto}`} 
                            center={[element.latitude, element.longitude]} 
                            radius={5} 
                            pathOptions={{ color: 'red', fillColor: 'red' }}
                        >
                            <Popup>
                                <p><b>{element.data}</b></p>
                                {element.tema_protesto}
                            </Popup>
                        </CircleMarker>
                    )
                })}

                {/* 
                    ZoomControl poderia ser adicionado, mas está comentado.
                    <ZoomControl position={'topright'}></ZoomControl> 
                */}
            </MapContainer>
        </>
    )
}
