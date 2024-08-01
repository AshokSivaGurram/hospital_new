import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://hospitalmanagement-801c7-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const patientsListInDB = ref(database, "patientsList")

var addNewMedicine = document.getElementById("add-new-medicine")
var newMedicineForm = document.getElementById("new-medicine-form")
var newMedicinesAdder = document.getElementById("new-medicines-adder")
var addNewMedicineButton = document.getElementById("add-new-medicine-button")
var calculateTotal = document.getElementById("calculate-total")
var submitButton = document.getElementById("submit")
var previousPatientsList = document.getElementById("previous-patients-list")
var todayTotal =  document.getElementById("today-total-amount")
var gotodatesubmit = document.getElementById("gotodatesubmit")

addNewMedicine.addEventListener('click',function() {
    console.log("clicked")
    newMedicineForm.innerHTML = `
    <div class="form-contents">
        <h4>Medicine Name</h4>
        <input type="text" id="new-medicine-name">
    </div>
    <div class="form-contents">
        <h4>Price</h4>
        <input type="number" id="new-medicine-price">
        <button id="add-new-medicine-button">Add</button>
    </div>
    `
    document.getElementById("add-new-medicine-button").addEventListener("click", function(){
        var medicineName = document.getElementById("new-medicine-name").value
        var medicinePrice = document.getElementById("new-medicine-price").value
        if((medicineName != "") && (medicinePrice != null)){
            if (newMedicinesAdder.innerText==="No Medicines Added."){
                newMedicinesAdder.innerHTML=`
                <div class="flex">
                    <div id="medicine-name">
                        <h4 class="left">Medicine Name</h4>
                    </div>
                    <div id="medicine-price">
                        <h4 class="left">Price</h4>
                    </div>
                </div>
                `
            }
            document.getElementById("medicine-name").innerHTML+=`<p> <span class="medicine-names">`+medicineName+`</span> </p>`
            document.getElementById("medicine-price").innerHTML+=`<p> <span class="medicine-prices">`+medicinePrice+`</span></p>`
        }
        newMedicineForm.innerHTML = ``
    })
})

calculateTotal.addEventListener("click", function(){
    var consultationFee = Number(document.getElementById("consultation-fee").value)
    var totalPrice = 0
    var medicines = document.querySelectorAll(".medicine-prices")
    for (let i=0; i<medicines.length;i++){
        totalPrice += Number(medicines[i].innerHTML)
    }
    document.getElementById("total-price").value=consultationFee+totalPrice
})

submitButton.addEventListener("click", function(){
    var patientName = document.getElementById("new-patient-name")
    var consultationFee = document.getElementById("consultation-fee")
    var medicineNames = document.querySelectorAll(".medicine-names")
    var medicinePrices = document.querySelectorAll(".medicine-prices")
    var totalPrice = document.getElementById("total-price")
    var medicineNames1=["sample"]
    var medicinePrices1=["sample"]
    for(let i=0;i<medicineNames.length;i++){
        medicineNames1[i] =medicineNames[i].innerText
    }
    for(let i=0; i<medicinePrices.length;i++){
        medicinePrices1[i] = medicinePrices[i].textContent
    }
    var todayDate = new Date().toISOString().slice(0, 10);
    var dict1={
        "name":patientName.value,
        "consultation-fee":consultationFee.value,
        "medicineNames":medicineNames1,
        "medicinePrices":medicinePrices1,
        "totalPrice":totalPrice.value,
        "date":todayDate
    }
 
    push(patientsListInDB, dict1)
    patientName.value=""
    consultationFee.value=""
    newMedicinesAdder.innerHTML="No Medicines Added."
    totalPrice.value=""
})
function clearPatientListEl(){
    previousPatientsList.innerHTML = ""
}
function appendItemTopreviousPatientsList(currentPatient){
    console.log(currentPatient)
    let currentPatientName = currentPatient[1]["name"]
    let currentPatientConsultationFee = currentPatient[1]["consultation-fee"]
    let currentPatientMedicineNames = currentPatient[1]["medicineNames"]
    let currentPatientMedicinePrices = currentPatient[1]["medicinePrices"]
    let currentPatientTotalPrice = currentPatient[1]["totalPrice"]
    todayTotal.innerText = Number(todayTotal.innerText)+Number(currentPatientTotalPrice)
    let i=0
    let medlis = ""
    while (i<currentPatientMedicineNames.length){
        medlis+=`
        <div class="medicine-item1">`+currentPatientMedicineNames[i]+` - ₹`+currentPatientMedicinePrices[i]+`</div>`
        i+=1
    }
    previousPatientsList.innerHTML+= `
    <div class="card1">
    <div class="patient-name1">`+currentPatientName+`</div>

    <div class="section-title1">Consultation Fee</div>
    <div>₹`+currentPatientConsultationFee+`</div>

    <div class="section-title1">Medicine</div>
    <div class="medicine-list1">`+medlis+`
    </div>
    <div class="total-price1">Total: ₹`+currentPatientTotalPrice+`</div>
</div>
    `
}
onValue(patientsListInDB, function(snapshot) {
    var todayDate = new Date().toISOString().slice(0, 10);
    todayTotal.innerText=0
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearPatientListEl()
        
        for (let i = (itemsArray.length-1); i >=0 ; i--) {
            let currentPatient = itemsArray[i]
            
            if (currentPatient[1]["date"]===todayDate){
            appendItemTopreviousPatientsList(currentPatient)}
        }    
    } 
    if (previousPatientsList.innerHTML==``) {
        previousPatientsList.innerHTML = `<div class="patient-name1" id="nopatientsyet">No Patients Here Yet</div>`
    }
})

gotodatesubmit.addEventListener("click", function(){
    onValue(patientsListInDB, function(snapshot) {
        var todayDate = document.getElementById("gotodate").value
        todayTotal.innerText=0
        if (snapshot.exists()) {
            let itemsArray = Object.entries(snapshot.val())
        
            clearPatientListEl()
            
            for (let i = (itemsArray.length-1); i >= 0 ; i--) {
                let currentPatient = itemsArray[i]
                
                if (currentPatient[1]["date"]===todayDate){
                appendItemTopreviousPatientsList(currentPatient)}
            }    
        } 
        if (previousPatientsList.innerHTML==``) {
            previousPatientsList.innerHTML = `<div class="patient-name1" id="nopatientsyet">No Patients Here Yet</div>`
        }
    })

})