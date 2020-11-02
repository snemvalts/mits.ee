describe('Test index page (main page)', () => {
    it('Change text', () => {
        cy.changeValue('index_cta_text', `
        <h1>Hello!</h1>
        <h2>Liitumine MITSi on avatud!</h2>
        <a class="btn gradient"
           href="/liitumine"
           target="_blank" rel="noopener">Liitu</a>
           `)
        cy.get('#joininfo').should('contain', 'Hello!')
        cy.resetField('index_cta_text')
    })

    it('Change HTML tag', () => {
        cy.changeValue('index_people_container', `
        <p><strong>MAT-INF tudengiselts</strong> ehk <strong>MITS</strong> on Tartu Ülikooli matemaatika, matemaatilise statistika ja informaatika tudengeid ühendav erialaselts, mis tegutseb aktiivselt oma teaduskondade tudengite argipäeva elavdamise ja heaolu tagamisega.</p>
            <p>Seisame selle eest, et ülikool ja reaalteaduste õppimine oleks enamat, kui pelgalt uute teadmiste omandamine.</p>
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
            <p class="more"><a class="btn ghost" href="/meist">Loe veel MITSi kohta</a></p>
        `)
        cy.contains('h1', 'Alo Aasmäe')
        cy.resetField('index_people_container')
    })

    it('Remove element', () => {
        cy.changeValue('index_sponsors', `
        <h1>Meie toetajad</h1>
            <div class="sponsorgrid">
                <a title="OLE ROHKEM" id="olerohkem" class="sponsor svg" href="https://olerohkem.ee/"></a>
                <a title="IT Akadeemia" id="itakadeemia" class="sponsor svg" href="https://www.hitsa.ee/ikt-haridus/ita"></a>
            </div>
        `)
        cy.get('#ati').should('not.exist')
        cy.resetField('index_sponsors')
    })
})
