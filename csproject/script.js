let currentRole = "student"

function setRole(role) {
currentRole = role

document.getElementById("studentBtn").classList.remove("activeRole")
document.getElementById("doctorBtn").classList.remove("activeRole")

if(role === "student"){
document.getElementById("studentBtn").classList.add("activeRole")
}else{
document.getElementById("doctorBtn").classList.add("activeRole")
}
}

function login(){
let email = document.getElementById("loginEmail").value
let password = document.getElementById("loginPassword").value

if(!email || !password){
alert("Please fill all fields")
return
}

if(currentRole === "doctor"){
window.location.href = "doctor.html"
}else{
window.location.href = "student.html"
}
}

function register(){
let name = document.getElementById("regFullName").value
let email = document.getElementById("regEmail").value
let password = document.getElementById("regPassword").value

if(!name || !email || !password){
alert("Please fill all fields")
return
}

alert("Registration successful!")
window.location.href = "login.html"
}


let data = {
vaccinated: [
{name:"Anna", class:"10A", vaccine:"Hepatitis"},
{name:"Mark", class:"9B", vaccine:"Flu Shot"},
{name:"Sarah", class:"11C", vaccine:"COVID-19"},
{name:"David", class:"10B", vaccine:"Flu Shot"},
{name:"Emma", class:"9A", vaccine:"Hepatitis"}
],
sick: [
{name:"John", class:"8C", symptom:"Flu"},
{name:"Lisa", class:"10A", symptom:"Cold"},
{name:"Mike", class:"9B", symptom:"Flu"},
{name:"Kate", class:"11A", symptom:"Headache"},
{name:"Tom", class:"8B", symptom:"Flu"}
],
emergency: [
{name:"Tom", class:"7A", reason:"Allergic Reaction"},
{name:"Jane", class:"10C", reason:"Asthma Attack"}
]
}

function switchSection(id, element) {
document.querySelectorAll(".section").forEach(s=>s.classList.remove("sectionActive"))
document.getElementById(id).classList.add("sectionActive")

document.querySelectorAll(".menuItem").forEach(m=>m.classList.remove("menuActive"))
if(element) element.classList.add("menuActive")


setTimeout(() => {
    if(id === 'dashboard' || id === 'analytics') {
        drawCharts()
    }
}, 10)
}

function switchStudentSection(id, element) {
switchSection(id, element)
}

function logout() {
window.location.href = "login.html"
}

function populateTables() {

let vBody = document.querySelector("#vaccinatedTable tbody")
let sBody = document.querySelector("#sickTable tbody")
let eBody = document.querySelector("#emergencyTable tbody")

if(vBody){
vBody.innerHTML=""
data.vaccinated.forEach(r=>{
vBody.innerHTML+=`<tr><td>${r.name}</td><td>${r.class}</td><td>${r.vaccine}</td></tr>`
})
}

if(sBody){
sBody.innerHTML=""
data.sick.forEach(r=>{
sBody.innerHTML+=`<tr><td>${r.name}</td><td>${r.class}</td><td>${r.symptom}</td></tr>`
})
}

if(eBody){
eBody.innerHTML=""
data.emergency.forEach(r=>{
eBody.innerHTML+=`<tr><td>${r.name}</td><td>${r.class}</td><td>${r.reason}</td></tr>`
})
}

updateStats()
drawCharts()
}

function addRecord(){
let name=document.getElementById("regName").value
let cls=document.getElementById("regClass").value
let type=document.getElementById("regType").value
let detail=document.getElementById("regDetail").value

if(!name||!cls||!detail){alert("Fill all fields");return}

if(type==="vaccinated"){
data.vaccinated.push({name:name,class:cls,vaccine:detail})
}
if(type==="sick"){
data.sick.push({name:name,class:cls,symptom:detail})
}
if(type==="emergency"){
data.emergency.push({name:name,class:cls,reason:detail})
}

populateTables()
}

function updateStats(){
if(document.getElementById("totalStudents")){
document.getElementById("totalStudents").innerText=
data.vaccinated.length + data.sick.length
}
if(document.getElementById("totalSick")){
document.getElementById("totalSick").innerText=data.sick.length
}
if(document.getElementById("totalEmergency")){
document.getElementById("totalEmergency").innerText=data.emergency.length
}

let symptoms={}
data.sick.forEach(s=>{
symptoms[s.symptom]=(symptoms[s.symptom]||0)+1
})
let most=Object.keys(symptoms).reduce((a,b)=>symptoms[a]>symptoms[b]?a:b,"-")
if(document.getElementById("commonSymptom")){
document.getElementById("commonSymptom").innerText=most
}
}

function drawCharts(){
    drawDashboardLineChart()
    drawAnalyticsBarChart()
    drawAnalyticsPieChart()
}


function drawDashboardLineChart() {
    let canvas = document.getElementById("lineChart")
    if(!canvas) return
    
    
    if(canvas.offsetParent === null) return
    
    
    let ctx = canvas.getContext("2d", { alpha: true })
    let dpr = window.devicePixelRatio || 1
    let rect = canvas.getBoundingClientRect()
    
    
    if(rect.width === 0 || rect.height === 0) return
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    
    let width = rect.width
    let height = rect.height
    
    ctx.clearRect(0, 0, width, height)
    
    
    let weekData = [3, 5, 4, 7, 5, data.sick.length]
    let maxValue = Math.max(...weekData, 10)
    
    let padding = 60
    let chartWidth = width - padding * 2
    let chartHeight = height - padding * 2
    let pointSpacing = chartWidth / (weekData.length - 1)
    
    
    ctx.strokeStyle = "rgba(0, 0, 0, 0.05)"
    ctx.lineWidth = 1
    for(let i = 0; i <= 5; i++){
        let y = padding + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
    }
    
    
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()
    
    
    let gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    gradient.addColorStop(0, "rgba(76, 175, 80, 0.2)")
    gradient.addColorStop(1, "rgba(76, 175, 80, 0.01)")
    
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    weekData.forEach((value, index) => {
        let x = padding + index * pointSpacing
        let y = height - padding - (value / maxValue) * chartHeight
        ctx.lineTo(x, y)
    })
    ctx.lineTo(padding + (weekData.length - 1) * pointSpacing, height - padding)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()
    
    
    ctx.shadowColor = "rgba(76, 175, 80, 0.3)"
    ctx.shadowBlur = 8
    ctx.strokeStyle = "#4CAF50"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    
    weekData.forEach((value, index) => {
        let x = padding + index * pointSpacing
        let y = height - padding - (value / maxValue) * chartHeight
        
        if(index === 0){
            ctx.moveTo(x, y)
        } else {
            ctx.lineTo(x, y)
        }
    })
    ctx.stroke()
    ctx.shadowBlur = 0
    
    
    weekData.forEach((value, index) => {
        let x = padding + index * pointSpacing
        let y = height - padding - (value / maxValue) * chartHeight
        
        
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(76, 175, 80, 0.2)"
        ctx.fill()
        
        
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fillStyle = "#fff"
        ctx.fill()
        ctx.strokeStyle = "#4CAF50"
        ctx.lineWidth = 2.5
        ctx.stroke()
        
        
        ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
        ctx.textAlign = "center"
        let labelText = value.toString()
        let metrics = ctx.measureText(labelText)
        let labelX = x
        let labelY = y - 18
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
        ctx.fillRect(labelX - metrics.width/2 - 6, labelY - 12, metrics.width + 12, 18)
        
        ctx.fillStyle = "#2E7D32"
        ctx.fillText(labelText, labelX, labelY)
    })
    
    
    ctx.fillStyle = "#666"
    ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    weekData.forEach((value, index) => {
        let x = padding + index * pointSpacing
        ctx.textAlign = "center"
        ctx.fillText(`Week ${index + 1}`, x, height - padding + 25)
    })
    
    
    ctx.textAlign = "right"
    ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    for(let i = 0; i <= 5; i++){
        let y = padding + (chartHeight / 5) * i
        let value = Math.round(maxValue - (maxValue / 5) * i)
        ctx.fillText(value, padding - 15, y + 4)
    }
    
    
    ctx.fillStyle = "#1a1a1a"
    ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Sick Students - Weekly Trend", padding, 25)
    
    
    ctx.fillStyle = "#666"
    ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    ctx.fillText("Number of students reported sick per week", padding, 42)
}


function drawAnalyticsBarChart() {
    let canvas = document.getElementById("barChart")
    if(!canvas) return
    
    
    if(canvas.offsetParent === null) return
    
    
    let ctx = canvas.getContext("2d", { alpha: true })
    let dpr = window.devicePixelRatio || 1
    let rect = canvas.getBoundingClientRect()
    
    
    if(rect.width === 0 || rect.height === 0) return
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    
    let width = rect.width
    let height = rect.height
    
    ctx.clearRect(0, 0, width, height)
    
    let values = [data.sick.length, data.vaccinated.length, data.emergency.length]
    let labels = ["Sick", "Vaccinated", "Emergency"]
    let colors = ["#FF6B6B", "#4CAF50", "#FFA500"]
    
    let maxValue = Math.max(...values, 10)
    let padding = 60
    let chartHeight = height - padding * 2
    let barWidth = 70
    let spacing = (width - padding * 2) / values.length
    
    
    ctx.strokeStyle = "rgba(0, 0, 0, 0.05)"
    ctx.lineWidth = 1
    for(let i = 0; i <= 5; i++){
        let y = padding + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
    }
    
    
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()
    
    
    values.forEach((value, i) => {
        let barHeight = (value / maxValue) * chartHeight
        let x = padding + i * spacing + (spacing - barWidth) / 2
        let y = height - padding - barHeight
        
        
        let gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
        gradient.addColorStop(0, colors[i])
        gradient.addColorStop(1, colors[i] + "dd")
        
        
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)"
        ctx.shadowBlur = 10
        ctx.shadowOffsetY = 4
        
        
        ctx.beginPath()
        ctx.moveTo(x, y + 6)
        ctx.arcTo(x, y, x + 6, y, 6)
        ctx.lineTo(x + barWidth - 6, y)
        ctx.arcTo(x + barWidth, y, x + barWidth, y + 6, 6)
        ctx.lineTo(x + barWidth, y + barHeight)
        ctx.lineTo(x, y + barHeight)
        ctx.closePath()
        ctx.fillStyle = gradient
        ctx.fill()
        
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0
        
        
        ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
        ctx.textAlign = "center"
        let valueText = value.toString()
        let metrics = ctx.measureText(valueText)
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
        ctx.fillRect(x + barWidth/2 - metrics.width/2 - 8, y - 32, metrics.width + 16, 22)
        
        ctx.fillStyle = colors[i]
        ctx.fillText(valueText, x + barWidth / 2, y - 15)
        
        
        ctx.fillStyle = "#666"
        ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
        ctx.fillText(labels[i], x + barWidth / 2, height - padding + 25)
    })
    
    
    ctx.fillStyle = "#666"
    ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    ctx.textAlign = "right"
    for(let i = 0; i <= 5; i++){
        let y = padding + (chartHeight / 5) * i
        let value = Math.round(maxValue - (maxValue / 5) * i)
        ctx.fillText(value, padding - 15, y + 4)
    }
    
    
    ctx.fillStyle = "#1a1a1a"
    ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Medical Records Comparison", padding, 25)
    
    
    ctx.fillStyle = "#666"
    ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    ctx.fillText("Active cases by category", padding, 42)
}


function drawAnalyticsPieChart() {
    let canvas = document.getElementById("pieChart")
    if(!canvas) return
    
    
    if(canvas.offsetParent === null) return
    
    
    let ctx = canvas.getContext("2d", { alpha: true })
    let dpr = window.devicePixelRatio || 1
    let rect = canvas.getBoundingClientRect()
    
    
    if(rect.width === 0 || rect.height === 0) return
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    
    let width = rect.width
    let height = rect.height
    
    ctx.clearRect(0, 0, width, height)
    
    let total = data.sick.length + data.vaccinated.length + data.emergency.length
    if(total === 0) total = 1
    
    let values = [data.sick.length, data.vaccinated.length, data.emergency.length]
    let labels = ["Sick", "Vaccinated", "Emergency"]
    let colors = ["#FF6B6B", "#4CAF50", "#FFA500"]
    
    let centerX = width / 2 - 80
    let centerY = height / 2 + 10
    let radius = 90
    
    let currentAngle = -Math.PI / 2
    
    
    values.forEach((value, i) => {
        let sliceAngle = (value / total) * Math.PI * 2
        
        if(value === 0) return
        
        
        let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
        gradient.addColorStop(0, colors[i])
        gradient.addColorStop(1, colors[i] + "cc")
        
        
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)"
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 3
        ctx.shadowOffsetY = 3
        
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
        ctx.closePath()
        ctx.fillStyle = gradient
        ctx.fill()
        
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        
        
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 3
        ctx.stroke()
        
        
        if(sliceAngle > 0.3) { 
            let labelAngle = currentAngle + sliceAngle / 2
            let labelRadius = radius * 0.7
            let labelX = centerX + Math.cos(labelAngle) * labelRadius
            let labelY = centerY + Math.sin(labelAngle) * labelRadius
            
            ctx.fillStyle = "#fff"
            ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            
            let percentage = ((value / total) * 100).toFixed(0)
            ctx.fillText(percentage + "%", labelX, labelY)
        }
        
        currentAngle += sliceAngle
    })
    
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2)
    ctx.fillStyle = "#fff"
    ctx.fill()
    
    
    ctx.fillStyle = "#1a1a1a"
    ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(total, centerX, centerY - 8)
    
    ctx.fillStyle = "#666"
    ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    ctx.fillText("Total", centerX, centerY + 12)
    
    
    let legendX = width / 2 + 40
    let legendY = height / 2 - 50
    
    ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    
    values.forEach((value, i) => {
        let y = legendY + i * 38
        
        
        ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
        ctx.shadowBlur = 4
        ctx.shadowOffsetY = 2
        
        
        ctx.fillStyle = colors[i]
        ctx.beginPath()
        ctx.roundRect(legendX, y - 2, 18, 18, 3)
        ctx.fill()
        
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0
        
        
        ctx.fillStyle = "#333"
        ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
        ctx.fillText(labels[i], legendX + 26, y)
        
        
        ctx.fillStyle = "#666"
        ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
        let percentage = ((value / total) * 100).toFixed(1)
        ctx.fillText(`${value} (${percentage}%)`, legendX + 26, y + 16)
    })
    
    
    ctx.fillStyle = "#1a1a1a"
    ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.fillText("Medical Records Distribution", 40, 20)
    
    
    ctx.fillStyle = "#666"
    ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    ctx.fillText("Percentage breakdown by category", 40, 40)
}

function filterData(type, btn){
    document.querySelectorAll(".analyticsFilters button")
        .forEach(b=>b.classList.remove("activeFilter"))
    btn.classList.add("activeFilter")
    drawCharts()
}

document.addEventListener("DOMContentLoaded", function(){
    populateTables()

    let sc = document.getElementById("studentChart")
    if(sc){
        updateStudentStats()
        drawStudentChart()
    }
})

function exportJSON() {
    let jsonData = JSON.stringify(data, null, 2)

    let blob = new Blob([jsonData], { type: "application/json" })
    let url = URL.createObjectURL(blob)

    let a = document.createElement("a")
    a.href = url
    a.download = "medical-data.json"
    a.click()

    URL.revokeObjectURL(url)
}

function importJSON() {
    let fileInput = document.getElementById("importFile")
    let file = fileInput.files[0]

    if (!file) {
        alert("Please select a JSON file")
        return
    }

    let reader = new FileReader()

    reader.onload = function(event) {
        try {
            let importedData = JSON.parse(event.target.result)

            if (
                importedData.vaccinated &&
                importedData.sick &&
                importedData.emergency
            ) {
                data = importedData
                populateTables()
                alert("Data imported successfully!")
            } else {
                alert("Invalid JSON format")
            }

        } catch (error) {
            alert("Error reading JSON file")
        }
    }

    reader.readAsText(file)
}




let currentStudent = {
    name: "Anna",
    class: "10A"
}

function switchStudentSection(id, element) {
    switchSection(id, element)
    
    
    setTimeout(() => {
        if(id === 'overview') {
            updateStudentStats()
            drawStudentChart()
        }
    }, 10)
}

function updateStudentStats() {
    
    let studentSickRecords = data.sick.filter(record => record.name === currentStudent.name)
    let studentVaccineRecords = data.vaccinated.filter(record => record.name === currentStudent.name)
    let studentEmergencyRecords = data.emergency.filter(record => record.name === currentStudent.name)
    
    let sickCount = studentSickRecords.length
    let vaccineCount = studentVaccineRecords.length
    let emergencyCount = studentEmergencyRecords.length
    
    if(document.getElementById("studentSickCount")) {
        document.getElementById("studentSickCount").innerText = sickCount
    }
    if(document.getElementById("studentVaccineCount")) {
        document.getElementById("studentVaccineCount").innerText = vaccineCount
    }
    if(document.getElementById("studentEmergencyCount")) {
        document.getElementById("studentEmergencyCount").innerText = emergencyCount
    }
    
    populateStudentHistory()
}

function populateStudentHistory() {
    let tbody = document.querySelector("#studentHistoryTable tbody")
    if(!tbody) return
    
    tbody.innerHTML = ""
    
    
    let allRecords = []
    
    
    data.sick.filter(record => record.name === currentStudent.name).forEach(record => {
        allRecords.push({
            name: record.name,
            type: "Sick",
            detail: record.symptom
        })
    })
    
    
    data.vaccinated.filter(record => record.name === currentStudent.name).forEach(record => {
        allRecords.push({
            name: record.name,
            type: "Vaccinated",
            detail: record.vaccine
        })
    })
    
    
    data.emergency.filter(record => record.name === currentStudent.name).forEach(record => {
        allRecords.push({
            name: record.name,
            type: "Emergency",
            detail: record.reason
        })
    })
    
    if(allRecords.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: #999;">No medical records found</td></tr>`
        return
    }
    
    allRecords.forEach(record => {
        tbody.innerHTML += `<tr>
            <td>${record.name}</td>
            <td>${record.type}</td>
            <td>${record.detail}</td>
        </tr>`
    })
}

function drawStudentChart() {
    let canvas = document.getElementById("studentChart")
    if(!canvas) return
    
    
    if(canvas.offsetParent === null) return
    
    
    let ctx = canvas.getContext("2d", { alpha: true })
    let dpr = window.devicePixelRatio || 1
    let rect = canvas.getBoundingClientRect()
    
    
    if(rect.width === 0 || rect.height === 0) return
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    
    let width = rect.width
    let height = rect.height
    
    ctx.clearRect(0, 0, width, height)
    
    
    let studentSickRecords = data.sick.filter(record => record.name === currentStudent.name)
    let totalSickCount = studentSickRecords.length
    
    
    
    let monthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    
    
    if(totalSickCount > 0) {
        
        let monthsToUse = [1, 3, 5] 
        for(let i = 0; i < totalSickCount && i < monthsToUse.length; i++) {
            monthlyData[monthsToUse[i]] = 1
        }
        
        if(totalSickCount > 3) {
            monthlyData[8] = totalSickCount - 3
        }
    }
    
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    let maxValue = Math.max(...monthlyData, 3)
    let padding = 60
    let chartWidth = width - padding * 2
    let chartHeight = height - padding * 2
    let barWidth = (chartWidth / monthlyData.length) - 10
    
    
    ctx.strokeStyle = "rgba(0, 0, 0, 0.05)"
    ctx.lineWidth = 1
    for(let i = 0; i <= 4; i++){
        let y = padding + (chartHeight / 4) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
    }
    
    
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()
    
    
    monthlyData.forEach((value, i) => {
        if(value === 0) return 
        
        let barHeight = (value / maxValue) * chartHeight
        let x = padding + i * (chartWidth / monthlyData.length) + 5
        let y = height - padding - barHeight
        
        
        let gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
        gradient.addColorStop(0, "#4CAF50")
        gradient.addColorStop(1, "#4CAF50dd")
        
        
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)"
        ctx.shadowBlur = 10
        ctx.shadowOffsetY = 4
        
        
        ctx.beginPath()
        ctx.moveTo(x, y + 4)
        ctx.arcTo(x, y, x + 4, y, 4)
        ctx.lineTo(x + barWidth - 4, y)
        ctx.arcTo(x + barWidth, y, x + barWidth, y + 4, 4)
        ctx.lineTo(x + barWidth, y + barHeight)
        ctx.lineTo(x, y + barHeight)
        ctx.closePath()
        ctx.fillStyle = gradient
        ctx.fill()
        
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0
        
        
        ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
        ctx.textAlign = "center"
        ctx.fillStyle = "#2E7D32"
        ctx.fillText(value, x + barWidth / 2, y - 8)
    })
    
    
    ctx.fillStyle = "#666"
    ctx.font = "11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    monthlyData.forEach((value, i) => {
        let x = padding + i * (chartWidth / monthlyData.length) + 5
        ctx.textAlign = "center"
        ctx.fillText(months[i], x + barWidth / 2, height - padding + 20)
    })
    
    
    ctx.fillStyle = "#666"
    ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    ctx.textAlign = "right"
    for(let i = 0; i <= 4; i++){
        let y = padding + (chartHeight / 4) * i
        let value = Math.round(maxValue - (maxValue / 4) * i)
        ctx.fillText(value, padding - 15, y + 4)
    }
    
    
    ctx.fillStyle = "#1a1a1a"
    ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("My Health Records - Monthly View", padding, 25)
    
    
    ctx.fillStyle = "#666"
    ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
    ctx.fillText(`Total sick days this year: ${totalSickCount}`, padding, 42)
}