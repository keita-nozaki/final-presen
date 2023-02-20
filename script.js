'use strict'

/*
 *  Functions
 */
function drawMarker(map, lat, lng, name, color) {
    const myIcon = L.icon({
        iconUrl: `modules/images/${color}.png`,
        iconSize: [50, 50],
        iconAnchor: [25, 40]
    });
    const divIcon = L.divIcon({
        html: `<div class="div-icon" style="color:${color};">${name}</div>`,
        iconSize: [0, 0],
        iconAnchor: [10, 0],
    });
    L.marker([lat, lng], {icon: myIcon}).addTo(map);
    L.marker([lat, lng], {icon: divIcon}).addTo(map);
}

function drawRoute(map, route, color) {
    const latlngs = route.map(waypoint => [waypoint.lat, waypoint.lng]);
    L.polyline(latlngs, {"color": color, "opacity": "0.8"}).addTo(map)
}

function createDrawPointer(targetMap, targetShipRoutes, targetColors) {
    let i = 0;
    let j = 0;
    let marker;
    const map = targetMap;
    const shipRoutes = targetShipRoutes;
    const colors = targetColors;

    function moveToNextIndex(){
        if (shipRoutes[i][j+1]){
            j++;
        } else if (shipRoutes[i+1]){
            i++;
            j = 0;
        } else {
            i = 0;
            j = 0;
        }
    }

    function drawPointer() {
        const myIcon = L.icon({
            iconUrl: `modules/images/${colors[i]}-flash.gif`,
            iconSize: [50, 50],
            iconAnchor: [25, 40]
        });
        if (marker) {
            marker.remove();
        }
        marker = L.marker([shipRoutes[i][j].lat, shipRoutes[i][j].lng], {icon: myIcon})
        marker.addTo(map);
        moveToNextIndex();
    }

    return drawPointer;
}


/*
 *  Settings
 */
const shipRoutes = [
    [
        {name: "A0", lat:34.95, lng: 137.0},
        {name: "A1", lat:35.05, lng: 137.05},
        {name: "A2", lat:35.1, lng: 137.1},
        {name: "A3", lat:35.1, lng: 137.2},
    ],
    [
        {name: "B0", lat:35.1, lng: 137.0},
        {name: "B1", lat:35.1, lng: 136.9},
        {name: "B2", lat:35.15, lng: 136.85},
    ],
    [
        {name: "C0", lat:35.25, lng: 136.8},
        {name: "C1", lat:35.25, lng: 137.0},
    ],
];

const colors = ['red', 'green', 'blue'];
const targetLatLng = [35, 135];
const targetZoom = 10;
const targetArea = [[35.3, 137.2], [34.9, 136.8]];


/*
 *  Map Drawing
 */
const map = L.map('map').setView(targetLatLng, targetZoom);
const targetBounds = L.latLngBounds(...targetArea);
map.fitBounds(targetBounds);

L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    attribution: "&copy; <a href='https://developers.google.com/maps/documentation' target='_blank'>Google Map</a>"
}).addTo(map);

shipRoutes.forEach(
    (shipRoute, i) => {
        drawMarker(map, shipRoute[0].lat, shipRoute[0].lng, shipRoute[0].name, colors[i]);
        drawMarker(map, shipRoute[shipRoute.length-1].lat, shipRoute[shipRoute.length-1].lng, shipRoute[shipRoute.length-1].name, colors[i]);
        drawRoute(map, shipRoute, colors[i]);
    }
);


/*
 *  Table Drawing
 */
const tableDiv = document.getElementById("table");

shipRoutes.forEach(
    (shipRoute, i) => {
        const tbl = document.createElement("table");
        const tblBody = document.createElement("tbody");

        // 表ヘッダー
        const row = document.createElement("tr");
        for (const key in shipRoute[0]) {
            const cell = document.createElement("td");
            const cellText = document.createTextNode(key);
            cell.style.color = colors[i];
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        tblBody.appendChild(row);

        // 表ボディ
        for (const wp of shipRoute){
            const row = document.createElement("tr");
            for (const key in wp) {
                const cell = document.createElement("td");
                const cellText = document.createTextNode(wp[key]);
                cell.style.color = colors[i];
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            tblBody.appendChild(row);
        }

        tbl.appendChild(tblBody);
        tbl.setAttribute("border", "2");
        tbl.style.display = "inline-block";
        tbl.style.verticalAlign = "top";
        tableDiv.appendChild(tbl);
    }
);


/*
 *  Button Action
 */
const startButton = document.getElementById("start");
const start = createDrawPointer(map, shipRoutes, colors);
startButton.addEventListener("click", () => {
        start();   
        setInterval(start, 2000);
        }
    )