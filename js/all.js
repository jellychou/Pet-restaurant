let allResults = [];  //全部的資料
let allZones = [];  //全部的區（重複）
let clearZones = [];  //總共有幾區
let allLen;  //總長度
let resType = []; //全部的餐廳類型
let north = document.getElementById('northCount');
let middle = document.getElementById('middleCount');
let south = document.getElementById('southCount');
let east = document.getElementById('eastCount');
let year = document.querySelector('.year');
let pointSerch = document.querySelector('.point-serch');
let serchBtn = document.querySelector('.serch-btn');
let list = document.querySelector('.list');
let all = document.getElementById('all');
let map;
let markers = [];
let categoryArr = [];
let selectArry = [];
let mapList = document.querySelector('.map-list');
let btnRadius = document.querySelectorAll('.btn-radius');
let infoCardshow = [];
let show_of_page = 5;
let number_of_items = 0;
let number_of_pages = 0;
let textNode;
let pagination = document.querySelector('.pagination');
textNode = '';


// "1"寵物餐廳
// "2"寵物友善餐廳
// "3"寵物樂園
// "4"寵物美容
// "5"寵物安親
// "6"浪浪中途
// "7"寵物雜貨
$(document).ready(function () {

    $('.point-btn').click(function () {
        $('.point').removeClass('dispoint').addClass('disblock');
        $('.dispage').removeClass('dispage').addClass('disblock');
        if ($('.map').hasClass('disblock')) {
            $('.map').removeClass('disblock').addClass('dismap');
        }
    })
    $('.map-btn').click(function () {
        $('.map').removeClass('dismap').addClass('disblock');
        $('.dispage').removeClass('dispage').addClass('disblock');
        if ($('.point').hasClass('disblock')) {
            $('.point').removeClass('disblock').addClass('dispoint');
        }
    })

    $.ajax({
        url: 'http://localhost:3000/posts',
        method: 'get',
        dataType: 'json',
        data: {}
    }).done(function (res) {
        console.log(res)
        allResults = res;
        allLen = allResults.length;
        console.log(allLen);
        for (let i = 0; i < allResults.length; i++) {
            allZones.push(allResults[i].properties.Zone);
        }

        for (let i = 0; i < allZones.length; i++) {
            if (clearZones.indexOf(allZones[i]) == -1) {
                clearZones.push(allZones[i]);
            }
        }
        for (let i = 0; i < allLen; i++) {
            resType.push(allResults[i].properties.Classification);
        }
        let tempNorth = 0;
        let tempMid = 0;
        let tempSouth = 0;
        let tempEast = 0;
        for (let i = 0; i < allZones.length; i++) {
            switch (allZones[i]) {
                case '北部':
                    tempNorth++;
                    break;
                case '中部':
                    tempMid++;
                    break;
                case '南部':
                    tempSouth++;
                    break;
                case '東部':
                    tempEast++;
                    break;
            }
        }

        north.textContent = '(' + tempNorth + ')';
        middle.textContent = '(' + tempMid + ')';
        south.textContent = '(' + tempSouth + ')';
        east.textContent = '(' + tempEast + ')';

        for (let i = 0; i < allLen; i++) {
            categoryArr.push(allResults[i].properties.Category);
        }

        $('.btn-radius').on('click', function (e) {
            pagination.innerHTML = '';
            if (e.target.id !== 'all') {
                $('#all').removeClass('active');
            } else {
                $('#all').addClass('active');
                $('.btn-radius').attr('class', 'btn-radius');
            }
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }

            // let selectCategory;
            // list.innerHTML = '';
            selectArry = [];
            $('.infoCard').hide();
            infoCardshow = [];
            $('.btn-radius.active').each(function () {
                selectArry.push(Number(this.dataset.num));
            });
            categoryArr.forEach((val, index) => {
                if (arrInArr(selectArry, val)) {
                    $($('.infoCard')[index]).show();
                    infoCardshow.push($('.infoCard')[index]);
                }
            });
            listCount();
        });

        // $('.total').on('click',function (e) {
        //     list.innerHTML = '';
        //     for ( let i = 0; i < allLen; i++) {
        //         list.innerHTML += `
        //         <div class="mt-md-3 border-style">
        //             <div class="bg-warning">
        //                 <div class="row list">
        //                     <div class="col-md-3 no-gutter">
        //                         <img class="w-100 h-100" src="${allResults[i].properties.Images}">
        //                     </div> 
        //                     <div class="col-md-9 my-md-2">
        //                         <h4>${allResults[i].properties.Name}</h4>
        //                         <p class="mb-md-1"><i class="fas fa-phone-square text-secondary mr-md-3"></i>
        //                         ${allResults[i].properties.Tel}</p>
        //                         <p class="mb-md-1"><i class="fas fa-map-marker-alt text-secondary mr-md-3"></i>
        //                         ${allResults[i].properties.Add}</p>
        //                         <p class="mb-md-1"><i class="fas fa-clock text-secondary mr-md-3"></i>
        //                         ${allResults[i].properties.Time}</p>
        //                         <p class="mb-md-1"><i class="fas fa-paw text-secondary mr-md-3"></i>
        //                         ${allResults[i].properties.Classification}</p>
        //                     </div>
        //                 </div> 
        //             </div>      
        //         </div>`;
        //     }
        // });

        $('.areaClick').on('click', function (e) {
            let el = e.target.textContent;
            console.log(el);
            list.innerHTML = '';
            for (let i = 0; i < allLen; i++) {
                if (el.indexOf(allZones[i]) !== -1) {
                    list.innerHTML += `
                    <div class="mt-md-3 border-style infoCard">
                        <div class="bg-warning">
                            <div class="row list"> 
                                <div class="col-md-3 no-gutter">
                                    <img class="w-100 h-100" src="${allResults[i].properties.Images}">
                                </div> 
                                <div class="col-md-9 my-md-2">
                                    <h4>${allResults[i].properties.Name}</h4>
                                    <p class="mb-md-1"><i class="fas fa-phone-square text-secondary mr-md-3"></i>
                                    ${allResults[i].properties.Tel}</p>
                                    <p class="mb-md-1"><i class="fas fa-map-marker-alt text-secondary mr-md-3"></i>
                                    ${allResults[i].properties.Add}</p>
                                    <p class="mb-md-1"><i class="fas fa-clock text-secondary mr-md-3"></i>
                                    ${allResults[i].properties.Time}</p>
                                    <p class="mb-md-1"><i class="fas fa-paw text-secondary mr-md-3"></i>
                                    ${allResults[i].properties.Classification}</p>
                                </div>
                            </div> 
                        </div>      
                    </div>`;
                }
            }
            infoCardshow = [];
            $('.infoCard').each(function() {
                infoCardshow.push(this);
            })
            listCount();
        });



        for (let i = 0; i < allLen; i++) {
            list.innerHTML += `
            <div class="mt-md-3 border-style infoCard">
                <div class="bg-warnin">
                    <div class="row list">
                        <div class="col-md-3 no-gutter">
                            <img class="w-100 h-100" src="${allResults[i].properties.Images}">
                        </div> 
                        <div class="col-md-9 my-md-2">
                            <h4>${allResults[i].properties.Name}</h4>
                            <p class="mb-md-1"><i class="fas fa-phone-square text-secondary mr-md-3"></i>
                            ${allResults[i].properties.Tel}</p>
                            <p class="mb-md-1"><i class="fas fa-map-marker-alt text-secondary mr-md-3"></i>
                            ${allResults[i].properties.Add}</p>
                            <p class="mb-md-1"><i class="fas fa-clock text-secondary mr-md-3"></i>
                            ${allResults[i].properties.Time}</p>
                            <p class="mb-md-1"><i class="fas fa-paw text-secondary mr-md-3"></i>
                            ${allResults[i].properties.Classification}</p>
                        </div>
                    </div> 
                </div>      
                </div>`;
        };

        $('.infoCard').each(function () {
            infoCardshow.push(this);
        });


        $('#all').on('click', function () {
            $('.infoCard').show();
        })

        let image = {
            url: '../images/point-icon.png',
            scaledSize: new google.maps.Size(50, 50),
        };

        for (let i = 0; i < allResults.length; i++) {
            let str = {};
            let place = {};
            place.lng = parseFloat(allResults[i].geometry.Coordinates[0]);
            place.lat = parseFloat(allResults[i].geometry.Coordinates[1]);

            str.map = map;
            str.icon = image;
            str.title = allResults[i].properties["Name"];
            str.position = place;
            str.animation = google.maps.Animation.DROP;
            let marker = new google.maps.Marker(str);
            markers.push(marker);
            marker.addListener('click', function () {
                // map.setCenter(marker.getPosition());
                mapList.innerHTML = ` <div class="card">
                <img src="${allResults[i].properties.Images}"
                    class="card-img-top w-100 object-fit" alt="...">
                <div class="card-body">
                    <h4 class="card-title">${allResults[i].properties.Name}</h4>
                    <p class="card-text"><i class="fas fa-phone-square text-secondary mr-md-3"></i>${allResults[i].properties.Tel}
                    </p>
                    <p class="card-text"><i
                            class="fas fa-map-marker-alt text-secondary mr-md-3"></i>${allResults[i].properties.Add}</p>
                    <p class="card-text"><i class="fas fa-clock text-secondary mr-md-3"></i>${allResults[i].properties.Time}</p>
                    <p class="card-text"><i
                            class="fas fa-paw text-secondary mr-md-3"></i>${allResults[i].properties.Classification}
                    </p>
                </div>
            </div> `;
            });
            marker.addListener('click', initBounce);
            function initBounce() {
                markers.forEach((val) => {
                    val.setAnimation(null);
                });
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }

        };







    }).fail(function (err) {
        console.log(err)
    });
});

let today = new Date();
let thisYear = today.getFullYear();
year.innerHTML = `&copy; ${thisYear}`;


function totalClick() {
    for (let i = 0; i < allLen; i++) {
        list.innerHTML += `
        <div class="mt-md-3 border-style">
            <div class="bg-warning">
                <div class="row list">
                    <div class="col-md-3 no-gutter">
                        <img class="w-100 h-100" src="${allResults[i].properties.Images}">
                    </div> 
                    <div class="col-md-9 my-md-2">
                        <h4>${allResults[i].properties.Name}</h4>
                        <p class="mb-md-1"><i class="fas fa-phone-square text-secondary mr-md-3"></i>
                        ${allResults[i].properties.Tel}</p>
                        <p class="mb-md-1"><i class="fas fa-map-marker-alt text-secondary mr-md-3"></i>
                        ${allResults[i].properties.Add}</p>
                        <p class="mb-md-1"><i class="fas fa-clock text-secondary mr-md-3"></i>
                        ${allResults[i].properties.Time}</p>
                        <p class="mb-md-1"><i class="fas fa-paw text-secondary mr-md-3"></i>
                        ${allResults[i].properties.Classification}</p>
                    </div>
                </div> 
            </div>      
        </div>`;
    }
};


//map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 23.6268743, lng: 121.0105996 },
        zoom: 7.8,
        styles: [
            {
                "stylers": [
                    {
                        "hue": "#dd0d0d"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 100
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            }
        ],
    });
    // map.addListener('center_changed', function () {
    //     // 3 seconds after the center of the map has changed, pan back to the
    //     // marker.
    //     window.setTimeout(function () {
    //         map.panTo(marker.getPosition());
    //     }, 3000);
    // });
};

function arrInArr(ary, target) {
    for (let i = 0; i < ary.length; i++) {
        if (!target.includes(ary[i])) {
            return false;
        }
    }
    return true;
}

function listCount() {
    number_of_items = infoCardshow.length;
    number_of_pages = Math.ceil(number_of_items / show_of_page);
    textNode = '';
    for (let i = 1; i < number_of_pages + 1; i++) {
        textNode += `
        <li class="page-item page-num" onclick="changePage(${i - 1})">
        <a class="page-link" href="#">${i}</a>
        </li>`;
        pagination.innerHTML = `
     <li class="page-item">
         <a class="page-link" href="#" aria-label="Previous">
             <span aria-hidden="true">&laquo;</span>
         </a>
     </li>
     ${textNode}
     <li class="page-item">
         <a class="page-link" href="#" aria-label="Next">
             <span aria-hidden="true">&raquo;</span>
         </a>
     </li> `;
    }
    // // pagination.innerHTML = ''; 
    // console.log(document.querySelectorAll('.page-num')[0].classList);
    // document.querySelectorAll('.page-num')[0].classList.add('active');
}