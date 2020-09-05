import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, cases, isRed, active, total, ...props }) {
	return (
		// in bem we use __ for elements and -- if it is modifying the element
		<Card
			className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}
			onClick={props.onClick}
		>
			<CardContent>
				<Typography className="infoBox__title" color="textSecondary">
					{title}
				</Typography>
				<h1 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h1>
				<Typography className="infoBox__total" color="textSecondary">
					Total {total}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default InfoBox;
