describe('Test about us page', () => {
    it('Change text', () => {
        cy.changeValue('aboutus_intro', `
            <h1>Midagi_muu-112512adsadas</h1>
            <p><strong>MAT-INF tudengiselts</strong> ehk <strong>MITS</strong> on Tartu Ülikooli matemaatika, matemaatilise statistika ja informaatika tudengeid ühendav erialaselts, mis tegutseb aktiivselt oma teaduskondade tudengite argipäeva elavdamise ja heaolu tagamisega.</p>
            <p>Seisame selle eest, et ülikool ja reaalteaduste õppimine oleks enamat, kui pelgalt uute teadmiste omandamine.</p>
            <p>Meie värvikast sündmustepagasist leiab iga tudeng endale midagi meelepärast. Korraldame erinevad akadeemilisi üritusi (paneeldiskussioone, lektorite õhtuid, seminare ja töötubasid), uusi sõpru võib leida aga seltskonna- ning sotsiaalüritustel (lauamängu- ja filmiõhtutel, teemapidudel, LANidel, mälumängudel). Seejuures aitavad koolipingest vabaneda iganädalased trennid (jooksu-, jalgpalli-, korvpalli- ja võrkpallitrennid). Oleme ka esmakursuslastele mõelnud, kellele tutvustame õiget ülikoolielu mentorprogrammi abil. Iga päev sünnib aga värskeid ideid ning sündmuste nimekiri aina pikeneb.</p>
           `)
        cy.visit('http://localhost:8080/meist')
        cy.contains('Midagi_muu-112512adsadas')
        cy.resetField('aboutus_intro')
    })

    it('Change HTML tag', () => {
        cy.changeValue('aboutus_leadership', `
            <h1>Juhatus</h1>
            <p>Juhatuse eesmärk on luua seltsis keskkond, kus tiimijuhtidel oleks meeldiv ja mugav koos oma töögrupiga korraldada just neile meelepäraseid üritusi. Hoolitseme välise suhtluse eest seltsi ja instituutide vahel ning otsime alati uusi väljundeid ning võimalusi, et ükski lennukas idee ei jääks teostuse taha pidama.</p>
            <div class="peoplegrid">
                <div class="person">
                    <img alt="Marten Türk" src="/media/liikmed/MartenTurk.jpg">
                    <h3 class="name">Marten Türk</h3>
                    <div class="role">President</div>
                </div>
                <div class="person">
                    <img alt="Alo Aasmäe" src="/media/liikmed/AloAasmae.jpg">
                    <h1 class="name">Alo Aasmäe</h1>
                    <div class="role">Asepresident</div>
                </div>
                <div class="person">
                    <img alt="Danver Hans Värv" src="/media/liikmed/DanverHansVarv.jpg">
                    <h3 class="name">Danver Hans Värv</h3>
                    <div class="role">Finantsjuht</div>
                </div>
                <div class="person">
                    <img alt="Kristiina Krause" src="/media/liikmed/KristiinaKrause.jpg">
                    <h3 class="name">Kristiina Krause</h3>
                    <div class="role">Sponsorlusjuht</div>
                </div>
            </div>
        `)
        cy.visit('http://localhost:8080/meist')
        cy.contains('h1', 'Alo Aasmäe')
        cy.resetField('aboutus_leadership')
    })

    it('Remove element', () => {
        cy.changeValue('aboutus_history', `
            <p>
                Esmakordselt sai MAT-INF tudengiselts alguse Taivo Pungase eestvedamisel 23. aprillil 2014.
                Kuni 2016. aasta lõpuni korraldas MITS erinevaid sündmusi ning seisis tudengite heaolu eest.
                Järelkasvu puudumise tõttu aga pandi pillid mõneks ajaks kotti.
            </p>
            <p>
                MITS taasasustati 20. aprillil 2018, kui 10 aktiivset noort võtsid südameasjaks oma teaduskondade
                tudengite elu värvikamaks muuta.
                Huvilisi leidus veelgi ning esimesed vägiteod saadeti korda 30-pealise tiimiga,
                millest esimene suursündmus oli networking-seminar
                <a href="https://www.facebook.com/events/863700093813482/">Make MITS Great Again</a>.
                Taasalustava organisatsiooni kohta oli sündmus väga edukas - kohal käis ligikaudu 150 tudengit
                ning huvi seltsi vastu kasvas hüppeliselt.
                Tänaseks tegutseb MITSis juba üle viiekümne aktiivse liikme.
            </p>
        `)
        cy.visit('http://localhost:8080/meist')
        cy.get('#history div.container div.content h1').should('not.exist')
        cy.resetField('aboutus_history')
    })
})
