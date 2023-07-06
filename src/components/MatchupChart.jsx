import React from 'react';
import { ResponsiveHeatMapCanvas } from '@nivo/heatmap';


const theme = {
    // "background": "#000000",
    "text": {
        "fontSize": 11,
        "fill": "#333333",
        "outlineWidth": 0,
        "outlineColor": "transparent"
    },
    "axis": {
        "domain": {
            "line": {
                "stroke": "#777777",
                "strokeWidth": 1
            }
        },
        "legend": {
            "text": {
                "fontSize": 12,
                "fill": "#333333",
                "outlineWidth": 0,
                "outlineColor": "transparent"
            }
        },
        "ticks": {
            "line": {
                "stroke": "#777777",
                "strokeWidth": 1
            },
            "text": {
                "fontSize": 11,
                "fill": "#FFFFFF",
                "outlineWidth": 0,
                "outlineColor": "transparent"
            }
        }
    },
    "grid": {
        "line": {
            "stroke": "#dddddd",
            "strokeWidth": 1
        }
    },
    "legends": {
        "title": {
            "text": {
                "fontSize": 11,
                "fill": "#333333",
                "outlineWidth": 0,
                "outlineColor": "transparent"
            }
        },
        "text": {
            "fontSize": 11,
            "fill": "#333333",
            "outlineWidth": 0,
            "outlineColor": "transparent"
        },
        "ticks": {
            "line": {},
            "text": {
                "fontSize": 10,
                "fill": "#333333",
                "outlineWidth": 0,
                "outlineColor": "transparent"
            }
        }
    },
    "annotations": {
        "text": {
            "fontSize": 13,
            "fill": "#333333",
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "link": {
            "stroke": "#000000",
            "strokeWidth": 1,
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "outline": {
            "stroke": "#000000",
            "strokeWidth": 2,
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "symbol": {
            "fill": "#000000",
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        }
    },
    "tooltip": {
        "container": {
            "background": "#ffffff",
            "fontSize": 12
        },
        "basic": {},
        "chip": {},
        "table": {},
        "tableCell": {},
        "tableCellValue": {}
    }
}
const MatchupChart = ({ matchupData }) => {
    const characterNames = Array.from(
        new Set(matchupData.flatMap((matchup) => [matchup.character1, matchup.character2]))
    );

    const data = characterNames.map((character1) => ({
        id: character1,
        data: characterNames.map((character2) => {
            const matchup = matchupData.find(
                (matchup) => matchup.character1 === character1 && matchup.character2 === character2
            );
            return {
                x: character2,
                y: matchup ? matchup.winrate.toFixed(2) : 0,
                samples: matchup.sample_size
            };
        }),
    }));

    return (
        <ResponsiveHeatMapCanvas
            theme={theme}
            data={data}
            keys={['y']}
            indexBy="x"
            margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
            forceSquare={true}
            axisTop={{
                orient: 'top',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: '',
                legendOffset: 36,
            }}
            axisRight={null}
            axisBottom={null}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: -40,
            }}
            cellOpacity={1}
            cellBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
            animate={true}
            motionConfig="wobbly"
            motionStiffness={80}
            motionDamping={9}
            hoverTarget="cell"
            cellHoverOthersOpacity={0.25}
            cellHoverOpacity={1}
            cellShape="rect"
            tooltip={(x) => {
                return (
                    <>
                    <strong>
                        {x.cell.serieId} vs {x.cell.data.x}: {`${(x.cell.data.y * 100).toFixed(2)}%`}
                    </strong >
                    <p>
                        Based on : {x.cell.data.samples} matches played
                    </p >
                    
                    </>
                )

            }
            }
        />
    );
};

export default MatchupChart;
