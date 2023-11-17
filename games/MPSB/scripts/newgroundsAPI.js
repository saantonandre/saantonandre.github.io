//* ngapi
var ngio = new Newgrounds.io.core(
    "51676:Vqa2XYm4",
    "cyoxT14y02Olrp9v7JcJDw==");

/* vars to record any medals and scoreboards that get loaded */
var medals, scoreboards;



/* handle loaded scores */
function onScoreboardsLoaded(result) {
    if (result.success) {
        scoreboards = result.scoreboards;
    }
}
/* handle loaded medals */
function onMedalsLoaded(result) {
    if (result.success) {
        medals = result.medals;
    }
}


/* load our medals and scoreboards from the server */
ngio.queueComponent("Medal.getList", {}, onMedalsLoaded);
ngio.queueComponent("ScoreBoard.getBoards", {}, onScoreboardsLoaded);
ngio.executeQueue();


ngio.debug = false;

function onLoggedIn() {

    //console.log("Welcome " + ngio.user.name + "!");
}

function onLoginFailed() {

    //console.log("There was a problem logging in: " . ngio.login_error.message );
}

function onLoginCancelled() {

    //console.log("The user cancelled the login.");
}

function requestLogin() {
    ngio.requestLogin(onLoggedIn, onLoginFailed, onLoginCancelled);
    /* you should also draw a 'cancel login' buton here */
} /* You could use this function to draw the medal notification on-screen */
function onMedalUnlocked(medal) {
    for (let i = 0; i < achievements.medals.length; i++) {
        if (medal.name == achievements.medals[i].name) {
            achievements.start(achievements.medals[i]);
        }
    }
}

function unlockMedal(medal_name) {
    /* If there is no user attached to our ngio object, it means the user isn't logged in and we can't unlock anything */
    if (!ngio.user) return console.log("User not logged in");
    var medal;
    for (var i = 0; i < medals.length; i++) {
        medal = medals[i];
        /* look for a matching medal name */
        if (medal.name == medal_name) {
            /* we can skip unlocking a medal that's already been earned */
            if (!medal.unlocked) {

                /* unlock the medal from the server */
                ngio.callComponent('Medal.unlock', {
                    id: medal.id
                }, function (result) {
                    if (result.success) {
                        onMedalUnlocked(result.medal);
                    }
                });
            }
            return;
        }
    }

}

function initSession() {
    ngio.getValidSession(function () {
        if (ngio.user) {
            /* 
             * If we have a saved session, and it has not expired, 
             * we will also have a user object we can access.
             * We can go ahead and run our onLoggedIn handler here.
             */

            onLoggedIn();
        }
    });
}

initSession();
//*/
function postScore(board_name, score_value) {
    /* If there is no user attached to our ngio object, it means the user isn't logged in and we can't post anything */
    if (!ngio.user) {
        return;
    };
    
    var scoreboard;
    for (var i = 0; i < scoreboards.length; i++) {
        scoreboard = scoreboards[i];
        
        /* look for a matching scoreboard name */
        if (scoreboard.name == board_name) {
            
            /* post the score to the server */
            ngio.callComponent('ScoreBoard.postScore', {
                id: scoreboard.id,
                value: score_value
            });
            return;
        }
    }
}

//postScore('test scores', 89079);
