const mongoose = require('mongoose');
const { Schema } = mongoose;

// not sure if this is how mongo works
const defaultValues = {
  cta_text: `
    <h1>Hei!</h1>
    <h2>Liitumine MITSi on avatud!</h2>
    <a class="btn gradient"
       href="/liitumine"
       target="_blank" rel="noopener">Liitu</a>
  `,
  people_container: `
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
                    <h3 class="name">Alo Aasmäe</h3>
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
  `,

  sponsors: `
    <h1>Meie toetajad</h1>
            <div class="sponsorgrid">
                <a title="ATI" id="ati" class="sponsor svg" href="https://cs.ut.ee/"></a>
                <a title="OLE ROHKEM" id="olerohkem" class="sponsor svg" href="https://olerohkem.ee/"></a>
                <a title="IT Akadeemia" id="itakadeemia" class="sponsor svg" href="https://www.hitsa.ee/ikt-haridus/ita"></a>
            </div>
  `,
  partners: `
  <h1>Meie partnerid</h1>
            <div class="sponsorgrid">
                <a title="Nortal" id="nortal" class="sponsor svg" href="https://nortal.com/"></a>
                <a title="Veriff" id="veriff" class="sponsor svg" href="https://www.veriff.com/"></a>
                <a title="Pipedrive" id="pipedrive" class="sponsor svg" href="https://www.pipedrive.com/"></a>
            </div>
  `,
};
const CMSFieldSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: { type: String, required: true },
});

const CMSField = mongoose.model('CMSField', CMSFieldSchema);

Object.keys(defaultValues).forEach((key) => {
  const field = new CMSField({
    key,
    value: defaultValues[key],
  });

  field.save();
});

module.exports = CMSField;