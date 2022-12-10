
const nav = document.querySelector(".mobile-nav")
const navMenuBtn = document.querySelector(".nav-menu-btn")
const moreBtn = document.querySelector("#more-topic")
const topicList = document.querySelector(".topic-list")
const categorie1 = document.querySelector("#cat-1")
const categorie2 = document.querySelector("#cat-2")
const categorie3 = document.querySelector("#cat-3")

let theme = localStorage.getItem('theme');
if(!theme){
    localStorage.setItem('theme','1theme-btn theme-btn-desktop light');
    theme = localStorage.getItem('theme');
}






const navCloseBtn = document.querySelector(".nav-close-btn")
const navToggleFunc = function () {
    nav.classList.toggle("active")
};
navMenuBtn.addEventListener("click", navToggleFunc)
navCloseBtn.addEventListener("click", navToggleFunc);
const themeBtn = document.querySelectorAll(".theme-btn");

if (theme && theme.includes('dark')) {
    document.body.classList.add('dark-theme')
    document.body.classList.remove('light-theme')
    themeBtn[Number(theme[0])].classList.toggle("dark")
}
else {
    document.body.classList.add('light-theme')
    document.body.classList.remove('dark-theme')
    themeBtn[Number(theme[0]) - 1].classList.toggle("light")

}






for (let i = 0; i < themeBtn.length; i++)
    themeBtn[i].addEventListener("click", (function () {
        document.body.classList.toggle("light-theme")
        document.body.classList.toggle("dark-theme");
        for (let i = 0; i < themeBtn.length; i++)
            themeBtn[i].classList.toggle("light")
        themeBtn[i].classList.toggle("dark")
        localStorage.setItem('theme', i + '' + themeBtn[i].className)
    }));

categorie1.addEventListener("click", (function () {
    topicList.innerHTML = `
    <a href="/?category=education" class="topic-btn">
                            <div class="icon-box">
                                <ion-icon name="server-outline"></ion-icon>
                            </div>

                            <p>Education</p>
                        </a>

                        <a href="/?category=food" class="topic-btn">
                            <div class="icon-box">
                                <ion-icon name="accessibility-outline"></ion-icon>
                            </div>

                            <p>Food</p>
                        </a>

                        <a href="/?category=travel" class="topic-btn">
                            <div class="icon-box">
                                <ion-icon name="rocket-outline"></ion-icon>
                            </div>

                            <p>Travel</p>
                        </a>
    `
}))

categorie2.addEventListener("click", (function () {
    topicList.innerHTML = `
    <a href="/?category=health and fitness" class="topic-btn">
                    <div class="icon-box">
                    <ion-icon name="accessibility-outline"></ion-icon>
                    </div>

                    <p>Health and fitness</p>
                </a>
                <a href="/?category=fashion and beauty" class="topic-btn">
                <div class="icon-box">
                <ion-icon name="bonfire-outline"></ion-icon>
                </div>

                <p>Fashion and beauty</p>
            </a>
            <a href="/?category=photography" class="topic-btn">
                <div class="icon-box">
                <ion-icon name="camera-outline"></ion-icon>
                </div>

                <p>Photography</p>
            </a>
    `
}))

categorie3.addEventListener("click", (function () {
    topicList.innerHTML = `
            <a href="/?category=politices" class="topic-btn">
                <div class="icon-box">
                <ion-icon name="people-circle-outline"></ion-icon>
                </div>

                <p>Politics</p>
            </a>
            <a href="/?category=economics" class="topic-btn">
                <div class="icon-box">
                <ion-icon name="cash-outline"></ion-icon>
                </div>

                <p>Economics</p>
            </a>
            <a href="/?category=environment" class="topic-btn">
                <div class="icon-box">
                <ion-icon name="cloudy-night-outline"></ion-icon>
                </div>

                <p>Environment</p>
            </a>
    `
}));


const notify = document.getElementById('notify-btn');

notify.addEventListener("mouseover", function (event) {
    fetch('/notify-change', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const badge = document.getElementById('total-notify');
                badge.style.display = 'none';
            }
        })
});

function profileEdit(user_id) {
    
}



