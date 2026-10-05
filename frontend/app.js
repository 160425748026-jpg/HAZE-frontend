/* =========================================================
   HAZE — Hyperlocal AI-powered Zonal Mobility Engine
   Frontend JavaScript
   Demo data only — ready for FastAPI connection later
   ========================================================= */


/* =========================================================
   1. DEMO DATA
   Replace this later with data received from FastAPI.
   ========================================================= */

const demoStats = {
    activeVehicles: 142,
    activeRoutes: 24,
    onTime: 87,
    congestedRoutes: 4
};


const demoVehicles = [
    {
        vehicle_id: "BUS-101",
        route: "25A",
        latitude: 17.3850,
        longitude: 78.4867,
        speed: 24,
        delay: 2,
        status: "normal"
    },

    {
        vehicle_id: "BUS-216",
        route: "25A",
        latitude: 17.3910,
        longitude: 78.4800,
        speed: 18,
        delay: 5,
        status: "delayed"
    },

    {
        vehicle_id: "BUS-305",
        route: "218",
        latitude: 17.3780,
        longitude: 78.4920,
        speed: 9,
        delay: 11,
        status: "congested"
    },

    {
        vehicle_id: "BUS-412",
        route: "10H",
        latitude: 17.3970,
        longitude: 78.4750,
        speed: 15,
        delay: 6,
        status: "delayed"
    },

    {
        vehicle_id: "BUS-527",
        route: "5K",
        latitude: 17.3690,
        longitude: 78.5010,
        speed: 28,
        delay: 1,
        status: "normal"
    },

    {
        vehicle_id: "BUS-633",
        route: "218",
        latitude: 17.4020,
        longitude: 78.4880,
        speed: 7,
        delay: 14,
        status: "congested"
    }
];


const demoCongestion = [
    {
        route: "25A",
        status: "normal"
    },

    {
        route: "10H",
        status: "slow"
    },

    {
        route: "218",
        status: "congested"
    },

    {
        route: "5K",
        status: "normal"
    }
];


/* =========================================================
   2. GLOBAL VARIABLES
   ========================================================= */

let map;
let vehicleMarkers = [];

let selectedVehicle = null;


/* =========================================================
   3. INITIALIZE APPLICATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeMap();

    updateStatistics(demoStats);

    addVehicleMarkers(demoVehicles);

    updateCongestion(demoCongestion);

    setupChatEvents();

    setupVehiclePanel();

});


/* =========================================================
   4. INITIALIZE LEAFLET MAP
   ========================================================= */

function initializeMap() {

    // Hyderabad coordinates
    const hyderabad = [17.3850, 78.4867];

    map = L.map("map", {
        zoomControl: true,
        attributionControl: true
    }).setView(hyderabad, 13);


    // OpenStreetMap tiles
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

}


/* =========================================================
   5. CREATE VEHICLE MARKER
   ========================================================= */

function createVehicleMarker(vehicle) {

    let markerClass = "normal-marker";

    if (vehicle.status === "delayed") {
        markerClass = "delayed-marker";
    }

    if (vehicle.status === "congested") {
        markerClass = "congested-marker";
    }


    const markerIcon = L.divIcon({

        className: "",

        html: `
            <div class="vehicle-marker ${markerClass}">
                🚌
            </div>
        `,

        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });


    const marker = L.marker(
        [vehicle.latitude, vehicle.longitude],
        {
            icon: markerIcon
        }
    );


    marker.addTo(map);


    // Clicking a vehicle opens its details
    marker.on("click", () => {

        showVehicleDetails(vehicle);

    });


    return marker;
}


/* =========================================================
   6. ADD VEHICLE MARKERS
   ========================================================= */

function addVehicleMarkers(vehicles) {

    // Remove existing markers
    vehicleMarkers.forEach(marker => {

        map.removeLayer(marker);

    });

    vehicleMarkers = [];


    vehicles.forEach(vehicle => {

        const marker = createVehicleMarker(vehicle);

        vehicleMarkers.push(marker);

    });

}


/* =========================================================
   7. UPDATE VEHICLE MARKERS
   ========================================================= */

function updateVehicleMarkers(data) {

    if (!Array.isArray(data)) {
        console.warn("Vehicle data must be an array.");
        return;
    }

    addVehicleMarkers(data);

}


/* =========================================================
   8. SHOW VEHICLE DETAILS
   ========================================================= */

function showVehicleDetails(vehicle) {

    selectedVehicle = vehicle;


    document.getElementById("vehicleId").textContent =
        vehicle.vehicle_id;


    document.getElementById("vehicleRoute").textContent =
        vehicle.route;


    document.getElementById("vehicleSpeed").textContent =
        `${vehicle.speed} km/h`;


    const delayPrefix =
        vehicle.delay > 0 ? "+" : "";


    document.getElementById("vehicleDelay").textContent =
        `${delayPrefix}${vehicle.delay} min`;


    const statusElement =
        document.getElementById("vehicleStatus");


    statusElement.className = "";


    if (vehicle.status === "normal") {

        statusElement.textContent = "● NORMAL";
        statusElement.classList.add("normal-text");

    }

    else if (vehicle.status === "delayed") {

        statusElement.textContent = "● DELAYED";
        statusElement.classList.add("delayed-text");

    }

    else if (vehicle.status === "congested") {

        statusElement.textContent = "● CONGESTED";
        statusElement.classList.add("congested-text");

    }


    // Current time
    const now = new Date();

    document.getElementById("vehicleUpdated").textContent =
        now.toLocaleTimeString();


    // Open panel
    document
        .getElementById("vehiclePanel")
        .classList.add("active");

}


/* =========================================================
   9. UPDATE STATISTICS
   ========================================================= */

function updateStatistics(data) {

    if (!data) {
        return;
    }


    document.getElementById("activeVehicles").textContent =
        data.activeVehicles;


    document.getElementById("activeRoutes").textContent =
        data.activeRoutes;


    document.getElementById("onTime").textContent =
        `${data.onTime}%`;


    document.getElementById("congestedRoutes").textContent =
        data.congestedRoutes;

}


/* =========================================================
   10. UPDATE CONGESTION PANEL
   ========================================================= */

function updateCongestion(data) {

    if (!Array.isArray(data)) {
        console.warn("Congestion data must be an array.");
        return;
    }


    const container =
        document.getElementById("congestionList");


    container.innerHTML = "";


    data.forEach(route => {

        const item = document.createElement("div");

        item.className = "route-item";


        const routeName =
            document.createElement("strong");

        routeName.textContent =
            route.route;


        const status =
            document.createElement("span");

        status.classList.add("route-status");


        if (route.status === "normal") {

            status.classList.add("normal");
            status.textContent = "● NORMAL";

        }

        else if (route.status === "slow") {

            status.classList.add("slow");
            status.textContent = "● SLOW";

        }

        else if (route.status === "congested") {

            status.classList.add("congested");
            status.textContent = "● CONGESTED";

        }


        item.appendChild(routeName);
        item.appendChild(status);

        container.appendChild(item);

    });

}


/* =========================================================
   11. CLOSE VEHICLE PANEL
   ========================================================= */

function setupVehiclePanel() {

    const closeButton =
        document.getElementById("closeVehicle");


    closeButton.addEventListener("click", () => {

        document
            .getElementById("vehiclePanel")
            .classList.remove("active");

        selectedVehicle = null;

    });

}


/* =========================================================
   12. CHATBOT
   ========================================================= */

function setupChatEvents() {

    const chatToggle =
        document.getElementById("chatToggle");


    const closeChat =
        document.getElementById("closeChat");


    const sendButton =
        document.getElementById("sendChat");


    const chatInput =
        document.getElementById("chatInput");


    chatToggle.addEventListener("click", toggleChat);


    closeChat.addEventListener("click", () => {

        document
            .getElementById("chatPanel")
            .classList.remove("active");

    });


    sendButton.addEventListener("click", sendChatMessage);


    chatInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            sendChatMessage();

        }

    });

}


/* =========================================================
   13. TOGGLE CHAT
   ========================================================= */

function toggleChat() {

    const panel =
        document.getElementById("chatPanel");


    panel.classList.toggle("active");

}


/* =========================================================
   14. SEND CHAT MESSAGE
   ========================================================= */

function sendChatMessage() {

    const input =
        document.getElementById("chatInput");


    const message =
        input.value.trim();


    if (!message) {
        return;
    }


    // Add user message
    addChatMessage(message, "user");


    input.value = "";


    /*
    =========================================================
    FUTURE FASTAPI CONNECTION

    Later your backend team can replace the demo response
    below with something like:

        fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        })

    DO NOT add API keys here.
    =========================================================
    */


    // Temporary frontend-only response
    setTimeout(() => {

        addChatMessage(
            "HAZE AI is currently running in demo mode. Backend intelligence will be connected through FastAPI.",
            "ai"
        );

    }, 500);

}


/* =========================================================
   15. ADD CHAT MESSAGE
   ========================================================= */

function addChatMessage(text, sender) {

    const container =
        document.getElementById("chatMessages");


    const message =
        document.createElement("div");


    message.classList.add("message");


    if (sender === "user") {

        message.classList.add("user-message");

    } else {

        message.classList.add("ai-message");

    }


    message.textContent = text;


    container.appendChild(message);


    // Scroll to latest message
    container.scrollTop =
        container.scrollHeight;

}


/* =========================================================
   16. FUTURE BACKEND CONNECTION POINTS
   =========================================================

   Backend endpoints planned:

   GET  /api/vehicles
   GET  /api/routes
   GET  /api/congestion
   GET  /api/stats
   POST /api/chat

   Example future usage:

   async function loadVehicles() {

       const response =
           await fetch("/api/vehicles");

       const data =
           await response.json();

       updateVehicleMarkers(data);

   }

   ========================================================= */
