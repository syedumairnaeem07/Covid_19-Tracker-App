import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({
	title,
	cases,
	isRed,
	isYellow,
	isGreen,
	active,
	total,
	...props
}) {
	return (
		// in bem we use __ for elements and -- if it is modifying the element
		<Card
			className={`infoBox ${active && "infoBox--selected"} ${
				isYellow && "infoBox--yellow"
			} ${isGreen && "infoBox--green"} ${isRed && "infoBox--red"}`}
			onClick={props.onClick}
		>
			<CardContent>
				<Typography className="infoBox__title" color="textSecondary">
					{title}
				</Typography>
				<h1
					className={`infoBox__cases ${
						isYellow && "infoBox__cases--yellow"
					} ${
						isGreen && "infoBox__cases--green"
					} ${
						isRed && "infoBox__cases--red"
					}`}
				>
					{cases}
				</h1>
				<Typography className="infoBox__total" color="textSecondary">
					Total {total}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default InfoBox;
