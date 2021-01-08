
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	AreaSeries,
	CandlestickSeries,
	LineSeries,
	MACDSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
	OHLCTooltip,
	MovingAverageTooltip,
	MACDTooltip,
} from "react-stockcharts/lib/tooltip";
import { ema, macd, sma } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { discontinuousTimeScaleProviderBuilder } from "react-stockcharts/lib/scale";

const mouseEdgeAppearance = {
	textFill: "#542605",
	stroke: "#05233B",
	strokeOpacity: 1,
	strokeWidth: 3,
	arrowWidth: 5,
	fill: "#BCDEFA",
};

function getMaxUndefined(calculators) {
	return calculators.map(each => each.undefinedLength()).reduce((a, b) => Math.max(a, b));
}
const LENGTH_TO_SHOW = 180;

class CandleStickChartWithMACDIndicator extends React.Component {
	constructor(props) {
		super(props);
		const { data: inputData } = props;

		const ema26 = ema()
			.id(0)
			.options({ windowSize: 26 })
			.merge((d, c) => {d.ema26 = c;})
			.accessor(d => d.ema26);

		const maxWindowSize = getMaxUndefined([ema26]);
		/* SERVER - START */
		const dataToCalculate = inputData.slice(-LENGTH_TO_SHOW - maxWindowSize);

		const calculatedData = ema26(dataToCalculate);
		const indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();

		// console.log(inputData.length, dataToCalculate.length, maxWindowSize)
		const { index } = indexCalculator(calculatedData);
		/* SERVER - END */

		const xScaleProvider = discontinuousTimeScaleProviderBuilder()
			.withIndex(index);
		const { data: linearData, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData.slice(-LENGTH_TO_SHOW));

		// console.log(head(linearData), last(linearData))
		// console.log(linearData.length)

		this.state = {
			last: false,
			ema26,
			linearData,
			data: linearData,
			xScale,
			xAccessor, displayXAccessor
		};
	}
	render() {
		const { type, data: initialData, width, ratio } = this.props;
		const ema26 = ema()
			.id(0)
			.options({ windowSize: 26 })
			.merge((d, c) => { d.ema26 = c; })
			.accessor(d => d.ema26);

		const calculatedData = ema26(initialData);
		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData);

		return (
			<ChartCanvas height={600}
				width={width}
				ratio={ratio}
				margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
			>
				<Chart id={1} height={550}
					yExtents={[d => [d.high, d.low], ema26.accessor()]}
					padding={{ top: 10, bottom: 20 }}
				>
					<YAxis axisAt="right" orient="right" ticks={5} inverted={true}
						tickStroke="#FFFFFF" />

					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0}
						stroke="#FFFFFF" opacity={0.5} />

					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<CandlestickSeries
						stroke={d => d.close > d.open ? "#6BA583" : "#DB0000"}
						wickStroke={d => d.close > d.open ? "#6BA583" : "#DB0000"}
						fill={d => d.close > d.open ? "#6BA583" : "#DB0000"} />
					<CandlestickSeries />

					<LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()}/>

					<CurrentCoordinate yAccessor={ema26.accessor()} fill={ema26.stroke()} />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close}
						fill={d => d.close > d.open ? "#A2F5BF" : "#F9ACAA"}
						stroke={d => d.close > d.open ? "#0B4228" : "#6A1B19"}
						textFill={d => d.close > d.open ? "#0B4228" : "#420806"}
						strokeOpacity={1}
						strokeWidth={3}
						arrowWidth={2}
					/>

					<OHLCTooltip origin={[-40, 0]}/>

					<MovingAverageTooltip
						onClick={e => console.log(e)}
						origin={[-38, 15]}
						options={[
							{
								yAccessor: ema26.accessor(),
								type: "EMA",
								stroke: ema26.stroke(),
								windowSize: ema26.options().windowSize,
							}
						]}
					/>
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

CandleStickChartWithMACDIndicator.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithMACDIndicator.defaultProps = {
	type: "hybrid",
};

CandleStickChartWithMACDIndicator = fitWidth(CandleStickChartWithMACDIndicator);

export default CandleStickChartWithMACDIndicator;
