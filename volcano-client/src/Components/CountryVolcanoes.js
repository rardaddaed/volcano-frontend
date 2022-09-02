import React from 'react'
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Select from "react-select";

function CountryVolcanoes() {

    const countriesUrl = "http://sefdb02.qut.edu.au:3001/countries";
    
    const [countryVolcanoRowData, setCountryVolcanoRowData] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState();
    const kmOptions = [
        { value: '--', label: '--' },
        { value: '5km', label: '5km' },
        { value: '10km', label: '10km' },
        { value: '30km', label: '30km' },
        { value: '100km', label: '100km' }
    ];
    const [selectedKm, setSelectedKm] = useState();

    const navigate = useNavigate();

    const countryVolcanoColumns = [
        { headerName: "Id", field: "id", hide: true },
        { headerName: "Country", field: "country" },
        { headerName: "Name", field: "name", sortable: true, filter: 'agTextColumnFilter' },
        { headerName: "Region", field: "region", filter: 'agTextColumnFilter' },
        { headerName: "Subregion", field: "subregion", filter: 'agTextColumnFilter' }
    ];

    // Fetch list of countries and map to React Select format
    useEffect(() => {
        const fetchCountries = async () => {
            const res = await fetch(countriesUrl);
            const data = await res.json();
            const options = data.map(country => ({ value: country, label: country }))
            setCountryOptions(options);
        }

        fetchCountries();
    }, []);

    // Fetch the selected country data, with the populatedWithin query string if selected
    useEffect(() => {
        if (selectedCountry) {
            let countryVolcanoUrl = `http://sefdb02.qut.edu.au:3001/volcanoes?country=${selectedCountry}`;
            if (selectedKm && selectedKm !== '--') {
                countryVolcanoUrl += `&populatedWithin=${selectedKm}`;
            }
            async function fetchCountryVolcanoes() {
                const res = await fetch(countryVolcanoUrl);
                const data = await res.json();
                const volcanoes = data.map(volcano => {
                    return {
                        id: volcano.id,
                        name: volcano.name,
                        country: volcano.country,
                        region: volcano.region,
                        subregion: volcano.subregion
                    };
                });
                setCountryVolcanoRowData(volcanoes);
            }

            fetchCountryVolcanoes();
        }
    }, [selectedCountry, selectedKm])

    // Return two dropdowns to obtain selected country and selected km, and populate data into AgGird
    return (
        <>
            {countryOptions && (
                <>
                    <div className='select-container'>
                        <div className='select-wrapper'>
                            <Select styles={{ minWidth: '200px' }}
                                isDisabled={false}
                                isLoading={false}
                                isClearable={false}
                                isRtl={false}
                                isSearchable={true}
                                options={countryOptions}
                                placeholder='Country'
                                onChange={selectedOption => setSelectedCountry(selectedOption.value)}
                            />
                        </div>
                        <div className='select-wrapper'>
                            <Select
                                isDisabled={false}
                                isLoading={false}
                                isClearable={false}
                                isRtl={false}
                                isSearchable={false}
                                options={kmOptions}
                                placeholder='Populated within...'
                                onChange={selectedOption => setSelectedKm(selectedOption.value)}
                            />
                        </div>
                    </div>
                    <div className='grid-container ag-theme-balham'>
                        <AgGridReact
                            columnDefs={countryVolcanoColumns}
                            rowData={countryVolcanoRowData}
                            pagination={true}
                            paginationPageSize={12}
                            onRowClicked={(row) => navigate(`/volcanolist/${row.data.id}`)}
                        />
                    </div>
                </>
            )}
        </>
    )

}

export default CountryVolcanoes