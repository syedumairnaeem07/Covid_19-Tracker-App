import React, { useState, useEffect } from "react";
import {
	FormControl,
	MenuItem,
	Select,
	Card,
	CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import "./App.css";
import Table from "./Table";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import { sortData, prettyPrintStat } from "./util";

function App() {
	// State is basically we can say a way to write variable in react.
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState("worldwide");
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCenter, setMapCenter] = useState({
		lat: 34.80746,
		lng: -40.4796,
	});
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);
	const [casesType, setCasesType] = useState("cases");
	// disease.sh site we will use to get all the data related to covid-19 using the apis they provided us with on their site.
	// https://disease.sh/v3/covid-19/countries(Returns the whole data of countries related to covid-19)
	//we will use useEffect to call this Api
	//we can use more than one useEffect
	//this useEffect is used to display the countryInfo once the page loads
	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all")
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);
	//useEffect == Runs a piece of code based on a given condition.
	//[] thing is what we mean by condition we can add multiple conditions
	//here like [variable1,variable2......]
	useEffect(() => {
		//The code inside here will run once when the
		//component loads and not again after.
		//if add the condition than this code will run once
		//when the components load as well as when the condition changes

		//write internal async function to access api.we use async since
		//we will have to wait for the response and than we will do stuff
		const getCountriesData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then((response) => response.json())
				.then((data) => {
					//diff b/w map and foreach....map returns an array that we transformed
					//in our case an array of objects
					const countries = data.map((country) =>
						//returning an object modified according to our need
						//since we require only country name and iso2 for dropdown
						({
							name: country.country,
							value: country.countryInfo.iso2,
						})
					);
					const sortedData = sortData(data);
					setTableData(sortedData);
					setMapCountries(data);
					setCountries(countries);
				});
		};
		getCountriesData();
	}, []);

	const onCountryChange = async (event) => {
		const countryCode = event.target.value;
		//need to bring data from api once a country is selected
		const url =
			countryCode === "worldwide"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;
		await fetch(url)
			.then((response) => response.json())
			.then(async (data) => {
				setCountry(countryCode);
				//Whole data is stored here
				setCountryInfo(data);
				if (countryCode !== "worldwide") {
					setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				} else {
					setMapCenter({
						lat: 34.80746,
						lng: -40.4796,
					});
				}
				setMapZoom(3);
			});
	};

	return (
		// BEM naming convention for className
		// In BEM naming convention we name classes like: componentName(small letters)__Element(small letters).
		<div className="app">
			{/* In order to make it responsive we should arrange the objects accordingly
				So className="app__left" contains all the elements on left
			*/}
			<div className="app__left">
				<div className="app__header">
					<h1>COVID-19 TRACKER</h1>
					<FormControl className="app__dropdown">
						<Select
							variant="outlined"
							value={country}
							onChange={onCountryChange}
						>
							{/* What is required? A way to loop through countries array
            					and get us a MenuItem of each country. How to do that? will use map here. ES6 syntax*/}
							{/* {} are used to write javascript inside react.we call it JSX */}
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{countries.map((country) => (
								<MenuItem value={country.value}>
									{country.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className="app__stats">
					{/* info boxes same component but different values using props */}
					<InfoBox
						isYellow
						active={casesType === "cases"}
						onClick={(e) => setCasesType("cases")}
						title="Cases"
						cases={prettyPrintStat(countryInfo.todayCases)}
						total={prettyPrintStat(countryInfo.cases)}
					/>
					<InfoBox
						isGreen
						active={casesType === "recovered"}
						onClick={(e) => setCasesType("recovered")}
						title="Recovered"
						cases={prettyPrintStat(countryInfo.todayRecovered)}
						total={prettyPrintStat(countryInfo.recovered)}
					/>
					<InfoBox
						isRed
						active={casesType === "deaths"}
						onClick={(e) => setCasesType("deaths")}
						title="Deaths"
						cases={prettyPrintStat(countryInfo.todayDeaths)}
						total={prettyPrintStat(countryInfo.deaths)}
					/>
				</div>

				<Map
					casesType={casesType}
					countries={mapCountries}
					center={mapCenter}
					zoom={mapZoom}
				/>
			</div>
			{/* className = "app__right" contains all the elements on the right */}
			<Card className="app__right">
				<CardContent>
					<h3>Live Cases By Country</h3>
					<Table countries={tableData} />
					<h3 className="app__graphTitle">
						Worldwide new {casesType}
					</h3>
					<LineGraph className="app__graph" casesType={casesType} />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
