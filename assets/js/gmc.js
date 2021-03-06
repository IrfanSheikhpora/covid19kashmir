const API_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSg-doiJ59mWF5UiJP-tCB6XCqahr9YaXe6eHiyWFyjylHtGRuy5yZrw1ZNWq3etbbyU8Gqz0i5gANp/pub?gid=1591401483&single=true&output=csv"
let data;
let dates;
let currentDateIndex;
function loadData(){
    progressBarVisible(true)

    fetch(API_URL).then((response)=>{
        return response.text()
    }).then((text)=>{
        data = ArraysToDict(CSVToArray(text));
        dates = data.map((item)=>{return item["Date"]}).filter((value,index,self)=>{return self.indexOf(value)===index});
        console.log(data)
        loadTable();
    });
}

function loadTable(){
    progressBarVisible(false);
    todaysDate = getTodaysDate();
    currentDateIndex = dates.indexOf(todaysDate);
    $("#date-options").html(dates.map((date,index)=>{
        return `<a class="dropdown-item ${(index===currentDateIndex)?"is-active":""}" onclick="javascript:changeDate(this)">${date}</a>`
    }))
    $("#date-now").html(todaysDate)
    loadByDate();
}

function loadByDate(){
    $("#data-table tbody").html("");
    for(let doctor of data){
        if(doctor["Date"] !== dates[currentDateIndex]) continue;
        $("#data-table tbody").append(`
        <tr>
        <td>${doctor["Name"]}</td>
                      <td>${doctor["Speciality"]}</td>
                      <td>${doctor["Phone No"].split(",").map((phone)=>{
                          return `<span class="icon"><i class="fas fa-phone-alt"></i></span><a href="tel:${phone}">${phone}</a>`
                      })}</td>  
        </tr>
    `)
    }
}

function changeDate(date){
    currentDateIndex = dates.indexOf(date.text)
    $("#date-now").html(date.text)
    $("#date-options .is-active").removeClass("is-active")
    $(date).addClass("is-active")
    $(".dropdown").toggleClass("is-active");
    loadByDate();
}


$(document).ready(function(){
    loadData();
    $(".dropdown-trigger").click(function(){
        $(".dropdown").toggleClass("is-active");
    })
})

