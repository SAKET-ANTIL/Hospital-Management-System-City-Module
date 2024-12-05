// Define a structured Patient object
class Patient {
    constructor(name, age, condition, bedType) {
        this.name = name;
        this.age = age;
        this.condition = condition;
        this.bedType = bedType;
    }
}

// Define multiple hospitals with different bed types
const hospitals = [
    {
        name: 'AIIMS Hospital',
        beds: { OPD: 5, ICU: 2, General: 3 },
        occupiedBeds: { OPD: 2, ICU: 1, General: 1 },
        queue: [],
        admittedPatients: []
    },
    {
        name: 'General Hospital',
        beds: { OPD: 6, ICU: 3, General: 4 },
        occupiedBeds: { OPD: 1, ICU: 1, General: 0 },
        queue: [],
        admittedPatients: []
    },
    {
        name: 'CHANDIGARH UNIVERSITY HOSPITAL',
        beds: { OPD: 3, ICU: 1, General: 2 },
        occupiedBeds: { OPD: 1, ICU: 0, General: 0 },
        queue: [],
        admittedPatients: []
    },
    {
        name: 'Care Hospital',
        beds: { OPD: 7, ICU: 2, General: 4 },
        occupiedBeds: { OPD: 2, ICU: 1, General: 2 },
        queue: [],
        admittedPatients: []
    },
    {
        name: 'Health Plus',
        beds: { OPD: 4, ICU: 2, General: 3 },
        occupiedBeds: { OPD: 0, ICU: 1, General: 1 },
        queue: [],
        admittedPatients: []
    }
];

let currentHospitalIndex = null;

document.addEventListener('DOMContentLoaded', () => {
    displayHospitals();
    document.getElementById('patientForm').onsubmit = addPatientToQueue;
});

// Display all hospitals
function displayHospitals() {
    const hospitalList = document.getElementById('hospitalList');
    hospitalList.innerHTML = '';

    hospitals.forEach((hospital, index) => {
        const section = document.createElement('section');
        section.classList.add('hospital-section');

        section.innerHTML = `
            <div class="hospital-header">
                <h2>${hospital.name}</h2>
                <button onclick="openModal(${index})">Add Patient</button>
            </div>
            <div class="queue-section">
                <h3>OPD Queue</h3>
                <ul id="queue-${index}">${hospital.queue.map((p, i) => `<li>${i + 1}. ${p.name} (Age: ${p.age}, Condition: ${p.condition})</li>`).join('')}</ul>
                <button onclick="servePatient(${index})">Serve Next Patient</button>
            </div>
            <div class="bed-section">
                <h3>Bed Availability</h3>
                <div id="bedGrid-${index}" class="bedGrid">${generateBedGrid(hospital)}</div>
                <button onclick="admitPatient(${index})">Admit Patient</button>
            </div>
            <div class="admission-section">
                <h3>Admitted Patients</h3>
                <ul id="admitted-${index}">${hospital.admittedPatients.map((p, i) => `<li>${i + 1}. ${p.name} (Age: ${p.age}, Condition: ${p.condition})</li>`).join('')}</ul>
                <button onclick="dischargePatient(${index})">Discharge Patient</button>
            </div>
        `;
        hospitalList.appendChild(section);
    });
}

// Open the modal to add a patient
function openModal(hospitalIndex) {
    currentHospitalIndex = hospitalIndex;
    document.getElementById('currentHospital').textContent = hospitals[hospitalIndex].name;
    document.getElementById('patientModal').style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('patientModal').style.display = 'none';
}

// Add patient to queue
function addPatientToQueue(event) {
    event.preventDefault();

    const hospital = hospitals[currentHospitalIndex];
    const name = document.getElementById('patientName').value.trim();
    const age = parseInt(document.getElementById('patientAge').value);
    const condition = document.getElementById('patientCondition').value.trim();
    const bedType = document.getElementById('bedType').value;

    // Validate input
    if (!name || !age || !condition || !bedType) {
        alert('Please fill in all fields.');
        return;
    }

    // Create a new Patient object
    const newPatient = new Patient(name, age, condition, bedType);

    // Add patient to the hospital's queue
    hospital.queue.push(newPatient);

    displayHospitals();
    closeModal();
}

// Admit a patient from the queue to the appropriate bed type
function admitPatient(hospitalIndex) {
    const hospital = hospitals[hospitalIndex];
    if (hospital.queue.length > 0) {
        const patient = hospital.queue.shift();

        if (hospital.occupiedBeds[patient.bedType] < hospital.beds[patient.bedType]) {
            hospital.admittedPatients.push(patient);
            hospital.occupiedBeds[patient.bedType]++;
            displayHospitals();
        } else {
            alert(`No available ${patient.bedType} beds.`);
        }
    } else {
        alert('No patients in the queue.');
    }
}

// Discharge a patient
function dischargePatient(hospitalIndex) {
    const hospital = hospitals[hospitalIndex];
    if (hospital.admittedPatients.length > 0) {
        const dischargedPatient = hospital.admittedPatients.shift();
        hospital.occupiedBeds[dischargedPatient.bedType]--;
        displayHospitals();
    } else {
        alert('No admitted patients to discharge.');
    }
}

// Generate bed grid based on bed type availability
function generateBedGrid(hospital) {
    let bedGridHTML = '';
    Object.keys(hospital.beds).forEach(bedType => {
        const availableBeds = hospital.beds[bedType] - hospital.occupiedBeds[bedType];
        for (let i = 0; i < availableBeds; i++) {
            bedGridHTML += `<div class="bed ${bedType}">Bed ${i + 1} (${bedType} Available)</div>`;
        }
        for (let i = 0; i < hospital.occupiedBeds[bedType]; i++) {
            bedGridHTML += `<div class="bed ${bedType} occupied">Bed ${i + 1} (${bedType} Occupied)</div>`;
        }
    });
    return bedGridHTML;
}
