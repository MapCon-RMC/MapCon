import React, { useEffect, useState } from 'react';
import { DivOverlay, geoJSON, latLng, LayerGroup } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMapEvent, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { icon } from "leaflet"
import { useForm, Controller, reset, get } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext'
import axios from 'axios';
import { getSession } from 'next-auth/react'

const ICON = icon({
    iconUrl: "/marker.png",
    shadowUrl: '/marker-shadow.png',
    //   iconSize: [25, 41],
    iconAnchor: [12, 41]
})


export default function GeolocalizacaohMap({ protestId }) {

    const position = [-25.4845133, -49.2575359]
    const [showForm, setShowForm] = useState({ visible: false })
    const [coordenadas, setCoordenadas] = useState(null)

    const getCoords = async () => {
        const session = await getSession();
        const r = await axios.get('/api/mapcon/geolocalizacao', { params: { 
            protesto_num_seq_protesto: protestId,
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        } })
        r.data ? setCoordenadas({latitude:r.data.latitude , longitude: r.data.longitude}) : null
    }
    useEffect(() => {
        getCoords()
    }, [])

    function onMapRightClicked(pos, marker_pos) {

        const dados = {
            nivel_exatidao: '',
            latitude: String(pos.lat),
            longitude: String(pos.lng),
            protesto_num_seq_protesto: String(protestId),
            raio: ''
        }


        setShowForm({ data: dados, marker_pos: marker_pos, pos: pos, visible: true })
    }


    return (
        <>
            <MapContainer style={{ height: 400, width: "100%" }} center={latLng(position)} zoom={10} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png" />

                <LocationMarker coordenadas={coordenadas} mapClicked={(c, m) => onMapRightClicked(c, m)} />

            </MapContainer>
            <GeolocalizacaoForm showForm={showForm} closeForm={() => setShowForm({ visible: false })} ></GeolocalizacaoForm>
        </>
    )
}

function LocationMarker({ coordenadas, mapClicked }) {
    const [position, setPosition] = useState(null)

  
    useEffect(() => {
        setPosition(coordenadas ? { lat: coordenadas.latitude, lng: coordenadas.longitude } : null)
    }, [coordenadas])


    const markerSelected = () => {
        console.log('selecionou marcador')
    }


    const map = useMapEvents({
        contextmenu(e) {

            mapClicked(e.latlng, setPosition)
            // setPosition(e.latlng)
        },
    })

    return position === null ? null : (
        <Marker icon={ICON} position={position} closeForm={() => setShowForm(false)}>
            <Popup> <div onClick={() => markerSelected()} >Remover Marcador</div></Popup>
        </Marker>
    )
}



/*
    Dialog Adicionar uma posição geográfica
*/
function GeolocalizacaoForm({ showForm, closeForm }) {

    const exatidao = [
        { id: 'Exato' },
        { id: 'Estimado' },
        { id: 'Percurso' }
    ]
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            nivel_exatidao: '',
            latitude: '',
            longitude: '',
            protesto_num_seq_protesto: '',
            raio: ''
        }
    });


    useEffect(() => {
        reset( showForm.data )
    }, [showForm.data])


    console.log(showForm)

    const onSubmit = async data => {
        data['protesto_num_seq_protesto'] = showForm.data.protesto_num_seq_protesto
        const session = await getSession();
        await axios.post('/api/mapcon/geolocalizacao',{
            ...data,
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        })

        showForm.marker_pos(showForm.pos)
        closeForm(true)
    }

    return (

        <Dialog header="Adicionar Marcador" className="p-fluid" modal visible={showForm.visible} onHide={(closeForm)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid p-formgrid p-grid p-mt-lg-4 p-mt-4">
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="latitude">Latitude*</label>
                        <Controller name="latitude" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <InputText disabled={true} className={showForm.latitude ? "p-invalid" : ""} value={value} onChange={onChange}></InputText>
                        } />
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="longitude">Longitude*</label>
                        <Controller name="longitude" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <InputText disabled={true}  className={showForm.longitude ? "p-invalid" : ""} value={value} onChange={onChange}></InputText>
                        } />
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="nivel_exatidao">Nível de Exatidão*</label>
                        <Controller name="nivel_exatidao" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <Dropdown className={showForm.nivel_exatidao && 'p-invalid'} value={value} options={exatidao} onChange={e => onChange(e.value)} optionLabel="id" optionValue="id" showClear placeholder="Selecione um nível de exatidão" />
                        } />
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="raio">Raio*</label>
                        <Controller name="raio" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <InputText className={showForm.raio ? "p-invalid" : ""} value={value} onChange={onChange}></InputText>
                        } />
                    </div>


                    <div className="p-field p-col-12 p-md-offset-6 p-md-6">
                        <Button label={showForm.data !== undefined ? "Atualizar" : "Adicionar"} icon="pi pi-check" />
                    </div>
                </div>
            </form>
        </Dialog>
    )
}


