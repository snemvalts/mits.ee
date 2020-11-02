describe('Test mentor page', () => {
    it('Change text', () => {
        // this event will automatically be unbound when this
        // test ends because it's attached to 'cy'
        cy.on('uncaught:exception', (err, runnable) => { // https://stackoverflow.com/questions/56743695/error-handling-using-the-catch-block-in-cypress
            expect(err.message).to.include('something about the error')

            // using mocha's async done callback to finish
            // this test so we prove that an uncaught exception
            // was thrown
            done()

            // return false to prevent the error from
            // failing this test
            return false
        })
        cy.changeValue('mentor_intro', `
        <h1>Mentor<wbr>programm</h1>
            <p>Hello student-ae21312add! <strong>7. - 11. september</strong> saab registreerida menteeks!
            </p>
            <div class="buttons">
                <a class="btn blue" href="#mentor3">Tutvu mentorprogrammiga</a>
                <a class="btn big gradient"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSfr0ExK9SDtP2OwEGYehR51WeK_c8ZdJudKLIw2nyRTbGEaTw/viewform"
                    target="_blank" rel="noopener" >Registreeri menteeks</a>
                <a class="btn blue" href="/Mentorid2020.pdf" download="mentorid2020" >Tutvu mentoritega</a>
            </div>
        `)
        cy.visit('http://localhost:8080/mentor')
        cy.contains('Hello student-ae21312add!')
        cy.resetField('mentor_intro')
    })

    it('Change HTML tag', () => {
        // this event will automatically be unbound when this
        // test ends because it's attached to 'cy'
        cy.on('uncaught:exception', (err, runnable) => { // https://stackoverflow.com/questions/56743695/error-handling-using-the-catch-block-in-cypress
            expect(err.message).to.include('something about the error')

            // using mocha's async done callback to finish
            // this test so we prove that an uncaught exception
            // was thrown
            done()

            // return false to prevent the error from
            // failing this test
            return false
        })
        cy.changeValue('mentor_description', `
        <h1>Mentorprogrammi olemus ja töögrupp</h1>
            <p>Mentorprogrammi eesmärgiks on tagada, et iga matemaatika, matemaatilise statistika ja informaatika
                esmakursuslane elaks ülikooliellu sisse võimalikult sujuvalt, saades tuge ja nõu vanemkursuslaste käest.
                Mentorprogrammi töögrupp tegeleb mentorprogrammi arendamisega, viies kokku mentorid ja esmakursuslased,
                suurendamaks kursustevahelist põimumist. Lisaks tegeleb töögrupp motiveeritud mentorite otsimise ja
                toetamisega läbi koolituste ja koosolekute.</p>
        `)
        cy.visit('http://localhost:8080/mentor')
        cy.contains('h1', 'Mentorprogrammi olemus ja töögrupp')
        cy.resetField('mentor_description')
    })

    it('Remove element', () => { // https://stackoverflow.com/questions/56743695/error-handling-using-the-catch-block-in-cypress
        // this event will automatically be unbound when this
        // test ends because it's attached to 'cy'
        cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include('something about the error')

            // using mocha's async done callback to finish
            // this test so we prove that an uncaught exception
            // was thrown
            done()

            // return false to prevent the error from
            // failing this test
            return false
        })
        cy.changeValue('mentor_administration', `
        <h2>Programmi tervise eest hoolitsevad:</h2>
            <div class="peoplegrid">
                <div class="person">
                    <img alt="Martin Toode" src="/media/liikmed/MartinToode.jpg">
                    <h3 class="name">Martin Toode</h3>
                    <div class="email"><a href="mailto:toodemartin@gmail.com">toodemartin<wbr>@gmail.com</a></div>
                </div>
                <div class="person">
                    <img alt="Alo Aasmäe" src="/media/liikmed/AloAasmae.jpg">
                    <h3 class="name">Alo Aasmäe</h3>
                    <div class="email"><a href="mailto:aloaas@gmail.com">aloaas<wbr>@gmail.com</a></div>
                </div>
            </div>
        `)
        cy.visit('http://localhost:8080/mentor')
        cy.get('p.topmargin.center').should('not.exist')
        cy.resetField('mentor_administration')
    })
})
