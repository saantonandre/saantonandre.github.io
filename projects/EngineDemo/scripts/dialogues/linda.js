var linda = {
    prg: 0,
    f: false,
    dialogue: [{
        condition: "linda.prg==0;",
        option: "START",
        text: "Goodmorning, peregrin. I'm Linda, the Elder's daughter.;If you need anything, just ask.",
        trigger: "linda.prg=1;"
}, {
        condition: "linda.prg == 1&&linda.f==false;",
        option: "Morning, I'm []. Now that you mention it… is it me or this village is kind of odd?",
        text: "Pretty odd, right? It's because of the curse. Don't think about it.",
        trigger: "linda.prg = 2;"
}, {
        condition: "linda.prg == 1;",
        option: "Don't worry, I don't need anything. [leave]",
        text: "",
        trigger: ""
}, {
        condition: "linda.prg == 1&&linda.f==false;",
        option: "Goodmorning. What's wrong with your father?",
        text: "My dad? What about him?",
        trigger: "linda.prg = 8;"
}, {
        condition: "linda.prg == 2;",
        option: "Alright.",
        text: "Thank you. Anyways, did you hear about what Kara, the laundress, has done?",
        trigger: "linda.prg = 4;"
}, {
        condition: "linda.prg == 2;",
        option: "I do think about it. What's the curse?",
        text: "It's a long story, but in short it's the reason why everyone here keeps on gossiping.;Please don't judge us.",
        trigger: "linda.prg = 3;"
}, {
        condition: "linda.prg == 3;",
        option: "Are you going to gossip too?",
        text: "Obviously. Did you hear about what Kara, the laundress, has done?",
        trigger: "linda.prg = 4;"
}, {
        condition: "linda.prg == 3;",
        option: "Ok, I won't judge.",
        text: "Thank you. Anyways, did you hear about what Kara, the laundress, has done?",
        trigger: "linda.prg = 4;"
}, {
        condition: "linda.prg == 4;",
        option: "You tell me.",
        text: "She used to be a dear friend of mine, but…;She fucked my lover! AHAHAH…ahah…",
        trigger: "linda.prg = 9;"
}, {
        condition: "linda.prg == 4;",
        option: "I don't want to hear about that.",
        text: "You're rough, you know?",
        trigger: "linda.prg = 5;"
}, {
        condition: "linda.prg == 5;",
        option: "I don't care. [leave]",
        text: "",
        trigger: ""
}, {
        condition: "linda.prg == 5;",
        option: "I won't participate in this gossip thing unless you tell me what's going on.",
        text: "Fine, you want to know about it? Go see the priest. It will serve you well, too.",
        trigger: "linda.prg = 6;"
}, {
        condition: "linda.prg == 6;",
        option: "Alright, will do. Bye.",
        text: "",
        trigger: ""
}, {
        condition: "linda.prg == 6;",
        option: "Where do I find him?",
        text: "In the church, duh.",
        trigger: "linda.prg = 7;"
}, {
        condition: "linda.prg == 8;",
        option: "He tried to tell me something about you.",
        text: "Uhhhhhhhhhhmmm...;I wonder what! I hope it was something positive.;Anyway, can I help you with something?",
        trigger: "linda.prg=1;linda.f=true;"
}, {
        condition: "linda.prg == 8;",
        option: "He doesn't look much lucid.",
        text: "Oh! Ahahah... he's just like that, don't worry about it.;Anyway, can I help you with something?",
        trigger: "linda.prg=1;linda.f=true;"
}, {
        condition: "linda.prg == 8;",
        option: "Nevermind.",
        text: "Alriiiight. Can I help you with something?",
        trigger: "linda.prg=1;linda.f=true;"
}, {
        condition: "linda.prg == 1&&linda.f==true;",
        option: "Yes. is it me or this village is kind of odd?",
        text: "Pretty odd, right? It's because of the curse. Don't think about it.",
        trigger: "linda.prg=2;"
}, {
        condition: "linda.prg == 9;",
        option: "The more you know I guess. See you later.",
        text: "",
        trigger: ""
}, {
        condition: "linda.prg == 9;",
        option: "Sucks for you. Bye.",
        text: "",
        trigger: ""
}]
}
