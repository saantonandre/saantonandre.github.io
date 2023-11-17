var elder = {
    prog: -1,
    q: [false, false, false],
    dialogue: [{
        condition: "elder.prog == -1;",
        option: "Dialogue start",
        text: "Oh, you've woken up! Goodmorning, how're you feeling today?",
        trigger: "elder.prog = 0;"
    }, {
        condition: "elder.prog == 0;",
        option: "I'm good, but... where am I?",
        text: "You're in my house, kiddo.;I've found you last night outside the village, during the storm...;Oh, I forgot to introduce myself. I'm the Elder of this village. And you are...?",
        trigger: "elder.prog = 1;"
    }, {
        condition: "elder.prog == 1;",
        option: "I'm just a traveller.",
        text: "I see... and what's your name?",
        trigger: "elder.prog = 2;"
    }, {
        condition: "elder.prog == 2;",
        option: "It's -pgname-.",
        text: "Nice to meet you, -pgname-. I have an important matter to discuss with you... Have you seen someone coming here?;A young man more or less of your age.",
        trigger: "elder.prog = 3;"
    }, {
        condition: "elder.prog == 2;",
        option: "It's not important.",
        text: "Whatever, -pgname-. I have an important matter to discuss with you... Have you seen someone coming here? A young man more or less of your age.",
        trigger: "elder.prog = 3;"
    }, {
        condition: "elder.prog == 3;",
        option: "Sorry, I haven't.",
        text: "Very bad! He's my son, I'm very worried about him... Where could he be? (...) YOU! YOU MUST KNOW SOMETHING FOR SURE!",
        trigger: "elder.prog = 4;"
    }, {
        condition: "elder.prog == 3;",
        option: "I don't remember...",
        text: "Very bad! He's my son, I'm very worried about him... Where could he be? (...) YOU! YOU MUST KNOW SOMETHING FOR SURE!",
        trigger: "elder.prog = 4;"
    }, {
        condition: "elder.prog == 4;",
        option: "I swear I don't.",
        text: "Okay, okay. You're a detective, right? You know I'm OBLIGATED to suspect of you. If you're not the culprit of my son's disappearing you must find out who is! You won't leave this place until you bring me that BASTARD!!! Understood?",
        trigger: "elder.prog = 5;"
    }, {
        condition: "elder.prog == 5;",
        option: "Yes.",
        text: "Ha ha ha... Perfect. Now it's time for the Mass. I'll meet you there.",
        trigger: ""
    }, {
        condition: "elder.prog == 5;",
        option: "Calm down, grandpa.",
        text: "Show some RESPECT you bastard! Ha ha ha... See you at the Mass.",
        trigger: ""
    }, {
        condition: "elder.prog == 0;",
        option: "Who are you?",
        text: "I'm the Elder of the village, I'm the one who saved you last night. And who might you be, kiddo?",
        trigger: "elder.prog = 1;"
    }, {
        condition: "elder.prog == 1;",
        option: "I'm detective -pgname-.",
        text: "Nice to meet you, -pgname-. I have an important matter to discuss with you... Have you seen someone coming here? A young man more or less of your age.",
        trigger: "elder.prog = 3;"
    }]

}
