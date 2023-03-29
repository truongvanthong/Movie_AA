//TMDB 

const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8'; //API KEY
const BASE_URL = 'https://api.themoviedb.org/3'; //BASE URL
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY; //API URL
const IMG_URL = 'https://image.tmdb.org/t/p/w500'; //IMAGE URL
const searchURL = BASE_URL + '/search/movie?' + API_KEY; //SEARCH URL

//GENRES
const genres = [{
        "id": 28,
        "name": "Action" //Hành động
    },
    {
        "id": 12,
        "name": "Adventure" //Phiêu lưu
    },
    {
        "id": 16,
        "name": "Animation" //Hoạt hình
    },
    {
        "id": 35,
        "name": "Comedy" //Hài hước
    },
    {
        "id": 80,
        "name": "Crime" //Hình sự
    },
    {
        "id": 99,
        "name": "Documentary" //Tài liệu
    },
    {
        "id": 18,
        "name": "Drama" // kịch
    },
    {
        "id": 10751,
        "name": "Family" //Gia đình
    },
    {
        "id": 14,
        "name": "Fantasy" //Viễn tưởng
    },
    {
        "id": 36,
        "name": "History" //Lịch sử
    },
    {
        "id": 27,
        "name": "Horror" //Kinh dị
    },
    {
        "id": 10402,
        "name": "Music" //Âm nhạc
    },
    {
        "id": 9648,
        "name": "Mystery" //Bí ẩn
    },
    {
        "id": 10749,
        "name": "Romance" //Tình cảm
    },
    {
        "id": 878,
        "name": "Science Fiction" //Khoa học viễn tưởng
    },
    {
        "id": 10770,
        "name": "TV Movie" //Phim truyền hình
    },
    {
        "id": 53,
        "name": "Thriller" //Kinh dị
    },
    {
        "id": 10752,
        "name": "War" //Chiến tranh
    },
    {
        "id": 37,
        "name": "Western" //Phim bắn súng
    }
]

const main = document.getElementById('main'); // hiển thị các phim
const form = document.getElementById('form'); // tìm kiếm phim
const search = document.getElementById('search'); // nhập từ khóa tìm kiếm
const tagsEl = document.getElementById('tags'); // hiển thị các thể loại phim
const prev = document.getElementById('prev') // hiển thị nút prev
const next = document.getElementById('next') // hiển thị nút next
const current = document.getElementById('current') //hiển thị số trang hiện tại

var currentPage = 1; //lưu trữ số trang hiện tại
var nextPage = 2; //lưu trữ số trang tiếp theo
var prevPage = 3; //lưu trữ số trang trước đó
var lastUrl = ''; // lưu trữ url cuối cùng
var totalPages = 100; // lưu trữ tổng số trang

var selectedGenre = [] // lưu trữ các thể loại phim được chọn
setGenre(); // hiển thị các thể loại phim

// hàm lấy thể loại phim
function setGenre() {
    //xóa các thể loại phim cũ
    tagsEl.innerHTML = '';
    //duyệt qua mảng các thể loại phim
    genres.forEach(genre => {

        const t = document.createElement('div');
        t.classList.add('tag');

        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
                if (selectedGenre.length == 0) {
                    selectedGenre.push(genre.id);
                } else {
                    if (selectedGenre.includes(genre.id)) {
                        selectedGenre.forEach((id, idx) => {
                            if (id == genre.id) {
                                selectedGenre.splice(idx, 1);
                            }
                        })
                    } else {
                        selectedGenre.push(genre.id);
                    }
                }
                console.log(selectedGenre) //in ra mảng các thể loại phim được chọn
                    // gọi hàm getMovies để lấy danh sách phim theo thể loại được chọn
                getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
                    //
                highlightSelection()
            })
            // thêm các thể loại phim vào tagsEl
        tagsEl.append(t);
    })
}

// Hàm đánh dấu các thể loại phim được chọn
function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if (selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }

}

// hàm tạo nút clear để xóa các thể loại phim được chọn 
function clearBtn() {
    let clearBtn = document.getElementById('clear'); // tìm nút clear
    if (clearBtn) { // nếu nút clear đã tồn tại
        clearBtn.classList.add('highlight') // thì đánh dấu nút clear
    } else {

        let clear = document.createElement('div'); // tạo nút clear
        clear.classList.add('tag', 'highlight'); // thêm class cho nút clear
        clear.id = 'clear'; // thêm id cho nút clear
        clear.innerText = 'Clear x'; // thêm nội dung cho nút clear
        clear.addEventListener('click', () => { // thêm sự kiện click cho nút clear
            selectedGenre = []; // xóa các thể loại phim được chọn
            setGenre(); // hiển thị lại các thể loại phim
            getMovies(API_URL); // hiển thị lại danh sách phim
        })
        tagsEl.append(clear); // thêm nút clear vào tagsEl
    }
}

// gọi hàm getMovies để lấy danh sách phim
getMovies(API_URL);

// hàm lấy danh sách phim
function getMovies(url) {
    lastUrl = url; // lưu trữ url cuối cùng

    // lấy dữ liệu từ url và chuyển đổi dữ liệu sang json
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if (data.results.length !== 0) {
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if (currentPage <= 1) {
                prev.classList.add('disabled');
                next.classList.remove('disabled')
            } else if (currentPage >= totalPages) {
                prev.classList.remove('disabled');
                next.classList.add('disabled')
            } else {
                prev.classList.remove('disabled');
                next.classList.remove('disabled')
            }

            tagsEl.scrollIntoView({ behavior: 'smooth' })

        } else {
            main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
        }
    })
}

// hàm hiển thị danh sách phim
function showMovies(data) {
    // xóa các phim cũ
    main.innerHTML = '';

    // duyệt qua mảng các phim
    data.forEach(movie => {
        // lấy các thông tin của phim từ mảng data gồm có: tên phim, ảnh phim, điểm đánh giá, mô tả, id
        const { title, poster_path, vote_average, overview, id } = movie;
        // tạo thẻ div chứa thông tin phim
        const movieEl = document.createElement('div');
        // thêm class cho thẻ div
        movieEl.classList.add('movie');
        // thêm nội dung cho thẻ div

        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                
                <button class="know-more" id="${id}">Know More</button
            </div>
        
        `

        // thêm thẻ div vào thẻ main
        main.appendChild(movieEl);

        // thêm sự kiện click cho nút Know More
        document.getElementById(id).addEventListener('click', () => {
            console.log(id)
            openNav(movie)
        })
    })
}

// hàm lấy màu cho điểm đánh giá phim 
const overlayContent = document.getElementById('overlay-content');


// hàm mở overlay khi click vào nút Know More 
function openNav(movie) {
    let id = movie.id;
    // lấy dữ liệu trailer của phim từ id của phim
    fetch(BASE_URL + '/movie/' + id + '/videos?' + API_KEY).then(res => res.json()).then(videoData => {
        // hàm console.log để kiểm tra dữ liệu
        console.log(videoData);

        if (videoData) {
            document.getElementById("myNav").style.width = "100%";
            if (videoData.results.length > 0) { // nếu có trailer thì hiển thị trailer đầu tiên và các nút điều khiển trailer khác
                var embed = []; // mảng chứa các iframe của trailer
                var dots = []; // mảng chứa các nút điều khiển trailer
                videoData.results.forEach((video, idx) => { // duyệt qua mảng các trailer
                    let { name, key, site } = video // lấy tên trailer, key của trailer, site của trailer

                    if (site == 'YouTube') // nếu site của trailer là YouTube thì hiển thị trailer
                    {

                        // thêm nội dung iframe của trailer vào mảng embed
                        embed.push(`
                                    <iframe 
                                    width="560" height="315" 
                                    src="https://www.youtube.com/embed/${key}" title="${name}" 
                                    class="embed hide" frameborder="0" allow="accelerometer; 
                                    autoplay; 
                                    clipboard-write; 
                                    encrypted-media;
                                    gyroscope; 
                                    picture-in-picture" 
                                    allowfullscreen></iframe>
                                    `)
                            // thêm nội dung nút điều khiển trailer vào mảng dots
                        dots.push(`
                                <span class="dot">${idx + 1}</span>
                                `)
                    }
                })

                // thêm nội dung vào overlay
                var content = `
        <h1 class="no-results">${movie.original_title}</h1>
        <br/>
        
        ${embed.join('')}
        <br/>

        <div class="dots">${dots.join('')}</div>
        
        `
                overlayContent.innerHTML = content;
                activeSlide = 0;
                showVideos();
            } else {
                overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
            }
        }
    })
}

// hàm đóng overlay khi click vào nút x  ở góc trên bên phải của overlay 
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

var activeSlide = 0; // biến lưu trữ vị trí của slide hiện tại
var totalVideos = 0; // biến lưu trữ tổng số slide

// hàm hiển thị slide hiện tại và ẩn các slide còn lại 
function showVideos() {
    // lấy các thẻ iframe chứa video
    let embedClasses = document.querySelectorAll('.embed');
    // lấy các thẻ span chứa các nút điều khiển video
    let dots = document.querySelectorAll('.dot');

    // lấy tổng số video 
    totalVideos = embedClasses.length;
    // duyệt qua các thẻ iframe và thẻ span
    embedClasses.forEach((embedTag, idx) => {
        if (activeSlide == idx) { // nếu vị trí của slide hiện tại trùng với vị trí của slide thì hiển thị slide đó
            embedTag.classList.add('show') // thêm class show để hiển thị slide
            embedTag.classList.remove('hide') // xóa class hide để ẩn slide

        } else { // nếu vị trí của slide hiện tại không trùng với vị trí của slide thì ẩn slide đó
            embedTag.classList.add('hide');
            embedTag.classList.remove('show')
        }
    })

    // duyệt qua các thẻ span và thêm class active cho thẻ span có vị trí trùng với vị trí của slide hiện tại
    dots.forEach((dot, indx) => { // indx là vị trí của thẻ span
        if (activeSlide == indx) { // nếu vị trí của slide hiện tại trùng với vị trí của thẻ span thì thêm class active
            dot.classList.add('active');
        } else { // nếu vị trí của slide hiện tại không trùng với vị trí của thẻ span thì xóa class active
            dot.classList.remove('active')
        }
    })
}

// thêm sự kiện click cho các nút điều khiển slide
const leftArrow = document.getElementById('left-arrow')
    // lấy thẻ span chứa nút điều khiển slide bên phải
const rightArrow = document.getElementById('right-arrow')

// -----------------------thêm sự kiện click cho nút điều khiển slide bên trái phải----------------------------
leftArrow.addEventListener('click', () => {
    if (activeSlide > 0) {
        activeSlide--;
    } else {
        activeSlide = totalVideos - 1;
    }

    showVideos()
})

rightArrow.addEventListener('click', () => {
        if (activeSlide < (totalVideos - 1)) {
            activeSlide++;
        } else {
            activeSlide = 0;
        }
        showVideos()
    })
    // -----------------------------------------------------------------------------------------------------------

// hàm getColor dùng để lấy màu cho vote 
function getColor(vote) {
    if (vote >= 8) { // nếu vote lớn hơn hoặc bằng 8 thì trả về màu xanh
        return 'green'
    } else if (vote >= 5) { // nếu vote lớn hơn hoặc bằng 5 thì trả về màu vàng
        return "orange"
    } else { // nếu vote nhỏ hơn 5 thì trả về màu đỏ
        return 'red'
    }
}

// xử lý form.addEventListener dùng để lấy dữ liệu từ form và gửi lên server 
form.addEventListener('submit', (e) => { // thêm sự kiện submit cho form
    e.preventDefault(); // ngăn chặn sự kiện submit mặc định của form

    const searchTerm = search.value; // lấy giá trị từ input search
    selectedGenre = []; // xóa mảng selectedGenre
    setGenre(); // gọi hàm setGenre để xóa các thẻ span chứa thể loại phim đã chọn
    if (searchTerm) { // nếu searchTerm khác rỗng thì gọi hàm getMovies và truyền vào url search
        getMovies(searchURL + '&query=' + searchTerm) // gọi hàm getMovies và truyền vào url search
    } else { // nếu searchTerm rỗng thì gọi hàm getMovies và truyền vào url discover
        getMovies(API_URL); // gọi hàm getMovies và truyền vào url discover
    }
})

// sự kiện prevpage và nextpage dùng để chuyển trang
prev.addEventListener('click', () => {
    if (prevPage > 0) {
        pageCall(prevPage);
    }
})

next.addEventListener('click', () => {
    if (nextPage <= totalPages) {
        pageCall(nextPage);
    }
})

// hàm pageCall dùng để gọi hàm getMovies và truyền vào url mới
function pageCall(page) { // page là số trang cần chuyển đến
    let urlSplit = lastUrl.split('?'); // tách url thành 2 phần
    let queryParams = urlSplit[1].split('&'); // tách các tham số trong url thành mảng
    let key = queryParams[queryParams.length - 1].split('='); // tách tham số page ra khỏi mảng
    if (key[0] != 'page') { // nếu tham số page không tồn tại thì thêm tham số page vào url
        let url = lastUrl + '&page=' + page // url mới
        getMovies(url); // gọi hàm getMovies và truyền vào url mới
    } else { // nếu tham số page tồn tại thì thay thế tham số page bằng tham số page mới
        key[1] = page.toString(); // thay thế tham số page bằng tham số page mới
        let a = key.join('='); // nối các phần tử trong mảng thành chuỗi
        queryParams[queryParams.length - 1] = a; // thay thế phần tử cuối cùng của mảng bằng chuỗi mới
        let b = queryParams.join('&'); // nối các phần tử trong mảng thành chuỗi
        let url = urlSplit[0] + '?' + b // url mới
        getMovies(url); // gọi hàm getMovies và truyền vào url mới
    }
}