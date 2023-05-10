import React, { useEffect, useState } from "react";
import { API_URL } from "../constants";
import { AgGridReact } from 'ag-grid-react';
import Button from '@mui/material/Button';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import AddCar from "./AddCar";
import EditCar from "./EditCar";

export default function Carlist() {
    const [cars, setCars] = useState([]);

    const [columnDefs] = useState([
        { field: 'brand', sortable: true, filter: true },
        { field: 'model', sortable: true, filter: true },
        { field: 'color', sortable: true, filter: true },
        { field: 'fuel', sortable: true, filter: true },
        { field: 'year', sortable: true, filter: true, width: 100 },
        { field: 'price', sortable: true, filter: true, width: 120 },
        { cellRenderer: params => <EditCar data={params.data} updateCar={updateCar} />, width: 100 },
        { cellRenderer: params => <Button color='error' size='small' onClick={() => deleteCar(params.data)}>Delete</Button>, width: 100 }
    ])

    const getCars = () => {
        //fetch cars
        fetch(API_URL + '/cars')
            .then(response => {
                if (response.ok)
                    return response.json();
                else
                    alert('Fetch failed');
            })
            .then(data => setCars(data._embedded.cars))
            .catch(err => console.error(err))
    }
    useEffect(() => {
        getCars();
    }, []);

    const deleteCar = (data) => {
        if (window.confirm('Are you sure?')) {
            fetch(data._links.car.href, { method: 'DELETE' })
                .then(response => {
                    if (response.ok)
                        getCars();
                    else
                        alert('Operation failed')
                })
        }

    }

    const addCar = (car) => {
        fetch(API_URL + "/cars", {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(car)
        })
            .then(response => {
                if (response.ok)
                    getCars();
                else
                    alert('Add failed');
            })
            .catch(err => console.error(err));
    }

    const updateCar = (car, url) => {
        fetch(url, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(car)
        })
            .then(response => {
                if (response.ok)
                    getCars();
                else
                    alert('Edit failed');
            })
            .catch(err => console.error(err))
    }
    return (
        <>
            <AddCar addCar={addCar} />
            <div className="ag-theme-material" style={{ height: 600, width: '90%', margin: 'auto' }}>
                <AgGridReact
                    rowData={cars}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={10}
                />
            </div>
        </>
    )
}