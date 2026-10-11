
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
        document.querySelector("#heroDescript").textContent = data.hero.description;

        const changeImg = data.hero.image.replace();
        document.querySelector("#heroSection").style.setProperty();

        document.querySelector("overviewTitle").textContent = data.sections.overview.title;
        document.querySelector("overviewSubtitle").textContent = data.sections.overview.subtitle;

        const overviewCards = document.querySelectorAll("overviewGrid .card");

        data.sections.overview.overview.cards.forEach((card, index) => {
            overviewCards[index].querySelector("h3").textContent = cards.title;
            overviewCards[index].querySelector("p").textContent = cards.description;
        });

        document.querySelector("equipmentTitle").textContent = data.sections.equipment.title;
        document.querySelector("equipSubtitle").textContent = data.sections.equipment.subtitle;

        const equipmentCards = document.querySelector("equipCards .card");

        data.sections.equipment.overview.cards((card, index) =>{
            equipmentCards[index].querySelector("h3").textContent = card.title;
            equipmentCards[index].querySelector("p").textContent = card.description;
        });
    
    }catch(error){
        console.error("error loading in the snowboarding data:", error);
    }
}
