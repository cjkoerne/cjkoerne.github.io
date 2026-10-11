
async function loadSnowboardingData(){
    try{
        const response = await fetch("js/boardingData.json");

        if(!response.ok){
            throw new Error("JSON file can not be opened now");
        }

        const data = await response.json();

        document.title = data.title;
        document.querySelector("#styleName").textContent = data.header;

        document.querySelector("#heroTitle").textContent = data.hero.headline;
        document.querySelector("#heroDesc").textContent = data.hero.description;

        const changeImg = data.hero.image.replace("../img/", "img/");
        document.querySelector("#heroSection").style.setProperty("--hero-img", 'url("${changeImg}")';

        document.querySelector("sec1Title").textContent = data.sections.overview.title;
        document.querySelector("sec1Subtitle").textContent = data.sections.overview.subtitle;

        const overviewCards = document.querySelectorAll("sec1Grid .card");

        data.sections.overview.overview.cards.forEach((card, index) => {
            overviewCards[index].querySelector("h3").textContent = cards.title;
            overviewCards[index].querySelector("p").textContent = cards.description;
        });

        document.querySelector("sec2Title").textContent = data.sections.equipment.title;
        document.querySelector("sec2Subtitle").textContent = data.sections.equipment.subtitle;

        const equipmentCards = document.querySelector("sec2Grid .card");

        data.sections.equipment.overview.cards((card, index) =>{
            equipmentCards[index].querySelector("h3").textContent = card.title;
            equipmentCards[index].querySelector("p").textContent = card.description;
        });
    
    }catch(error){
        console.error("error loading in the snowboarding data:", error);
    }

}
loadSnowboardingData();
