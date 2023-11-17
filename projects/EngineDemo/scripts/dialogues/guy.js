var guy = {
    musica: 0,
    progresso: 0,
    demo: 0,
    q: [false, false, false],
    dialogue: [{
        condition: "guy.progresso==0",
        option: "Dimostrazione",
        text: "Benvenuto alla demo del tester, prova a farmi qualche domanda",
        trigger: "guy.progresso=1;"
        }, {
        condition: "guy.progresso==1",
        option: "(scazzato) Cosa puoi fare? ",
        text: "Praticamente.. tutto! Il limite è la tua fantasia e la tua logica.",
        trigger: "guy.progresso=3;"
        }, {
        condition: "guy.progresso==1",
        option: "(gentile) Cosa puoi fare?",
        text: "Il trigger, come puoi notare, può anche lanciare eventi di qualsiasi tipo, come ad esempio riprodurre una canzone",
        trigger: "dropit= new Audio('https://saantonandre.github.io/dropit.mp3'); dropit.play(); guy.musica=1; guy.progresso=3;"
        }, {
        condition: "guy.progresso==3&&!guy.q[0]",
        option: "Ho trovato un bug, lo togli?",
        text: "è una feature non ti preoccupare",
        trigger: "guy.q[0]=1;"
        }, {
        condition: "guy.progresso==3&&!guy.q[1]",
        option: "quando provo a importare non succede nulla",
        text: "Vuol dire che c'è stato un errore di lettura, o di impostazione delle condizioni/trigger, premi ctrl-maiusc-i e vai sulla console per rendermi conto dei dettagli degli errori",
        trigger: "guy.q[1]=1;"
        }, {
        condition: "guy.progresso==3&&!guy.q[2]",
        option: "Come hai fatto a fare sta roba?",
        text: "Come ho detto prima, ho istanziato le variabili da una condizione, le operazioni dentro gli 'if' vengono eseguite a priori, se ti capita qualche cosa che non capisci sentimi su <a href='https://web.whatsapp.com/'>whatsapp</a>",
        trigger: "guy.q[2]=1;"
        }, {
        condition: "guy.musica==1",
        option: "TOGLI STA MERDA DI MUSICA",
        text: "Va bene calmati cristoooo",
        trigger: "guy.musica=0;dropit.pause();"
}, {
        condition: "guy.q[0]&&guy.q[1]&&guy.q[2]",
        option: "E mo?",
        text: "Hai fatto abbastanza domande, alla prossima!",
        trigger: "if(typeof dropit !=='undefined'){if(!dropit.paused){dropit.pause()}};new Audio('https://saantonandre.github.io/tbc.mp3').play();"
}]

}
