musica = 0, progresso = 0, demo = 0, q = [false, false, false];

dialogue = [{
    condition: "progresso==0",
    option: "Dimostrazione",
    text: "Benvenuto alla demo del tester, prova a farmi qualche domanda",
    trigger: "progresso=1;"
        }, {
    condition: "progresso==1",
    option: "(scazzato) Cosa puoi fare? ",
    text: "Praticamente.. tutto! Il limite è la tua fantasia e la tua logica.",
    trigger: "alert('posso fare questo...'); window.open('https://en.wiktionary.org/wiki/questo');tester. innerHTML='o anche questo >:3<br>si, ti tocca refreshare...';"
        }, {
    condition: "progresso==1",
    option: "(gentile) Cosa puoi fare?",
    text: "Il trigger, come puoi notare, può anche lanciare eventi di qualsiasi tipo, come ad esempio riprodurre una canzone, o farti hackerare l'editor dai gattini!",
    trigger: "dropit= new Audio('https://saantonandre.github.io/dropit.mp3'); dropit.play(); musica=1; id('tester').style.backgroundImage= 'url(\"https://i2.wp.com/www.wehuntedthemammoth.com/wp-content/uploads/2017/04/kitten.png\")';progresso=3;"
        }, {
    condition: "progresso==3&&!q[0]",
    option: "Ho trovato un bug, lo togli?",
    text: "è una feature non ti preoccupare",
    trigger: "q[0]=1;"
        }, {
    condition: "progresso==3&&!q[1]",
    option: "quando provo a importare non succede nulla",
    text: "Vuol dire che c'è stato un errore di lettura, o di impostazione delle condizioni/trigger, premi ctrl-maiusc-i e vai sulla console per rendermi conto dei dettagli degli errori",
    trigger: "q[1]=1;"
        }, {
    condition: "progresso==3&&!q[2]",
    option: "Come hai fatto a fare sta roba?",
    text: "Come ho detto prima, ho istanziato le variabili da una condizione, le operazioni dentro gli 'if' vengono eseguite a priori, se ti capita qualche cosa che non capisci sentimi su <a href='https://web.whatsapp.com/'>whatsapp</a>",
    trigger: "q[2]=1;"
        }, {
    condition: "musica==1",
    option: "TOGLI STA MERDA DI MUSICA",
    text: "Va bene calmati cristoooo",
    trigger: "musica=0;dropit.pause();"
}, {
    condition: "q[0]&&q[1]&&q[2]",
    option: "E mo?",
    text: "",
    trigger: "alert('Hai fatto abbastanza domande, alla prossima!');if(!dropit.paused){dropit.pause()};new Audio('https://saantonandre.github.io/tbc.mp3').play();id('tester').style.display='none';"
}]
